# RTM: ตรวจสอบเงื่อนไขเบื้องต้นอัตโนมัติ
อ้างอิง: spec.md Draft v2 | plan.md | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-11-21 15:17 UTC | test: backend 46 ผ่าน 0 ไม่ผ่าน; frontend 46 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)

| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-PRE-01 | AC-PRE-01, AC-PRE-02 | T-02, T-03 (พร้อมทำ) | ยังไม่มี endpoint รับข้อมูล pre-check; `frontend/src/api/client.js: postJson` เป็นเพียง client กลาง | `test_API_client_posts_to_requested_path` ผ่าน แต่ตรวจเฉพาะการส่ง path/payload | ยังไม่ถึง |
| FR-PRE-02 | AC-PRE-01, AC-PRE-04 | T-13 (รอ Q-01) | ไม่พบ code อ่าน active conditions จาก PostgreSQL | ไม่มี test ของ pre-check | รอ Q-01 |
| FR-PRE-03 | AC-PRE-01 | T-14 (รอ Q-01) | ไม่พบ evaluator เปรียบเทียบข้อมูลกับเงื่อนไข | `test_AC_PRE_01_*` ผ่านเฉพาะการแสดง fixture ไม่ได้ทดสอบการเปรียบเทียบ | รอ Q-01 |
| FR-PRE-04 | AC-PRE-01 | T-04 (พร้อมทำ), T-14 (รอ Q-01) | `frontend/src/features/uc01-academic-record-entry/AcademicRecordEntry.jsx: PrecheckMockPanel` แสดง fixture เฉพาะ DEV; ไม่มีผลตรวจจริงเชื่อมเข้าหน้าจอ | `test_AC_PRE_01_renders_mock_preliminary_summary_and_condition_details` ผ่าน; `test_AC_PRE_01_renders_mock_pass_fixture_without_calculation` ผ่าน (ทั้งคู่เป็น mock UI) | รอ Q-01 |
| FR-PRE-05 | AC-PRE-02 | T-02, T-03 (พร้อมทำ), T-20 (รอ Q-06) | `postJson` ส่ง request ได้ แต่ `AcademicRecordEntry` ยังไม่เรียกเมื่อส่งข้อมูล | `test_API_client_posts_to_requested_path` ผ่าน; ไม่มี test ตรวจการส่งจากปุ่มหรือเวลาแสดงผล | ยังไม่ถึง |
| FR-PRE-06 | AC-PRE-03 | T-07 (พร้อมทำ), T-15 (รอ Q-01) | ไม่พบ logic/หน้าจอแจ้งรายการข้อมูลที่ขาดจากผล pre-check จริง | ไม่มี test ตรวจ AC-PRE-03 | รอ Q-01 |
| FR-PRE-07 | AC-PRE-04 | T-08 (พร้อมทำ), T-15 (รอ Q-01) | ไม่พบ logic ตรวจกรณีไม่มี active conditions | ไม่มี test ตรวจ AC-PRE-04 | รอ Q-01 |
| FR-PRE-08 | AC-PRE-05 | T-09, T-10 (พร้อมทำ), T-18 (รอ Q-04) | ไม่พบการจัดการข้อผิดพลาดจากแหล่งข้อมูล pre-check | ไม่มี test ตรวจ AC-PRE-05 | รอ Q-04 |
| FR-PRE-09 | AC-PRE-06 | T-11 (พร้อมทำ), T-17 (รอ Q-03) | ไม่พบ evaluator ของ pre-check; `AcademicRecordEntry: summarize` นับยอดในฟอร์ม UC-01 เท่านั้น | มี test ยอดรวมฟอร์ม UC-01; ไม่มี test ว่าผลไม่สมบูรณ์ไม่ผ่าน evaluator | ยังไม่ถึง |
| FR-PRE-10 | AC-PRE-07 | T-05, T-06 (พร้อมทำ), T-19 (รอ Q-05) | fixture ไม่เชื่อมกับการส่งหรือสถานะคำร้อง; ไม่พบ pre-check flow จริง | ไม่มี test ตรวจว่าส่งต่อได้และสถานะไม่เปลี่ยนจากผล pre-check | ยังไม่ถึง |
| NFR-PRE-01 | AC-PRE-02 | T-20 (รอ Q-06) | ไม่พบการจับเวลาตั้งแต่กดส่งจนแสดงผล | ไม่มี performance test ของ pre-check | รอ Q-06 |
| NFR-PRE-02 | AC-PRE-08 | T-12 (พร้อมทำ), T-16 (รอ Q-02) | พบ integration ของ UC-16 ใน `backend/app/staff_verify_confirm/integration.py` แต่ไม่พบการเทียบผลกับ UC-07 หรือใช้ condition set เดียวกัน | ไม่มี test เปรียบเทียบ UC-07/UC-16 | รอ Q-02 |
| NFR-PRE-03 | AC-PRE-03 ตาม Traceability (ไม่ได้กำหนดภาษาไทยชัดเจน) | T-04, T-07, T-08, T-10 (พร้อมทำ), T-18 (รอ Q-04) | มีข้อความตัวอย่างภาษาไทยใน `PrecheckMockPanel`; ไม่พบ error/missing-field output จาก pre-check จริง | มี test แสดงข้อความ fixture; ไม่มี test ตรวจภาษาไทยและช่องที่ต้องแก้ใน error จริง | ช่องโหว่ (F001) |
| NFR-PRE-04 | ไม่มี AC โดยตรง; spec Traceability ชี้ AC-PRE-03 | T-21 (รอ Q-06) | หน้าฟอร์ม UC-01 ใช้ responsive classes; ไม่พบการตรวจหน้าผล pre-check ที่ 360 px | ไม่มี mobile test ของ pre-check | ช่องโหว่ (F001) |
| NFR-PRE-05 | ไม่มี AC โดยตรง; spec Traceability ชี้ AC-PRE-03 | T-02 (พร้อมทำ) | ไม่พบการตรวจ student session หรือ idle timeout ใน code ของ pre-check | ไม่มี session timeout test ของ UC-07; test ใน backend เป็นของ feature อื่น | ช่องโหว่ (F001) |
| IF-AUTH-01 | ไม่มี AC โดยตรง | T-02 (พร้อมทำ) | ไม่พบ endpoint/guard สำหรับ student session ของ pre-check; guard ที่พบเป็น staff verification คนละ feature | ไม่มี test สำหรับ IF-AUTH-01 ของ UC-07 | ยังไม่ถึง |
| IF-WEB-01 | ไม่มี AC โดยตรง | T-01 (เสร็จ รอทีมตรวจ), T-03, T-04 (พร้อมทำ) | React shell และ UC-01 ทำงานใน browser; pre-check ที่พบเป็น preview เท่านั้น | มี UI smoke tests ผ่าน; ไม่ได้ยืนยัน flow pre-check จริง | ยังไม่ถึง |
| IF-TECH-01 | ไม่มี AC โดยตรง | T-01 (เสร็จ รอทีมตรวจ), T-13 (รอ Q-01) | มี React UI; ไม่พบการอ่านเงื่อนไข pre-check จาก PostgreSQL | ไม่มี test การอ่าน PostgreSQL สำหรับ UC-07 | รอ Q-01 |
| IF-MST-01 | AC-PRE-01, AC-PRE-04 | T-13, T-15 (รอ Q-01) | ไม่พบ source/repository ของ active conditions; fixture เป็นผลตัวอย่าง ไม่ใช่กติกาเปรียบเทียบ | ไม่มี test ว่าอ่านเงื่อนไขที่เจ้าหน้าที่จัดการและไม่ฝังกติกาใน code | รอ Q-01 |
| DOM-GRADE-01 | AC-PRE-06 | T-11 (พร้อมทำ), T-17 (รอ Q-03) | ไม่พบ evaluator pre-check; grade totals ในฟอร์ม UC-01 ไม่ใช่ผลเปรียบเทียบเงื่อนไข | ไม่มี test สำหรับ invariant ของ pre-check | ยังไม่ถึง |
| CON-PRE-01 | AC-PRE-01, AC-PRE-07 | T-04, T-05, T-06 (พร้อมทำ), T-19 (รอ Q-05) | `PrecheckMockPanel` ระบุชัดว่าเป็นตัวอย่างและไม่ใช่ผลทางการ; ยังไม่มีผล pre-check จริง | สอง test ของ AC-PRE-01 ผ่านกับ fixture; test แรกตรวจคำระบุว่าเป็น mock; ไม่มี test flow จริง | ยังไม่ถึง |
| CON-PRE-02 | AC-PRE-02 | T-02, T-03 (พร้อมทำ), T-20 (รอ Q-06) | ไม่พบการเรียก pre-check จาก submit handler ของ UC-01 | ไม่มี test ว่ากดส่งแล้วเริ่มตรวจทันที | ยังไม่ถึง |
| DR-PRE-01 | AC-PRE-01, AC-PRE-02 | T-02, T-03 (พร้อมทำ) | มี input form ของ UC-01 แต่ไม่พบการส่งปีการศึกษา/รายวิชา/เกรดไปยัง pre-check | test client ใช้ payload ตัวอย่างทั่วไป ไม่ได้ตรวจการส่งข้อมูลจากฟอร์ม | ยังไม่ถึง |
| DR-PRE-02 | AC-PRE-01 | T-04 (พร้อมทำ), T-14 (รอ Q-01) | `PrecheckMockPanel` แสดง summary, รายข้อ, compared data และ reason จาก fixture; ไม่ใช่ผลตรวจจริง | test AC-PRE-01 ผ่านสำหรับ fixture บางกรณีเท่านั้น | รอ Q-01 |
| DR-PRE-03 | AC-PRE-06 | T-11 (พร้อมทำ), T-17 (รอ Q-03) | ไม่พบการจัดประเภทผล incompletely graded ใน pre-check | ไม่มี test; รูปแบบสถานะยังรอ Q-03 | รอ Q-03 |
| DR-PRE-04 | AC-PRE-01, AC-PRE-04 | T-13, T-15 (รอ Q-01) | ไม่พบการเลือก condition set ตามภาคการศึกษาจาก source จริง | ไม่มี test ตรวจ condition set ที่ active ในภาคการศึกษานั้น | รอ Q-01 |

