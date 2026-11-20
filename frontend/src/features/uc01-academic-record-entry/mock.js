// ข้อมูลจำลองของ UC-01 SPEC-EDU-001 เท่านั้น
// แยกไฟล์ต่อ 1 use case เพราะแต่ละฟีเจอร์พัฒนาและส่งมอบแยกกัน
// ห้ามให้ฟีเจอร์อื่น import ไฟล์นี้ ค่าที่ซ้ำกับฟีเจอร์อื่นจะมีคอมเมนต์กำกับว่ารอข้อกำหนดกลางข้อใด

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

// DR-EDU-11 ชุดค่าเกรดต้องเป็นชุดเดียวกับฟีเจอร์อื่น แต่ยังไม่ได้ประกาศเป็นข้อกำหนดกลาง (รอ OQ-EDU-02)
// จึงประกาศซ้ำไว้ที่ฟีเจอร์นี้ เมื่อทีมตอบแล้วให้ย้ายไปประกาศที่เดียว
// ข้อมูลจำลองสำหรับ mock UI เท่านั้น ไม่ใช่ข้อมูลจริงและไม่ได้เรียก API ใด
// ค่าคงที่ทุกตัวในไฟล์นี้คัดมาจาก spec.md โดยตรง ไม่ได้กำหนดขึ้นเอง

// DR-ADD-02 ชุดค่าเกรดที่รับได้ (ASM-ADD-05)
export const ALLOWED_GRADES = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W', 'I', 'T']

// FR-PRE-04 / DR-PRE-02: ตัวอย่างผลเบื้องต้นสำหรับแสดง UI เท่านั้น ไม่ใช่เงื่อนไขจริงหรือผลคำนวณ
export const PRECHECK_MOCK_FIXTURES = {
  passed: {
    sampleLabel: 'ชุดตัวอย่างกรณีผ่าน',
    summary: 'ตัวอย่างผลสรุป: รายการข้อมูลสมมติถูกแสดงในสถานะผ่าน',
    conditions: [
      {
        label: 'ข้อมูลตัวอย่างรายวิชา',
        status: 'ผ่าน (ตัวอย่าง)',
        comparedData: 'ปีการศึกษา 2568 / 517 121 — Computer Programming Skill I / เกรด A',
        reason: '',
      },
      {
        label: 'รายการข้อมูลตัวอย่างเพิ่มเติม',
        status: 'ผ่าน (ตัวอย่าง)',
        comparedData: 'ปีการศึกษา 2568 / 517 122 — Computer Programming Skill II / เกรด B',
        reason: '',
      },
    ],
  },
  failed: {
    sampleLabel: 'ชุดตัวอย่างกรณีไม่ผ่าน',
    summary: 'ตัวอย่างผลสรุป: รายการข้อมูลสมมติถูกแสดงในสถานะไม่ผ่าน',
    conditions: [
      {
        label: 'ข้อมูลตัวอย่างรายวิชา',
        status: 'ไม่ผ่าน (ตัวอย่าง)',
        comparedData: 'ปีการศึกษา 2568 / 517 122 — Computer Programming Skill II / เกรด D',
        reason: 'ข้อมูลในชุดนี้ถูกกำหนดเพื่อแสดงกรณีตัวอย่างที่ไม่ผ่านเท่านั้น ไม่ใช่การตัดสินเกรดจริง',
      },
      {
        label: 'รายการข้อมูลตัวอย่างเพิ่มเติม',
        status: 'ผ่าน (ตัวอย่าง)',
        comparedData: 'ปีการศึกษา 2568 / 517 121 — Computer Programming Skill I / เกรด B',
        reason: '',
      },
    ],
  },
}
