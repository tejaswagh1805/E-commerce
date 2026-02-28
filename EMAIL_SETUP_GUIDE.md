# 📧 Email Notification Setup Guide

## ✅ What's Been Added

Order confirmation emails are now automatically sent to customers when they place an order!

### Email Features:
- ✅ Professional HTML email template
- ✅ Order details (Order ID, Date, Status)
- ✅ Product list with quantities and prices
- ✅ Total amount
- ✅ Shipping address
- ✅ Track order button
- ✅ Branded design with pink theme

---

## 🔧 Setup Instructions

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. **Create .env file in backend folder**
   ```bash
   cd backend
   touch .env
   ```

4. **Add credentials to .env**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

5. **Restart backend server**
   ```bash
   nodemon index.js
   ```

---

### Option 2: Outlook/Hotmail

1. **Create .env file**
   ```
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASS=your-password
   ```

2. **Update emailService.js**
   Change service from 'gmail' to 'outlook':
   ```javascript
   const transporter = nodemailer.createTransport({
       service: 'outlook',
       auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS
       }
   });
   ```

---

### Option 3: Custom SMTP (Production)

For production, use services like:
- SendGrid
- Mailgun
- AWS SES
- Postmark

Example with custom SMTP:
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.yourprovider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
```

---

## 🧪 Testing

### Test Order Flow:

1. **Place an order** from customer site
2. **Check console** - Should see: "Order confirmation email sent to customer@email.com"
3. **Check customer's email inbox**
4. **Email should contain:**
   - Order confirmation message
   - Order ID
   - Product details
   - Total amount
   - Shipping address
   - Track order button

---

## 📧 Email Template Preview

The email includes:
- **Header**: Pink gradient with "Order Confirmed!" message
- **Order Details**: Order ID, Date, Status
- **Products Table**: Product name, quantity, price, total
- **Total Amount**: Bold and highlighted
- **Shipping Address**: Full address details
- **Track Order Button**: Links to orders page
- **Footer**: Support contact and branding

---

## 🐛 Troubleshooting

### Email not sending?

1. **Check console for errors**
   ```
   Email sending error: Invalid login
   ```

2. **Verify credentials in .env**
   - Make sure EMAIL_USER and EMAIL_PASS are correct
   - For Gmail, use App Password, not regular password

3. **Check spam folder**
   - First emails might go to spam

4. **Test email service**
   ```javascript
   // Add this test endpoint in index.js
   app.get('/test-email', async (req, res) => {
       const result = await sendOrderConfirmationEmail({
           email: 'test@example.com',
           customerName: 'Test User',
           orderId: 'TEST-123',
           products: [{ name: 'Test Product', quantity: 1, price: 100 }],
           totalAmount: 100,
           shippingAddress: {
               address: 'Test Address',
               city: 'Test City',
               state: 'Test State',
               pincode: '123456',
               country: 'India'
           }
       });
       res.json(result);
   });
   ```

### Gmail "Less secure app" error?

- Gmail no longer supports "less secure apps"
- You MUST use App Password (see Option 1 above)

### Email goes to spam?

- Add SPF and DKIM records (for production)
- Use a verified domain email
- Warm up your email sender reputation

---

## 🚀 Production Recommendations

For production deployment:

1. **Use professional email service**
   - SendGrid (12,000 free emails/month)
   - Mailgun (5,000 free emails/month)
   - AWS SES (62,000 free emails/month)

2. **Add email templates**
   - Order confirmation
   - Order shipped
   - Order delivered
   - Order cancelled
   - Password reset
   - Welcome email

3. **Add email queue**
   - Use Bull or Bee-Queue
   - Retry failed emails
   - Track email status

4. **Monitor email delivery**
   - Track open rates
   - Track click rates
   - Handle bounces

---

## 📝 Files Modified

1. **backend/emailService.js** (NEW)
   - Email sending logic
   - HTML email template
   - Order confirmation function

2. **backend/index.js**
   - Import email service
   - Call sendOrderConfirmationEmail in /place-order route

3. **backend/.env.example** (NEW)
   - Email configuration template

4. **backend/package.json**
   - Added nodemailer dependency

---

## 🎯 Next Steps

Optional enhancements:

1. **Add more email templates**
   - Order shipped notification
   - Order delivered notification
   - Order cancelled notification

2. **Add email preferences**
   - Let users opt-in/opt-out
   - Choose notification types

3. **Add SMS notifications**
   - Use Twilio for SMS
   - Send order updates via SMS

4. **Add push notifications**
   - Use Firebase Cloud Messaging
   - Browser push notifications

---

## ✅ Summary

Email notifications are now working! Customers will receive a professional order confirmation email immediately after placing an order.

**To activate:**
1. Create `.env` file in backend folder
2. Add your email credentials
3. Restart backend server
4. Place a test order

**Email will be sent automatically!** 📧🎉
