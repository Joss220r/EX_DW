document.addEventListener('DOMContentLoaded', () => {
    // URLs de la API externa
    const AUTH_API_URL = 'https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate';
    const MESSAGES_API_URL = 'https://backcvbgtmdesa.azurewebsites.net/api/Mensajes';
    
    // URL de nuestra propia API para obtener mensajes
    const LOCAL_MESSAGES_API = '/api/messages';

    // Vistas
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');

    // Formulario de Login (Serie I)
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    // App principal
    const logoutBtn = document.getElementById('logout-btn');
    const messagesContainer = document.getElementById('messages-container');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    // --- Lógica Principal ---

    // 1. Comprobar el estado de autenticación al cargar la página
    function checkAuthState() {
        const token = localStorage.getItem('authToken');
        if (token) {
            loginView.style.display = 'none';
            appView.style.display = 'block';
            fetchAndRenderMessages();
        } else {
            loginView.style.display = 'flex';
            appView.style.display = 'none';
        }
    }

    // 2. Manejar el inicio de sesión (Serie I)
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
            checkAuthState();

        } catch (error) {
            loginError.textContent = error.message;
            loginError.style.display = 'block';
        }
    });

    // 3. Manejar el cierre de sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        checkAuthState();
    });

    // 4. Obtener y mostrar mensajes de la DB (Serie III)
    async function fetchAndRenderMessages() {
        messagesContainer.innerHTML = '<p class="text-center">Cargando mensajes...</p>';
        try {
            const response = await fetch(LOCAL_MESSAGES_API);
            if (!response.ok) throw new Error('No se pudieron cargar los mensajes.');

            const data = await response.json();
            
            if (data.ok && data.messages.length > 0) {
                messagesContainer.innerHTML = '';
                data.messages.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message');
                    messageElement.innerHTML = `
                        <span class="author">${msg.Login_Emisor}</span>
                        <span class="content">${msg.Contenido}</span>
                    `;
                    messagesContainer.appendChild(messageElement);
                });
            } else {
                messagesContainer.innerHTML = '<p class="text-center">Aún no hay mensajes.</p>';
            }
            // Scroll hasta el final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        } catch (error) {
            messagesContainer.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
        }
    }

    // 5. Enviar un nuevo mensaje (Serie II)
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const content = messageInput.value.trim();

        if (!content || !token) return;

        try {
            const response = await fetch(MESSAGES_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    Cod_Sala: 0,
                    Login_Emisor: "jayala", // Requerido por el examen
                    Contenido: content
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al enviar el mensaje.');
            }
            
            messageInput.value = '';
            // Esperar un poco para que el mensaje se procese en el backend antes de refrescar
            setTimeout(fetchAndRenderMessages, 500);

        } catch (error) {
            alert(error.message);
        }
    });

    // Iniciar la aplicación
    checkAuthState();
});