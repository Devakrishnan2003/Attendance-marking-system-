// attendance.test.js

// Mock the pool object
jest.mock('../database', () => ({
 query: jest.fn(),
}));

const pool = require('../database');
const { markAttendanceManually, generateQr, deleteQr, scanQr } = require('../controllers/markattendance');

beforeEach(() => {
    // Reset the mock before each test
    pool.query.mockReset();
   });

describe('Attendance Functions', () => {
 test('manually marks attendance successfully', async () => {
    // Setup
    const req = {
      body: {
        tcc_code: 'TCC123',
        date: '2024-04-15',
        period: '1',
        attendanceData: [['student1', 'A'], ['student2', 'P']],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    pool.query.mockResolvedValue({ rowCount: 1 });

    await markAttendanceManually(req, res);

    // Assertions
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Attendance Marked Succesfully');
 });

 test('generates QR code successfully', async () => {
    // Setup
    const req = {
      body: {
        uniqueId: 'TCC123@2024-04-15@1',
        attendanceData: [['student1'], ['student2']],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the pool.query function to resolve with a success response
    pool.query.mockResolvedValue({ rowCount: 1 });

    // Call the function with the mocked request and response objects
    await generateQr(req, res);

    // Assertions
    expect(pool.query).toHaveBeenCalledTimes(3); 
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
 });

 test('deletes QR code successfully', async () => {
    // Setup
    const req = {
      body: {
        uniqueId: 'TCC123@2024-04-15@1',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the pool.query function to resolve with a success response
    pool.query.mockResolvedValue({ rowCount: 1 });

    // Call the function with the mocked request and response objects
    await deleteQr(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
 });

 test('scans QR code successfully', async () => {
    // Setup
    const req = {
      body: {
        tcc_code: 'TCC123',
        student_id: 'student1',
        qr_code: 'TCC123@2024-04-15@1',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the pool.query function to resolve with a success response
    pool.query.mockResolvedValue({ rowCount: 1 });

    // Call the function with the mocked request and response objects
    await scanQr(req, res);

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Succesfully Marked");
 });

 test('QR code timeout', async () => {
    // Setup
    const req = {
      body: {
        tcc_code: 'TCC123',
        student_id: 'student1',
        qr_code: 'TCC123@2024-04-15@1',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the pool.query function to resolve with a success response
    pool.query.mockResolvedValue({ rowCount: 0 });

    // Call the function with the mocked request and response objects
    await scanQr(req, res);

    // Assertions
    expect(pool.query).toHaveBeenCalledTimes(1); 
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("QR Code Timeout");
 });

});
