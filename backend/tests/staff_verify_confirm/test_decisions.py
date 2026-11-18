import pytest

from app.staff_verify_confirm import (
    DataNotReadyError,
    confirm_verification_request,
    ensure_request_ready_for_review,
    is_request_ready_for_review,
    return_for_correction,
)


def test_request_is_ready_only_when_required_data_exists():
    ready_request = {
        "request_id": "REQ-100",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": True},
    }

    assert is_request_ready_for_review(ready_request) is True
    ensure_request_ready_for_review(ready_request)

    not_ready_request = dict(ready_request)
    not_ready_request["ready_for_review_flag"] = False
    assert is_request_ready_for_review(not_ready_request) is False

    missing_detail_request = dict(ready_request)
    missing_detail_request["documents"] = []
    with pytest.raises(DataNotReadyError, match="ข้อมูลยังไม่พร้อม"):
        ensure_request_ready_for_review(missing_detail_request)


def test_confirm_verification_request_rejects_not_ready_and_records_success_for_ready_requests():
    ready_request = {
        "request_id": "REQ-200",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": True},
    }

    result = confirm_verification_request(
        ready_request,
        calculation_result={"summary": "pass"},
        actor="staff-01",
    )

    assert result["decision"] == "confirm"
    assert result["status_after"] == "ยืนยันแล้ว"
    assert result["ready_for_review"] is True

    not_ready_request = dict(ready_request)
    not_ready_request["ready_for_review_flag"] = False
    with pytest.raises(DataNotReadyError, match="ข้อมูลยังไม่พร้อม"):
        confirm_verification_request(not_ready_request, actor="staff-01")


def test_return_for_correction_requires_a_reason_and_sets_status_after():
    request = {
        "request_id": "REQ-300",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": False},
    }

    result = return_for_correction(request, reason="เอกสารไม่ครบ กรุณาแนบใบแสดงผลการศึกษา", actor="staff-02")

    assert result["decision"] == "return_for_correction"
    assert result["status_after"] == "รอการแก้ไข"
    assert "เอกสารไม่ครบ" in result["reason"]

    with pytest.raises(ValueError, match="ต้องระบุเหตุผล"):
        return_for_correction(request, reason="   ")
