# งานพัฒนา SPEC-AVR-010: ดูผลการตรวจสอบคุณสมบัติของนักศึกษาในที่ปรึกษา (Advisor Views Advisee Results)

- Feature: ดูผลการตรวจสอบคุณสมบัติของนักศึกษาในที่ปรึกษา
- Spec ID: SPEC-AVR-010
- อ้างอิง: [spec.md](./spec.md), [plan.md](./plan.md), [common.md](../common.md)
- วันที่: 2569-11-20

สรุป:
- มี 8 เฟส (เฟส 0–7) รวม 13 task
- มี 0 task ที่ต้องรอ Open Questions (ทุกข้อได้รับการสรุปเป็น Assumption แล้วใน spec.md Draft v2)
- เฟส 1 (AC-AVR-01) เป็นเฟสแรกที่ลองใช้งานได้จริงในการดึงและแสดงรายชื่อนักศึกษาในที่ปรึกษา

---

## เฟส 0: ฐานราก

### T-01 เตรียมโครงสร้างหลังบ้านและโมเดลอ่านข้อมูลนักศึกษาในที่ปรึกษา
- รองรับ: IF-TECH-01, CON-AVR-01, CON-AVR-02, DR-AVR-01, DR-AVR-03
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-07, T-08, T-10
- ไฟล์ที่แตะ: `backend/app/main.py`, `backend/app/advisor_view_advisee_result/__init__.py`, `backend/app/advisor_view_advisee_result/models.py`, `backend/tests/advisor_view_advisee_result/test_models.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_models_advisor_advisee_schema` ผ่าน โดยเชื่อมต่อ PostgreSQL (ตาม IF-TECH-01) และกำหนด schema อ่าน `AdvisorStudentMapping`, `AcademicRecord`, `AcademicRecordFile` ได้ครบตามแผน
- สถานะ: พร้อมทำ

### T-02 สร้างกลไกตรวจ session มหาวิทยาลัยและการตรวจสอบสิทธิ์อาจารย์
- รองรับ: IF-AUTH-01, FR-AVR-01, NFR-AVR-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-08, T-10, T-12
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/authz.py`, `backend/tests/advisor_view_advisee_result/test_authz.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: `test_IF_AUTH_01_requires_advisor_session` ผ่าน โดย request ที่ไม่มี session จะถูกปฏิเสธด้วย HTTP 401 และระบุ `current_user.id` ของอาจารย์ที่ปรึกษาได้
- สถานะ: พร้อมทำ

### T-03 สร้าง API client สำหรับฟีเจอร์ดูผลนักศึกษาในที่ปรึกษา
- รองรับ: IF-WEB-01, IF-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05, T-06, T-07, T-09, T-11
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/api/client.test.js`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_API_client_fetches_advisor_advisees` ผ่าน โดยสามารถเรียก GET ไปยัง endpoint ของฟีเจอร์นี้ได้และทดสอบด้วย client จำลอง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 0
- test ที่ต้องผ่านทั้งหมด: `test_models_advisor_advisee_schema`, `test_IF_AUTH_01_requires_advisor_session`, `test_API_client_fetches_advisor_advisees`
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตามงานฐานราก (ไม่มี AC ตรง ๆ):
  Given เปิดหน้าเว็บในเบราว์เซอร์และเรียก API โดยยังไม่มี session มหาวิทยาลัย
  When ส่งคำขอไปที่ `/api/v1/advisor/advisees`
  Then ระบบตอบ HTTP 401 ตาม IF-AUTH-01
- ยังขาด: ไม่มี

---

## เฟส 1: ดูรายการนักศึกษาในความดูแลตามสถานะล่าสุด (AC-AVR-01)

### T-04 สร้าง endpoint ดึงรายชื่อนักศึกษาในความดูแลพร้อมสถานะล่าสุด
- รองรับ: FR-AVR-01, FR-AVR-02, FR-AVR-03, CON-AVR-01, CON-AVR-02, DR-AVR-01, ASM-AVR-03, ASM-AVR-08
- ตรวจด้วย: AC-AVR-01
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/routes.py`, `backend/app/advisor_view_advisee_result/service.py`, `backend/tests/advisor_view_advisee_result/test_list_advisees.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `test_AC_AVR_01_view_advisee_list_success` ผ่าน โดย `GET /api/v1/advisor/advisees` กรองเฉพาะนักศึกษาของอาจารย์ผู้เรียก รองรับตัวเลือกภาคการศึกษา และดึงสถานะล่าสุดของคำร้อง
- สถานะ: พร้อมทำ

