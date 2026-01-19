import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import { Auth } from './pages/Auth/Auth';
import Wishlist from './pages/Wishlist/Wishlist';
import GameDetails from './pages/GameDetails/GameDetails';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="main-container">
      {/* We  put a Navbar here */}
      <NavBar />
      
      <Routes>
        {/* When the URL is "/", show the Home component */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Auth />} />
        
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="*" element={
          <div>
            <h1>404 - Page not found</h1>
            <Link to='/'>Home</Link>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;