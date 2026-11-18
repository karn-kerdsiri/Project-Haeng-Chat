// หน้าจอจำลองของ UC-01 กรอกข้อมูลผลการศึกษา (SPEC-EDU-001)
//
// รูปแบบหน้าจอทำตาม "แบบขอตรวจสอบคุณสมบัติในการมีสิทธิ์ขอจัดทำโครงงานปริญญานิพนธ์" ที่ใช้งานจริง
// และตรงกับ spec แล้วตั้งแต่ specs/001 Draft v4 (2569-11-18) ตาม ASM-EDU-15
//
// รองรับ: FR-EDU-01 (ฟอร์ม + ตารางรายวิชา + ยอดรวม), FR-EDU-02 (รอบปิดเป็นอ่านอย่างเดียว),
//          FR-EDU-04 (หน้าสรุปก่อนส่ง), FR-EDU-05 (แจ้งช่องที่ยังว่าง), FR-EDU-06 (รูปแบบข้อมูล),
//          FR-EDU-03/FR-EDU-07/FR-EDU-13 (ไฟล์แนบตาม DR-EDU-06, DR-EDU-07)
//          DR-EDU-01, DR-EDU-02, DR-EDU-04, DR-EDU-05, DR-EDU-08, DR-EDU-09, DR-EDU-10, DR-EDU-11
import { useState } from 'react'
import {
  ALLOWED_GRADES, SEMESTERS, FILE_RULES,
  CURRICULUM_COURSES, PREPARATION_COURSE, NOT_PASSED_GRADES,
} from '../mock/data.js'

// ส่วนหัวของแบบฟอร์มจริง
const HEADER_FIELDS = [
  { key: 'term', label: 'ภาคการศึกษา', type: 'select', options: SEMESTERS },
  { key: 'year', label: 'ปีการศึกษา', type: 'text' },
  { key: 'fullName', label: 'ชื่อ - นามสกุล', type: 'text' },
  { key: 'studentId', label: 'รหัสนักศึกษา', type: 'text' },
  { key: 'gpax', label: 'เกรดเฉลี่ยสะสม', type: 'text', hint: 'กรอกตามที่ปรากฏในระบบบริการการศึกษาของมหาวิทยาลัย' },
]

const ALL_ROWS = [...CURRICULUM_COURSES, PREPARATION_COURSE]
const emptyRows = () =>
  Object.fromEntries(ALL_ROWS.map((c) => [c.code, { term: '', year: '', grade: '' }]))

// รอ OQ-EDU-01: นิยาม "สอบผ่าน" ตาม DR-EDU-10 ยังไม่ได้ยืนยันกับคณะ
// ที่นี่ใช้นิยามชั่วคราวว่า มีเกรดแล้วและไม่ใช่ F, W หรือ I
export function summarize(rows) {
  let passed = 0
  let notPassed = 0
  for (const c of ALL_ROWS) {
    const g = rows[c.code]?.grade
    if (g && !NOT_PASSED_GRADES.includes(g)) passed += 1
    else notPassed += 1
  }
  return { passed, notPassed, total: ALL_ROWS.length }
}

export function validateHeader(values) {
  const errors = {}
  for (const f of HEADER_FIELDS) {
    if (!String(values[f.key] ?? '').trim()) errors[f.key] = `กรุณากรอก${f.label}`  // FR-EDU-05
  }
  // รูปแบบ GPAX ใช้กฎเดิมของ DR-EDU-02
  if (!errors.gpax && values.gpax) {
    const ok = /^\d+(\.\d{1,2})?$/.test(values.gpax) && Number(values.gpax) >= 0 && Number(values.gpax) <= 4
    if (!ok) errors.gpax = 'เกรดเฉลี่ยสะสมต้องอยู่ระหว่าง 0.00 - 4.00 และมีทศนิยมไม่เกิน 2 ตำแหน่ง'
  }
  if (!errors.year && values.year) {
    const current = new Date().getFullYear() + 543
    if (!/^\d{4}$/.test(values.year) || Number(values.year) > current) {
      errors.year = `ปีการศึกษาต้องเป็นเลข 4 หลัก และไม่เกิน ${current}`  // DR-EDU-04
    }
  }
  return errors
}

