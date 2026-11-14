# Plan: ตรวจสอบและยืนยันข้อมูลที่นักศึกษาส่งมา

## 1. สรุปแนวทาง
- ฟีเจอร์นี้ให้เจ้าหน้าที่ตรวจสอบคำร้องที่นักศึกษาส่งเข้ามา โดยเริ่มจากรายการรอการตรวจสอบ ค้นหาเลือกคำร้อง และตรวจสอบข้อมูล/เอกสารก่อนยืนยันหรือส่งกลับแก้ไข
- ผู้ใช้หลักคือเจ้าหน้าที่ที่มีสิทธิ์ตรวจสอบ และผู้ใช้ที่ไม่มีสิทธิ์จะถูกปฏิเสธตาม IF-AUTH-01, CON-VRF-01 และ FR-VRF-11
- แนวทางจะประกอบด้วย 5 ส่วนหลัก: แสดงรายการรอตรวจสอบ, ค้นหาและเปิดคำร้อง, เรียก UC-16 เพื่อคำนวณผล, ตรวจเช็กความพร้อมก่อนยืนยัน, และบันทึกยืนยัน/ส่งกลับพร้อมประวัติการเปลี่ยนสถานะ
- การออกแบบจะยึด Constraint ที่มีอยู่ใน spec โดยคงหลัก “ไม่เปลี่ยนสถานะเมื่อคำนวณหรือบันทึกล้มเหลว” และ “บันทึกเหตุการณ์/ประวัติแบบ audit-friendly” ตาม IF-AUDIT-01 และ CON-VRF-02
- ทุกบรรทัดของแผนนี้จะอ้างกลับไปหา ID ใน spec เท่านั้น และจะไม่ตัดสินใจแทนทีมเกี่ยวกับ Open Questions ที่ยังไม่ได้ตอบ

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| React (Vite) | IF-TECH-01 | ใช้สำหรับหน้าจอรายการคำร้อง/รายละเอียดคำร้อง/การยืนยันหรือส่งกลับ |
| Python FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้สำหรับ API ที่ตรวจสิทธิ์, เรียก UC-16, บันทึกสถานะและประวัติ |
| PostgreSQL | IF-TECH-01 | ใช้เก็บข้อมูลคำร้อง สถานะ และประวัติการเปลี่ยนสถานะ |
| Async job / integration client สำหรับเรียก UC-16 | IF-CALC-01 | ฟีเจอร์นี้ไม่คำนวณเอง แต่เรียก UC-16 เท่านั้น และต้องยอมให้ไม่ค้างบล็อก request ในช่วงยืนยัน |
| Audit log table | IF-AUDIT-01, DR-VRF-06, NFR-VRF-04 | เก็บผู้ดำเนินการ เวลา สถานะก่อน/หลัง และระยะเวลาเก็บไม่น้อยกว่า 1 ปี |
| Session auth middleware | IF-AUTH-01 | ตรวจ session ก่อนอนุญาตทุก request ของฟีเจอร์ |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ FR/Constraint |
|---|---|---|
| StudentRequest | id, student_id, student_name, advisor_group, status, submitted_at, reviewed_by, last_updated_at | FR-VRF-01, FR-VRF-02, FR-VRF-06, FR-VRF-07, FR-VRF-12, DR-VRF-01 |
| StudentRequestDetail | request_id, academic_record_snapshot, documents, eligibility_check_result, ready_for_review_flag, notes | FR-VRF-03, FR-VRF-05, DR-VRF-02, DR-VRF-04 |
| EligibilityCheckResult | id, request_id, source_uc, result_summary, status, executed_at, error_message | FR-VRF-04, FR-VRF-05, FR-VRF-09, IF-CALC-01 |
| RequestHistory | id, request_id, actor_user_id, action_type, previous_status, new_status, changed_at, note | FR-VRF-10, IF-AUDIT-01, DR-VRF-06, NFR-VRF-04 |
| ReviewDecision | id, request_id, reviewer_id, decision_type, reason, created_at | FR-VRF-07, DR-VRF-05 |

หมายเหตุ: โมเดลนี้จะไม่เก็บข้อมูลที่ไม่ได้ระบุใน spec เช่น ข้อมูลที่ยังไม่ตอบใน OQ-VRF-01 ถึง OQ-VRF-06 จะยังไม่ถูกบังคับลงใน schema จนกว่าทีมจะยืนยันคำตอบ

## 4. API / หน้าจอ

