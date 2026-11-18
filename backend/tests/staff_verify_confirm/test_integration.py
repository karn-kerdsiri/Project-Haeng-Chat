import pytest

from app.staff_verify_confirm import (
    DataNotReadyError,
    VerificationCalculationError,
    VerificationPersistenceError,
    execute_uc16_confirmation,
    run_uc16_verification_transaction,
)


def test_execute_uc16_confirmation_records_status_after_success():
    request = {
        "request_id": "REQ-88",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": True},
    }

    def calculate(req):
        return {"summary": "passed", "request_id": req["request_id"]}

    def persist(req, status):
        req["status"] = status

    result = execute_uc16_confirmation(request, calculate_result=calculate, persist_status=persist)

    assert request["status"] == "ยืนยันแล้ว"
    assert result["status_after"] == "ยืนยันแล้ว"
    assert result["transaction_committed"] is True


def test_run_uc16_verification_transaction_rolls_back_if_calculation_fails():
    request = {
        "request_id": "REQ-89",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": True},
    }

    def calculate(req):
        raise RuntimeError("UC-16 failed")

    def persist(req, status):
        req["status"] = status

    with pytest.raises(VerificationCalculationError, match="การคำนวณผล"):
        run_uc16_verification_transaction(request, calculate_result=calculate, persist_status=persist)

    assert request["status"] == "รอตรวจสอบ"


def test_run_uc16_verification_transaction_rolls_back_if_save_fails():
    request = {
        "request_id": "REQ-90",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": True},
    }

    def calculate(req):
        return {"summary": "passed"}

    def persist(req, status):
        raise RuntimeError("db save failure")

    with pytest.raises(VerificationPersistenceError, match="บันทึกสถานะ"):
        run_uc16_verification_transaction(request, calculate_result=calculate, persist_status=persist)

    assert request["status"] == "รอตรวจสอบ"


def test_run_uc16_verification_transaction_rejects_not_ready_request():
    request = {
        "request_id": "REQ-91",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": False,
        "academic_records": [],
        "documents": [],
    }

    def calculate(req):
        return {"summary": "not used"}

    def persist(req, status):
        req["status"] = status

    with pytest.raises(DataNotReadyError, match="ข้อมูลยังไม่พร้อม"):
        run_uc16_verification_transaction(request, calculate_result=calculate, persist_status=persist)
