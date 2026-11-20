# งานพัฒนา SPEC-SGN-011: ลงนาม / รับรองเอกสาร (Sign and Certify Document)

- Feature: ลงนาม / รับรองเอกสาร
- Spec ID: SPEC-SGN-011
- อ้างอิง: [spec.md](./spec.md), [plan.md](./plan.md), [common.md](../common.md)
- วันที่: 2569-11-20

สรุป:
- มี 9 เฟส (เฟส 0–8) รวม 14 task
- มี 0 task ที่ต้องรอ Open Questions (ทุกข้อได้รับการสรุปเป็น Assumption แล้วใน spec.md Draft v2)
- เฟส 1 (AC-SGN-01) เป็นเฟสแรกที่ลองใช้งานได้จริงในการพรีวิวเอกสารและกดลงนามรับรอง

---

## เฟส 0: ฐานราก

### T-01 สร้างตาราง DocumentCertification (ห้ามแก้/ลบ) และโมเดล AuditLog
- รองรับ: IF-TECH-01, CON-SGN-02, IF-AUDIT-01, DR-SGN-01, DR-SGN-03, NFR-SGN-03
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05, T-12, T-13
- ไฟล์ที่แตะ: `backend/app/main.py`, `backend/app/sign_certify_document/__init__.py`, `backend/app/sign_certify_document/models.py`, `backend/tests/sign_certify_document/test_models.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_models_certification_immutable_schema` ผ่าน โดยสร้างตาราง `DocumentCertification` และ `AuditLog` ใน PostgreSQL พร้อม DB trigger/rule ป้องกันการ UPDATE/DELETE ข้อมูลการลงนาม
- สถานะ: พร้อมทำ

### T-02 สร้างกลไกตรวจ session มหาวิทยาลัยและตรวจสอบสิทธิ์อาจารย์
- รองรับ: IF-AUTH-01, NFR-SGN-01, NFR-SGN-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-05, T-10, T-12, T-14
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/authz.py`, `backend/tests/sign_certify_document/test_authz.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: `test_IF_AUTH_01_requires_valid_session` ผ่าน โดยปฏิเสธ request ที่ไม่มี session ด้วย HTTP 401 และตรวจจับ role สำหรับการลงนามได้
- สถานะ: พร้อมทำ

### T-03 สร้าง API client สำหรับฟีเจอร์ลงนามรับรองเอกสาร
- รองรับ: IF-WEB-01, IF-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06, T-07, T-08, T-09, T-11
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/api/client.test.js`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_API_client_certification_endpoints` ผ่าน โดยเรียก GET document และ POST sign ได้และทดสอบด้วย client จำลอง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 0
- test ที่ต้องผ่านทั้งหมด: `test_models_certification_immutable_schema`, `test_IF_AUTH_01_requires_valid_session`, `test_API_client_certification_endpoints`
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตามงานฐานราก (ไม่มี AC ตรง ๆ):
  Given เปิดหน้าเว็บโดยไม่มี session ของบัญชีมหาวิทยาลัย
  When เรียก `GET /api/v1/certifications/{record_id}/document`
  Then ระบบตอบ HTTP 401 ตาม IF-AUTH-01
- ยังขาด: ไม่มี

---

## เฟส 1: ดูเอกสารและลงนามรับรองสำเร็จ (AC-SGN-01)

### T-04 สร้าง endpoint ดึงเอกสารคำร้องและไฟล์แนบมาแสดงพรีวิว
- รองรับ: FR-SGN-01, FR-SGN-02, ASM-SGN-04, ASM-SGN-06
- ตรวจด้วย: AC-SGN-01
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/routes.py`, `backend/app/sign_certify_document/service.py`, `backend/tests/sign_certify_document/test_sign_flow.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `test_AC_SGN_01_get_document_preview` ผ่าน โดย `GET /api/v1/certifications/{record_id}/document` คืนข้อมูลคำร้องที่อนุมัติแล้วและ URL เข้าถึงไฟล์ Transcript
- สถานะ: พร้อมทำ

