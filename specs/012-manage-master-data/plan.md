# Plan: จัดการข้อมูลรายวิชา อาจารย์ และเงื่อนไขการผ่าน (Manage Master Data)

## 1. สรุปแนวทาง
- ฟีเจอร์นี้ให้เจ้าหน้าที่เพิ่ม แก้ไข ปรับปรุง และลบข้อมูลพื้นฐาน 4 ประเภท: รายวิชา, รายชื่ออาจารย์, เงื่อนไขการผ่าน และโควต้าอาจารย์ตาม DR-MST-01
- ผู้ใช้หลักคือเจ้าหน้าที่ที่มีสิทธิ์จัดการข้อมูล เข้าใช้งานผ่านเว็บเบราว์เซอร์ตาม IF-AUTH-01 และ CON-MST-01
- มีระบบตรวจสอบข้อมูลซ้ำ (DR-MST-06) และตรวจสอบความถูกต้องของฟิลด์บังคับก่อนบันทึกตาม DR-MST-02 ถึง DR-MST-05 และ DR-MST-07
- การลบข้อมูลใช้การ Soft Delete (ตั้งค่า `is_active = false`) เพื่อคง Referential Integrity ไม่ให้กระทบคำร้องที่อ้างอิงอยู่ตาม CON-MST-02
- บันทึกประวัติการสร้าง แก้ไข และลบข้อมูลลงใน Audit Log ทุกครั้ง พร้อมผู้ดำเนินการและเวลาตาม IF-AUDIT-01

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| React (Vite) | IF-TECH-01 | พัฒนาหน้าจอจัดการ Master Data แบบแท็บแยกตามประเภทข้อมูล รองรับหน้าจอมือถือ >= 360px ตาม NFR-MST-06 |
| Python FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | จัดการ RESTful CRUD APIs, Data Validation (Pydantic), และ Transaction Management |
| PostgreSQL | IF-TECH-01 | จัดเก็บตารางข้อมูลหลัก ความสัมพันธ์ระหว่าง Entity และประวัติ Audit Log |
| Web Session Authentication (RBAC) | IF-AUTH-01, CON-MST-01 | ตรวจสอบ session และสิทธิ์บทบาท 'staff' เท่านั้น ผู้ใช้ทั่วไปปฏิเสธด้วย HTTP 403 |
| JSON Schema Validation | DOM-GRADE-01, DR-MST-05 | ตรวจสอบโครงสร้างเกณฑ์เงื่อนไขการผ่าน (GPAX ขั้นต่ำ, หน่วยกิตสะสม, รายวิชาบังคับ) |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ FR/Constraint |
|---|---|---|
| Course | id, course_code, name_th, name_en, credits, is_active, created_at, updated_at | FR-MST-01, FR-MST-02, FR-MST-03, FR-MST-05, FR-MST-07, DR-MST-02, DR-MST-06, CON-MST-02 |
| Instructor | id, instructor_code, name_th, name_en, email, department, is_active, created_at, updated_at | FR-MST-01, FR-MST-02, FR-MST-03, FR-MST-05, FR-MST-07, DR-MST-03, DR-MST-06, CON-MST-02 |
| InstructorQuota | id, instructor_id, academic_year, semester, max_students, is_active, created_at, updated_at | FR-MST-01, FR-MST-12, DOM-QUOTA-01, DR-MST-04, DR-MST-07 |
| PassingCriteria | id, name, criteria_payload (JSON), academic_year, semester, is_active, created_at, updated_at | FR-MST-01, FR-MST-03, FR-MST-06, FR-MST-09, DOM-GRADE-01, DR-MST-05 |
| AuditLog | id, actor_user_id, action_type, entity_name, entity_id, before_data, after_data, action_at | FR-MST-10, IF-AUDIT-01, NFR-MST-04 |

หมายเหตุ: ตาราง Course, Instructor, InstructorQuota และ PassingCriteria มี Unique Index และ Foreign Key Constraints พร้อมคอลัมน์ `is_active` สำหรับ Soft Delete

## 4. API / หน้าจอ

