from app.staff_verify_confirm import (
    MIN_MOBILE_WIDTH_PX,
    build_thai_error_message,
    get_mobile_viewport_policy,
    supports_mobile_viewport,
)


def test_error_message_is_in_thai_and_names_the_fix():
    message = build_thai_error_message(
        "เอกสารไม่ครบ",
        field="เอกสารแนบ",
        fix_hint="แนบเอกสารที่ต้องการก่อนยืนยัน",
    )

    assert "ข้อมูลเอกสารแนบไม่พร้อมใช้งาน" in message
    assert "กรุณาแนบเอกสารที่ต้องการก่อนยืนยัน" in message


def test_mobile_viewport_policy_uses_the_spec_width_and_disallows_horizontal_scroll():
    policy = get_mobile_viewport_policy()

    assert policy.minimum_width_px == MIN_MOBILE_WIDTH_PX
    assert policy.allow_horizontal_scroll is False
    assert policy.is_supported(360) is True
    assert policy.is_supported(359) is False
    assert supports_mobile_viewport(360) is True
    assert supports_mobile_viewport(350) is False
