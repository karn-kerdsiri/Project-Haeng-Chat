from dataclasses import dataclass
from typing import Collection, List, Mapping, Sequence


ALLOWED_GRADES = frozenset({"A", "B+", "B", "C+", "C", "D+", "D", "F", "W", "I", "T"})


@dataclass(frozen=True)
class ValidationIssue:
    field: str
    requirement_id: str
    message: str


_REQUIRED_FIELDS = {
    "academic_year": "กรุณาระบุปีการศึกษา",
    "semester": "กรุณาระบุภาคเรียน",
    "course_code": "กรุณาเลือกรายวิชา",
    "grade": "กรุณาระบุเกรด",
}


def _normalize_text(value: object) -> str | None:
    if value is None:
        return None
    if isinstance(value, str):
        normalized = value.strip()
        return normalized or None
    return str(value).strip() or None


def _is_missing(value: object) -> bool:
    return _normalize_text(value) is None


def _course_term_key(entry: Mapping[str, object]) -> tuple[str | None, str | None, str | None]:
    return (
        _normalize_text(entry.get("course_code")),
        _normalize_text(entry.get("academic_year")),
        _normalize_text(entry.get("semester")),
    )


def validate_grade_entry(
    entry: Mapping[str, object],
    available_course_codes: Collection[str],
    existing_entries_for_same_academic_record: Sequence[Mapping[str, object]] = (),
) -> List[ValidationIssue]:
    """Validate a new item; for grade edits, exclude the edited item from existing_entries."""
    issues: List[ValidationIssue] = []
    missing_fields = set()
    normalized_entry = {
        key: _normalize_text(value) if isinstance(value, str) else value
        for key, value in entry.items()
    }

    for field, message in _REQUIRED_FIELDS.items():
        if field not in normalized_entry or _is_missing(normalized_entry.get(field)):
            missing_fields.add(field)
            issues.append(ValidationIssue(field, "DR-ADD-01", message))

    course_code = _normalize_text(normalized_entry.get("course_code"))
    if "course_code" not in missing_fields and (
        not isinstance(course_code, str)
        or course_code not in {code.strip() for code in available_course_codes}
    ):
        issues.append(
            ValidationIssue(
                "course_code",
                "DR-ADD-04",
                "กรุณาเลือกรายวิชาจากรายการในระบบ",
            )
        )

    grade = _normalize_text(normalized_entry.get("grade"))
    if "grade" not in missing_fields and (
        not isinstance(grade, str) or grade not in ALLOWED_GRADES
    ):
        issues.append(ValidationIssue("grade", "DR-ADD-02", "เกรดไม่ถูกต้อง"))

    if not missing_fields and not any(
        issue.field in {"course_code", "grade"} for issue in issues
    ):
        candidate_key = _course_term_key(normalized_entry)
        has_duplicate = any(
            _course_term_key(existing) == candidate_key
            for existing in existing_entries_for_same_academic_record
        )
        if has_duplicate:
            issues.append(
                ValidationIssue(
                    "course_code",
                    "DR-ADD-05",
                    "มีผลการเรียนของรายวิชานี้ในปีการศึกษาและภาคเรียนนี้แล้ว",
                )
            )

    return issues


def grade_changed(previous_grade: object, new_grade: object) -> bool:
    previous = _normalize_text(previous_grade)
    new = _normalize_text(new_grade)
    return previous != new
