import React from 'react'
import './OrderTablebody.css'

const OrderTablebody = (props) => {
  return (
            <tr>
            <td>{props.id}</td>
            <td>{props.customer}</td>
            <td>{props.amount}</td>
            <td><span className={`status ${props.status}`}>{props.status}</span></td>
            </tr>
  )
}

export default OrderTablebody