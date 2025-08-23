import React, {useState, useEffect} from 'react'
import './Overview.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import OrderTablebody from './OrderTablebody.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import OverviewDataBlocks from './OverviewDataBlocks.jsx';
import SimpleBarChart from './SimpleBarChart.jsx';

const Overview = () => {
    const [orders,setOrders] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [label, setLabel] = useState([]);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/orders/get-order`, {
                    params : {limit : 10}
                });
                setOrders(res.data);
                // console.log(res.data);
                // console.log("this is in orders variable of usestate", orders);
                // toast.success("We have successfully fetched orders");
            } catch (error) {
                toast.error("Failed to fetch orders from database");
            }
        }

        fetchOrders();
    }, []);

    const [data, setData] = useState({});
    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get(`${baseUrl}/api/orders/overview`);
                if (response.data) {
                    setData(response.data);
                }
            } catch (error) {
                toast.error("Failed to fetch overview stats");
                console.error(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBarChartStats = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/orders/chart/bar`);
                const pdata = response.data.revenue;
                const labels = response.data.label;
                setLabel(labels);
                setRevenue(pdata);
                // toast.success("Bar chart data successfully fetched");
            } catch (error) {
                console.error(error.message);
                toast.error("Couldnt fetch bar chart data");
            } 
        }
        fetchBarChartStats();
    }, [])

  return (
    <div className="overview-grid-container">
        <div className="small-numbers">
            <OverviewDataBlocks field={data.ordersToday} type={"ordersToday"}/>
            <OverviewDataBlocks field={data.clientsToday} type={"clientsToday"}/>
            <OverviewDataBlocks field={data.revenueToday} type={"revenueToday"}/>
        </div>

        <div className="graphs-orders">
            <div className="chart-container-overview">
                <div className="barchart-overview">
                    <p>Bar Graph Showing Monthly Revenue</p>
                    <SimpleBarChart revenue = {revenue} label = {label}/>
                </div>
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
                    {orders.map((item) => {
                       return ( <OrderTablebody 
                            key = {item._id}
                            id = {item._id}
                            customer = {item.email}
                            amount = {item.price}
                            status = {item.delivery_status}
                        />
                        )
                    })}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
            
    </div>
  )
}

export default Overview