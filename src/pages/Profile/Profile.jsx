import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { storage, auth } from "../../firebase/config";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Heart, MessageSquare, Calendar, Camera } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import Modal from "../../components/Modal/Modal";
import './Profile.css'
export const Profile = () => {

  const {user, refreshUser} = useAuth();
  const [stats, setStats] = useState({wishlist: 0, reviews: 0});
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  //File upload states for uploading for avatar
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleImageChange = async(e) => {
    const file = e.target.files[0];

    if(!file) return;

    try
    {
      setUploading(true)
      //1. Create a reference in storage (folder: avatar, filename: userId)
      const storageRef = ref(storage, `avatars/${user.uid}`);

      //2. Upload the file
      await uploadBytes(storageRef, file)

      //3. Get the url of the uploaded image
      const photoURL = await getDownloadURL(storageRef)

      //4. Update the users firebase Auth Profile
      await updateProfile(auth.currentUser, { photoURL: photoURL });
      
      await refreshUser();
      toast.success("Profile picture updated!");

    } catch (err) {
      console.error(err);
      toast.error("Could not upload image")
    } finally {
      setUploading(false);
    }

  }

  useEffect(() => {
    if(!user) return;

    const fetchProfileData = async() => {

      try {
        setLoading(true);

        //Get wishlist count
        const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
        const wishListSnap = await getDocs(wishlistRef);

        // Get users personal reviews
        const reviewRef = collection(db, 'reviews');
        const q = query(reviewRef, where("userId", "==", user.uid), orderBy("updatedAt", "desc"));
        const reviewSnap = await getDocs(q);

        const reviewsData = reviewSnap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setStats({wishlist: wishListSnap.size, reviews: reviewSnap.size})
        setUserReviews(reviewsData);
        setLoading(false);        
      } catch (error){
        console.log("Error retrieving wishlist: ", error)
        setLoading(false);
      }
    }

    fetchProfileData();
  },[user]);

  const handleDeleteClick = (rev) => {
    setSelectedReview(rev);
    setIsModalOpen(true);
  };

const handleConfirmDelete = async () => {
  if (!selectedReview) return;
  
  try {
    await deleteDoc(doc(db, 'reviews', selectedReview.id));
    setUserReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));
    setStats((prev) => ({ ...prev, reviews: prev.reviews - 1 }));
    toast.success("Review deleted!");
  } catch (err) {
    toast.error("Error deleting review.", err);
  }
};

  if (loading) return <div className="loader">Loading Profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-container">
            {user.photoURL ? (              
              <img src={user.photoURL} alt="Avatar" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-large">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Hidden Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
              accept="image/*"
            />

            {/* Custom Button to trigger input */}
            <button 
              className="edit-avatar-btn" 
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              <Camera size={16} />
              {uploading ? "..." : "Edit"}
            </button>
          </div>
          <div className="profile-id">
            <h2>{user?.email?.split('@')[0]}</h2>
            <div className="member-date">
              <Calendar size={16} />
              <span>Joined: {new Date(user?.metadata.creationTime).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats-row">
          <div className="stat-item">
            <Heart color="#00ffcc" size={20} />
            <strong>{stats.wishlist}</strong>
            <span>Wishlisted</span>
          </div>
          <div className="stat-item">
            <MessageSquare color="#00ffcc" size={20} />
            <strong>{stats.reviews}</strong>
            <span>Reviews</span>
          </div>
        </div>
      </div>

      <div className="profile-history">
        <h3>Your Review History</h3>
        {userReviews.length === 0 ? (
          <p className="no-data">You haven't written any reviews yet. Browse some games to start!</p>
        ) : (
          userReviews.map((rev) => {
            // SAFE DATE LOGIC:
            // 1. We check if updatedAt exists.
            // 2. We check if it has the .toDate function (Firebase Timestamp specific).
            // 3. If not, we show "Just now..." as a fallback.
            const dateString = rev.updatedAt?.toDate 
              ? rev.updatedAt.toDate().toLocaleDateString() 
              : "Just now...";

            return (
              <div key={rev.id} className="history-card">
                <div className="history-header">
                  <h4>{rev.gameTitle}</h4>
                  <div className="history-stars">{"⭐".repeat(rev.rating)}</div>
                </div>
                <p>"{rev.comment}"</p>
                {/* Use our safe dateString variable here */}
                <small>Last updated: {dateString}</small>
                <button className="delete-review-btn" onClick={() => handleDeleteClick(rev)}>Delete Review</button>
              </div>
            );
          })
        )}
      </div>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Review?"
        message={`Are you sure you want to permanently delete your review for ${selectedReview?.gameTitle}?`}
      />
    </div>
  );

}