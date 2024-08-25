document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-items a');
    const homeContent = document.getElementById('home-wrapper');
    const aboutContent = document.getElementById('about-wrapper');
    const contactContent = document.getElementById('contact-wrapper');
    navItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const id = this.id;
            navItems.forEach(navItem => {
                navItem.style.fontWeight = '400';
                navItem.style.borderBottom= '0';
            });
            item.style.fontWeight = 'bold';
            item.style.borderBottom = '4px solid black';
            if (id === 'home') {
                homeContent.style.display = 'block';
                aboutContent.style.display = 'none';
                contactContent.style.display='none';
                
            } else if (id === 'about') {
                homeContent.style.display = 'none';
                aboutContent.style.display = 'block';
                contactContent.style.display='none';
                aboutBtn.style.fontWeight='600';
            }else if (id === 'contact') {
                    homeContent.style.display = 'none';
                    aboutContent.style.display = 'none';
                    contactContent.style.display='block'; 

            }
        });
    });
});
