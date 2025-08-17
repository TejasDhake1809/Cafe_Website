import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';


const baseUrl = import.meta.env.VITE_API_BASE_URL;  
const OrderCard = ({ order }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-preparing';
      case 'delivered': return 'status-ready';
      case 'cancelled': return 'status-completed';
      default: return '';
    }
  };

  const downloadInvoice = async (orderId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/orders/${orderId}/invoice`,
      { responseType: "blob" } // ensures we get binary
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // cleanup
  } catch (error) {
    toast.error("Error downloading invoice");
    console.error(error);
  }
};


  return (
    <div className="order-card">
      <div className="card-header">
        <h3>Order {order._id}</h3>
        <div className={`status-badge ${getStatusClass(order.delivery_status)}`}>
          {order.delivery_status}
        </div>
      </div>
      <div className="card-body">
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              <span className="item-quantity">{item.count}x</span>
              <span className="item-name">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        {order.createdAt && <span className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</span>}
        <span className="order-total">Total: Rs {order.price.toFixed(2)} </span>
        <span> <button className='order-invoice' onClick={() => downloadInvoice(order._id)}>Invoice</button> </span> 
      </div>
    </div>
  );
};

export default OrderCard