import React from 'react'
import './OrderUpdate.css'

const OrderUpdate = (props) => {
  return (
    <tr>
        <td>{props.cash_order ? props.cash_order : props.online_order}</td>
        <td>{props.email}</td>
        <td>{props.amount}</td>
        <td>{props.payment_type}</td>
        <td className={`status ${props.delivery_status}`}>{props.delivery_status}</td>
        <td>{props.date.toLocaleString()}</td>
        <td> <img className='image' src="https://img.icons8.com/?size=100&id=6ybQ6Vq2SHjV&format=png&color=000000"></img> </td>
        <td> <img className='image' src="https://img.icons8.com/?size=100&id=63688&format=png&color=000000"></img> </td>
    </tr>
  )
}

export default OrderUpdate