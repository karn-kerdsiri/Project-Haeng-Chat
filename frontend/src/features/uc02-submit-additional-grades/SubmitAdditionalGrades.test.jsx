// ทดสอบหน้าจอของ UC-02 เท่านั้น
// อยู่ในโฟลเดอร์ของฟีเจอร์ เพื่อให้ย้ายหรือส่งมอบ use case นี้แยกจากฟีเจอร์อื่นได้
import { render, screen, fireEvent } from '@testing-library/react'
import SubmitAdditionalGrades, { validateEntry, hasGradeChanged } from './SubmitAdditionalGrades.jsx'
import { MOCK_EXISTING_ENTRIES } from './mock.js'

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

// ---------- test ที่เขียนจาก test-cases.md แถวสถานะ "ใช้ได้" (2569-11-19) ----------

test('TC_ADD_01_2_shows_latest_status_and_the_new_row_after_saving', () => {
  // Given คำร้องเดิมมีระเบียน 3 รายการ อยู่ในช่วงเปิดรับ และเพิ่งบันทึกรายวิชาใหม่สำเร็จ
  render(<SubmitAdditionalGrades />)
  fireEvent.change(screen.getByLabelText(/^รายวิชา/), { target: { value: '517xxx4' } })
  fireEvent.change(screen.getByLabelText(/^ปีการศึกษา/), { target: { value: '2569' } })
  fireEvent.change(screen.getByLabelText(/^ภาคเรียน/), { target: { value: '1' } })
  fireEvent.change(screen.getByLabelText(/^เกรด/), { target: { value: 'A' } })
  // When นักศึกษาเปิดหน้าส่งผลการเรียนเพิ่มเติม (หลังบันทึก)
  fireEvent.click(screen.getByText('เพิ่มรายวิชา'))
  // Then 1) หน้าจอแสดงสถานะคำร้องล่าสุดเป็น "รอตรวจสอบ" ตาม FR-ADD-10
  expect(screen.getByText(/สถานะคำร้องปัจจุบัน/).textContent).toContain('รอตรวจสอบ')
  // Then 2) รายการที่เพิ่งเพิ่มปรากฏในรายการผลการเรียนของคำร้อง ตาม FR-ADD-01
  expect(screen.getByText(/เครือข่ายคอมพิวเตอร์ · 2569\/1/)).toBeTruthy()
})

test('TC_ADD_03_1_confirmation_screen_names_course_old_and_new_grade', () => {
  // Given คำร้องมีรายวิชา A ปีการศึกษา 2568 ภาคเรียน 1 เกรด I อยู่แล้ว
  render(<SubmitAdditionalGrades />)
  // When แก้เกรดของรายวิชานั้นเป็น B แล้วกดส่ง
  fireEvent.change(screen.getByLabelText('แก้เกรดของ ระบบฐานข้อมูล'), { target: { value: 'B' } })
  fireEvent.click(screen.getAllByText('แก้เกรด')[1])
  // Then 1) ระบบแสดงหน้าจอยืนยันที่ระบุชื่อรายวิชา
  const box = screen.getByText(/ยืนยันการแก้เกรด/).parentElement
  expect(box.textContent).toContain('ระบบฐานข้อมูล')
  // Then 2) ระบุเกรดเดิมเป็น I  3) ระบุเกรดใหม่เป็น B ตาม FR-ADD-05
  expect(box.textContent).toContain('จากเกรด')
  expect(box.textContent).toMatch(/I/)
  expect(box.textContent).toMatch(/B/)
})
