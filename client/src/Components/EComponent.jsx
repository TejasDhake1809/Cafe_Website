import React from 'react'
import "./EComponent.css"


const EComponent = ({title="MUSICCCC", content, photo}) => {
  return (
    <>
      <div className="ECompWrapper" style={{
          backgroundImage: `url(${photo})`}}>
        <div className="overlay">
            <div className="ECompWrapper-content" data-aos="fade-up">
              <h1> {title} </h1>
              <p> {content} </p>
            </div>  
        </div>
        
      </div>
    </>

  )
}

export default EComponent