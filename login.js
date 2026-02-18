document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the login page (has email and password but NO username)
    const loginForm = document.querySelector('.auth-form');
    const isRegisterPage = document.getElementById('username');

    if (loginForm && !isRegisterPage) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login successful!');
                    // Store token or user data if needed
                    localStorage.setItem('user', JSON.stringify(data.user));

                    if (data.user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.msg || 'Login failed');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Server error. Please try again later.');
            }
        });
    }
});
