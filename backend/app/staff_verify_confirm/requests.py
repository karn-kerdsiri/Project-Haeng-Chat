from __future__ import annotations

from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass
from typing import Any


_PENDING_STATUS_VALUES = {
    "pending",
    "pending_verification",
    "pending-review",
    "pending_review",
    "waiting_for_review",
    "waiting-for-review",
    "submitted",
    "submitted_for_review",
    "รอตรวจสอบ",
    "รอการตรวจสอบ",
    "ส่งเข้าตรวจสอบ",
    "review_pending",
}

_TERMINAL_STATUS_VALUES = {
    "approved",
    "rejected",
    "verified",
    "confirmed",
    "return_for_correction",
    "รอการแก้ไข",
    "ยืนยันแล้ว",
    "อนุมัติ",
    "ปฏิเสธ",
}


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip().lower()


def _first_present(mapping: Mapping[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in mapping and mapping[key] not in (None, ""):
            return mapping[key]
    return ""


@dataclass(frozen=True)
class VerificationRequestSummary:
    request_id: str | None = None
    student_id: str = ""
    student_name: str = ""
    advisor_group: str = ""
    status: str = ""

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> "VerificationRequestSummary":
        return cls(
            request_id=_first_present(data, "request_id", "id", "requestId"),
            student_id=_first_present(data, "student_id", "studentId", "student_code", "studentCode"),
            student_name=_first_present(data, "student_name", "studentName", "name", "full_name", "fullName"),
            advisor_group=_first_present(data, "advisor_group", "advisorGroup", "advisor_group_name", "group_name", "groupName"),
            status=_first_present(data, "status", "request_status", "requestStatus", "verification_status", "verificationStatus"),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "request_id": self.request_id,
            "student_id": self.student_id,
            "student_name": self.student_name,
            "advisor_group": self.advisor_group,
            "status": self.status,
        }

    def matches_query(self, query: str | None) -> bool:
        query_text = _normalize_text(query)
        if not query_text:
            return True
        searchable = " ".join(
            [
                str(self.student_id),
                str(self.student_name),
                str(self.advisor_group),
                str(self.request_id or ""),
            ]
        )
        return query_text in _normalize_text(searchable)


def is_pending_verification_status(status: Any) -> bool:
    value = _normalize_text(status)
    if not value:
        return True
    if value in _TERMINAL_STATUS_VALUES:
        return False
    return value in _PENDING_STATUS_VALUES or "pending" in value or "รอ" in value or "verify" in value


def build_verification_request_summary(request: Mapping[str, Any] | VerificationRequestSummary) -> dict[str, Any]:
    if isinstance(request, VerificationRequestSummary):
        return request.to_dict()
    return VerificationRequestSummary.from_mapping(request).to_dict()


def filter_verification_requests(
    requests: Sequence[Mapping[str, Any] | VerificationRequestSummary] | Iterable[Mapping[str, Any] | VerificationRequestSummary],
    query: str | None = None,
    *,
    pending_only: bool = True,
) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for request in requests:
        summary = build_verification_request_summary(request)
        status = summary.get("status")
        if pending_only and not is_pending_verification_status(status):
            continue
        if not VerificationRequestSummary.from_mapping(summary).matches_query(query):
            continue
        results.append(summary)
    return results


def search_verification_requests(
    requests: Sequence[Mapping[str, Any] | VerificationRequestSummary] | Iterable[Mapping[str, Any] | VerificationRequestSummary],
    query: str | None = None,
) -> list[dict[str, Any]]:
    return filter_verification_requests(requests, query, pending_only=True)


def get_verification_request_detail(request: Mapping[str, Any] | VerificationRequestSummary) -> dict[str, Any]:
    if isinstance(request, VerificationRequestSummary):
        data = request.to_dict()
    else:
        data = dict(request)

    summary = VerificationRequestSummary.from_mapping(data)
    detail = {
        "request_id": summary.request_id,
        "student_id": summary.student_id,
        "student_name": summary.student_name,
        "advisor_group": summary.advisor_group,
        "status": summary.status,
        "academic_records": data.get("academic_records") or data.get("academic_record") or data.get("records") or [],
        "documents": data.get("documents") or data.get("attachments") or data.get("files") or [],
        "eligibility_result": data.get("eligibility_result") or data.get("eligibilityCheckResult") or data.get("assessment_result"),
        "notes": data.get("notes") or data.get("comment") or data.get("remarks"),
    }
    return detail
