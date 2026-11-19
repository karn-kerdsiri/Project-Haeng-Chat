# งานพัฒนา SPEC-APR-009: ตรวจสอบและอนุมัติผลการศึกษาของนักศึกษา

- Feature: ตรวจสอบและอนุมัติผลการศึกษาของนักศึกษา
- Spec ID: SPEC-APR-009
- อ้างอิง: [spec.md](./spec.md), [plan.md](./plan.md)
- วันที่: 2569-11-19

สรุป:
- มี 8 เฟส รวม 25 task
- มี 12 task ที่รอคำตอบ Open Questions
- เฟส 1 เริ่มลองใช้งานได้จริงในส่วนดูรายการและเลือกนักศึกษาหนึ่งคน; รายละเอียดและการตัดสินใจยังรอ Q-01/Q-02

หมายเหตุ: ไม่พบ mockup HTML ในโฟลเดอร์ของ feature หรือ `specs/000-shared/mockups/` และ spec ไม่มีหมวดหน้าจอ (UI) แยกต่างหาก จึงอ้างอิง IN-APR และ FR ใน spec โดยตรง. ใช้โครง feature `frontend/src/features/uc09-advisor-approve-record/` ตามรูปแบบที่มีอยู่. Backend framework และ path ของไฟล์ยังไม่ระบุใน plan.md จึงให้ทีมเลือกเอง ไม่ได้มาจาก spec; endpoint ที่ระบุใน plan.md เป็นข้อเสนอทางเทคนิค. คำสั่งเปิด backend ยังไม่ระบุ; หน้าจอใช้ `cd frontend && npm run dev`.

## เฟส 0: ฐานราก

### T-01 สร้าง API client สำหรับเรียก endpoint ของแผนอาจารย์
- รองรับ: IF-WEB-01, IF-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-05, T-07, T-09 และ T-11
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/api/client.test.js`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_API_client_calls_advisor_review_endpoints` ผ่าน โดย client เรียก path ที่ผู้เรียกกำหนดได้และทดสอบด้วย client จำลอง
- สถานะ: พร้อมทำ