### T-05 สร้าง endpoint ลงนามรับรอง คำนวณ SHA-256 และอัปเดตสถานะเป็นรับรองแล้ว
- รองรับ: FR-SGN-03, FR-SGN-04, FR-SGN-05, DR-SGN-01, DR-SGN-03, NFR-SGN-04, ASM-SGN-07, ASM-SGN-08, ASM-SGN-10
- ตรวจด้วย: AC-SGN-01
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/routes.py`, `backend/app/sign_certify_document/service.py`, `backend/tests/sign_certify_document/test_sign_flow.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: `test_AC_SGN_01_sign_success_and_status_update` ผ่าน โดย `POST /api/v1/certifications/{record_id}/sign` คำนวณ SHA-256 Checksum ของเอกสาร บันทึกผู้ลงนาม/เวลา และเปลี่ยนสถานะคำร้องเป็น "รับรองแล้ว" ในธุรกรรมเดียว
- สถานะ: พร้อมทำ

### T-06 สร้างหน้าจอลงนามรับรองเอกสาร (DocumentSigningPage)
- รองรับ: FR-SGN-02, FR-SGN-03, IF-WEB-01, IF-TECH-01, NFR-SGN-05, ASM-SGN-07
- ตรวจด้วย: AC-SGN-01
- ไฟล์ที่แตะ: `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.jsx`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML แยก; แสดงพรีวิวไฟล์ Transcript, รายละเอียดคำร้อง, ปุ่มกดยืนยันลงนาม (Click-to-Sign) และแสดงสถานะ "รับรองแล้ว" เมื่อสำเร็จ
- ต้องทำหลัง: T-03, T-05
- เสร็จเมื่อ: `test_AC_SGN_01_ui_preview_and_click_to_sign` ผ่าน โดยอาจารย์สามารถเปิดดูเอกสารและกดยืนยันลงนามบนหน้าจอได้
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_01_get_document_preview`, `test_AC_SGN_01_sign_success_and_status_update`, `test_AC_SGN_01_ui_preview_and_click_to_sign`; test เฟส 0 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-01:
  Given คำร้องของนักศึกษาผ่านการอนุมัติจาก UC-09 แล้วและมีไฟล์ Transcript ครบ
  When อาจารย์เปิดหน้าจอ `DocumentSigningPage` ตรวจเอกสารแล้วกดปุ่มยืนยันลงนามรับรอง
  Then ระบบบันทึกผู้ลงนาม วันที่/เวลา ค่า Checksum และเปลี่ยนสถานะคำร้องเป็น "รับรองแล้ว"
- ยังขาด: ไม่มี

---

## เฟส 2: ป้องกันการลงนามรายการที่ยังไม่ได้รับอนุมัติ (AC-SGN-02)

### T-07 ตรวจสอบสถานะอนุมัติก่อนลงนามและแจ้งเหตุผลเมื่อไม่อนุญาต
- รองรับ: FR-SGN-01, FR-SGN-06, CON-SGN-01, NFR-SGN-05, ASM-SGN-04
- ตรวจด้วย: AC-SGN-02
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/service.py`, `backend/tests/sign_certify_document/test_validations.py`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.jsx`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงข้อความเตือนภาษาไทยระบุเหตุผลว่าคำร้องยังไม่ได้รับการอนุมัติจาก UC-09
- ต้องทำหลัง: T-05, T-06
- เสร็จเมื่อ: `test_AC_SGN_02_sign_unapproved_rejected` ผ่านทั้ง API และ UI โดยระบบไม่อนุญาตให้ลงนามรายการที่ยังไม่ผ่านการอนุมัติและแจ้งเหตุผลเป็นภาษาไทย
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_02_sign_unapproved_rejected`; test เฟส 0–1 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-02:
  Given คำร้องยังไม่ได้รับการอนุมัติ
  When อาจารย์พยายามลงนามรับรอง
  Then ระบบไม่อนุญาตให้ลงนามและแสดงเหตุผลภาษาไทยที่ชัดเจน
