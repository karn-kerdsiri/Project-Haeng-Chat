# RTM: ตรวจสอบและอนุมัติผลการศึกษาของนักศึกษา
อ้างอิง: spec.md Draft v2 | plan.md | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-11-21 15:32 UTC | test: backend 46 ผ่าน 0 ไม่ผ่าน; frontend 46 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)

| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-APR-01 | AC-APR-03 ตรวจเฉพาะรายการว่าง; ไม่มี AC ตรวจรายการที่ไม่ว่างโดยตรง (Q-07) | T-04, T-05 (พร้อมทำ), T-08/T-09 (พร้อมทำ) | ไม่พบ API หรือ UI ของ advisor review | ไม่มี test รายการรอตรวจของ UC-09 | ช่องโหว่ (F001) |
| FR-APR-02 | AC-APR-01 (ไม่มี assertion รายละเอียด/การเลือกทีละคน; Q-01/Q-07) | T-14/T-15 (รอ Q-01) | ไม่พบหน้า detail หรือ endpoint ของ UC-09 | ไม่มี test รายละเอียดคำร้องของอาจารย์ | ช่องโหว่ (F001) |
| FR-APR-03 | AC-APR-01, AC-APR-02 | T-06/T-07 (พร้อมทำ), T-17 (รอ Q-02) | ไม่พบการเลือก decision และบันทึกผลของอาจารย์ | ไม่มี test AC-APR-01/02 ใน code | รอ Q-02 |
| FR-APR-04 | AC-APR-01 | T-16 (รอ Q-02) | ไม่พบ decision route หรือการบันทึกสถานะอนุมัติของ UC-09 | ไม่มี test บันทึกผล/สถานะของ UC-09 | รอ Q-02 |
| FR-APR-05 | AC-APR-02 | T-06/T-07 (พร้อมทำ), T-17 (รอ Q-02) | ไม่พบการตรวจเหตุผลหรือการส่งกลับใน UC-09 | ไม่มี test ตรวจเหตุผลและสถานะของ UC-09 | รอ Q-02 |
| FR-APR-06 | AC-APR-03 | T-08/T-09 (พร้อมทำ) | ไม่พบ queue endpoint หรือ empty-state UI ของ UC-09 | ไม่มี test AC-APR-03 ใน code | ยังไม่ถึง |
| FR-APR-07 | AC-APR-04 | T-10/T-11 (พร้อมทำ), T-21 (รอ Q-05) | ไม่พบ transaction/error flow ของการอนุมัติใน UC-09 | ไม่มี test คงสถานะเมื่อบันทึกของ UC-09 ล้มเหลว | รอ Q-05 |
| FR-APR-08 | AC-APR-01, AC-APR-08 | T-03 (พร้อมทำ), T-16/T-17 (รอ Q-02), T-21 (รอ Q-05) | ไม่พบ audit repository ที่เชื่อมกับการอนุมัติ/ส่งกลับของอาจารย์ | `test_API_client_calls_advisor_review_endpoints` ผ่านเฉพาะการส่ง request จำลอง | รอ Q-02/Q-05 |
| FR-APR-09 | AC-APR-06 ตรวจสถานะฝั่งนักศึกษาเท่านั้น; ไม่มี AC ตรวจสถานะล่าสุดฝั่งอาจารย์ (Q-07) | T-18 (รอ Q-02) | ไม่พบหน้า advisor review หรือการเชื่อมสถานะ UC-09 กับ UC-03 | ไม่มี test สถานะล่าสุดหลังการอนุมัติของ UC-09 | ช่องโหว่ (F001) |
| FR-APR-10 | AC-APR-07 | T-19 (รอ Q-02) | ไม่พบการส่งต่อจาก advisor review ไป UC-11 | ไม่มี test การดำเนินการต่อ UC-11 จาก UC-09 | รอ Q-02 |
| FR-APR-11 | AC-APR-05 | T-12 (พร้อมทำ) | ไม่พบ route/guard ที่ปฏิเสธอาจารย์นอกความดูแลสำหรับ UC-09 | ไม่มี test AC-APR-05 ของ UC-09 | ยังไม่ถึง |
| NFR-APR-01 | ไม่มี AC โดยตรง (Q-07) | T-02 (พร้อมทำ), T-25 (รอ Q-07) | ไม่พบ session timeout สำหรับอาจารย์ใน UC-09 | ไม่มี test 30-minute timeout ของ UC-09 | ยังไม่ถึง |
| NFR-APR-02 | AC-APR-05 | T-12 (พร้อมทำ) | มี `staff_verify_confirm.authz` สำหรับสิทธิ์เจ้าหน้าที่คนละ feature; ไม่พบ guard ของ advisor | backend auth tests ทดสอบ staff ไม่ใช่ advisor | ยังไม่ถึง |
| NFR-APR-03 | AC-APR-08 ตรวจฟิลด์/แก้ย้อนหลัง; ไม่ได้ตรวจ retention 1 ปี (Q-06) | T-03 (พร้อมทำ), T-22 (รอ Q-06) | ไม่พบ audit storage/retention ของ UC-09 | ไม่มี test retention หรือ immutable history ของ UC-09 | รอ Q-06 |
| NFR-APR-04 | AC-APR-02/04 ไม่ได้ระบุภาษา/ช่องที่ต้องแก้ (Q-07) | T-06/T-07/T-11 (พร้อมทำ), T-21 (รอ Q-05), T-25 (รอ Q-07) | ไม่พบข้อความผิดพลาดใน UI ของ UC-09 | ไม่มี test ภาษาไทยและช่องที่ต้องแก้ของ UC-09 | ยังไม่ถึง |
| NFR-APR-05 | ไม่มี AC โดยตรง (Q-06/Q-07) | T-23 (รอ Q-06/Q-07) | ไม่พบหน้าจอ UC-09 ที่ตรวจ mobile layout | ไม่มี mobile test ของ UC-09 | รอ Q-06/Q-07 |
| NFR-APR-06 | ไม่มี AC โดยตรง (Q-06/Q-07) | T-24 (รอ Q-06/Q-07) | ไม่พบการวัด p95 ของการบันทึกผล UC-09 | ไม่มี performance test ของ UC-09 | รอ Q-06/Q-07 |
| IF-AUTH-01 | ไม่มี AC ตรวจ HTTP 401 โดยตรง (Q-07); AC-APR-05 ตรวจ 403 | T-02 (พร้อมทำ), T-20 (รอ Q-05), T-25 (รอ Q-07) | ไม่พบ session guard ของ advisor review; guard ที่มีเป็น staff verification | ไม่มี test HTTP 401 ของ UC-09 | ยังไม่ถึง |
| IF-WEB-01 | ไม่มี AC โดยตรง | T-01 (เสร็จ รอทีมตรวจ), T-05/T-07/T-09/T-11 (พร้อมทำ) | มี React shell ของ UC-01–04 แต่ไม่มีหน้า UC-09 | `IF_WEB_01_application_shell_renders_all_four_screens` ผ่าน; ไม่ได้ตรวจ UC-09 | ยังไม่ถึง |
| IF-TECH-01 | ไม่มี AC ตรวจ React/PostgreSQL โดยตรง | T-01 (เสร็จ รอทีมตรวจ), T-03 (พร้อมทำ), T-16 (รอ Q-02) | มี API client ทั่วไป; ไม่พบหน้าจอ React หรือ persistence ของ UC-09 ใน PostgreSQL | `test_API_client_calls_advisor_review_endpoints` ผ่านเฉพาะ client mock | รอ Q-02 |
| IF-AUDIT-01 | AC-APR-01, AC-APR-08 | T-03 (พร้อมทำ), T-16/T-17 (รอ Q-02), T-21 (รอ Q-05), T-22 (รอ Q-06) | ไม่พบการบันทึกประวัติที่เชื่อมกับ decision ของ UC-09 | ไม่มี test audit history ของ UC-09 | รอ Q-02/Q-05/Q-06 |
| CON-APR-01 | AC-APR-05 ตรวจการห้ามกระทำ; การจำกัดรายการที่มองเห็นยังไม่มี AC โดยตรง (Q-07) | T-04/T-05/T-12 (พร้อมทำ), T-14 (รอ Q-01) | ไม่พบการกรองรายการและการตัดสินใจตาม advisor/student relationship ของ UC-09 | ไม่มี test scope ของ advisor ใน UC-09 | ช่องโหว่ (F001) |
| CON-APR-02 | AC-APR-04 | T-10/T-11 (พร้อมทำ), T-21 (รอ Q-05) | ไม่พบการ rollback สถานะคำร้องของ UC-09 เมื่อ save ล้มเหลว | ไม่มี test AC-APR-04 ของ UC-09 | รอ Q-05 |
| DR-APR-01 | AC-APR-03 ครอบคลุมรายการว่างเท่านั้น; ไม่มี AC ตรวจชื่อ/รหัส/สถานะในรายการจริง | T-04/T-05 (พร้อมทำ) | ไม่พบ queue ของ UC-09 | ไม่มี test field ของรายการที่ไม่ว่าง | ช่องโหว่ (F001) |
| DR-APR-02 | AC-APR-01 แต่ฟิลด์ที่แสดงรอ Q-01 | T-14/T-15 (รอ Q-01) | ไม่พบ detail response/UI ของ UC-09 | ไม่มี test รายละเอียดที่อาจารย์เห็น | รอ Q-01 |
| DR-APR-03 | AC-APR-01/02 | T-06/T-07 (พร้อมทำ), T-17 (รอ Q-02) | ไม่พบ decision values ของ UC-09 | ไม่มี test ผลตัดสินใจของ UC-09 | รอ Q-02 |
| DR-APR-04 | AC-APR-02 | T-06/T-07 (พร้อมทำ) | ไม่พบการบังคับเหตุผลก่อนส่งกลับใน UC-09 | ไม่มี test เหตุผลว่าง/เหตุผลที่กรอกของ UC-09 | ยังไม่ถึง |
| DR-APR-05 | AC-APR-01/08 | T-03 (พร้อมทำ), T-16/T-17 (รอ Q-02), T-21 (รอ Q-05) | ไม่พบ history record ที่ผูกกับการเปลี่ยนสถานะของ UC-09 | ไม่มี test actor/time/status-before/status-after ของ UC-09 | รอ Q-02/Q-05 |

