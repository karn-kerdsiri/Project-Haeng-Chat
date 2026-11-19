// Smoke test ของโครงรวม: ตรวจว่า shell เปิดได้และลิงก์ครบ 4 use case
// ตรรกะของแต่ละ use case อยู่ใน src/features/<uc>/ และทดสอบแยกไฟล์ที่นั่น
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'

// ทดสอบโครงรวมของหน้าจอ ไม่ใช่ของ use case ใด

test('IF_WEB_01_application_shell_renders_all_four_screens', () => {
  render(<App />)
  for (const label of ['UC-01', 'UC-02', 'UC-03', 'UC-04']) {
    expect(screen.getByText(new RegExp(label))).toBeTruthy()
  }
})
