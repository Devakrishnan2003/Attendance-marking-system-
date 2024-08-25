document.addEventListener('DOMContentLoaded',function(){
  window.scanQR = () => {
    document.getElementById('scanQR').addEventListener('click', function() {
      const displayMsg = document.getElementById('displayMsg')
      displayMsg.style.display="none";

     document.getElementById('preview').style.display="block"
      const video = document.getElementById('preview');
      const canvas = document.createElement('canvas');
      canvas.width = 300; 
      canvas.height = 300; 
      canvas.style.display = 'none'; 
      document.body.appendChild(canvas);

      navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 },
       height: { ideal: 720 }, facingMode: 'environment' } })
        .then(function(stream) {
          video.srcObject = stream;
          video.setAttribute('playsinline', true); 
          video.play();
          requestAnimationFrame(scan);
        })
        .catch(function(err) {
          console.error('Error accessing camera:', err);
        });

        let isScanning = true; // Flag to control the scanning loop

        async function scan() {
         if (!isScanning) return; // Exit the function if scanning is stopped
        
         if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const context = canvas.getContext('2d', { willReadFrequently: true });
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            setTimeout(async()=>{
                if(isScanning){
                  video.srcObject.getTracks().forEach(track => track.stop());
                  video.pause();
                  isScanning = false; // Stop the scanning loop
                  document.getElementById('preview').style.display="none" 

                  displayMsg.innerText="Try Again!!";
                  displayMsg.style.border='1.5px solid red';
                  displayMsg.style.color='#FF004F';
                  displayMsg.style.display='block'; 
                }
            },10000)

            if (code) {
              let qrcode=code.data.split('%40')
              const tcc_code = document.getElementsByClassName('card-title')[0].id
              const student_id = document.getElementsByClassName('container')[0].id

              if(qrcode[0]!=tcc_code){
                displayMsg.innerText="Invalid QR";
                displayMsg.style.border='1.5px solid red';
                displayMsg.style.color='#FF004F';
                displayMsg.style.display='block';
              }else{

                data={
                  tcc_code:tcc_code,
                  student_id:student_id,
                  qr_code:qrcode.join("@")
                }
                try {
                  
                  const result = await axios.post('/attendance/student/mark',data)
                  
                  getAttendanceInfo()
                  
                  displayMsg.innerText=result.data;
                  displayMsg.style.border='1.5px solid #66FF00';
                  displayMsg.style.color='#008080';
                  displayMsg.style.display='block';

                }catch(error) {
                  
                  displayMsg.innerText=error.response.data;
                  displayMsg.style.border='1.5px solid red';
                  displayMsg.style.color='#FF004F';
                  displayMsg.style.display='block';
                }
              }

              video.srcObject.getTracks().forEach(track => track.stop());
              video.pause();
              isScanning = false; // Stop the scanning loop
              
              document.getElementById('preview').style.display="none"
              setTimeout(async()=>{
                displayMsg.style.display="none"; 
              },5000) 
            }
         }
         if (isScanning) {
            requestAnimationFrame(scan); // Continue scanning if the flag is true
         }
        }
    });

  }  


    scanQR();


})