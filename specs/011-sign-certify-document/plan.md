# Plan: ลงนาม / รับรองเอกสาร (Sign and Certify Document)

## 1. สรุปแนวทาง
- ฟีเจอร์นี้ให้อาจารย์ที่ปรึกษาลงนามหรือรับรองเอกสารของคำร้องนักศึกษาที่ผ่านการอนุมัติจาก UC-09 แล้ว
- ผู้ใช้หลักคืออาจารย์ที่ปรึกษาที่มีสิทธิ์ในคำร้องนั้น ดำเนินการผ่านเว็บเบราว์เซอร์ตาม IF-AUTH-01 และ IF-WEB-01
- ระบบตรวจสอบเงื่อนไขก่อนลงนาม: คำร้องต้องผ่านการอนุมัติตาม CON-SGN-01 และมีไฟล์ Transcript ครบถ้วนตาม CON-FILE-01, DR-SGN-02 และ DR-EDU-07
- การลงนามใช้วิธี System Approval (Click-to-Sign) โดยบันทึกผู้ลงนาม เวลา และค่า SHA-256 Checksum ของเอกสารเพื่อประกันความคงสภาพตาม NFR-SGN-04 และ CON-SGN-02
- หลังลงนามสำเร็จ ระบบเปลี่ยนสถานะคำร้องเป็น "รับรองแล้ว" (DR-SGN-03) และบันทึกประวัติลง Audit Log ตาม IF-AUDIT-01

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| React (Vite) | IF-TECH-01 | พัฒนาหน้าจอพรีวิวเอกสารและปุ่มกดยืนยันการลงนาม รองรับหน้าจอมือถือ >= 360px ตาม NFR-SGN-06 |
| Python FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | พัฒนา API ตรวจสอบสถานะการอนุมัติ ตรวจสอบความถูกต้องของไฟล์ และบันทึกการรับรอง |
| PostgreSQL | IF-TECH-01 | จัดเก็บข้อมูลการลงนาม สถานะคำร้อง และประวัติ Audit Log |
| File Storage (Private Bucket) | CON-FILE-01 | จัดเก็บและเข้าถึงไฟล์แนบ (PDF, JPG, PNG ขนาดไม่เกิน 10 MB) ผ่าน secure signed URL |
| hashlib (SHA-256) | NFR-SGN-04, CON-SGN-02 | คำนวณค่า Checksum ของไฟล์เอกสารและ payload คำร้องเพื่อตรวจสอบความไม่เปลี่ยนแปลงหลังลงนาม |
| Web Session Authentication | IF-AUTH-01 | ตรวจสอบ session ผู้ใช้จากบัญชีมหาวิทยาลัย หากไม่มีให้ส่งคืน HTTP 401 |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ FR/Constraint |
|---|---|---|
| DocumentCertification | id, academic_record_id, certified_by, certified_at, document_checksum, status, created_at | FR-SGN-03, FR-SGN-04, FR-SGN-05, FR-SGN-11, CON-SGN-02, DR-SGN-01, DR-SGN-03 |
| AcademicRecord | id, student_id, status, is_approved, updated_at | FR-SGN-01, FR-SGN-05, FR-SGN-06, CON-SGN-01 |
| AcademicRecordFile | id, academic_record_id, file_type, file_size, mime_type, storage_path, file_checksum | FR-SGN-02, FR-SGN-07, CON-FILE-01, DR-SGN-02 |
| AuditLog | id, actor_user_id, student_id, action_type, action_at, record_id, details | FR-SGN-09, IF-AUDIT-01, NFR-SGN-03 |

หมายเหตุ: ตาราง `DocumentCertification` กำหนดสิทธิ์ห้าม UPDATE และห้าม DELETE ทุกกรณีเพื่อรองรับ `CON-SGN-02`

## 4. API / หน้าจอ

