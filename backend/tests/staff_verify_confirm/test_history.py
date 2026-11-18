from app.staff_verify_confirm import (
    VerificationHistoryEntry,
    build_history_entry,
    get_request_history,
    list_history,
)


def test_history_entry_and_listing_include_actor_time_status_before_after():
    request = {"request_id": "REQ-4", "status": "รอตรวจสอบ"}

    entry = build_history_entry(
        request=request,
        actor="staff-1",
        action="confirm",
        previous_status="รอตรวจสอบ",
        new_status="ยืนยันแล้ว",
        timestamp="2026-11-14T07:00:00Z",
        reason=None,
    )

    assert isinstance(entry, VerificationHistoryEntry)
    assert entry.to_dict()["actor"] == "staff-1"
    assert entry.to_dict()["new_status"] == "ยืนยันแล้ว"

    history = [
        entry.to_dict(),
        {
            "request_id": "REQ-4",
            "actor": "staff-2",
            "action": "return_for_correction",
            "previous_status": "ยืนยันแล้ว",
            "new_status": "รอการแก้ไข",
            "timestamp": "2026-11-14T08:00:00Z",
            "reason": "เอกสารไม่ครบ",
        },
    ]

    assert list_history(history)[1]["reason"] == "เอกสารไม่ครบ"
    assert get_request_history(request, history)[0]["previous_status"] == "รอตรวจสอบ"
    assert len(get_request_history(request, history)) == 2
