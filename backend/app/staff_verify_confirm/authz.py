from __future__ import annotations

from collections.abc import Mapping
from typing import Any, Iterable


class UnauthorizedError(Exception):
    """Raised when a request is missing or invalid authentication."""


class ForbiddenError(Exception):
    """Raised when a valid user is not allowed to perform the action."""


class StaffVerificationAccessError(ForbiddenError):
    """Raised specifically when a staff member lacks verification privileges."""


def _as_mapping(session: Any) -> Mapping[str, Any]:
    if session is None:
        return {}
    if isinstance(session, Mapping):
        return session
    if hasattr(session, "__dict__"):
        return vars(session)
    return {}


def _as_set(value: Any) -> set[str]:
    if value is None:
        return set()
    if isinstance(value, str):
        return {value.strip().lower()}
    if isinstance(value, Iterable) and not isinstance(value, (bytes, bytearray)):
        return {str(item).strip().lower() for item in value if str(item).strip()}
    return {str(value).strip().lower()}


def _is_authenticated(session: Mapping[str, Any]) -> bool:
    if not session:
        return False
    for key in ("is_authenticated", "authenticated", "logged_in", "isLoggedIn"):
        value = session.get(key)
        if value is not None:
            return bool(value)
    return bool(session.get("user_id") or session.get("userId") or session.get("account_id"))


def _has_university_account(session: Mapping[str, Any]) -> bool:
    for key in ("account_type", "accountType", "institution", "domain"):
        value = session.get(key)
        if isinstance(value, str) and value.strip().lower() in {"university", "campus", "staff", "employee"}:
            return True
        if value is True:
            return True
    return str(session.get("email", "")).lower().endswith("@university.ac.th") or str(session.get("email", "")).lower().endswith("@uni.ac.th")


def _roles(session: Mapping[str, Any]) -> set[str]:
    values: set[str] = set()
    for key in ("role", "roles", "user_role", "userRoles", "permissions", "permission"):
        values |= _as_set(session.get(key))
    if session.get("is_staff") is True:
        values.add("staff")
    if session.get("can_verify") is True:
        values.add("staff_verify")
    if session.get("can_staff_verify") is True:
        values.add("staff_verify")
    return {role.lower().strip() for role in values if role and role.strip()}


def can_staff_verify(session: Any) -> bool:
    mapped = _as_mapping(session)
    if not _is_authenticated(mapped):
        return False
    if not _has_university_account(mapped):
        return False

    allowed = {
        "staff",
        "verification_staff",
        "staff_verifier",
        "staff_verify",
        "verify_requests",
        "verify_requests_staff",
        "verification",
    }
    roles = _roles(mapped)
    return bool(roles & allowed)


def require_staff_verification_access(session: Any):
    mapped = _as_mapping(session)

    if not _is_authenticated(mapped):
        raise UnauthorizedError("กรุณาเข้าสู่ระบบก่อนใช้งานฟีเจอร์นี้")
    if not _has_university_account(mapped):
        raise UnauthorizedError("บัญชีผู้ใช้ต้องเป็นบัญชีมหาวิทยาลัย")
    if not can_staff_verify(mapped):
        raise StaffVerificationAccessError("เฉพาะเจ้าหน้าที่ที่มีสิทธิ์ตรวจสอบเท่านั้น")
    return mapped


def require_staff_verifier(session: Any):
    return require_staff_verification_access(session)
