import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import GameCard from "../../components/GameCard/GameCard";


const Wishlist = () => {
  const [games, setGames] = useState([]);
  const [isloading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null);
  const {user, loading} = useAuth();

  const removeFromUI = useCallback((gameId) => {
    setGames((prevGames) => prevGames.filter((game) => game.gameId !== gameId));
  },[])

  useEffect(() => {
    if(!user) return;

    const getWishlist = async() => {
      try {
      const wishlistRef = collection(db, 'users', user.uid, 'wishlist' );
      const querySnapShot = await getDocs(wishlistRef);
      const gamesArray = querySnapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      setGames(gamesArray);
      setLoading(false);
      } catch(err) {
        console.error("Error getting wishlist games: ", err);
        setError("Failed to load wishlist");
        setLoading(false);
      }
    };

    getWishlist();

  },[user])

  //This loading check is while the Auth is loading
  if (loading) return <div className="loader">Loading...</div>; 

  if(isloading){
    return (
      <p>Loading...</p>
    )
  }

  if(error){
    return (
      <p>{error}</p>
    )
  }
  if(!user){
    return (
      <p>You must be logged in to view Wishlist</p>
    )
  }

  return (
    <div className="game-list">
      {games.length === 0 ? (
            <p className="no-results">Your wishlist is empty 🎮</p>
          ) : (
            games.map((game) => (
              <GameCard
                onRemove={removeFromUI}
                key={game.id}
                id={game.gameId} // Note: Use the keys you saved in Firestore!
                title={game.title}
                image={game.image || "https://via.placeholder.com/300x200?text=No+Image"}
                rating={game.rating}
                platform={game.platform || "N/A"}
              />
            ))
          )}
    </div>
  );

}

export default Wishlist;
