import React from 'react'
import './Bestselling.css';

const Bestselling = (props) => {
  return (
    <>
          <div className="products-bestselling-card">
            <img src={props.image}></img>
            <h3> {props.name} </h3>
            <span>Order Count : {props.orderCount}</span>
          </div>
    </>
  )
}

export default Bestselling