| รายการ | รายละเอียด | รองรับ FR |
|---|---|---|
| GET /api/v1/master-data/{entity_type} | ดึงรายการข้อมูลพื้นฐาน (courses, instructors, quotas, passing-criteria) | FR-MST-01, CON-MST-01 |
| POST /api/v1/master-data/{entity_type} | เพิ่มข้อมูลพื้นฐาน ตรวจสอบฟิลด์บังคับและความซ้ำซ้อน บันทึก Audit Log | FR-MST-02, FR-MST-03, FR-MST-04, FR-MST-05, FR-MST-06, FR-MST-08, FR-MST-10, FR-MST-11, FR-MST-12 |
| PUT /api/v1/master-data/{entity_type}/{id} | แก้ไขข้อมูลพื้นฐาน ตรวจสอบความถูกต้องและบันทึกประวัติก่อน/หลัง | FR-MST-02, FR-MST-03, FR-MST-04, FR-MST-06, FR-MST-10, FR-MST-11 |
| DELETE /api/v1/master-data/{entity_type}/{id} | ตรวจสอบการถูกอ้างอิง หากถูกใช้อยู่ห้ามลบและแจ้งจุดที่ใช้ หากไม่ถูกใช้ให้ Soft Delete | FR-MST-02, FR-MST-07, FR-MST-10, FR-MST-11, CON-MST-02 |
| หน้าจอ MasterDataManagementPage | หน้าจอแท็บสำหรับจัดการ 4 กลุ่มข้อมูล พร้อมฟอร์มกรอก/แก้ไข โมดัลยืนยัน และตารางแสดงผล | FR-MST-01, FR-MST-02, FR-MST-04, NFR-MST-05, NFR-MST-06 |

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| IF-AUTH-01 | ทุก API endpoint ตรวจสอบ session หากไม่มีให้ตอบ HTTP 401 | ใช้แล้ว |
| IF-WEB-01 | หน้าจอทำงานบนเว็บเบราว์เซอร์ผ่าน React Responsive UI โดยไม่ต้องติดตั้งโปรแกรมเพิ่ม | ใช้แล้ว |
| IF-TECH-01 | ส่วนติดต่อผู้ใช้สร้างด้วย React และข้อมูลจัดเก็บใน PostgreSQL | ใช้แล้ว |
| IF-AUDIT-01 | ทุกการเพิ่ม แก้ไข หรือลบข้อมูล จะบันทึกประวัติลง `AuditLog` ระบุผู้ดำเนินการ วันเวลา และข้อมูลก่อน/หลัง เก็บไม่น้อยกว่า 1 ปี | ใช้แล้ว |
| DOM-QUOTA-01 | ในโมเดล `InstructorQuota` และ validation กำหนดให้ 1 อาจารย์มีโควต้าสูงสุดแยกตามภาคการศึกษา และจำกัดการเลือกกลุ่มใน UC-06 | ใช้แล้ว |
| DOM-GRADE-01 | ใน validation ของ `PassingCriteria` เกณฑ์การผ่านต้องอ้างอิงเกรดตามระบบมหาวิทยาลัย และระบบไม่นับเกรดไม่สมบูรณ์ (I, W) ว่าผ่าน | ใช้แล้ว |
| CON-MST-01 | ตรวจสอบ Role ของผู้ใช้จาก session อนุญาตเฉพาะบทบาทเจ้าหน้าที่ ('staff') เท่านั้น ผู้ใช้บทบาทอื่นได้ HTTP 403 | ใช้แล้ว |
| CON-MST-02 | ก่อนลบข้อมูล ระบบจะตรวจสอบการอ้างอิงในคำร้อง หากพบว่ามีคำร้องอ้างอิงอยู่ จะปฏิเสธการลบและแจ้งจุดที่ใช้งาน | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-MST-01 | test_AC_MST_01_create_course_success | เจ้าหน้าที่กรอกข้อมูลรายวิชาถูกต้องครบถ้วนและบันทึก; verify บันทึกสำเร็จและข้อมูลพร้อมถูกดึงไปใช้ |
| AC-MST-02 | test_AC_MST_02_duplicate_course_rejected | มีรายวิชารหัส X อยู่แล้ว; พยายามเพิ่มรายวิชารหัส X ซ้ำ; verify ระบบแจ้งเตือนข้อมูลซ้ำและไม่สร้างข้อมูลใหม่ |
| AC-MST-03 | test_AC_MST_03_missing_required_fields_rejected | กรอกข้อมูลไม่ครบตามฟิลด์บังคับ; กดบันทึก; verify ระบบไม่บันทึกและแสดง error ภาษาไทยชี้เฉพาะช่องที่ว่าง |
| AC-MST-04 | test_AC_MST_04_delete_referenced_course_forbidden | รายวิชา X ถูกอ้างอิงอยู่ในคำร้องนักศึกษา; พยายามลบรายวิชา X; verify ระบบไม่อนุญาตให้ลบและแจ้งจุดที่ถูกใช้งาน |
| AC-MST-05 | test_AC_MST_05_set_advisor_quota_by_semester | กำหนดโควต้าอาจารย์ A ในภาคเรียนปัจจุบันเป็น 10 คน; verify ระบบบันทึกแยกตามภาคการศึกษาและนำไปคุมโควต้าใน UC-06 |
| AC-MST-06 | test_AC_MST_06_non_staff_role_forbidden | ผู้ใช้บทบาทนักศึกษาหรืออาจารย์เรียก API จัดการ Master Data; verify ตอบ HTTP 403 และข้อมูลไม่เปลี่ยนแปลง |
| AC-MST-07 | test_AC_MST_07_audit_log_created_on_update | เจ้าหน้าที่แก้ไขเงื่อนไขการผ่าน; verify มี record ใน `AuditLog` 1 รายการระบุผู้แก้ไข เวลา และค่าก่อน/หลัง |
| AC-MST-08 | test_AC_MST_08_db_failure_rolls_back_partial_data | จำลองสถานการณ์ฐานข้อมูลล้มเหลวระหว่างบันทึก; verify ระบบแจ้งข้อผิดพลาดและไม่มีข้อมูลบางส่วนถูกสร้าง (Transaction Rollback) |
| AC-MST-09 | test_AC_MST_09_negative_quota_rejected | กรอกจำนวนนักศึกษาสูงสุดเป็นค่าติดลบ (-1); กดบันทึกโควต้า; verify ระบบไม่บันทึกและแจ้งรูปแบบที่ถูกต้อง |

