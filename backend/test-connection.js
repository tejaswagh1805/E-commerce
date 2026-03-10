// Quick test script to verify MongoDB connection and data
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-comm';

async function testConnection() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        console.log('URI:', MONGODB_URI);
        
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!\n');

        // Test Products
        const Product = require('./db/Product');
        const products = await Product.find();
        console.log(`📦 Products in database: ${products.length}`);
        if (products.length > 0) {
            console.log('   Sample product:', products[0].name);
        }

        // Test Orders
        const Order = require('./db/Order');
        const orders = await Order.find();
        console.log(`📋 Orders in database: ${orders.length}`);
        if (orders.length > 0) {
            console.log('   Sample order:', orders[0].orderId);
        }

        // Test Users
        const User = require('./db/User');
        const users = await User.find();
        console.log(`👥 Users in database: ${users.length}`);
        const admins = users.filter(u => u.role === 'admin');
        console.log(`   Admin users: ${admins.length}`);
        if (admins.length > 0) {
            console.log('   Admin email:', admins[0].email);
        }

        console.log('\n✅ All checks passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testConnection();
