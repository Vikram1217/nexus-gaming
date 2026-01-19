import { NavLink } from 'react-router-dom';
import { useContext } from 'react'; // 1. Import hook
import { AuthContext } from '../../context/AuthContext'; // 2. Import context

import './Navbar.css';

function Navbar() {
  // 3. "Tune in" to the broadcast!
  const { user, logOut, loading } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <NavLink to="/">Nexus <span>Gaming</span></NavLink>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/">Browse</NavLink></li>
        
        {/* Check if we are still waiting for Firebase */}
        {loading ? (
            <li className='nav-loading'>...</li>
          ) : (
            <>
            {/* Conditional Rendering based on Auth */}
              {user ? (
              <>
                <li><NavLink to="/wishlist">Wishlist</NavLink></li>
                <li className="user-email"><div className='email-circle'>{user.email.charAt(0).toUpperCase()}</div></li>
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