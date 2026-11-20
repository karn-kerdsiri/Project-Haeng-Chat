# งานพัฒนา SPEC-MST-012: จัดการข้อมูลรายวิชา อาจารย์ และเงื่อนไขการผ่าน (Manage Master Data)

- Feature: จัดการข้อมูลรายวิชา อาจารย์ และเงื่อนไขการผ่าน
- Spec ID: SPEC-MST-012
- อ้างอิง: [spec.md](./spec.md), [plan.md](./plan.md), [common.md](../common.md)
- วันที่: 2569-11-20

สรุป:
- มี 10 เฟส (เฟส 0–9) รวม 14 task
- มี 0 task ที่ต้องรอ Open Questions (ทุกข้อได้รับการสรุปเป็น Assumption แล้วใน spec.md Draft v2)
- เฟส 1 (AC-MST-01) เป็นเฟสแรกที่ลองใช้งานได้จริงในการแสดงและเพิ่ม/แก้ไขข้อมูลรายวิชา อาจารย์ และเงื่อนไขการผ่าน

---

## เฟส 0: ฐานราก

### T-01 สร้าง Schema ฐานข้อมูล Master Data และ AuditLog
- รองรับ: IF-TECH-01, IF-AUDIT-01, DOM-GRADE-01, CON-MST-02, NFR-MST-03, NFR-MST-04, ASM-MST-09
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-06, T-08, T-10, T-12
- ไฟล์ที่แตะ: `backend/app/main.py`, `backend/app/manage_master_data/__init__.py`, `backend/app/manage_master_data/models.py`, `backend/tests/manage_master_data/test_models.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_models_master_data_schema` ผ่าน โดยสร้างตาราง `Course`, `Instructor`, `InstructorQuota`, `PassingCriteria` และ `AuditLog` ใน PostgreSQL พร้อม Unique Index และคอลัมน์ `is_active` สำหรับ Soft Delete
- สถานะ: พร้อมทำ

### T-02 สร้างกลไกตรวจ session มหาวิทยาลัยและสิทธิ์เจ้าหน้าที่ (RBAC)
- รองรับ: IF-AUTH-01, CON-MST-01, NFR-MST-01, NFR-MST-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-08, T-10, T-11, T-14
- ไฟล์ที่แตะ: `backend/app/manage_master_data/authz.py`, `backend/tests/manage_master_data/test_authz.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: `test_IF_AUTH_01_requires_staff_session` ผ่าน โดยปฏิเสธ request ที่ไม่มี session ด้วย HTTP 401 และตรวจจับ role `staff` ได้
- สถานะ: พร้อมทำ

### T-03 สร้าง API client สำหรับฟีเจอร์จัดการ Master Data
- รองรับ: IF-WEB-01, IF-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05, T-06, T-07, T-08, T-09, T-10, T-13
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/api/client.test.js`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_API_client_master_data_crud` ผ่าน โดยสามารถเรียก GET, POST, PUT, DELETE ไปยัง `/api/v1/master-data/{entity_type}` และทดสอบด้วย client จำลอง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 0
- test ที่ต้องผ่านทั้งหมด: `test_models_master_data_schema`, `test_IF_AUTH_01_requires_staff_session`, `test_API_client_master_data_crud`
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตามงานฐานราก (ไม่มี AC ตรง ๆ):
  Given เปิดหน้าเว็บโดยไม่มี session ของบัญชีมหาวิทยาลัย
  When เรียก `GET /api/v1/master-data/courses`
  Then ระบบตอบ HTTP 401 ตาม IF-AUTH-01
- ยังขาด: ไม่มี

---

## เฟส 1: ดูรายการ เพิ่ม และแก้ไขข้อมูลพื้นฐาน (AC-MST-01)

### T-04 สร้าง Pydantic validation และ CRUD endpoints สำหรับ Master Data
- รองรับ: FR-MST-01, FR-MST-02, FR-MST-03, FR-MST-06, FR-MST-09, DR-MST-01, DR-MST-02, DR-MST-03, DR-MST-05, DOM-GRADE-01, NFR-MST-03, ASM-MST-05, ASM-MST-06, ASM-MST-07
- ตรวจด้วย: AC-MST-01
- ไฟล์ที่แตะ: `backend/app/manage_master_data/schemas.py`, `backend/app/manage_master_data/routes.py`, `backend/app/manage_master_data/service.py`, `backend/tests/manage_master_data/test_crud.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `test_AC_MST_01_create_course_success` ผ่าน โดยสามารถ List/Create/Update รายวิชา อาจารย์ และเงื่อนไขการผ่าน (ไม่นับเกรดไม่สมบูรณ์ตาม DOM-GRADE-01 และคง snapshot เดิมตาม ASM-MST-07) และข้อมูลพร้อมถูกดึงไปใช้ใน UC-06, UC-07, UC-16 ทันที
- สถานะ: พร้อมทำ

