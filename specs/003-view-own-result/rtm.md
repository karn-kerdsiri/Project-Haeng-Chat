# RTM: ดูผลการตรวจสอบคุณสมบัติของตนเอง
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-11-21 14:32 | test: 87 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-OWN-01 | AC-OWN-04 สำหรับ 403; ไม่มี AC ที่ตรวจไม่มี session ได้ 401 | T-02 | ไม่พบโค้ดตรวจ session/ownership ของ UC-03; `App.jsx` เป็น shell mock เท่านั้น | ไม่มี test UC-03 สำหรับ session หรือ 401/403 | ช่องโหว่ |
| FR-OWN-02 | AC-OWN-01 | T-01, T-03 | `OwnEligibilityResult.jsx: OwnEligibilityResult`, `mock.js: MOCK_OWN_REQUEST` | `TC-OWN-01-1.test.jsx`, `TC-OWN-01-2.test.jsx` ยังไม่มีในโค้ด test; test-cases ระบุแต่ไม่พบ | ช่องโหว่ |
| FR-OWN-03 | AC-OWN-06 | T-04 | `OwnEligibilityResult.jsx: status block`; `mock.js: REQUEST_STATUS` | `TC_OWN_06_1_shows_the_predefined_text_of_pending_status`, `TC_OWN_06_2_shows_the_predefined_text_of_done_status` ผ่านบน mock | รอ Q-OWN-01 |
| FR-OWN-04 | ไม่มี AC โดยตรง; OQ-OWN-10 เสนอ AC-OWN-10 | T-05 | `OwnEligibilityResult.jsx: failReason block`; `mock.js: failReasons` | `FR_OWN_04_DR_OWN_05_shows_the_reason_with_a_count_when_the_result_is_fail` ผ่านบน mock | ช่องโหว่ |
| FR-OWN-05 | AC-OWN-02 | T-04 | `OwnEligibilityResult.jsx: pending/result guards`; `mock.js: pending scenario` | `TC_OWN_02_1_pending_shows_status_and_hides_any_result`, `AC_OWN_02_FR_OWN_05_hides_the_result_until_it_is_available` ผ่านบน mock | ยังไม่ถึง |
| FR-OWN-06 | AC-OWN-03 | T-06 | `OwnEligibilityResult.jsx: incomplete scenario/action-item block` | `TC_OWN_03_1_incomplete_data_lists_each_outstanding_item`, `TC_OWN_03_3_complete_data_shows_no_outstanding_list` ผ่านบน mock | ยังไม่ถึง |
| FR-OWN-07 | AC-OWN-05 | T-07 | `OwnEligibilityResult.jsx: error branch` | `TC_OWN_05_1_source_unavailable_shows_error_and_no_values`, `TC_OWN_05_2_no_stale_value_after_a_failed_reload`, `TC_OWN_05_3_successful_load_shows_no_error` ผ่านบน mock | ยังไม่ถึง |
| FR-OWN-08 | AC-OWN-04 | T-02 | ไม่พบโค้ดตรวจ ownership ของ UC-03 | ไม่มี test UC-03 สำหรับ 403 | ช่องโหว่ |
| NFR-OWN-01 | AC-OWN-07 | T-08 | ไม่พบ session timeout/idle tracking ของ UC-03 | ไม่มี test UC-03 idle 30 นาที | ยังไม่ถึง |
| NFR-OWN-02 | AC-OWN-04 | T-02, T-08 | ไม่พบ privacy/authz ของ UC-03 | ไม่มี test UC-03 ว่าข้อมูล B ไม่รั่ว | ยังไม่ถึง |
| NFR-OWN-03 | ไม่มี AC โดยตรง; OQ-OWN-10 เสนอ AC-OWN-12 | T-08 | ข้อความใน mock/UI เป็นภาษาไทย | test error/pending/done Thai ผ่านบน mock | ยังไม่ถึง |
| NFR-OWN-04 | AC-OWN-08 | T-08 | shell มี `overflow-x-hidden`; component ใช้ flex-wrap | ไม่มี test ตรวจ scrollWidth/clientWidth ที่ 360 px | ช่องโหว่ |
| NFR-OWN-05 | ไม่มี AC; OQ-OWN-10 เสนอ AC-OWN-13 | T-08 | ไม่พบ measurement p95 ของ UC-03 | ไม่มี test p95 | ช่องโหว่ |
| IF-AUTH-01 | AC-OWN-04 และกรณี 401 ยังไม่มี AC | T-02 | ไม่พบโค้ด authz/session ของ UC-03 | ไม่มี test UC-03 401/403 | ยังไม่ถึง |
| IF-WEB-01 | ไม่มี AC เฉพาะ | T-08 | React component ใน `frontend/src/features/uc03-view-own-result/` | `IF_WEB_01_application_shell_renders_all_four_screens` ผ่าน | ยังไม่ถึง |
| IF-TECH-01 | ไม่มี AC เฉพาะ | T-01, T-03 | React มีอยู่; ไม่มี backend PostgreSQL/source data ของ UC-03 | ไม่มี test database/integration UC-03 | ยังไม่ถึง |
| CON-OWN-01 | AC-OWN-01, AC-OWN-04 | T-02, T-03 | mock ใช้ข้อมูล MOCK_OWN_REQUEST; ไม่มี ownership จริง | ไม่มี test owner/latest/403 | ยังไม่ถึง |
| CON-OWN-02 | AC-OWN-01 และ TC-OWN-01-2/TC-OWN-05-2 | T-03, T-07 | mock state เปลี่ยนตาม scenario; ไม่มี source read-no-cache | test stale scenario ผ่าน แต่ไม่ตรวจฐานข้อมูลหรือ cache จริง | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.jsx: OwnEligibilityResult` | FR-OWN-02, FR-OWN-03, FR-OWN-04, FR-OWN-05, FR-OWN-06, FR-OWN-07 | บางส่วนบน mock UI เท่านั้น | ไม่มี session, ownership, database read หรือ API |
| `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.jsx: SCENARIOS` | ข้อมูลจำลองสำหรับหลาย AC | ไม่ใช่พฤติกรรม production | เป็น mock scenario selector และข้อมูลสำเร็จ/รอ/ข้อมูลไม่ครบ/error |
| `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.jsx: pending/result guards` | FR-OWN-05, DR-OWN-04 | ใช่ใน mock | ซ่อนผลเมื่อ pending/unpublished และแสดงเฉพาะสถานะ |
| `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.jsx: failReason block` | FR-OWN-04, DR-OWN-05 | ใช่ใน mock | มีเหตุผล + จำนวน I 2 วิชา แต่ไม่ได้อ่านผลจริง |
| `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.jsx: action-item block` | FR-OWN-06, DR-OWN-03 | ไม่ครบตาม spec | รายการจำลอง “Transcript” และ “ภาคเรียน” ถูกยกมาจาก mock แม้ OQ-OWN-08 ยังเปิด |
| `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.jsx: error branch` | FR-OWN-07, NFR-OWN-03 | ใช่ใน mock | แสดง error Thai และซ่อนสถานะ/ผลค้าง |
| `frontend/src/features/uc03-view-own-result/mock.js: REQUEST_STATUS` | DR-OWN-02 | ใช่ใน mock | คงสถานะ 2 ค่าและใช้ข้อความตรง ๆ ไปก่อนตาม spec |
| `frontend/src/features/uc03-view-own-result/mock.js: ELIGIBILITY_RESULT` | DR-OWN-04 | ใช่ใน mock | มีผลผ่าน/ไม่ผ่านสองค่า |
| `frontend/src/features/uc03-view-own-result/mock.js: MOCK_OWN_REQUEST` | DR-OWN-01, DR-OWN-05, DR-OWN-06 | บางส่วน | ไม่มีคำร้องจริงหรือแหล่งฐานข้อมูล รายการ I 2 วิชาคัดจากตัวอย่าง spec |
| `frontend/src/App.jsx: PAGES` | IF-WEB-01 | ใช่ shell | เปิดหน้าจอ UC-03 ผ่าน React; ไม่ได้เชื่อม session/API |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F001 | AC ไม่มี test | AC-OWN-01 | ต้องแสดงเฉพาะข้อมูลเจ้าของและค่า latest จากฐานข้อมูล | test-cases TC-OWN-01-1/01-2 ระบุ pytest+vitest แต่ไม่พบ test ในโค้ด test; Vitest ไม่มี owner/latest assertion | |
| F002 | FR ไม่มี AC | FR-OWN-01 / OQ-OWN-10 | กรณีไม่มี session ต้อง HTTP 401 | AC-OWN-04 ตรวจเฉพาะกรณีส่ง request ของอีกคนและได้ 403; ไม่มี AC ตรวจ 401 ที่อ้าง FR-OWN-01/IF-AUTH-01 โดยตรง | |
| F003 | FR ไม่มี AC | FR-OWN-04 / OQ-OWN-10 | ผลไม่ผ่านต้องแสดงเหตุผลพร้อมจำนวนในหน้าเดียวกัน | มี test UI ที่ตรวจข้อความ I แต่ไม่มี AC ระบุข้อ “ข้อไม่ผ่านพร้อมจำนวน” โดยตรง นอกเหนือ OQ-OWN-10 ที่ยังเสนอไว้ | |
| F004 | AC ไม่มี test | NFR-OWN-05 / OQ-OWN-10 | p95 <= 2 วินาที และไม่มีเกณฑ์ผู้ใช้พร้อมกัน | ไม่มี test หรือ measurement p95 ของหน้า UC-03 และไม่มี AC ที่อนุมัติ | |
| F005 | เดา Q-OWN-08 | `OwnEligibilityResult.jsx: incomplete scenario` | รายการที่ควรแสดงและเหตุการณ์ข้อมูลไม่ครบยังรอคำตอบ | Mock เลือกตัวอย่าง “ยังไม่ได้แนบ Transcript” และ “ยังไม่ได้ระบุภาคเรียนของรายวิชา 1 รายการ” มาเป็นรายการที่ต้องดำเนินการ แม้ OQ-OWN-08 ยังไม่ได้ระบุกรณีหรือรายการจริง | |
| F006 | ของแถม | `OwnEligibilityResult.jsx: SCENARIOS / เลือกสถานการณ์จำลอง` | ไม่มี FR หรือ task ที่กำหนดให้ผู้ใช้เปลี่ยน scenario บนหน้าจอจริง | Selector สำหรับสลับผลผ่าน/ไม่ผ่าน/pending/error เป็นเครื่องมือจำลองเฉพาะ mock และมีอยู่บนหน้าจอรวม แม้มีไว้สำหรับโหมดทดสอบ; ไม่เป็นพฤติกรรมที่ spec สั่ง | |
| F007 | AC ไม่มี test | AC-OWN-08 / NFR-OWN-04 | เปิดหน้าจอ 360 px แล้วไม่มี horizontal scroll | ไม่มี test ตรวจ scrollWidth/clientWidth; shell test ตรวจเฉพาะ nav labels และไม่วัด viewport 360 | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
