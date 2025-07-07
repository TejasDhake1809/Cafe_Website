import React, {useState} from 'react';
import './Homepage.css';
import Card from '../Components/Card';
import Descriptionleft from '../Components/Descriptionleft';
import { useNavigate } from 'react-router-dom';
import Descriptionright from '../Components/Descriptionright';
const Homepage = () => {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const handleClick = () => {
        navigate("/order");
    }
  return (
    <div className='Body'>
        <div className="landing">
            <div className="landing-text">
                Fresh brews, <br></br> Tasty bites
                <p>Where loaves rise with care <br></br>
                    Cheese finds its perfect pair <br></br>
                    And coffee seals the moment</p>
                <button onClick={handleClick} 
                onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
                className="order-now">Order Now 
                <img src={`https://img.icons8.com/?size=100&id=39969&format=png&color=${hover? "000000" : "ffffff"}`} style={{height : "30px", width : "30px"}}></img> </button>
            </div>

            <div className="landing-image">
                {/* <img src='/landingimage.png' style={{height : "70%", width : "90%", backgroundColor : "white"}}></img> */}
            </div>

        </div>

        <Descriptionleft 
        para={"Start your day with the rich aroma of handpicked beans,artisan breads, and velvety cheeses. Each cup and every bite tells a story of passion and craft."}
        buttontext={"Specialities"}
        img = {"/Cafe_Food_Random.png"}
        />
        
        <div className="view-our-menu">
            Our Pride
        </div>

        <div className='card-container-centerer'>
                <Card img={"/Croissant.png"} title={"Baked fresh daily with tradition in every slice"}/>
                <Card img={"/Cheeseicon.png"} title={"Creamy, rich, and aged to perfection"}/>
                <Card img={"/Coffeeicon.png"} title={" Handcrafted brews with bold, soulful flavor"}/>
        </div>

        <Descriptionright />
        
        <Descriptionleft 
        para = {"We don’t just serve great coffee—we create experiences. From live music to tastings, our events bring the community together with something special for everyone."}
        buttontext={"Events"}
        img = {"/Cafe_Events_Photo.jpg"}
        />

        <div className='visiting-hours'>

            <div className="visiting-hours-text">
                <h1>Visit Us</h1>
                <p>Monday-Friday : 9am to 9pm</p>
                <p>Saturday-Sunday : 9am to 11pm</p>
            </div>

            <img src="/We're_open.jpg"></img>

        </div>
    
    </div>
  )
}

export default Homepage