| รายการ | รายละเอียด | รองรับ FR |
|---|---|---|
| GET /staff/verification/requests | แสดงรายการคำร้องที่รอตรวจสอบพร้อมรหัสนักศึกษา ชื่อ กลุ่มอาจารย์ และสถานะ | FR-VRF-01, DR-VRF-01 |
| GET /staff/verification/requests/search?q=... | ค้นหาคำร้องด้วยรหัสนักศึกษา ชื่อ หรือกลุ่มอาจารย์ | FR-VRF-02, DR-VRF-03 |
| GET /staff/verification/requests/{id} | เปิดรายละเอียดคำร้องและแสดงข้อมูลผลการศึกษา + เอกสารที่เกี่ยวข้อง | FR-VRF-03, DR-VRF-02 |
| POST /staff/verification/requests/{id}/calculate | เรียก UC-16 เพื่อคำนวณผลตรวจสอบความพร้อมก่อนยืนยัน | FR-VRF-04, FR-VRF-05, IF-CALC-01 |
| POST /staff/verification/requests/{id}/confirm | ตรวจสิทธิ์ ตรวจความพร้อม ตรวจ transaction แล้วบันทึกสถานะยืนยัน | FR-VRF-06, CON-VRF-01, CON-VRF-03, NFR-VRF-03 |
| POST /staff/verification/requests/{id}/return-for-correction | บันทึกเหตุผล ส่งกลับให้นักศึกษาแก้ไข และเปลี่ยนสถานะเป็นรอการแก้ไข | FR-VRF-07, DR-VRF-05 |
| POST /staff/verification/requests/{id}/reject | ปฏิเสธ request เมื่อผู้ใช้ไม่มีสิทธิ์หรือข้อมูลไม่ผ่านเงื่อนไข | FR-VRF-08, FR-VRF-09, FR-VRF-11 |
| GET /staff/verification/requests/{id}/history | แสดงประวัติการเปลี่ยนสถานะและผู้ดำเนินการ | FR-VRF-10, IF-AUDIT-01 |
| UI: StaffVerifyListPage | หน้ารายการคำร้องที่รอตรวจสอบ | FR-VRF-01, FR-VRF-02 |
| UI: StaffVerifyDetailPage | หน้ารายละเอียดคำร้อง พร้อมผลคำนวณ และ action ยืนยัน/ส่งกลับ | FR-VRF-03, FR-VRF-04, FR-VRF-05, FR-VRF-06, FR-VRF-07 |

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| IF-AUTH-01 | Session validation middleware สำหรับทุก endpoint ของฟีเจอร์; 401 เมื่อไม่มี session หรือ session ไม่ตรงกับระบบมหาวิทยาลัย | ใช้แล้ว |
| IF-WEB-01 | UI ถูกออกแบบให้ใช้เบราว์เซอร์สากล รักษา responsive สำหรับจอ 360 px และไม่ต้องใช้โปรแกรมเสริม | ใช้แล้ว |
| IF-TECH-01 | เลือก React + PostgreSQL ตามข้อกำหนด | ใช้แล้ว |
| IF-AUDIT-01 | RequestHistory และ audit log ถูกสร้างทุกครั้งที่เปลี่ยนสถานะ พร้อมให้เจ้าหน้าที่เรียกดูได้ | ใช้แล้ว |
| IF-CALC-01 | POST /calculate ถูกเรียกผ่าน UC-16 เท่านั้น และไม่คำนวณเองในฟีเจอร์นี้ | ใช้แล้ว |
| CON-VRF-01 | middleware สำหรับ role staff verification และ deny ถ้าไม่มีสิทธิ์ | ใช้แล้ว |
| CON-VRF-02 | confirm flow ใช้ transaction และ rollback/abort เมื่อคำนวณหรือบันทึกล้มเหลว | ใช้แล้ว |
| CON-VRF-03 | confirm flow จะปฏิเสธเมื่อ ready_for_review_flag = false หรือข้อมูลยังไม่พร้อม | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-VRF-01 | test_AC_VRF_01_confirm_success_calls_uc16_and_records_status | สร้างคำร้องพร้อมตรวจสอบ, เรียก confirm, ตรวจว่า API UC-16 ถูกเรียก, status ถูกอัปเดต, และข้อมูลพร้อมใช้ในขั้นตอนถัดไป |
| AC-VRF-02 | test_AC_VRF_02_search_filters_requests_by_student_id_name_or_group | บันทึกคำร้องหลายรายการ, ค้นหาด้วยรหัสนักศึกษา ชื่อ หรือกลุ่มอาจารย์, ตรวจว่าแสดงเฉพาะรายการที่ตรงคำค้น |
| AC-VRF-03 | test_AC_VRF_03_return_for_correction_records_reason_and_status | สร้างคำร้องที่เอกสารไม่ครบ, ส่งกลับพร้อมเหตุผล, ตรวจว่ามี ReviewDecision และ status เปลี่ยนเป็น รอการแก้ไข |
| AC-VRF-04 | test_AC_VRF_04_block_confirm_when_data_not_ready | สร้างคำร้องที่ข้อมูลยังไม่พร้อม, พยายาม confirm, ตรวจว่า server ปฏิเสธและแจ้งเหตุผล |
| AC-VRF-05 | test_AC_VRF_05_error_keeps_original_status | จำลอง UC-16 error, เรียก confirm, ตรวจว่า error message ชัดเจน และ status ไม่เปลี่ยน |
| AC-VRF-06 | test_AC_VRF_06_forbidden_for_non_staff_user | ใช้ session ที่ไม่ใช่เจ้าหน้าที่มีสิทธิ์, เรียก API confirm, ตรวจ HTTP 403 และ status ไม่เปลี่ยน |
| AC-VRF-07 | test_AC_VRF_07_history_lists_actions_with_user_time_and_status | สร้างคำร้องที่ยืนยัน 1 ครั้งและส่งกลับ 1 ครั้ง, เปิด history, ตรวจว่ามี 2 รายการ ครบผู้ดำเนินการ เวลา และสถานะก่อน/หลัง |
| AC-VRF-08 | test_AC_VRF_08_confirmed_request_available_for_publish | ยืนยันคำร้องแล้ว, ตรวจว่าคำร้องปรากฏในรายการพร้อมเผยแพร่ของ UC-14 |

