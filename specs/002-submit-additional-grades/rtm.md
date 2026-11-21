# RTM: ส่งผลการเรียนเพิ่มเติม
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-11-21 14:24 | test: 87 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-ADD-01 | AC-ADD-01 มีบางส่วนใน Then สถานะ/ระเบียน แต่ไม่มีส่วนที่ระบุรายการเกรดเดิมครบ; OQ-ADD-11 เสนอ AC-ADD-11 แต่ยังไม่มี AC ใหม่ | T-03 | `frontend/src/features/uc02-submit-additional-grades/SubmitAdditionalGrades.jsx: SubmitAdditionalGrades`, `mock.js: MOCK_EXISTING_ENTRIES` | `FR_ADD_01_shows_each_existing_course_with_its_saved_grade` ผ่าน | ช่องโหว่ |
| FR-ADD-02 | AC-ADD-02 | T-03 | `SubmitAdditionalGrades.jsx: SubmitAdditionalGrades` | `AC_ADD_02_FR_ADD_02_blocks_the_form_when_there_is_no_base_record` ผ่าน แต่ test ไม่ตั้งสถานะไม่มีข้อมูลเดิม จึงไม่ตรวจ Then จริง | ช่องโหว่ |
| FR-ADD-03 | ไม่มี AC โดยตรง; OQ-ADD-11 เสนอ AC-ADD-12 | T-04 | `SubmitAdditionalGrades.jsx: validateEntry`; `mock.js: MOCK_COURSES` | `DR_ADD_04_rejects_a_course_not_in_the_master_list`, frontend `DR_ADD_04_rejects_a_course_not_in_the_master_list` ผ่าน | ช่องโหว่ |
| FR-ADD-04 | AC-ADD-04 | T-04 | `validation.py: validate_grade_entry`; `SubmitAdditionalGrades.jsx: validateEntry` | `test_AC_ADD_04_rejects_an_invalid_grade_with_a_thai_field_error`, `AC_ADD_04_DR_ADD_02_rejects_a_grade_outside_the_allowed_set` ผ่าน | ช่องโหว่ |
| FR-ADD-05 | AC-ADD-03 | T-05 | `SubmitAdditionalGrades.jsx: confirming block`, `hasGradeChanged` | `AC_ADD_03_FR_ADD_05_asks_to_confirm_the_old_and_new_grade_before_saving`, `TC_ADD_03_1_confirmation_screen_names_course_old_and_new_grade` ผ่าน แต่ไม่ยืนยันและตรวจระเบียน/จำนวนหลังยืนยัน | ช่องโหว่ |
| FR-ADD-06 | ไม่มี AC โดยตรง; OQ-ADD-11 เสนอ AC-ADD-14 | T-05 | `SubmitAdditionalGrades.jsx: confirming block`, เพิ่มรายวิชา | ไม่มี test ที่ตรวจหน้าสรุปข้อมูลทั้งหมดก่อนบันทึกการเพิ่มรายวิชา | ช่องโหว่ |
| FR-ADD-07 | AC-ADD-01 | T-07 | ไม่มี implementation จริง; mock UI ตั้ง `saved=true` และเพิ่ม state ในหน่วยความจำ | ทดสอบหน้าแสดงสถานะ/แถวผ่าน แต่ไม่มี test backend ของการบันทึกจริง | ยังไม่ถึง |
| FR-ADD-08 | AC-ADD-05 | T-06 | ไม่พบโค้ดอ่าน/ตรวจตารางเวลาช่วงเปิดรับของ UC-02 | ไม่มี test backend/frontend ที่ทดสอบช่วงเวลาเปิด-ปิดจริง | รอ Q-ADD-07, OQ-ADD-08 |
| FR-ADD-09 | AC-ADD-06 | T-07 | ไม่พบ transaction/rollback สำหรับ UC-02 | ไม่มี test backend/frontend ของการบันทึกล้มเหลวจริง | ยังไม่ถึง |
| FR-ADD-10 | ไม่มี AC โดยตรง; OQ-ADD-11 เสนอ AC-ADD-13 | T-03, T-07 | `SubmitAdditionalGrades.jsx: status block`, `saved` | `TC_ADD_01_2_shows_latest_status_and_the_new_row_after_saving` ผ่านบน mock | ช่องโหว่ |
| FR-ADD-11 | AC-ADD-07 | T-07 | ไม่พบโค้ดส่งต่อผล I และตั้ง flag ไม่ผ่าน | ไม่มี test ที่ผูกกับขั้นตรวจสอบจริง | ยังไม่ถึง |
| NFR-ADD-01 | AC-ADD-09 | T-02, T-08 | ไม่พบ idle timeout/session activity monitor ของ UC-02 | ไม่มี test UC-02 ที่จำลอง idle 30 นาที | ยังไม่ถึง |
| NFR-ADD-02 | AC-ADD-08 | T-02 | ไม่พบ endpoint หรือ authz ของ UC-02 | ไม่มี test UC-02 ของ student B/403 | ยังไม่ถึง |
| NFR-ADD-03 | AC-ADD-04 | T-08 | `validation.py: ValidationIssue.message`; `SubmitAdditionalGrades.jsx: errors` | test invalid grade ภาษาไทยผ่าน | ช่องโหว่ |
| NFR-ADD-04 | OQ-ADD-11 เสนอ AC-ADD-15 แต่ยังไม่มี AC ใหม่ | T-08 | shell ใช้ `overflow-x-hidden` และ layout `flex-wrap`; ไม่มี viewport 360 ที่เฉพาะ UC-02 | ไม่มี test UC-02 ที่วัดความกว้าง 360 | ช่องโหว่ |
| NFR-ADD-05 | AC-ADD-06 | T-07 | ไม่พบ transaction สำหรับเพิ่ม/แก้เกรดใน UC-02 | ไม่มี test backend ของ business transaction | ยังไม่ถึง |
| NFR-ADD-06 | OQ-ADD-11 เสนอ AC-ADD-16 แต่ยังไม่มี AC ใหม่ | T-08 | ไม่พบวัด/บันทึก p95 ของ UC-02 | ไม่มี test p95 ของ UC-02 | ยังไม่ถึง |
| IF-AUTH-01 | AC-ADD-08, AC-ADD-09 | T-02 | ไม่พบตรวจ session ทุก request ของ UC-02 | ไม่มี test UC-02 session | ยังไม่ถึง |
| IF-WEB-01 | ไม่มี AC แต่มี shell smoke test | T-08 | React component ทั้งหมดเป็นเว็บ | `IF_WEB_01_application_shell_renders_all_four_screens` ผ่าน | ยังไม่ถึง |
| IF-TECH-01 | ไม่มี AC เฉพาะ | T-01 | React มีอยู่; ไม่พบ PostgreSQL model/migration ของ UC-02 | ไม่มี test mapping/model | ยังไม่ถึง |
| IF-SCHED-01 | AC-ADD-05 | T-01, T-06 | ไม่พบตารางเวลา/การอ่านช่วงเปิดรับใน backend หรือ UI จริง | ไม่มี test schedule | รอ Q-ADD-07, OQ-ADD-08 |
| DOM-GRADE-01 | AC-ADD-07 | T-04, T-07 | frontend/backend เก็บชุดเกรด ALLOWED; ยังไม่แยกผล I ไม่ผ่านใน persistence | test set grade ผ่าน; ไม่มี test I ในขั้นตรวจสอบจริง | ยังไม่ถึง |
| DOM-COURSE-01 | OQ-ADD-11 เสนอ AC-ADD-12 | T-01, T-04 | `mock.js: MOCK_COURSES`, `validateEntry` ใช้ mock list | test ปฏิเสธรายวิชาไม่อยู่ mock ผ่าน | ยังไม่ถึง |
| CON-ADD-01 | AC-ADD-01 | T-01, T-07 | ไม่มี AcademicRecord/persistence; mock UI เก็บ state ใน array ระเบียน | test frontend สมมติแถวใน state แต่ไม่เชื่อมคำร้องจริง | ยังไม่ถึง |
| CON-ADD-02 | AC-ADD-03, DR-ADD-05 | T-04 | `validation.py: validate_grade_entry`; `SubmitAdditionalGrades.jsx: validateEntry` | duplicate/different term tests ผ่าน; AC3 ยังไม่ตรวจจำนวนระเบียนหลังยืนยัน | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/submit_additional_grades/validation.py: validate_grade_entry` | DR-ADD-01, DR-ADD-02, DR-ADD-04, DR-ADD-05 | ใช่สำหรับกฎ validation ของรายการเดียว | ยังไม่มีบันทึก/คำร้อง/transaction |
| `backend/app/submit_additional_grades/validation.py: grade_changed` | DR-ADD-06 | ใช่ | เทียบเฉพาะค่าเกรด ไม่เป็นการบันทึกจริง |
| `frontend/src/features/uc02-submit-additional-grades/SubmitAdditionalGrades.jsx: validateEntry` | DR-ADD-01, DR-ADD-02, DR-ADD-04, DR-ADD-05 | ใช่สำหรับ mock UI | ซ้ำ logic backend ตามคอมเมนต์ และยังไม่มี API |
| `frontend/src/features/uc02-submit-additional-grades/SubmitAdditionalGrades.jsx: confirming block` | FR-ADD-05, FR-ADD-06 | บางส่วน | แสดง old/new สำหรับแก้เกรด แต่ไม่มีสรุปก่อนบันทึกเพิ่มรายวิชาเต็มรูปแบบ |
| `frontend/src/features/uc02-submit-additional-grades/SubmitAdditionalGrades.jsx: SubmitAdditionalGrades` | FR-ADD-01, FR-ADD-02, FR-ADD-03, FR-ADD-07, FR-ADD-10 | บางส่วนเป็น mock | `hasBaseRecord`, รายการ mock, เพิ่ม state และเปลี่ยน status เป็น state ในหน่วยความจำ ไม่มีฐานข้อมูล/AcademicRecord |
| `frontend/src/features/uc02-submit-additional-grades/mock.js: MOCK_COURSES` | DOM-COURSE-01 | ไม่ใช่แหล่งข้อมูลจริง | เป็น mock courses ตามบันทึกในไฟล์; งานเชื่อม master data ยังรอ source models |
| `frontend/src/features/uc02-submit-additional-grades/mock.js: REQUEST_STATUS` | ASM-ADD-04 | ใช่ | ค่ารอตรวจสอบ/เสร็จสิ้นมาจาก spec แต่ status persistence ยังไม่มี |
| `frontend/src/features/uc02-submit-additional-grades/mock.js: ALLOWED_GRADES` | DR-ADD-02, ASM-ADD-05 | ใช่รวม T/I/W | การนับ I/T ไม่สมบูรณ์ยังไม่มี implementation ตาม OQ-ADD-01 |
| `frontend/src/App.jsx: PAGES` | IF-WEB-01 | บางส่วน | เป็น shell React ที่ทดสอบการเปิดหน้าจอ mock |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F001 | FR ไม่มี AC | FR-ADD-01 | ความต้องการให้แสดงรายวิชา/เกรดเดิม/สถานะครบ | AC-ADD-01 เน้นบันทึกและไม่มี Then ที่ตรวจรายการเกรดเดิมทั้ง 3; OQ-ADD-11 เสนอ AC-ADD-11 แต่ยังไม่ได้อนุมัติ | |
| F002 | FR ไม่มี AC | FR-ADD-03 | เลือกจากข้อมูลรายวิชาจริง | ไม่มี AC ที่ตรวจการเลือกจากข้อมูลกลางโดยตรง; OQ-ADD-11 เสนอ AC-ADD-12 แต่ยังไม่มีใน spec | |
| F003 | FR ไม่มี AC | FR-ADD-06 | แสดงข้อมูลที่กรอกให้นักศึกษายืนยันก่อนบันทึก | ไม่มี AC ของการสรุปข้อมูลการเพิ่มรายวิชาก่อนบันทึก; OQ-ADD-11 เสนอ AC-ADD-14 แต่ยังไม่มี | |
| F004 | FR ไม่มี AC | FR-ADD-10 | แสดงสถานะคำร้องล่าสุดหลังบันทึก | ไม่มี AC ระบุการแสดงสถานะล่าสุดโดยตรงนอก OQ-ADD-11; AC-ADD-01 มีสถานะเป็นผลหลังบันทึกแต่ไม่ได้สั่งการแสดงหน้า | |
| F005 | test อ่อน | AC-ADD-02; `SubmitAdditionalGrades.test.jsx: AC_ADD_02_FR_ADD_02...` | Then ต้องไม่มีฟอร์มและแจ้งส่งผลหลักก่อน | Test นี้เริ่มจาก mock ที่มีข้อมูลเดิมและเพียงตรวจว่าฟอร์มปรากฏ จึงไม่มีทางล้มเมื่อลบบรรทัด guard `hasBaseRecord` ออก | |
| F006 | test อ่อน | AC-ADD-04; `test_validation.py` และ Vitest | Then ต้องไม่บันทึกและแจ้งภาษาไทยที่ช่องเกรด | Unit test ตรวจรายการ validation แต่ไม่มีคำสั่งบันทึกใดถูกเรียกจริง; Vitest ตรวจฟังก์ชัน error ไม่ได้ตรวจว่าไม่บันทึก | |
| F007 | test อ่อน | AC-ADD-03; `SubmitAdditionalGrades.test.jsx` | Then ยืนยันแล้วเกรดเปลี่ยนและระเบียนยังเหลือ 1 | Test เปิดหน้ายืนยันและเห็น I/B แต่ไม่กดยืนยัน จึงไม่มี assert เกรดเปลี่ยนหรือจำนวนระเบียน | |
| F008 | ตัวเลขไม่ตรง spec | `frontend/src/features/uc02-submit-additional-grades/mock.js: SEMESTERS` | SPEC ไม่กำหนดชุดภาคเรียนของฟีเจอร์นี้ | โค้ดฝัง `['1','2','3']` โดยอ้าง DR-EDU-05 ของ UC-01; เป็นข้อกำหนดของฟีเจอร์อื่น ไม่ใช่ค่าใน spec UC-02 | |
| F009 | โค้ดไม่มี FR | `SubmitAdditionalGrades.jsx: จำลองกรณีมีข้อมูลเดิมแล้ว` | Mock control ไม่มี FR/task รองรับในฟีเจอร์นี้ | ปุ่มจำลองสถานการณ์ “มีข้อมูลเดิมแล้ว” มีไว้ทดสอบหน้า mock แต่ไม่เป็นพฤติกรรมผู้ใช้ที่ spec ขอ หรือไม่เป็นปุ่มนำทางระหว่างขั้น | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
