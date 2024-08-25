const pool = require('../database');
const recaptcha = require('express-recaptcha').RecaptchaV2
const axios = require('axios')
const studentValidate = async (req,res)=>{
    const {id,pass,recaptchaResponse }=req.body;
    const secretKey = process.env.GOOGLE_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
    const result = await axios.post(verificationUrl);
    const data = result.data
    if(false){
      return res.status(401).send("Invalid Captcha")
    }else{
      try {
        const result = await pool.query("SELECT * FROM \"Attendence_System\".student_credentials WHERE student_id=$1 and password=$2", [id,pass]);
        if(result.rowCount===0){
            return res.status(401).send("Invalid Credentials");
        }
        req.session.isAuthStudent=true;
        req.session.studentId=id
        return res.status(200).send("Login Succesfull");
      } catch (err) {
        console.error(err);
      }
    }
    
}
const teacherValidate = async (req,res)=>{
  const {id,pass,recaptchaResponse }=req.body;
  const secretKey = process.env.GOOGLE_SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
  const result = await axios.post(verificationUrl);
  const data = result.data
  if(!data.success){
    return res.status(401).send("Invalid Captcha")
  }else{
      try {
        const result = await pool.query("SELECT * FROM \"Attendence_System\".teacher_credentials WHERE teacher_id=$1 and password=$2", [id,pass]);
        if(result.rowCount===0){
            return res.status(401).send("Invalid Credentials");
        }
        req.session.isAuthTeacher=true;
        req.session.teacherId=id;
        return res.status(200).send("Login Succesfull");
      } catch (err) {
        console.error(err);
      }
  }
}

module.exports = {studentValidate,teacherValidate}