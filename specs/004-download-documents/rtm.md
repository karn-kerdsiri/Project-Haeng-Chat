# RTM: ดาวน์โหลดเอกสารที่เกี่ยวข้อง
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-11-21 14:40 | test: 87 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-DOC-01 | AC-DOC-02 | T-02, T-03, T-04 | `frontend/src/features/uc04-download-documents/DownloadDocuments.jsx: DownloadDocuments`, `mock.js: MOCK_DOCUMENTS` | `TC-DOC-02-1.test.jsx`, `TC-DOC-02-3.test.jsx`, `TC-DOC-03-1.test.jsx` ผ่านบน mock UI | ยังไม่ถึง |
| FR-DOC-02 | AC-DOC-01 | T-04, T-05 | `DownloadDocuments.jsx: onDownload` และปุ่มดาวน์โหลดต่อรายการ | test Vitest มีปุ่ม/กดรายการ, backend ไม่มี API/download test จริง | ยังไม่ถึง |
| FR-DOC-03 | AC-DOC-01, AC-DOC-04 | T-5, T-7 | ไม่พบโค้ดตรวจสิทธิ์ก่อนส่งไฟล์ของ UC-04 | ไม่มี test implementation ของสิทธิ์/download backend | ยังไม่ถึง |
| FR-DOC-04 | AC-DOC-01 | T-5 | ไม่พบโค้ดส่งไฟล์จริง/stream | ไม่มี test backend ส่ง bytes ของเอกสาร | ยังไม่ถึง |
| FR-DOC-05 | AC-DOC-03 | T-3, T-4 | `DownloadDocuments.jsx: hasDocuments`, branch ว่าง | `TC-DOC-03-1.test.jsx`, `TC-DOC-03-3.test.jsx` ผ่านบน mock UI | ยังไม่ถึง |
| FR-DOC-06 | AC-DOC-04 | T-5 | ไม่พบโค้ด 403 สำหรับ direct download | ไม่มี test backend UC-04 403 | ยังไม่ถึง |
| FR-DOC-07 | AC-DOC-05 | T-6 | `DownloadDocuments.jsx: onDownload` | `AC-DOC-05-FR-DOC-07-reports-a-file-that-is-not-ready` และ TC-DOC-05-1 ผ่านบน mock UI | ยังไม่ถึง |
| FR-DOC-08 | AC-DOC-04 | T-5 | ไม่พบโค้ด direct URL/file request ของ UC-04 | ไม่มี test backend ปฏิเสธ direct request | ยังไม่ถึง |
| NFR-DOC-01 | AC-DOC-07 | T-7 | ไม่พบ idle timeout/session ของ UC-04 | ไม่มี test UC-04 session timeout | ยังไม่ถึง |
| NFR-DOC-02 | AC-DOC-04 | T-5, T-7 | ไม่พบ download URL/session authorization | ไม่มี test backend 401/403/download | ยังไม่ถึง |
| NFR-DOC-03 | ไม่มี AC สำหรับ availability ระดับเดือน | T-8 | ไม่พบตัววัด availability | ไม่มี test/metric 99% ต่อเดือน | ยังไม่ถึง |
| NFR-DOC-04 | AC-DOC-05 | T-6 | `DownloadDocuments.jsx: error message`; ข้อความภาษาไทย | `AC_DOC_05_FR_DOC_07_reports_a_file_that_is_not_ready` ผ่านบน mock UI | ยังไม่ถึง |
| NFR-DOC-05 | AC-DOC-07 ใน spec ไม่น่า; ไม่มี AC; Q-03 | T-4, T-8 | UI ใช้ flex-wrap/part of shell; ไม่มี viewport 360-specific test | ไม่มี test 360 px/horizontal scroll สำหรับ UC-04 | รอ Q-03 |
| NFR-DOC-06 | ไม่มี AC; Q-03 | T-8 | ไม่พบ timing/send-time measurement | ไม่มี test เริ่มส่งไฟล์ 10 MB ภายใน 3 วินาที | รอ Q-03 |
| IF-AUTH-01 | AC-DOC-04, AC-DOC-07 | T-3, T-5, T-7 | ไม่พบ session guard บน API UC-04 | ไม่มี test backend UC-04 401/403 | ยังไม่ถึง |
| IF-WEB-01 | ไม่มี AC โดยตรง | T-4 | React/Vite shell และหน้า UC-04 ใน `frontend/src/` | `IF_WEB_01_application_shell_renders_all_four_screens` ผ่าน | ครบ |
| IF-TECH-01 | ไม่มี AC โดยตรง | T-1, T-2 | React มีอยู่; ไม่มี PostgreSQL storage/listing implementation | ไม่มี test repository/metadata integration | ยังไม่ถึง |
| CON-FILE-01 | AC-DOC-06 | T-2, T-3 | ไม่พบ validation/type/size ใน backend หรือ mock data | ไม่มี test `.docx`, 10 MB, >10 MB | ยังไม่ถึง |
| CON-DOC-01 | AC-DOC-04 | T-5 | ไม่พบ direct download authorization implementation | ไม่มี test ตรวจสิทธิ์ก่อนส่งไฟล์ทุกครั้ง | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/features/uc04-download-documents/DownloadDocuments.jsx: DownloadDocuments` | FR-DOC-01, FR-DOC-02, FR-DOC-05, FR-DOC-07 | บางส่วนใน mock UI | แสดงรายการ mock และข้อความ error; ไม่มีข้อมูลจริง/API/download |
| `DownloadDocuments.jsx: onDownload` | FR-DOC-02, FR-DOC-07 | mock-only | กดปุ่มจะตอบ status หรือ unreadable message โดยไม่ส่งไฟล์จริง |
| `mock.js: MOCK_DOCUMENTS` | DR-DOC-01, DR-DOC-02 | บางส่วน; มีหมวดหมู่ตัวอย่าง | เป็นข้อมูลจำลอง พร้อมค่าว่าง/สถานะ mock ไม่ใช่ฐานข้อมูล |
| `mock.js: category 'หมวดหมู่ตัวอย่าง...'` | DR-DOC-01, Q-02 | ไม่ตรงกับชื่อที่อนุมัติ | Q-02 ยังเปิดและไม่มีชื่อหมวดหมู่ที่อนุมัติ |
| `DownloadDocuments.jsx: checkbox จำลองกรณีไม่มีเอกสารที่เผยแพร่` | FR-DOC-05/ทดสอบ | ของ mock test | ไม่มี FR/task ที่กำหนดให้ผู้ใช้มี checkbox สลับสถานะจริง |
| `DownloadDocuments.jsx: doc.available === false` | FR-DOC-07 | mock สำหรับไฟล์ไม่พร้อม | ไม่ได้ตรวจ object/file จริง; เป็นค่าสถานะใน mock |
| `frontend/src/App.jsx: PAGES` | IF-WEB-01 | ใช่สำหรับ shell | หน้า UC-04 render บน React shell |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F001 | เดา Q-02 | `frontend/src/features/uc04-download-documents/mock.js` | ชื่อหมวดหมู่ยังไม่อนุมัติ | Mock ใช้ “หมวดหมู่ตัวอย่าง ก/ข (รอ Q-02)” เป็นชื่อที่แสดง แม้ spec ระบุว่าชื่อหมวดหมู่รอทีมยืนยันและยังไม่มีแหล่งกำหนด | |
| F002 | ของแถม | `DownloadDocuments.jsx: checkbox จำลองกรณีไม่มีเอกสารที่เผยแพร่` | ไม่มี FR/task รองรับการสลับสถานะ mock ผ่าน checkbox | Checkbox นี้เป็นเครื่องมือจำลอง mock UI และไม่ตรงพฤติกรรมผู้ใช้ตาม spec; มีทดสอบเฉพาะ empty state เท่านั้น | |
| F003 | FR ไม่มี AC | NFR-DOC-05 และ NFR-DOC-06 | NFR-DOC-05/06 ไม่มีการทดสอบที่อนุมัติและกำกับด้วย Q-03 | Q-03 ยังเปิดอยู่ จึงไม่มี AC สำหรับ 360 px/horizontal scroll และเวลาส่งไฟล์ 10 MB ภายใน 3 วินาที | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
