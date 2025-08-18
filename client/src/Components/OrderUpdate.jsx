import React, { useState } from 'react'
import './OrderUpdate.css'
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderUpdate = (props) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [dstatus, setDStatus] = useState(props.delivery_status);
  const handleClick = async () => {
      try {
        console.log("this is dstatus",dstatus);
        const res = await axios.patch(`${baseUrl}/api/orders/update-status/${props.id}`, {
          delivery_status : dstatus
        });
        if (res) {
          toast.success("Order status updated successfully");
          console.log("this is res.data",res.data);
          // props.onStatusChange(props.id, dstatus);
        }
      } catch (error) {
        toast.error("Error in updating order status");
        console.error(error);
      }
  }

// OrderUpdate.jsx (frontend)
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
    <tr>
        <td>{props.cash_order ? props.cash_order : props.online_order}</td>
        <td>{props.email}</td>
        <td>{props.amount}</td>
        <td>{props.payment_type}</td>

        <td>
          <select value={dstatus} onChange={(e) => setDStatus(e.target.value)} className={`status-update status ${dstatus}`}> 
              <option value="pending">pending</option> 
              <option  value="delivered">delivered</option>  
              <option value="preparing">preparing</option>
              <option value="cancelled">cancelled</option>      
            </select>
        </td>

       <td>{new Date(props.date).toLocaleDateString()}</td>
        <td> {props.delivery_status !== "cancelled" && <button className='update' onClick={() => downloadInvoice(props.id)}> <img className='image' src="https://img.icons8.com/?size=100&id=6ybQ6Vq2SHjV&format=png&color=000000"></img> </button> } </td>
        <td> 
          {props.delivery_status !== "cancelled" && <button className='update' onClick={handleClick}> <img className='image round' src="https://img.icons8.com/?size=100&id=63262&format=png&color=000000" alt="tick icon" /> </button>}
          {props.delivery_status !== "cancelled" && <img className='image' src="https://img.icons8.com/?size=100&id=63688&format=png&color=000000"></img>} 
            
        </td>
    </tr>
  )
}

export default OrderUpdate