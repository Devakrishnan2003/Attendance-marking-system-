// course.test.js

// Mocking the database pool
jest.mock('../database', () => ({
    query: jest.fn(),
   }));
   
   const pool = require('../database');
   const { studentGetCourses, teacherGetCourses, getStudentInfo, getAttendanceInfo } = require('../controllers/getcourses');
   
   
   // Mocking the request and response objects
   const mockRequest = (query) => ({
    query,
   });
   
   const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
   };
   
   describe('Course Functions', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });
   
    test('studentGetCourses - Success', async () => {
       pool.query.mockImplementation(() => Promise.resolve({ rows: [{ student_id: 'student123', tcc_code: 'CS101', course_code: 'CS101', course_name: 'Computer Science' }] }));
       const req = mockRequest({ id: 'student123' });
       const res = mockResponse();
   
       await studentGetCourses(req, res);
   
       expect(pool.query).toHaveBeenCalledWith('SELECT student_id,tcc_code,course_code,course_name FROM (\"Attendence_System\".student_details natural join \"Attendence_System\".tcc_table ) natural join \"Attendence_System\".course WHERE student_id = $1', ['student123']);
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({ list: [{ student_id: 'student123', tcc_code: 'CS101', course_code: 'CS101', course_name: 'Computer Science' }] });
    });
   
    test('teacherGetCourses - Success', async () => {
       pool.query.mockImplementation(() => Promise.resolve({ rows: [{ tcc_code: 'CS101', course_code: 'CS101', course_name: 'Computer Science' }] }));
       const req = mockRequest({ id: 'teacher123' });
       const res = mockResponse();
   
       await teacherGetCourses(req, res);
   
       expect(pool.query).toHaveBeenCalledWith('SELECT tcc_code,course_code,course_name FROM \"Attendence_System\".tcc_table natural join \"Attendence_System\".course WHERE teacher_id = $1', ['teacher123']);
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({ list: [{ tcc_code: 'CS101', course_code: 'CS101', course_name: 'Computer Science' }] });
    });
   
    test('getStudentInfo - No Students', async () => {
       pool.query.mockImplementationOnce(() => Promise.resolve({ rowCount: 0 }))
                 .mockImplementationOnce(() => Promise.resolve({ rows: [{ class: 'A', semester: '2' }] }));
       const req = mockRequest({ tcc_code: 'CS101' });
       const res = mockResponse();
   
       await getStudentInfo(req, res);
   
       expect(pool.query).toHaveBeenCalledWith('SELECT student_id,name,semester,class FROM \"Attendence_System\".student_details natural join \"Attendence_System\".class WHERE class_code = (SELECT class_code FROM \"Attendence_System\".tcc_table WHERE tcc_code = $1)', ['CS101']);
       expect(pool.query).toHaveBeenCalledWith('SELECT semester,class FROM \"Attendence_System\".class WHERE class_code = (SELECT class_code FROM \"Attendence_System\".tcc_table WHERE tcc_code = $1)', ['CS101']);
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({ studentList: { className: 'A', semester: '2', totalPeriod: 0, names: "No students are currently in the Course" } });
    });
   
    test('getStudentInfo - With Students', async () => {
       pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ student_id: 'student123', name: 'John Doe', semester: '2', class: 'A' }] }))
                 .mockImplementationOnce(() => Promise.resolve({ rows: [{ student_id: 'student123', attend: 'P' }] }))
                 .mockImplementationOnce(() => Promise.resolve({ rows: [{ count:1 ,student_id:'student123'}] }))

       const req = mockRequest({ tcc_code: 'CS101' });
       const res = mockResponse();
   
       await getStudentInfo(req, res);
   
       expect(pool.query).toHaveBeenCalledWith('SELECT student_id,name,semester,class FROM \"Attendence_System\".student_details natural join \"Attendence_System\".class WHERE class_code = (SELECT class_code FROM \"Attendence_System\".tcc_table WHERE tcc_code = $1)', ['CS101']);
   
   
       expect(pool.query).toHaveBeenCalledWith('SELECT student_id,attend FROM \"Attendence_System\".attendence WHERE tcc_code = $1', ['CS101']);
   
       expect(pool.query).toHaveBeenCalledWith('SELECT COUNT(*) FROM \"Attendence_System\".attendence WHERE tcc_code = $1 GROUP BY student_id' , ['CS101']); 
      
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({ studentList: { className: 'A', semester: '2', totalPeriod: 1, names: [[ 'student123', 'John Doe', 1 ]] } });
    });
   
    test('getAttendanceInfo - No Attendance', async () => {
       pool.query.mockImplementationOnce(() => Promise.resolve({ rowCount: 0 }))
                 .mockImplementationOnce(() => Promise.resolve({ rows: [{ name: 'John Doe' }] }));
       const req = mockRequest({ student_id: 'student123', tcc_code: 'CS101' });
       const res = mockResponse();
   
       await getAttendanceInfo(req, res);
   
       expect(pool.query).toHaveBeenCalledWith(`SELECT student_id, to_char(date, 'YYYY-MM-DD') AS formatted_date, period, attend FROM "Attendence_System".attendence WHERE tcc_code=$1 AND student_id=$2`, ['CS101', 'student123']);
       expect(pool.query).toHaveBeenCalledWith('SELECT name FROM \"Attendence_System\".teacher_details WHERE teacher_id=(SELECT teacher_id FROM \"Attendence_System\".tcc_table WHERE tcc_code=$1 )', ['CS101']);
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({ attendanceList: { teacherName: 'John Doe', totalPeriod: 0, periodAttended: 0, absenceDetails: "Attendance has Not Yet Taken" } });
    });
   
   
    test('getAttendanceInfo - With Attendance', async () => {
       pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ student_id: 'student123', to_char: '2023-04-15', period: '1', attend: 'P'} ],rowCount:1 }))
                 .mockImplementationOnce(() => Promise.resolve({ rows: [{ name: 'Jane Doe' }] }));

       const req = mockRequest({ student_id: 'student123', tcc_code: 'CS101' });
       const res = mockResponse();
   
       await getAttendanceInfo(req, res);
   
       expect(pool.query).toHaveBeenCalledWith(`SELECT student_id, to_char(date, 'YYYY-MM-DD') AS formatted_date, period, attend FROM "Attendence_System".attendence WHERE tcc_code=$1 AND student_id=$2`, ['CS101', 'student123']);
       expect(pool.query).toHaveBeenCalledWith('SELECT name FROM \"Attendence_System\".teacher_details WHERE teacher_id=(SELECT teacher_id FROM \"Attendence_System\".tcc_table WHERE tcc_code=$1 )', ['CS101']);
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({ attendanceList: { teacherName: 'Jane Doe', totalPeriod: 1, periodAttended: 1, absenceDetails: [] } });
    });
   });
   