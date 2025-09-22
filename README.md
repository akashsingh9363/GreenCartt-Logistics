# 🚀 GreenCart Delivery Simulation Platform

## 📌 Project Overview
GreenCart is a full-stack delivery simulation and management platform.  
The application allows users to:
- Register and log in securely.
- Manage drivers, delivery routes, and orders.
- Simulate real-time delivery tracking and optimization.
- Access a personalized dashboard after authentication.

The system is built with scalability and security in mind, making it suitable for logistics, supply chain, or delivery-based businesses.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js (with Vite)
- React Router DOM
- Context API (global state management)
- Axios (HTTP requests)
- TailwindCSS (styling)

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Helmet & CORS (security)
- Express Rate Limit (API protection)

### **Deployment & Tools**
- Render (backend deployment)
- Netlify / Vercel (frontend deployment)
- GitHub (version control)
- Postman (API testing)# 🚀 GreenCart Delivery Simulation Platform

## 📌 Project Overview
GreenCart is a full-stack delivery simulation and management platform.  
The application allows users to:
- Register and log in securely.
- Manage drivers, delivery routes, and orders.
- Simulate real-time delivery tracking and optimization.
- Access a personalized dashboard after authentication.

The system is built with scalability and security in mind, making it suitable for logistics, supply chain, or delivery-based businesses.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js (with Vite)
- React Router DOM
- Context API (global state management)
- Axios (HTTP requests)
- TailwindCSS (styling)

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Helmet & CORS (security)
- Express Rate Limit (API protection)

### **Deployment & Tools**
- Render (backend deployment)
- Netlify / Vercel (frontend deployment)
- GitHub (version control)
- Postman (API testing)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
``bash
- git clone https://github.com/your-username/greencart.git
- cd greencart

### 2️⃣ Backend Setup
- cd backend
- npm install
- Create a .env file inside backend/ (see Environment Variables).
- Start backend server:
- npm start

### 3️⃣ Frontend Setup
- cd frontend
- npm install
- Create a .env file inside frontend/ (see Environment Variables).
- Start frontend development server:
- npm run dev

### 4️⃣ Access the Application
- Backend: http://localhost:5000/api
- Frontend: http://localhost:5173

---

### 🔑 Environment Variables
- Backend (/backend/.env)
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret

- Frontend (/frontend/.env)
- VITE_API_URL=http://localhost:5000/api

### ⚠️ Never commit real values of secrets to GitHub.

---

### 🌍 Deployment Instructions
### Backend (Render)
1. Push backend code to GitHub.
2. Go to Render
3. Create a new Web Service -> Connect GitHub repo.
4. Set build command: npm install
   Start command: node server.js
5. Add environment variables in Render Dashboard.
6. Deploy -> Copy the deployed API URL.


### Frontend (Netlify / Vercel)
1. Push frontend code to GitHub.
2. Go to Netlify or Vergel.
3. Connect GitHub repo.
4. Add environment variable VITE_API_URL= Deployed backend API URL.
5. Deploy and access your frontend live link.

---
```markdown
### 📖 API Documentation
Auth Routes
Signup--- POST /api/auth/signup

Request:
{
  "name": "Akash",
  "email": "akash@example.com",
  "password": "mypassword123"
}

Response:
{
  "status": "success",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "12345",
      "name": "Akash",
      "email": "akash@example.com"
    }
  }
}

Login--- POST /api/auth/login

Request:
{
  "email": "akash@example.com",
  "password": "mypassword123"
}

Response:
{
  "status": "success",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "12345",
      "name": "Akash",
      "email": "akash@example.com"
    }
  }
}
**Endpoint:**
  
### Driver Routes
Get all drivers
GET /api/drivers
Authorization: Bearer <token>

### Route Routes
Get all routes
GET /api/routes
Authorization: Bearer <token>

### Order Routes
Get all orders
GET /api/orders
Authorization: Bearer <token>

---

### 👨‍💻 Author

Akash Kumar Singh
📍 B.Tech @ KIET Ghaziabad | Full stack Web Developer
