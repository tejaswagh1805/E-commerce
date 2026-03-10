# 🚀 HOW TO SET ENVIRONMENT VARIABLE ON RENDER

## 📍 STEP-BY-STEP GUIDE

### Step 1: Go to Render Dashboard
Open: https://dashboard.render.com

### Step 2: Find Your Customer Site Service
Look for: **ecommerce-shop** (or the service showing https://ecommerce-shop-1osw.onrender.com)

### Step 3: Click on the Service
Click on **ecommerce-shop** to open it

### Step 4: Click "Environment" Tab
On the left sidebar, you'll see:
- Settings
- **Environment** ← CLICK THIS
- Redirects/Rewrites
- Headers

### Step 5: Add Environment Variable
You'll see a section that says "Environment Variables"

Click the button: **"Add Environment Variable"**

### Step 6: Fill in the Details
Two input boxes will appear:

**Box 1 (Key):**
```
REACT_APP_API_URL
```

**Box 2 (Value):**
```
https://ecommerce-admin-lxhw.onrender.com
```

### Step 7: Save Changes
Click **"Save Changes"** button at the bottom

### Step 8: Wait for Redeploy
Render will automatically redeploy your service (takes 2-3 minutes)

You'll see a message: "Deploying..."

### Step 9: Test Your Site
After deployment completes, visit:
https://ecommerce-shop-1osw.onrender.com/shop

Products will load! ✅

---

## 🎯 WHAT THIS DOES

**Before:**
- Your code tries to use `process.env.REACT_APP_API_URL`
- Render doesn't have this variable
- Falls back to `http://localhost:5000`
- localhost doesn't exist on live server
- Products don't load ❌

**After:**
- Render has `REACT_APP_API_URL` set
- Your code uses `https://ecommerce-admin-lxhw.onrender.com`
- Calls go to correct backend
- Products load! ✅

---

## ✅ VERIFY IT'S SET

After adding, you should see in Environment tab:

```
REACT_APP_API_URL = https://ecommerce-admin-lxhw.onrender.com
```

---

## 🔄 DO THE SAME FOR ADMIN DASHBOARD

Repeat steps 1-9 for your **ecommerce-admin** service too!

Both services need this environment variable.

---

## 📞 STILL NOT WORKING?

1. Check spelling: `REACT_APP_API_URL` (exact spelling)
2. Check value: `https://ecommerce-admin-lxhw.onrender.com` (no trailing slash)
3. Wait for deployment to complete (green checkmark)
4. Clear browser cache (Ctrl+Shift+Delete)
5. Try in incognito/private window

---

## 🎉 AFTER THIS

Everything will work:
- ✅ Products load on customer site
- ✅ Profile loads
- ✅ Orders save to database
- ✅ Admin can see orders
- ✅ Ready for client demo!

---

**Time needed:** 2 minutes
**Difficulty:** Easy
**Cost:** Free
