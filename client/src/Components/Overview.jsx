import React from 'react'
import './Overview.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import BarChartBox from './BarChartBox.jsx';


const Overview = () => {
  return (
    <div className="overview-grid-container">
        <div className="small-numbers">
            <div className="small-numbers-div">
                <div className="small-numbers-text"><p>Orders Today</p>
                    <span className="small-numbers-count">180</span>
                </div>
                <div className="progress-ring-wrapper">
                    <div className="progress-ring">
                        <span></span>
                    </div>
                </div>
            </div>

            <div className="small-numbers-div">
                <div className="small-numbers-text"><p>Clients Today</p>
                    <span className="small-numbers-count">250</span>
                </div>
                <div className="progress-ring-wrapper">
                    <div className="progress-ring">
                        <span></span>
                    </div>
                </div>
            </div>
            <div className="small-numbers-div">
                <div className="small-numbers-text"><p>Revenue Today</p>
                    <span className="small-numbers-count">$ 951.70</span>
                </div>
                <div className="progress-ring-wrapper">
                    <div className="progress-ring">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>

        <div className="graphs-orders">
            <div className="bar-graphs-overview-container">
                <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Monthly Sales</h3>
                <BarChartBox />
            </div>

            <div className="orders-list">
                <div className="orders-table-wrapper">
                    <h3 className="orders-table-title">Recent Orders</h3>
                    <table className="orders-table">
                    <thead>
                        <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>#001</td>
                        <td>John Doe</td>
                        <td>AED 250</td>
                        <td><span className="status delivered">Delivered</span></td>
                        </tr>
                        <tr>
                        <td>#002</td>
                        <td>Jane Smith</td>
                        <td>AED 180</td>
                        <td><span className="status pending">Pending</span></td>
                        </tr>
                        <tr>
                        <td>#003</td>
                        <td>Ali Khan</td>
                        <td>AED 340</td>
                        <td><span className="status cancelled">Cancelled</span></td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>
        </div>
            
    </div>
  )
}

export default Overview