### T-02 ใช้ session เดิมตรวจทุก request
- รองรับ: IF-AUTH-01, NFR-APR-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-10 และ T-12
- ไฟล์ที่แตะ: จุดเชื่อม session/guard และ test ฝั่ง backend (framework/path ทีมเลือกเอง เพราะ plan.md ไม่ระบุ)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_IF_AUTH_01_requires_university_session` และ `test_NFR_APR_01_expires_after_30_minutes_idle` ผ่าน โดย request ที่ไม่มี session ถูกปฏิเสธ และ session หมดอายุเมื่อไม่มีการใช้งานเกิน 30 นาที
- สถานะ: พร้อมทำ

### T-03 เตรียมที่เก็บประวัติแบบเพิ่มได้อย่างเดียว
- รองรับ: IF-TECH-01, IF-AUDIT-01, DR-APR-05, FR-APR-08, NFR-APR-03
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-13, T-16 และ T-17
- ไฟล์ที่แตะ: โมเดล/repository ประวัติและ test ฝั่ง backend (PostgreSQL ตาม IF-TECH-01; framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: `test_DR_APR_05_history_records_actor_time_and_statuses` และ `test_IF_AUDIT_01_history_is_append_only` ผ่าน โดยรายการมีผู้ดำเนินการ เวลา สถานะก่อน/หลัง และไม่มีการแก้ไขหรือลบย้อนหลังผ่าน repository
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 0
- test ที่ต้องผ่านทั้งหมด: `test_API_client_calls_advisor_review_endpoints`, `test_IF_AUTH_01_requires_university_session`, `test_NFR_APR_01_expires_after_30_minutes_idle`, `test_DR_APR_05_history_records_actor_time_and_statuses`, `test_IF_AUDIT_01_history_is_append_only`
- เปิดระบบ: หลังบ้าน: คำสั่งตาม framework ที่ทีมเลือก (ยังไม่ระบุใน plan.md); หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตามงานฐานราก (ไม่มี AC ตรง ๆ):
  Given เปิดหน้าจอในเบราว์เซอร์
  When เรียก API โดยไม่มี session ที่ยืนยันตัวตน
  Then ระบบปฏิเสธ request ตาม IF-AUTH-01
- ยังขาด: คำสั่งเปิด backend ตามที่ plan.md เว้นไว้

## เฟส 1: ดูรายการและเลือกนักศึกษาหนึ่งคน (AC-APR-01, ส่วนที่ไม่ติด Q)

### T-04 แสดงรายการที่อยู่ในความดูแลและรอตรวจ
- รองรับ: FR-APR-01, DR-APR-01, CON-APR-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ สำหรับรายการที่ไม่ว่าง (การตามรอยตรงรอ Q-07); ใช้ข้อมูลตาม FR-APR-01/DR-APR-01
- ไฟล์ที่แตะ: `GET /api/advisor/reviews` route/service และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: `test_FR_APR_01_advisor_queue_contains_only_assigned_students_and_required_fields` ผ่าน โดยส่งคืนเฉพาะนักศึกษาที่อยู่ในความดูแลและรอตรวจ พร้อมชื่อ รหัสนักศึกษา และสถานะ
- สถานะ: พร้อมทำ

### T-05 แสดงรายการและให้เลือกนักศึกษาหนึ่งคน
- รองรับ: FR-APR-01, FR-APR-02, DR-APR-01, CON-APR-01, ASM-APR-05, IF-WEB-01, IF-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ สำหรับรายการที่ไม่ว่าง (รอ Q-07); การเลือกหนึ่งคนเป็นส่วนของ AC-APR-01
- ไฟล์ที่แตะ: `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.jsx`, `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.test.jsx`, `frontend/src/App.jsx`
- แบบหน้าจอ: ไม่มี mockup; ใช้ IN-APR-01/02
- ต้องทำหลัง: T-01, T-04
- เสร็จเมื่อ: `test_FR_APR_01_review_queue_shows_required_fields` และ `test_FR_APR_02_selects_one_student_at_a_time` ผ่านด้วย client จำลอง โดยแสดงชื่อ รหัส และสถานะ และเลือกได้ครั้งละหนึ่งคน
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: `test_FR_APR_01_advisor_queue_contains_only_assigned_students_and_required_fields`, `test_FR_APR_01_review_queue_shows_required_fields`, `test_FR_APR_02_selects_one_student_at_a_time`; test เฟส 0 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: คำสั่งตาม framework ที่ทีมเลือก (ยังไม่ระบุใน plan.md); หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-APR-01 (ส่วนที่ไม่ติด Q):
  Given มีรายการนักศึกษาที่อาจารย์มีสิทธิ์ตรวจสอบ
  When อาจารย์เปิดรายการและเลือกนักศึกษาหนึ่งคน
  Then เห็นข้อมูลรายการตาม DR-APR-01 และเลือกได้ทีละคน
- ยังขาด: ฟิลด์รายละเอียดตาม Q-01 และการบันทึกผล/สถานะตาม Q-02

## เฟส 2: ป้องกันการส่งกลับเมื่อไม่มีเหตุผล (AC-APR-02, กรณีแรก)

### T-06 ปฏิเสธการส่งกลับเมื่อไม่มีเหตุผล
- รองรับ: FR-APR-05, DR-APR-04, NFR-APR-04
- ตรวจด้วย: AC-APR-02 (กรณีไม่มีเหตุผล)
- ไฟล์ที่แตะ: `POST /api/advisor/reviews/{requestId}/decision` validation และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: `test_AC_APR_02_return_requires_text_reason` ผ่านในกรณีเหตุผลว่าง โดยไม่ส่งกลับ ไม่เปลี่ยนสถานะ และตอบให้ผู้เรียกทราบว่าต้องกรอกเหตุผล
- สถานะ: พร้อมทำ

### T-07 แจ้งให้กรอกเหตุผลก่อนส่งกลับ
- รองรับ: FR-APR-05, DR-APR-04, NFR-APR-04, IF-WEB-01
- ตรวจด้วย: AC-APR-02 (กรณีไม่มีเหตุผล)
- ไฟล์ที่แตะ: `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.jsx`, `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ใช้ IN-APR-03
- ต้องทำหลัง: T-05, T-06
- เสร็จเมื่อ: `test_AC_APR_02_empty_reason_shows_thai_validation` ผ่านด้วย client จำลอง โดยแสดงข้อความภาษาไทยให้กรอกเหตุผลและไม่ส่ง request กลับเมื่อช่องว่าง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: `test_AC_APR_02_return_requires_text_reason`, `test_AC_APR_02_empty_reason_shows_thai_validation`; test เฟส 0–1 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: คำสั่งตาม framework ที่ทีมเลือก (ยังไม่ระบุใน plan.md); หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-APR-02 (กรณีเหตุผลว่าง):
  Given ข้อมูลนักศึกษาไม่ครบหรือไม่ถูกต้องและยังไม่กรอกเหตุผล
  When อาจารย์พยายามส่งกลับให้แก้ไข
  Then ระบบไม่ส่งกลับ ไม่เปลี่ยนสถานะ และแจ้งให้กรอกเหตุผล