### T-05 สร้างหน้าจอจัดการ Master Data แบบแท็บ (MasterDataManagementPage)
- รองรับ: FR-MST-01, FR-MST-02, FR-MST-03, FR-MST-06, DR-MST-01, IF-WEB-01, IF-TECH-01, NFR-MST-05
- ตรวจด้วย: AC-MST-01
- ไฟล์ที่แตะ: `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML แยก; แสดงแท็บแยก 4 กลุ่ม (รายวิชา, รายชื่ออาจารย์, เงื่อนไขการผ่าน, โควต้าอาจารย์) พร้อมตารางและฟอร์มเพิ่ม/แก้ไข
- ต้องทำหลัง: T-03, T-04
- เสร็จเมื่อ: `test_AC_MST_01_ui_create_and_list_master_data` ผ่าน โดยเจ้าหน้าที่บันทึกข้อมูลรายวิชาผ่านหน้าจอแล้วแสดงผลสำเร็จและรายการถูกอัปเดตทันที
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_01_create_course_success`, `test_AC_MST_01_ui_create_and_list_master_data`; test เฟส 0 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-01:
  Given เจ้าหน้าที่เข้าสู่ระบบและเปิดหน้าจัดการ Master Data
  When เลือกแท็บรายวิชา กรอกรหัสวิชา ชื่อไทย ชื่ออังกฤษ หน่วยกิตครบถ้วน แล้วกดบันทึก
  Then ระบบบันทึกสำเร็จ แสดงข้อความภาษาไทย และรายวิชาปรากฏในรายการพร้อมนำไปใช้ตรวจสอบได้
- ยังขาด: ไม่มี

---

## เฟส 2: ป้องกันการเพิ่มข้อมูลซ้ำ (AC-MST-02)

### T-06 ตรวจสอบข้อมูลซ้ำตาม DR-MST-06 และแจ้งเตือนภาษาไทย
- รองรับ: FR-MST-05, DR-MST-06, NFR-MST-05
- ตรวจด้วย: AC-MST-02
- ไฟล์ที่แตะ: `backend/app/manage_master_data/service.py`, `backend/tests/manage_master_data/test_validations.py`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงข้อความเตือนภาษาไทยเมื่อรหัสวิชา, บัญชีอาจารย์, หรือโควต้าอาจารย์ในภาคการศึกษาเดียวกันซ้ำ
- ต้องทำหลัง: T-04, T-05
- เสร็จเมื่อ: `test_AC_MST_02_duplicate_course_rejected` ผ่าน โดยการเพิ่มรหัสวิชา X ซ้ำถูกปฏิเสธด้วยข้อความภาษาไทยและไม่มีแถวข้อมูลซ้ำถูกสร้าง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_02_duplicate_course_rejected`; test เฟส 0–1 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-02:
  Given มีรายวิชารหัส X อยู่ในระบบแล้ว
  When เจ้าหน้าที่กรอกเพิ่มรายวิชารหัส X อีกครั้งแล้วกดบันทึก
  Then ระบบแจ้งเตือนข้อมูลซ้ำเป็นภาษาไทย และไม่สร้างข้อมูลซ้ำ
- ยังขาด: ไม่มี

---

## เฟส 3: ตรวจสอบข้อมูลไม่ครบหรือผิดรูปแบบ (AC-MST-03)

### T-07 ตรวจสอบฟิลด์บังคับและแสดงข้อความภาษาไทยชี้เฉพาะช่องที่ต้องแก้ไข
- รองรับ: FR-MST-04, DR-MST-02, DR-MST-03, DR-MST-04, DR-MST-05, NFR-MST-05
- ตรวจด้วย: AC-MST-03
- ไฟล์ที่แตะ: `backend/app/manage_master_data/schemas.py`, `backend/app/manage_master_data/routes.py`, `backend/tests/manage_master_data/test_validations.py`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดง inline error ภาษาไทยใต้ช่องที่กรอกไม่ครบหรือผิดรูปแบบ
- ต้องทำหลัง: T-04, T-05
- เสร็จเมื่อ: `test_AC_MST_03_missing_required_fields_rejected` ผ่าน โดยเมื่อเว้นว่างฟิลด์บังคับ ระบบไม่บันทึกและแสดงข้อความภาษาไทยระบุช่องที่ต้องแก้ไขครบถ้วน
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_03_missing_required_fields_rejected`; test เฟส 0–2 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-03:
  Given เจ้าหน้าที่เปิดฟอร์มเพิ่มรายวิชาและเว้นว่างฟิลด์รหัสวิชาหรือชื่อวิชา
  When กดปุ่มบันทึก
  Then ระบบไม่บันทึก และแสดงข้อความผิดพลาดภาษาไทยกำกับเฉพาะช่องที่ต้องแก้ไข
