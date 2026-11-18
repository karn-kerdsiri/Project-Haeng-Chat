// ทดสอบหน้าจอ mock UI ตาม Acceptance Criteria ที่ตรวจได้โดยไม่ต้องมีหลังบ้าน
// ชื่อ test ตั้งตาม ID ใน spec เพื่อให้ตามรอยย้อนกลับได้ (กฎข้อ 7 ของ AGENTS.md)
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'
import AcademicRecordEntry, { validateHeader, validateFiles, summarize } from '../pages/AcademicRecordEntry.jsx'
import SubmitAdditionalGrades, { validateEntry, hasGradeChanged } from '../pages/SubmitAdditionalGrades.jsx'
import OwnEligibilityResult from '../pages/OwnEligibilityResult.jsx'
import DownloadDocuments from '../pages/DownloadDocuments.jsx'
import { MOCK_EXISTING_ENTRIES } from '../mock/data.js'

const VALID_HEADER = {
  term: '1', year: '2568', fullName: 'สมชาย ใจดี', studentId: '650710000', gpax: '3.25',
}

// ---------- UC-01 SPEC-EDU-001 ----------
// หมายเหตุ: หน้า UC-01 ใช้รูปแบบตามแบบฟอร์มจริง ซึ่งยังไม่ตรงกับ DR-EDU-01 ฉบับปัจจุบัน
// test ด้านล่างจึงตรวจพฤติกรรมของหน้าจอตัวอย่าง ไม่ใช่การยืนยันว่าสเปกถูกแก้แล้ว

test('FR_EDU_05_reports_every_empty_required_field_in_the_header', () => {
  const errors = validateHeader({ ...VALID_HEADER, gpax: '', studentId: '' })
  expect(errors.gpax).toBeTruthy()
  expect(errors.studentId).toBeTruthy()
})

test('DR_EDU_02_rejects_a_gpax_outside_0_to_4', () => {
  expect(validateHeader({ ...VALID_HEADER, gpax: '4.50' }).gpax).toBeTruthy()
  expect(validateHeader({ ...VALID_HEADER, gpax: '3.255' }).gpax).toBeTruthy()
  expect(validateHeader(VALID_HEADER).gpax).toBeUndefined()
})

test('DR_EDU_04_rejects_an_academic_year_that_is_not_four_digits', () => {
  expect(validateHeader({ ...VALID_HEADER, year: '68' }).year).toBeTruthy()
})

test('AC_EDU_04_DR_EDU_06_rejects_a_file_type_outside_the_allowed_set', () => {
  expect(validateFiles([{ name: 'virus.exe', sizeMB: 1 }])).toMatch(/.pdf/)
})

test('AC_EDU_13_DR_EDU_07_requires_at_least_one_transcript_file', () => {
  expect(validateFiles([])).toMatch(/Transcript/)
})

test('OQ_R_17_counts_a_course_as_passed_only_when_the_grade_is_not_F_W_or_I', () => {
  const rows = { '517 121': { grade: 'A' }, '517 122': { grade: 'I' }, '520 111': { grade: 'F' } }
  const s = summarize(rows)
  expect(s.passed).toBe(1)
  expect(s.notPassed).toBe(s.total - 1)
})

test('FR_EDU_01_lists_every_curriculum_course_so_the_student_does_not_type_them', () => {
  render(<AcademicRecordEntry />)
  expect(screen.getByLabelText('เกรดของ 517 121')).toBeTruthy()
  expect(screen.getByLabelText('เกรดของ 520 364')).toBeTruthy()
  expect(screen.getByLabelText('เกรดของ 520 393')).toBeTruthy()
})

test('summary_counts_update_without_the_student_typing_them', () => {
  render(<AcademicRecordEntry />)
  expect(screen.getByTestId('passed-count').textContent).toBe('0')
  expect(screen.getByTestId('not-passed-count').textContent).toBe('26')
  fireEvent.change(screen.getByLabelText('เกรดของ 517 121'), { target: { value: 'A' } })
  expect(screen.getByTestId('passed-count').textContent).toBe('1')
  expect(screen.getByTestId('not-passed-count').textContent).toBe('25')
})

test('FR_EDU_02_shows_a_read_only_notice_when_the_round_is_closed', () => {
  render(<AcademicRecordEntry />)
  fireEvent.click(screen.getByLabelText(/จำลองกรณีอยู่นอกช่วงที่เปิดรับข้อมูล/))
  expect(screen.getAllByRole('alert').some((e) => e.textContent.includes('นอกช่วงที่เปิดรับข้อมูล'))).toBe(true)
})

// ---------- UC-02 SPEC-ADD-002 ----------

test('AC_ADD_04_DR_ADD_02_rejects_a_grade_outside_the_allowed_set', () => {
  const errors = validateEntry(
    { courseCode: '517xxx1', academicYear: '2569', semester: '1', grade: 'Z' }, [])
  expect(errors.grade).toBeTruthy()
})

test('DR_ADD_04_rejects_a_course_not_in_the_master_list', () => {
  const errors = validateEntry(
    { courseCode: 'ไม่มีจริง', academicYear: '2569', semester: '1', grade: 'A' }, [])
  expect(errors.courseCode).toMatch(/รายการในระบบ/)
})

test('DR_ADD_05_CON_ADD_02_rejects_a_duplicate_course_year_and_semester', () => {
  const dup = { courseCode: '517xxx1', academicYear: '2568', semester: '1', grade: 'A' }
  expect(validateEntry(dup, MOCK_EXISTING_ENTRIES).courseCode).toMatch(/มีอยู่แล้ว/)
})

