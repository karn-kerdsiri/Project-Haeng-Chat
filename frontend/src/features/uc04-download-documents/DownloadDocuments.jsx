// หน้าจอจำลองของ UC-04 ดาวน์โหลดเอกสารที่เกี่ยวข้อง (SPEC-DOC-004)
// รองรับ: FR-DOC-01, FR-DOC-02, FR-DOC-05, FR-DOC-07, DR-DOC-01, DR-DOC-02
// ไม่รองรับในหน้านี้: FR-DOC-03, FR-DOC-04, FR-DOC-06, FR-DOC-08
//                     (ตรวจสิทธิ์และส่งไฟล์จริง เป็นงานฝั่งหลังบ้าน)
// OUT-DOC-01 การอัปโหลดและแก้ไขเอกสารโดยเจ้าหน้าที่อยู่นอกขอบเขต จึงไม่มีปุ่มจัดการเอกสารในหน้านี้
import { useState } from 'react'
import { MOCK_DOCUMENTS } from './mock.js'

export default function DownloadDocuments() {
  const [hasDocuments, setHasDocuments] = useState(true)
  const [message, setMessage] = useState(null)

  const docs = hasDocuments ? MOCK_DOCUMENTS : []

  // DR-DOC-01 จัดกลุ่มตามหมวดหมู่ (ชื่อหมวดหมู่รอ Q-02)
  const groups = docs.reduce((acc, d) => {
    (acc[d.category] ||= []).push(d)
    return acc
  }, {})

  const onDownload = (doc) => {
    // FR-DOC-07 ไฟล์อ่านไม่ได้หรือหาไม่พบ ต้องแจ้งข้อความทั่วไปและไม่ส่งไฟล์ที่ไม่สมบูรณ์
    if (!doc.available) {
      setMessage({ type: 'error', text: 'ไฟล์นี้ยังไม่พร้อมให้ดาวน์โหลด กรุณาลองใหม่ภายหลัง' })
      return
    }
    // mock UI เท่านั้น ยังไม่เรียก API ดาวน์โหลดจริงตาม FR-DOC-04
    setMessage({ type: 'ok', text: `เริ่มดาวน์โหลด "${doc.name}" แล้ว (จำลอง)` })
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">เอกสารที่เกี่ยวข้อง</h2>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={!hasDocuments} onChange={(e) => setHasDocuments(!e.target.checked)} />
        จำลองกรณีไม่มีเอกสารที่เผยแพร่
      </label>

      {message && (
        <p
          role={message.type === 'error' ? 'alert' : 'status'}
          className={
            'rounded p-3 ' +
            (message.type === 'error' ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900')
          }
        >
          {message.text}
        </p>
      )}

      {/* FR-DOC-05 ไม่มีเอกสาร ต้องแจ้งข้อความ ไม่แสดงรายการว่างเปล่า */}
      {docs.length === 0 ? (
        <p className="rounded bg-gray-100 p-3 text-gray-700">
          ขณะนี้ยังไม่มีเอกสารที่เผยแพร่ให้ดาวน์โหลด
        </p>
      ) : (
        <div className="space-y-5">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-bold">{category}</h3>
              <ul className="divide-y rounded border">
                {items.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center gap-2 p-3">
                    <div className="min-w-0 flex-1">
                      {/* DR-DOC-01 ชื่อเอกสารและคำอธิบายว่าใช้ทำอะไร */}
                      <p className="font-medium break-words">{d.name}</p>
                      <p className="text-sm text-gray-600 break-words">{d.description}</p>
                    </div>
                    {/* FR-DOC-02 เลือกดาวน์โหลดครั้งละหนึ่งเอกสาร */}
                    <button className="rounded border px-3 py-2" onClick={() => onDownload(d)}>
                      ดาวน์โหลด
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
