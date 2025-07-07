import React, {useState} from 'react'
import axios from 'axios'
import useRazorpayPayment from '../../hooks/useRazorpayPayment.js';
import toast from 'react-hot-toast';

const RazorpayCheckout = ({amount, address, email}) => {
    const [hover,setHover] = useState(false);
    const startPayment = useRazorpayPayment();
    const handleClick = async () => {
    try {
        if (!address) {
            toast.error("Please enter a delivery address");
            return;
        }
      const message = await startPayment(amount, address, email);
    } catch (err) {
        console.error("Payment error : ", err);
    }
  };
  return (
    <button 
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    style={{
        backgroundColor : hover ? "white" : "blue",
        color : hover ? "blue" : "white",
        border : hover ? "1px solid blue" : "none",
        transition : "background-color 0.5s ease, color 0.5s ease",
        cursor : "pointer",
        width : "100%",
        height : "40px",
        borderRadius : "20px",
        fontFamily : "Cabin",
        fontSize : "1.1rem"

    }}onClick={ handleClick }>
      Proceed to Pay
    </button>
  )
}

export default RazorpayCheckout