# 🎬 Trackr

**Trackr** es una aplicación web fullstack para organizar y seguir tu consumo de películas, series y videojuegos. Busca contenido, añádelo a tu biblioteca personal y mantén el control de lo que has visto, estás viendo o tienes pendiente.

🌐 **Demo en vivo:** [trackio.duckdns.org](https://trackio.duckdns.org)

---

## ✨ Características

- 🔍 **Búsqueda unificada** de películas, series y videojuegos con sugerencias en tiempo real
- 📚 **Biblioteca personal** con estados personalizados por tipo de contenido
- ⭐ **Sistema de puntuación** del 1 al 10 para contenido completado
- 📺 **Plataformas de streaming** donde ver cada película o serie (flatrate, alquiler, compra)
- 🎮 **Plataformas de juego** disponibles para cada videojuego
- 🌍 **Descripciones traducidas** al español automáticamente
- 🔐 **Autenticación** con registro e inicio de sesión
- 📱 **Diseño responsive** con menú móvil

---

## 🛠️ Stack tecnológico

### Frontend
- **Angular 19** (standalone components, control flow `@if/@for`)
- **TypeScript**
- **SCSS** con variables CSS y diseño BEM
- **Angular PWA** (Service Worker)

### Backend
- **Node.js + Express**
- **PostgreSQL** con caché de contenido
- **JWT** para autenticación
- **APIs externas:**
  - [TMDB](https://www.themoviedb.org/documentation/api) — películas y series
  - [RAWG](https://rawg.io/apidocs) — videojuegos
  - [LibreTranslate](https://translate.fedilab.app) — traducción automática

### Infraestructura
- **VPS** con Ubuntu 24
- **Nginx** como reverse proxy
- **PM2** para gestión de procesos
- **Let's Encrypt** (HTTPS)

---

## 📁 Estructura del proyecto

```
Track/
├── backend/
│   └── src/
│       ├── config/          # DB y clientes de API
│       ├── middlewares/     # Manejo de errores, auth
│       ├── routes/          # content, auth, library
│       └── services/        # Lógica de negocio
├── frontend/
│   └── src/
│       └── app/
│           ├── core/
│           │   └── services/  # auth, content, library, ui
│           ├── features/
│           │   ├── auth/      # login, register
│           │   ├── detail/    # página de detalle
│           │   ├── home/      # página principal
│           │   ├── library/   # biblioteca personal
│           │   └── search/    # búsqueda
│           └── shared/
│               └── components/ # navbar, alert, content-card
└── deploy.sh
```

---

## 🚀 Instalación local

### Requisitos previos
- Node.js 18+
- PostgreSQL
- Angular CLI

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Configura tus variables de entorno
npm run dev
```

Variables de entorno necesarias en `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trackr
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto
JWT_EXPIRES_IN=7d
TMDB_API_KEY=tu_api_key_tmdb
RAWG_API_KEY=tu_api_key_rawg
FRONTEND_URL=http://localhost:4200
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

La app estará disponible en `http://localhost:4200`.

---

## 🗄️ Base de datos

Crea la base de datos y las tablas necesarias:

```sql
CREATE DATABASE trackr;
CREATE USER trackr_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE trackr TO trackr_user;
```

El backend crea las tablas automáticamente al arrancar.

---

## 📦 Deploy en producción

El proyecto incluye un script de deploy automático:

```bash
./deploy.sh
```

Este script:
1. Hace `git pull` de los cambios
2. Compila el frontend con `ng build`
3. Reinicia el backend con PM2

### Configuración de Nginx

```nginx
server {
    server_name tu-dominio.com;

    location / {
        root /ruta/al/frontend/dist/frontend/browser;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📝 Estados por tipo de contenido

| Tipo | Estados disponibles |
|------|-------------------|
| 🎬 Película | Pendiente, Viendo, Completado, Abandonado |
| 📺 Serie | Pendiente, Viendo, Completado, Abandonado |
| 🎮 Juego | Pendiente, Jugando, Completado, Abandonado |

---

## 🔌 API Endpoints

### Contenido
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/content/search?q=&type=` | Búsqueda de contenido |
| GET | `/api/content/trending` | Contenido en tendencia |
| GET | `/api/content/movie/:id` | Detalle de película |
| GET | `/api/content/series/:id` | Detalle de serie |
| GET | `/api/content/game/:id` | Detalle de juego |
| GET | `/api/content/movie/:id/providers` | Plataformas de streaming |
| GET | `/api/content/series/:id/providers` | Plataformas de streaming |

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |

### Biblioteca
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/library` | Obtener biblioteca del usuario |
| POST | `/api/library` | Añadir a biblioteca |
| PUT | `/api/library/:id` | Actualizar estado/puntuación |
| DELETE | `/api/library/:id` | Eliminar de biblioteca |
