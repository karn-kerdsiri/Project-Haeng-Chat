from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class VerificationHistoryEntry:
    request_id: str | None
    actor: str | None
    action: str
    previous_status: Any
    new_status: Any
    timestamp: Any
    reason: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "request_id": self.request_id,
            "actor": self.actor,
            "action": self.action,
            "previous_status": self.previous_status,
            "new_status": self.new_status,
            "timestamp": self.timestamp,
            "reason": self.reason,
        }


def build_history_entry(
    *,
    request: Mapping[str, Any],
    actor: str | None,
    action: str,
    previous_status: Any,
    new_status: Any,
    timestamp: Any = None,
    reason: str | None = None,
) -> VerificationHistoryEntry:
    return VerificationHistoryEntry(
        request_id=request.get("request_id") or request.get("id"),
        actor=actor,
        action=action,
        previous_status=previous_status,
        new_status=new_status,
        timestamp=timestamp or request.get("updated_at") or request.get("changed_at") or "now",
        reason=reason,
    )


def list_history(entries: Sequence[Mapping[str, Any] | VerificationHistoryEntry]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for entry in entries:
        if isinstance(entry, VerificationHistoryEntry):
            result.append(entry.to_dict())
            continue
        result.append(
            {
                "request_id": entry.get("request_id") or entry.get("id"),
                "actor": entry.get("actor"),
                "action": entry.get("action"),
                "previous_status": entry.get("previous_status"),
                "new_status": entry.get("new_status"),
                "timestamp": entry.get("timestamp") or entry.get("updated_at") or entry.get("changed_at") or "now",
                "reason": entry.get("reason"),
            }
        )
    return result


def get_request_history(request: Mapping[str, Any], history: Sequence[Mapping[str, Any] | VerificationHistoryEntry]) -> list[dict[str, Any]]:
    request_id = request.get("request_id") or request.get("id")
    return [
        item for item in list_history(history)
        if (item.get("request_id") or item.get("id")) == request_id
    ]
