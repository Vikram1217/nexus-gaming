import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect, useMemo } from 'react'
import { db } from '../../firebase/config';
import { doc, setDoc, serverTimestamp, query, where, orderBy, onSnapshot, collection, deleteDoc } from 'firebase/firestore';
import './ReviewSection.css';

export const ReviewSection = ({gameId}) => {
  
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]); // Array to hold all the reviews from users for this gameId
  const {user} = useAuth();


  const averageScore = useMemo(() => {
      if(reviews.length === 0) return 0;
      const sum = reviews.reduce((acc, curr) => {
        return acc + curr.rating
      }, 0)
      return (sum / reviews.length).toFixed(1);
  },[reviews])

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!reviewText.trim()) return;

    const reviewObj = {
        gameId: gameId,
        userId: user.uid,
        userName: user.email.split('@')[0],
        rating: rating,
        comment: reviewText,
        updatedAt: serverTimestamp()
      };

    try{
      // Will add the Firebase logic here in the next step
      console.log("Submitting: ", {gameId, reviewText, rating, user: user.email });

      const reviewId = `${user.uid}_${gameId}`;
      const reviewRef = doc(db, "reviews", reviewId);      
      await setDoc(reviewRef, reviewObj);

      // Clear the form after submission
      setReviewText('');
      setRating(5);
      alert("Review posted!");
    }catch(err){
      console.error("Error adding review:", err);
      alert("Failed to post review. Try again.");
    }
  }

  useEffect(() => {

    //Point to the collection
    const reviewsRef = collection(db, 'reviews');

    //Create a query. Find reviews for THIS game sorted by newest first
    const q = query(reviewsRef, where("gameId", "==", gameId), orderBy("updatedAt", "desc"));

    //Start the live listener
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const fetchedReviews = snapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      console.log('fetchedReviews: ', fetchedReviews)
      setReviews(fetchedReviews);
    });

    return () => unsubscribe();

  },[gameId])

  const handleDelete = async(reviewId) => {
    
    if(window.confirm('Are you sure you want to delete this review?'))
    {
      try{
        const deleteRef = doc(db, 'reviews', reviewId);
        await deleteDoc(deleteRef);
      } catch(err){
        console.log("Error deleteing reivew: ", err)
      }      
    } 
  }
  
  return (
    <div className='review-section'>
      <hr />
      <h3>Community Reviews</h3>

      {!user ? (
        <p className='login-prompt'>Please login to leave a review.</p>
      ) : (
        <form className='review-form' onSubmit={handleSubmit}>
          <div className='rating-select'>
            <label>Your Rating: </label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="5">5 - Amazing</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Decent</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <textarea
            placeholder='Write your thoughts on this game'
            value={reviewText}
            onChange={(e) => {setReviewText(e.target.value)} }
            required
          />

          <button type='submit' className='submit-review-btn'>Post Review</button>
        </form>
      )}
      <div className="reviews-list">
        <div className="reviews-header">
          <h3>Community Reviews ({reviews.length})</h3>
          {reviews.length > 0 && (
            <div className="community-rating">
              <span>⭐ {averageScore}</span>
              <small> average score</small>
            </div>
          )}
        </div>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-header">
                <span className="review-user">{rev.userName}</span>
                <span className="review-rating">{"⭐".repeat(rev.rating)}</span>
              </div>
              <p className="review-comment">{rev.comment}</p>
              
              {/* Only show delete button if the logged-in user wrote the review */}
              {user && user.uid === rev.userId && (
                <button onClick={() => handleDelete(rev.id)} className="delete-review-btn">
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
