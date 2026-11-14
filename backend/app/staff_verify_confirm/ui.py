from __future__ import annotations

from dataclasses import dataclass
from typing import Any


MIN_MOBILE_WIDTH_PX = 360


@dataclass(frozen=True)
class ResponsiveViewport:
    minimum_width_px: int = MIN_MOBILE_WIDTH_PX
    allow_horizontal_scroll: bool = False
    requirement_id: str = "NFR-VRF-06"

    def is_supported(self, width_px: int) -> bool:
        return width_px >= self.minimum_width_px


def build_thai_error_message(
    issue: str,
    *,
    field: str | None = None,
    fix_hint: str | None = None,
) -> str:
    """Format a Thai user-facing error message that explains the issue and the required fix."""
    normalized_issue = str(issue).strip()
    if not normalized_issue:
        normalized_issue = "เกิดข้อผิดพลาด"

    if field:
        field_text = str(field).strip()
        message = f"ข้อมูล{field_text}ไม่พร้อมใช้งาน: {normalized_issue}"
    else:
        message = f"เกิดข้อผิดพลาด: {normalized_issue}"

    if fix_hint:
        hint = str(fix_hint).strip()
        if hint:
            message = f"{message} กรุณา{hint}"
    else:
        message = f"{message} กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง"

    return message


def get_mobile_viewport_policy() -> ResponsiveViewport:
    return ResponsiveViewport(
        minimum_width_px=MIN_MOBILE_WIDTH_PX,
        allow_horizontal_scroll=False,
        requirement_id="NFR-VRF-06",
    )


def supports_mobile_viewport(width_px: int | None) -> bool:
    if width_px is None:
        return True
    return get_mobile_viewport_policy().is_supported(int(width_px))
