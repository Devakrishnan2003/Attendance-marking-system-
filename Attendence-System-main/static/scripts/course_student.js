
document.addEventListener('DOMContentLoaded',function(){ 

    const params = window.location.search
    const tcc_code = new URLSearchParams(params).get('tcc_code');
    const student_id = document.getElementsByClassName('container')[0].id;
    
    window.getAttendanceInfo = async ()=>{
        try{
            const res = await axios.get('/courses/attendanceInfo',{
                params:{
                    student_id:student_id,
                    tcc_code:tcc_code
                }
            });
            
            const attendanceList = res.data.attendanceList;
            
            const teacherName = document.getElementById('teacherName')
            const totalPeriod= document.getElementById('totalPeriod');
            const attendanceInfo = document.getElementById('attendanceInfo');
            const absenceInfo = document.getElementById('absenceInfo')

            totalPeriod.innerHTML=attendanceList.totalPeriod;
            teacherName.innerHTML=attendanceList.teacherName

            if(attendanceList.totalPeriod===0){
 
                attendanceInfo.innerHTML=  `<tr>
                    <td class="font-medium">0</td>
                    <td>0%</td>
                    </tr>`
                document.getElementById('absenceHead').style.display='none'
                absenceInfo.innerHTML=`<h3 style="padding:10px">${attendanceList.absenceDetails}</h3>`; 
            }
            else{
                    let percentage = Number(attendanceList.periodAttended)*100/Number(attendanceList.totalPeriod);
                    attendanceInfo.innerHTML=`<tr>
                    <td class="font-medium" id=>${attendanceList.periodAttended}</td>
                    <td>${parseFloat(percentage.toFixed(2))}%</td>
                    </tr>`

                    let oldDate = (attendanceList.absenceDetails[0][0].split('T'))[0];
                    let periodList = [];
                    let absenceInfoList = '';
                    attendanceList.absenceDetails.forEach(item => {
                        let date = (item[0].split('T'))[0];
                        if (date === oldDate) {
                            periodList.push(item[1]);
                        } else {
                            let newDate = oldDate; // No need to reverse the date format
                            let list = periodList.join(',');
                            newDate=newDate.split("-")
                            newDate=newDate.reverse().join("-")
                            absenceInfoList += `<tr><td class="font-medium">${newDate}</td><td>${list}</td></tr>`;
                            oldDate = date;
                            periodList = [item[1]]; // Reset the periodList for the new date
                        }
                    });

                    if (periodList.length > 0) {
                        let list = periodList.join(',');
                        oldDate=oldDate.split("-")
                        oldDate=oldDate.reverse().join("-")
                        absenceInfoList += `<tr><td class="font-medium">${oldDate}</td><td>${list}</td></tr>`;
                    }
                    absenceInfo.innerHTML=absenceInfoList

             }
                                
        }
        catch(error){
            console.log(error);
        }
    
     }
    
        getAttendanceInfo();
    
    })