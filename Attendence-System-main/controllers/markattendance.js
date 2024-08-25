const pool = require('../database');

const markAttendanceManually = async (req,res)=>{
    try {
        const {tcc_code,date,period,attendanceData}=req.body;
        
        attendanceData.forEach(async data=>{
            try {
                if(data[1]==='A'){
                    const result = await pool.query("INSERT into \"Attendence_System\".attendence VALUES ($1,$2,$3,$4,$5) ON CONFLICT (tcc_code,student_id,date,period,attend) DO NOTHING",[tcc_code,data[0],date,period,data[1]]);
                }
                else{
                    const result = await pool.query("INSERT into \"Attendence_System\".attendence VALUES ($1,$2,$3,$4,$5) ON CONFLICT (tcc_code,student_id,date,period) DO UPDATE SET attend=excluded.attend",[tcc_code,data[0],date,period,data[1]]);
                }
               } catch (error) {
                console.log(error.constraint);
               } 
        }) 
        
       res.status(200).send('Attendance Marked Succesfully');
    }catch(error){
        console.error(error)
    }
   
}

const generateQr = async (req,res)=>{
    try {
        
        const {uniqueId,attendanceData}=req.body;
        tableValues = uniqueId.split('@');

        await Promise.all(attendanceData.map(async (student) => {
            try {
                const result = await pool.query("INSERT into \"Attendence_System\".attendence VALUES ($1,$2,$3,$4,$5) ON CONFLICT (tcc_code,student_id,date,period) DO NOTHING", [tableValues[0], student, tableValues[1], tableValues[2],'A']);
            } catch (error) {
                console.log(error);
            }
        }));
        const result1 = await pool.query("INSERT into \"Attendence_System\".qr_table(qr_id) VALUES ($1)",[uniqueId]);
        
        return res.status(200).send("Generated Sucessfully");
    }catch(error){
        console.error(error)
    }
   
}

const deleteQr = async (req,res)=>{
    try {
        const {uniqueId}=req.body;
        const result = await pool.query("DELETE FROM \"Attendence_System\".qr_table WHERE qr_id=$1",[uniqueId]);
       return res.status(200).send();
    }catch(error){
        console.error(error)
    }
   
}

const scanQr = async (req,res)=>{
    try {
       const {tcc_code,student_id,qr_code}=req.body
       
       const result = await pool.query("SELECT * FROM \"Attendence_System\".qr_table WHERE qr_id=$1",[qr_code]);
       if(result.rowCount===0){
        return res.status(401).send("QR Code Timeout");
       }else{
            codeList = qr_code.split('@')
            const result =await pool.query("UPDATE \"Attendence_System\".attendence SET attend='P' WHERE tcc_code=$1 AND student_id=$2 AND date=$3 AND period=$4",[tcc_code,student_id,codeList[1],codeList[2]]);
            return res.status(200).send("Succesfully Marked") 
       } 

    }catch(error){
        console.error(error)
    }
   
}

module.exports = {markAttendanceManually,generateQr,deleteQr,scanQr}