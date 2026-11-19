// ทดสอบหน้าจอของ UC-01 เท่านั้น
// อยู่ในโฟลเดอร์ของฟีเจอร์ เพื่อให้ย้ายหรือส่งมอบ use case นี้แยกจากฟีเจอร์อื่นได้
import { render, screen, fireEvent } from '@testing-library/react'
import AcademicRecordEntry, { validateHeader, validateFiles, summarize } from './AcademicRecordEntry.jsx'

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