สรุปแถว: ครบ 0, ยังไม่ถึง 8, รอ Q 15, ช่องโหว่ 5. T-01 เป็น task เดียวที่เสร็จรอทีมตรวจ และไม่มี AC โดยตรง; task ที่ตรวจ AC โดยตรงยังพร้อมทำหรือรอ Q. Test cases ของ AC-APR-01 มี 3 แถวสถานะ “ร่าง” และไม่มีแถว “ใช้ได้”; จึงยังไม่เข้าเกณฑ์เปิดข้อค้นพบ “test อ่อน/AC ไม่มี test” ตามขั้นที่ 3.

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)

| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/api/client.js: requestJson`, `getJson`, `postJson` | T-01; API paths ใน plan.md | ตรงเฉพาะ transport | รับ path จากผู้เรียกและส่ง JSON; ไม่มี advisor review API, authorization, decision logic หรือ persistence |
| `frontend/src/api/client.test.js: test_API_client_calls_advisor_review_endpoints` | T-01 | ตรงเฉพาะ client contract | ทดสอบ GET queue/detail และ POST decision กับ `fetch` จำลอง; ไม่ทดสอบ endpoint จริง, response schema, auth, audit หรือสถานะ |
| `backend/app/staff_verify_confirm/authz.py: can_staff_verify`, `require_staff_verification_access` | IDs ของ staff verification คนละ feature | ไม่ใช่ advisor authorization | ตรวจสิทธิ์เจ้าหน้าที่; ไม่จำกัดการเข้าถึงตามอาจารย์/นักศึกษาของ UC-09 |
| `backend/app/staff_verify_confirm/requests.py: filter_verification_requests`, `get_verification_request_detail` | IDs ของ staff verification คนละ feature | ไม่ใช่ advisor queue/detail | สร้างรายการและรายละเอียดสำหรับ staff verification; ไม่มี call site จาก UC-09 |
| `backend/app/staff_verify_confirm/decisions.py`, `actions.py: confirm_verification_request`, `return_for_correction`, `confirm_request` | IDs ของ staff verification คนละ feature | ไม่ใช่ advisor decision | เป็นการยืนยัน/ส่งกลับใน module เจ้าหน้าที่ ไม่ใช่การตัดสินของอาจารย์ตาม UC-09 |
| `backend/app/staff_verify_confirm/integration.py: run_uc16_verification_transaction`, `execute_uc16_confirmation` | UC-16 / staff verification; OUT-APR-02/03 หากนำมาใช้ใน UC-09 | อยู่ใน Out of scope ของ SPEC-APR-009 และไม่ถูกเรียกจาก UC-09 | คำนวณผลทางการและบันทึกสถานะใน module แยก; ไม่พบการเชื่อมเข้ากับ advisor review |
| `backend/app/staff_verify_confirm/history.py: build_history_entry`, `list_history`, `get_request_history` | IDs ของ staff verification คนละ feature | ไม่ใช่ IF-AUDIT-01 ของ UC-09 | สร้าง/กรองประวัติใน module staff; ไม่พบการเรียกจาก advisor review |
| `backend/app/staff_verify_confirm/publish.py: is_publish_ready`, `build_publish_list`, `mark_request_publish_ready` | UC-14 / staff verification; OUT-APR-04 หากนำมาใช้ใน UC-09 | อยู่ใน Out of scope ของ SPEC-APR-009 และไม่ถูกเรียกจาก UC-09 | เป็น flow เผยแพร่หลังยืนยันใน module แยก ไม่ได้เป็นการอนุมัติของ advisor |
| `backend/app/staff_verify_confirm/ui.py: build_thai_error_message`, `supports_mobile_viewport` | IDs ของ staff verification คนละ feature | ไม่ใช่ NFR-APR-04/05 ของ UC-09 | ข้อความและค่า mobile ที่พบเป็น helper ของ staff verification; ไม่มีหน้าจอ UC-09 เรียกใช้ |
| `backend/app/submit_additional_grades/validation.py: validate_grade_entry`, `grade_changed` | IDs ของ UC-02 | ไม่ใช่ FR-APR | ตรวจผลการเรียนเพิ่มเติม ไม่ใช่การตรวจ/อนุมัติของอาจารย์ |
| `frontend/src/App.jsx: PAGES`; `frontend/src/features/uc01-academic-record-entry/AcademicRecordEntry.jsx`, `uc02-submit-additional-grades/SubmitAdditionalGrades.jsx`, `uc03-view-own-result/OwnEligibilityResult.jsx`, `uc04-download-documents/DownloadDocuments.jsx` | IDs ของ UC-01–04 | ไม่ใช่ UI ของ UC-09 | shell มีหน้าจอนักศึกษา 4 use case; ไม่พบหน้า advisor review หรือการเชื่อม flow UC-09 |

ไม่พบ mockup HTML หรือหมวด UI แยกใน spec. ไม่มี backend endpoint หรือ frontend component สำหรับ UC-09; code ของ staff verification, UC-02 และ UC-01–04 เป็น modules แยกและไม่พบ call/import จาก advisor review. ไม่พบ field, error message หรือค่าคงที่ของ UC-09 ที่เปิดเผยข้อมูลนักศึกษานอกข้อกำหนด; ตัวอย่างชื่อ/รหัสใน tests เป็นข้อมูลจำลองของ feature อื่น.

## 3. ข้อค้นพบ

ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F001 | FR ไม่มี AC | `spec.md` > AC-APR-01/03/06, Traceability และ Q-07 | FR-APR-01, FR-APR-02, FR-APR-09; DR-APR-01; CON-APR-01 | AC-APR-03 ตรวจเพียงกรณีไม่มีรายการ จึงไม่มี AC ตรวจว่ารายการที่ไม่ว่างแสดงชื่อ/รหัส/สถานะและจำกัดเฉพาะนักศึกษาที่อาจารย์ดูแล; AC-APR-01 ไม่ assert การเลือกทีละคนหรือข้อมูลรายละเอียดที่แสดง (ยังรอ Q-01); AC-APR-06 ตรวจสถานะฝั่งนักศึกษา แต่ไม่มี AC ตรวจสถานะล่าสุดฝั่งอาจารย์. Q-07 ระบุช่องว่างที่เกี่ยวข้องแล้ว แต่ยังรอทีมยืนยันวิธีครอบคลุม | |
| F002 | อ้าง ID ผิดเรื่อง | `tasks.md` > ตารางตรวจความครบ / Acceptance Criteria | AC-APR-01, AC-APR-02, T-06 | รายละเอียด T-06 ระบุว่าตรวจ AC-APR-02 (ปฏิเสธส่งกลับเมื่อไม่มีเหตุผล) และรองรับ FR-APR-05; แต่ตารางสรุปยังใส่ T-06 ใต้ AC-APR-01 ด้วย ทำให้ trace ของ AC-APR-01 ระบุ task ที่ไม่ตรงกับรายละเอียดงาน | |

## 4. แก้แล้ว

| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|

