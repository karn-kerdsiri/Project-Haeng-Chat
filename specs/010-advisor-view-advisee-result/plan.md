# Plan: ดูผลการตรวจสอบคุณสมบัติของนักศึกษาในที่ปรึกษา (Advisor Views Advisee Results)

## 1. สรุปแนวทาง
- ฟีเจอร์นี้ให้อาจารย์ที่ปรึกษาติดตามสถานะและผลการตรวจสอบคุณสมบัติของนักศึกษาที่อยู่ในความดูแลของตนเอง
- ผู้ใช้หลักคืออาจารย์ที่ปรึกษาที่เข้าสู่ระบบผ่านการยืนยันตัวตนของมหาวิทยาลัยตาม IF-AUTH-01
- ระบบทำงานในลักษณะอ่านข้อมูลอย่างเดียว (Read-only) โดยคัดกรองข้อมูลให้อาจารย์เห็นเฉพาะนักศึกษาในความดูแลตาม CON-AVR-01
- หน้ารายการแสดงสถานะล่าสุดของคำร้องและผลการตรวจสอบที่เผยแพร่แล้วตาม CON-AVR-02, DR-AVR-01 และ DR-AVR-02
- หน้ารายละเอียดแสดงข้อมูลผลการศึกษาและไฟล์ Transcript แบบอ่านอย่างเดียวตาม DR-AVR-03 โดยไม่มีปุ่มอนุมัติหรือส่งกลับ

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| React (Vite) | IF-TECH-01 | พัฒนาส่วนต่อประสานผู้ใช้ รองรับการแสดงผล Responsive บนจอมือถือ >= 360px ตาม NFR-AVR-04 |
| Python FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | จัดการ API ดึงข้อมูลนักศึกษาในที่ปรึกษา ตรวจสอบสิทธิ์ RBAC และจัดการข้อผิดพลาด |
| PostgreSQL | IF-TECH-01 | ฐานข้อมูลหลัก จัดเก็บข้อมูลคำร้อง การจัดกลุ่มอาจารย์ และผลการตรวจสอบคุณสมบัติ |
| Web Session Authentication | IF-AUTH-01, IF-WEB-01 | ตรวจสอบ session บัญชีผู้ใช้ของมหาวิทยาลัยก่อนอนุญาตให้เข้าถึง API |
| Audit Log Query | NFR-AVR-02 | บันทึกประวัติการเข้าถึงข้อมูลเพื่อความโปร่งใสและความเป็นส่วนตัว |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ FR/Constraint |
|---|---|---|
| AdvisorStudentMapping | id, advisor_id, student_id, academic_year, semester, created_at | FR-AVR-01, FR-AVR-02, FR-AVR-08, CON-AVR-01 |
| AcademicRecord | id, student_id, round_id, education_level, institution_name, major, academic_year, semester, gpa, total_credits, status, eligibility_result, is_published, updated_at | FR-AVR-03, FR-AVR-04, FR-AVR-06, CON-AVR-02, DR-AVR-01, DR-AVR-02, DR-AVR-03 |
| AcademicRecordFile | id, academic_record_id, file_type, storage_path, original_name, mime_type, file_size | FR-AVR-04, DR-AVR-03 |

หมายเหตุ: ไม่มีฟิลด์ที่เก็บข้อมูลนักศึกษานอกความดูแลของอาจารย์ และไม่มีฟิลด์ที่อนุญาตให้อาจารย์แก้ไขข้อมูลคำร้องในฟีเจอร์นี้

## 4. API / หน้าจอ

