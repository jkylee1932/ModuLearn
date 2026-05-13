if (!localStorage.getItem('token')) {
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', () => {
    
    const userData = JSON.parse(localStorage.getItem('userData'));

    
    const welcomeMessage = document.getElementById('welcome-message');
    const userAvatar = document.getElementById('user-avatar');

    if (userData && userData.name) {
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${userData.name}! 👋`;
        }
        if (userAvatar) {
  
            userAvatar.textContent = userData.name.substring(0, 2).toUpperCase();
        }
    }
    
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const currentActive = document.querySelector('.nav-links li.active');
            if (currentActive) currentActive.classList.remove('active');
            link.classList.add('active');
        });
    });
});

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
