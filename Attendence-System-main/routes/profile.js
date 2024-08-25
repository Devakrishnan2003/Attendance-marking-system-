const express= require('express');
const router = express.Router();
const{studentDashboard,teacherDashboard,courseDashboardTeacher,courseDashboardStudent}= require('../controllers/dashboard.js')
const {isAuthStudent,isAuthTeacher} = require('../session')


router.get('/student/:id',isAuthStudent,studentDashboard);
router.get('/student/:id/course',isAuthStudent,courseDashboardStudent)
router.get('/teacher/:id',isAuthTeacher,teacherDashboard);
router.get('/teacher/:id/course',isAuthTeacher,courseDashboardTeacher)

module.exports= router;