// DR-EDU-06 / DR-EDU-07 เงื่อนไขไฟล์แนบ (เดิม)
export function validateFiles(files) {
  if (files.length === 0) return 'ต้องแนบ Transcript อย่างน้อย 1 ไฟล์ก่อนส่ง'
  if (files.length > FILE_RULES.maxFiles) return `แนบได้ไม่เกิน ${FILE_RULES.maxFiles} ไฟล์ต่อการส่ง 1 ครั้ง`
  for (const f of files) {
    const ext = '.' + String(f.name).split('.').pop().toLowerCase()
    if (!FILE_RULES.accept.includes(ext)) return `รับเฉพาะไฟล์ ${FILE_RULES.accept.join(' ')} เท่านั้น`
    if (f.sizeMB > FILE_RULES.maxSizeMB) return `ไฟล์ต้องมีขนาดไม่เกิน ${FILE_RULES.maxSizeMB} MB ต่อไฟล์`
  }
  return ''
}

export default function AcademicRecordEntry() {
  const [header, setHeader] = useState(
    Object.fromEntries(HEADER_FIELDS.map((f) => [f.key, ''])))
  const [rows, setRows] = useState(emptyRows)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [fileError, setFileError] = useState('')
  const [stage, setStage] = useState('form')
  const [roundOpen, setRoundOpen] = useState(true)

  const summary = summarize(rows)
  const setH = (k) => (e) => setHeader((v) => ({ ...v, [k]: e.target.value }))
  const setRow = (code, field) => (e) =>
    setRows((r) => ({ ...r, [code]: { ...r[code], [field]: e.target.value } }))

  if (stage === 'saved') {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-bold">ส่งข้อมูลผลการศึกษาสำเร็จ</h2>
        <p className="rounded bg-green-50 p-3 text-green-900">
          บันทึกข้อมูลแล้ว สถานะคำร้องคือ &quot;รอตรวจสอบ&quot;
          <br />
          <span className="text-sm">บันทึกเมื่อ {new Date().toLocaleString('th-TH')}</span>
        </p>
        <button className="rounded border px-3 py-2" onClick={() => setStage('form')}>
          กลับไปแก้ไขข้อมูล
        </button>
      </section>
    )
  }

  if (stage === 'review') {
    const filled = ALL_ROWS.filter((c) => rows[c.code].grade)
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-bold">ตรวจสอบข้อมูลก่อนส่ง</h2>
        <dl className="divide-y rounded border">
          {HEADER_FIELDS.map((f) => (
            <div key={f.key} className="flex flex-wrap gap-2 p-2">
              <dt className="w-44 shrink-0 text-gray-600">{f.label}</dt>
              <dd className="font-medium break-all">{header[f.key]}</dd>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 p-2">
            <dt className="w-44 shrink-0 text-gray-600">รายวิชาที่กรอกเกรดแล้ว</dt>
            <dd className="font-medium">{filled.length} จาก {summary.total} วิชา</dd>
          </div>
          <div className="flex flex-wrap gap-2 p-2">
            <dt className="w-44 shrink-0 text-gray-600">ไฟล์แนบ</dt>
            <dd className="font-medium break-all">{files.map((f) => f.name).join(', ')}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <button className="rounded bg-green-700 px-4 py-2 text-white" onClick={() => setStage('saved')}>
            ยืนยันการส่ง
          </button>
          <button className="rounded border px-4 py-2" onClick={() => setStage('form')}>
            ย้อนกลับไปแก้ไข
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">
        แบบขอตรวจสอบคุณสมบัติในการมีสิทธิ์ขอจัดทำโครงงานปริญญานิพนธ์
      </h2>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={!roundOpen} onChange={(e) => setRoundOpen(!e.target.checked)} />
        จำลองกรณีอยู่นอกช่วงที่เปิดรับข้อมูล
      </label>
      {!roundOpen && (
        <p role="alert" className="rounded bg-amber-50 p-3 text-amber-900">
          อยู่นอกช่วงที่เปิดรับข้อมูล ระบบไม่รับการบันทึก และแสดงฟอร์มแบบอ่านอย่างเดียว
        </p>
      )}

      {/* ส่วนหัวของแบบฟอร์ม */}
      <div className="grid gap-3 sm:grid-cols-2">
        {HEADER_FIELDS.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label htmlFor={f.key} className="font-medium">
              {f.label} <span className="text-red-600">*</span>
            </label>
            {f.type === 'select' ? (
              <select id={f.key} className="rounded border p-2" value={header[f.key]}
                disabled={!roundOpen} onChange={setH(f.key)}>
                <option value="">เลือก{f.label}</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input id={f.key} className="rounded border p-2" value={header[f.key]}
                disabled={!roundOpen} onChange={setH(f.key)} />
            )}
            {f.hint && <span className="text-sm text-gray-500">{f.hint}</span>}
            {errors[f.key] && <span role="alert" className="text-sm text-red-700">{errors[f.key]}</span>}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600">
        กรุณาแนบผลการศึกษาที่พิมพ์จากเว็บระบบบริการการศึกษาของมหาวิทยาลัยมาด้วย
      </p>

      {/* ตารางรายวิชาบังคับ ระบบแสดงให้ครบทุกวิชา นักศึกษากรอกเฉพาะ ภาค ปี เกรด */}
      <div>
        <h3 className="mb-2 font-bold">
          ผลการเรียนรายวิชาบังคับของหลักสูตรในชั้นปีที่ 1 - 3
        </h3>
        <ul className="divide-y rounded border">
          {ALL_ROWS.map((c, i) => (
            <li key={c.code} className="flex flex-wrap items-center gap-2 p-2">
              <span className="w-6 shrink-0 text-sm text-gray-500">
                {i < CURRICULUM_COURSES.length ? i + 1 : '•'}
              </span>
              <span className="min-w-0 flex-1 basis-full break-words sm:basis-0">
                <span className="font-medium">{c.code}</span> {c.name}
              </span>
              <select aria-label={`ภาคของ ${c.code}`} className="rounded border p-1 text-sm"
                value={rows[c.code].term} disabled={!roundOpen} onChange={setRow(c.code, 'term')}>
                <option value="">ภาค</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input aria-label={`ปีของ ${c.code}`} className="w-20 rounded border p-1 text-sm" placeholder="ปี"
                value={rows[c.code].year} disabled={!roundOpen} onChange={setRow(c.code, 'year')} />
              <select aria-label={`เกรดของ ${c.code}`} className="rounded border p-1 text-sm"
                value={rows[c.code].grade} disabled={!roundOpen} onChange={setRow(c.code, 'grade')}>
                <option value="">เกรด</option>
                {ALLOWED_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </li>
          ))}
        </ul>
      </div>

      {/* ยอดรวมคำนวณอัตโนมัติ ไม่ต้องกรอกเอง */}
      <dl className="divide-y rounded border bg-gray-50">
        <div className="flex justify-between p-2">
          <dt>รวมจำนวนวิชาที่สอบผ่าน</dt>
          <dd data-testid="passed-count" className="font-bold">{summary.passed}</dd>
        </div>
        <div className="flex justify-between p-2">
          <dt>รวมจำนวนวิชาที่ยังไม่ผ่าน / ยังไม่ลงทะเบียน</dt>
          <dd data-testid="not-passed-count" className="font-bold">{summary.notPassed}</dd>
        </div>
      </dl>
      <p className="text-sm text-gray-500">
        ระบบคำนวณยอดรวมให้อัตโนมัติ นิยาม &quot;สอบผ่าน&quot; ที่ใช้ชั่วคราวคือมีเกรดแล้วและไม่ใช่ F, W หรือ I
        (รอยืนยันตาม OQ-EDU-01)
      </p>

      {/* ไฟล์แนบตาม DR-EDU-06 และ DR-EDU-07 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">แนบ Transcript <span className="text-red-600">*</span></label>
        <span className="text-sm text-gray-500">
          รับเฉพาะ {FILE_RULES.accept.join(' ')} ขนาดไม่เกิน {FILE_RULES.maxSizeMB} MB ต่อไฟล์
          และไม่เกิน {FILE_RULES.maxFiles} ไฟล์
        </span>
        <button type="button" className="self-start rounded border px-3 py-2" disabled={!roundOpen}
          onClick={() => setFiles((fs) => [...fs, { name: `transcript-${fs.length + 1}.pdf`, sizeMB: 1 }])}>
          จำลองการแนบไฟล์ .pdf
        </button>
        {files.length > 0 && (
          <ul className="list-disc pl-5 text-sm">
            {files.map((f, i) => <li key={i} className="break-all">{f.name}</li>)}
          </ul>
        )}
        {fileError && <span role="alert" className="text-sm text-red-700">{fileError}</span>}
      </div>

      <button
        type="button"
        className="rounded bg-green-700 px-4 py-2 text-white disabled:bg-gray-400"
        disabled={!roundOpen}
        onClick={() => {
          const err = validateHeader(header)
          const fErr = validateFiles(files)
          setErrors(err)
          setFileError(fErr)
          if (Object.keys(err).length === 0 && !fErr) setStage('review')  // FR-EDU-04
        }}
      >
        ตรวจสอบข้อมูล
      </button>
    </section>
  )
}
