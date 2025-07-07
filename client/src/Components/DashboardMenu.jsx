import React, {useState} from 'react'
import './DashboardMenu.css'

const DashboardMenu = ({active, setActive}) => {
  return (

    <div className="selection-menu">
            <div className="selection-menu-title"> Koe-The-Cafe </div> <div className="br"></div> <div className="br"></div><div className="br"></div>
            <div className="selection-menu-options">
                <button onClick={() => setActive("Overview")} className={active === "Overview" ? "active-btn btn" : "btn"}> 
                    <img src={`https://img.icons8.com/?size=100&id=Yj5svDsC4jQA&format=png&color=${active === "Overview" ? "000000" : "ffffff"} `} style={{height : '20px', width : '20px' }}></img> 
                    <span> </span><span> </span>
                Overview</button> <div className="br"></div>
                <button onClick={() => setActive("Products")}  
                className={active === "Products" ? "active-btn btn" : "btn" }>
                    <img src={`https://img.icons8.com/?size=100&id=114632&format=png&color=${active === "Products" ? "000000" : "ffffff"}`} style={{height : '20px', width : '20px' }}></img>
                    <span> </span><span> </span>
                    Products</button> <div className="br"></div>
                <button onClick={() => setActive("Order")}  className={active === "Order" ? "active-btn btn" : "btn" }>
                    <img src={`https://img.icons8.com/?size=100&id=VeUo27LTyt8A&format=png&color=${active === "Order" ? "000000" : "ffffff"}`} style={{height : '20px', width : '20px' }}></img>
                    <span> </span><span> </span>
                    Order</button> <div className="br"></div>
                <button onClick={() => setActive("Analytics")}  className={active === "Analytics" ? "active-btn btn" : "btn" }>
                    <img src={`https://img.icons8.com/?size=100&id=Vs8FQuITsdID&format=png&color=${active === "Analytics" ? "000000" : "ffffff"}`} style={{height : '20px', width : '20px' }}></img>
                    <span> </span><span> </span>
                    Analytics</button> <div className="br"></div>
                <button onClick={() => setActive("Home")}  className={active === "Home" ? "active-btn btn" : "btn" }>
                    <img src={`https://img.icons8.com/?size=100&id=83326&format=png&color=${active === "Home" ? "000000" : "ffffff"}`} style={{height : '20px', width : '20px' }}></img>
                    <span> </span><span> </span>
                    Home</button> <div className="br"></div>
                <button onClick={() => setActive("Settings")}  className={active === "Settings" ? "active-btn btn" : "btn" }>
                    <img src={`https://img.icons8.com/?size=100&id=4511GGVppfIx&format=png&color=${active === "Settings" ? "000000" : "ffffff"}`} style={{height : '20px', width : '20px' }}></img>
                    <span> </span>
                      Settings</button>
            </div>
        </div>
  )
}

export default DashboardMenu