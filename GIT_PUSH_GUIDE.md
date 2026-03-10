# 🚀 GIT PUSH INSTRUCTIONS

## Step 1: Check Git Status
```bash
cd d:\mern_stack_project
git status
```

## Step 2: Add All Changes
```bash
git add .
```

## Step 3: Commit Changes
```bash
git commit -m "Fix: Update API URLs to use environment variables for production deployment"
```

## Step 4: Push to GitHub
```bash
git push origin main
```

If your branch is named differently (master, develop, etc.):
```bash
git push origin master
```

## If You Get Errors:

### Error: "No remote named origin"
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Error: "Updates were rejected"
```bash
git pull origin main --rebase
git push origin main
```

### First Time Setup (if needed):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## After Pushing:

### For Render (Auto-Deploy):
- Render will automatically detect the push and redeploy
- Wait 2-3 minutes for deployment
- Check: https://ecommerce-admin-lxhw.onrender.com

### For Vercel/Netlify:
- Connect your GitHub repo if not already connected
- They will auto-deploy on push
- Or manually trigger deploy from dashboard

## IMPORTANT: Set Environment Variables

### On Render:
1. Go to https://dashboard.render.com
2. Select your service
3. Go to "Environment" tab
4. Add: `REACT_APP_API_URL` = `https://ecommerce-admin-lxhw.onrender.com`
5. Click "Save Changes"
6. Service will auto-redeploy

### On Vercel:
1. Go to project settings
2. Environment Variables
3. Add: `REACT_APP_API_URL` = `https://ecommerce-admin-lxhw.onrender.com`
4. Redeploy

### On Netlify:
1. Site settings → Environment variables
2. Add: `REACT_APP_API_URL` = `https://ecommerce-admin-lxhw.onrender.com`
3. Trigger deploy

## Quick Commands (Copy-Paste):
```bash
cd d:\mern_stack_project
git add .
git commit -m "Fix: Update API URLs for production deployment"
git push origin main
```

## Verify After Push:
1. Check GitHub - files updated ✓
2. Check Render - deployment started ✓
3. Wait 2-3 minutes
4. Test: https://ecommerce-shop-1osw.onrender.com/shop
5. Products should load! 🎉
