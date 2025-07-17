import React, {useState} from 'react'
import './Descriptionleft.css'
import { useNavigate } from 'react-router-dom'
const Descriptionleft = (props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${props.buttontext}`)
  }
  const [hover,setHover] = useState(false);
  return (
    <>
        <div className="descriptiondiv" style={{backgroundColor : props.backgroundColor, color : props.color}}>
            <div className="grid-items-1">
              <p className="grid-items-para">{props.para}</p>
              <button onClick={handleClick}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
              className="explore-specialities">
                <img alt='' src={`https://img.icons8.com/?size=100&id=39969&format=png&color=${hover ? "FFFDD0" : "000000"}`}
              style={{height : "30px", width : "30px"}}></img> Explore our {props.buttontext}</button>
            </div>
              
            <div className="grid-items"> <img src={props.img} alt={props.alt || "Cafe Food"} /></div>
        </div>
    </>
  )
}

export default Descriptionleft