- ยังขาด: การบันทึกเหตุผลและเปลี่ยนสถานะเมื่อมีเหตุผล รอ Q-02

## เฟส 3: แจ้งเมื่อไม่มีรายการรอตรวจ (AC-APR-03)

### T-08 จัดการผลรายการว่าง
- รองรับ: FR-APR-01, FR-APR-06, DR-APR-01, CON-APR-01
- ตรวจด้วย: AC-APR-03
- ไฟล์ที่แตะ: `GET /api/advisor/reviews` route/service และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: `test_AC_APR_03_empty_review_queue` ผ่านเมื่ออาจารย์ไม่มีรายการรอตรวจ โดย endpoint ส่งผลรายการว่างโดยไม่สร้างข้อมูลรายการแทน
- สถานะ: พร้อมทำ

### T-09 แสดงข้อความเมื่อไม่มีรายการ
- รองรับ: FR-APR-06, IF-WEB-01
- ตรวจด้วย: AC-APR-03
- ไฟล์ที่แตะ: `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.jsx`, `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ใช้ IN-APR-01
- ต้องทำหลัง: T-01, T-08
- เสร็จเมื่อ: `test_AC_APR_03_empty_review_queue_screen` ผ่านด้วย client จำลอง โดยหน้าจอแจ้งว่าไม่มีรายการและไม่แสดงแถวข้อมูลนักศึกษา
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: `test_AC_APR_03_empty_review_queue`, `test_AC_APR_03_empty_review_queue_screen`; test เฟส 0–2 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: คำสั่งตาม framework ที่ทีมเลือก (ยังไม่ระบุใน plan.md); หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-APR-03:
  Given ไม่มีนักศึกษาที่รอตรวจสอบในความดูแลของอาจารย์
  When เปิดเมนูรายการนักศึกษาที่รอตรวจสอบ
  Then ระบบแจ้งว่าไม่มีรายการ
- ยังขาด: ไม่มีสำหรับ AC-APR-03; การทดสอบรายการที่ไม่ว่างโดยตรงรอ Q-07

## เฟส 4: แจ้งข้อผิดพลาดเมื่อบันทึกไม่สำเร็จ (AC-APR-04)

### T-10 คงสถานะเดิมเมื่อฐานข้อมูลไม่พร้อม
- รองรับ: FR-APR-07, CON-APR-02, IF-TECH-01
- ตรวจด้วย: AC-APR-04
- ไฟล์ที่แตะ: decision service/repository และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03, T-06
- เสร็จเมื่อ: `test_AC_APR_04_save_failure_keeps_status` จำลองฐานข้อมูลไม่พร้อมขณะอนุมัติและยืนยันว่าระบบแจ้งข้อผิดพลาดโดยสถานะเดิมไม่เปลี่ยน
- สถานะ: พร้อมทำ

### T-11 แสดงข้อผิดพลาดโดยไม่แสดงผลสำเร็จค้าง
- รองรับ: FR-APR-07, CON-APR-02, NFR-APR-04, IF-WEB-01
- ตรวจด้วย: AC-APR-04
- ไฟล์ที่แตะ: `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.jsx`, `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewQueue.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ใช้ IN-APR-03
- ต้องทำหลัง: T-07, T-10
- เสร็จเมื่อ: `test_AC_APR_04_save_failure_shows_thai_error_without_success_state` ผ่านด้วย client จำลอง โดยแจ้งข้อผิดพลาดเป็นภาษาไทยและไม่แสดงสถานะสำเร็จหรือค่าที่ค้าง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 4
- test ที่ต้องผ่านทั้งหมด: `test_AC_APR_04_save_failure_keeps_status`, `test_AC_APR_04_save_failure_shows_thai_error_without_success_state`; test เฟส 0–3 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: คำสั่งตาม framework ที่ทีมเลือก (ยังไม่ระบุใน plan.md); หน้าจอ: `cd frontend && npm run dev`
- คนลองเองตาม AC-APR-04:
  Given ฐานข้อมูลไม่พร้อมใช้งานขณะบันทึกผล
  When อาจารย์กดอนุมัติ
  Then ระบบแจ้งข้อผิดพลาดและสถานะคำร้องยังเป็นสถานะเดิม
