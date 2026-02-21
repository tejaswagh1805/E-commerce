# 🛒 E-Commerce Dashboard (MERN Stack)

A full-stack E-Commerce Dashboard application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. This application allows users to register, login, and manage products with complete CRUD functionality and JWT-based authentication.

---

## 🚀 Live Preview

* **Frontend:** [http://localhost:3000/](http://localhost:3000/)
* **Backend API:** [http://localhost:5000/](http://localhost:5000/)

---

# 📌 Project Overview

This project demonstrates a complete end-to-end MERN stack implementation including:

* User Authentication (JWT Based)
* Protected Routes
* Product Management (CRUD)
* Image Upload Functionality
* REST API Integration
* MongoDB Database Integration

The goal of this project is to build a scalable, secure, and structured full-stack web application.

---

# 🛠️ Tech Stack

## 🔹 Frontend

* React.js
* React Router DOM
* React Hooks (useState, useEffect, useNavigate, useParams)
* Bootstrap / CSS
* Fetch API / Axios
* LocalStorage

## 🔹 Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* Multer (Image Upload)
* CORS Middleware

## 🔹 Database

* MongoDB (NoSQL Database)

---

# 📂 Project Structure

## 📁 Frontend Structure

```
src/
│
├── components/
│   ├── Nav.js
│   ├── Footer.js
│
├── pages/
│   ├── Login.js
│   ├── SignUp.js
│   ├── AddProduct.js
│   ├── ProductList.js
│   ├── UpdateProduct.js
│
├── App.js
├── index.js
```

## 📁 Backend Structure

```
backend/
│
├── db/
│   ├── config.js
│   ├── User.js
│   ├── Product.js
│
├── routes/
├── middleware/
├── index.js
```

---

# 🔐 Authentication Flow

1. User registers via `/register`
2. Backend validates data and generates a JWT token
3. Token is stored in LocalStorage
4. Token is sent in request headers for protected APIs
5. Middleware verifies token before granting access

**Authorization Header Example:**

```
Authorization: Bearer <token>
```

---

# 📦 Features Implemented

## ✅ User Authentication

* User Registration
* User Login
* JWT Token Generation
* Protected Routes
* Auto Redirect if Already Logged In

## ✅ Product Management

* Add Product
* View Product List
* Update Product
* Delete Product
* Search Product

## ✅ Image Upload

* Multer middleware
* Image storage in uploads folder

---

# ⚛️ React Hooks Used

## 1️⃣ useState()

* Manage form inputs
* Store product data
* Handle dynamic UI updates

## 2️⃣ useEffect()

* Check authentication on load
* Fetch product list
* Handle side effects

## 3️⃣ useNavigate()

* Redirect after login/logout
* Navigation between pages

## 4️⃣ useParams()

* Fetch product by ID
* Update specific product

---

# 🔌 API Endpoints

## 🔐 Authentication APIs

| Method | Endpoint  | Description   |
| ------ | --------- | ------------- |
| POST   | /register | Register User |
| POST   | /login    | Login User    |

## 📦 Product APIs

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| GET    | /products    | Get All Products |
| POST   | /add-product | Add Product      |
| DELETE | /product/:id | Delete Product   |
| PUT    | /product/:id | Update Product   |

---

# 🗄️ Database Schema

## 👤 User Schema

* name
* email
* password

## 📦 Product Schema

* name
* price
* category
* company
* userId
* image

---

# 🔒 Security Implementation

* JWT Authentication
* Protected Routes
* Token Verification Middleware
* CORS Enabled
* Password Encryption (if bcrypt implemented)

---

# 🧠 Challenges Faced

* Handling Protected Routes
* Managing Token Expiration
* Redirect Issues After Login
* Frontend-Backend Integration
* Image Upload Handling

---

# 🚀 How to Run the Project

## 1️⃣ Clone Repository

```
git clone <your-repo-link>
cd project-folder
```

## 2️⃣ Install Dependencies

### Frontend

```
npm install
npm start
```

### Backend

```
cd backend
npm install
nodemon index.js
```

### Database

Ensure MongoDB is running locally:

```
mongod
```

---

# 🌟 Future Enhancements

* Role-Based Authentication (Admin/User)
* Redux or Context API Integration
* Payment Gateway Integration
* Pagination & Filtering
* Deployment (AWS / Render / Vercel)
* Email Notifications

---

# 👨‍💻 Author

**Tejas Waghmode**
Full Stack Developer (MERN)

---

# 📌 Conclusion

This project demonstrates:

* Strong understanding of MERN Stack Architecture
* REST API Development
* Authentication & Authorization
* CRUD Operations
* React Hooks Usage
* Secure Backend Integration
