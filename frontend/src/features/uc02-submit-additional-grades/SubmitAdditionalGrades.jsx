// หน้าจอจำลองของ UC-02 ส่งผลการเรียนเพิ่มเติม (SPEC-ADD-002)
// รองรับ: FR-ADD-01, FR-ADD-02, FR-ADD-03, FR-ADD-04, FR-ADD-05, FR-ADD-06, FR-ADD-10
//          DR-ADD-01, DR-ADD-02, DR-ADD-04, DR-ADD-05, DR-ADD-06, CON-ADD-02
// กฎการตรวจเหมือนกับ backend/app/submit_additional_grades/validation.py ซึ่งมี unit test อยู่แล้ว
import { useState } from 'react'
import {
  ALLOWED_GRADES, SEMESTERS, MOCK_COURSES, MOCK_EXISTING_ENTRIES, REQUEST_STATUS,
} from './mock.js'

const EMPTY = { courseCode: '', academicYear: '', semester: '', grade: '' }

// DR-ADD-01, DR-ADD-02, DR-ADD-04, DR-ADD-05
export function validateEntry(entry, existing) {
  const errors = {}
  if (!entry.academicYear) errors.academicYear = 'กรุณาระบุปีการศึกษา'
  if (!entry.semester) errors.semester = 'กรุณาระบุภาคเรียน'
  if (!entry.courseCode) errors.courseCode = 'กรุณาเลือกรายวิชา'
  if (!entry.grade) errors.grade = 'กรุณาระบุเกรด'

  if (entry.grade && !ALLOWED_GRADES.includes(entry.grade)) {
    errors.grade = 'กรุณาระบุเกรดจากชุดค่าที่ระบบรับได้'       // DR-ADD-02
  }
  if (entry.courseCode && !MOCK_COURSES.some((c) => c.code === entry.courseCode)) {
    errors.courseCode = 'กรุณาเลือกรายวิชาจากรายการในระบบ'     // DR-ADD-04
  }
  // DR-ADD-05 รายวิชาซ้ำ = รายวิชา + ปีการศึกษา + ภาคเรียน เดิมในคำร้องเดียวกัน
  const dup = existing.some(
    (e) => e.courseCode === entry.courseCode &&
      e.academicYear === entry.academicYear &&
      e.semester === entry.semester,
  )
  if (!errors.courseCode && dup) {
    errors.courseCode = 'รายวิชานี้ในปีการศึกษาและภาคเรียนนี้มีอยู่แล้วในคำร้อง'   // CON-ADD-02
  }
  return errors
}

// DR-ADD-06 ถือว่ามีการเปลี่ยนแปลงเมื่อค่าเกรดใหม่ต่างจากเดิม
export function hasGradeChanged(original, next) {
  return original !== next
}

const courseName = (code) => MOCK_COURSES.find((c) => c.code === code)?.name ?? code

