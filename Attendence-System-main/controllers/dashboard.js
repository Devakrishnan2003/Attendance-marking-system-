const pool = require('../database');
const studentDashboard = async (req,res)=>{
    const {id}=req.params;
    try {
        const user = await pool.query('SELECT student_id,name,semester,class FROM \"Attendence_System\".student_details natural join \"Attendence_System\".class WHERE student_id = $1', [id]);
        res.render('student_dashboard',{student:user.rows[0]});
    } catch (error) {
        console.log(error);
    }
}
const teacherDashboard = async (req,res)=>{
    const {id}=req.params;
    try {
        const user = await pool.query('SELECT * FROM \"Attendence_System\".teacher_details WHERE teacher_id = $1', [id]);
        return res.status(201).render('teacher_dashboard',{teacher:user.rows[0]});
    } catch (error) {
        console.log(error);
    }
}

const courseDashboardTeacher = async (req,res)=>{
   try {
    const {tcc_code} = req.query
    const course = await pool.query('SELECT course_code,course_name FROM \"Attendence_System\".course WHERE course_code = (SELECT course_code FROM \"Attendence_System\".tcc_table WHERE tcc_code = $1)', [tcc_code]);
    return res.status(201).render('coursedashboard_teacher',{teacher:course.rows[0],data:{tcc_code}});
   } catch (error) {
    console.log(error)
   }
}
const courseDashboardStudent = async (req,res)=>{
    try{
    const {id} = req.params 
    const {tcc_code} = req.query
    const course = await pool.query('SELECT course_code,course_name FROM \"Attendence_System\".course WHERE course_code = (SELECT course_code FROM \"Attendence_System\".tcc_table WHERE tcc_code = $1)', [tcc_code]);
    return res.status(201).render('coursedashboard_student',{student:course.rows[0],data:{tcc_code,id}});
   } catch (error) {
    console.log(error)
}
}

module.exports = {studentDashboard,teacherDashboard,courseDashboardTeacher,courseDashboardStudent}