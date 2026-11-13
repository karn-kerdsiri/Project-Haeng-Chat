import pytest

from app.submit_additional_grades.validation import (
    ALLOWED_GRADES,
    grade_changed,
    validate_grade_entry,
)


def _entry(**overrides):
    values = {
        "academic_year": "2568",
        "semester": "1",
        "course_code": "CS101",
        "grade": "B",
    }
    values.update(overrides)
    return values


def test_DR_ADD_01_requires_all_entry_fields():
    required_fields = ("academic_year", "semester", "course_code", "grade")

    for field in required_fields:
        for empty_value in (None, "", " "):
            entry = _entry()
            entry[field] = empty_value

            issues = validate_grade_entry(entry, {"CS101"})

            assert [(issue.field, issue.requirement_id) for issue in issues] == [
                (field, "DR-ADD-01")
            ]

        entry = _entry()
        del entry[field]

        issues = validate_grade_entry(entry, {"CS101"})

        assert [(issue.field, issue.requirement_id) for issue in issues] == [
            (field, "DR-ADD-01")
        ]


def test_DR_ADD_02_accepts_only_the_specified_grades():
    for grade in ALLOWED_GRADES:
        assert validate_grade_entry(_entry(grade=grade), {"CS101"}) == []


def test_AC_ADD_04_rejects_an_invalid_grade_with_a_thai_field_error():
    issues = validate_grade_entry(_entry(grade="A-"), {"CS101"})

    assert len(issues) == 1
    assert issues[0].field == "grade"
    assert issues[0].requirement_id == "DR-ADD-02"
    assert issues[0].message == "เกรดไม่ถูกต้อง"


def test_DR_ADD_04_rejects_a_course_not_in_the_master_list():
    issues = validate_grade_entry(_entry(course_code="CUSTOM"), {"CS101"})

    assert len(issues) == 1
    assert issues[0].field == "course_code"
    assert issues[0].requirement_id == "DR-ADD-04"


def test_DR_ADD_05_rejects_a_duplicate_course_year_and_semester():
    existing = _entry(grade="I")

    issues = validate_grade_entry(
        _entry(grade="B"),
        {"CS101"},
        existing_entries_for_same_academic_record=[existing],
    )

    assert len(issues) == 1
    assert issues[0].field == "course_code"
    assert issues[0].requirement_id == "DR-ADD-05"


@pytest.mark.parametrize(
    "change",
    [
        {"course_code": "CS102"},
        {"academic_year": "2569"},
        {"semester": "2"},
    ],
)
def test_DR_ADD_05_allows_a_different_course_term_key(change):
    existing = _entry()

    issues = validate_grade_entry(
        _entry(**change),
        {"CS101", "CS102"},
        existing_entries_for_same_academic_record=[existing],
    )

    assert issues == []


def test_DR_ADD_06_detects_only_actual_grade_changes():
    assert grade_changed("I", "B") is True
    assert grade_changed("B", "B") is False
