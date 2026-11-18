from app.staff_verify_confirm import (
    VerificationRequestSummary,
    build_verification_request_summary,
    filter_verification_requests,
    get_verification_request_detail,
    is_pending_verification_status,
    search_verification_requests,
)


def test_pending_status_is_detected_for_review_queue():
    assert is_pending_verification_status("รอตรวจสอบ") is True
    assert is_pending_verification_status("pending_verification") is True
    assert is_pending_verification_status("approved") is False


def test_build_verification_request_summary_extracts_required_fields():
    payload = {
        "request_id": "REQ-100",
        "student_id": "651234567",
        "student_name": "นางสาวสมใจ รักเรียน",
        "advisor_group": "CS-01",
        "status": "รอตรวจสอบ",
    }

    assert build_verification_request_summary(payload) == {
        "request_id": "REQ-100",
        "student_id": "651234567",
        "student_name": "นางสาวสมใจ รักเรียน",
        "advisor_group": "CS-01",
        "status": "รอตรวจสอบ",
    }


def test_filter_verification_requests_searches_by_student_id_name_and_group():
    requests = [
        {"request_id": "REQ-01", "student_id": "651234567", "student_name": "สมใจ รักเรียน", "advisor_group": "CS-01", "status": "รอตรวจสอบ"},
        {"request_id": "REQ-02", "student_id": "651234568", "student_name": "โสภา ใจดี", "advisor_group": "IT-02", "status": "รอตรวจสอบ"},
        {"request_id": "REQ-03", "student_id": "651234569", "student_name": "นภา ปลื้มใจ", "advisor_group": "CS-03", "status": "approved"},
    ]

    assert filter_verification_requests(requests, "651234568") == [
        {"request_id": "REQ-02", "student_id": "651234568", "student_name": "โสภา ใจดี", "advisor_group": "IT-02", "status": "รอตรวจสอบ"}
    ]
    assert filter_verification_requests(requests, "IT-02") == [
        {"request_id": "REQ-02", "student_id": "651234568", "student_name": "โสภา ใจดี", "advisor_group": "IT-02", "status": "รอตรวจสอบ"}
    ]
    assert search_verification_requests(requests, "โสภา") == [
        {"request_id": "REQ-02", "student_id": "651234568", "student_name": "โสภา ใจดี", "advisor_group": "IT-02", "status": "รอตรวจสอบ"}
    ]


def test_verification_request_detail_includes_academic_records_and_documents():
    request = {
        "request_id": "REQ-77",
        "student_id": "651234577",
        "student_name": "วีระชัย ทองดี",
        "advisor_group": "ME-01",
        "status": "pending_verification",
        "academic_records": [{"course_code": "CS101", "grade": "A"}],
        "documents": [{"name": "transcript.pdf", "type": "transcript"}],
    }

    detail = get_verification_request_detail(request)

    assert detail["student_id"] == "651234577"
    assert detail["academic_records"][0]["grade"] == "A"
    assert detail["documents"][0]["name"] == "transcript.pdf"


def test_verification_request_summary_supports_dataclass_input():
    item = VerificationRequestSummary(
        request_id="REQ-10",
        student_id="651010101",
        student_name="กัญญา หอมหวาน",
        advisor_group="MATH-05",
        status="pending",
    )

    assert item.matches_query("math") is True
    assert filter_verification_requests([item], "651010101") == [item.to_dict()]
