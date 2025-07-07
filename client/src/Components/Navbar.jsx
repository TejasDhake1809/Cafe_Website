import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'

const Navbar = () => {

  const { logout } = useLogout();
  const {user} = useAuthContext();

  const handleClick = () => {
    logout();
  }
  return (
    <div>
        <nav className="navbar">
            <h1>Koe-Da-Kafe</h1>
                <p><Link to = '/'>Home</Link></p>
                {/* <p><Link to ='/About'>About</Link></p>  */}
                <p><Link to = '/Menu'>Menu</Link></p>
                <p><Link to = '/Specialities'>Specialities</Link></p>
                <p><Link to = '/Events'>Events</Link></p>
                {user && (<p> <div className="dropdown"> 
                  <span> {user.email} <img src="https://img.icons8.com/?size=100&id=60662&format=png&color=000000" 
                  style={{height : '10px', width : '10px'}}></img> </span> 
                  <div className="dropdown-content">
                    <p><Link to ='/dashboard'>Dashboard</Link></p>
                  </div>
                  </div> 
                  <span> </span>
                  <button className="logoutbutton" onClick={handleClick}>Logout</button> </p>)}
                {!user && (<p><Link to = '/Login'>LOGIN</Link></p>)}
                {!user && (<p><Link to = '/Register'>REGISTER</Link></p>)}

                
        </nav>
    </div>
  )
}

export default Navbar