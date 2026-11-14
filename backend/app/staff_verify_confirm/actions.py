from __future__ import annotations

from collections.abc import Mapping
from typing import Any


class VerificationActionError(RuntimeError):
    """Raised when the confirm or return-for-correction action cannot proceed."""


def confirm_request(
    request: Mapping[str, Any],
    *,
    actor: str | None = None,
    calculation_result: Any = None,
    success_status: str = "ยืนยันแล้ว",
) -> dict[str, Any]:
    """Build the confirm action payload required by FR-VRF-06 and NFR-VRF-03.

    The exact official status labels remain open per OQ-VRF-04, so this function
    uses the spec's canonical labels already referenced in the acceptance criteria.
    """
    status_before = request.get("status")
    payload = {
        "request_id": request.get("request_id") or request.get("id"),
        "actor": actor or "staff",
        "action": "confirm",
        "status_before": status_before,
        "status_after": success_status,
        "calculation_result": calculation_result,
        "reason": None,
        "decision": "confirmed",
    }
    return payload


def return_request_for_correction(
    request: Mapping[str, Any],
    *,
    reason: str,
    actor: str | None = None,
    status: str = "รอการแก้ไข",
) -> dict[str, Any]:
    """Build the action payload for returning a request to the student with a reason."""
    rendered_reason = str(reason).strip()
    if not rendered_reason:
        raise VerificationActionError("ต้องระบุเหตุผลหรือรายการที่ต้องแก้ไขก่อนส่งกลับให้แก้ไข")

    payload = {
        "request_id": request.get("request_id") or request.get("id"),
        "actor": actor or "staff",
        "action": "return_for_correction",
        "status_before": request.get("status"),
        "status_after": status,
        "calculation_result": request.get("eligibility_result") or request.get("eligibilityCheckResult"),
        "reason": rendered_reason,
        "decision": "return_for_correction",
    }
    return payload


def record_history_action(
    request: Mapping[str, Any],
    *,
    actor: str | None = None,
    previous_status: Any = None,
    new_status: Any = None,
    action: str,
    reason: str | None = None,
) -> dict[str, Any]:
    payload = {
        "request_id": request.get("request_id") or request.get("id"),
        "actor": actor or "staff",
        "action": action,
        "previous_status": previous_status if previous_status is not None else request.get("status"),
        "new_status": new_status,
        "reason": reason,
        "timestamp": request.get("updated_at") or request.get("changed_at") or "now",
    }
    return payload
