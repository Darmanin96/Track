# 🎬 Trackr — Tu tracker de películas, series y videojuegos

Plataforma web PWA para llevar el control de todo lo que ves y juegas. Busca contenido, puntúalo, reseñalo y comparte tus listas con quien quieras.

🔗 **Demo en producción:** [http://45.90.237.204](http://45.90.237.204)

---

## ✨ Funcionalidades

- 🔍 **Búsqueda** de películas, series y videojuegos con autocompletado
- 📚 **Biblioteca personal** — añade contenido con estado (viendo, completado, pendiente...)
- ⭐ **Puntuaciones y reseñas** del 1 al 10
- 👤 **Registro e inicio de sesión** con JWT
- 📱 **PWA** — instalable como app nativa en móvil y escritorio
- 🌍 **Responsive** — adaptado a móvil, tablet y escritorio

---

## 🏗️ Arquitectura

```
[Angular PWA] → [API Node.js en CubePath] → [TMDB API / RAWG API]
                          ↓
                    [PostgreSQL]
```

---

## 🚀 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 17 + PWA |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Películas y series | TMDB API |
| Videojuegos | RAWG API |
| Auth | JWT |
| Despliegue | CubePath (Nginx + PM2) |

---

## 📦 Instalación local

### Prerrequisitos
- Node.js 20+
- Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL (o Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

Abre el navegador en `http://localhost:4200`.

---

## 🔧 Variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trackr
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=secreto_muy_largo
JWT_EXPIRES_IN=7d
TMDB_API_KEY=tu_key_de_tmdb
TMDB_BASE_URL=https://api.themoviedb.org/3
RAWG_API_KEY=tu_key_de_rawg
RAWG_BASE_URL=https://api.rawg.io/api
FRONTEND_URL=http://localhost:4200
```

---

## ☁️ Despliegue en CubePath

### Backend
```bash
pm2 start src/server.js --name trackr-api
pm2 save
pm2 startup
```

### Frontend
```bash
ng build --configuration production
scp -r dist/frontend/browser/* root@tu-ip:/var/www/Track/frontend/
```

---

## 📡 Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/content/trending` | Tendencias |
| GET | `/api/content/search?q=...` | Búsqueda |
| GET | `/api/library` | Mi biblioteca |
| POST | `/api/library` | Añadir a biblioteca |
| GET | `/api/lists` | Mis listas |
| POST | `/api/lists` | Crear lista |

---

## 🖼️ Capturas



---

## ☁️ Cómo se usa CubePath

Este proyecto usa **CubePath** para:
- Hospedar el **backend** Node.js con PM2
- Hospedar el **frontend** Angular compilado como sitio estático con Nginx
- Gestionar la **base de datos** PostgreSQL en producción

---

Desarrollado para la **Hackatón CubePath 2026** organizada por [@midudev](https://midu.dev).