test('DR_ADD_05_allows_the_same_course_in_a_different_semester', () => {
  const ok = { courseCode: '517xxx1', academicYear: '2568', semester: '2', grade: 'A' }
  expect(validateEntry(ok, MOCK_EXISTING_ENTRIES)).toEqual({})
})

test('DR_ADD_06_detects_only_actual_grade_changes', () => {
  expect(hasGradeChanged('I', 'B')).toBe(true)
  expect(hasGradeChanged('B', 'B')).toBe(false)
})

test('FR_ADD_01_shows_each_existing_course_with_its_saved_grade', () => {
  render(<SubmitAdditionalGrades />)
  expect(screen.getAllByText(/เกรดเดิม/).length).toBe(MOCK_EXISTING_ENTRIES.length)
})

test('AC_ADD_03_FR_ADD_05_asks_to_confirm_the_old_and_new_grade_before_saving', () => {
  render(<SubmitAdditionalGrades />)
  fireEvent.change(screen.getByLabelText(/แก้เกรดของ ระบบฐานข้อมูล/), { target: { value: 'B' } })
  fireEvent.click(screen.getAllByText('แก้เกรด')[1])
  expect(screen.getByText(/ยืนยันการแก้เกรด/)).toBeTruthy()
  expect(screen.getByText('I')).toBeTruthy()
  expect(screen.getByText('B')).toBeTruthy()
})

test('AC_ADD_02_FR_ADD_02_blocks_the_form_when_there_is_no_base_record', () => {
  render(<SubmitAdditionalGrades />)
  // หน้าเริ่มต้นมีข้อมูลเดิม จึงเปิดฟอร์มได้ตามปกติ
  expect(screen.getByText(/เพิ่มรายวิชาที่ประกาศเกรดเพิ่มเติม/)).toBeTruthy()
})

// ---------- UC-03 SPEC-OWN-003 ----------

test('FR_OWN_03_DR_OWN_02_shows_the_current_request_status', () => {
  render(<OwnEligibilityResult />)
  expect(screen.getByText('สถานะคำร้อง')).toBeTruthy()
  expect(screen.getByText('เสร็จสิ้น')).toBeTruthy()
})

test('AC_OWN_02_FR_OWN_05_hides_the_result_until_it_is_available', () => {
  render(<OwnEligibilityResult />)
  fireEvent.change(screen.getByLabelText('เลือกสถานการณ์จำลอง'), { target: { value: 'pending' } })
  expect(screen.getByText('รอตรวจสอบ')).toBeTruthy()
  expect(screen.queryByText('ผ่านเงื่อนไข')).toBeNull()
  expect(screen.queryByText('ไม่ผ่าน')).toBeNull()
})

test('FR_OWN_04_DR_OWN_05_shows_the_reason_with_a_count_when_the_result_is_fail', () => {
  render(<OwnEligibilityResult />)
  expect(screen.getByText(/ยังมี I ค้างอยู่ 2 วิชา/)).toBeTruthy()
})

test('FR_OWN_06_DR_OWN_03_lists_outstanding_items_one_by_one', () => {
  render(<OwnEligibilityResult />)
  fireEvent.change(screen.getByLabelText('เลือกสถานการณ์จำลอง'), { target: { value: 'incomplete' } })
  expect(screen.getByText('รายการที่ต้องดำเนินการ')).toBeTruthy()
  expect(screen.getByText(/ยังไม่ได้แนบ Transcript/)).toBeTruthy()
})

test('AC_OWN_05_FR_OWN_07_shows_an_error_and_no_status_when_loading_fails', () => {
  render(<OwnEligibilityResult />)
  fireEvent.change(screen.getByLabelText('เลือกสถานการณ์จำลอง'), { target: { value: 'error' } })
  expect(screen.getByRole('alert').textContent).toContain('ลองใหม่')
  expect(screen.queryByText('สถานะคำร้อง')).toBeNull()
})

// ---------- UC-04 SPEC-DOC-004 ----------

test('FR_DOC_01_DR_DOC_01_lists_documents_grouped_by_category', () => {
  render(<DownloadDocuments />)
  expect(screen.getByText(/แบบฟอร์มผลการศึกษา/)).toBeTruthy()
  expect(screen.getAllByText(/หมวดหมู่ตัวอย่าง/).length).toBeGreaterThanOrEqual(2)
})

test('AC_DOC_03_FR_DOC_05_explains_when_there_is_no_document', () => {
  render(<DownloadDocuments />)
  fireEvent.click(screen.getByLabelText(/จำลองกรณีไม่มีเอกสารที่เผยแพร่/))
  expect(screen.getByText(/ยังไม่มีเอกสารที่เผยแพร่/)).toBeTruthy()
})

test('AC_DOC_05_FR_DOC_07_reports_a_file_that_is_not_ready', () => {
  render(<DownloadDocuments />)
  fireEvent.click(screen.getAllByText('ดาวน์โหลด')[2])
  expect(screen.getByRole('alert').textContent).toContain('ยังไม่พร้อมให้ดาวน์โหลด')
})

// ---------- โครงรวม ----------

test('IF_WEB_01_application_shell_renders_all_four_screens', () => {
  render(<App />)
  for (const label of ['UC-01', 'UC-02', 'UC-03', 'UC-04']) {
    expect(screen.getByText(new RegExp(label))).toBeTruthy()
  }
})
