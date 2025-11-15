document.addEventListener('DOMContentLoaded', () => {
    const AUTH_API_URL = 'https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate';

    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    // Redirigir si ya hay un token
    if (localStorage.getItem('authToken')) {
        window.location.href = '/chat.html';
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.style.display = 'none';

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(AUTH_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Username: username, Password: password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Usuario o contraseña incorrectos.');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            
            // Redirigir a la página de chat
            window.location.href = '/chat.html';

        } catch (error) {
            loginError.textContent = error.message;
            loginError.style.display = 'block';
        }
    });
});