## 7. ลำดับงาน

1. สร้าง schema และ migration สำหรับ StudentRequest, RequestHistory, ReviewDecision, EligibilityCheckResult และ index สำหรับค้นหา รหัสนักศึกษา ชื่อ กลุ่มอาจารย์ พร้อมรองรับ FR-VRF-01, FR-VRF-02, FR-VRF-10, DR-VRF-01, DR-VRF-03
2. สร้าง API/Service สำหรับรายการคำร้องและรายละเอียดคำร้อง รวมทั้งการตรวจสิทธิ์และ session validation เพื่อรองรับ FR-VRF-01, FR-VRF-02, FR-VRF-03, CON-VRF-01, IF-AUTH-01
3. สร้าง integration layer สำหรับเรียก UC-16 และจัดการ error/rollback flow เพื่อรองรับ FR-VRF-04, FR-VRF-05, FR-VRF-09, CON-VRF-02, IF-CALC-01
4. สร้าง action confirm และ return-for-correction พร้อมเก็บเหตุผลและป้ายสถานะพร้อมความพร้อมของข้อมูล เพื่อรองรับ FR-VRF-06, FR-VRF-07, FR-VRF-08, DR-VRF-04, DR-VRF-05
5. สร้าง history audit trail และ UI detail/history page เพื่อรองรับ FR-VRF-10, IF-AUDIT-01, NFR-VRF-04, AC-VRF-07
6. ทำ UI รายการคำร้องและหน้าเปิดคำร้องที่สอดคล้องกับ DR-VRF-01, DR-VRF-02 และ NFR-VRF-05, NFR-VRF-06
7. ทดสอบแบบ end-to-end ตาม AC-VRF-01 ถึง AC-VRF-08 และตรวจความสอดคล้องของ constraints กับ plan

## 8. สิ่งที่ยังไม่ทำ
- OQ-VRF-01: ต้องถามเจ้าหน้าที่ตรวจสอบ/ทีมธุรกิจว่าเจ้าหน้าที่ต้องเห็นข้อมูลอะไรบ้าง (รายวิชาและเกรดทั้งหมด ผลการอนุมัติของอาจารย์ ผลการลงนาม เอกสารแนบ หรือผลการตรวจเบื้องต้นจาก UC-07)
- OQ-VRF-02: ต้องถามเจ้าหน้าที่ตรวจสอบ/ทีมธุรกิจว่า “ข้อมูลยังไม่พร้อม” ใน UC-13 alt 3 คืออะไร (เช่น ยังไม่ผ่านอาจารย์ ยังไม่ลงนาม หรือเกรดยังไม่ครบ)
- OQ-VRF-03: ต้องถามทีมธุรกิจ/นักวิเคราะห์ระบบว่าคำร้องต้องผ่าน UC-09 และ UC-11 ก่อนจึงจะเข้ามาใน UC-13 หรือไม่
- OQ-VRF-04: ต้องถามทีมข้อมูล/ผู้ดูแลสถานะว่าชื่อสถานะ “ยืนยันแล้ว” และ “รอการแก้ไข” ควรใช้คำว่าอะไร เพื่อสอดคล้องกับ OQ-OWN-01 และ OQ-APR-03
- OQ-VRF-05: ต้องถามเจ้าหน้าที่ตรวจสอบว่าหลายคำร้องสามารถยืนยันพร้อมกันได้หรือไม่ เพราะ UC-13 ระบุการเลือก 1 รายการต่อครั้ง
- OQ-VRF-06: ต้องถามทีมธุรกิจ/เจ้าหน้าที่ตรวจสอบว่าหลังนักศึกษาส่งผลเพิ่มเติมตาม UC-02 หลังยืนยันแล้ว ควรตรวจสอบและยืนยันใหม่หรือไม่

ส่วนที่เกี่ยวข้องกับ Open Questions ข้างต้นจะยังไม่สร้างจนกว่าทีมจะตอบให้ชัดเจน
