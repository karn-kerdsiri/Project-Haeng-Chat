# RTM: กรอกข้อมูลสมาชิกกลุ่ม / คู่
อ้างอิง: spec.md Draft v2 | plan.md | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-11-21 15:26 UTC | test: backend 46 ผ่าน 0 ไม่ผ่าน; frontend 46 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)

| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-GRP-01 | AC-GRP-01 (แสดงช่องกรอกยังไม่ถูกตรวจ) | T-05 (พร้อมทำ), T-24 (รอ Q-07) | ไม่พบหน้าจอหรือ component ของ UC-08; ไม่มี GroupMembers.jsx | ไม่มี test ตรวจช่องกรอกเมื่อเลือกกลุ่ม/คู่ | ช่องโหว่ (F001) |
| FR-GRP-02 | AC-GRP-01/02/06 (ไม่ตรวจ input/search method ครบ) | T-03, T-04 (พร้อมทำ) | `frontend/src/api/client.js: getJson` เป็น client กลาง; ไม่มี lookup route หรือหน้าจอ UC-08 | `test_API_client_calls_member_endpoints` ผ่าน โดยทดสอบ GET และ response จำลองเท่านั้น | ช่องโหว่ (F001, F003) |
| FR-GRP-03 | AC-GRP-01/02 | T-03, T-06 (พร้อมทำ) | ไม่พบ service ตรวจการมีอยู่ของนักศึกษา | ไม่มี test ของ UC-08; test client ใช้ผลจำลอง | ยังไม่ถึง |
| FR-GRP-04 | AC-GRP-02 | T-06, T-07 (พร้อมทำ) | ไม่พบ logic แจ้งรหัสที่ค้นหาไม่พบหรือป้องกันการบันทึก | ไม่มี test ของ UC-08; `TC-GRP-06-3` ยังเป็นร่าง | ยังไม่ถึง |
| FR-GRP-05 | AC-GRP-03 | T-08 (พร้อมทำ), T-15 (รอ Q-01/Q-02) | ไม่พบ service ตรวจสมาชิกในกลุ่มอื่นของภาคการศึกษาเดียวกัน | ไม่มี test ของ UC-08 | ยังไม่ถึง |
| FR-GRP-06 | AC-GRP-04 | T-09, T-10 (พร้อมทำ) | ไม่พบ validator ป้องกันรหัสสมาชิกซ้ำ | ไม่มี test ของ UC-08 | ยังไม่ถึง |
| FR-GRP-07 | AC-GRP-01 (การแสดงก่อนยืนยันไม่ถูกตรวจ) | T-05 (พร้อมทำ), T-17 (รอ Q-01/Q-02) | ไม่พบหน้าจอแสดงสมาชิกให้ตรวจสอบก่อนบันทึก | ไม่มี test ของ UC-08 | ช่องโหว่ (F001) |
| FR-GRP-08 | AC-GRP-01 | T-16, T-17 (รอ Q-01/Q-02) | ไม่พบ model, repository หรือ endpoint บันทึกความสัมพันธ์ | `test_API_client_calls_member_endpoints` ผ่านเฉพาะการส่ง POST ไปยัง mock endpoint | รอ Q-01/Q-02 |
| FR-GRP-09 | AC-GRP-05 | T-11 (พร้อมทำ), T-18 (รอ Q-02), T-19/T-21 (รอ Q-05) | ไม่พบ transaction บันทึกสมาชิกหรือ error/retry flow ของ UC-08 | ไม่มี test ของ UC-08 | รอ Q-02/Q-05 |
| FR-GRP-10 | AC-GRP-06 | T-03, T-04 (พร้อมทำ) | ไม่มี lookup response ของ UC-08; `getJson` ส่งต่อ response ของผู้ให้บริการโดยไม่กรอง field | `test_API_client_calls_member_endpoints` ผ่านกับ response จำลองที่มีแต่ field อนุญาต; ไม่ได้ทดสอบการกรองฝั่งระบบ | ยังไม่ถึง |
| NFR-GRP-01 | ไม่มี AC โดยตรง (Q-07) | T-02 (พร้อมทำ), T-24 (รอ Q-07) | ไม่พบ session timeout ของ UC-08; auth code ที่มีเป็น staff verification คนละ feature | ไม่มี test timeout ของ UC-08 | ยังไม่ถึง |
| NFR-GRP-02 | AC-GRP-07 | T-12 (พร้อมทำ), T-22 (รอ Q-03) | ไม่พบ route/guard สำหรับสิทธิ์แก้สมาชิกของ UC-08 | ไม่มี test ตรวจ HTTP 403 และข้อมูลไม่เปลี่ยนของ UC-08 | ยังไม่ถึง |
| NFR-GRP-03 | AC-GRP-06; การค้นหาไม่พบอยู่ใน AC-GRP-02 แต่ไม่ assert เรื่องข้อมูลส่วนบุคคล | T-03, T-04, T-06 (พร้อมทำ) | ไม่พบ lookup service ที่จำกัด field หรือจัดการข้อมูลส่วนบุคคลเมื่อไม่พบ | ไม่มี test ของ UC-08; `TC-GRP-06-3` ร่างไว้แต่ยังไม่ใช่ automated test | ยังไม่ถึง |
| NFR-GRP-04 | AC-GRP-05 | T-18 (รอ Q-02), T-21 (รอ Q-05) | ไม่พบ transaction ของ UC-08 | ไม่มี test atomicity ของ UC-08 | รอ Q-02/Q-05 |
| NFR-GRP-05 | ไม่มี AC โดยตรง (Q-07) | T-07, T-10, T-11 (พร้อมทำ), T-20/T-21 (รอ Q-05), T-24 (รอ Q-07) | ไม่พบข้อความผิดพลาดจากหน้าจอ UC-08 | ไม่มี test ตรวจภาษาไทยและช่องที่ต้องแก้ของ UC-08 | ยังไม่ถึง |
| NFR-GRP-06 | ไม่มี AC โดยตรง (Q-06/Q-07) | T-23 (รอ Q-06) | ไม่พบหน้าจอ UC-08 ที่ตรวจการแสดงผลบนมือถือ | ไม่มี mobile test ของ UC-08 | รอ Q-06/Q-07 |
| IF-AUTH-01 | AC-GRP-07 ตาม Traceability (ไม่ตรวจ session ที่ไม่ยืนยันและ HTTP 401) | T-02 (พร้อมทำ), T-19 (รอ Q-05) | ไม่พบ API/guard ของ UC-08; guard ที่พบใช้กับเจ้าหน้าที่ staff verification | ไม่มี test IF-AUTH-01 สำหรับ UC-08 | ช่องโหว่ (F002) |
| IF-WEB-01 | AC-GRP-07 ตาม Traceability (ไม่ตรวจการทำงานบน browser) | T-01 (เสร็จ), T-04 (พร้อมทำ) | พบ React shell ทั่วไป แต่ไม่มีหน้าจอ UC-08 หรือ component ที่เชื่อมกับ shell | `IF_WEB_01_application_shell_renders_all_four_screens` ผ่าน; ตรวจ UC-01–04 ไม่ใช่ UC-08 | ช่องโหว่ (F002) |
| IF-TECH-01 | AC-GRP-07 ตาม Traceability (ไม่ตรวจ React/PostgreSQL) | T-01 (เสร็จ), T-16/T-18 (รอ Q-01/Q-02) | มี React ของ use case อื่น; ไม่พบ PostgreSQL/model ของ UC-08 | ไม่มี test storage หรือ UI ของ UC-08 | ช่องโหว่ (F002) |
| CON-GRP-01 | AC-GRP-01, AC-GRP-03 | T-13, T-15, T-16 (รอ Q-01/Q-02) | ไม่พบ logic ตรวจหนึ่งกลุ่มต่อคนต่อภาคการศึกษา | ไม่มี test ของ UC-08 | รอ Q-01/Q-02 |
| CON-GRP-02 | AC-GRP-04 | T-09 (พร้อมทำ), T-16 (รอ Q-01/Q-02) | ไม่พบการป้องกันความสัมพันธ์ซ้ำใน UC-08 | ไม่มี test ของ UC-08 | ยังไม่ถึง |
| CON-GRP-03 | AC-GRP-01/02 | T-03, T-06 (พร้อมทำ) | ไม่พบ service ตรวจนักศึกษาจากข้อมูลในระบบ | ไม่มี test ของ UC-08 | ยังไม่ถึง |
| DR-GRP-01 | AC-GRP-01/02/06 (ข้อจำกัด input ยังไม่ตรวจ) | T-03, T-04 (พร้อมทำ) | ไม่มี UC-08 input/lookup; client mock ใช้ `studentId` แต่ไม่ได้บังคับรูปแบบข้อมูลจากหน้าจอ | `test_API_client_calls_member_endpoints` ผ่านเฉพาะ API transport | ยังไม่ถึง |
| DR-GRP-02 | AC-GRP-01 (ไม่ assert ว่าข้อมูลสมาชิกเป็นฟิลด์บังคับ) | T-05 (พร้อมทำ) | ไม่พบหน้าจอ UC-08 | ไม่มี test ตรวจฟิลด์บังคับ | ยังไม่ถึง |
| DR-GRP-03 | AC-GRP-04 | T-09, T-10 (พร้อมทำ) | ไม่พบ logic เปรียบเทียบรหัสสมาชิกซ้ำ | ไม่มี test ของ UC-08 | ยังไม่ถึง |
| DR-GRP-04 | ไม่มี AC; จำนวนสมาชิกยังรอ Q-01 | T-13 (รอ Q-01) | ไม่มีการกำหนดจำนวนสมาชิกใน code | ไม่มี test; ยังไม่มีเกณฑ์จากทีม | รอ Q-01 |

