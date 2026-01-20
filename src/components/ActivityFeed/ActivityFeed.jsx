import React, {useState, useEffect} from 'react'
import { db } from '../../firebase/config'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './ActivityFeed.css';

export const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Point to the reviews collection
    const reviewsRef = collection(db, "reviews");

    // Query the top five most recently updated reviews across the whole site
    const q = query(reviewsRef, orderBy("updatedAt", 'desc'), limit(5));

    //set up the listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feed = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      setActivities(feed)
      console.log("feed: ", feed)
    })
    return () => unsubscribe;
  }, []);

  return (
    <div className="activity-feed">
      <h4>Recent Activity 🚀</h4>
      {activities.length === 0 ? (
        <p>No activity yet...</p>
      ) : (
        activities.map(act => (
          <div key={act.id} className="feed-item">
            <p>
              <strong>{act.userName}</strong> reviewed{' '}
              <Link to={`/game/${act.gameId}`}>{act.gameTitle}</Link>
              <p className="feed-comment">
                "{act.comment?.length > 60 
                  ? act.comment.substring(0, 60) + "..." 
                  : act.comment}"
              </p>
            </p>
            <div className="feed-rating">{"⭐".repeat(act.rating)}</div>
          </div>
        ))
      )}
    </div>
  );
}
