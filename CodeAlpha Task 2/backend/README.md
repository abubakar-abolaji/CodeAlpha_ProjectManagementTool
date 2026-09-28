# Project Management Tool Backend

A production-style Node.js + TypeScript backend for a collaborative project management platform inspired by Trello and Asana.

## Overview

This backend exposes a REST API and Socket.io real-time collaboration layer for managing users, projects, boards, tasks, comments, notifications, invitations, and admin analytics.

## Stack

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT + bcryptjs
- Socket.io
- Zod validation
- Helmet + CORS + express-rate-limit

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

Set the following values in your `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/project-management-tool
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

## MongoDB Setup

Start MongoDB locally or use a hosted MongoDB Atlas connection string. Update `MONGO_URI` accordingly.

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Seed Data

```bash
npm run seed
```

The seeding script creates:

- an admin account
- regular demo users
- sample projects
- boards and columns
- tasks
- comments
- notifications
- activity logs

## Authentication

The API uses JWT bearer tokens.

Example auth header:

```http
Authorization: Bearer <token>
```

## Key API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Users

- `GET /api/users`
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/:id`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `GET /api/projects/:id/members`
- `PATCH /api/projects/:id/members/:userId`
- `DELETE /api/projects/:id/members/:userId`

### Boards

- `POST /api/projects/:projectId/boards`
- `GET /api/projects/:projectId/boards`
- `GET /api/boards/:id`
- `PUT /api/boards/:id`
- `DELETE /api/boards/:id`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `PATCH /api/tasks/:id/assign`
- `PATCH /api/tasks/:id/position`

### Comments

- `POST /api/tasks/:taskId/comments`
- `GET /api/tasks/:taskId/comments`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`
- `DELETE /api/notifications/:id`

### Activity

- `GET /api/projects/:projectId/activity`
- `GET /api/tasks/:taskId/activity`

### Admin

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/projects`
- `GET /api/admin/tasks`
- `GET /api/admin/activity`

## Socket.io

The backend emits project-scoped socket events, including:

- `task.created`
- `task.updated`
- `task.deleted`
- `task.assigned`
- `task.statusChanged`
- `task.moved`
- `task.reordered`
- `comment.created`
- `comment.updated`
- `comment.deleted`
- `project.updated`
- `member.added`
- `member.removed`
- `notification.created`

Clients join a project room with the format:

```text
project:{projectId}
```

## Security

- JWT authentication
- hashed passwords via bcryptjs
- rate limiting
- CORS restrictions
- Helmet security headers
- server-side permission checks
- validated input via Zod

## Troubleshooting

### MongoDB connection issues

Verify the database is running and the `MONGO_URI` value is valid.

### JWT errors

Check the `JWT_SECRET` and ensure the client sends the token in the `Authorization` header as `Bearer <token>`.

### CORS issues

Ensure the frontend origin matches `CLIENT_URL` in your environment file.

## Folder Structure

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── utils/
│   ├── validations/
│   ├── app.ts
│   └── server.ts
├── scripts/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
