const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toRegister = document.getElementById('to-register');
const toLogin = document.getElementById('to-login');
const alertBox = document.querySelector('.alert-box');

// Switch to Register instantly
toRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

// Switch to Login instantly
toLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Auto-show Alert
window.addEventListener('load', () => {
    setTimeout(() => {
        alertBox.classList.add('show');
        setTimeout(() => alertBox.classList.remove('show'), 4000);
    }, 500);
});