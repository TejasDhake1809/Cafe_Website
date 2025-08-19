import React, {useEffect,useState} from 'react'
import './Analytics.css'
import SimpleBarChart from './SimpleBarChart'
import SimplePieChart from './SimplePieChart'
import toast from 'react-hot-toast';
import axios from 'axios';
import PaymentTypePieChart from './PaymentTypePieChart';

 const Analytics = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [revenue, setRevenue] = useState([]);
    const [label, setLabel] = useState([]);
    const [pieStats, setPieStats] = useState({
        starters : 0,
        maincourse : 0,
        dessert : 0,
        drinks : 0
    });
    
    const [dataStats, setDataStats] = useState({
        repeatPercent : 0,
        newCustomers : 0,
        averageItemsOrdered : 0,
        cash : 0,
        online : 0
    })
    
    const [repeatClass, setRepeatClass] = useState("");
    const [newClass, setNewClass] = useState("");
    const [aioClass, setAioClass] = useState("");

    const handleClick = (type, value) => {
        if (type === "repeatClass") {
            setRepeatClass(prev => (prev === value ? '' : value));
        }
        if (type === "newClass") {
            setNewClass(prev => (prev === value ? '' : value));
        }
        if (type === "aioClass") {
            setAioClass(prev => (prev === value ? '' : value));
        }
    };

    const fetchStats = async (timeframe, field) => {
        try {
           const response = await axios.get(`${baseUrl}/api/orders/data`, {
            params : {timeframe : timeframe || 'All'}
           });
           const data = response.data;
           if (data) {
            setDataStats(prev => ({
                ...prev,
                [field] : data[field],
                cash : data.cash,
                online : data.online
           }));
           }
        } catch (error) {
            toast.error("Failed to fetch data");
            console.error(error);   
        }
    }

    useEffect(() => {fetchStats(repeatClass,'repeatPercent');}, [repeatClass]);
    useEffect(() => {fetchStats(newClass,'newCustomers');}, [newClass]);
    useEffect(() => {fetchStats(aioClass,'averageItemsOrdered');}, [aioClass]);

    useEffect(() => {
        const fetchBarChartStats = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/orders/chart/bar`);
                const pdata = response.data.revenue;
                const labels = response.data.label;
                setLabel(labels);
                setRevenue(pdata);
            } catch (error) {
                console.error(error.message);
                toast.error("Could not fetch bar chart data");
            } 
        }
        fetchBarChartStats();
    }, [])

    useEffect(() => {
        const fetchPieChartStats = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/orders/chart/pie`);
                const udata = res.data;
                setPieStats(udata);
                // console.log("this is udata : ", udata);
                // console.log("this is pieStats : ", pieStats);
            } catch (error) {
                toast.error("Could not fetch pie chart data");
            }
        }
        fetchPieChartStats();
    }, [])


  return (
    <div className="analytics-grid-container">
        <div className="container">
            <div className="orders-stats-div flexbox-horizontal image-size">
                <img src="https://img.icons8.com/?size=100&id=83204&format=png&color=000000" alt="orders icon" />
                <div className="stats">
                        <div className="duration-filters">
                        <button onClick={() => handleClick("repeatClass", "Today")}
                            className={`duration-filters-button ${repeatClass === "Today" ? "active" : ""}`}
                        >
                            Today
                        </button>
                        <button onClick={() => handleClick("repeatClass", "Weekly")}
                            className={`duration-filters-button ${repeatClass === "Weekly" ? "active" : ""}`}
                        >
                            Weekly
                        </button>
                        <button onClick={() => handleClick("repeatClass", "Monthly")}
                            className={`duration-filters-button ${repeatClass === "Monthly" ? "active" : ""}`}
                        >
                            Monthly
                        </button>
                        </div>
                    <span className="number-font">{dataStats.repeatPercent} %</span>
                    <span>{`Customer Repeat`}</span>
                </div>
            </div>

            <div className="orders-stats-div flexbox-horizontal image-size">
                <img src="https://img.icons8.com/?size=100&id=114064&format=png&color=000000" alt="new customers icon" />
                <div className="stats">
                        <div className="duration-filters">
                        <button onClick={() => handleClick("newClass", "Today")}
                            className={`duration-filters-button ${newClass === "Today" ? "active" : ""}`}
                        >
                            Today
                        </button>
                        <button onClick={() => handleClick("newClass", "Weekly")}
                            className={`duration-filters-button ${newClass === "Weekly" ? "active" : ""}`}
                        >
                            Weekly
                        </button>
                        <button onClick={() => handleClick("newClass", "Monthly")}
                            className={`duration-filters-button ${newClass === "Monthly" ? "active" : ""}`}
                        >
                            Monthly
                        </button>
                        </div>
                    <span className="number-font">{dataStats.newCustomers}</span>
                    <span>{`New Customers`}</span>
                </div>
            </div>

            <div className="orders-stats-div flexbox-horizontal image-size">
                <img src="https://img.icons8.com/?size=100&id=nZy6aHwLEY5n&format=png&color=000000" alt="average orders icon" />
                <div className="stats">
                        <div className="duration-filters">
                        <button onClick={() => handleClick("aioClass", "Today")}
                            className={`duration-filters-button ${aioClass === "Today" ? "active" : ""}`}
                        >
                            Today
                        </button>
                        <button onClick={() => handleClick("aioClass", "Weekly")}
                            className={`duration-filters-button ${aioClass === "Weekly" ? "active" : ""}`}
                        >
                            Weekly
                        </button>
                        <button onClick={() => handleClick("aioClass", "Monthly")}
                            className={`duration-filters-button ${aioClass === "Monthly" ? "active" : ""} `}
                        >
                            Monthly
                        </button>
                        </div>
                    <span className="number-font">{dataStats.averageItemsOrdered}</span>
                    <span>{`Average Items Per Order`}</span>
                </div>
            </div>

            <div className="orders-stats-div flexbox-horizontal image-size">
                <img src="https://img.icons8.com/?size=100&id=47602&format=png&color=000000" alt="orders icon" />
                <div className="stats">
                        <div className="duration-filters">
                        <button
                            className={`duration-filters-button`}
                        >
                            Today
                        </button>
                        <button
                            className={`duration-filters-button`}
                        >
                            Weekly
                        </button>
                        <button
                            className={`duration-filters-button`}
                        >
                            Monthly
                        </button>
                        </div>
                    <span className="number-font">Test Stats</span>
                    <span>{`Orders`}</span>
                </div>
            </div>

            <div className="orders-stats-div flexbox-horizontal image-size">
                <img src="https://img.icons8.com/?size=100&id=7JQFQy4GADKf&format=png&color=000000" alt="payment methods icon" />
                <div className="stats">
                    <PaymentTypePieChart {...dataStats} />
                    <span>Payment Type</span>
                </div>
            </div>


        </div>

        <div className="chart-container">
            <div className="barchart">
                <p>Bar Graph Showing Monthly Revenue</p>
                <SimpleBarChart revenue = {revenue} label = {label}/>
            </div>

            <div className="barchart piechart">
                    <p>Pie Chart Showing Revenue Distribution</p>
                    <SimplePieChart {...pieStats} />
            </div>
        </div>

        

    </div>
  )
}

export default Analytics