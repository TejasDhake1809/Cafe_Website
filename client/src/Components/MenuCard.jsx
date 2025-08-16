import React, {useState} from 'react'
import './MenuCard.css'
const MenuCard = ({name,image,price, count, updateCount, _id}) => {
  const increment = () => {
    updateCount(_id,name, count + 1);}
  const decrement = () => {
    updateCount(_id,name, Math.max(0, count - 1));}
  return (
    <div className="menuCardWrap">
            <div className="menuCardImage">
              <img src ={image}></img>
            </div>
            <div className="menuCardDetails">
                <span className="menuCardName">{name}</span> <div className="br"></div>
                {/* <span className="menuCardDescription">{description}</span><div className="br"></div> */}
                <span className="menuCardPrice">{'\u20B9'} {price}</span><div className="br"></div>
                <div className="menuCardOrderButton">
                      <button onClick={decrement}>-</button> 
                        <p>{count}</p> 
                      <button onClick={increment}>+</button> 
                </div>
            </div>
    </div>
  )
}

export default MenuCard