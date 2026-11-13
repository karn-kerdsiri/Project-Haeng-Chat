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


def _is_missing(value: object) -> bool:
    return value is None or (isinstance(value, str) and not value.strip())


def _course_term_key(entry: Mapping[str, object]) -> tuple:
    return entry["course_code"], entry["academic_year"], entry["semester"]


def validate_grade_entry(
    entry: Mapping[str, object],
    available_course_codes: Collection[str],
    existing_entries_for_same_academic_record: Sequence[Mapping[str, object]] = (),
) -> List[ValidationIssue]:
    """Validate a new item; for grade edits, exclude the edited item from existing_entries."""
    issues = []
    missing_fields = set()

    for field, message in _REQUIRED_FIELDS.items():
        if field not in entry or _is_missing(entry[field]):
            missing_fields.add(field)
            issues.append(ValidationIssue(field, "DR-ADD-01", message))

    course_code = entry.get("course_code")
    if "course_code" not in missing_fields and (
        not isinstance(course_code, str) or course_code not in available_course_codes
    ):
        issues.append(
            ValidationIssue(
                "course_code",
                "DR-ADD-04",
                "กรุณาเลือกรายวิชาจากรายการในระบบ",
            )
        )

    grade = entry.get("grade")
    if "grade" not in missing_fields and (
        not isinstance(grade, str) or grade not in ALLOWED_GRADES
    ):
        issues.append(ValidationIssue("grade", "DR-ADD-02", "เกรดไม่ถูกต้อง"))

    if not missing_fields and not any(
        issue.field in {"course_code", "grade"} for issue in issues
    ):
        candidate_key = _course_term_key(entry)
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
    return previous_grade != new_grade
