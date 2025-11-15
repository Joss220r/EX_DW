document.addEventListener('DOMContentLoaded', () => {
    // URLs de la API
    const MESSAGES_API_URL = 'https://backcvbgtmdesa.azurewebsites.net/api/Mensajes';
    const LOCAL_MESSAGES_API = '/api/messages';

    // --- Guardia de Autenticación ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return; // Detener la ejecución del script si no hay token
    }

    // Vistas y elementos de la página de chat
    const appView = document.getElementById('app-view');
    const logoutBtn = document.getElementById('logout-btn');
    const messagesContainer = document.getElementById('messages-container');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    // Mostrar la vista de la app
    appView.style.display = 'block';

    // --- Lógica Principal del Chat ---

    // 1. Manejar el cierre de sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
    });

    // 2. Obtener y mostrar mensajes de la DB
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

    // 3. Enviar un nuevo mensaje
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();

        if (!content) return;

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

    // Iniciar la aplicación de chat
    fetchAndRenderMessages();
});