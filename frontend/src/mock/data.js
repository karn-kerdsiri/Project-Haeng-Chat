// ข้อมูลจำลองสำหรับ mock UI เท่านั้น ไม่ใช่ข้อมูลจริงและไม่ได้เรียก API ใด
// ค่าคงที่ทุกตัวในไฟล์นี้คัดมาจาก spec.md โดยตรง ไม่ได้กำหนดขึ้นเอง

// DR-ADD-02 ชุดค่าเกรดที่รับได้ (ASM-ADD-05)
export const ALLOWED_GRADES = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W', 'I', 'T']

// DR-EDU-05 ภาคเรียนรับค่า 1, 2 หรือ 3 เท่านั้น
export const SEMESTERS = ['1', '2', '3']

// DR-EDU-06 ชนิดและขนาดไฟล์แนบ
// รอ CF-03: DR-EDU-06 ระบุ 5 MB แต่ CON-FILE-01 ของ specs/004 และ specs/011 ระบุ 10 MB
// ยึด DR-EDU-06 ของ specs/001 ไปก่อนเพราะเป็นข้อกำหนดของฟีเจอร์นี้โดยตรง
export const FILE_RULES = {
  accept: ['.pdf', '.jpg', '.png'],
  maxSizeMB: 5,
  maxFiles: 5,
}

// DR-OWN-02 สถานะคำร้องมี 2 ค่าเท่านั้น
// รอ OQ-OWN-01: ถ้อยคำที่แสดงบนหน้าจอของแต่ละสถานะยังไม่ได้ยืนยัน
// จึงแสดงด้วยค่าสถานะตาม DR-OWN-02 ตรง ๆ ไปก่อน
export const REQUEST_STATUS = {
  PENDING: 'รอตรวจสอบ',
  DONE: 'เสร็จสิ้น',
}

// DR-OWN-04 ผลการตรวจสอบเป็นข้อมูลแยกจากสถานะ มี 2 ค่า
export const ELIGIBILITY_RESULT = {
  PASS: 'ผ่านเงื่อนไข',
  FAIL: 'ไม่ผ่าน',
}

// DOM-COURSE-01 รายวิชาต้องมาจากข้อมูลที่เจ้าหน้าที่จัดการไว้ (UC-12)
// ที่นี่เป็นข้อมูลจำลองแทนการอ่านจากฐานข้อมูลจริง
export const MOCK_COURSES = [
  { code: '517xxx1', name: 'โครงสร้างข้อมูล' },
  { code: '517xxx2', name: 'ระบบฐานข้อมูล' },
  { code: '517xxx3', name: 'วิศวกรรมซอฟต์แวร์' },
  { code: '517xxx4', name: 'เครือข่ายคอมพิวเตอร์' },
  { code: '517xxx5', name: 'ปัญญาประดิษฐ์เบื้องต้น' },
]

// ข้อมูลผลการเรียนเดิมของคำร้อง ใช้ใน UC-02 (FR-ADD-01)
export const MOCK_EXISTING_ENTRIES = [
  { id: 1, courseCode: '517xxx1', academicYear: '2568', semester: '1', grade: 'B+' },
  { id: 2, courseCode: '517xxx2', academicYear: '2568', semester: '1', grade: 'I' },
  { id: 3, courseCode: '517xxx3', academicYear: '2568', semester: '2', grade: 'A' },
]

// ข้อมูลคำร้องของนักศึกษาเจ้าของ session ใช้ใน UC-03 (DR-OWN-01, DR-OWN-06)
export const MOCK_OWN_REQUEST = {
  status: REQUEST_STATUS.DONE,
  published: true,       // ASM-OWN-06 ผลแสดงได้เมื่อเผยแพร่แล้ว
  result: ELIGIBILITY_RESULT.FAIL,
  // DR-OWN-05 เหตุผลระบุเงื่อนไขที่ไม่ผ่านพร้อมจำนวน
  failReasons: ['ยังมี I ค้างอยู่ 2 วิชา'],
  // DR-OWN-03 รายการที่ต้องดำเนินการเมื่อข้อมูลยังไม่ครบ (รอ OQ-OWN-08)
  todoItems: [],
}