- ยังขาด: ไม่มี

---

## เฟส 4: กำหนดโควต้าอาจารย์แยกตามภาคการศึกษา (AC-MST-05)

### T-08 พัฒนาการกำหนดและดึงโควต้าอาจารย์แยกตามภาคการศึกษาเพื่อใช้ใน UC-06
- รองรับ: FR-MST-12, FR-MST-09, DOM-QUOTA-01, DR-MST-04, ASM-MST-03, ASM-MST-08
- ตรวจด้วย: AC-MST-05
- ไฟล์ที่แตะ: `backend/app/manage_master_data/service.py`, `backend/app/manage_master_data/routes.py`, `backend/tests/manage_master_data/test_quotas.py`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แท็บ "โควต้าอาจารย์" แสดงและบันทึกข้อมูลอาจารย์, ปีการศึกษา, ภาคการศึกษา, และจำนวนสูงสุด
- ต้องทำหลัง: T-04, T-05
- เสร็จเมื่อ: `test_AC_MST_05_set_advisor_quota_by_semester` ผ่าน โดยบันทึกโควต้าอาจารย์ A แยกตามภาคการศึกษาสำเร็จและอ่านไปจำกัดการเลือกกลุ่มใน UC-06 ได้
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 4
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_05_set_advisor_quota_by_semester`; test เฟส 0–3 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-05:
  Given เจ้าหน้าที่เปิดแท็บ "โควต้าอาจารย์"
  When เลือกอาจารย์ A ในภาคการศึกษาปัจจุบันและกำหนดโควต้าเป็น 10 คน แล้วบันทึก
  Then ระบบบันทึกโควต้าแยกตามภาคการศึกษา และค่าดังกล่าวพร้อมให้ UC-06 นำไปจำกัดจำนวนได้
- ยังขาด: ไม่มี

---

## เฟส 5: ปฏิเสธจำนวนโควต้าติดลบ (AC-MST-09)

### T-09 ตรวจสอบจำนวนนักศึกษาสูงสุดในโควต้าต้องไม่น้อยกว่า 0
- รองรับ: DR-MST-07, FR-MST-04, NFR-MST-05
- ตรวจด้วย: AC-MST-09
- ไฟล์ที่แตะ: `backend/app/manage_master_data/schemas.py`, `backend/tests/manage_master_data/test_quotas.py`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงข้อความเตือนภาษาไทยที่ช่องจำนวนนักศึกษาสูงสุด
- ต้องทำหลัง: T-08
- เสร็จเมื่อ: `test_AC_MST_09_negative_quota_rejected` ผ่าน โดยเมื่อกรอกจำนวนนักศึกษาสูงสุดเป็นค่าติดลบ ระบบไม่บันทึกและแจ้งรูปแบบที่ถูกต้องเป็นภาษาไทย
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 5
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_09_negative_quota_rejected`; test เฟส 0–4 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-09:
  Given เจ้าหน้าที่เปิดฟอร์มกำหนดโควต้าอาจารย์
  When กรอกจำนวนนักศึกษาสูงสุดเป็น -1 แล้วกดบันทึก
  Then ระบบไม่บันทึก และแสดงข้อความภาษาไทยแจ้งว่ารูปแบบต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป
- ยังขาด: ไม่มี

---

## เฟส 6: ป้องกันการลบข้อมูลที่ถูกใช้งานอยู่ และ Soft Delete (AC-MST-04)

