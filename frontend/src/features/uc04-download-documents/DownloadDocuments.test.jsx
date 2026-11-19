// ทดสอบหน้าจอของ UC-04 เท่านั้น
// อยู่ในโฟลเดอร์ของฟีเจอร์ เพื่อให้ย้ายหรือส่งมอบ use case นี้แยกจากฟีเจอร์อื่นได้
import { render, screen, fireEvent } from '@testing-library/react'
import DownloadDocuments from './DownloadDocuments.jsx'

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

// ---------- test ที่เขียนจาก test-cases.md แถวสถานะ "ใช้ได้" (2569-11-19) ----------

test('TC_DOC_02_1_lists_every_published_document_with_name_description_and_category', () => {
  // Given มีเอกสารเผยแพร่ 3 รายการ อยู่ใน 2 หมวดหมู่
  render(<DownloadDocuments />)
  // When เปิดหน้ารายการเอกสาร
  // Then 1) แสดงครบทั้ง 3 รายการ
  expect(screen.getAllByText('ดาวน์โหลด')).toHaveLength(3)
  // Then 2) แต่ละรายการมีชื่อเอกสาร
  expect(screen.getByText('แบบฟอร์มผลการศึกษา')).toBeTruthy()
  // Then 3) แต่ละรายการมีคำอธิบายว่าใช้ทำอะไร ตาม DR-DOC-01
  expect(screen.getByText('ใช้กรอกผลการศึกษาก่อนส่งเข้าระบบ')).toBeTruthy()
  // Then 4) จัดกลุ่มตามหมวดหมู่ (ชื่อหมวดหมู่รอ Q-02)
  expect(screen.getAllByText(/หมวดหมู่ตัวอย่าง/).length).toBeGreaterThanOrEqual(2)
})

test('TC_DOC_03_1_explains_when_no_document_is_available', () => {
  // Given ไม่มีเอกสารที่นักศึกษาเข้าถึงได้เลย
  render(<DownloadDocuments />)
  fireEvent.click(screen.getByLabelText(/จำลองกรณีไม่มีเอกสารที่เผยแพร่/))
  // When เปิดหน้ารายการเอกสาร
  // Then 1) แสดงข้อความว่าไม่มีเอกสาร ตาม FR-DOC-05
  expect(screen.getByText(/ยังไม่มีเอกสารที่เผยแพร่/)).toBeTruthy()
  // Then 2) ไม่แสดงรายการว่างเปล่าโดยไม่มีคำอธิบาย
  expect(screen.queryAllByText('ดาวน์โหลด')).toHaveLength(0)
})

test('TC_DOC_03_3_does_not_show_the_empty_message_when_a_document_exists', () => {
  // Given มีเอกสารเผยแพร่อย่างน้อย 1 รายการ
  render(<DownloadDocuments />)
  // When เปิดหน้ารายการเอกสาร
  // Then 1) ไม่แสดงข้อความว่าไม่มีเอกสาร  2) แสดงรายการนั้น
  expect(screen.queryByText(/ยังไม่มีเอกสารที่เผยแพร่/)).toBeNull()
  expect(screen.getAllByText('ดาวน์โหลด').length).toBeGreaterThan(0)
})
