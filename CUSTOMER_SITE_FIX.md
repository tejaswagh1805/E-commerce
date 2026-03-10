# CUSTOMER SITE - QUICK FIX INSTRUCTIONS

## Files to Update (Replace localhost:5000 with ${API_URL})

### Step 1: Add import to each file
```javascript
import { API_URL } from '../config';  // or '../../config' depending on folder depth
```

### Step 2: Replace URLs

**pages/Home.js** (2 occurrences):
- Line 20: `const res = await fetch("http://localhost:5000/shop-products");`
  → `const res = await fetch(`${API_URL}/shop-products`);`
  
- Line 117: `src={`http://localhost:5000/uploads/${products[0].images?.[0]}`}`
  → `src={`${API_URL}/uploads/${products[0].images?.[0]}`}`
  
- Line 217: `src={`http://localhost:5000/uploads/${item.images?.[0]}`}`
  → `src={`${API_URL}/uploads/${item.images?.[0]}`}`

**pages/SingleProduct.js** (6 occurrences):
- Line 38: `const res = await fetch(`http://localhost:5000/shop-products`);`
- Line 62: `const res = await fetch(`http://localhost:5000/shop-products`);`
- Line 91: `await axios.delete(`http://localhost:5000/wishlist/remove/${product._id}`,`
- Line 99: `"http://localhost:5000/wishlist/add",`
- Line 177: `src={`http://localhost:5000/uploads/${product.images?.[activeImage]}`}`
- Line 193: `src={`http://localhost:5000/uploads/${img}`}`
- Line 485: `src={`http://localhost:5000/uploads/${item.images?.[0]}`}`

**pages/Checkout.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**pages/Orders.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**pages/Profile.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**pages/Cart.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**pages/Wishlist.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**components/CouponCode.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**components/Newsletter.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**components/ProductReviews.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**components/RecentlyViewed.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

**components/Recommendations.js**:
- Replace all `http://localhost:5000` with `${API_URL}`

## After Updates:

1. Rebuild both apps:
```bash
cd frontend
npm run build

cd ../customer-site
npm run build
```

2. Set environment variable on hosting:
```
REACT_APP_API_URL=https://ecommerce-admin-lxhw.onrender.com
```

3. Redeploy

## Your Backend URL:
https://ecommerce-admin-lxhw.onrender.com
