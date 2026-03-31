# Trackr

Trackr es una aplicación para organizar y seguir películas, series y videojuegos.
El frontend está construido con Angular y el backend con Express + PostgreSQL.

## Estructura

- `frontend/` → aplicación Angular
- `backend/` → API en Node.js / Express

## Ejecución local

1. Instala dependencias:
   - `npm install` en `frontend`
   - `npm install` en `backend`

2. Configura el backend en `backend/.env`

3. Arranca el backend:
   - `npm run dev` en `backend`

4. Arranca el frontend:
   - `npm start` en `frontend`

## Configuración de frontend

- `frontend/src/environments/environment.ts` está pensado para desarrollo local:
  - `apiUrl: 'http://localhost:3000/api'`
- `frontend/src/environments/environment.prod.ts` está pensado para producción:
  - `apiUrl: '/api'`

## Despliegue en CubePath

Para subirlo a CubePath necesitas:

1. Desplegar `backend` y `frontend` en la misma app o con una URL de backend accesible.
2. Configurar variables de entorno en CubePath para el backend:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `TMDB_API_KEY`
   - `RAWG_API_KEY`
   - `FRONTEND_URL` (opcional)
3. Usar `frontend/dist/frontend` como salida de producción si sirves estático.

## Notas

- `backend/.env` no debe subirse al repositorio público.
- El archivo `frontend/src/environments/environment.prod.ts` ya está configurado para usar rutas relativas a `/api`.
