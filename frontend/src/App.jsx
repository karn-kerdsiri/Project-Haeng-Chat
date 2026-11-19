// โครงรวมสำหรับเปิดดูต้นแบบเท่านั้น ไม่ใช่ที่อยู่ของตรรกะ use case ใด
//
// แต่ละ use case อยู่ในโฟลเดอร์ของตัวเองที่ src/features/<uc>/ ประกอบด้วยหน้าจอ
// ข้อมูลจำลอง และ test ของตัวเอง ไม่ import ข้ามฟีเจอร์ เพื่อให้พัฒนา ทดสอบ
// และส่งมอบทีละ use case ได้ ตามที่ tasks.md ของแต่ละฟีเจอร์แยกกันอยู่แล้ว
//
// ไฟล์นี้ทำหน้าที่เดียวคือเป็นสารบัญให้เปิดดูต้นแบบ ถ้าลบฟีเจอร์ใดออก
// ให้ลบทั้งโฟลเดอร์และลบ 1 บรรทัดในตาราง PAGES ด้านล่าง
import { useState } from 'react'
import AcademicRecordEntry from './features/uc01-academic-record-entry/AcademicRecordEntry.jsx'
import SubmitAdditionalGrades from './features/uc02-submit-additional-grades/SubmitAdditionalGrades.jsx'
import OwnEligibilityResult from './features/uc03-view-own-result/OwnEligibilityResult.jsx'
import DownloadDocuments from './features/uc04-download-documents/DownloadDocuments.jsx'

const PAGES = [
  { id: 'uc01', label: 'UC-01 กรอกผลการศึกษา', spec: 'SPEC-EDU-001', folder: 'uc01-academic-record-entry', Component: AcademicRecordEntry },
  { id: 'uc02', label: 'UC-02 ส่งผลเพิ่มเติม', spec: 'SPEC-ADD-002', folder: 'uc02-submit-additional-grades', Component: SubmitAdditionalGrades },
  { id: 'uc03', label: 'UC-03 ดูผลของตนเอง', spec: 'SPEC-OWN-003', folder: 'uc03-view-own-result', Component: OwnEligibilityResult },
  { id: 'uc04', label: 'UC-04 ดาวน์โหลดเอกสาร', spec: 'SPEC-DOC-004', folder: 'uc04-download-documents', Component: DownloadDocuments },
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
          แต่ละ use case แยกโฟลเดอร์กัน
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

      <p className="text-sm text-gray-500">
        อ้างอิง: {page.spec} · โค้ดอยู่ที่ <code>src/features/{page.folder}/</code>
      </p>

      <Current />
    </main>
  )
}
