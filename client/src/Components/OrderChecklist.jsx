import React from 'react'
import './OrderChecklist.css'

const OrderChecklist = ({name, quantity, price, key}) => {
  return (
    <>
        <div className="item-grid">
            <span className='item-quantity'>{quantity}x</span>
            <span className='item-name'> {name}</span>
            <span className='item-price'>₹{price*quantity}</span>
        </div>

        <div className="divider-line"></div>
    </>
  )
}

export default OrderChecklist