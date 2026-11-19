// ทดสอบหน้าจอของ UC-03 เท่านั้น
// อยู่ในโฟลเดอร์ของฟีเจอร์ เพื่อให้ย้ายหรือส่งมอบ use case นี้แยกจากฟีเจอร์อื่นได้
import { render, screen, fireEvent } from '@testing-library/react'
import OwnEligibilityResult from './OwnEligibilityResult.jsx'

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

// ---------- test ที่เขียนจาก test-cases.md แถวสถานะ "ใช้ได้" (2569-11-19) ----------

const pick = (key) =>
  fireEvent.change(screen.getByLabelText('เลือกสถานการณ์จำลอง'), { target: { value: key } })

test('TC_OWN_02_1_pending_shows_status_and_hides_any_result', () => {
  // Given คำร้องของนักศึกษายังไม่มีผลการตรวจสอบ
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('pending')
  // Then 1) แสดงสถานะ "รอตรวจสอบ" ตาม DR-OWN-02
  expect(screen.getByText('รอตรวจสอบ')).toBeTruthy()
  // Then 2) ไม่แสดงค่า "ผ่านเงื่อนไข"  3) ไม่แสดงค่า "ไม่ผ่าน" ตาม FR-OWN-05
  expect(screen.queryByText('ผ่านเงื่อนไข')).toBeNull()
  expect(screen.queryByText('ไม่ผ่าน')).toBeNull()
})

test('TC_OWN_02_3_published_pass_result_is_shown', () => {
  // Given มีผลที่เผยแพร่แล้วเป็น "ผ่านเงื่อนไข"
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('pass')
  // Then 1) แสดงค่า "ผ่านเงื่อนไข"  2) ไม่แสดงสถานะ "รอตรวจสอบ"
  expect(screen.getByText('ผ่านเงื่อนไข')).toBeTruthy()
  expect(screen.queryByText('รอตรวจสอบ')).toBeNull()
})

test('TC_OWN_03_1_incomplete_data_lists_each_outstanding_item', () => {
  // Given ข้อมูลของนักศึกษายังไม่ครบ และมีสิ่งที่ต้องดำเนินการ 2 รายการ
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('incomplete')
  // Then 1) แสดงรายการเป็นรายข้อครบ 2 ข้อ ตาม FR-OWN-06 และ DR-OWN-03
  const box = screen.getByText('รายการที่ต้องดำเนินการ').parentElement
  expect(box.querySelectorAll('li')).toHaveLength(2)
  // Then 2) แต่ละข้อแยกบรรทัดอ่านได้ ไม่รวมเป็นข้อความเดียว
  expect(box.querySelectorAll('li')[0].textContent).not.toBe(box.textContent)
})

test('TC_OWN_03_3_complete_data_shows_no_outstanding_list', () => {
  // Given ข้อมูลครบแล้ว
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('done')
  // Then 1) ไม่แสดงรายการสิ่งที่ต้องดำเนินการ
  expect(screen.queryByText('รายการที่ต้องดำเนินการ')).toBeNull()
})

test('TC_OWN_05_1_source_unavailable_shows_error_and_no_values', () => {
  // Given แหล่งข้อมูลผลการตรวจสอบไม่พร้อมใช้งาน
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('error')
  // Then 1) แสดงข้อความผิดพลาดภาษาไทย  2) มีช่องทางให้ลองใหม่ ตาม NFR-OWN-03
  expect(screen.getByRole('alert').textContent).toContain('ไม่สามารถเรียกข้อมูลได้')
  expect(screen.getByText('ลองใหม่')).toBeTruthy()
  // Then 3) ไม่แสดงค่าสถานะใด  4) ไม่แสดงค่าผลการตรวจสอบใด ตาม FR-OWN-07
  expect(screen.queryByText('สถานะคำร้อง')).toBeNull()
  expect(screen.queryByText('ผลการตรวจสอบคุณสมบัติ')).toBeNull()
})

test('TC_OWN_05_2_no_stale_value_after_a_failed_reload', () => {
  // Given เคยเปิดหน้าสำเร็จมาก่อน
  render(<OwnEligibilityResult />)
  pick('done')
  expect(screen.getByText('สถานะคำร้อง')).toBeTruthy()
  // When แหล่งข้อมูลล่มในการเปิดครั้งถัดไป
  pick('error')
  // Then 1) ไม่แสดงค่าที่ค้างจากครั้งก่อน ตาม CON-OWN-02  2) แสดงข้อความผิดพลาดแทน
  expect(screen.queryByText('สถานะคำร้อง')).toBeNull()
  expect(screen.getByRole('alert')).toBeTruthy()
})

test('TC_OWN_05_3_successful_load_shows_no_error', () => {
  // Given อ่านข้อมูลสำเร็จ
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('done')
  // Then 1) ไม่แสดงข้อความผิดพลาด  2) แสดงสถานะตามปกติ
  expect(screen.queryByRole('alert')).toBeNull()
  expect(screen.getByText('สถานะคำร้อง')).toBeTruthy()
})

test('TC_OWN_06_1_shows_the_predefined_text_of_pending_status', () => {
  // Given คำร้องอยู่ในสถานะ "รอตรวจสอบ" ตาม DR-OWN-02
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('pending')
  // Then 1) แสดงข้อความสถานะที่กำหนดไว้ล่วงหน้าของสถานะนั้น ตาม FR-OWN-03
  // Then 2) ถ้อยคำที่ต้องแสดงใช้คำว่าอะไร ยังไม่ตรวจ (รอ OQ-OWN-01)
  expect(screen.getByText('รอตรวจสอบ')).toBeTruthy()
})

test('TC_OWN_06_2_shows_the_predefined_text_of_done_status', () => {
  // Given คำร้องอยู่ในสถานะ "เสร็จสิ้น"
  render(<OwnEligibilityResult />)
  // When เปิดหน้าผลการตรวจสอบ
  pick('done')
  // Then 1) แสดงข้อความสถานะที่กำหนดไว้ล่วงหน้าของสถานะ "เสร็จสิ้น"
  // Then 2) ถ้อยคำที่ต้องแสดงใช้คำว่าอะไร ยังไม่ตรวจ (รอ OQ-OWN-01)
  expect(screen.getByText('เสร็จสิ้น')).toBeTruthy()
})