| รายการ | รายละเอียด | รองรับ FR |
|---|---|---|
| GET /api/v1/certifications/{record_id}/document | ตรวจสอบสิทธิ์ผู้ใช้และสถานะการอนุมัติ แล้วดึงข้อมูลเอกสารและไฟล์แนบมาแสดงพรีวิว | FR-SGN-01, FR-SGN-02, FR-SGN-06, FR-SGN-07, FR-SGN-10, CON-SGN-01, DR-SGN-02 |
| POST /api/v1/certifications/{record_id}/sign | บันทึกการลงนามรับรอง ตรวจสอบเอกสารครบถ้วน คำนวณ SHA-256 อัปเดตสถานะเป็น "รับรองแล้ว" และสร้าง Audit Log | FR-SGN-03, FR-SGN-04, FR-SGN-05, FR-SGN-08, FR-SGN-09, FR-SGN-10, DR-SGN-01, DR-SGN-03 |
| GET /api/v1/certifications/{record_id}/history | เจ้าหน้าที่และผู้มีสิทธิ์เรียกดูประวัติการลงนามและผู้ดำเนินการ | FR-SGN-09, IF-AUDIT-01 |
| หน้าจอ DocumentSigningPage | หน้าจอแสดงเอกสารคำร้องและไฟล์ Transcript พร้อมปุ่มกดยืนยันการรับรองเอกสารและข้อความเตือน | FR-SGN-02, FR-SGN-03, NFR-SGN-05, NFR-SGN-06 |

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| IF-AUTH-01 | ทุก API endpoint ตรวจสอบ session ผู้ใช้ หากไม่มีให้ส่งคืน HTTP 401 | ใช้แล้ว |
| IF-WEB-01 | หน้าจอพรีวิวและปุ่มลงนามพัฒนาด้วย React ทำงานบนเบราว์เซอร์มาตรฐานโดยไม่ต้องติดตั้งซอฟต์แวร์เพิ่ม | ใช้แล้ว |
| IF-TECH-01 | ระบบหน้าจอใช้ React และข้อมูลการลงนามจัดเก็บใน PostgreSQL | ใช้แล้ว |
| IF-AUDIT-01 | API บันทึกการลงนามจะสร้าง record ในตาราง `AuditLog` ระบุ `actor_user_id`, เวลา และรายละเอียด พร้อม endpoint ให้เจ้าหน้าที่เรียกดู | ใช้แล้ว |
| CON-FILE-01 | API และ UI ตรวจสอบชนิดไฟล์ (PDF, JPG, PNG) และขนาดไฟล์ไม่เกิน 10 MB หากเกินจะปฏิเสธการลงนาม | ใช้แล้ว |
| CON-SGN-01 | Endpoint ตรวจสอบ `AcademicRecord.status` และ `is_approved` หากยังไม่อนุมัติจะไม่อนุญาตให้ลงนามและแจ้งเหตุผล | ใช้แล้ว |
| CON-SGN-02 | ตาราง `DocumentCertification` ไม่มี API รองรับการแก้ไขหรือลบ (Immutable Data) และมี DB constraint ป้องกันการแก้/ลบ | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-SGN-01 | test_AC_SGN_01_sign_success_and_status_update | คำร้องได้รับการอนุมัติแล้วและมี Transcript ครบ; อาจารย์กดยืนยันลงนาม; verify บันทึกผู้ลงนาม เวลา และสถานะเปลี่ยนเป็น "รับรองแล้ว" |
| AC-SGN-02 | test_AC_SGN_02_sign_unapproved_rejected | คำร้องยังไม่ได้รับการอนุมัติ; พยายามเรียก API ลงนาม; verify ระบบปฏิเสธการลงนามพร้อมแจ้งเหตุผล |
| AC-SGN-03 | test_AC_SGN_03_sign_missing_document_rejected | คำร้องไม่มีไฟล์ Transcript; อาจารย์พยายามลงนาม; verify ระบบไม่อนุญาตและแจ้งข้อความให้ดำเนินการแก้ไขก่อน |
| AC-SGN-04 | test_AC_SGN_04_db_failure_keeps_original_status | จำลองสถานการณ์ฐานข้อมูลขัดข้องขณะบันทึกการลงนาม; verify ระบบแสดงข้อผิดพลาด และสถานะคำร้องคงเดิมไม่เปลี่ยนแปลง |
| AC-SGN-05 | test_AC_SGN_05_unauthorized_user_forbidden | ผู้ใช้ที่ไม่มีสิทธิ์ในคำร้อง (เช่น นักศึกษา หรืออาจารย์คนอื่น) เรียก API ลงนาม; verify ได้รับ HTTP 403 และไม่มีข้อมูลถูกบันทึก |
| AC-SGN-06 | test_AC_SGN_06_prevent_update_or_delete_signature | พยายามส่งคำสั่ง UPDATE หรือ DELETE ข้อมูลการลงนามที่มีอยู่; verify ระบบไม่อนุญาต และข้อมูลเดิมไม่เปลี่ยนแปลง |
| AC-SGN-07 | test_AC_SGN_07_invalid_file_type_or_size_rejected | เอกสารแนบไม่ใช่ PDF/JPG/PNG หรือมีขนาดเกิน 10 MB; verify ระบบไม่รับเอกสารและแจ้งเตือนเงื่อนไขไฟล์ |
| AC-SGN-08 | test_AC_SGN_08_audit_log_recorded | หลังลงนามสำเร็จ; เจ้าหน้าที่เรียกดูประวัติของคำร้องนั้น; verify มีประวัติ 1 รายการระบุผู้ลงนามและเวลาที่ถูกต้อง |

