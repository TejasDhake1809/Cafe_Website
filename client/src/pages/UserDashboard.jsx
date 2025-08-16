import React, { useState } from 'react';
import './UserDashboard.css'; // Import the external CSS file
import { Link } from 'react-router-dom';

// --- Mock Data ---
const initialActiveOrders = [
  {
    id: '#A58B',
    items: [
      { name: 'Iced Caramel Macchiato', quantity: 1 },
      { name: 'Almond Croissant', quantity: 2 },
    ],
    status: 'Preparing',
    total: 14.75,
  },
  {
    id: '#A58C',
    items: [
      { name: 'Classic Cappuccino', quantity: 1 },
    ],
    status: 'Ready for Pickup',
    total: 4.50,
  },
];

const initialPastOrders = [
  {
    id: '#A581',
    items: [
      { name: 'Espresso', quantity: 2 },
      { name: 'Blueberry Muffin', quantity: 1 },
    ],
    status: 'Completed',
    date: '2024-08-14',
    total: 9.25,
  },
  {
    id: '#A575',
    items: [
      { name: 'Matcha Green Tea Latte', quantity: 1 },
      { name: 'Pain au Chocolat', quantity: 1 },
    ],
    status: 'Completed',
    date: '2024-08-12',
    total: 8.50,
  },
  {
    id: '#A572',
    items: [
        { name: 'Cold Brew', quantity: 1 },
        { name: 'Everything Bagel', quantity: 1 },
    ],
    status: 'Completed',
    date: '2024-08-11',
    total: 7.75,
  }
];

// --- Order Card Component ---
const OrderCard = ({ order }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Preparing': return 'status-preparing';
      case 'Ready for Pickup': return 'status-ready';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="order-card">
      <div className="card-header">
        <h3>Order {order.id}</h3>
        <div className={`status-badge ${getStatusClass(order.status)}`}>
          {order.status}
        </div>
      </div>
      <div className="card-body">
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              <span className="item-quantity">{item.quantity}x</span>
              <span className="item-name">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        {order.date && <span className="order-date">Date: {order.date}</span>}
        <span className="order-total">Total: ${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function UserDashboard() {
  const [activeOrders] = useState(initialActiveOrders);
  const [pastOrders] = useState(initialPastOrders);

  return (
    <div className="dashboard-container">
      <header className="user-dashboard-header">
        <div className="logo">
            <img src='/Cafe_logo.png' />
          <Link to="/"><h1>The Daily Grind</h1></Link>
        </div>
        <div className="user-profile">
          <span>Welcome, Alex!</span>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="order-section">
          <h2>Active Orders</h2>
          {activeOrders.length > 0 ? (
            <div className="order-grid">
              {activeOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          ) : (
            <p className="no-orders-message">You have no active orders.</p>
          )}
        </section>

        <section className="order-section">
          <h2>Past Orders</h2>
          {pastOrders.length > 0 ? (
            <div className="order-grid">
              {pastOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          ) : (
            <p className="no-orders-message">You have no past orders.</p>
          )}
        </section>
      </main>
    </div>
  );
}
