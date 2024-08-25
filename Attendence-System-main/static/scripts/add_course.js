document.addEventListener('DOMContentLoaded',function(){
  const courseData = {
    "null":"",
    "CST201":"Data Structures",
    "CST301":"Compiler Design",
    "CST302":"Programming in Python",
    "ECE203":"Logical Circuit Design",
    "ECE301":"Analog Circuits"
}
  const addCourse = async (courseCode,semester,className) =>{
    try {
      const teacher = document.getElementsByClassName('card-title')[0];
      
      data={
        teacher_id:teacher.id,
        course_code:courseCode,
        class_code:`C${semester}${className}`
      }

      const res = await axios.post('/update/course',data);
      
      displayMsg.innerText=res.data;
      displayMsg.style.border='1.5px solid #008080';
      displayMsg.style.color='#008080';
      displayMsg.style.display='block';

              
      getCourse();

      setTimeout(async ()=>{
        cardContent.style.display = 'block';
        newCourseFormContainer.style.display = 'none';
        courseForm.reset();
        courseNameDropdown.innerHTML = "";
        newCourseButton.innerText="Add Course";
        document.getElementsByClassName("Logout")[0].style.display='block';
        displayMsg.style.display='none'; 
      },1000)

    } catch (error) {
      displayMsg.innerText=error.response.data;
      displayMsg.style.border='1.5px solid red';
      displayMsg.style.color='#FF004F';
      displayMsg.style.display='block';
    }
 }

   const updateCourseName =()=>
 {
    const courseCode = document.getElementById("courseCode").value;
    const courseNameDropdown = document.getElementById("courseName");
    
    courseNameDropdown.innerHTML = "";
    const option = document.createElement("option");
    option.value = courseData[courseCode];
    option.text = courseData[courseCode];

    courseNameDropdown.appendChild(option);
 }

  const newCourseButton = document.querySelector('.newCourse');
    const cardContent = document.querySelector('.card-content');
  const newCourseFormContainer = document.getElementById('newCourseFormContainer');
  const courseForm = document.getElementById('newCourseForm')
  const courseNameDropdown = document.getElementById("courseName");

   newCourseButton.addEventListener('click', function() {
    if (cardContent.style.display === 'none') {
      cardContent.style.display = 'block';
      newCourseFormContainer.style.display = 'none';
      courseForm.reset();
      courseNameDropdown.innerHTML = "";
      newCourseButton.innerText="Add Course";
      document.getElementsByClassName("Logout")[0].style.display='block';
    } else {
      cardContent.style.display = 'none';
      newCourseFormContainer.style.display = 'block';
      newCourseButton.innerText="Back";
      document.getElementsByClassName("Logout")[0].style.display='none';
      displayMsg.style.display='none';   
    }
  });

  document.getElementById("courseCode").addEventListener("change", updateCourseName);

    courseForm.addEventListener('submit',function(e){
   
    e.preventDefault();

    const courseCode = document.getElementById("courseCode").value;
    const  semester = document.getElementById("semester").value;
    const className = document.getElementById("className").value;
    const displayMsg = document.getElementById("displayMsg");
    
    displayMsg.style.display='none';
    if(courseCode==="null" || semester==="null" || className=="null"){
        displayMsg.innerText="Fill All The Corresponding Fields";
        displayMsg.style.border='1.5px solid red';
        displayMsg.style.color='#FF004F';
        displayMsg.style.display='block'
    }
    else{
        addCourse(courseCode,semester,className);
        
    }

  })
})