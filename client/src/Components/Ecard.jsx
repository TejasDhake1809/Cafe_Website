import React from 'react'
import "./Ecard.css"
import EComponent from './EComponent.jsx'
import eventsData from '../data/events.json'
const Ecard = () => {
  return (
    <>
      <div className="container">
         {eventsData.events.map(event => (
          <EComponent 
            key ={event.id}
            title = {event.title}
            content = {event.content}
            photo = {event.photo}
          />
        ))}
      </div>
    </>
  )
}

export default Ecard