// รายการเอกสารสำหรับ UC-04 (DR-DOC-01, DR-DOC-02)
// รอ Q-02: ชื่อหมวดหมู่เอกสารและแหล่งที่มาของรายการหมวดหมู่ยังไม่ได้ยืนยัน
// ชื่อหมวดหมู่ด้านล่างเป็นค่าตัวอย่างเพื่อให้เห็นการจัดกลุ่มเท่านั้น
export const MOCK_DOCUMENTS = [
  {
    id: 'doc-1',
    category: 'หมวดหมู่ตัวอย่าง ก (รอ Q-02)',
    name: 'แบบฟอร์มผลการศึกษา',
    description: 'ใช้กรอกผลการศึกษาก่อนส่งเข้าระบบ',
    available: true,
  },
  {
    id: 'doc-2',
    category: 'หมวดหมู่ตัวอย่าง ก (รอ Q-02)',
    name: 'แบบฟอร์มเลือกกลุ่มอาจารย์ที่ปรึกษา',
    description: 'ใช้ระบุกลุ่มอาจารย์ที่ต้องการ',
    available: true,
  },
  {
    id: 'doc-3',
    category: 'หมวดหมู่ตัวอย่าง ข (รอ Q-02)',
    name: 'ประกาศเกณฑ์การตรวจสอบคุณสมบัติ',
    description: 'เอกสารอธิบายเงื่อนไขที่ใช้พิจารณา',
    available: false,   // ใช้ทดสอบ FR-DOC-07 ไฟล์ไม่พร้อมให้ดาวน์โหลด
  },
]

// ---------------------------------------------------------------------------
// รายวิชาบังคับตามหลักสูตรในแบบฟอร์มจริง "แบบขอตรวจสอบคุณสมบัติในการมีสิทธิ์ขอจัดทำโครงงานปริญญานิพนธ์"
// ที่ทีมส่งให้ดูเมื่อ 2569-11-18
//
// specs/001 Draft v4 (2569-11-18) แก้ DR-EDU-01 และเพิ่ม DR-EDU-08 ถึง DR-EDU-11 ให้ตรงกับแบบฟอร์มนี้แล้ว
// ตาม ASM-EDU-15 หน้าจอนี้จึงตรงกับสเปกปัจจุบัน
//
// แหล่งรายวิชาที่ถูกต้องเมื่อทำจริงคือข้อมูลกลางของ UC-12 ตาม DR-MST-01 และ DR-MST-02
// ที่นี่ฝังไว้เป็นข้อมูลจำลองเท่านั้น
export const CURRICULUM_COURSES = [
  { code: '517 121', name: 'Computer Programming Skill I' },
  { code: '517 122', name: 'Computer Programming Skill II' },
  { code: '520 111', name: 'Discrete Computational Structures' },
  { code: '520 112', name: 'Web Technology' },
  { code: '520 213', name: 'Fundamental of Data Structures and Applications' },
  { code: '520 214', name: 'Digital Platform and Infrastructure' },
  { code: '520 221', name: 'Database Systems' },
  { code: '520 222', name: 'Object-Oriented Software Development and Application' },
  { code: '520 223', name: 'Introduction to Structure Query Language' },
  { code: '520 231', name: 'Data Analytics' },
  { code: '520 232', name: 'Storytelling and Data Visualization' },
  { code: '520 241', name: 'Principles of Computer Networks' },
  { code: '520 242', name: 'Information System Security' },
  { code: '520 251', name: 'Human Computer Interaction and User Experience Design' },
  { code: '520 311', name: 'Laws and Ethics in Information Technology' },
  { code: '520 321', name: 'Database System Administration' },
  { code: '520 322', name: 'Business Information Systems' },
  { code: '520 331', name: 'Artificial Intelligence for Information Technology' },
  { code: '520 341', name: 'Client Side Web Programming' },
  { code: '520 342', name: 'Server Side Web Programming' },
  { code: '520 343', name: 'Web Service and Microservice' },
  { code: '520 361', name: 'System Analysis and Design' },
  { code: '520 362', name: 'Software Engineering' },
  { code: '520 363', name: 'Enterprise Software Architecture' },
  { code: '520 364', name: 'Contemporary Software Project Management' },
]

// แบบฟอร์มจริงแยกวิชานี้ออกจากตารางหลัก
export const PREPARATION_COURSE = { code: '520 393', name: 'Research Project Preparation' }

// รอ OQ-EDU-01: ยังไม่ได้ยืนยันว่าเกรดใดนับว่า "สอบผ่าน" ตาม DR-EDU-10
// ที่นี่ใช้นิยามชั่วคราวว่า มีเกรดแล้วและไม่ใช่ F, W หรือ I
export const NOT_PASSED_GRADES = ['F', 'W', 'I']
