import React, {useState} from 'react'
import axios from 'axios'
import useRazorpayPayment from '../../hooks/useRazorpayPayment.js';
import toast from 'react-hot-toast';

const RazorpayCheckout = ({amount, address, email}) => {
    const [hover,setHover] = useState(false);

    const [isDisabled, setIsDisabled] = useState(false);

    const startPayment = useRazorpayPayment();
    const handleClick = async () => {
      setIsDisabled(true);
    try {
        if (!address) {
            toast.error("Please enter a delivery address");
            setIsDisabled(false);
            return;
        }
      const message = await startPayment(amount, address, email);
    } catch (err) {
        console.error("Payment error : ", err);
        setIsDisabled(false);
    }
  };
  return (
    <button 
    disabled={isDisabled}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    style={{
                            backgroundColor: isDisabled 
                                ? "#cccccc" // greyed out background when disabled
                                : hover 
                                    ? "white" 
                                    : "blue",
                            color: isDisabled 
                                ? "#666666" // darker grey text when disabled
                                : hover 
                                    ? "blue" 
                                    : "white",
                            border: isDisabled 
                                ? "1px solid #cccccc" 
                                : hover 
                                    ? "1px solid blue" 
                                    : "none",
                            transition: "background-color 0.5s ease, color 0.5s ease",
                            cursor: isDisabled ? "not-allowed" : "pointer", // show not-allowed cursor
                            width: "100%",
                            height: "40px",
                            borderRadius: "20px",
                            fontFamily: "Cabin",
                            fontSize: "1.1rem",
                            opacity: isDisabled ? 0.6 : 1, // dim look when disabled
                        }}
    onClick={ handleClick }>
      Proceed to Pay
    </button>
  )
}

export default RazorpayCheckout