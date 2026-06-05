# API REST — Tareas Manager Capitole & Synectic

Proyecto de gestión de tareas desarrollado con Node.js, Express y MongoDB. Permite leer, crear, completar y eliminar tareas, con autenticación vía JWT y manejo de roles: **admin** (gestiona tareas y usuarios) y **user** (solo tiene acceso a las tareas asignadas).

🔗 **Demo:** [api-task-capitole.vercel.app](https://api-task-capitole.vercel.app/) (Deploy Vercel)

- User admin demo: email: lopeza.dev@gmail.com - password: 123456
- User demo: email: juan@capitole.com - password: 123456

---

## Requisitos

- Node.js 18+
- pnpm
- MongoDB (Atlas)

## Instalación

```bash
pnpm install
cp .env.example .env   # (completar valores)
pnpm dev
```

## Variables de entorno (.env.example)

| Variable                | Descripción                           |
| ----------------------- | ------------------------------------- |
| `PORT`                  | Puerto local (ej. 8087)               |
| `MONGODB_URI`           | Connection string de MongoDB Atlas    |
| `JWT_SECRET`            | Secret para firmar los tokens         |
| `JWT_ACCESS_EXPIRED`    | Expiración del access token (ej. 15m) |
| `REFRESH_TOKEN_EXPIRED` | Expiración del refresh token (ej. 7d) |

## Scripts

| Comando        | Acción                           |
| -------------- | -------------------------------- |
| `pnpm dev`     | Inicia el proyecto en desarrollo |
| `pnpm start`   | Inicia el proyecto en producción |
| `pnpm test`    | Ejecuta los tests                |
| `pnpm swagger` | Regenerar cambios de rutas doc   |
| `pnpm seed`    | Crear automaticamente user admin |

## Estructura

```
src/
├── app.js              # app Express (middlewares, rutas, CORS, rate-limit)
├── config/db.js        # conexión a MongoDB
├── controllers/        # auth, task, user
├── middlewares/        # auth, requireAdmin, validator, errorHandler
├── models/             # User, Task, RefreshToken
├── routes/             # auth, task, user
├── utils/token.js      # generación de JWT
└── validators/         # reglas express-validator (auth, task, user)
server.js               # arranque local
api/index.js            # entry serverless (Vercel)
```

## Endpoints

Todas las respuestas usan el formato `{ success, message, data }`.

### Auth

| Método | Ruta             | Descripción          |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/register` | Registro de usuarios |
| POST   | `/auth/login`    | Inicio de sesión     |
| POST   | `/auth/refresh`  | Renovación de token  |
| POST   | `/auth/logout`   | Cerrar sesión        |

### Tasks

| Método | Ruta                  | Rol   | Descripción                              |
| ------ | --------------------- | ----- | ---------------------------------------- |
| GET    | `/tasks`              | auth  | Lista (admin: todas; user: las suyas)    |
| POST   | `/tasks`              | admin | Crear tarea                              |
| PATCH  | `/tasks/:id/complete` | auth  | Completar / reabrir (reabrir solo admin) |
| PATCH  | `/tasks/:id/assign`   | admin | Asignar responsable                      |
| DELETE | `/tasks/:id`          | admin | Eliminar tarea                           |

### Users

| Método | Ruta         | Rol   | Descripción         |
| ------ | ------------ | ----- | ------------------- |
| GET    | `/users`     | admin | Listar usuarios     |
| POST   | `/users`     | admin | Creación de usuario |
| PATCH  | `/users/:id` | admin | Editar usuario      |
| DELETE | `/users/:id` | admin | Eliminar usuario    |

## Seed — usuario admin

El registro siempre crea usuarios con rol `user`. Para crear el primer **admin**:

```bash
pnpm seed
```

Crea un admin con las credenciales email: admin@capitole.com - password : admin123.

## Tests

```bash
pnpm test
```

Jest + supertest + mongodb-memory-server (no necesita una DB real).

## Documentación (Swagger)

Documentación interactiva de la API en `/docs`, generada automáticamente con `swagger-autogen`.

- Local: [http://localhost:8087/docs](http://localhost:8087/docs)
