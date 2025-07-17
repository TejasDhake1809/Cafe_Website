import React, {useState} from 'react'
import './Order.css'
import MenuCardWrapper from '../Components/MenuCardWrapper';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import OrderNavBar from '../Components/OrderNavBar';
import toast from 'react-hot-toast'
import { useAuthContext } from '../../hooks/useAuthContext';
const Order = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [hover, setHover] = useState(false);

    const orangeColor = "ffa500";
    const whiteColor = "ffffff";

    const [active,setActive] = useState("");
    const [counts, setCounts] = useState({}); // { itemId1: 2, itemId2: 5, ... }

    const updateCount = (itemId, newCount) => {
        setCounts(prev => ({
        ...prev,
        [itemId]: newCount
        }));
    };

    if (!user) {
        toast.error("Login to proceed");
        navigate("/Login");
    }

    const handleClick = () => {
        const orderData = {counts};
        if (Object.keys(counts).length === 0) {
            toast.error ("You need to select an item to proceed");
            return;
        }
        //setting order into localstorage
        localStorage.setItem("currentOrder", JSON.stringify(orderData));

        //sending through location state
        navigate("/order-review", {state : orderData});
    }
  return (
    <>
        <OrderNavBar />

        <div className="filterlogos">
                
                <button onClick={() => setActive("Starters")} className={active==="Starters" ? "filtersbtnactive filtersbtn" : "filtersbtn"} >
                <img alt='Salad Bowl' src={`https://img.icons8.com/?size=100&id=56700&format=png&color=${active === "Starters" ? "ffffff" : "000000"}`}></img>Starters</button>
            
                <button onClick={() => setActive("Main Course")} className={active==="Main Course" ? "filtersbtnactive filtersbtn" : "filtersbtn"}>
                <img alt='Main Course' src={`https://img.icons8.com/?size=100&id=37380&format=png&color=${active === "Main Course" ? "ffffff" : "000000"}`}></img>Main Course</button>

                <button onClick={() => setActive("Dessert")} className={active==="Dessert" ? "filtersbtnactive filtersbtn" : "filtersbtn"}>
                <img alt='Cheesecake' src={`https://img.icons8.com/?size=100&id=ErxOo3KxxsOG&format=png&color=${active === "Dessert" ? "ffffff" : "000000"}`}></img>Dessert</button>

                <button onClick={() => setActive("Drinks")} className={active==="Drinks" ? "filtersbtnactive filtersbtn" : "filtersbtn"}>
                <img alt='Coffee' src={`https://img.icons8.com/?size=100&id=37211&format=png&color=${active === "Drinks" ? "ffffff" : "000000"}`}></img>Drinks</button>
        </div>

        <div className="products-container">
            {active === "" && <MenuCardWrapper category = {""} counts={counts} updateCount={updateCount} />}
            {active ==="Starters" && <MenuCardWrapper category = {"Starters"} counts={counts} updateCount={updateCount}/>}
            {active ==="Main Course" && <MenuCardWrapper category = {"Main Course"} counts={counts} updateCount={updateCount}/>}
            {active ==="Dessert" && <MenuCardWrapper category = {"Dessert"} counts={counts} updateCount={updateCount}/>}
            {active ==="Drinks" && <MenuCardWrapper category = {"Drinks"} counts={counts} updateCount={updateCount}/>}
        </div>

        <button 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)} 
            onClick = {handleClick} className="fixed-order-button">
                Order <img
                        src={`https://img.icons8.com/?size=100&id=45300&format=png&color=${hover ? orangeColor : whiteColor}`}
                        style={{ height: "25px", width: "25px" }}

                        alt="icon"
                        />
        </button>
    </>
  )
}

export default Order