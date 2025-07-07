import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer-container'>
        <p><a href=''>Home</a></p>
        <p><a href=''>About Us</a></p>
        <p><a href=''>Privacy Policy</a></p>
        <p><a href=''>Contact Us</a></p>
        <p className='copyright'> &copy; Copyright Reserved 2014</p>
    </div>
  )
}

export default Footer