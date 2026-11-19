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
