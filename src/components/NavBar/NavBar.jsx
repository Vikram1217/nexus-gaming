import { NavLink } from 'react-router-dom';
import { useContext } from 'react'; // 1. Import hook
import { Gamepad2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext'; // 2. Import context

import './NavBar.css';

function Navbar() {
  // 3. "Tune in" to the broadcast!
  const { user, logOut, loading } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <NavLink to="/">
          <Gamepad2 size={24} color="#00ffcc" style={{marginRight: '10px'}} />
          Nexus <span>Gaming</span>
        </NavLink>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/browse">Browse</NavLink></li>
        
        {/* Check if we are still waiting for Firebase */}
        {loading ? (
            <li className='nav-loading'>...</li>
          ) : (
            <>
            {/* Conditional Rendering based on Auth */}
              {user ? (
              <>
                <li><NavLink to="/wishlist">Wishlist</NavLink></li>
                <li className="user-email">
                  <NavLink to="/profile" className="profile-nav-link">
                    {user?.photoURL ? (
                      <div className='nav-profile-avatar-container'>
                        <img src={user.photoURL} alt="Avatar" className="nav-profile-avatar-img" />
                      </div>                      
                    ) : (
                      <div className="email-circle">{user.email.charAt(0).toUpperCase()}</div>
                    )}
                  </NavLink>
                </li>
                <li><button onClick={logOut} className="logout-btn">Logout</button></li>
              </>
              ) : (
                <li><NavLink to="/login" className="login-btn">Login</NavLink></li>
              )}
            </>
          )
        }
        
        
      </ul>
    </nav>
  );
}

export default Navbar;