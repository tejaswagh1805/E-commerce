# 🛒 E-Commerce MERN Stack Application

A full-featured e-commerce platform built with **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring admin dashboard, customer site, order management, email notifications, and more.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express-Framework-lightgrey)

---

## 🌟 Features

### 👨‍💼 Admin Dashboard
- ✅ Product Management (Add, Edit, Delete)
- ✅ Order Management with Status Tracking
- ✅ Customer Management
- ✅ Coupon Code Management
- ✅ Dashboard Analytics (Sales, Orders, Revenue)
- ✅ Inventory Management (Sizes, Colors, Stock, Discount)
- ✅ Invoice Generation with QR Code
- ✅ Order Status Updates (Pending, Confirmed, Shipped, Delivered)

### 🛍️ Customer Site
- ✅ Product Browsing with Filters
- ✅ Product Search
- ✅ Single Product Page (FirstCry-inspired design)
- ✅ Size & Color Selection
- ✅ Shopping Cart with Variants
- ✅ Wishlist
- ✅ Checkout Process
- ✅ Order Tracking
- ✅ User Profile Management
- ✅ Product Reviews & Ratings
- ✅ Recently Viewed Products
- ✅ Product Recommendations
- ✅ Coupon Code Application
- ✅ Newsletter Subscription

### 💳 Payment Gateway
- ✅ Mock Payment Gateway Integration
- ✅ Multiple Payment Options (COD, Online)
- ✅ Secure Payment Processing
- ✅ Payment Verification
- ✅ No External Dependencies
- ✅ Card, UPI, Netbanking UI

### 📧 Email Notifications
- ✅ Order Confirmation Emails
- ✅ Professional HTML Email Templates
- ✅ Order Details with Product Images
- ✅ Coupon Code & Discount Information
- ✅ Price Breakdown (Subtotal, Discount, Tax, Total)
- ✅ Shipping Address
- ✅ Track Order Button

