document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const registerLink = document.querySelector('nav a[href="register.html"]');
    const loginLink = document.querySelector('nav a[href="login.html"]');
    const myAccountDropdown = document.querySelector('.dropdown a[href="#"]'); // Select the "My account" link text
    const myAccountContainer = document.querySelector('.dropdown'); // The parent dropdown container

    if (user) {
        // User is logged in
        if (registerLink) registerLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';

        // Update "My account" text to show username or "My Account"
        if (myAccountDropdown) {
            myAccountDropdown.innerHTML = `Hi, ${user.username} <i class="fas fa-chevron-down"></i>`;
        }

        // Add Logout button to dropdown
        const dropdownContent = document.querySelector('.dropdown-content');
        if (dropdownContent) {
            // Check if logout already exists to avoid duplicates
            if (!document.getElementById('logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.id = 'logout-btn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    alert('Logged out successfully');
                    window.location.href = 'login.html';
                });
                dropdownContent.appendChild(logoutBtn);
            }
        }
    } else {
        // User is NOT logged in
        if (registerLink) registerLink.style.display = 'inline-block'; // or 'block' depending on CSS
        if (loginLink) loginLink.style.display = 'inline-block';

        // Optional: Hide specific account features if needed, or redirect from protected pages
    }
});
