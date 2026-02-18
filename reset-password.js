document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageElement = document.getElementById('message');

    // Basic Validation
    if (newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'red');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('Passwords do not match', 'red');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/reset-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Password has been reset successfully!', 'green');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage(data.msg || 'Error resetting password', 'red');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error, please try again.', 'red');
    }

    function showMessage(text, color) {
        messageElement.textContent = text;
        messageElement.style.color = color;
        messageElement.style.display = 'block';
    }
});
