import React from 'react'
import './Events.css'
import Ecard from '../Components/Ecard'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';


const Events = () => {
    useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
    <>  
 
    <div className='landing-card-events'>
        <div className='landing-card-details-events'>
        <p>Experience the vibrant atmosphere of live events, streaming, and karaoke nights, all in one place. 
            Join us for unforgettable moments</p>
        <div className='button'>
            <button className=''> Explore </button>
        </div>
        </div>
    </div>

    <div className='tagline-events'>
        <p className='title'>Explore our Events</p>
    </div>

    <div className='cards-container'>
        <Ecard />
    </div>
    <br></br>

    </>


  )
}

export default Events