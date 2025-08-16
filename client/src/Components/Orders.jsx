import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import OrderUpdate from './OrderUpdate';

const Orders = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [ordersClassName, setOrdersClassName] = useState('');
  const [revenueClassName, setRevenueClassName] = useState('');
  const [aovClassName, setAovClassName] = useState('');
  const [sortDescending,setSortDescending] = useState(true);
  const [tableSorter,setTableSorter] = useState('');
  const [stats, setStats] = useState({
    totalOrders : 0,
    totalRevenue : 0,
    averageOrderValue : 0,
    percentPending : 0,
    orders : []
  })

  const fetchStats = async (timeframe, field) => {
    try {
      const res = await axios.get(`${baseUrl}/api/orders/stats`, {
        params: { timeframe: timeframe || 'All' }
      });
      if (res.data) {
        setStats(prev => ({
          ...prev,
          [field]: res.data[field] ?? prev[field] // use previous if undefined
        }));
      }
    } catch (error) {
      toast.error(`Failed to fetch ${field} data`);
    }
  };

  // Fetch individual fields based on their state changes
  useEffect(() => { fetchStats(ordersClassName, 'totalOrders'); }, [ordersClassName]);
  useEffect(() => { fetchStats(revenueClassName, 'totalRevenue'); }, [revenueClassName]);
  useEffect(() => { fetchStats(aovClassName, 'averageOrderValue'); }, [aovClassName]);
  useEffect(() => { fetchStats(null, 'percentPending'); }, []); // fetch only once
  useEffect(() => { fetchStats(tableSorter, 'orders');}, [tableSorter]); //fetching all orders in a timeframe

  const handleClick = (type, value) => {
    if (type === 'orders') {
      setOrdersClassName(prev => (prev === value ? '' : value));
    } else if (type === 'revenue') {
      setRevenueClassName(prev => (prev === value ? '' : value));
    } else if (type === 'aov') {
      setAovClassName(prev => (prev === value ? '' : value));
    } else if (type === 'allOrders') {
      setTableSorter(prev => (prev === value ? '' : value));
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-stats">
        {/* Orders Card */}
        <div className="orders-stats-div flexbox-horizontal image-size">
          <img src="https://img.icons8.com/?size=100&id=47602&format=png&color=000000" alt="orders icon" />
          <div className="stats">
            <div className="duration-filters">
              <button
                onClick={() => handleClick('orders', 'Today')}
                className={`duration-filters-button ${ordersClassName === 'Today' ? 'active' : ''}`}
              >
                Today
              </button>
              <button
                onClick={() => handleClick('orders', 'Weekly')}
                className={`duration-filters-button ${ordersClassName === 'Weekly' ? 'active' : ''}`}
              >
                Weekly
              </button>
              <button
                onClick={() => handleClick('orders', 'Monthly')}
                className={`duration-filters-button ${ordersClassName === 'Monthly' ? 'active' : ''}`}
              >
                Monthly
              </button>
            </div>
            <span className="number-font">{stats.totalOrders}</span>
            <span>{`Orders ${ordersClassName ? ordersClassName : "All Time"}`}</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="orders-stats-div flexbox-horizontal image-size">
          <img src="https://img.icons8.com/?size=100&id=83743&format=png&color=000000" alt="revenue icon" />
          <div className="stats">
            <div className="duration-filters">
              <button
                onClick={() => handleClick('revenue', 'Today')}
                className={`duration-filters-button ${revenueClassName === 'Today' ? 'active' : ''}`}
              >
                Today
              </button>
              <button
                onClick={() => handleClick('revenue', 'Weekly')}
                className={`duration-filters-button ${revenueClassName === 'Weekly' ? 'active' : ''}`}
              >
                Weekly
              </button>
              <button
                onClick={() => handleClick('revenue', 'Monthly')}
                className={`duration-filters-button ${revenueClassName === 'Monthly' ? 'active' : ''}`}
              >
                Monthly
              </button>
            </div>
            <span className="number-font">Rs. {stats.totalRevenue}</span>
            <span>{` ${revenueClassName ? revenueClassName : "All Time"} Revenue`} </span>
          </div>
        </div>

        {/* AOV Card */}
        <div className="orders-stats-div flexbox-horizontal image-size">
          <img src="https://img.icons8.com/?size=100&id=85079&format=png&color=000000" alt="aov icon" />
          <div className="stats">
            <div className="duration-filters">
              <button
                onClick={() => handleClick('aov', 'Today')}
                className={`duration-filters-button ${aovClassName === 'Today' ? 'active' : ''}`}
              >
                Today
              </button>
              <button
                onClick={() => handleClick('aov', 'Weekly')}
                className={`duration-filters-button ${aovClassName === 'Weekly' ? 'active' : ''}`}
              >
                Weekly
              </button>
              <button
                onClick={() => handleClick('aov', 'Monthly')}
                className={`duration-filters-button ${aovClassName === 'Monthly' ? 'active' : ''}`}
              >
                Monthly
              </button>
            </div>
            <span className="number-font">Rs. {stats.averageOrderValue.toFixed(2)}</span>
            <span>{`${aovClassName ? aovClassName : "All Time"} AOV`}</span>
          </div>
        </div>

        <div className="orders-stats-div flexbox-horizontal image-size">
          <img src="https://img.icons8.com/?size=100&id=7493&format=png&color=000000" alt="delivery icon" />
          <div className="stats">
            <button style={{border : "none", backgroundColor : "white", color : "white"}}>button</button>
            <span className="number-font">{stats.percentPending}</span>
            <span>% Deliveries pending</span>
          </div>
        </div>

      </div>

      <div className="update-order-status flexbox-vertical">
        <div className="filters">
            
            <button onClick={() => handleClick('allOrders', 'Today')}
                className={`duration-filters-button table-filters-button ${tableSorter === 'Today' ? 'active' : ''}`}>
                Today
              </button>

            <button onClick={() => handleClick('allOrders', 'Weekly')}
                className={`duration-filters-button table-filters-button ${tableSorter === 'Weekly' ? 'active' : ''}`}>
                Weekly
            </button>

            <button onClick={() => handleClick('allOrders', 'Monthly')}
                className={`duration-filters-button table-filters-button ${tableSorter === 'Monthly' ? 'active' : ''}`}>
                Monthly
              </button>
            

            
            
        </div>

        <div className="table-wrapper">
            <table className='update-order-status-table'>
            <thead>
                <tr>
                    <th>Order Id</th>
                    <th> <button value="email" className='flexbox-horizontal' onClick={() => setSortDescending(!sortDescending)}>Email
                        <img className='update-order-status-image' src={sortDescending === true ? "https://img.icons8.com/?size=100&id=99977&format=png&color=000000" : "https://img.icons8.com/?size=100&id=99979&format=png&color=000000"}></img> 
                        </button> 
                    </th>
                    <th> <button value="amount" className='flexbox-horizontal' onClick={() => setSortDescending(!sortDescending)}>Amount 
                        <img className='update-order-status-image' src={sortDescending === true ? "https://img.icons8.com/?size=100&id=99977&format=png&color=000000" : "https://img.icons8.com/?size=100&id=99979&format=png&color=000000"}></img> 
                        </button> 
                    </th>
                    
                    <th> <button value="status" className='flexbox-horizontal' onClick={() => setSortDescending(!sortDescending)}>Payment Type
                        <img className='update-order-status-image' src={sortDescending === true ? "https://img.icons8.com/?size=100&id=99977&format=png&color=000000" : "https://img.icons8.com/?size=100&id=99979&format=png&color=000000"}></img> 
                        </button> 
                    </th>

                    <th> <button value="deliverystatus" className='flexbox-horizontal' onClick={() => setSortDescending(!sortDescending)}>Delivery Status
                        <img className='update-order-status-image' src={sortDescending === true ? "https://img.icons8.com/?size=100&id=99977&format=png&color=000000" : "https://img.icons8.com/?size=100&id=99979&format=png&color=000000"}></img> 
                        </button> 
                    </th>

                    <th> <button value="time" className='flexbox-horizontal' onClick={() => setSortDescending(!sortDescending)}>Placed On
                        <img className='update-order-status-image' src={sortDescending === true ? "https://img.icons8.com/?size=100&id=99977&format=png&color=000000" : "https://img.icons8.com/?size=100&id=99979&format=png&color=000000"}></img> 
                        </button> 
                    </th>

                    <th>Invoice</th>
                    <th>Cancel</th>
                </tr>
            </thead>
            <tbody>
                {stats.orders.map((item) => {
                    return (
                        <OrderUpdate 
                            key = {item._id}
                            cash_order = {item.cash_order_id}
                            online_order = {item.razorpay_order_id}
                            payment_type = {item.payment_type}
                            amount = {item.price}
                            date = {item.createdAt}
                            delivery_status = {item.delivery_status}
                            email = {item.email}
                        />
                    )
                })}
            </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
