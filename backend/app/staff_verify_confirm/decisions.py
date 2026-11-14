from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any


class DataNotReadyError(ValueError):
    """Raised when a request is not ready for staff confirmation according to DR-VRF-04."""


class ConfirmationError(RuntimeError):
    """Raised when the verification action fails or the request is not ready."""


def _has_value(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    if isinstance(value, (list, tuple, set, dict, Sequence)) and not isinstance(value, (str, bytes, bytearray)):
        return len(value) > 0
    return True


def _get(mapping: Mapping[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in mapping and mapping[key] is not None:
            return mapping[key]
    return None


def is_request_ready_for_review(request: Mapping[str, Any]) -> bool:
    """Return True only when the request is ready for a staff confirm decision.

    This follows the generic rule in DR-VRF-04 and CON-VRF-03 without forcing a
    domain-specific definition that still needs OQ-VRF-02 to be answered.
    """
    ready_flag = _get(request, "ready_for_review_flag", "readyForReviewFlag", "ready_for_review", "is_ready_for_review")
    if ready_flag is not None and bool(ready_flag) is False:
        return False

    required_paths = (
        ("academic_records", "academicRecord", "academic_records_snapshot", "academic_records_snapshot", "records"),
        ("documents", "attachments", "files"),
        ("eligibility_result", "eligibilityCheckResult", "assessment_result"),
    )

    for path in required_paths:
        value = None
        for key in path:
            value = _get(request, key)
            if value is not None:
                break
        if not _has_value(value):
            return False

    return True


def ensure_request_ready_for_review(request: Mapping[str, Any]) -> None:
    if not is_request_ready_for_review(request):
        raise DataNotReadyError("ข้อมูลยังไม่พร้อมสำหรับยืนยัน กรุณาตรวจสอบข้อมูลและเอกสารก่อนยืนยัน")


def confirm_verification_request(
    request: Mapping[str, Any],
    *,
    calculation_result: Any = None,
    status: str = "ยืนยันแล้ว",
    actor: str | None = None,
) -> dict[str, Any]:
    """Validate and build a confirmation result for a staff verification action.

    This keeps the original status unchanged if the request is not ready and
    records only a successful confirmation payload when the request is valid.
    """
    ensure_request_ready_for_review(request)

    payload = {
        "request_id": _get(request, "request_id", "id", "requestId"),
        "status": status,
        "status_before": _get(request, "status", "request_status", "requestStatus"),
        "status_after": status,
        "actor": actor or "staff",
        "calculation_result": calculation_result,
        "decision": "confirm",
        "ready_for_review": True,
    }
    return payload


def return_for_correction(
    request: Mapping[str, Any],
    *,
    reason: str,
    status: str = "รอการแก้ไข",
    actor: str | None = None,
) -> dict[str, Any]:
    """Build the correction response when a staff member rejects a request.

    The reason must be present because DR-VRF-05 requires an explanation or list of
    required fixes before returning the request to the student.
    """
    if not reason or not str(reason).strip():
        raise ValueError("ต้องระบุเหตุผลหรือรายการที่ต้องแก้ไขก่อนส่งกลับให้แก้ไข")

    payload = {
        "request_id": _get(request, "request_id", "id", "requestId"),
        "status": status,
        "status_before": _get(request, "status", "request_status", "requestStatus"),
        "status_after": status,
        "actor": actor or "staff",
        "decision": "return_for_correction",
        "reason": str(reason).strip(),
    }
    return payload
