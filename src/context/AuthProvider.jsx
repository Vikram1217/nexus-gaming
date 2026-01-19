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

  const logOut = () => {
    return signOut(auth)
  }

  const value = {
    user,
    logOut,
    loading
  }
  
  return (
   <AuthContext.Provider value={value}>
    {children}
   </AuthContext.Provider>
  )
}