### T-10 สร้าง endpoint ลบข้อมูลพร้อมตรวจการถูกอ้างอิงและทำ Soft Delete
- รองรับ: FR-MST-07, CON-MST-02, NFR-MST-03, NFR-MST-05, ASM-MST-09
- ตรวจด้วย: AC-MST-04
- ไฟล์ที่แตะ: `backend/app/manage_master_data/routes.py`, `backend/app/manage_master_data/service.py`, `backend/tests/manage_master_data/test_delete.py`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; มีปุ่มลบ, โมดัลยืนยัน, และแสดงข้อความภาษาไทยระบุจุดที่ถูกใช้งานหากลบไม่ได้
- ต้องทำหลัง: T-04, T-05
- เสร็จเมื่อ: `test_AC_MST_04_delete_referenced_course_forbidden` ผ่าน โดยรายวิชาที่ถูกอ้างอิงในคำร้องไม่สามารถลบได้และแจ้งจุดที่ถูกใช้งาน ส่วนรายการที่ไม่ถูกใช้งานจะถูกตั้งค่า `is_active = false` (Soft Delete)
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 6
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_04_delete_referenced_course_forbidden`; test เฟส 0–5 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-04:
  Given รายวิชา X ถูกอ้างอิงอยู่ในคำร้องของนักศึกษา
  When เจ้าหน้าที่กดปุ่มลบรายวิชา X และยืนยัน
  Then ระบบไม่ลบข้อมูล และแจ้งเป็นภาษาไทยว่ารายวิชา X กำลังถูกใช้งานอยู่ที่ใด
- ยังขาด: ไม่มี

---

## เฟส 7: ปฏิเสธผู้ใช้ที่ไม่มีสิทธิ์เจ้าหน้าที่ด้วย HTTP 403 (AC-MST-06)

### T-11 บังคับสิทธิ์เฉพาะบทบาทเจ้าหน้าที่ (staff) ในทุก endpoint จัดการข้อมูล
- รองรับ: FR-MST-11, CON-MST-01, NFR-MST-02
- ตรวจด้วย: AC-MST-06
- ไฟล์ที่แตะ: `backend/app/manage_master_data/authz.py`, `backend/app/manage_master_data/routes.py`, `backend/tests/manage_master_data/test_authz.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-04, T-10
- เสร็จเมื่อ: `test_AC_MST_06_non_staff_role_forbidden` ผ่าน โดยนักศึกษาหรืออาจารย์ที่เรียก API เพิ่ม/แก้ไข/ลบข้อมูลพื้นฐานจะได้รับ HTTP 403 และข้อมูลในฐานข้อมูลไม่เปลี่ยนแปลง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 7
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_06_non_staff_role_forbidden`; test เฟส 0–6 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-06:
  Given ผู้ใช้ที่เข้าสู่ระบบเป็นบทบาทนักศึกษาหรืออาจารย์
  When ส่งคำขอ `POST /api/v1/master-data/courses` หรือ `DELETE /api/v1/master-data/courses/1`
  Then ระบบตอบ HTTP 403 และข้อมูลพื้นฐานไม่เปลี่ยนแปลง
- ยังขาด: ไม่มี

---

## เฟส 8: บันทึกประวัติการเพิ่ม แก้ไข และลบลง AuditLog (AC-MST-07)

### T-12 บันทึก AuditLog พร้อมผู้ดำเนินการ เวลา และค่าก่อน/หลังภายในธุรกรรมเดียว
- รองรับ: FR-MST-10, IF-AUDIT-01, NFR-MST-04
- ตรวจด้วย: AC-MST-07
- ไฟล์ที่แตะ: `backend/app/manage_master_data/service.py`, `backend/tests/manage_master_data/test_audit.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-04, T-10
- เสร็จเมื่อ: `test_AC_MST_07_audit_log_created_on_update` ผ่าน โดยการแก้ไขเงื่อนไขการผ่าน 1 ครั้งบันทึกประวัติลง `AuditLog` 1 รายการที่ระบุ `actor_user_id`, `action_at`, `before_data` และ `after_data`
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 8
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_07_audit_log_created_on_update`; test เฟส 0–7 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-07:
  Given เจ้าหน้าที่แก้ไขเงื่อนไขการผ่าน 1 ครั้งแล้วบันทึกสำเร็จ
  When ตรวจสอบตารางประวัติ `AuditLog`
  Then พบประวัติ 1 รายการระบุผู้แก้ไข วันเวลา และค่าก่อนแก้ไขกับหลังแก้ไขครบถ้วน
- ยังขาด: ไม่มี

---

## เฟส 9: Transaction Rollback เมื่อฐานข้อมูลล้มเหลว, Session Timeout และมือถือ 360 px (AC-MST-08)

### T-13 จัดการ Transaction Rollback เมื่อฐานข้อมูลขัดข้องและแจ้งข้อผิดพลาดภาษาไทย
- รองรับ: FR-MST-08, NFR-MST-05, IF-WEB-01
- ตรวจด้วย: AC-MST-08
- ไฟล์ที่แตะ: `backend/app/manage_master_data/service.py`, `backend/tests/manage_master_data/test_error_handling.py`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงข้อความแจ้งข้อผิดพลาดภาษาไทยเมื่อบันทึกไม่สำเร็จ
- ต้องทำหลัง: T-04, T-05, T-12
- เสร็จเมื่อ: `test_AC_MST_08_db_failure_rolls_back_partial_data` ผ่าน โดยจำลอง DB ล้มเหลวกลางคันแล้วไม่มีข้อมูลบางส่วนถูกสร้างหรือแก้ไขและหน้าจอแจ้งข้อผิดพลาดภาษาไทย
- สถานะ: พร้อมทำ

### T-14 ทดสอบ Session timeout 30 นาที และการใช้งานหน้าจอบนมือถือความกว้าง 360 px
- รองรับ: NFR-MST-01, NFR-MST-06, IF-AUTH-01, IF-WEB-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตรวจ NFR-MST-01 และ NFR-MST-06
- ไฟล์ที่แตะ: `backend/tests/manage_master_data/test_authz.py`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.jsx`, `frontend/src/features/uc12-manage-master-data/MasterDataManagementPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; ตรวจทุกแท็บใน `MasterDataManagementPage` ที่ความกว้าง 360 px ไม่ให้มี horizontal scroll
- ต้องทำหลัง: T-02, T-05
- เสร็จเมื่อ: `test_NFR_MST_01_session_timeout_30_minutes` และ `test_NFR_MST_06_responsive_360px` ผ่าน
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 9
- test ที่ต้องผ่านทั้งหมด: `test_AC_MST_08_db_failure_rolls_back_partial_data`, `test_NFR_MST_01_session_timeout_30_minutes`, `test_NFR_MST_06_responsive_360px`; test เฟส 0–8 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-MST-08:
  Given ฐานข้อมูลไม่พร้อมใช้งานขณะบันทึกข้อมูลพื้นฐาน
  When เจ้าหน้าที่กดบันทึกข้อมูล
  Then ระบบแจ้งข้อผิดพลาดภาษาไทย และไม่มีข้อมูลบางส่วนถูกสร้างในฐานข้อมูล
- ยังขาด: ไม่มี

---

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-MST-01 | T-04, T-05 |
| AC-MST-02 | T-06 |
| AC-MST-03 | T-07 |
| AC-MST-04 | T-10 |
| AC-MST-05 | T-08 |
| AC-MST-06 | T-11 |
| AC-MST-07 | T-12 |
| AC-MST-08 | T-13 |
| AC-MST-09 | T-09 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| IF-AUTH-01 | T-02, T-14 |
| IF-WEB-01 | T-03, T-05, T-13, T-14 |
| IF-TECH-01 | T-01, T-03, T-05 |
| IF-AUDIT-01 | T-01, T-12 |
| DOM-QUOTA-01 | T-08 |
| DOM-GRADE-01 | T-01, T-04 |
| CON-MST-01 | T-02, T-11 |
| CON-MST-02 | T-01, T-10 |

### Functional Requirements

| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-MST-01 | AC-MST-01 | เฟส 1 |
| FR-MST-02 | AC-MST-01, AC-MST-04 | เฟส 1, 6 |
| FR-MST-03 | AC-MST-01, AC-MST-03 | เฟส 1, 3 |
| FR-MST-04 | AC-MST-03, AC-MST-09 | เฟส 3, 5 |
| FR-MST-05 | AC-MST-02 | เฟส 2 |
| FR-MST-06 | AC-MST-01 | เฟส 1 |
| FR-MST-07 | AC-MST-04 | เฟส 6 |
| FR-MST-08 | AC-MST-08 | เฟส 9 |
| FR-MST-09 | AC-MST-01, AC-MST-05 | เฟส 1, 4 |
| FR-MST-10 | AC-MST-07 | เฟส 8 |
| FR-MST-11 | AC-MST-06 | เฟส 7 |
| FR-MST-12 | AC-MST-05 | เฟส 4 |

---

## สิ่งที่ยังไม่ทำ
- Open Questions: ไม่มี (ทุกข้อได้รับการสรุปเป็น Assumption แล้วใน `spec.md` Draft v2)
- Task ที่รอคำตอบ: ไม่มี (0 task)
