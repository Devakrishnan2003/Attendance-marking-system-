const express= require('express');
const router = express.Router();
const{studentGetCourses,teacherGetCourses,getStudentInfo,getAttendanceInfo}= require('../controllers/getcourses');
const {isAuthStudent,isAuthTeacher} = require('../session')

router.get('/student',studentGetCourses);
router.get('/teacher',teacherGetCourses);
router.get('/studentlist',getStudentInfo);
router.get('/attendanceInfo',getAttendanceInfo);

module.exports= router;
