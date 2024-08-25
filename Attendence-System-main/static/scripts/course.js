
document.addEventListener('DOMContentLoaded',function(){ 

  const params = window.location.search
  const tcc_code = new URLSearchParams(params).get('tcc_code');

 window.getInfo = async ()=>{
    try{
        const res = await axios.get('/courses/studentlist',{
            params:{
                tcc_code:tcc_code
            }
        });
        const studentList = res.data.studentList;
        const className = document.getElementById('className');
        const semester = document.getElementById('courseSem');
        const totalPeriod= document.getElementById('totalPeriod');
        const studentInfo = document.getElementById('studentInfo');
        className.innerHTML=studentList.className;
        semester.innerHTML=studentList.semester;
        totalPeriod.innerHTML=studentList.totalPeriod;
        if(typeof(studentList.names)==="object"){
            if(studentList.totalPeriod===0){
                const studentInfoList = studentList.names.map(student=>{
                    return `<tr>
                    <td class="font-medium" id="${student[0]}">${student[1]}</td>
                    <td>${student[2]}</td>
                    <td>0%</td>
                  </tr>`
                }).join('');
                studentInfo.innerHTML=studentInfoList;
            }
            else{
                const studentInfoList = studentList.names.map(student=>{
                    let percentage = Number(student[2])*100/Number(studentList.totalPeriod);
                    return `<tr>
                    <td class="font-medium" id="${student[0]}">${student[1]}</td>
                    <td>${student[2]}</td>
                    <td>${parseFloat(percentage.toFixed(2))}%</td>
                  </tr>`
                }).join('');
                studentInfo.innerHTML=studentInfoList;
            }
            
        }
        else{
            studentInfo.innerHTML=`<h3 style="padding:10px">${studentList.names}</h3>`; 
        }
    }
    catch(error){
        console.log(error);
    }
}

    getInfo();


})