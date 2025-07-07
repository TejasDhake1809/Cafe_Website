import React, {useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './OrderReview.css'
import OrderNavBar from '../Components/OrderNavBar';
import OrderChecklist from '../Components/OrderChecklist';
import axios from 'axios';
import RazorpayCheckout from '../Components/RazorpayCheckout';
import {useAuthContext} from '../../hooks/useAuthContext.js';
import toast from 'react-hot-toast';


const OrderReview = () => {
    const navigate = useNavigate();
    const {user} = useAuthContext();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const[products, setProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const[ address, setAddress] = useState("");
    const [hover,setHover] = useState(false);
    const [totalAmount, setTotalAmount] = useState(20); 


    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleClick = async () => {
        const toastId = toast.loading("Creating Order");
        try {
            if (!user || !user.email) {
                toast.error("Please log in to continue", {id : toastId});
                return;
            }

            if (!order) {
                toast.error("Order is missing", {id : toastId});
                return;
            }

            if (!address) {
                    toast.error("Please enter a delivery address", {id : toastId});
                    return;
            }
            const seqRes = await axios.post("http://localhost:3000/api/payment/next-sequence");
            const nextSeq = seqRes.data;

            console.log(nextSeq);
            if(nextSeq){
                const res = await axios.post("http://localhost:3000/api/payment/create-order", {
                email : user.email,
                address : address,
                price : totalAmount,
                items : order.counts,
                payment_type : 'cash',
                cash_order_id : nextSeq
            })

                if (res) {
                    console.log(res);
                    toast.success("Cash order successfully created", {id : toastId});

                    const timer = setTimeout(() => {
                    toast.loading("Redirecting you to home page", {id : toastId});
                    setTimeout(() => {
                        toast.dismiss(toastId);
                        navigate('/');
                    }, 3000);
                    }, 1000);
                }
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (location.state) {
            console.log("this is before setOrder location block", location.state);
            setOrder(location.state);
        } else {
            const savedOrder = localStorage.getItem("currentOrder");
            if (savedOrder) {
                console.log("this is before setOrder localstorage block", savedOrder);
                setOrder(JSON.parse(savedOrder))
            }  else {
                console.log("Order data was not saved, try again");
            }
        }

        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/items');
                if (res) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error("error in fetching items", error);
            }
        }

        fetchProducts();
    }, [])

    useEffect(() => {
        if (order && products.length > 0) {
            let sum = 20; // base delivery fee
            Object.entries(order.counts).forEach(([productId, quantity]) => {
                const product = products.find(p => p._id === productId);
                if (product) {
                    sum += quantity * product.price;
                }
            });
            setTotalAmount(sum);
        }
    }, [order, products]); // recalculate totalAmount when these change


    
  return (
    <>
        <OrderNavBar />

        <div className="order-review-title">
            <p>Review your order</p>
        </div>

        <div className="order-review-grid">
            <div className="payment-methods">
                {/* {clientSecret && <Elements options={{clientSecret}} stripe = {stripePromise}>
                    <StripeCheckout />
                </Elements>} */}
                <h3>Select a payment method :</h3>
                <div className = "radio-buttons">


                    <label style={{ marginRight: '20px' }}>
                        <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={selectedOption === 'razorpay'}
                        onChange={handleChange}
                        />
                        Pay by card, netbanking, UPI and more
                        <span> <img src="/razorpaylogo.png" style={{height : "40px", width : "60px"}}></img>
                                <img src="/visalogo.png" style={{height : "40px", width : "60px"}}></img>    
                                <img src="/mastercard.png" style={{height : "40px", width : "60px"}}></img>    
                        </span>
                    </label>

                    <label>
                        <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={selectedOption === 'cash'}
                        onChange={handleChange}
                        />
                        Cash on delivery
                        <span> <img src="https://img.icons8.com/?size=100&id=KV6GFslVNJhZ&format=png&color=000000" style={{height : "60px", width : "60px"}}></img>   
                        </span>
                    </label>
                </div>

                <h3>Fulfillment Details</h3>
                <div className="fulfillment-details">
                    <span> <img src="https://img.icons8.com/?size=100&id=6M1qqDqQTtRd&format=png&color=000000" style={{height : "30px", width : "30px"}}></img> </span>
                    <span>Delivery in around 30 min</span>
                </div>

                <h3>Delivery Address</h3>
                <div className="deliveryaddress">
                    <input type='string' required placeholder='Enter delivery address' value={address} onChange={(e) => setAddress(e.target.value)}></input>
                </div>

                {selectedOption==="razorpay" && <div className="razorpaycheckoutelement">
                    <RazorpayCheckout amount={totalAmount} address={address} email={user.email} />
                </div>}

                {selectedOption==="cash" && <div className="paybycash">
                    <button 
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        style={{
                            backgroundColor : hover ? "white" : "#08ccbc",
                            color : hover ? "#08ccbc" : "white",
                            border : hover ? "1px solid #08ccbc" : "none",
                            transition : "background-color 0.5s ease, color 0.5s ease",
                            cursor : "pointer",
                            width : "100%",
                            height : "40px",
                            borderRadius : "20px",
                            fontFamily : "Cabin",
                            fontSize : "1.1rem"

                        }}
                        onClick={handleClick}
                        >
                        Proceed to Pay
                    </button>
                </div> }
                

            </div>

            <div className="order-review-total">
                <p style={{marginLeft : "20px", fontSize : "1.3rem", fontFamily : "Cabin", fontWeight : "700"}}>Basket</p>

                {order && Object.entries(order.counts).map(([productId, quantity],index) => {   
                    const product = products.find(p => p._id === productId);
                    
                    if (!product) {
                        console.log("No product found while comparing to counts");
                        return null;
                    } 

                    return (
                        <OrderChecklist 
                            key ={index}
                            quantity = {quantity}
                            price = {product.price}
                            name = {product.name} />
                    )
                        
                })}

                <div className="order-extra">
                     <span>Subtotal </span>
                     <span>₹{totalAmount - 20}</span>
                </div>

                <div className="order-extra">
                    <span>Delivery Fee </span>
                    <span>₹20</span>
                </div>

                <div className="divider-line"></div>

                <div className="order-total order-extra">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>

            </div>
        </div>
    </>
  )
  
}

export default OrderReview