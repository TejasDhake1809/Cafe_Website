import React, {useState} from 'react'
import './Dashboard.css'
import DashboardMenu from '../Components/DashboardMenu.jsx';
import Overview from '../Components/Overview.jsx';
import Products from '../Components/Products.jsx';

const Dashboard = () => {
    const [active, setActive] = useState(" ");
  return (
    <div className='grid-container'>
        <DashboardMenu active={active} setActive={setActive}/>
        <div className="data-menu">
            <div className="dashboard-header"> 
                <img src="https://img.icons8.com/?size=100&id=OTxpMqWbm71F&format=png&color=000000" style={{height : '30px', width : '30px'}}></img> 
                <span className="space"> </span>
                <p>Dashboard</p></div>
            <div className="dashboard-content">
                {active === "Overview" && <Overview />}
                {active === "Products" && <Products />}
            </div>
        </div>
    </div>
  )
}

export default Dashboard;