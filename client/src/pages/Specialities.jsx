import React from 'react'
import './Specialities.css'
import Descriptionleft from '../Components/Descriptionleft'
import {useNavigate} from 'react-router-dom'
const Specialities = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/order")
  }
  return (
    <>
      <div className='landing-card-specialities'>
        <div className='landing-card-details-specialities'>
          <p className="some-title-igiveup">Treasures from Our Kitchen</p>
          <p>Savor the delightful specialties of our café—freshly roasted coffee, artisan cheese, and our signature cheese bread. 
            Join us for a truly unique and flavorful experience</p>
          <div className='button'>
            <button onClick={handleClick}> Order </button>
          </div>
        </div>
      </div>
      
      
        <Descriptionleft 
        para = {"Our café takes pride in its rich, handcrafted cheeses, freshly baked artisan breads, and bold, aromatic coffee. Each specialty is made with care, offering a warm and flavorful experience in every bite and sip."}
        buttontext={"Menu"}
        img = {"/Specialities_Bread.jpg"}
        backgroundColor = {"white"}
        color = {"black"}
        alt = {"Bread"}
        />


      <div className='specialities-containers-1'>
        <p>CHEESES</p>
      </div>
      
      <div className="description">
            <div className="griditems"> <img src="/Cheese.jpg" alt="Coffee Roasting Machine" /></div>  
            <div className="griditems">Indulge in a world of flavors with our specialty selection of cheeses. 
              From creamy bries to sharp cheddars and exotic blue cheeses, we offer a variety that caters to every palate. 
              Perfect for pairing or savoring on their own, our cheeses are a culinary adventure waiting to be explored.</div>    
      </div>

      <div className='specialities-containers-2'>
        <p>BREADS</p>
      </div>

      <Descriptionleft 
        para = {"We don’t just serve great coffee—we create experiences. From live music to tastings, our events bring the community together with something special for everyone."}
        buttontext={"Menu"}
        img = {"/BreadSpecialities.jpg"}
        alt = {"Bread"}
        />

      <div className='specialities-containers-3'>
        <p>COFFEE</p>
      </div>

      <div className="description">
            <div className="griditems"> <img src="/Coffee_Photo.jpg" alt="Coffee Roasting Machine" /></div>  
            <div className="griditems charm-regular">Wake up and smell the craftsmanship. 
              Our coffee isn’t just brewed — it’s composed, one bold note at a time. 
              From silky lattes to punchy espressos, every cup is a blend of passion and precision, 
              roasted in-house and poured with purpose.</div>    
      </div>
    </>
  )
}

export default Specialities