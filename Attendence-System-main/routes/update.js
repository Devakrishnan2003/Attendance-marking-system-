const express= require('express');
const router = express.Router();
const{addCourse}= require('../controllers/addcourses.js')
const {isAuthTeacher} = require('../session')

router.post('/course',addCourse);

module.exports= router;