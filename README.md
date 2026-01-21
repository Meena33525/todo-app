Todo App – PERN Stack

A full-stack Todo application built using PostgreSQL, Express, React, and Node.js.
Supports user authentication and secure task management with a clean dashboard UI.

✨ Features

User signup & login (JWT authentication)

Create, update, delete todos

Mark tasks as completed

Add description, priority, and due date

Filter and search tasks

Protected routes

🛠️ Tech Stack

Frontend: React, React Router, Axios, CSS
Backend: Node.js, Express.js, PostgreSQL, Sequelize
Auth & Security: JWT, bcrypt

Setup Instructions
1. Clone Repository
git clone https://github.com/Meena33525/todo-app.git
cd todo-app

2. Backend Setup
cd backend
npm install
node server.js


Create .env:

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=todo_app
DB_PORT=5432
JWT_SECRET=your_secret
PORT=5000

3. Frontend Setup
cd frontend
npm install
npm start

📚 API Endpoints

Auth

POST /api/auth/signup
POST /api/auth/login


Todos (JWT Protected)

GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id

🔐 Security

Password hashing using bcrypt

JWT-based authentication

Protected API routes