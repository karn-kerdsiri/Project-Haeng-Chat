import pytest

from app.staff_verify_confirm import (
    StaffVerificationAccessError,
    UnauthorizedError,
    can_staff_verify,
    require_staff_verification_access,
    require_staff_verifier,
)


@pytest.mark.parametrize(
    "session,expected",
    [
        ({"is_authenticated": True, "account_type": "university", "role": "staff"}, True),
        ({"is_authenticated": True, "account_type": "university", "role": "student"}, False),
        ({"is_authenticated": False, "account_type": "university", "role": "staff"}, False),
        ({"is_authenticated": True, "account_type": "personal", "role": "staff"}, False),
        ({"is_authenticated": True, "email": "staff@university.ac.th", "role": ["staff"]}, True),
    ],
)
def test_can_staff_verify(session, expected):
    assert can_staff_verify(session) is expected


def test_require_staff_verification_access_allows_authorized_staff():
    session = {"is_authenticated": True, "account_type": "university", "role": "staff"}

    assert require_staff_verification_access(session) == session
    assert require_staff_verifier(session) == session


def test_require_staff_verification_access_rejects_missing_session():
    with pytest.raises(UnauthorizedError, match="เข้าสู่ระบบ"):
        require_staff_verification_access(None)


def test_require_staff_verification_access_rejects_non_staff_users():
    session = {"is_authenticated": True, "account_type": "university", "role": "student"}

    with pytest.raises(StaffVerificationAccessError, match="เฉพาะเจ้าหน้าที่"):
        require_staff_verification_access(session)
