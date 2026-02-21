document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.auth-form');

    if (registerForm) {
        // Check if this is actually the registration form (has username field)
        const isRegisterPage = document.getElementById('username');
        if (!isRegisterPage) return; // Exit if not register page

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                // Adjust fetch 
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        firstname,
                        lastname,
                        email,
                        password
                    })
                });

                let data;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    const text = await response.text();
                    console.error("Non-JSON response:", text);
                    throw new Error("Server returned non-JSON response.");
                }

                if (response.ok) {
                    alert('Registration successful! Redirecting to login...');
                    window.location.href = 'login.html';
                } else {
                    alert(data.msg || 'Registration failed');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Server error. Please try again later. Make sure server is running on port 5000.');
            }
        });
    }
});