- ยังขาด: ไม่มี

---

## เฟส 3: ตรวจสอบความครบถ้วนของเอกสารก่อนลงนาม (AC-SGN-03)

### T-08 ตรวจสอบการมีอยู่ของไฟล์ Transcript และแจ้งให้แก้ไขเมื่อเอกสารไม่ครบ
- รองรับ: FR-SGN-07, DR-SGN-02, NFR-SGN-05, ASM-SGN-05
- ตรวจด้วย: AC-SGN-03
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/service.py`, `backend/tests/sign_certify_document/test_validations.py`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.jsx`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงข้อความภาษาไทยแจ้งให้แนบ Transcript ให้ครบก่อนลงนาม
- ต้องทำหลัง: T-05, T-06
- เสร็จเมื่อ: `test_AC_SGN_03_sign_missing_document_rejected` ผ่าน โดยเมื่อไม่มีไฟล์ Transcript อย่างน้อย 1 ไฟล์ ระบบปฏิเสธไม่บันทึกการลงนามและแจ้งสิ่งที่ต้องแก้ไข
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_03_sign_missing_document_rejected`; test เฟส 0–2 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-03:
  Given คำร้องไม่มีไฟล์ Transcript แนบอยู่
  When อาจารย์พยายามกดลงนาม
  Then ระบบไม่บันทึกการลงนาม และแจ้งข้อความภาษาไทยให้ดำเนินการแนบเอกสารให้ครบก่อน
- ยังขาด: ไม่มี

---

## เฟส 4: ตรวจสอบชนิดและขนาดไฟล์เอกสาร (AC-SGN-07)

### T-09 ตรวจสอบชนิดไฟล์ (PDF/JPG/PNG) และขนาดไม่เกิน 10 MB
- รองรับ: CON-FILE-01, NFR-SGN-05, ASM-SGN-03
- ตรวจด้วย: AC-SGN-07
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/service.py`, `backend/tests/sign_certify_document/test_validations.py`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.jsx`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงข้อความเตือนเงื่อนไขชนิดและขนาดไฟล์ที่รองรับ
- ต้องทำหลัง: T-04, T-06
- เสร็จเมื่อ: `test_AC_SGN_07_invalid_file_type_or_size_rejected` ผ่าน โดยเอกสารที่ไม่ใช่ PDF/JPG/PNG หรือมีขนาดเกิน 10 MB จะถูกปฏิเสธพร้อมแจ้งเงื่อนไขไฟล์ที่รับได้
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 4
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_07_invalid_file_type_or_size_rejected`; test เฟส 0–3 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-07:
  Given คำร้องมีไฟล์แนบชนิดไม่ถูกต้อง หรือขนาดเกิน 10 MB
  When ระบบตรวจสอบเอกสารก่อนลงนาม
  Then ระบบไม่รับเอกสารนั้นและแสดงเงื่อนไขไฟล์เป็นภาษาไทย (PDF, JPG, PNG ขนาดไม่เกิน 10 MB)
- ยังขาด: ไม่มี

---

## เฟส 5: ปฏิเสธผู้ใช้ที่ไม่มีสิทธิ์ลงนามด้วย HTTP 403 (AC-SGN-05)

