document.addEventListener('DOMContentLoaded', () => {

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const toRegister = document.getElementById('to-register');
const toLogin = document.getElementById('to-login');
const statusAlert = document.querySelector('status-alert');

    // Login <-> Register
    if (toRegister) {
        toRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
        });
    }

    if (toLogin) {
        toLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    //  Notification System
    function showNotification(message, isError = false) {
        if (!statusAlert) return;
        statusAlert.textContent = message;
        statusAlert.style.backgroundColor = isError ? '#dc5537' : '#2ecc71';
        statusAlert.classList.add('show');
        
        setTimeout(() => { 
            statusAlert.classList.remove('show'); 
        }, 3000);
    }

    // LOGIN LOGIC
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailField = document.getElementById('login-email');
            const passwordField = document.getElementById('login-password');
            
            const email = emailField.value;
            const password = passwordField.value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();

                if (response.ok) {
                    //DATA LOGIC
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    window.location.href = "dashboard.html";
                } else {
                    // RESET WRONG PASSWORD
                    showNotification("Wrong password. Try again.", true);
                    passwordField.value = ""; 
                    passwordField.focus();
                }
            } catch (error) {
                showNotification("Server error. Try again later.", true);
                if (passwordField) passwordField.value = "";
            }
        });
    }

    // REGISTRATION LOGIC
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const role_type = document.getElementById('reg-role').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name, 
                        email, 
                        password, 
                        role_type, 
                        section_id: 1 
                    })
                });

                if (response.ok) {
                    showNotification("Account created successfully!");
                    
                    //SUCCESS REGISTER GO TO LOGIN
                    setTimeout(() => {
                        registerContainer.style.display = 'none';
                        loginContainer.style.display = 'block';
                    }, 2000);
                } else {
                    const err = await response.json();
                    showNotification(err.message || "Registration failed.", true);
                }
            } catch (error) {
                showNotification("Server connection failed.", true);
            }
        });
    }
});
