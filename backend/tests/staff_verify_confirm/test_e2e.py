import pytest

from app.staff_verify_confirm import (
    DataNotReadyError,
    build_history_entry,
    build_publish_list,
    confirm_request,
    confirm_verification_request,
    execute_uc16_confirmation,
    filter_verification_requests,
    get_request_history,
    is_publish_ready,
    require_staff_verification_access,
    return_request_for_correction,
)
from app.staff_verify_confirm.authz import StaffVerificationAccessError


def test_AC_VRF_01_AC_VRF_05_AC_VRF_08_confirm_flow_rolls_back_and_publish_ready():
    request = {
        "request_id": "REQ-AC-01",
        "student_id": "651234567",
        "student_name": "สมใจ รักเรียน",
        "advisor_group": "CS-01",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": True},
    }

    def calculate(req):
        return {"summary": "pass"}

    def persist(req, status):
        req["status"] = status

    result = execute_uc16_confirmation(request, calculate_result=calculate, persist_status=persist)
    assert result["status_after"] == "ยืนยันแล้ว"
    assert request["status"] == "ยืนยันแล้ว"
    assert is_publish_ready(request) is True
    assert build_publish_list([request]) == [{"request_id": "REQ-AC-01", "status": "ยืนยันแล้ว", "decision": None}]

    failing_request = dict(request)

    def fail_calculate(req):
        raise RuntimeError("UC-16 failed")

    with pytest.raises(RuntimeError):
        execute_uc16_confirmation(failing_request, calculate_result=fail_calculate, persist_status=persist)
    assert failing_request["status"] == "ยืนยันแล้ว"


def test_AC_VRF_02_search_filters_requests_by_student_id_name_or_group():
    requests = [
        {"request_id": "REQ-A", "student_id": "651234567", "student_name": "สมใจ รักเรียน", "advisor_group": "CS-01", "status": "รอตรวจสอบ"},
        {"request_id": "REQ-B", "student_id": "651234568", "student_name": "โสภา ใจดี", "advisor_group": "IT-02", "status": "รอตรวจสอบ"},
        {"request_id": "REQ-C", "student_id": "651234569", "student_name": "นภา ปลื้มใจ", "advisor_group": "CS-03", "status": "approved"},
    ]

    assert [item["request_id"] for item in filter_verification_requests(requests, "651234568")] == ["REQ-B"]
    assert [item["request_id"] for item in filter_verification_requests(requests, "โสภา")] == ["REQ-B"]
    assert [item["request_id"] for item in filter_verification_requests(requests, "CS-01")] == ["REQ-A"]


def test_AC_VRF_03_Return_for_correction_records_reason_and_status():
    request = {
        "request_id": "REQ-AC-03",
        "status": "รอตรวจสอบ",
        "eligibility_result": {"passed": False},
    }

    payload = return_request_for_correction(
        request,
        reason="เอกสารไม่ครบ กรุณาแนบใบแสดงผลการศึกษา",
        actor="staff-02",
    )

    assert payload["status_after"] == "รอการแก้ไข"
    assert "เอกสารไม่ครบ" in payload["reason"]


def test_AC_VRF_04_block_confirm_when_data_not_ready():
    not_ready_request = {
        "request_id": "REQ-AC-04",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": False,
        "academic_records": [],
        "documents": [],
    }

    with pytest.raises(DataNotReadyError, match="ข้อมูลยังไม่พร้อม"):
        confirm_verification_request(
            not_ready_request,
            calculation_result={"summary": "ignored"},
            actor="staff-99",
        )


def test_AC_VRF_06_forbidden_for_non_staff_user():
    session = {"is_authenticated": True, "account_type": "university", "role": "student"}

    with pytest.raises(StaffVerificationAccessError, match="เฉพาะเจ้าหน้าที่"):
        require_staff_verification_access(session)


def test_AC_VRF_07_history_lists_actions_with_actor_time_and_statuses():
    request = {"request_id": "REQ-AC-07", "status": "รอตรวจสอบ"}
    history = [
        build_history_entry(
            request=request,
            actor="staff-1",
            action="confirm",
            previous_status="รอตรวจสอบ",
            new_status="ยืนยันแล้ว",
            timestamp="2026-11-14T07:00:00Z",
        ).to_dict(),
        build_history_entry(
            request=request,
            actor="staff-1",
            action="return_for_correction",
            previous_status="ยืนยันแล้ว",
            new_status="รอการแก้ไข",
            timestamp="2026-11-14T08:00:00Z",
            reason="เอกสารไม่ครบ",
        ).to_dict(),
    ]

    entries = get_request_history(request, history)
    assert len(entries) == 2
    assert entries[0]["actor"] == "staff-1"
    assert entries[0]["previous_status"] == "รอตรวจสอบ"
    assert entries[1]["new_status"] == "รอการแก้ไข"


def test_AC_VRF_01_and_AC_VRF_08_confirmed_request_ready_for_publish_after_action():
    request = {
        "request_id": "REQ-AC-08",
        "status": "รอตรวจสอบ",
        "ready_for_review_flag": True,
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf"}],
        "eligibility_result": {"passed": True},
    }

    payload = confirm_request(request, actor="staff-01", calculation_result={"summary": "pass"})
    request["status"] = payload["status_after"]
    request["decision"] = payload["decision"]

    assert payload["status_after"] == "ยืนยันแล้ว"
    assert is_publish_ready(request) is True
    assert build_publish_list([request])[0]["request_id"] == "REQ-AC-08"
