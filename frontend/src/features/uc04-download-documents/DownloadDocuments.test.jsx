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
