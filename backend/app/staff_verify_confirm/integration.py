from __future__ import annotations

from collections.abc import Callable, Mapping, MutableMapping
from dataclasses import dataclass, field
from typing import Any

from .decisions import DataNotReadyError, ensure_request_ready_for_review


class VerificationCalculationError(RuntimeError):
    """Raised when the UC-16 eligibility calculation fails."""


class VerificationPersistenceError(RuntimeError):
    """Raised when the verification status update fails after calculation."""


@dataclass
class VerificationTransaction:
    request: MutableMapping[str, Any]
    status_before: Any = None
    status_after: Any = None
    calculation_result: Any = None
    committed: bool = False
    _original_status: Any = field(init=False, repr=False)

    def __post_init__(self) -> None:
        self._original_status = self.request.get("status")
        self.status_before = self._original_status

    def apply_calculation(self, calculation_result: Any) -> None:
        self.calculation_result = calculation_result

    def save_status(self, new_status: Any) -> None:
        self.status_after = new_status
        self.request["status"] = new_status
        self.committed = True

    def rollback(self) -> None:
        self.request["status"] = self._original_status
        self.committed = False


def run_uc16_verification_transaction(
    request: MutableMapping[str, Any],
    *,
    calculate_result: Callable[[Mapping[str, Any]], Any],
    persist_status: Callable[[MutableMapping[str, Any], Any], Any],
    success_status: str = "ยืนยันแล้ว",
) -> dict[str, Any]:
    """Run the UC-16 calculation and status persistence in one logical transaction.

    The request's status is not changed until both steps succeed. If either the
    calculation or persistence step fails, the transaction rolls back to the
    original status and a descriptive error is raised.
    """
    ensure_request_ready_for_review(request)
    transaction = VerificationTransaction(request)

    try:
        result = calculate_result(request)
        transaction.apply_calculation(result)
        transaction.save_status(success_status)
        persist_status(request, success_status)
    except Exception as exc:
        transaction.rollback()
        if isinstance(exc, DataNotReadyError):
            raise
        if isinstance(exc, (VerificationCalculationError, VerificationPersistenceError)):
            raise
        if "persist" in str(exc).lower() or "save" in str(exc).lower():
            raise VerificationPersistenceError(
                "ไม่สามารถบันทึกสถานะคำร้องได้ กรุณาลองใหม่อีกครั้ง"
            ) from exc
        raise VerificationCalculationError(
            "การคำนวณผลตรวจสอบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
        ) from exc

    return {
        "request_id": request.get("request_id") or request.get("id"),
        "status_before": transaction.status_before,
        "status_after": transaction.status_after,
        "calculation_result": transaction.calculation_result,
        "transaction_committed": transaction.committed,
    }


def execute_uc16_confirmation(
    request: MutableMapping[str, Any],
    *,
    calculate_result: Callable[[Mapping[str, Any]], Any],
    persist_status: Callable[[MutableMapping[str, Any], Any], Any],
    success_status: str = "ยืนยันแล้ว",
) -> dict[str, Any]:
    return run_uc16_verification_transaction(
        request,
        calculate_result=calculate_result,
        persist_status=persist_status,
        success_status=success_status,
    )
