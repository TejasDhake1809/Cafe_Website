import React from 'react'
import './Menu.css'
import { useNavigate } from 'react-router-dom'
const Menu = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/order')
    }
  return (
    <>
        <div className="menu-landing">
            <div className="menu-landing-text">
                 <p>Where Every Taste Finds Its Perfect Match</p>  
            </div>        
        </div> 

        <div className="coffeecup-grid">
            <div className="aligned-text">
                <div className="aligned-text-div reverse-flow">
                    <img src="https://img.icons8.com/?size=100&id=37211&format=png&color=000000"></img>
                    <div className="text-div">
                        <h3>Signature Coffees</h3>
                        <p>Discover our rich, aromatic blends crafted from premium beans roasted to perfection 
                            for the ultimate coffee experience.</p>
                    </div>       
                </div>

                <div className="aligned-text-div reverse-flow">
                    <img src="https://img.icons8.com/?size=100&id=bJYhcAUy1jDN&format=png&color=000000"></img>
                    <div className="text-div">
                        <h3>Artisan Breads</h3>
                        <p>Freshly baked daily using traditional recipes, our breads are the perfect 
                            complement to your meal or a delicious snack on their own.</p>
                    </div>
                   
                </div>

                <div className="aligned-text-div reverse-flow">
                    <img src="https://img.icons8.com/?size=100&id=277&format=png&color=000000"></img>
                    <div className="text-div">
                        <h3>Gourmet Cheeses</h3>
                        <p>Savor our curated selection of fine cheeses, perfect for pairing with breads, salads, or enjoying solo.</p>
                    </div>
                   
                </div>

            </div>

            <div className="coffeecup-image">
                <img src="/Coffee_Cup.png" style={{height : "100%", width : "100%"}}></img>
            </div>

            <div className="aligned-text">
                <div className="aligned-text-div">
                    <img src="https://img.icons8.com/?size=100&id=98816&format=png&color=000000"></img>
                    <div className="text-div">
                        <h3>Fresh Pastries</h3>
                        <p>LIndulge in flaky, buttery pastries made fresh every morning to delight your sweet tooth or accompany your coffee.</p>
                    </div>
                   
                </div><div className="aligned-text-div">
                    <img src="https://img.icons8.com/?size=100&id=56700&format=png&color=000000"></img>
                    <div className="text-div">
                        <h3>Healthy Salads</h3>
                        <p>A vibrant mix of garden-fresh ingredients tossed into refreshing salads that fuel your day with flavor and nutrition.</p>
                    </div>
                   
                </div><div className="aligned-text-div">
                    <img src="https://img.icons8.com/?size=100&id=rAKmsFuZJT1e&format=png&color=000000"></img>
                    <div className="text-div">
                        <h3>Refreshing Beverages</h3>
                        <p>Quench your thirst with our range of handcrafted drinks—from cool iced teas to zesty lemonades and more.</p>
                    </div>
                   
                </div>
            </div>
        </div>
        
        <div className="menu-info">
            <div className="menu-info-text">
                <p>At Velvet Roast, start with flavorful bites, 
                    enjoy hearty mains made with care, 
                    and end on a sweet note with our indulgent desserts. 
                    Don’t forget to sip on something special from our 
                    handcrafted beverage selection.</p>
                <button onClick={handleClick}>Take My Order</button>
            </div>

            <div className="menu-info-image">
                <img src="/MenuCafeFood.jpg" style={{height : "100%", width : "100%", borderTopLeftRadius : "250px", borderBottomLeftRadius : "250px"}}></img>
            </div>
        </div>

    </>
  )
}

export default Menu