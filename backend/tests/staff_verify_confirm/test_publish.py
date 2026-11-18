import pytest

from app.staff_verify_confirm import (
    PublishEligibilityError,
    build_publish_list,
    is_publish_ready,
    mark_request_publish_ready,
)


def test_confirmed_requests_are_ready_for_publish():
    request = {"request_id": "REQ-1", "status": "ยืนยันแล้ว"}
    assert is_publish_ready(request) is True

    request_2 = {"request_id": "REQ-2", "status": "pending", "decision": "confirmed"}
    assert is_publish_ready(request_2) is True

    request_3 = {"request_id": "REQ-3", "status": "รอตรวจสอบ"}
    assert is_publish_ready(request_3) is False


def test_publish_list_only_contains_confirmed_requests():
    requests = [
        {"request_id": "REQ-1", "status": "ยืนยันแล้ว"},
        {"request_id": "REQ-2", "status": "รอตรวจสอบ"},
        {"request_id": "REQ-3", "status": "approved"},
    ]

    publish_list = build_publish_list(requests)

    assert [item["request_id"] for item in publish_list] == ["REQ-1", "REQ-3"]


def test_mark_request_publish_ready_requires_confirmed_state():
    request = {"request_id": "REQ-2", "status": "รอตรวจสอบ"}

    with pytest.raises(PublishEligibilityError, match="ไม่พร้อม"):
        mark_request_publish_ready(request)

    ready = {"request_id": "REQ-9", "status": "ยืนยันแล้ว"}
    payload = mark_request_publish_ready(ready)

    assert payload["publish_ready"] is True
    assert payload["decision"] == "confirmed"
