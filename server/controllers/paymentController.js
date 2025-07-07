import dotenv from 'dotenv';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import Crypto from 'crypto';
import Order from '../model/orderModel.js';
import Counter from '../model/counterModel.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    try {
        const order = await Order.createOrder(email,address,price,items,delivery_status,payment_type,cash_order_id,razorpay_order_id,razorpay_payment_id,razorpay_signature);
        if (order) {
            return res.status(200).json(order);
        }
    } catch (error) {
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
