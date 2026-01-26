import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import { Landing } from './pages/Landing/Landing';
import { Auth } from './pages/Auth/Auth';
import Wishlist from './pages/Wishlist/Wishlist';
import GameDetails from './pages/GameDetails/GameDetails';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Profile } from './pages/Profile/Profile';
import Footer from './components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <div className="main-container">
      <Toaster position='bottom-right' reverseOrder={false} />
      {/* We  put a Navbar here */}
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Home />} />        
        <Route path="/login" element={<Auth />} />        
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />                
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={
          <div>
            <h1>404 - Page not found</h1>
            <Link to='/'>Home</Link>
          </div>
        } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;