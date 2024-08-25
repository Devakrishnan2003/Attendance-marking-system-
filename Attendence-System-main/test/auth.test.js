// auth.test.js

// Mocking the database pool
jest.mock('../database', () => ({
    query: jest.fn(),
   }));
   
   const pool = require('../database');
   const { studentValidate, teacherValidate } = require('../controllers/validate');
   
   // Helper function to mock request and response objects
   const mockRequest = (query) => ({
    query,
   });
   
   const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
   };
   
   describe('Authentication Functions', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });
   
    test('studentValidate - Success', async () => {
       pool.query.mockImplementation(() => Promise.resolve({ rowCount: 1 }));
       const req = mockRequest({ id: 'student123', pass: 'password123' });
       const res = mockResponse();
   
       await studentValidate(req, res);
   
       expect(pool.query).toHaveBeenCalledWith("SELECT * FROM \"Attendence_System\".student_credentials WHERE student_id=$1 and password=$2", ['student123', 'password123']);
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.send).toHaveBeenCalledWith("Login Succesfull");
    });
   
    test('studentValidate - Invalid Credentials', async () => {
       pool.query.mockImplementation(() => Promise.resolve({ rowCount: 0 }));
       const req = mockRequest({ id: 'student123', pass: 'wrongpassword' });
       const res = mockResponse();
   
       await studentValidate(req, res);
   
       expect(pool.query).toHaveBeenCalledWith("SELECT * FROM \"Attendence_System\".student_credentials WHERE student_id=$1 and password=$2", ['student123', 'wrongpassword']);
       expect(res.status).toHaveBeenCalledWith(401);
       expect(res.send).toHaveBeenCalledWith("Invalid Credentials");
    });
   
    test('teacherValidate - Success', async () => {
       pool.query.mockImplementation(() => Promise.resolve({ rowCount: 1 }));
       const req = mockRequest({ id: 'teacher123', pass: 'password123' });
       const res = mockResponse();
   
       await teacherValidate(req, res);
   
       expect(pool.query).toHaveBeenCalledWith("SELECT * FROM \"Attendence_System\".teacher_credentials WHERE teacher_id=$1 and password=$2", ['teacher123', 'password123']);
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.send).toHaveBeenCalledWith("Login Succesfull");
    });
   
    test('teacherValidate - Invalid Credentials', async () => {
       pool.query.mockImplementation(() => Promise.resolve({ rowCount: 0 }));
       const req = mockRequest({ id: 'teacher123', pass: 'wrongpassword' });
       const res = mockResponse();
   
       await teacherValidate(req, res);
   
       expect(pool.query).toHaveBeenCalledWith("SELECT * FROM \"Attendence_System\".teacher_credentials WHERE teacher_id=$1 and password=$2", ['teacher123', 'wrongpassword']);
       expect(res.status).toHaveBeenCalledWith(401);
       expect(res.send).toHaveBeenCalledWith("Invalid Credentials");
    });
   
   });
   