### T-05 สร้างหน้าจอรายการนักศึกษาในที่ปรึกษา (AdvisorAdviseeListPage)
- รองรับ: FR-AVR-02, FR-AVR-03, DR-AVR-01, IF-WEB-01, IF-TECH-01, NFR-AVR-03, ASM-AVR-06, ASM-AVR-07, ASM-AVR-08
- ตรวจด้วย: AC-AVR-01
- ไฟล์ที่แตะ: `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML แยก; แสดงรหัสนักศึกษา ชื่อนักศึกษา สถานะคำร้อง ผลการตรวจสอบ และ Dropdown เลือกภาคการศึกษา (ไม่มีช่องค้นหาตาม ASM-AVR-06 และไม่มีปุ่มส่งออกตาม ASM-AVR-07)
- ต้องทำหลัง: T-03, T-04
- เสร็จเมื่อ: `test_AC_AVR_01_render_advisee_list_and_semester_filter` ผ่าน โดยแสดงรายการนักศึกษาในความดูแลและสถานะล่าสุดได้ถูกต้องบนเบราว์เซอร์
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: `test_AC_AVR_01_view_advisee_list_success`, `test_AC_AVR_01_render_advisee_list_and_semester_filter`; test เฟส 0 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-AVR-01:
  Given อาจารย์ A เข้าสู่ระบบและมีนักศึกษาในที่ปรึกษาในภาคการศึกษาปัจจุบัน
  When เปิดหน้าผลการตรวจสอบคุณสมบัติของนักศึกษาในที่ปรึกษา
  Then ระบบแสดงเฉพาะข้อมูลของนักศึกษาในความดูแลของอาจารย์ A ตามสถานะล่าสุดของคำร้อง
- ยังขาด: ไม่มี

---

## เฟส 2: แจ้งเมื่อไม่มีนักศึกษาในความดูแล (AC-AVR-02)

### T-06 รองรับกรณีไม่มีนักศึกษาในความดูแลทั้งฝั่ง API และหน้าจอ
- รองรับ: FR-AVR-05, NFR-AVR-03, IF-WEB-01
- ตรวจด้วย: AC-AVR-02
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/service.py`, `backend/tests/advisor_view_advisee_result/test_list_advisees.py`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; ใช้ `AdvisorAdviseeListPage` แสดงข้อความภาษาไทยว่า "ไม่มีข้อมูล"
- ต้องทำหลัง: T-04, T-05
- เสร็จเมื่อ: `test_AC_AVR_02_empty_advisee_list` ผ่านทั้งฝั่ง backend (คืนรายการว่าง) และ frontend (แสดงข้อความภาษาไทย "ไม่มีข้อมูล")
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: `test_AC_AVR_02_empty_advisee_list`; test เฟส 0–1 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-AVR-02:
  Given อาจารย์ B ไม่มีนักศึกษาในความดูแลในภาคการศึกษานั้น
  When เปิดหน้าผลการตรวจสอบ
  Then ระบบแสดงข้อความภาษาไทยว่า "ไม่มีข้อมูล"
- ยังขาด: ไม่มี

---

## เฟส 3: แสดงสถานะรอตรวจสอบเมื่อผลยังไม่พร้อม (AC-AVR-03)

