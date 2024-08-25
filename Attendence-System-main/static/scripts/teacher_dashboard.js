const getCourse= async()=>{
  try {
      const teacher = document.getElementsByClassName('card-title')[0];
      const cardContent = document.querySelector('.card-content');
      const res = await axios.get('/courses/teacher',{
          params:{
              id:teacher.id
          }
      })
      const List = res.data.list;
      if(List.length===0){
          const noCourse = `<div class="course-card">
          <div class="course-card-content">
            <div class="course-info">
              <h3 class="course-title">Currently You Are Not Taking Any Courses</h3>
            </div>
          </div>
        </div>`
        cardContent.innerHTML = noCourse
      }
      else{
          const courseList= List.map(item=>{
              const{tcc_code,course_code,course_name} = item;
              return `<div class="course-card">
              <div class="course-card-content">
                <div class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div class="course-info">
                  <h3 class="course-title">${course_code}</h3>
                  <p class="course-description">${course_name}</p>
                </div>
                <a href="./${teacher.id}/course?tcc_code=${tcc_code}"class="view-link"><p>View</p><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4 w-4 peer-[margin-inline-start] translate-y-0.5"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg></a>
              </div>
            </div>`
          }).join('');
          cardContent.innerHTML = courseList; 

        }



  } catch (error) {
      console.log(error);
  }
}

document.addEventListener('DOMContentLoaded',function(){
  
  getCourse();
})