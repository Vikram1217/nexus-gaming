import { useState, useEffect, memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = memo((props) => {
  const {user} = useAuth();
  const [liked, setLiked] = useState(false);

  // function to handle the liked button click
  const handleWishList = async() => {
    if(!user){
      alert("You must be logged in to wishlist games!");
      return;
    }

    /* The object we will save to wishlist collection */
    const addGames = {
      userId: user.uid,
      gameId: props.id,
      title: props.title,
      image: props.image,
      rating: props.rating,
      platform: props.platform,
    }

    try {
      if(!liked){
        // Add to the Firestore
        //We create a unique ID based on UserID + GameID
        const wishlistRef = doc(db, 'users', user.uid, 'wishlist', props.id.toString());
        await setDoc(wishlistRef, addGames);
        setLiked(prev => !prev)
      }else{
        // REMOVE FROM FIRESTORE
        const wishlistRef = doc(db, 'users', user.uid, 'wishlist', props.id.toString());
        await deleteDoc(wishlistRef)
        setLiked(prev => !prev);
        props.onRemove(props.id);
      }

    } catch(err){
      console.log("Error updating wishlists: ", err)
    }
  }

  useEffect(() => {
    const checkWishListStatus = async() => {

      if(!user) return;

      try {
        const docRef = doc(db, 'users', user.uid, 'wishlist', props.id.toString());
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          setLiked(true)
        }

      }catch (err){
        console.error("Error checking wishlist status:", err);
      }

    };

    checkWishListStatus();

  }, [user, props.id]);

  return (
    <div className='game-card'>
      <Link to={`/game/${props.id}`} className='card-link'>
          <img
            src={props.image}
            alt={props.title}
            className='game-image'
            onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found' }}
          />
        </Link>
      <div className='game-info'>
        <h3>{props.title}</h3>
        <h3>
          <span style={{color: 'yellow' }} className='platform-badge'>
            {props.platform}
          </span>
        </h3>
        <p>Rating: {props.rating}</p>
        <button
        onClick={handleWishList}
        className={liked ? 'like-btn liked' : 'like-btn'}
        >
          {liked ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
        </button>
      </div>
    </div>    
  );
});

export default GameCard;