- ยังขาด: รายละเอียดการตอบเมื่อระบบบัญชีหรือการบันทึกประวัติไม่พร้อมรอ Q-05

## เฟส 5: ปฏิเสธอาจารย์ที่ไม่ได้ดูแลนักศึกษา (AC-APR-05)

### T-12 ปฏิเสธคำขอจากอาจารย์นอกความดูแล
- รองรับ: FR-APR-11, CON-APR-01, NFR-APR-02
- ตรวจด้วย: AC-APR-05
- ไฟล์ที่แตะ: decision route/authorization guard และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-04, T-10
- เสร็จเมื่อ: `test_AC_APR_05_other_advisor_gets_403` ผ่าน โดยอาจารย์ที่ไม่ได้ดูแลนักศึกษาได้รับ HTTP 403 และคำร้องไม่เปลี่ยนแปลง
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 5
- test ที่ต้องผ่านทั้งหมด: `test_AC_APR_05_other_advisor_gets_403`; test เฟส 0–4 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: คำสั่งตาม framework ที่ทีมเลือก (ยังไม่ระบุใน plan.md); หน้าจอ: ไม่มีหน้าจอเพิ่มในเฟสนี้
- คนลองเองตาม AC-APR-05:
  Given นักศึกษา X ไม่อยู่ในความดูแลของอาจารย์ Y
  When อาจารย์ Y ส่ง request อนุมัติคำร้องของนักศึกษา X
  Then ระบบตอบ HTTP 403 และคำร้องของ X ไม่เปลี่ยนแปลง
- ยังขาด: ไม่มีสำหรับพฤติกรรมที่ AC-APR-05 ระบุ

## เฟส 6: ให้เจ้าหน้าที่เรียกดูประวัติการเปลี่ยนสถานะ (AC-APR-08)

### T-13 ให้เจ้าหน้าที่เรียกดูประวัติแบบอ่านอย่างเดียว
- รองรับ: FR-APR-08, IF-AUDIT-01, DR-APR-05, NFR-APR-03
- ตรวจด้วย: AC-APR-08 (ตรวจฟิลด์และการแก้ย้อนหลัง; การเชื่อม event กับการตัดสินใจจริงรอ Q-02)
- ไฟล์ที่แตะ: ช่องทางเรียกดูประวัติและ test ฝั่ง backend (framework/path ทีมเลือกเอง; plan.md ยังไม่ระบุ API สำหรับประวัติ)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: `test_AC_APR_08_history_has_required_fields_and_is_immutable` ผ่าน โดยเจ้าหน้าที่เรียกดูรายการที่มีผู้ดำเนินการ เวลา สถานะก่อน/หลัง และช่องทางนี้แก้ไขประวัติไม่ได้
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 6
- test ที่ต้องผ่านทั้งหมด: `test_AC_APR_08_history_has_required_fields_and_is_immutable`; test เฟส 0–5 ต้องยังผ่าน
- เปิดระบบ: หลังบ้าน: คำสั่งตาม framework ที่ทีมเลือก (ยังไม่ระบุใน plan.md); หน้าจอ: ไม่มีหน้าจอเพิ่มในเฟสนี้
- คนลองเองตาม AC-APR-08:
  Given มีประวัติการเปลี่ยนสถานะคำร้องหนึ่งครั้ง
  When เจ้าหน้าที่เรียกดูประวัติของคำร้องนั้น
  Then พบประวัติหนึ่งรายการที่มีผู้ดำเนินการ เวลา สถานะก่อน/หลัง และแก้ไขย้อนหลังไม่ได้
