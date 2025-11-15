# Proyecto Base - Examen Final Desarrollo Web

Este proyecto implementa una aplicación de chat simple que cumple con los requisitos de un examen de desarrollo web. Incluye un backend con Node.js/Express y un frontend con HTML/Bootstrap 5.

La aplicación se conecta a dos servicios externos para autenticación y envío de mensajes, y a una base de datos SQL Server para mostrar el historial de mensajes.

## Requisitos

- Node.js (v18 o superior)
- npm

## Instalación

1.  Clona el repositorio.
2.  Navega a la carpeta raíz del proyecto.
3.  Instala las dependencias:
    ```bash
    npm install
    ```

## Ejecución en Local

Para iniciar el servidor en modo de desarrollo, ejecuta:

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000` (o en el puerto especificado en la variable de entorno `PORT`).

## Variables de Entorno

El proyecto utiliza las siguientes variables de entorno:

-   `PORT`: El puerto en el que se ejecutará el servidor. Por defecto es `3000`.
-   `DB_URL`: La cadena de conexión para la base de datos **SQL Server**. Es **obligatoria** para que la Serie III (visualización de mensajes) funcione.

Puedes crear un archivo `.env` en la raíz del proyecto para gestionarlas localmente (recuerda añadir `.env` a tu `.gitignore`).

**Formato de la `DB_URL` para SQL Server:**

```
# Ejemplo para el examen
DB_URL="mssql://usr_DesaWebDevUMG:!ngGuast@360@svr-sql-ctezo.southcentralus.cloudapp.azure.com/db_DesaWebDevUMG?encrypt=true"
```
*Nota: `?encrypt=true` suele ser necesario para conectar a bases de datos en Azure.*

## Despliegue en Render

Este proyecto está preparado para ser desplegado fácilmente en **Render** como un **Web Service**.

1.  **Crea un nuevo "Web Service"** en tu dashboard de Render y conéctalo a tu repositorio de GitHub/GitLab.
2.  **Configuración del servicio:**
    -   **Environment**: `Node`.
    -   **Build Command**: `npm install`.
    -   **Start Command**: `npm start`.
3.  **Añade las Variables de Entorno**:
    -   Ve a la sección "Environment" de tu servicio en Render.
    -   Añade una nueva variable de entorno con la clave `DB_URL` y pega la cadena de conexión completa de SQL Server.
    -   Render proporciona automáticamente la variable `PORT`, por lo que no necesitas configurarla.

Con estos pasos, Render construirá y desplegará tu aplicación.