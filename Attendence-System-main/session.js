
const isAuthStudent = (req,res,next)=>{
    if(req.session.isAuthStudent && (req.session.studentId===req.params.id)){
        next()
    }else{
        res.redirect('/student_login.html')
    }
}

const isAuthTeacher = (req,res,next)=>{
    if(req.session.isAuthTeacher && (req.session.teacherId===req.params.id)){
        next()
    }else{
        res.redirect('/teacher_login.html')
    }
}

module.exports ={isAuthStudent,isAuthTeacher}