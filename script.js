document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELECTION OF ELEMENTS (Auth & Dashboard) ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const statusAlert = document.getElementById('status-alert');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const toRegister = document.getElementById('to-register');
    const toLogin = document.getElementById('to-login');

    // Dashboard 
    const welcomeMessage = document.getElementById('welcome-message');
    const userAvatar = document.getElementById('user-avatar');
    const navLinks = document.querySelectorAll('.nav-links li');

    // --- 2. AUTHENTICATION & SECURITY CHECK ---
    if (window.location.pathname.includes('dashboard.html')) {
        if (!localStorage.getItem('userData')) {
            window.location.href = "index.html";
        }
    }

    // --- 3. DASHBOARD UI LOGIC ---
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.name) {
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${userData.name}! 👋`;
        }
        if (userAvatar) {
            userAvatar.textContent = userData.name.substring(0, 2).toUpperCase();
        }
    }

    // Sidebar Active State Toggle
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links li.active')?.classList.remove('active');
            link.classList.add('active');
        });
    });

    // --- 4. Login <-> Register ---
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

    // --- 5. NOTIFICATION SYSTEM ---
    function showNotification(message, isError = false) {
        if (!statusAlert) return;
        statusAlert.textContent = message;
        statusAlert.style.backgroundColor = isError ? '#dc5537' : '#2ecc71';
        statusAlert.classList.add('show');
        
        setTimeout(() => { 
            statusAlert.classList.remove('show'); 
        }, 3000);
    }

    // --- 6. LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailField = document.getElementById('login-email');
            const passwordField = document.getElementById('login-password');
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailField.value, password: passwordField.value })
                });
                const result = await response.json();

                if (response.ok) {
                 
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    window.location.href = "dashboard.html";
                } else {
                    showNotification("Wrong password. Try again.", true);
                    passwordField.value = "";
                    passwordField.focus();
                }
            } catch (error) {
                showNotification("Server error. Try again later.", true);
            }
        });
    }

    // --- 7. REGISTRATION LOGIC ---
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
                        name, email, password, role_type, section_id: 1 
                    })
                });

                if (response.ok) {
                    showNotification("Account created successfully!");
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

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
