const express = require("express");
const path = require('path');
require('dotenv').config()
const app = express();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pgPool = require('./database');

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

const validate = require('./routes/auth');
const details = require('./routes/profile');
const courses = require('./routes/courses');
const update = require('./routes/update')
const markAttendance = require('./routes/attendance')

app.use(express.static(path.join(__dirname, 'static')));



app.use(express.json());

app.use(
    session({
        store: new pgSession({
            pool : pgPool,
            schemaName: "Attendence_System",            
            tableName :"session"
        }),
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false
    })
)

app.get('/student_login.html',(req,res)=>{
    if(req.session.isAuthStudent){
        req.session.isAuthStudent=false
        req.session.studentId=null
    }
    res.render('student_login')
})

app.get('/teacher_login.html',(req,res)=>{
    if(req.session.isAuthTeacher){
        req.session.isAuthTeacher=false
    }
    res.render('teacher_login')
})

app.get('/',(req,res)=>{
    res.render('index')
})

app.use('/api/validate',validate);
app.use('/profile',details);
app.use('/courses',courses);
app.use('/update',update);
app.use('/attendance',markAttendance);

const port = process.env.PORT || 3000;

app.listen(port,'0.0.0.0',function () {
    console.log(`Server is running on localhost ${port}...`);

})