- ยังขาด: การเชื่อมการบันทึกประวัติกับการอนุมัติ/ส่งกลับรอ Q-02; ระยะเก็บหนึ่งปีรอ Q-06

## เฟสสุดท้าย: รอคำตอบ

### T-14 กำหนดข้อมูลรายละเอียดที่อาจารย์เห็น
- รองรับ: FR-APR-02, DR-APR-02, CON-APR-01
- ตรวจด้วย: AC-APR-01
- ไฟล์ที่แตะ: `GET /api/advisor/reviews/{requestId}` route/service และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: `test_AC_APR_01_review_detail_contains_team_confirmed_fields` ผ่านตามรายการฟิลด์ที่ทีมยืนยัน โดยยังจำกัดเฉพาะนักศึกษาในความดูแล
- สถานะ: รอ Q-01

### T-15 แสดงรายละเอียดคำร้องตามข้อมูลที่ทีมยืนยัน
- รองรับ: FR-APR-02, DR-APR-02, IF-WEB-01, IF-TECH-01
- ตรวจด้วย: AC-APR-01
- ไฟล์ที่แตะ: `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewDetail.jsx`, `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewDetail.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ใช้ IN-APR-02/DR-APR-02
- ต้องทำหลัง: T-05, T-14
- เสร็จเมื่อ: `test_AC_APR_01_advisor_reviews_selected_student` ผ่านด้วย client จำลอง โดยแสดงเฉพาะรายละเอียดตาม Q-01 ที่ทีมยืนยันและเลือกได้ครั้งละคน
- สถานะ: รอ Q-01

### T-16 บันทึกผลอนุมัติและประวัติด้วยสถานะที่ทีมยืนยัน
- รองรับ: FR-APR-03, FR-APR-04, FR-APR-08, DR-APR-03, DR-APR-05, IF-TECH-01, IF-AUDIT-01, CON-APR-02
- ตรวจด้วย: AC-APR-01, AC-APR-08
- ไฟล์ที่แตะ: decision route/service, repository ประวัติ และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03, T-12, T-14, T-15
- เสร็จเมื่อ: `test_AC_APR_01_approve_and_record_history` ผ่าน โดยบันทึกผล สถานะหลังอนุมัติ และประวัติผู้ดำเนินการ/เวลา ตามชื่อสถานะที่ทีมยืนยัน
- สถานะ: รอ Q-02

### T-17 บันทึกเหตุผลและผลการส่งกลับ
- รองรับ: FR-APR-03, FR-APR-05, FR-APR-08, DR-APR-03, DR-APR-04, DR-APR-05, IF-AUDIT-01
- ตรวจด้วย: AC-APR-02, AC-APR-08
- ไฟล์ที่แตะ: decision route/service, repository ประวัติ และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-06, T-07, T-16
- เสร็จเมื่อ: `test_AC_APR_02_return_requires_text_reason` ผ่านทั้งกรณีเหตุผลว่างและกรณีมีเหตุผล โดยกรณีมีเหตุผลบันทึกเหตุผลและเปลี่ยนเป็นสถานะที่ทีมยืนยัน
- สถานะ: รอ Q-02

### T-18 แสดงสถานะล่าสุดแก่นักศึกษาผ่าน UC-03
- รองรับ: FR-APR-09, IF-WEB-01, IF-TECH-01
- ตรวจด้วย: AC-APR-06
- ไฟล์ที่แตะ: `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.jsx`, `frontend/src/features/uc03-view-own-result/OwnEligibilityResult.test.jsx`, `frontend/src/api/client.js`; API path ตามสัญญาที่ทีมยืนยัน
- แบบหน้าจอ: ไม่มี mockup ใน spec 009; หน้าจอ UC-03 ที่มีอยู่เป็นรูปแบบอ้างอิง
- ต้องทำหลัง: T-01, T-16
- เสร็จเมื่อ: `test_AC_APR_06_student_sees_approved_status` ผ่านด้วย client จำลองและสถานะที่นักศึกษาเห็นตรงกับสถานะหลังอนุมัติที่ทีมยืนยัน
- สถานะ: รอ Q-02

### T-19 เปิดทางให้อาจารย์ไปดำเนินการตาม UC-11
- รองรับ: FR-APR-10, OUT-APR-01
- ตรวจด้วย: AC-APR-07
- ไฟล์ที่แตะ: `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewDetail.jsx`, `frontend/src/features/uc09-advisor-approve-record/AdvisorReviewDetail.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ใช้ IN-APR-05 โดยไม่ทำรายละเอียด UC-11
- ต้องทำหลัง: T-16
- เสร็จเมื่อ: `test_AC_APR_07_approved_review_continues_to_uc11` ผ่าน โดยหลังอนุมัติแล้วอาจารย์ไปต่อขั้นตอน UC-11 ได้โดยไม่สร้างรายละเอียดการลงนามแทน UC-11
- สถานะ: รอ Q-02

