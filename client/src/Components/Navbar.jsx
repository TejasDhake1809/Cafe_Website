import React, {useState} from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useLogout();
  const {user} = useAuthContext();

  const handleClick = () => {
    logout();
  }

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className={`navbar ${menuOpen ? 'responsive' : ''}`}>
      <h1>Cafe Velvet Roast</h1>
      <button className="menu-toggle" onClick={toggleMenu}>☰</button>
        <p><Link to="/">Home</Link></p>
        <p><Link to="/Menu">Menu</Link></p>
        <p><Link to="/Specialities">Specialities</Link></p>
        <p><Link to="/Events">Events</Link></p>

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
                <p><Link to="/dashboard">Dashboard</Link></p>
              </div>
            </div>
            <button className="logoutbutton" onClick={handleClick}>Logout</button>
          </p>
        )}
        {!user && (
          <>
            <p><Link to="/Login">LOGIN</Link></p>
            <p><Link to="/Register">REGISTER</Link></p>
          </>
        )}
    </nav>
  );
}

export default Navbar