### T-10 บังคับสิทธิ์เฉพาะอาจารย์ที่ปรึกษาที่ดูแลคำร้องนั้น
- รองรับ: FR-SGN-10, NFR-SGN-02, ASM-SGN-07
- ตรวจด้วย: AC-SGN-05
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/authz.py`, `backend/app/sign_certify_document/routes.py`, `backend/tests/sign_certify_document/test_authz.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-05
- เสร็จเมื่อ: `test_AC_SGN_05_unauthorized_user_forbidden` ผ่าน โดยนักศึกษาหรืออาจารย์คนอื่นที่ไม่มีสิทธิ์ส่ง request ลงนามแล้วระบบตอบ HTTP 403 และไม่มีการบันทึกข้อมูล
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 5
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_05_unauthorized_user_forbidden`; test เฟส 0–4 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-05:
  Given ผู้ใช้ที่เป็นนักศึกษาหรืออาจารย์ท่านอื่นที่ไม่ได้รับผิดชอบคำร้องนั้น
  When ส่งคำขอ `POST /api/v1/certifications/{record_id}/sign`
  Then ระบบตอบ HTTP 403 และไม่มีข้อมูลการลงนามถูกบันทึก
- ยังขาด: ไม่มี

---

## เฟส 6: จัดการข้อผิดพลาดฐานข้อมูลและ Rollback ธุรกรรม (AC-SGN-04)

### T-11 รองรับธุรกรรม Rollback เมื่อฐานข้อมูลขัดข้องและแจ้งเตือนบนหน้าจอ
- รองรับ: FR-SGN-08, NFR-SGN-05, IF-WEB-01
- ตรวจด้วย: AC-SGN-04
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/service.py`, `backend/tests/sign_certify_document/test_error_handling.py`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.jsx`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; แสดงข้อความแจ้งข้อผิดพลาดภาษาไทยและไม่เปลี่ยนสถานะบนหน้าจอ
- ต้องทำหลัง: T-05, T-06
- เสร็จเมื่อ: `test_AC_SGN_04_db_failure_keeps_original_status` ผ่าน โดยเมื่อจำลอง DB ล้มเหลวขณะบันทึก สถานะคำร้องในฐานข้อมูลคงเดิมและ UI แสดงข้อความผิดพลาดภาษาไทย
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 6
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_04_db_failure_keeps_original_status`; test เฟส 0–5 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-04:
  Given ฐานข้อมูลไม่พร้อมใช้งานขณะบันทึกการลงนาม
  When อาจารย์กดยืนยันลงนาม
  Then ระบบแจ้งข้อผิดพลาดภาษาไทย และสถานะของรายการคงเป็นสถานะเดิม
- ยังขาด: ไม่มี

---

## เฟส 7: บันทึกและเรียกดูประวัติการลงนาม (AC-SGN-08)

### T-12 บันทึก AuditLog และสร้าง endpoint ให้เจ้าหน้าที่เรียกดูประวัติการลงนาม
- รองรับ: FR-SGN-09, IF-AUDIT-01, NFR-SGN-03
- ตรวจด้วย: AC-SGN-08
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/service.py`, `backend/app/sign_certify_document/routes.py`, `backend/tests/sign_certify_document/test_audit_history.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-05
- เสร็จเมื่อ: `test_AC_SGN_08_audit_log_recorded` ผ่าน โดยการลงนาม 1 ครั้งสร้างรายการใน `AuditLog` และ `GET /api/v1/certifications/{record_id}/history` คืนประวัติที่มีผู้ดำเนินการและเวลาให้เจ้าหน้าที่ตรวจดูได้
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 7
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_08_audit_log_recorded`; test เฟส 0–6 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-08:
  Given มีการลงนามรับรองสำเร็จ 1 ครั้ง
  When เจ้าหน้าที่เรียกดูประวัติผ่าน `GET /api/v1/certifications/{record_id}/history`
  Then พบประวัติ 1 รายการระบุผู้ดำเนินการ เวลา และรายละเอียดการรับรองครบถ้วน
- ยังขาด: ไม่มี

---

## เฟส 8: ป้องกันการแก้ไข/ลบย้อนหลัง, Session Timeout และจอมือถือ 360 px (AC-SGN-06)

### T-13 ทดสอบการป้องกันการแก้ไข/ลบข้อมูลการลงนามย้อนหลังและความคงสภาพเอกสาร
- รองรับ: FR-SGN-11, CON-SGN-02, NFR-SGN-03, NFR-SGN-04, ASM-SGN-08, ASM-SGN-09
- ตรวจด้วย: AC-SGN-06
- ไฟล์ที่แตะ: `backend/app/sign_certify_document/models.py`, `backend/app/sign_certify_document/service.py`, `backend/tests/sign_certify_document/test_immutability.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-05
- เสร็จเมื่อ: `test_AC_SGN_06_prevent_update_or_delete_signature` ผ่าน โดยการพยายาม UPDATE/DELETE ข้อมูลการลงนามถูกปฏิเสธ เอกสารถูกล็อก Read-only และ SHA-256 ตรวจพบได้หากไฟล์ถูกเปลี่ยนแปลง
- สถานะ: พร้อมทำ

