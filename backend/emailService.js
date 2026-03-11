const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 for Gmail SMTP (Render IPv6 issue fix)
dns.setDefaultResultOrder('ipv4first');

// Create transporter with fallback to Ethereal (test email service)
let transporter;

const createTransporter = async () => {
    console.log('🔧 Creating email transporter...');
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Use real email if configured
        console.log('✅ Using Gmail SMTP with:', process.env.EMAIL_USER);
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            // Force IPv4
            family: 4
        });
    } else {
        // Use Ethereal for testing (no setup required)
        console.log('⚠️ Email credentials not found, using Ethereal test service');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('📧 Using Ethereal test email service');
        console.log('📧 Email credentials:', testAccount.user, testAccount.pass);
    }
    return transporter;
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (orderData) => {
    try {
        console.log('📧 === EMAIL SENDING STARTED ===');
        console.log('📧 Recipient:', orderData.email);
        console.log('📧 Order ID:', orderData.orderId);
        
        // Ensure transporter is created
        if (!transporter) {
            console.log('🔧 Transporter not initialized, creating now...');
            await createTransporter();
        }

        const { email, customerName, orderId, products, totalAmount, shippingAddress, couponCode, discount, subtotal } = orderData;

        const productList = products.map(item => {
            const itemTotal = item.price * item.quantity;
            const itemDiscount = item.discount || 0;
            const originalPrice = itemDiscount > 0 ? (item.price / (1 - itemDiscount / 100)).toFixed(0) : item.price;
            
            return `<tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong>
                    ${item.selectedSize ? `<br><small style="color: #666;">Size: ${item.selectedSize}</small>` : ''}
                    ${item.selectedColor ? `<br><small style="color: #666;">Color: ${item.selectedColor}</small>` : ''}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                    ${itemDiscount > 0 ? `<span style="text-decoration: line-through; color: #999; font-size: 12px;">₹${originalPrice}</span><br>` : ''}
                    ₹${item.price}
                    ${itemDiscount > 0 ? `<br><span style="color: #388e3c; font-size: 11px;">${itemDiscount}% OFF</span>` : ''}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${itemTotal}</td>
            </tr>`;
        }).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@yourstore.com',
            to: email,
            subject: `Order Confirmation - ${orderId}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
                        .order-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        .products-table th { background: #FF6B9D; color: white; padding: 12px; text-align: left; }
                        .total { font-size: 20px; font-weight: bold; color: #FF6B9D; text-align: right; margin-top: 20px; }
                        .footer { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px; }
                        .button { display: inline-block; background: #FF6B9D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">🎉 Order Confirmed!</h1>
                            <p style="margin: 10px 0 0 0;">Thank you for your purchase</p>
                        </div>
                        
                        <div class="content">
                            <p>Hi <strong>${customerName}</strong>,</p>
                            <p>Your order has been successfully placed and is being processed. We'll send you another email when your order ships.</p>
                            
                            <div class="order-details">
                                <h3 style="margin-top: 0; color: #FF6B9D;">Order Details</h3>
                                <p><strong>Order ID:</strong> ${orderId}</p>
                                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p><strong>Status:</strong> <span style="color: #FFA000;">Pending</span></p>
                            </div>

                            <h3 style="color: #FF6B9D;">Products Ordered</h3>
                            <table class="products-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th style="text-align: center;">Qty</th>
                                        <th style="text-align: right;">Price</th>
                                        <th style="text-align: right;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productList}
                                </tbody>
                            </table>

                            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666;">Subtotal:</td>
                                        <td style="padding: 8px 0; text-align: right; font-weight: bold;">₹${subtotal || totalAmount}</td>
                                    </tr>
                                    ${couponCode ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #666;">
                                            Coupon Applied: <span style="background: #fff5f8; color: #FF6B9D; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${couponCode}</span>
                                        </td>
                                        <td style="padding: 8px 0; text-align: right; color: #388e3c; font-weight: bold;">-₹${discount || 0}</td>
                                    </tr>` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #666;">Shipping:</td>
                                        <td style="padding: 8px 0; text-align: right; color: #388e3c; font-weight: bold;">FREE</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666;">Tax (GST 18%):</td>
                                        <td style="padding: 8px 0; text-align: right; font-weight: bold;">₹${(totalAmount * 0.18).toFixed(2)}</td>
                                    </tr>
                                    <tr style="border-top: 2px solid #FF6B9D;">
                                        <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #212121;">Total Amount:</td>
                                        <td style="padding: 12px 0; text-align: right; font-size: 20px; font-weight: bold; color: #FF6B9D;">₹${(totalAmount * 1.18).toFixed(2)}</td>
                                    </tr>
                                </table>
                            </div>

                            ${couponCode ? `
                            <div style="background: #fff5f8; border-left: 4px solid #FF6B9D; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #388e3c; font-weight: bold;">🎉 You saved ₹${discount || 0} with coupon code "${couponCode}"!</p>
                            </div>` : ''}

                            <div class="order-details">
                                <h3 style="margin-top: 0; color: #FF6B9D;">Shipping Address</h3>
                                <p>${shippingAddress.address}<br>
                                ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br>
                                ${shippingAddress.country}</p>
                            </div>

                            <div style="text-align: center;">
                                <a href="http://localhost:3000/orders" class="button">Track Your Order</a>
                            </div>

                            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                                If you have any questions about your order, please contact our customer support at 
                                <a href="mailto:support@yourstore.com" style="color: #FF6B9D;">support@yourstore.com</a>
                            </p>
                        </div>

                        <div class="footer">
                            <p style="margin: 0; color: #666;">Thank you for shopping with us! 🛒</p>
                            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        
        // If using Ethereal, log preview URL
        if (!process.env.EMAIL_USER) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('📧 Preview email: ' + previewUrl);
        }
        
        console.log(`✅ Order confirmation email sent to ${email}`);
        console.log('📧 === EMAIL SENDING COMPLETED ===');
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ === EMAIL SENDING FAILED ===');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);
        console.error('❌ Full error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendOrderConfirmationEmail };
