// update.test.js

// Correctly mock the database pool using jest.mock
jest.mock('../database', () => ({
    query: jest.fn(),
   }));
   
   const pool = require('../database');
   const { addCourse } = require('../controllers/addcourses');
   
   // Mocking the request and response objects
   const mockRequest = (body) => ({
    body,
   });
   
   const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
   };
   
   describe('Add Course Functions', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });
   
    test('addCourse - Success', async () => {
       // Now correctly mock pool.query to return a promise that resolves
       pool.query.mockImplementation(() => Promise.resolve());
       const req = mockRequest({ teacher_id: 'teacher123', course_code: 'CS101', class_code: 'A1' });
       const res = mockResponse();
   
       await addCourse(req, res);
   
       expect(pool.query).toHaveBeenCalledWith("INSERT into \"Attendence_System\".tcc_table VALUES ($1,$2,$3)", ['teacher123', 'A1', 'CS101']);
       expect(res.status).toHaveBeenCalledWith(201);
       expect(res.send).toHaveBeenCalledWith("Successfully Added Course");
    });
   
    test('addCourse - Course Already Exist', async () => {
       // Mock pool.query to return a promise that rejects
       pool.query.mockImplementation(() => Promise.reject(new Error('Course Already Exist')));
       const req = mockRequest({ teacher_id: 'teacher123', course_code: 'CS101', class_code: 'A1' });
       const res = mockResponse();
   
       await addCourse(req, res);
   
       expect(pool.query).toHaveBeenCalledWith("INSERT into \"Attendence_System\".tcc_table VALUES ($1,$2,$3)", ['teacher123', 'A1', 'CS101']);
       expect(res.status).toHaveBeenCalledWith(403);
       expect(res.send).toHaveBeenCalledWith("Course Already Exist");
    });
   
   });
   