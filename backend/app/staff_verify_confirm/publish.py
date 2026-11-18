from __future__ import annotations

from collections.abc import Mapping
from typing import Any


class PublishEligibilityError(RuntimeError):
    """Raised when a confirmed request cannot be marked as ready for publishing."""


def is_publish_ready(request: Mapping[str, Any]) -> bool:
    """FR-VRF-12: a confirmed request is ready to be consumed by UC-14.

    The implementation intentionally keeps this generic because the exact status
    labels remain open in OQ-VRF-04, but the confirmed state is recognized only
    when the request is explicitly marked as confirmed or publish-ready.
    """
    status = str(request.get("status") or "").strip()
    decision = str(request.get("decision") or "").strip().lower()

    if decision in {"confirmed", "ready_for_publish", "publish_ready"}:
        return True

    confirmation_markers = {"ยืนยันแล้ว", "confirmed", "verified", "approved"}
    if status and status.lower() in {value.lower() for value in confirmation_markers}:
        return True

    return False


def build_publish_list(requests: list[Mapping[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            "request_id": request.get("request_id") or request.get("id"),
            "status": request.get("status"),
            "decision": request.get("decision"),
        }
        for request in requests
        if is_publish_ready(request)
    ]


def mark_request_publish_ready(request: Mapping[str, Any], *, decision: str = "confirmed") -> dict[str, Any]:
    payload = dict(request)
    if not is_publish_ready(request):
        raise PublishEligibilityError("คำร้องยังไม่พร้อมสำหรับ UC-14 เผยแพร่ผล")

    payload["decision"] = decision
    payload["publish_ready"] = True
    payload["status"] = payload.get("status") or "ยืนยันแล้ว"
    return payload
