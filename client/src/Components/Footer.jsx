import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className='footer-container'>
        <p> <Link to={"/"}>Home</Link> </p>
        <p> <Link to={"/"}> About Us </Link> </p>
        <p> <Link to={"/"}> Privacy Policy </Link> </p>
        <p>  <Link to={"/"}> Contact Us </Link></p>
        <p className='copyright'> &copy; Copyright Reserved 2014</p>
    </div>
  )
}

export default Footer