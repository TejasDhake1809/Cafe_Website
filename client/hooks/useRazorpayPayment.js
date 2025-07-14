import axios from 'axios';
import { useCallback, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useRazorpayPayment = () => {
    const navigate = useNavigate();
    const pay = useCallback(async (amount,address,email) => {

            if (!address) {
                toast.error("Please enter a delivery address");
                return Promise.reject("No address");
            }

        return new Promise(async (resolve, reject) => {
            const toastId = toast.loading("🕐 Initiating payment...");
            try {
            const res = await axios.post('http://localhost:3000/api/payment/razorpay', {amount});
            const order = res.data;

             const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Your Brand",
                description: "UPI Payment",
                order_id: order.id,
                prefill: {
                name: email,
                email: email,
                contact: "9999999999"
                },
                theme: {
                color: "#00b386"
                },
                handler: async function (response) {
                    toast.loading("🧾 Verifying payment...", { id: toastId });
                    try {
                        const verifyRes = await axios.post('http://localhost:3000/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                            });
    
                            if (verifyRes.data.success) {
                                try {
                                    const ordercreation = await axios.post('http://localhost:3000/api/payment/create-order', {
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_signature: response.razorpay_signature,
                                        items : JSON.parse(localStorage.getItem("currentOrder")),
                                        price : (order.amount)/100,
                                        email : email,
                                        address : address,
                                        payment_type : "online",
                                    })
                                    if (ordercreation) {
                                        console.log(ordercreation);}
                                } catch (error) {
                                    toast.dismiss(toastId)
                                    console.log(error);
                                }
                                toast.success("✅ Online Payment verified!", {id : toastId});
                                const timer = setTimeout(() => {
                                toast.loading("Redirecting you to home page", {id : toastId});
                                setTimeout(() => {
                                    toast.dismiss(toastId);
                                    navigate('/');
                                }, 3000);
                                }, 1000);
                                resolve('Payment verified successfully!');
                            } else {
                                toast.error("❌ Payment verification failed", {id : toastId});
                                reject('Payment verification failed!');
                            }
                    } catch (error) {
                        toast.error("❌ Error verifying payment", {id : toastId});
                        reject("Error verifying payment");
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", (res) => {
                toast.error("❌ Payment failed: " + res.error.description, {id : toastId});
                reject("Payment failed");
            });
            } catch (error) {
                toast.error("❌ Failed to initiate payment", {id : toastId});
                console.error("failed to initiate payment", error);   
                reject("Init error");     
            }
        })
    },[]);
    return pay;
}

export default useRazorpayPayment;