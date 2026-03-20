# 📧 SendGrid Setup for Render (Email Fix)

## Why SendGrid?

Render's free tier **blocks SMTP ports** (25, 465, 587) to prevent spam. Gmail SMTP won't work.
SendGrid uses **HTTP API** instead of SMTP, so it works perfectly on Render!

**Free Tier:** 100 emails/day (enough for testing)

---

## Step 1: Create SendGrid Account

1. Go to: https://signup.sendgrid.com/
2. Sign up with your email
3. Verify your email address
4. Complete the onboarding (select "Web App" as integration)

---

## Step 2: Create API Key

1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **"Create API Key"**
3. Name: `E-commerce App`
4. Permission: **Full Access**
5. Click **"Create & View"**
6. **COPY THE API KEY** (starts with `SG.`) - you won't see it again!

Example: `SG.abc123xyz789...`

---

## Step 3: Verify Sender Email

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **"Create New Sender"**
3. Fill in your details:
   - From Name: `E-commerce Store`
   - From Email: `tejaswaghmode18@gmail.com`
   - Reply To: `tejaswaghmode18@gmail.com`
   - Company Address: (any address)
4. Click **"Create"**
5. Check your email and **verify the sender**

---

## Step 4: Add to Render Environment Variables

1. Go to: https://dashboard.render.com
2. Click on **E-commerce** (backend service)
3. Go to **Environment** tab
4. Add these variables:

```
SENDGRID_API_KEY = SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL = tejaswaghmode18@gmail.com
```

5. Click **"Save Changes"**
6. Wait 2-3 minutes for auto-redeploy

---

## Step 5: Deploy Code

```bash
cd backend
git add .
git commit -m "Add SendGrid email support for Render"
git push origin dev_tejas
```

---

## Step 6: Test

1. Visit: https://ecommerce-shop-1osw.onrender.com
2. Place a test order
3. Check Render logs - should see:
   ```
   ✅ Using SendGrid for email delivery
   ✅ Email sent via SendGrid!
   ```
4. Check your email inbox!

---

## Troubleshooting

### "Sender email not verified"
- Go to SendGrid → Settings → Sender Authentication
- Verify your email address

### "API Key invalid"
- Make sure you copied the full API key (starts with `SG.`)
- No spaces or quotes in the environment variable

### "Daily sending limit exceeded"
- Free tier: 100 emails/day
- Upgrade to paid plan or wait 24 hours

---

## Local Testing

To test locally, add to `backend/.env`:

```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=tejaswaghmode18@gmail.com
```

Then restart backend:
```bash
cd backend
node index.js
```

---

## Cost

- **Free Tier:** 100 emails/day forever
- **Essentials:** $19.95/month for 50,000 emails
- **Pro:** $89.95/month for 100,000 emails

For your e-commerce store, free tier should be enough for testing!

---

## Alternative: Resend (Even Easier!)

If SendGrid is too complex, try **Resend**:
- Free: 100 emails/day
- Simpler setup
- Better for developers
- https://resend.com

Let me know if you want Resend setup instead!
