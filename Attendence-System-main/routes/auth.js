const express= require('express');
const router = express.Router();
const{studentValidate,teacherValidate}= require('../controllers/validate.js')

router.post('/student',studentValidate);
router.post('/teacher',teacherValidate);

module.exports= router;
