import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = import.meta.env.VITE_API_BASE_URL;  
const OrderCard = ({ order, onStatusChange }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'preparing' : return 'status-preparing'
      case 'delivered': return 'status-ready';
      case 'cancelled': return 'status-completed';
      default: return '';
    }
  };


  //creates invoice using pdfkit and stores in blob object
  const downloadInvoice = async (orderId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/orders/${orderId}/invoice`,
      { responseType: "blob" } // ensures we get binary
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${orderId}.pdf`; //temporary url
    document.body.appendChild(a);
    a.click(); //clicks the download link
    a.remove();
    window.URL.revokeObjectURL(url); //removing temporary url
  } catch (error) {
    toast.error("Error downloading invoice");
    console.error(error);
  }
};

const handleClick = async (orderId) => {
  try {
    const res = await axios.patch(`${baseUrl}/api/orders/update-status/${orderId}`, {
      delivery_status: "cancelled"
    });

    if (res) {
      toast.success("Order status updated successfully");
      // ✅ notify parent to update state
      if (typeof onStatusChange === "function") {
        onStatusChange(orderId, "cancelled");
      }
    }
  } catch (error) {
    toast.error("Error in updating order status");
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
        
        {/* cross button */}
        {order.delivery_status === "pending" && <button className="close-btn" onClick={() => handleClick(order._id)}>
          <img 
            className='image' 
            src="https://img.icons8.com/?size=100&id=63688&format=png&color=000000" 
            alt="close" 
          />
        </button>}

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
        {order.delivery_status !== "cancelled" && <span> <button className='order-invoice' onClick={() => downloadInvoice(order._id)}>Invoice</button> </span>} 
      </div>
    </div>
  );
};

export default OrderCard