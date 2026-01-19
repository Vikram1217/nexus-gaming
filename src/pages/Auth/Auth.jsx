import React, { useState } from "react";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './Auth.css'

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(false); // Toggle between signup and login
  const [error, setError] = useState('');
  const nav = useNavigate();
  const handleSubmit = async(e) => {
    
    e.preventDefault();
    setError('')
    try{
      if(isLogin){
        await signInWithEmailAndPassword(auth, email, password)
        console.log('Signed in with email/password')
        nav('/')
      }else{
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('created account with email/password')
        nav('/')
      }
    }catch(err){
      setError(err.message)
    }
    return true;
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Login in to Nexus' : 'Create an Account'}</h2>
        
        {error && <p className="auth-error">{error}</p>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn">
        {isLogin ? 'Login' : 'Sign Up'}
        </button> 

         <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New to Nexus? Create an account" : "Already have an account? Login"}
        </p>

      </form>
    </div>
  )
}