### T-20 กำหนดการตอบเมื่อระบบบัญชีมหาวิทยาลัยไม่พร้อม
- รองรับ: IF-AUTH-01, FR-APR-07
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-21
- ไฟล์ที่แตะ: session/dependency error mapping และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: `test_IF_AUTH_01_account_dependency_uses_team_policy` ผ่านตาม status/message และแนวทางที่ทีมยืนยัน โดยไม่เปิดเผยหรือยอมรับ request ที่ไม่ได้ยืนยันตัวตน
- สถานะ: รอ Q-05

### T-21 กำหนดการตอบเมื่อฐานข้อมูลหรือประวัติไม่พร้อม
- รองรับ: FR-APR-07, FR-APR-08, IF-AUDIT-01, CON-APR-02, NFR-APR-04
- ตรวจด้วย: AC-APR-01, AC-APR-02, AC-APR-04, AC-APR-08
- ไฟล์ที่แตะ: decision transaction/error mapping, repository ประวัติ, ข้อความในหน้าจอ และ tests ที่เกี่ยวข้อง (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี mockup; ใช้ IN-APR-03
- ต้องทำหลัง: T-10, T-11, T-16, T-17
- เสร็จเมื่อ: `test_FR_APR_07_audit_failure_uses_team_policy` และ tests ของ AC ที่เกี่ยวข้องผ่านตามวิธีแจ้งข้อผิดพลาด/คงสถานะและประวัติที่ทีมยืนยัน
- สถานะ: รอ Q-05

### T-22 กำหนดระยะเก็บประวัติการตรวจสอบ
- รองรับ: NFR-APR-03, IF-AUDIT-01
- ตรวจด้วย: AC-APR-08 (ส่วนระยะเวลาเก็บประวัติ)
- ไฟล์ที่แตะ: retention policy/configuration และ test ฝั่ง backend (framework/path ทีมเลือกเอง)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: `test_NFR_APR_03_history_retention` ผ่านตามระยะเวลาที่ทีมยืนยัน โดยประวัติยังแก้ไขหรือลบย้อนหลังไม่ได้
- สถานะ: รอ Q-06

### T-23 ตรวจการใช้งานบนหน้าจอมือถือ
- รองรับ: NFR-APR-05, IF-WEB-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตรวจ NFR-APR-05; การตามรอยรอ Q-07
- ไฟล์ที่แตะ: `frontend/src/features/uc09-advisor-approve-record/` และวิธีตรวจในเบราว์เซอร์ที่ทีมมี
- แบบหน้าจอ: ไม่มี mockup ใน spec
- ต้องทำหลัง: T-05, T-07, T-09, T-11, T-15, T-18, T-19
- เสร็จเมื่อ: ตรวจทุกหน้าจอของ feature ที่ความกว้างตามที่ทีมยืนยันแล้วไม่พบการเลื่อนแนวนอน
- สถานะ: รอ Q-06, Q-07

### T-24 วัดเวลาตอบสนองการบันทึกผล
- รองรับ: NFR-APR-06, IF-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตรวจ NFR-APR-06; การตามรอยรอ Q-07
- ไฟล์ที่แตะ: test/performance script สำหรับ `POST /api/advisor/reviews/{requestId}/decision` (เครื่องมือทีมเลือกเอง; plan.md ไม่ระบุ)
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-16, T-17
- เสร็จเมื่อ: วัด p95 ของการบันทึกผลได้ตามเกณฑ์และวิธีวัดที่ทีมยืนยัน
- สถานะ: รอ Q-06, Q-07

### T-25 ปรับการตามรอย AC สำหรับข้อกำหนดที่ยังไม่มีเกณฑ์ตรวจโดยตรง
- รองรับ: FR-APR-01, FR-APR-02, FR-APR-09, IF-AUTH-01, NFR-APR-01, NFR-APR-04, NFR-APR-05, NFR-APR-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตัดสินใจตาม Q-07; ห้ามสร้าง AC ID ใหม่เอง
- ไฟล์ที่แตะ: `specs/009-advisor-approve-record/tasks.md` และ test ที่ทีมระบุหลังยืนยันวิธีตามรอย
- แบบหน้าจอ: ไม่มี mockup ใน spec
- ต้องทำหลัง: T-04, T-05, T-12, T-18, T-23, T-24
- เสร็จเมื่อ: ทีมยืนยันวิธีครอบคลุมรายการที่ยังขาด ได้แก่รายการที่ไม่ว่าง สถานะฝั่งอาจารย์ HTTP 401 timeout ข้อความภาษาไทย/ช่องที่ต้องแก้ mobile และ p95 โดยไม่สร้างหรือเปลี่ยน ID
- สถานะ: รอ Q-07

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-APR-01 | T-06 (เลือกหนึ่งคน/ผลตัดสินใจ), T-14 (ฟิลด์รายละเอียด), T-15 (ตรวจรายละเอียด), T-16 (บันทึกอนุมัติและประวัติ) |
| AC-APR-02 | T-06, T-07 (เหตุผลว่าง), T-17 (ส่งกลับเมื่อมีเหตุผล) |
| AC-APR-03 | T-08, T-09 |
| AC-APR-04 | T-10, T-11, T-21 |
| AC-APR-05 | T-12 |
| AC-APR-06 | T-18 |
| AC-APR-07 | T-19 |
| AC-APR-08 | T-03, T-13, T-16, T-17, T-21, T-22 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| IF-AUTH-01 | T-02, T-12, T-20 |
| IF-WEB-01 | T-01, T-05, T-07, T-09, T-11, T-15, T-18, T-19, T-23 |
| IF-TECH-01 | T-01, T-03, T-10, T-15, T-16, T-18, T-24 |
| IF-AUDIT-01 | T-03, T-13, T-16, T-17, T-21, T-22 |
| CON-APR-01 | T-04, T-05, T-12, T-14 |
| CON-APR-02 | T-10, T-11, T-21 |

### Functional Requirements

| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-APR-01 | AC-APR-03 (รายการว่าง); รายการไม่ว่างยังไม่มี AC ตรวจโดยตรง รอ Q-07 | เฟส 1, 3 |
| FR-APR-02 | AC-APR-01 | เฟส 1, รอคำตอบ |
| FR-APR-03 | AC-APR-01, AC-APR-02 | เฟส 1–2, รอคำตอบ |
| FR-APR-04 | AC-APR-01 | รอคำตอบ |
| FR-APR-05 | AC-APR-02 | เฟส 2, รอคำตอบ |
| FR-APR-06 | AC-APR-03 | เฟส 3 |
| FR-APR-07 | AC-APR-04 | เฟส 4, รอคำตอบ |
| FR-APR-08 | AC-APR-01, AC-APR-08 | เฟส 0, 6, รอคำตอบ |
| FR-APR-09 | AC-APR-06 | รอคำตอบ |
| FR-APR-10 | AC-APR-07 | รอคำตอบ |
| FR-APR-11 | AC-APR-05 | เฟส 5 |

## สิ่งที่ยังไม่ทำ

- **Q-01 (เดิม OQ-APR-01):** อาจารย์ต้องเห็นข้อมูลอะไรบ้างในหน้าตรวจสอบ (รายวิชาและเกรดทั้งหมด ผลการตรวจเบื้องต้นจาก UC-07 ข้อมูลสมาชิกกลุ่มจาก UC-08 หรือเอกสารแนบ); ต้องรอคำตอบจากทีมและอาจารย์ที่ปรึกษา — รอใน T-14, T-15
- **Q-02 (เดิม OQ-APR-03):** ชื่อสถานะหลังอนุมัติและหลังส่งกลับใช้คำว่าอะไร และต้องสอดคล้องกับรายการสถานะใน OQ-OWN-01 ของ specs/003 อย่างไร; ต้องรอคำตอบจากทีม ผู้รับผิดชอบ UC-03 และอาจารย์ผู้ตรวจสอบ — รอใน T-16 ถึง T-19
- **Q-03 (เดิม OQ-APR-04):** เมื่ออาจารย์ส่งกลับให้แก้ไข ต้องแจ้งเตือนนักศึกษาผ่าน UC-17 หรือไม่; ต้องรอคำตอบจากทีมและผู้รับผิดชอบ UC-17 — ไม่มี task เพิ่มการแจ้งเตือน เพราะ OUT-APR-06; หากคำตอบต้องการเพิ่มความสามารถ ต้องทบทวน scope/spec ก่อน
- **Q-04 (เดิม OQ-APR-05):** เมื่อนักศึกษาส่งผลเพิ่มเติมตาม UC-02 หลังอาจารย์อนุมัติแล้ว อาจารย์ต้องอนุมัติใหม่หรือไม่; ต้องรอคำตอบจากทีม ผู้รับผิดชอบ UC-02 และอาจารย์ที่ปรึกษา — ไม่มี task เพิ่ม flow นี้ เพราะไม่มี FR ใน scope; หากต้องการเพิ่มให้ทบทวน scope/spec ก่อน
- **Q-05 (IF-AUTH-01, IF-AUDIT-01, FR-APR-07, CON-APR-02, AC-APR-04):** เมื่อระบบบัญชีมหาวิทยาลัย ฐานข้อมูล หรือการบันทึกประวัติไม่พร้อมขณะอนุมัติหรือส่งกลับ ระบบต้องแจ้งและคงสถานะ/ประวัติอย่างไร; ต้องรอคำตอบจากทีมและผู้ดูแลระบบบัญชี/ฐานข้อมูล — รอใน T-20, T-21
- **Q-06 (ASM-APR-01, NFR-APR-03, NFR-APR-05, NFR-APR-06):** ทีมยืนยันค่าระยะเก็บประวัติ 1 ปี, หน้าจอ 360 px และ p95 2 วินาทีหรือไม่; หากไม่ยืนยัน ต้องใช้ค่าใด; ต้องรอคำตอบจากทีม — รอใน T-22, T-23, T-24
- **Q-07 (IF-AUTH-01, FR-APR-01, FR-APR-02, FR-APR-09, NFR-APR-01, NFR-APR-04, NFR-APR-05, NFR-APR-06):** AC ปัจจุบันยังไม่ตรวจข้อมูลรายการรอตรวจสอบที่ไม่ว่าง สถานะล่าสุดฝั่งอาจารย์ การตอบ HTTP 401, timeout, ข้อความภาษาไทย/ช่องที่ต้องแก้, การใช้งานบนมือถือ และ p95 โดยตรง; ทีมจะปรับ AC เดิมให้ครอบคลุมอย่างไรโดยไม่สร้าง ID ใหม่; ต้องรอคำตอบจากทีม — รอใน T-23 ถึง T-25