## 7. ลำดับงาน

1. สร้างตาราง `DocumentCertification` พร้อม Foreign Key ชี้ไปที่ `AcademicRecord` และตั้งค่า Trigger ห้าม UPDATE/DELETE ตาม CON-SGN-02 (รองรับ FR-SGN-04, FR-SGN-11, CON-SGN-02)
2. สร้าง Endpoint `GET /api/v1/certifications/{record_id}/document` สำหรับดึงไฟล์เอกสารและตรวจสอบสถานะการอนุมัติ (รองรับ FR-SGN-01, FR-SGN-02, CON-SGN-01, CON-FILE-01)
3. สร้าง Endpoint `POST /api/v1/certifications/{record_id}/sign` ตรวจสอบความครบถ้วนของ Transcript คำนวณ SHA-256 บันทึกการลงนาม และอัปเดตสถานะเป็น "รับรองแล้ว" ภายในธุรกรรมเดียว (รองรับ FR-SGN-03, FR-SGN-04, FR-SGN-05, FR-SGN-07, FR-SGN-08, DR-SGN-01, DR-SGN-03)
4. เพิ่มการบันทึกประวัติการลงนามลงใน `AuditLog` พร้อม endpoint ให้เจ้าหน้าที่ตรวจสอบย้อนหลัง (รองรับ FR-SGN-09, IF-AUDIT-01, NFR-SGN-03)
5. พัฒนาหน้าจอ `DocumentSigningPage` ด้วย React แสดงพรีวิวไฟล์ Transcript, ข้อมูลคำร้อง, และปุ่มกดยืนยันการลงนาม พร้อมข้อความผิดพลาดภาษาไทย (รองรับ FR-SGN-02, FR-SGN-03, NFR-SGN-05, NFR-SGN-06)
6. กำหนด Middleware ตรวจสอบสิทธิ์อาจารย์ที่ปรึกษา (Authorization Check) คืน HTTP 403 หากไม่มีสิทธิ์ (รองรับ FR-SGN-10, NFR-SGN-02)
7. เขียนและทดสอบ Automated Tests ตามแผนทดสอบ AC-SGN-01 ถึง AC-SGN-08 (รองรับ AC-SGN-01 ถึง AC-SGN-08)

## 8. สิ่งที่ยังไม่ทำ
- Open Questions: ไม่มีใน spec ปัจจุบัน (ข้อมูลทั้งหมดได้รับการสรุปและบันทึกเป็น Assumptions ในหัวข้อ Assumptions & Open Questions เรียบร้อยแล้ว)
- ส่วนที่เกี่ยวข้องกับข้อนี้จะยังไม่สร้างจนกว่าจะได้คำตอบ: ไม่มี
