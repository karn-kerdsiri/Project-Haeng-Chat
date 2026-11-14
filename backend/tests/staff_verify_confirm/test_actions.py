import pytest

from app.staff_verify_confirm import (
    VerificationActionError,
    confirm_request,
    record_history_action,
    return_request_for_correction,
)


def test_confirm_request_payload_records_confirmation_details():
    request = {"request_id": "REQ-77", "status": "รอตรวจสอบ"}

    payload = confirm_request(request, actor="staff-01", calculation_result={"summary": "pass"})

    assert payload["action"] == "confirm"
    assert payload["status_before"] == "รอตรวจสอบ"
    assert payload["status_after"] == "ยืนยันแล้ว"
    assert payload["calculation_result"]["summary"] == "pass"


def test_return_request_for_correction_requires_reason_and_reports_status_change():
    request = {"request_id": "REQ-88", "status": "รอตรวจสอบ", "eligibility_result": {"passed": False}}

    payload = return_request_for_correction(
        request,
        reason="เอกสารไม่ครบ กรุณาแนบใบรายงานผลการศึกษา",
        actor="staff-02",
    )

    assert payload["action"] == "return_for_correction"
    assert payload["status_after"] == "รอการแก้ไข"
    assert "เอกสารไม่ครบ" in payload["reason"]

    with pytest.raises(VerificationActionError, match="ต้องระบุเหตุผล"):
        return_request_for_correction(request, reason="   ")


def test_record_history_action_captures_actor_previous_and_new_status():
    request = {"request_id": "REQ-99", "status": "รอตรวจสอบ", "updated_at": "2026-11-14T07:00:00Z"}

    payload = record_history_action(
        request,
        actor="staff-03",
        previous_status="รอตรวจสอบ",
        new_status="ยืนยันแล้ว",
        action="confirm",
        reason=None,
    )

    assert payload["previous_status"] == "รอตรวจสอบ"
    assert payload["new_status"] == "ยืนยันแล้ว"
    assert payload["actor"] == "staff-03"
