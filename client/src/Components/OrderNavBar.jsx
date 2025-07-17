import React from 'react'
import './OrderNavBar.css'
import { Link } from 'react-router-dom'

const OrderNavBar = () => {
  return (
    <div className="order-headers">
            <img alt='Logo of cafe velvet roast' src="/Cafe_logo.png"></img>
            <span>ORDER</span>
            <span style={{marginLeft : "auto", paddingRight : "30px", backgroundColor : "white"}}> 
                <Link to = '/'>
                <img alt='Home button icon' style={{backgroundColor : "white", height : "30px", width : "30px"}}src = "https://img.icons8.com/?size=100&id=54152&format=png&color=000000"></img></Link> </span>
    </div>
  )
}

export default OrderNavBar