### T-07 จัดการการแสดงผลคำร้องที่ยังไม่มีผลตรวจหรือยังไม่เผยแพร่
- รองรับ: FR-AVR-06, DR-AVR-02, NFR-AVR-03, ASM-AVR-05
- ตรวจด้วย: AC-AVR-03
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/service.py`, `backend/tests/advisor_view_advisee_result/test_list_advisees.py`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงป้ายสถานะ "รอตรวจสอบ" แทนช่องว่าง
- ต้องทำหลัง: T-04, T-05
- เสร็จเมื่อ: `test_AC_AVR_03_result_pending_display` ผ่าน โดยเมื่อผลยังไม่เผยแพร่ตาม UC-14 ระบบคืนค่าและแสดงผล "รอตรวจสอบ" ไม่ปล่อยเป็นค่าว่าง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: `test_AC_AVR_03_result_pending_display`; test เฟส 0–2 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-AVR-03:
  Given นักศึกษาในความดูแลส่งคำร้องแล้วแต่ยังไม่มีผลการตรวจสอบที่เผยแพร่
  When เปิดหน้าผลการตรวจสอบ
  Then ระบบแสดงสถานะ "รอตรวจสอบ" ในช่องผลของนักศึกษาคนนั้นโดยไม่แสดงช่องว่าง
- ยังขาด: ไม่มี

---

## เฟส 4: เปิดดูรายละเอียดผลการศึกษาของนักศึกษารายบุคคล (AC-AVR-05)

### T-08 สร้าง endpoint ดึงรายละเอียดผลการศึกษาและไฟล์ Transcript ของนักศึกษา 1 คน
- รองรับ: FR-AVR-04, DR-AVR-03, CON-AVR-01, ASM-AVR-04
- ตรวจด้วย: AC-AVR-05
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/routes.py`, `backend/app/advisor_view_advisee_result/service.py`, `backend/tests/advisor_view_advisee_result/test_detail_advisee.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02, T-04
- เสร็จเมื่อ: `test_AC_AVR_05_api_returns_uc09_detail_dataset` ผ่าน โดย `GET /api/v1/advisor/advisees/{student_id}` คืนข้อมูล `AcademicRecord` และรายการ `AcademicRecordFile` ตรงกับชุดข้อมูลใน UC-09
- สถานะ: พร้อมทำ

### T-09 สร้างหน้าจอรายละเอียดรายบุคคลโหมดอ่านอย่างเดียว (AdvisorAdviseeDetailPage)
- รองรับ: FR-AVR-04, DR-AVR-03, IF-WEB-01, IF-TECH-01, ASM-AVR-04
- ตรวจด้วย: AC-AVR-05
- ไฟล์ที่แตะ: `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeDetailPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeDetailPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงรายละเอียดผลการศึกษาและลิงก์ไฟล์ Transcript แบบ Read-only โดยไม่มีปุ่มอนุมัติหรือส่งกลับตาม ASM-AVR-04
- ต้องทำหลัง: T-03, T-08
- เสร็จเมื่อ: `test_AC_AVR_05_advisee_detail_matches_uc09` ผ่าน โดยหน้าจอแสดงข้อมูลครบตรงกับ UC-09 และไม่มีปุ่มแก้ไข/อนุมัติ
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 4
- test ที่ต้องผ่านทั้งหมด: `test_AC_AVR_05_api_returns_uc09_detail_dataset`, `test_AC_AVR_05_advisee_detail_matches_uc09`; test เฟส 0–3 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-AVR-05:
  Given อาจารย์เปิดดูรายละเอียดของนักศึกษาในความดูแล 1 คนจากหน้ารายการ
  When หน้ารายละเอียดแสดงผล
  Then ข้อมูลผลการศึกษาและไฟล์ Transcript แสดงตรงกับชุดข้อมูลใน UC-09 ในโหมดอ่านอย่างเดียว
- ยังขาด: ไม่มี

---

## เฟส 5: ปฏิเสธการเข้าถึงนักศึกษาที่ไม่อยู่ในความดูแล (AC-AVR-04)

### T-10 บังคับใช้สิทธิ์ความเป็นอาจารย์ที่ปรึกษาและตอบ HTTP 403 เมื่อไม่มีสิทธิ์
- รองรับ: FR-AVR-01, FR-AVR-08, CON-AVR-01, NFR-AVR-02
- ตรวจด้วย: AC-AVR-04
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/authz.py`, `backend/app/advisor_view_advisee_result/routes.py`, `backend/tests/advisor_view_advisee_result/test_authz.py`, `backend/tests/advisor_view_advisee_result/test_detail_advisee.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-08
- เสร็จเมื่อ: `test_AC_AVR_04_access_unassigned_student_forbidden` ผ่าน โดยอาจารย์ Y เรียกข้อมูลนักศึกษา X ที่ไม่อยู่ในความดูแลแล้วได้รับ HTTP 403 พร้อม Audit Log การเข้าถึงและไม่มีข้อมูลของ X รั่วไหล
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 5
- test ที่ต้องผ่านทั้งหมด: `test_AC_AVR_04_access_unassigned_student_forbidden`; test เฟส 0–4 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-AVR-04:
  Given นักศึกษา X ไม่อยู่ในความดูแลของอาจารย์ Y
  When อาจารย์ Y เรียก API หรือเปิดลิงก์รายละเอียดของนักศึกษา X
  Then ระบบตอบ HTTP 403 และไม่คืนข้อมูลของนักศึกษา X
- ยังขาด: ไม่มี

---

## เฟส 6: แจ้งข้อผิดพลาดภาษาไทยเมื่อแหล่งข้อมูลไม่พร้อมใช้งาน (AC-AVR-06)

