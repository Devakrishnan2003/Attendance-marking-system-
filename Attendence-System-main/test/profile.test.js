// profile.test.js

// Mocking the database pool
jest.mock('../database', () => ({
 query: jest.fn(),
}));

const pool = require('../database');
const { studentDashboard, teacherDashboard, courseDashboardTeacher, courseDashboardStudent } = require('../controllers/dashboard');


// Mocking the request and response objects
const mockRequest = (body) => ({
 body,
});

const mockResponse = () => {
 const res = {};
 res.status = jest.fn().mockReturnValue(res);
 res.render = jest.fn().mockReturnValue(res);
 return res;
};

describe('Dashboard Functions', () => {
 beforeEach(() => {
    jest.clearAllMocks();
 });

 test('studentDashboard - Success', async () => {
    pool.query.mockImplementation(() => Promise.resolve({ rows: [{ student_id: 'student123', name: 'John Doe', semester: '2', class: 'A' }] }));
    const req = mockRequest({ id: 'student123' });
    const res = mockResponse();

    await studentDashboard(req, res);

    expect(pool.query).toHaveBeenCalledWith('SELECT student_id,name,semester,class FROM \"Attendence_System\".student_details natural join \"Attendence_System\".class WHERE student_id = $1', ['student123']);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.render).toHaveBeenCalledWith('student_dashboard', { student: { student_id: 'student123', name: 'John Doe', semester: '2', class: 'A' } });
 });

 test('teacherDashboard - Success', async () => {
    pool.query.mockImplementation(() => Promise.resolve({ rows: [{ teacher_id: 'teacher123', name: 'Jane Doe' }] }));
    const req = mockRequest({ id: 'teacher123' });
    const res = mockResponse();

    await teacherDashboard(req, res);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM \"Attendence_System\".teacher_details WHERE teacher_id = $1', ['teacher123']);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.render).toHaveBeenCalledWith('teacher_dashboard', { teacher: { teacher_id: 'teacher123', name: 'Jane Doe' } });
 });

 test('courseDashboardTeacher - Success', async () => {
    const req = mockRequest({ teacher_id: 'teacher123', course_code: 'CS101' });
    const res = mockResponse();

    await courseDashboardTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.render).toHaveBeenCalledWith('coursedashboard_teacher', { teacher: { teacher_id: 'teacher123', course_code: 'CS101' } });
 });

 test('courseDashboardStudent - Success', async () => {
    const req = mockRequest({ student_id: 'student123', course_code: 'CS101' });
    const res = mockResponse();

    await courseDashboardStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.render).toHaveBeenCalledWith('coursedashboard_student', { student: { student_id: 'student123', course_code: 'CS101' } });
 });

});
