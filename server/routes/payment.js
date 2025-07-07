import express from 'express';
import {paymentGate , paymentRazorpay, paymentVerify, addOrder, getNextSequence } from '../controllers/paymentController.js'


const router = express.Router();

//create-payment-intent - stripe
router.post('/create-payment-intent', paymentGate);

//razorpay-thing
router.post('/razorpay', paymentRazorpay);

//verify razorpay payment
router.post('/verify', paymentVerify)

//post an order
router.post('/create-order', addOrder);

//get next sequence for cash order
router.post('/next-sequence', getNextSequence)

export default router;