### T-11 จัดการความล้มเหลวของฐานข้อมูลและปุ่มลองใหม่บนหน้าจอ
- รองรับ: FR-AVR-07, NFR-AVR-03, IF-WEB-01
- ตรวจด้วย: AC-AVR-06
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/routes.py`, `backend/tests/advisor_view_advisee_result/test_error_handling.py`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeDetailPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดง alert ภาษาไทยและปุ่ม "ลองใหม่"
- ต้องทำหลัง: T-05, T-09
- เสร็จเมื่อ: `test_AC_AVR_06_database_error_handling` ผ่านทั้งฝั่ง API (คืน error code ที่เหมาะสม) และหน้าจอ (แสดงข้อความผิดพลาดภาษาไทยพร้อมปุ่มลองใหม่)
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 6
- test ที่ต้องผ่านทั้งหมด: `test_AC_AVR_06_database_error_handling`; test เฟส 0–5 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-AVR-06:
  Given ฐานข้อมูลไม่พร้อมใช้งานขณะเปิดดูผล
  When เปิดหน้าผลการตรวจสอบหรือกดดูรายละเอียด
  Then ระบบแสดงข้อความผิดพลาดเป็นภาษาไทยพร้อมปุ่มให้ลองใหม่
- ยังขาด: ไม่มี

---

## เฟส 7: Session Timeout, การแสดงผลมือถือ 360 px และประสิทธิภาพ (AC-AVR-07)

### T-12 ตัดการเชื่อมต่อเมื่อไม่มีการใช้งานเกิน 30 นาที
- รองรับ: IF-AUTH-01, NFR-AVR-01
- ตรวจด้วย: AC-AVR-07
- ไฟล์ที่แตะ: `backend/app/advisor_view_advisee_result/authz.py`, `backend/tests/advisor_view_advisee_result/test_authz.py`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; เมื่อได้รับ 401 จาก session หมดอายุให้ส่งกลับไปหน้ายืนยันตัวตน
- ต้องทำหลัง: T-02, T-05, T-09
- เสร็จเมื่อ: `test_AC_AVR_07_session_timeout_disconnect` ผ่าน โดยจำลองเวลา idle เกิน 30 นาทีแล้วระบบปฏิเสธ session และให้ยืนยันตัวตนใหม่
- สถานะ: พร้อมทำ

### T-13 ตรวจการแสดงผลมือถือ >= 360 px และวัดประสิทธิภาพ p95 <= 2 วินาที สำหรับ 50 รายการ
- รองรับ: NFR-AVR-04, NFR-AVR-05, IF-WEB-01, IF-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตรวจ NFR-AVR-04 และ NFR-AVR-05
- ไฟล์ที่แตะ: `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeListPage.jsx`, `frontend/src/features/uc10-advisor-view-advisee-result/AdvisorAdviseeDetailPage.jsx`, `backend/tests/advisor_view_advisee_result/test_performance.py`
- แบบหน้าจอ: ไม่มี mockup HTML; ตรวจ layout ที่ viewport 360 px ไม่ให้เกิดการเลื่อนแนวนอน
- ต้องทำหลัง: T-05, T-09
- เสร็จเมื่อ: `test_NFR_AVR_04_responsive_360px` และ `test_NFR_AVR_05_p95_under_2s_for_50_advisees` ผ่าน
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 7
- test ที่ต้องผ่านทั้งหมด: `test_AC_AVR_07_session_timeout_disconnect`, `test_NFR_AVR_04_responsive_360px`, `test_NFR_AVR_05_p95_under_2s_for_50_advisees`; test เฟส 0–6 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-AVR-07:
  Given อาจารย์เข้าสู่ระบบแล้วไม่ได้ใช้งานต่อเนื่องเกิน 30 นาที
  When เปิดหน้าผลการตรวจสอบหรือกดรีเฟรชอีกครั้ง
  Then ระบบตัดการเชื่อมต่อและบังคับให้ยืนยันตัวตนใหม่
- ยังขาด: ไม่มี

---

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-AVR-01 | T-04, T-05 |
| AC-AVR-02 | T-06 |
| AC-AVR-03 | T-07 |
| AC-AVR-04 | T-10 |
| AC-AVR-05 | T-08, T-09 |
| AC-AVR-06 | T-11 |
| AC-AVR-07 | T-12 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| IF-AUTH-01 | T-02, T-12 |
| IF-WEB-01 | T-03, T-05, T-06, T-09, T-11, T-13 |
| IF-TECH-01 | T-01, T-03, T-05, T-09, T-13 |
| CON-AVR-01 | T-01, T-04, T-08, T-10 |
| CON-AVR-02 | T-01, T-04 |

### Functional Requirements

| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-AVR-01 | AC-AVR-01, AC-AVR-04 | เฟส 0, 1, 5 |
| FR-AVR-02 | AC-AVR-01 | เฟส 1 |
| FR-AVR-03 | AC-AVR-01 | เฟส 1 |
| FR-AVR-04 | AC-AVR-05 | เฟส 4 |
| FR-AVR-05 | AC-AVR-02 | เฟส 2 |
| FR-AVR-06 | AC-AVR-03 | เฟส 3 |
| FR-AVR-07 | AC-AVR-06 | เฟส 6 |
| FR-AVR-08 | AC-AVR-04 | เฟส 5 |

---

## สิ่งที่ยังไม่ทำ
- Open Questions: ไม่มี (ทุกข้อได้รับการสรุปเป็น Assumption แล้วใน `spec.md` Draft v2)
- Task ที่รอคำตอบ: ไม่มี (0 task)
