# E-Commerce MERN Stack — Complete Guide

---

## Table of Contents
1. [Deployment Architecture](#deployment-architecture)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Render Environment Setup](#render-environment-setup)
4. [SendGrid Email Setup](#sendgrid-email-setup)
5. [UptimeRobot Keep-Alive Setup](#uptimerobot-keep-alive-setup)
6. [Fixing Hardcoded localhost URLs](#fixing-hardcoded-localhost-urls)
7. [Git Push Instructions](#git-push-instructions)
8. [Troubleshooting](#troubleshooting)

---

## Deployment Architecture

| Service | URL |
|---|---|
| Backend (Render) | `https://e-commerce-yh3q.onrender.com` |
| Customer Site (Render) | `https://ecommerce-shop-1osw.onrender.com` |
| Admin Dashboard (Render) | Separate static site |
| GitHub Repo | `https://github.com/tejaswagh1805/E-commerce` (branch: `dev_tejas`) |

**Render Free Tier Limitations:**
- SMTP ports (25, 465, 587) are blocked → use SendGrid HTTP API for email
- Ephemeral filesystem → uploaded images deleted on redeploy → use Cloudinary
- Backend sleeps after 15 min inactivity → use UptimeRobot to keep it awake

---

## Environment Variables Setup

### `backend/.env`
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Email (SendGrid preferred on Render)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=your-email@gmail.com

# Cloudinary (for persistent image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `frontend/.env` and `customer-site/.env`
```env
REACT_APP_API_URL=https://e-commerce-yh3q.onrender.com
```

---

## Render Environment Setup

### Backend Service
Go to: https://dashboard.render.com → your backend service → **Environment** tab

Add:
```
SENDGRID_API_KEY         = SG.your_actual_api_key
SENDGRID_FROM_EMAIL      = your-email@gmail.com
CLOUDINARY_CLOUD_NAME    = your_cloud_name
CLOUDINARY_API_KEY       = your_api_key
CLOUDINARY_API_SECRET    = your_api_secret
```

### Frontend / Customer Site Services
Go to: https://dashboard.render.com → each static site service → **Environment** tab

Add:
```
REACT_APP_API_URL = https://e-commerce-yh3q.onrender.com
```

Click **Save Changes** — Render will auto-redeploy (2–3 minutes).

> **Note:** `REACT_APP_API_URL` must be set in the hosting platform dashboard, not just in `.env` files, for production builds to pick it up.

---

## SendGrid Email Setup

Render blocks SMTP ports. SendGrid uses HTTP API and works perfectly.

**Free tier:** 100 emails/day

### Step 1 — Create Account
Go to https://signup.sendgrid.com/ and sign up.

### Step 2 — Create API Key
1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **Create API Key** → Full Access
3. Copy the key (starts with `SG.`) — you won't see it again

### Step 3 — Verify Sender Email
1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **Create New Sender**
3. Fill in your email details and verify via the confirmation email

### Step 4 — Add to Render
Add `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` to your backend service environment (see above).

### Step 5 — Deploy & Test
```bash
git add .
git commit -m "Add SendGrid email support"
git push origin dev_tejas
```

Check Render logs for:
```
✅ Using SendGrid for email delivery
✅ Email sent via SendGrid!
```

### Troubleshooting
- **Sender not verified** → Go to SendGrid → Settings → Sender Authentication
- **Invalid API key** → Make sure key starts with `SG.`, no spaces or quotes
- **Limit exceeded** → Free tier is 100/day; wait 24h or upgrade

---

## UptimeRobot Keep-Alive Setup

Render free tier sleeps after 15 min inactivity, causing 30–50 second cold starts. UptimeRobot pings your backend every 5 minutes for free.

### Setup (5 minutes)
1. Go to https://uptimerobot.com → Sign up free
2. Click **+ Add New Monitor**
3. Fill in:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `E-Commerce Backend`
   - URL: `https://e-commerce-yh3q.onrender.com/health`
   - Interval: `5 minutes`
4. Click **Create Monitor**

### Alternatives
- **Cron-job.org** (free) — https://cron-job.org → create job pinging `/health` every 5 min
- **Run locally:** `node keep-alive.js` (not recommended for production)
- **Upgrade Render** to $7/month — no sleep, faster, more reliable

---

## Fixing Hardcoded localhost URLs

All files should import `API_URL` from config instead of using `http://localhost:5000`.

### Pattern
```javascript
import { API_URL } from '../config';   // adjust path depth as needed
// use: `${API_URL}/your-endpoint`
```

### Image URLs — use `getImageUrl()` helper
```javascript
import { getImageUrl } from '../config';
// handles both Cloudinary full URLs and local filenames
<img src={getImageUrl(product.images?.[0])} />
```

### Files that were fixed
**Admin Dashboard (`frontend/src/`):**
- `config.js` — exports `API_URL` and `getImageUrl()`
- `Components/ProductList.js`, `Nav.js`, `Profile.js`

**Customer Site (`customer-site/src/`):**
- `config.js` — exports `API_URL` and `getImageUrl()`
- `pages/` — `Home.js`, `Shop.js`, `SingleProduct.js`, `Cart.js`, `Wishlist.js`, `Checkout.js`, `Orders.js`, `Profile.js`, `Login.js`, `Register.js`
- `components/` — `RecentlyViewed.js`, `Recommendations.js`, `Newsletter.js`

---

## Git Push Instructions

```bash
cd d:\mern_stack_project
git add .
git commit -m "your message here"
git push origin dev_tejas
```

### Common Errors

**No remote named origin:**
```bash
git remote add origin https://github.com/tejaswagh1805/E-commerce.git
git push -u origin dev_tejas
```

**Updates rejected:**
```bash
git pull origin dev_tejas --rebase
git push origin dev_tejas
```

**First time setup:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

After pushing, Render auto-deploys in 2–3 minutes.

---

## Troubleshooting

### Products not showing
1. Open browser console (F12) → Network tab — check API calls are going to the correct URL
2. Test backend directly: `https://e-commerce-yh3q.onrender.com/shop-products`
3. Verify `REACT_APP_API_URL` is set in Render environment
4. Rebuild the app after any `.env` change
5. Clear browser cache (Ctrl+Shift+Delete) or hard refresh (Ctrl+Shift+R)

### Images not loading
- Old products: local filenames (e.g. `1234567890.jpg`) → served from `/uploads/`
- New products (after Cloudinary setup): full URLs (e.g. `https://res.cloudinary.com/...`)
- `getImageUrl()` handles both cases automatically
- After adding Cloudinary credentials to Render, re-upload all products from admin dashboard

### Profile page blank (401 error)
- Stale token in localStorage — clear it and log in again
- Profile.js reads userId as `userData._id || userData.user?._id` to handle both storage shapes
- On 401, localStorage is cleared and user is redirected to login

### Emails not sending
- Render blocks SMTP — must use SendGrid (see SendGrid setup above)
- Check Render logs for error details
- Verify sender email is confirmed in SendGrid dashboard

### Slow loading / cold start delay
- Render free tier sleeps after 15 min — set up UptimeRobot (see above)
- First request after sleep takes 30–60 seconds — this is normal on free tier
- Upgrade to $7/month Render plan for no sleep mode

### Backend URL reference
- Health check: `https://e-commerce-yh3q.onrender.com/health`
- Products API: `https://e-commerce-yh3q.onrender.com/shop-products`
- Email config test: `https://e-commerce-yh3q.onrender.com/test-email-config`