สรุปแถว: ครบ 0, ยังไม่ถึง 14, รอ Q 6, ช่องโหว่ 6. T-01 เป็น task เดียวที่เสร็จ แต่เป็น client พื้นฐาน ไม่ใช่ task ที่ตรวจ AC; T-03/T-04 ซึ่งรองรับ AC-GRP-06 ยังพร้อมทำ. Test cases ของ AC-GRP-06 มี 3 แถวสถานะ “ร่าง” และยังไม่มีแถว “ใช้ได้”; จึงยังไม่เข้าเกณฑ์ตรวจความอ่อนของ AC test ตามขั้นที่ 3.

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)

| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/api/client.js: requestJson`, `getJson`, `postJson` | IF-WEB-01, FR-GRP-02, FR-PRE-05 | บางส่วน | เป็น client ทั่วไปที่รับ path จากผู้เรียกและส่งต่อผลจาก `fetch`; ไม่มี lookup/link endpoint จริงหรือการกรอง response |
| `frontend/src/api/client.test.js: test_API_client_calls_member_endpoints` | T-01 / API proposals ใน plan.md | ตรงเฉพาะ client | mock GET/POST path, method, body และ response ที่มี field อนุญาต; ไม่ตรวจ backend, authorization, privacy filtering หรือการแสดงผล UI |
| `backend/app` | ไม่มี FR-GRP | ไม่พบ implementation ของ UC-08 | มี modules ของการส่งผลเพิ่มเติมและ staff verification เท่านั้น; ไม่พบ route/service/model สำหรับค้นหาและเชื่อมสมาชิก |
| `frontend/src/App.jsx: PAGES`, `frontend/src/features/uc01–uc04` | IF-WEB-01 เฉพาะ shell; ไม่ใช่ FR-GRP | ไม่ใช่ implementation ของ UC-08 | shell มีหน้า UC-01–04; ไม่พบหน้า UC-08, `GroupMembers.jsx` หรือ call site เชื่อมเข้ากับ UC-01. งาน UI ที่ยังไม่เสร็จไม่ถือเป็นโค้ดเกินขอบเขต |
| tests/fixture ของ UC-01–04 และ backend modules อื่น | IDs ของ feature อื่น | ไม่ใช่ขอบเขต SPEC-GRP-008 | เป็น prototypes แยกกัน; ไม่พบการเชื่อมให้ทำงานแทน UC-08. ตัวอย่าง `studentId`/ชื่อ/สาขาใน client test เป็น mock และไม่มีข้อมูลติดต่อ |

ไม่พบ mockup HTML หรือส่วน UI ที่ระบุว่าต้องตรงกับ mockup. ไม่พบ code ของ UC-08 ที่กำหนดจำนวนสมาชิก, policy ยืนยันสมาชิก, retry policy หรือเงื่อนไขกลุ่มจาก Q-01 ถึง Q-05. ไม่พบ shared constraints ใน `specs/000-shared/`.

## 3. ข้อค้นพบ

ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F001 | FR ไม่มี AC | `spec.md` AC-GRP-01 / Traceability และ Q-07 | FR-GRP-01, FR-GRP-02, FR-GRP-07 | AC-GRP-01 ตรวจการบันทึก/เชื่อมสมาชิก แต่ไม่ assert ว่าเมื่อเลือกกลุ่ม/คู่แสดงช่องกรอก (FR-GRP-01), ใช้รหัสนักศึกษาเป็นช่องค้นหาโดยไม่ให้กรอกข้อมูลส่วนตัวเอง (FR-GRP-02), หรือแสดงข้อมูลสมาชิกให้ตรวจสอบก่อนยืนยัน (FR-GRP-07). AC-GRP-06 ตรวจเฉพาะ field ที่แสดงผลค้นหา. Q-07 ระบุช่องว่างนี้ไว้แล้ว แต่ยังรอคำตอบ; ตามกติกา FR ที่ไม่มี AC ตรวจพฤติกรรมตรง ๆ ยังคงเป็นข้อค้นพบ | |
| F002 | อ้าง ID ผิดเรื่อง | `spec.md` > Traceability, แถว “ข้อ 12, 13, 19 (CONSTRAINT)” | IF-AUTH-01, IF-WEB-01, IF-TECH-01 / AC-GRP-07 | AC-GRP-07 ตรวจว่า valid student ที่ไม่ใช่สมาชิกกลุ่มได้ HTTP 403 และข้อมูลไม่เปลี่ยน; ไม่ได้ตรวจ session ที่ไม่ยืนยันและ HTTP 401 (IF-AUTH-01), การใช้หน้าจอบน browser (IF-WEB-01), หรือการใช้ React/PostgreSQL (IF-TECH-01). การ map ทั้งสาม Constraint กับ AC-GRP-07 จึงไม่ตรงเรื่อง | |
| F003 | อ้าง ID ผิดเรื่อง | `frontend/src/api/client.js: postJson` comment | FR-GRP-02 | comment ของ `postJson` อ้าง FR-GRP-02 สำหรับการส่ง POST ไป Member endpoint; FR-GRP-02 กำหนดการค้นหาด้วยรหัสนักศึกษา ขณะที่ POST `/api/requests/{requestId}/members` ใน plan เป็นการบันทึกความสัมพันธ์ (FR-GRP-08). เป็นการอ้าง ID ใน comment ที่ไม่ตรงกับหน้าที่ของ endpoint; ไม่พบผลกระทบ runtime จาก helper ทั่วไป | |

## 4. แก้แล้ว

| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|

