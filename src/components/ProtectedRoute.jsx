import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({children}) => {
  const {user} = useAuth();

  if(!user){
    // 'replace' is a nice touch. It prevents the user from clicking 'Back' and getting stuck in a loop
    return (
      <Navigate to="/" replace />
    )
  }

  // 2. If there IS a user, render the children (the page they wanted)
  return children;
};
