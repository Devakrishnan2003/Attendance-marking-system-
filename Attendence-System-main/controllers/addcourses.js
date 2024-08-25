const pool = require('../database');
const addCourse = async (req,res)=>{
    try {
        const {teacher_id,course_code,class_code}=req.body;
        const result = await pool.query("INSERT into \"Attendence_System\".tcc_table VALUES ($1,$2,$3)", [teacher_id,class_code,course_code]);
        return res.status(201).send("Successfully Added Course");
    } catch (error) {
        return res.status(403).send("Course Already Exist");
    }
}


module.exports = {addCourse}