### T-14 ทดสอบ Session timeout 30 นาที และการใช้งานหน้าจอมือถือที่ความกว้าง 360 px
- รองรับ: NFR-SGN-01, NFR-SGN-06, IF-AUTH-01, IF-WEB-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตรวจ NFR-SGN-01 และ NFR-SGN-06
- ไฟล์ที่แตะ: `backend/tests/sign_certify_document/test_authz.py`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.jsx`, `frontend/src/features/uc11-sign-certify-document/DocumentSigningPage.test.jsx`
- แบบหน้าจอ: ไม่มี mockup HTML; ตรวจ layout ในเบราว์เซอร์ที่ 360 px ไม่ให้มีการเลื่อนแนวนอน
- ต้องทำหลัง: T-02, T-06
- เสร็จเมื่อ: `test_NFR_SGN_01_session_timeout_30_minutes` และ `test_NFR_SGN_06_responsive_360px` ผ่าน
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 8
- test ที่ต้องผ่านทั้งหมด: `test_AC_SGN_06_prevent_update_or_delete_signature`, `test_NFR_SGN_01_session_timeout_30_minutes`, `test_NFR_SGN_06_responsive_360px`; test เฟส 0–7 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: `cd backend && uvicorn app.main:app --reload`; หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-SGN-06:
  Given รายการคำร้องถูกอาจารย์ลงนามรับรองแล้ว
  When มีการพยายามแก้ไขหรือลบข้อมูลการลงนาม หรืออัปโหลดไฟล์ทับ
  Then ระบบไม่อนุญาตให้แก้ไขหรือลบ และข้อมูลผู้ลงนามกับวันเวลายังคงเดิม
- ยังขาด: ไม่มี

---

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-SGN-01 | T-04, T-05, T-06 |
| AC-SGN-02 | T-07 |
| AC-SGN-03 | T-08 |
| AC-SGN-04 | T-11 |
| AC-SGN-05 | T-10 |
| AC-SGN-06 | T-13 |
| AC-SGN-07 | T-09 |
| AC-SGN-08 | T-12 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| IF-AUTH-01 | T-02, T-14 |
| IF-WEB-01 | T-03, T-06, T-11, T-14 |
| IF-TECH-01 | T-01, T-03, T-06 |
| IF-AUDIT-01 | T-01, T-12 |
| CON-FILE-01 | T-09 |
| CON-SGN-01 | T-07 |
| CON-SGN-02 | T-01, T-13 |

### Functional Requirements

| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-SGN-01 | AC-SGN-01, AC-SGN-02 | เฟส 1, 2 |
| FR-SGN-02 | AC-SGN-01 | เฟส 1 |
| FR-SGN-03 | AC-SGN-01 | เฟส 1 |
| FR-SGN-04 | AC-SGN-01 | เฟส 1 |
| FR-SGN-05 | AC-SGN-01 | เฟส 1 |
| FR-SGN-06 | AC-SGN-02 | เฟส 2 |
| FR-SGN-07 | AC-SGN-03 | เฟส 3 |
| FR-SGN-08 | AC-SGN-04 | เฟส 6 |
| FR-SGN-09 | AC-SGN-08 | เฟส 7 |
| FR-SGN-10 | AC-SGN-05 | เฟส 5 |
| FR-SGN-11 | AC-SGN-06 | เฟส 8 |

---

## สิ่งที่ยังไม่ทำ
- Open Questions: ไม่มี (ทุกข้อได้รับการสรุปเป็น Assumption แล้วใน `spec.md` Draft v2)
- Task ที่รอคำตอบ: ไม่มี (0 task)