## 7. ลำดับงาน

1. สร้าง DDL Schema สำหรับตาราง `Course`, `Instructor`, `InstructorQuota`, `PassingCriteria` และ `AuditLog` พร้อม Unique Index (รองรับ FR-MST-01, FR-MST-05, FR-MST-10, IF-AUDIT-01, DR-MST-06)
2. สร้าง Data Validation Schema (Pydantic) ตรวจสอบความถูกต้องของฟิลด์บังคับและค่าโควต้าไม่ติดลบตาม DR-MST-02 ถึง DR-MST-05, DR-MST-07 (รองรับ FR-MST-03, FR-MST-04, AC-MST-03, AC-MST-09)
3. สร้าง RESTful API Endpoints สำหรับ List, Create, Update ข้อมูลแต่ละประเภท พร้อม Role-based Guard (`staff` role) ปฏิเสธด้วย 403 หากไม่มีสิทธิ์ (รองรับ FR-MST-01, FR-MST-02, FR-MST-06, FR-MST-11, CON-MST-01)
4. พัฒนา Logic การตรวจสอบการถูกอ้างอิงใช้งาน (Referential Integrity Check) ก่อนลบ และทำ Soft Delete (`is_active = false`) (รองรับ FR-MST-07, CON-MST-02, AC-MST-04)
5. พัฒนาระบบบันทึกประวัติการเปลี่ยนแปลงลง `AuditLog` (ผู้กระทำ, เวลา, ข้อมูลก่อน/หลัง) ภายใน Database Transaction เดียวกัน (รองรับ FR-MST-10, IF-AUDIT-01, NFR-MST-04, AC-MST-07)
6. สร้างหน้าจอ React `MasterDataManagementPage` แบบ Responsive รองรับจอ >= 360px มีแท็บเลือกประเภทข้อมูล และแสดงข้อความแจ้งเตือนภาษาไทย (รองรับ FR-MST-01, FR-MST-04, NFR-MST-05, NFR-MST-06)
7. เขียนและทดสอบ Automated Test Suite ครอบคลุม AC-MST-01 ถึง AC-MST-09 (รองรับ AC-MST-01 ถึง AC-MST-09)

## 8. สิ่งที่ยังไม่ทำ
- Open Questions: ไม่มีใน spec ปัจจุบัน (ข้อมูลทั้งหมดได้รับการสรุปและบันทึกเป็น Assumptions ในหัวข้อ Assumptions & Open Questions เรียบร้อยแล้ว)
- ส่วนที่เกี่ยวข้องกับข้อนี้จะยังไม่สร้างจนกว่าจะได้คำตอบ: ไม่มี