export default function SubmitAdditionalGrades() {
  const [hasBaseRecord, setHasBaseRecord] = useState(true)   // FR-ADD-02
  const [existing, setExisting] = useState(MOCK_EXISTING_ENTRIES)
  const [entry, setEntry] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [edits, setEdits] = useState({})      // แก้เกรดของรายการเดิม (IN-ADD-06)
  const [confirming, setConfirming] = useState(null)
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => setEntry((v) => ({ ...v, [k]: e.target.value }))

  // FR-ADD-02 ยังไม่มีข้อมูลผลการศึกษาเดิม ต้องไม่เปิดฟอร์ม
  if (!hasBaseRecord) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-bold">ส่งผลการเรียนเพิ่มเติม</h2>
        <p role="alert" className="rounded bg-amber-50 p-3 text-amber-900">
          ยังไม่พบข้อมูลผลการศึกษาเดิมของคุณ กรุณาส่งผลการศึกษาหลักก่อนจึงจะส่งผลเพิ่มเติมได้
        </p>
        <button className="rounded border px-3 py-2" onClick={() => setHasBaseRecord(true)}>
          จำลองกรณีมีข้อมูลเดิมแล้ว
        </button>
      </section>
    )
  }

  // FR-ADD-05 หน้าจอยืนยันที่ระบุรายวิชา เกรดเดิม และเกรดใหม่ ก่อนบันทึกทับ
  if (confirming) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-bold">ยืนยันการแก้เกรด</h2>
        <p className="rounded border p-3">
          รายวิชา <strong>{courseName(confirming.courseCode)}</strong> ปีการศึกษา {confirming.academicYear}{' '}
          ภาคเรียน {confirming.semester}
          <br />
          จากเกรด <strong>{confirming.oldGrade}</strong> เป็นเกรด <strong>{confirming.newGrade}</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-green-700 px-4 py-2 text-white"
            onClick={() => {
              setExisting((rows) => rows.map((r) =>
                r.id === confirming.id ? { ...r, grade: confirming.newGrade } : r))
              setEdits((e) => ({ ...e, [confirming.id]: undefined }))
              setConfirming(null)
              setSaved(true)
            }}
          >
            ยืนยัน
          </button>
          <button className="rounded border px-4 py-2" onClick={() => setConfirming(null)}>ยกเลิก</button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold">ส่งผลการเรียนเพิ่มเติม</h2>

      {/* FR-ADD-10 แสดงสถานะคำร้องล่าสุด */}
      <p className="rounded bg-gray-100 p-3">
        สถานะคำร้องปัจจุบัน: <strong>{saved ? REQUEST_STATUS.PENDING : REQUEST_STATUS.DONE}</strong>
      </p>
      {saved && (
        <p role="status" className="rounded bg-green-50 p-3 text-green-900">
          บันทึกข้อมูลเพิ่มเติมแล้ว และปรับสถานะคำร้องเป็น &quot;รอตรวจสอบ&quot;
        </p>
      )}

      {/* FR-ADD-01 แสดงรายการที่เคยส่ง พร้อมเกรดเดิมของแต่ละรายวิชา */}
      <div className="space-y-2">
        <h3 className="font-bold">ผลการศึกษาที่เคยส่ง</h3>
        <ul className="divide-y rounded border">
          {existing.map((row) => {
            const draft = edits[row.id] ?? row.grade
            const changed = hasGradeChanged(row.grade, draft)
            return (
              <li key={row.id} className="flex flex-wrap items-center gap-2 p-2">
                <span className="min-w-0 flex-1 break-words">
                  {courseName(row.courseCode)} · {row.academicYear}/{row.semester}
                </span>
                <span className="text-gray-600">เกรดเดิม {row.grade}</span>
                <select
                  aria-label={`แก้เกรดของ ${courseName(row.courseCode)}`}
                  className="rounded border p-1"
                  value={draft}
                  onChange={(e) => setEdits((s) => ({ ...s, [row.id]: e.target.value }))}
                >
                  {ALLOWED_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <button
                  className="rounded border px-2 py-1 disabled:text-gray-400"
                  disabled={!changed}
                  onClick={() => setConfirming({ ...row, oldGrade: row.grade, newGrade: draft })}
                >
                  แก้เกรด
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* FR-ADD-03 เลือกรายวิชาจากข้อมูลของระบบเท่านั้น และกรอกปี ภาคเรียน เกรด */}
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <h3 className="font-bold">เพิ่มรายวิชาที่ประกาศเกรดเพิ่มเติม</h3>

        <div className="flex flex-col gap-1">
          <label htmlFor="courseCode" className="font-medium">รายวิชา <span className="text-red-600">*</span></label>
          <select id="courseCode" className="rounded border p-2" value={entry.courseCode} onChange={set('courseCode')}>
            <option value="">เลือกรายวิชา</option>
            {MOCK_COURSES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          {errors.courseCode && <span role="alert" className="text-sm text-red-700">{errors.courseCode}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="academicYear" className="font-medium">ปีการศึกษา <span className="text-red-600">*</span></label>
          <input id="academicYear" className="rounded border p-2" value={entry.academicYear} onChange={set('academicYear')} />
          {errors.academicYear && <span role="alert" className="text-sm text-red-700">{errors.academicYear}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="semester" className="font-medium">ภาคเรียน <span className="text-red-600">*</span></label>
          <select id="semester" className="rounded border p-2" value={entry.semester} onChange={set('semester')}>
            <option value="">เลือกภาคเรียน</option>
            {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.semester && <span role="alert" className="text-sm text-red-700">{errors.semester}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="grade" className="font-medium">เกรด <span className="text-red-600">*</span></label>
          <select id="grade" className="rounded border p-2" value={entry.grade} onChange={set('grade')}>
            <option value="">เลือกเกรด</option>
            {ALLOWED_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          {/* ASM-ADD-11 ถ้าผลยังไม่ออกให้เลือก I ห้ามเว้นว่าง */}
          <span className="text-sm text-gray-500">ถ้าผลยังไม่ออก ให้เลือก I</span>
          {errors.grade && <span role="alert" className="text-sm text-red-700">{errors.grade}</span>}
        </div>

        <button
          type="button"
          className="rounded bg-green-700 px-4 py-2 text-white"
          onClick={() => {
            const err = validateEntry(entry, existing)   // FR-ADD-04
            setErrors(err)
            if (Object.keys(err).length > 0) return
            setExisting((rows) => [...rows, { ...entry, id: Date.now() }])
            setEntry(EMPTY)
            setSaved(true)   // FR-ADD-07 ปรับสถานะเป็น "รอตรวจสอบ"
          }}
        >
          เพิ่มรายวิชา
        </button>
      </form>
    </section>
  )
}
