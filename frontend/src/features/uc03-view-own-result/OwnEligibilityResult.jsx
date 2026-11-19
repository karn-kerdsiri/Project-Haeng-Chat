// หน้าจอจำลองของ UC-03 ดูผลการตรวจสอบคุณสมบัติของตนเอง (SPEC-OWN-003)
// รองรับ: FR-OWN-02, FR-OWN-03, FR-OWN-04, FR-OWN-05, FR-OWN-06, FR-OWN-07
//          DR-OWN-01 ถึง DR-OWN-06
// ไม่รองรับในหน้านี้: FR-OWN-01 และ FR-OWN-08 (ตรวจ session และสิทธิ์ เป็นงานฝั่งหลังบ้าน)
import { useState } from 'react'
import { MOCK_OWN_REQUEST, REQUEST_STATUS, ELIGIBILITY_RESULT } from './mock.js'

// สถานการณ์จำลองสำหรับดูหน้าจอแต่ละกรณีที่ spec ระบุ
const SCENARIOS = {
  done: { label: 'เสร็จสิ้นและเผยแพร่แล้ว (ไม่ผ่าน)', data: MOCK_OWN_REQUEST },
  pass: {
    label: 'เสร็จสิ้นและเผยแพร่แล้ว (ผ่าน)',
    data: { ...MOCK_OWN_REQUEST, result: ELIGIBILITY_RESULT.PASS, failReasons: [] },
  },
  pending: {
    // FR-OWN-05 ยังไม่มีผล ต้องแสดง "รอตรวจสอบ" และไม่แสดงค่าผ่าน/ไม่ผ่าน
    label: 'ยังไม่มีผลการตรวจสอบ',
    data: { status: REQUEST_STATUS.PENDING, published: false, result: null, failReasons: [], todoItems: [] },
  },
  incomplete: {
    // FR-OWN-06 + DR-OWN-03 ข้อมูลยังไม่ครบ ต้องแจ้งรายการที่ต้องดำเนินการเป็นรายข้อ
    // รอ OQ-OWN-08: ยังไม่ยืนยันว่ากรณีนี้เกิดจากอะไรและต้องแสดงรายการใดบ้าง
    label: 'ข้อมูลยังไม่ครบ (รอ OQ-OWN-08)',
    data: {
      status: REQUEST_STATUS.PENDING, published: false, result: null, failReasons: [],
      todoItems: ['ยังไม่ได้แนบ Transcript', 'ยังไม่ได้ระบุภาคเรียนของรายวิชา 1 รายการ'],
    },
  },
  error: { label: 'เรียกข้อมูลไม่สำเร็จ', data: null },
}

export default function OwnEligibilityResult() {
  const [key, setKey] = useState('done')
  const scenario = SCENARIOS[key]
  const req = scenario.data

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">ผลการตรวจสอบคุณสมบัติของฉัน</h2>

      <label className="flex flex-col gap-1 text-sm text-gray-600">
        สถานการณ์จำลอง
        <select
          aria-label="เลือกสถานการณ์จำลอง"
          className="rounded border p-2"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        >
          {Object.entries(SCENARIOS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
      </label>

      {/* FR-OWN-07 เรียกข้อมูลไม่สำเร็จ ต้องไม่แสดงสถานะหรือผลค้างเดิม */}
      {req === null ? (
        <div className="space-y-2">
          <p role="alert" className="rounded bg-red-50 p-3 text-red-900">
            ไม่สามารถเรียกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
          </p>
          <button className="rounded border px-3 py-2" onClick={() => setKey('done')}>ลองใหม่</button>
        </div>
      ) : (
        <>
          {/* FR-OWN-03 แสดงสถานะปัจจุบันตาม DR-OWN-02 */}
          <div className="rounded border p-3">
            <p className="text-gray-600">สถานะคำร้อง</p>
            <p className="text-lg font-bold">{req.status}</p>
          </div>

          {/* DR-OWN-04 ผลแสดงได้เฉพาะเมื่อสถานะเสร็จสิ้นและเผยแพร่แล้ว */}
          {req.status === REQUEST_STATUS.DONE && req.published && req.result ? (
            <div className="rounded border p-3">
              <p className="text-gray-600">ผลการตรวจสอบคุณสมบัติ</p>
              <p
                className={
                  'text-lg font-bold ' +
                  (req.result === ELIGIBILITY_RESULT.PASS ? 'text-green-800' : 'text-red-800')
                }
              >
                {req.result}
              </p>
              {/* FR-OWN-04 + DR-OWN-05 ผลไม่ผ่านต้องแสดงเหตุผลพร้อมจำนวนบนหน้าเดียวกัน */}
              {req.result === ELIGIBILITY_RESULT.FAIL && req.failReasons.length > 0 && (
                <ul className="mt-2 list-disc pl-5">
                  {req.failReasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              )}
            </div>
          ) : (
            <p className="rounded bg-gray-100 p-3 text-gray-700">
              ยังไม่มีผลการตรวจสอบคุณสมบัติให้แสดง
            </p>
          )}

          {/* FR-OWN-06 รายการที่ต้องดำเนินการเป็นรายข้อ */}
          {req.todoItems.length > 0 && (
            <div className="rounded border border-amber-300 bg-amber-50 p-3">
              <p className="font-bold text-amber-900">รายการที่ต้องดำเนินการ</p>
              <ul className="mt-1 list-disc pl-5 text-amber-900">
                {req.todoItems.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  )
}
