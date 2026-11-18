// โครงหน้าจอรวมของ mock UI
// แต่ละหน้าอ้างอิง use case และ spec ของตนเองไว้ในไฟล์หน้านั้น
// IF-WEB-01 ทุกหน้าทำงานบนเบราว์เซอร์โดยไม่ต้องติดตั้งโปรแกรมเพิ่ม
// NFR-*-04 รองรับจอกว้างตั้งแต่ 360 px โดยไม่มีการเลื่อนแนวนอน
import { useState } from 'react'
import AcademicRecordEntry from './pages/AcademicRecordEntry.jsx'
import SubmitAdditionalGrades from './pages/SubmitAdditionalGrades.jsx'
import OwnEligibilityResult from './pages/OwnEligibilityResult.jsx'
import DownloadDocuments from './pages/DownloadDocuments.jsx'

const PAGES = [
  { id: 'uc01', label: 'UC-01 กรอกผลการศึกษา', spec: 'SPEC-EDU-001', Component: AcademicRecordEntry },
  { id: 'uc02', label: 'UC-02 ส่งผลเพิ่มเติม', spec: 'SPEC-ADD-002', Component: SubmitAdditionalGrades },
  { id: 'uc03', label: 'UC-03 ดูผลของตนเอง', spec: 'SPEC-OWN-003', Component: OwnEligibilityResult },
  { id: 'uc04', label: 'UC-04 ดาวน์โหลดเอกสาร', spec: 'SPEC-DOC-004', Component: DownloadDocuments },
]

export default function App() {
  const [active, setActive] = useState('uc01')
  const page = PAGES.find((p) => p.id === active)
  const Current = page.Component

  return (
    <main className="mx-auto max-w-3xl space-y-4 overflow-x-hidden p-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">ระบบตรวจสอบคุณสมบัตินักศึกษา</h1>
        <p className="text-sm text-gray-600">
          ต้นแบบหน้าจอ (mock UI) ยังไม่เชื่อมต่อฐานข้อมูลและยังไม่มีการยืนยันตัวตนจริง
        </p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="เลือกหน้าจอ">
        {PAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            aria-current={p.id === active ? 'page' : undefined}
            className={
              'rounded border px-3 py-2 text-sm ' +
              (p.id === active ? 'bg-green-700 text-white' : 'bg-white')
            }
          >
            {p.label}
          </button>
        ))}
      </nav>

      <p className="text-sm text-gray-500">อ้างอิง: {page.spec}</p>

      <Current />
    </main>
  )
}
