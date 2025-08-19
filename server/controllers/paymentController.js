import dotenv from 'dotenv';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import Crypto from 'crypto';
import Order from '../model/orderModel.js';
import Counter from '../model/counterModel.js';
import mongoose from 'mongoose';
import Product from '../model/productModel.js';
import { sendEmail } from "../utils/email.js";

dotenv.config();

const razorpay = new Razorpay({
        key_id : process.env.VITE_RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_KEY_SECRET,
    });

const paymentGate = async(req,res) => {
    const {amount} = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount : amount*100,
            currency : 'inr',
            automatic_payment_methods: {
                enabled : true,
            }
        });
        res.send({
            client_secret : paymentIntent.client_secret,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json("Error creating payment intent");
    }
    // console.log("paymentIntent");
}   

const paymentRazorpay = async (req,res) => {
    const {amount} = req.body;
    try {
        const order = await razorpay.orders.create({
            amount : amount*100,
            currency : "INR",
            payment_capture : 1
        });
        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({error : "Bro razorpay failed"})
    }
}

const paymentVerify = async (req,res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

    const sign = razorpay_order_id  + "|" + razorpay_payment_id;
    const expectedSignature = Crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.json ({success : true});
    } else {
        res.status(400).json({success : false});
    }
}

const addOrder = async (req,res) => {

    const {email,address,price,items,delivery_status,payment_type,cash_order_id,razorpay_order_id,razorpay_payment_id,razorpay_signature } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order = await Order.createOrder(email,address,price,items,delivery_status,payment_type,cash_order_id,razorpay_order_id,razorpay_payment_id,razorpay_signature,session);
        
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Order not created" });
        }

        const updateCount = await Promise.all (
            items.map(async (item) => {
                try {
                    const result = await Product.updateItemOrderCount(item.productId,item.count,session);
                    return result;
                } catch (error) {
                    console.error(`Failed to update count for product ${productId}:`, error.message);
                    throw error;
                }
            })
        )
            await session.commitTransaction();
            session.endSession();


        //sending mail of order
        await sendEmail({
    to: email,
    subject: "Your Cafe Velvet Roast Order Confirmation",
    text: `Your order has been placed successfully! Thank you for your order! Order ID: ${order._id}, Total: ₹${order.price}`,
    html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f8f8; padding: 20px; border-radius: 8px; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td align="center" style="background-color: #6F4E37; padding: 25px 20px; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: bold; line-height: 1.2;">
                                ☕ Order Confirmation from Cafe Velvet Roast! ☕
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 18px; color: #333333; margin-top: 0; margin-bottom: 20px; line-height: 1.6;">
                                Dear Customer,
                            </p>
                            <p style="font-size: 18px; color: #333333; margin-bottom: 20px; line-height: 1.6;">
                                Thank you for your recent order with <strong style="color: #6F4E37;">Cafe Velvet Roast</strong>! We're thrilled to prepare your delicious items.
                                Your order has been successfully placed and is being processed.
                            </p>
                            
                            <h3 style="font-size: 22px; color: #6F4E37; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #D2B48C; padding-bottom: 10px;">
                                Order Details:
                            </h3>
                            <p style="font-size: 16px; color: #555555; margin-bottom: 10px;">
                                <strong style="color: #333333;">Order ID:</strong> <span style="font-weight: normal;">${order._id}</span>
                            </p>
                            <p style="font-size: 16px; color: #555555; margin-bottom: 10px;">
                                <strong style="color: #333333;">Delivery Address:</strong> <span style="font-weight: normal;">${order.address}</span>
                            </p>

                            <h3 style="font-size: 22px; color: #6F4E37; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #D2B48C; padding-bottom: 10px;">
                                Items Ordered:
                            </h3>
                            <div style="margin-bottom: 20px;">
                                ${order.items.map(item => `
                                    <p style="font-size: 16px; color: #555555; margin-bottom: 5px;">
                                        <strong style="color: #333333;">${item.name}</strong> x ${item.count} - ₹${item.price.toFixed(2)} each
                                    </p>
                                `).join('')}
                            </div>

                            <p style="font-size: 16px; color: #555555; margin-bottom: 20px;">
                                <strong style="color: #333333;">Total Amount:</strong> <span style="font-size: 20px; font-weight: bold; color: #E67E22;">₹${order.price}</span>
                            </p>

                            <p style="font-size: 18px; color: #333333; margin-top: 30px; line-height: 1.6;">
                                We appreciate your business and look forward to serving you!
                            </p>
                            <p style="font-size: 16px; color: #6F4E37; margin-top: 25px; margin-bottom: 0;">
                                Warmly, <br>
                                The Cafe Velvet Roast Team
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #F5DEB3; padding: 20px; font-size: 14px; color: #6F4E37; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Cafe Velvet Roast. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </div>
    `,
    }).catch((err) => console.error("Email sending failed:", err.message));
        return res.status(200).json(order);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json(error.message);
    }
}

const getNextSequence = async (req,res) => {
    try {
        const nextSeq = await Counter.getNextSequence('cashOrderId');
        return res.status(200).json(nextSeq);
    } catch (error) {
        console.error ("Couldnt get next sequence for cash order");
        return res.status(500).json({error : "failed to get sequence number"});
    }
}

export {paymentGate, paymentRazorpay, paymentVerify, addOrder, getNextSequence};