### 🎨 Design Features
- ✅ Clean White Theme with Pink Accents (#ff6b9d)
- ✅ FirstCry-Inspired Product Pages
- ✅ Discount Badges on Products
- ✅ Responsive Design
- ✅ Modern UI/UX

---

## 🚀 Tech Stack

### Frontend
- **React.js** - UI Library
- **React Router DOM** - Navigation
- **Bootstrap** - CSS Framework
- **Axios** - HTTP Client
- **Context API** - State Management

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File Upload
- **Nodemailer** - Email Service
- **PDFKit** - PDF Generation
- **QRCode** - QR Code Generation

---

## 📂 Project Structure

```
mern_stack_project/
│
├── backend/                    # Backend API
│   ├── db/                     # Database Models
│   │   ├── config.js          # MongoDB Connection
│   │   ├── User.js            # User Schema
│   │   ├── Product.js         # Product Schema
│   │   ├── Order.js           # Order Schema
│   │   ├── Wishlist.js        # Wishlist Schema
│   │   ├── Newsletter.js      # Newsletter Schema
│   │   └── Coupon.js          # Coupon Schema
│   ├── uploads/               # Product Images
│   ├── assets/                # Fonts, Logos
│   ├── emailService.js        # Email Service
│   ├── index.js               # Main Server File
│   ├── .env                   # Environment Variables
│   └── package.json
│
├── frontend/                   # Admin Dashboard
│   ├── src/
│   │   ├── Components/        # React Components
│   │   │   ├── AddProduct.js
│   │   │   ├── ProductList.js
│   │   │   ├── UpdateProduct.js
│   │   │   ├── Orders.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Nav.js
│   │   │   └── Footer.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── customer-site/              # Customer Frontend
│   ├── src/
│   │   ├── pages/             # Page Components
│   │   │   ├── Home.js
│   │   │   ├── Shop.js
│   │   │   ├── SingleProduct.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Orders.js
│   │   │   ├── Wishlist.js
│   │   │   ├── Profile.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── components/        # Reusable Components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── CartDrawer.js
│   │   │   ├── ProductReviews.js
│   │   │   ├── Recommendations.js
│   │   │   ├── RecentlyViewed.js
│   │   │   └── Newsletter.js
│   │   ├── context/           # Context API
│   │   │   └── CartContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/tejaswagh1805/E-commerce.git
cd E-commerce
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Start backend:
```bash
node index.js
```
Backend runs on: `http://localhost:5000`

### 3. Admin Dashboard Setup
```bash
cd frontend
npm install
npm start
```
Admin Dashboard runs on: `http://localhost:3001`

### 4. Customer Site Setup
```bash
cd customer-site
npm install
npm start
```
Customer Site runs on: `http://localhost:3000`

---

## 📚 Documentation

For detailed setup and feature guides, see:

**[📖 COMPLETE_GUIDE.md](./COMPLETE_GUIDE.md)** - Comprehensive documentation covering:
- Email Notifications Setup
- Inventory Management
- Coupon & Discount System
- Payment Gateway (Razorpay)
- Additional Features
- Troubleshooting

**Quick Start:**
- Email notifications work out-of-the-box (test mode)
- For production emails, see the Complete Guide
- All features are pre-configured and ready to use

---

## 🎯 Usage

### Admin Dashboard
1. Register as admin: `http://localhost:3001/signup`
2. Login with admin credentials
3. Add products with images, sizes, colors, discount
4. Manage orders and update status
5. View analytics and reports

### Customer Site
1. Browse products: `http://localhost:3000/shop`
2. View product details with size/color selection
3. Add to cart with selected variants
4. Apply coupon codes at checkout
5. Track orders
6. Receive email confirmations

---

## 🔐 Authentication

- **JWT-based** authentication
- **Protected routes** for admin and customer
- **Role-based access** control
- **Token expiration** handling

---

## 📦 Key Features Explained

### Inventory Management
- Multiple sizes (XS, S, M, L, XL, XXL)
- Multiple colors
- Stock quantity tracking
- Discount percentage
- Brand and SKU
- Product descriptions

### Cart System
- Stores size and color selections
- Same product with different variants = separate items
- Persistent cart (localStorage)
- User-specific carts

### Order Management
- Order status tracking
- Email notifications
- Invoice generation with QR code
- Shipping tracking
- Order history

### Coupon System
- Percentage or fixed discount
- Minimum purchase requirement
- Usage limit
- Expiry date
- Saved in order history

---

## 🎨 Design Highlights

- **Clean white theme** with pink accents
- **FirstCry-inspired** product pages
- **Discount badges** on products
- **Professional email** templates
- **Mobile-responsive** design
- **Smooth animations** and transitions

---

## 📊 Database Schema

### User
- name, email, password, mobile, image, role

### Product
- name, price, category, company, images, sizes, colors, stock, discount, brand, sku, description, rating, reviews

### Order
- orderId, userId, customerName, email, products, totalAmount, subtotal, couponCode, discount, status, addresses

### Coupon
- code, type, discount, minPurchase, maxDiscount, expiryDate, usageLimit

---

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update `.env`

---

## 📝 API Endpoints

### Authentication
- `POST /register` - Register user
- `POST /login` - Login user

### Products
- `GET /shop-products` - Get all products
- `GET /shop-product/:slug` - Get single product
- `POST /add-product` - Add product (Admin)
- `PUT /product/:id` - Update product (Admin)
- `DELETE /product/:id` - Delete product (Admin)

### Orders
- `POST /place-order` - Place order
- `GET /orders` - Get all orders (Admin)
- `GET /customer-orders/:userId` - Get user orders
- `PUT /order/:id` - Update order status (Admin)

### Wishlist
- `POST /wishlist/add` - Add to wishlist
- `DELETE /wishlist/remove/:id` - Remove from wishlist
- `GET /wishlist` - Get wishlist

### Coupons
- `POST /coupon/validate` - Validate coupon
- `POST /admin/coupon` - Create coupon (Admin)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Tejas Waghmode**
- GitHub: [@tejaswagh1805](https://github.com/tejaswagh1805)
- Email: tejaswaghmode18@gmail.com

---

## 🙏 Acknowledgments

- FirstCry for design inspiration
- MERN Stack community
- All contributors

---

## 📞 Support

For support, email tejaswaghmode18@gmail.com or create an issue in the repository.

---

## 🎉 Features Roadmap

- [x] Mock Payment Gateway Integration ✅
- [x] Real Payment Gateway (Razorpay) ✅
- [x] Email Notifications ✅
- [x] Coupon System ✅
- [x] Inventory Management ✅
- [ ] SMS Notifications
- [ ] Social Media Login
- [ ] Product Comparison
- [ ] Advanced Analytics
- [ ] Multi-language Support
- [ ] Dark Mode

---

**⭐ Star this repository if you find it helpful!**
