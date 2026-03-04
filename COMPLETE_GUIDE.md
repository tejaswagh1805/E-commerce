# 📚 Complete E-Commerce Application Guide

## 📖 Table of Contents
1. [Email Notifications](#email-notifications)
2. [Inventory Management](#inventory-management)
3. [Coupon & Discount System](#coupon--discount-system)
4. [Payment Gateway (Razorpay)](#payment-gateway-razorpay)
5. [Additional Features](#additional-features)
6. [Troubleshooting](#troubleshooting)

---

## 📧 Email Notifications

### Current Status
✅ Email system is working with **Ethereal** (test email service)
- No setup required for development
- View emails via preview link in console
- Perfect for testing

### Quick Test
1. Place an order from customer site
2. Check backend console for preview link
3. Click link to view the email

### Email Features
- Professional HTML template
- Order details with Order ID
- Product list with quantities and prices
- Selected size and color for each product
- Coupon code and discount (if applied)
- Complete price breakdown (Subtotal, Discount, Tax, Total)
- Shipping address
- Track order button
- Pink-themed branding

### Send Real Emails (Production)

**Option 1: Gmail (Free)**

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other" → Type "E-Commerce"
   - Copy the 16-character password (remove spaces!)

3. **Update .env file** (`backend/.env`):
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   ```

4. **Restart backend**:
   ```bash
   cd backend
   node index.js
   ```

**Option 2: SendGrid (Recommended for Production)**
- Sign up: https://sendgrid.com (Free 100 emails/day)
- Get API Key
- Better deliverability than Gmail

---

## 📦 Inventory Management

### Features
- Multiple sizes (XS, S, M, L, XL, XXL)
- Multiple colors (12 color options)
- Stock quantity tracking
- Discount percentage
- Brand and SKU
- Product descriptions

### Admin Flow

**Add/Update Product:**
1. Go to Admin Dashboard → Add Product or Update Product
2. Fill product details (Name, Price, Category, Company)
3. Set **Stock Quantity** (e.g., 100)
4. Set **Discount %** (e.g., 20)
5. Add **Brand** and **SKU**
6. Add **Description**
7. Select **Sizes** by clicking buttons
8. Select **Colors** by clicking buttons
9. Upload images
10. Click "Add Product" or "Update Product"

### Customer Flow

**Product Page:**
1. Customer views product with size/color options
2. Selects desired size (e.g., "M")
3. Selects desired color (e.g., "Maroon")
4. Clicks "Add to Cart"
5. System validates selection
6. Product added with selected variants

**Cart:**
- Each item shows selected size and color
- Same product with different variants = separate cart items
- Example: "Size: M, Color: Maroon"

### Database Schema
```javascript
Product {
  name, price, category, company,
  images: [String],
  sizes: [String],
  colors: [String],
  stock: Number,
  discount: Number,
  brand: String,
  sku: String,
  description: String,
  rating: Number,
  reviews: [Object]
}
```

---

## 🎉 Coupon & Discount System

### Features

**Product-Level Discounts:**
- Discount badges on product cards (e.g., "20% OFF")
- Original price with strikethrough
- Discounted price highlighted
- Works on Shop page and Home page

**Coupon Codes:**
- Apply at checkout
- Percentage or fixed discount
- Minimum purchase requirement
- Maximum discount cap
- Usage limits
- Expiry dates

### Admin - Create Coupons

1. Go to Admin Dashboard → Coupons
2. Click "Create Coupon"
3. Fill details:
   - **Code**: SAVE20 (uppercase)
   - **Type**: Percentage or Fixed
   - **Discount**: 20 (for 20% or ₹20)
   - **Min Purchase**: 500
   - **Max Discount**: 1000
   - **Expiry Date**: Select date
   - **Usage Limit**: 100
4. Click "Create"

### Customer - Apply Coupon

1. Add products to cart
2. Go to checkout
3. Enter coupon code (e.g., "SAVE20")
4. Click "Apply"
5. See discount applied
6. Complete order

### Email Integration
When order is placed with coupon:
- Email shows coupon code in pink badge
- Shows discount amount in green
- Shows savings banner
- Complete price breakdown

### Database Schema
```javascript
Coupon {
  code: String (unique, uppercase),
  type: "percentage" | "fixed",
  discount: Number,
  minPurchase: Number,
  maxDiscount: Number,
  expiryDate: Date,
  isActive: Boolean,
  usageLimit: Number,
  usedCount: Number
}

Order {
  orderId, userId, customerName, email,
  products: [Object],
  subtotal: Number,
  couponCode: String,
  discount: Number,
  totalAmount: Number,
  // ... other fields
}
```

---

## 💳 Payment Gateway (Razorpay)

### Features
- Multiple payment methods (Card, UPI, Netbanking, Wallets)
- Secure payment processing
- Payment verification
- Test mode for development
- COD + Online payment options

### Setup (3 Minutes)

**1. Get API Keys**
- Sign up: https://razorpay.com
- Dashboard → Settings → API Keys → Generate Test Keys
- Copy **Key ID** and **Key Secret**

**2. Configure Backend**

Edit `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

**3. Configure Frontend**

Edit `customer-site/src/pages/Checkout.js` (around line 110):
```javascript
key: "rzp_test_YOUR_KEY_HERE",
```

**4. Restart Servers**
```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Customer Site
cd customer-site
npm start
```

### Test Payment

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- CVV: `123`
- Expiry: `12/25`

**Test UPI:**
- ID: `success@razorpay`

### Payment Flow

1. Customer selects "Pay Online (Razorpay)"
2. Clicks "Confirm Order"
3. Razorpay popup opens
4. Customer selects payment method
5. Enters payment details
6. Completes payment
7. Payment verified on backend
8. Order created with payment details
9. Email sent to customer
10. Redirected to Thank You page

### Go Live

1. Complete KYC in Razorpay Dashboard
2. Submit business documents
3. Wait for approval (2-3 days)
4. Get Live API Keys (starts with `rzp_live_`)
5. Replace test keys with live keys
6. Restart servers
7. Start accepting real payments

**Pricing:** 2% per transaction, no setup fee

---

## ✨ Additional Features

### 1. Product Reviews & Ratings
- Customers can add reviews with star ratings (1-5)
- Average rating calculation
- Reviews displayed on product page
- API: `POST /product/:id/review`

### 2. Wishlist
- Add/Remove products from wishlist
- Dedicated wishlist page
- Wishlist icon in navbar
- Quick add to cart from wishlist
- API: `POST /wishlist/add`, `GET /wishlist`

### 3. Recently Viewed Products
- Automatic tracking of viewed products
- Stored in localStorage
- Shows last 10 viewed products
- Displayed on product detail page

### 4. Product Recommendations
- Category-based recommendations
- Shows top-rated products from same category
- Displayed on product detail page
- API: `GET /products/recommended/:category`

### 5. Newsletter Subscription
- Email subscription form
- Beautiful gradient design
- Displayed on home page
- Duplicate email prevention
- API: `POST /newsletter/subscribe`

### 6. Stock Management
- Stock count display on product page
- Out of stock handling
- Disabled purchase buttons when out of stock

### 7. Trending Products
- Based on views and ratings
- API: `GET /products/trending`

---

## 🐛 Troubleshooting

### Email Issues

**Problem: Email not sending**
- Check console for errors
- Verify credentials in `.env`
- For Gmail, use App Password (not regular password)
- Check spam folder

**Problem: "Invalid login" error**
- Enable 2-Step Verification
- Use App Password
- Remove spaces from password
- Verify EMAIL_USER is full Gmail address

### Inventory Issues

**Problem: Sizes/Colors not showing**
- Product must have sizes/colors in database
- Update product in admin dashboard first

**Problem: Validation error when adding to cart**
- This is correct behavior
- Select size and color before adding to cart

### Payment Issues

**Problem: Razorpay popup not opening**
- Check if Razorpay script is loaded in `index.html`
- Verify API key in Checkout.js
- Check browser console for errors

**Problem: Payment verification failed**
- Verify RAZORPAY_KEY_SECRET in backend `.env`
- Check backend logs for signature mismatch
- Ensure backend was restarted after adding keys

**Problem: Test payment not working**
- Use exact test card: `4111 1111 1111 1111`
- CVV: `123`, Expiry: `12/25`
- Make sure you're in test mode

### Coupon Issues

**Problem: Coupon not applying**
- Check if coupon is active
- Verify expiry date
- Check minimum purchase requirement
- Verify usage limit not exceeded

**Problem: Discount not showing on products**
- Set discount percentage in admin dashboard
- Update product with discount value
- Refresh customer site

---

## 📝 Quick Reference

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Email (Optional - for production)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Razorpay (Optional - for online payments)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
RAZORPAY_KEY_SECRET=YOUR_SECRET
```

### Start Servers
```bash
# Backend (Terminal 1)
cd backend
node index.js

# Admin Dashboard (Terminal 2)
cd frontend
npm start

# Customer Site (Terminal 3)
cd customer-site
npm start
```

### URLs
- Backend: http://localhost:5000
- Admin Dashboard: http://localhost:3001
- Customer Site: http://localhost:3000

---

## 🎯 Summary

Your e-commerce application includes:

✅ **Email Notifications** - Order confirmations with professional templates
✅ **Inventory Management** - Sizes, colors, stock, discounts
✅ **Coupon System** - Discount codes with validation
✅ **Payment Gateway** - Razorpay integration with multiple payment methods
✅ **Product Reviews** - Star ratings and customer reviews
✅ **Wishlist** - Save products for later
✅ **Recommendations** - Smart product suggestions
✅ **Newsletter** - Email subscription
✅ **Stock Management** - Real-time inventory tracking

**Everything works like real e-commerce sites (Amazon, Flipkart, FirstCry)!** 🎉

---

## 📞 Support

For issues or questions:
- Check this guide first
- Review console logs (backend and frontend)
- Check browser developer tools
- Verify all configuration files

**Your complete e-commerce platform is ready!** 🚀
