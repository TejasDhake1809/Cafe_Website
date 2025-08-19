import React, {useState} from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useLogout();
  const {user} = useAuthContext();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    setIsDisabled(true);
    logout();
  }

  const toggleMenu = () => setMenuOpen(prev => !prev);
  console.log("User object from Navbar:", user);
  return (
    <nav className={`navbar ${menuOpen ? 'responsive' : ''}`}>
      
      <span className='idkyaar'> 
        <img style={{height : "30px", width : "30px"}} alt='Cafe Velvet Roast Logo' src='/Cafe_logo.png'></img>
          <Link to="/" className='font-size'>Cafe Velvet Roast</Link> <button className="menu-toggle" onClick={toggleMenu}>☰</button></span>
      
        <div className="main-links">
          <p><Link to="/">Home</Link></p>
          <p><Link to="/Menu">Menu</Link></p>
          <p><Link to="/Specialities">Specialities</Link></p>
          <p><Link to="/Events">Events</Link></p>
        </div>

        <div>
            {user && (
              <p>
                <div className="dropdown">
                  <span>
                    {user.email}
                    <img
                      src="https://img.icons8.com/?size=100&id=60662&format=png&color=000000"
                      style={{ height: '10px', width: '10px' }}
                      alt="dropdown icon"
                    />
                  </span>
                  <div className="dropdown-content">
                    <div className='flex'>
                      <p><Link to="/user-dashboard">User Dashboard</Link></p>
                      {user.perms === "Admin" && <p><Link to="/dashboard">Admin Dashboard</Link></p>}
                    </div>
                  </div>
                </div>
                <button disabled={isDisabled} className="logoutbutton" onClick={handleClick}>Logout</button>
              </p>
            )}
          {!user && (
            <div className='loginreg'>
              <p><Link to="/Login">LOGIN</Link></p>
              <p><Link to="/Register">REGISTER</Link></p>
            </div>
          )}
        </div>
    </nav>
  );
}

export default Navbar