| รายการ | รายละเอียด | รองรับ FR |
|---|---|---|
| GET /api/v1/advisor/advisees | ดึงรายชื่อนักศึกษาในความดูแลของอาจารย์ผู้เรียก กรองตาม academic_year และ semester พร้อมสถานะล่าสุดและผลการตรวจสอบ | FR-AVR-01, FR-AVR-02, FR-AVR-03, FR-AVR-05, FR-AVR-06, CON-AVR-01, CON-AVR-02, DR-AVR-01, DR-AVR-02 |
| GET /api/v1/advisor/advisees/{student_id} | ดึงรายละเอียดผลการศึกษาและรายการไฟล์แนบของนักศึกษา 1 คน ตรวจสอบสิทธิ์ว่าอยู่ในความดูแลหรือไม่ ปฏิเสธด้วย 403 หากไม่ใช่ | FR-AVR-01, FR-AVR-04, FR-AVR-08, CON-AVR-01, DR-AVR-03 |
| หน้าจอ AdvisorAdviseeListPage | หน้ารายการนักศึกษาในที่ปรึกษา แสดงรหัสนักศึกษา ชื่อ สถานะคำร้อง ผลการตรวจสอบ (แสดง "รอตรวจสอบ" หากยังไม่เผยแพร่) และ Dropdown เลือกภาคการศึกษา | FR-AVR-02, FR-AVR-03, FR-AVR-05, FR-AVR-06, NFR-AVR-04, NFR-AVR-05 |
| หน้าจอ AdvisorAdviseeDetailPage | หน้ารายละเอียดผลการศึกษาและไฟล์แนบของนักศึกษารายบุคคลแบบอ่านอย่างเดียว | FR-AVR-04, DR-AVR-03, NFR-AVR-04 |

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| IF-AUTH-01 | ทุก API endpoint (`/advisor/advisees` และ `/advisor/advisees/{student_id}`) ตรวจสอบ session ผู้ใช้ หากไม่มีให้ส่งคืน HTTP 401 | ใช้แล้ว |
| IF-WEB-01 | หน้าจอพัฒนาด้วย React ทำงานบนเว็บเบราว์เซอร์มาตรฐานทั้งหมดโดยไม่ต้องติดตั้งโปรแกรมเสริม | ใช้แล้ว |
| IF-TECH-01 | หน้าจอเขียนด้วย React และ API เชื่อมโยงกับฐานข้อมูล PostgreSQL | ใช้แล้ว |
| CON-AVR-01 | query ดึงข้อมูลครอบคลุมเงื่อนไข `WHERE advisor_id = current_user.id` และ endpoint รายบุคคลตรวจสิทธิ์ส่งคืน HTTP 403 เมื่อไม่อยู่ในความดูแล | ใช้แล้ว |
| CON-AVR-02 | query ดึงสถานะจาก `AcademicRecord` จะดึงเฉพาะสถานะล่าสุด (`updated_at` ล่าสุด) ของคำร้องในภาคการศึกษานั้น | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-AVR-01 | test_AC_AVR_01_view_advisee_list_success | ใช้ session อาจารย์ A เปิดหน้ารายการ; verify ได้รับเฉพาะนักศึกษาที่ผูกกับอาจารย์ A และข้อมูลแสดงสถานะล่าสุดถูกต้อง |
| AC-AVR-02 | test_AC_AVR_02_empty_advisee_list | ใช้ session อาจารย์ B ที่ไม่มีนักศึกษาในความดูแล; verify API คืนรายการว่าง และ UI แสดงข้อความภาษาไทยว่า "ไม่มีข้อมูล" |
| AC-AVR-03 | test_AC_AVR_03_result_pending_display | จำลองคำร้องที่ผลการตรวจสอบยังไม่พร้อม/ยังไม่เผยแพร่; verify หน้าจอแสดงสถานะ "รอตรวจสอบ" ไม่แสดงช่องว่าง |
| AC-AVR-04 | test_AC_AVR_04_access_unassigned_student_forbidden | ใช้ session อาจารย์ A เรียก API ดึงรายละเอียดนักศึกษา X ที่อยู่ในความดูแลของอาจารย์ C; verify ได้รับ HTTP 403 และไม่มีข้อมูลถูกส่งกลับ |
| AC-AVR-05 | test_AC_AVR_05_advisee_detail_matches_uc09 | เปิดหน้ารายละเอียดของนักศึกษาในความดูแล 1 คน; verify ชุดข้อมูลตรงกับที่ปรากฏใน UC-09 และแสดงในโหมด Read-only |
| AC-AVR-06 | test_AC_AVR_06_database_error_handling | จำลองสถานการณ์ฐานข้อมูลขัดข้อง; verify ระบบแสดงข้อความแจ้งข้อผิดพลาดเป็นภาษาไทยพร้อมตัวเลือกให้ลองใหม่ |
| AC-AVR-07 | test_AC_AVR_07_session_timeout_disconnect | จำลองการหยุดใช้งานต่อเนื่องเกิน 30 นาที; verify ระบบตัดการเชื่อมต่อและบังคับยืนยันตัวตนใหม่ |

## 7. ลำดับงาน

1. สร้าง View / Query สำหรับดึงรายชื่อนักศึกษาในความดูแลของอาจารย์จากตาราง `AdvisorStudentMapping` เชื่อมกับ `AcademicRecord` (รองรับ FR-AVR-01, FR-AVR-02, CON-AVR-01, CON-AVR-02)
2. สร้าง API `GET /api/v1/advisor/advisees` พร้อม logic การกรองตามอาจารย์และภาคการศึกษา และจัดการสถานะรอตรวจสอบ (รองรับ FR-AVR-01, FR-AVR-02, FR-AVR-03, FR-AVR-06, DR-AVR-01, DR-AVR-02)
3. สร้าง API `GET /api/v1/advisor/advisees/{student_id}` พร้อม middleware ตรวจสอบความเป็นเจ้าของความดูแล (Authorization Guard) คืน HTTP 403 หากไม่มีสิทธิ์ (รองรับ FR-AVR-04, FR-AVR-08, CON-AVR-01, DR-AVR-03)
4. พัฒนาหน้าจอ `AdvisorAdviseeListPage` ด้วย React รองรับการแสดงผลตาราง/การ์ดบนหน้าจอขนาดกว้างตั้งแต่ 360px และข้อความว่างเมื่อไม่มีข้อมูล (รองรับ FR-AVR-03, FR-AVR-05, NFR-AVR-03, NFR-AVR-04)
5. พัฒนาหน้าจอ `AdvisorAdviseeDetailPage` แสดงข้อมูลผลการศึกษาและไฟล์แนบแบบอ่านอย่างเดียว (รองรับ FR-AVR-04, DR-AVR-03)
6. จัดการระบบ Session Timeout 30 นาที และข้อความแจ้งข้อผิดพลาดภาษาไทยเมื่อเชื่อมต่อล้มเหลว (รองรับ FR-AVR-07, NFR-AVR-01, NFR-AVR-03)
7. เขียน Unit Tests และ Integration Tests ตามตารางแผนทดสอบ AC-AVR-01 ถึง AC-AVR-07 ตรวจสอบ latency p95 <= 2 วินาที สำหรับ 50 รายการ (รองรับ NFR-AVR-05, AC-AVR-01 ถึง AC-AVR-07)

## 8. สิ่งที่ยังไม่ทำ
- Open Questions: ไม่มีใน spec ปัจจุบัน (ข้อมูลทั้งหมดได้รับการสรุปและบันทึกเป็น Assumptions ในหัวข้อ Assumptions & Open Questions เรียบร้อยแล้ว)
- ส่วนที่เกี่ยวข้องกับข้อนี้จะยังไม่สร้างจนกว่าจะได้คำตอบ: ไม่มี