สรุปแถว: ครบ 0, ยังไม่ถึง 10, รอ Q 13, ช่องโหว่ 3. ไม่มี task ที่เกี่ยวข้องกับ AC-PRE-01 ถึง AC-PRE-08 อยู่ในสถานะ “เสร็จ” หรือ “เสร็จ รอทีมตรวจ”; จึงยังไม่ใช้เกณฑ์เปิดข้อค้นพบ “test อ่อน/AC ไม่มี test” กับ AC เหล่านั้น. Test cases ของ UC-07 ยังไม่มีแถวสถานะ “ใช้ได้”; แถวที่มีเป็น “ร่าง” หรือ “รอ Q-01”.

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)

| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/api/client.js: requestJson`, `getJson`, `postJson` | IF-WEB-01, task T-01; comment อ้าง FR-PRE-05 | บางส่วน | เป็น transport ทั่วไปที่รับ path จากผู้เรียกและส่ง JSON; ยังไม่มี caller จาก UC-01 เพื่อเริ่ม pre-check หรือแสดงผล |
| `frontend/src/features/uc01-academic-record-entry/AcademicRecordEntry.jsx: PrecheckMockPanel` | FR-PRE-04, DR-PRE-02, CON-PRE-01 | ตรงเฉพาะ mock UI | แสดง fixture ใน DEV และระบุว่าไม่ใช่ผลทางการ; ไม่คำนวณหรือเรียก API ตาม comment/implementation |
| `frontend/src/features/uc01-academic-record-entry/mock.js: PRECHECK_MOCK_FIXTURES` | FR-PRE-04, DR-PRE-02 | ตรงในฐานะข้อมูลจำลอง | เป็นผลตัวอย่างที่ระบุชัดว่าไม่ใช่เงื่อนไขจริงหรือผลคำนวณ; ไม่พบ hard-coded comparison rule ของ pre-check |
| `frontend/src/features/uc01-academic-record-entry/AcademicRecordEntry.jsx: AcademicRecordEntry submit handler` | OUT-PRE-03 (UC-01); ยังไม่รองรับ FR-PRE-05 | ไม่ใช่ implementation ของ UC-07 | submit handler เปลี่ยน local stage; ไม่เรียก `postJson` หรือ pre-check endpoint |
| `frontend/src/features/uc01-academic-record-entry/AcademicRecordEntry.test.jsx: test_AC_PRE_01_*` | AC-PRE-01 (ชื่อ test) | บางส่วน | ทั้งสอง test ผ่าน แต่ assert การ render fixture เท่านั้น ไม่ทดสอบ evaluator, condition source หรือข้อมูลจาก request |
| `backend/app` (ทั้งหมด) | ไม่มี FR-PRE ที่ทำให้เป็นจริง | ไม่พบ endpoint/service ของ UC-07 | ไฟล์ที่พบเป็น `submit_additional_grades` และ `staff_verify_confirm`; ไม่พบการเชื่อมจาก pre-check |
| `backend/app/staff_verify_confirm/integration.py: run_uc16_verification_transaction`, `execute_uc16_confirmation` | IDs ของ verification module อื่น; เกี่ยวข้องกับ OUT-PRE-01/04 หากนำมาใช้แทน UC-07 | ไม่ถูกเรียกจาก UC-07 | เป็น flow ยืนยัน/คำนวณของอีก module; ไม่พบ call/import จาก pre-check จึงไม่ถือว่า pre-check ใช้ผลทางการ |
| `frontend/src/App.jsx`, `frontend/src/main.jsx` และ `frontend/src/index.css` | IF-WEB-01 (โครงหน้าจอ) | โครงระบบทั่วไป | เปิด UC-01–04 ใน React shell; ไม่มี endpoint หรือ logic pre-check ใน shell |

## 3. ข้อค้นพบ

ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F001 | อ้าง ID ผิดเรื่อง | `spec.md` > Traceability, แถว NFR-PRE-05/NFR-PRE-03/NFR-PRE-04 | AC-PRE-03 | AC-PRE-03 ตรวจข้อมูลไม่เพียงพอและรายการที่ต้องกรอกเพิ่ม ไม่ได้ตรวจ timeout 30 นาทีของ NFR-PRE-05 หรือ mobile 360 px ของ NFR-PRE-04; ไม่ได้ระบุชัดว่าข้อความเป็นภาษาไทยตาม NFR-PRE-03. การ map ทั้งสาม NFR ไป AC-PRE-03 จึงไม่รองรับการตรวจครบตามข้อความ NFR | |
| F002 | โค้ดไม่มี FR | `frontend/src/features/uc01-academic-record-entry/AcademicRecordEntry.jsx: PrecheckMockPanel` | ไม่มี FR รองรับข้อความนี้ | ข้อความ “ตัวอย่างทั้งสองกรณีไม่เกี่ยวข้องกับยอดรวมผลการเรียนของนักศึกษาที่แสดงในแบบฟอร์ม” เป็นข้อความเพิ่มใน mock panel; ไม่พบ requirement ที่กำหนดให้แสดงข้อความนี้. ปรากฏเฉพาะส่วนตัวอย่างใน DEV | |

## 4. แก้แล้ว

| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|

