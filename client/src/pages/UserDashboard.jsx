import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import OrderCard from '../Components/OrderCard';

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);

  //base url for requests
  const baseUrl = import.meta.env.VITE_API_BASE_URL;  
  const { user } = useAuthContext();  

useEffect(() => {
  const fetchOrders = async () => {
    try {
      if (!user) return;

      const res = await axios.get(`${baseUrl}/api/orders/get-all-orders`, {
          params: { email: user.email },
        });
      setOrders(res.data);
      console.log("this is orders object",res.data);
    } catch (error) {
      console.error("Error in fetching orders : ", error);
    }
  }
  fetchOrders();
}, [user])

const handleOrderStatusChange = (orderId, newStatus) => {
  setOrders((prevOrders) =>
    prevOrders.map((o) =>
      o._id === orderId ? { ...o, delivery_status: newStatus } : o
    )
  );
};


  return (
    <div className="dashboard-container">
      <header className="user-dashboard-header">
        <div className="logo">
            <img src='/Cafe_logo.png' />
          <Link to="/"><h1>Cafe Velvet Roast</h1></Link>
        </div>
        <div className="user-profile">
          <span>Welcome, Alex!</span>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="order-section">
          <h2>Active Orders</h2>
          {orders.length > 0 ? (
            <div className="order-grid">
              {orders.filter(order => order.delivery_status === "pending" || order.delivery_status === "preparing").map(order => <OrderCard key={order._id} order={order} onStatusChange={handleOrderStatusChange} />)}
            </div>
          ) : (
            <p className="no-orders-message">You have no active orders.</p>
          )}
        </section>

        <section className="order-section">
          <h2>Past Orders</h2>
          {orders.length > 0 ? (
            <div className="order-grid">
              {orders.filter(order => order.delivery_status === "delivered").map(order => <OrderCard key={order._id} order={order}/>)}
            </div>
          ) : (
            <p className="no-orders-message">You have no past orders.</p>
          )}
        </section>

        <section className="order-section">
          <h2>Cancelled Orders</h2>
          {orders.length > 0 ? (
            <div className="order-grid">
              {orders.filter(order => order.delivery_status === "cancelled").map(order => <OrderCard key={order._id} order={order} />)}
            </div>
          ) : (
            <p className="no-orders-message">You have no past orders.</p>
          )}
        </section>
      </main>
    </div>
  );
}
