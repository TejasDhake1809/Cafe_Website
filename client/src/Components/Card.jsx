import React from 'react'
import './Card.css'
const Card = (props) => {
  return (
    <div className='card-wrapper'>

      <div className='card-image'>
        <img src={props.img} alt={props.title} />
      </div>

      <div className='card-details'>
        <p>{props.title}</p>
      </div>
        
    </div>
  )
}

export default Card