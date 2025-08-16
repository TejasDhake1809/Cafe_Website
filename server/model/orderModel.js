import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    email: {type : String},
    address : {type : String},
    price : {type : Number},
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true }, // snapshot of product name
            price: { type: Number, required: true }, // snapshot of product price
            count: { type: Number, required: true }  // how many ordered
        }
    ],
    delivery_status : {type : String, default : "pending", enum: ["pending", "delivered", "cancelled"]},
    payment_type : {type : String, enum: ['cash', 'online']},
    cash_order_id : {type : Number},
    razorpay_order_id : {type : String},
    razorpay_payment_id : {type : String},
    razorpay_signature : {type : String },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

orderSchema.statics.createOrder = async function(email,address,price,items,delivery_status,payment_type,cash_order_id,razorpay_order_id,razorpay_payment_id,razorpay_signature,session) {
    if (razorpay_order_id) {  // only check if this id exists and is truthy
        const exists = await this.findOne({ razorpay_order_id }).session(session);
        if (exists) {
            throw Error("Order with this order_id exists");
        }
    }

    const order = await this.create([{email,address,price,items,delivery_status,payment_type,cash_order_id,razorpay_order_id,razorpay_payment_id,razorpay_signature}], {session});
    return order[0];
}

const order = mongoose.model('Order', orderSchema);
export default order;   