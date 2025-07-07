import React, {useState} from 'react'
import {PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';


const Checkout = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js has not loaded yet
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:5173' // where Stripe will redirect after UPI, Netbanking, etc.
            }
        });

        if (result.error) {
            setError(result.error.message);
            setLoading(false);
        }
    }

    
return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      <h2>Complete Your Payment</h2>

      <form onSubmit={handlePayment}>
        <PaymentElement /> {/* Stripe renders all payment options here */}
        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#635BFF',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
          }}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          ❌ {error}
        </p>
      )}
    </div>
  );


}

export default Checkout