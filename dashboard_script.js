// Minimal Dashboard interactivity

document.addEventListener('DOMContentLoaded', () => {
    // 1. (Optional) Populating the student name dynamically based on login data
    // In a real application, you would fetch this data after login.
    // For now, it stays as 'Mark Lester' as hardcoded in the HTML.
    
    // 2. Profile Dropdown Interactivity
    const userProfile = document.querySelector('.user-profile');
    userProfile.addEventListener('click', () => {
        // Future logic for showing profile dropdown settings/logout
        console.log("Profile clicked - Add dropdown logic here");
    });
    
    // 3. Highlight Sidebar items on click
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from other links
            document.querySelector('.nav-links li.active').classList.remove('active');
            // Add active class to clicked link
            link.classList.add('active');
        });
    });
});