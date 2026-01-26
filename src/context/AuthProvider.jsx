import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/config';

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Once we get a response, we stop loading
    });

    return () => unsubscribe();
  }, []);

  // NEW: Function to force a state update when profile changes
  const refreshUser = async () => {
    // 1. Tell Firebase to refresh the user tokens/metadata from the server
    await auth.currentUser.reload();
    // 2. Grab that refreshed user and update our state
    // We spread it {...auth.currentUser} to ensure React sees it as a NEW object 
    // and triggers a re-render across the whole app.
    setUser({ ...auth.currentUser });
  };

  const logOut = () => {
    return signOut(auth)
  }

  const value = {
    user,
    logOut,
    loading,
    refreshUser
  }
  
  return (
   <AuthContext.Provider value={value}>
    {children}
   </AuthContext.Provider>
  )
}
