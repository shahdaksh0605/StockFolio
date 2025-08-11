import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/authcontext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import './register.css';
import { auth, provider, } from "../../../firebase/firebase";
import {
  signInWithPopup,
} from "firebase/auth";

import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setName(user.displayName || "");
      setEmail(user.email || "");

      const response = await fetch("http://localhost:8000/stockfolio/saveuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: user.email, 
          name: user.displayName, 
          firebaseUID: user.uid 
        })
      });
  
      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError('Something went wrong while saving user.');
      }

      
    } catch (error) {
      alert(error.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!name.trim()) return setError('Please enter your name');

    if (!isRegistering) {
      setIsRegistering(true);
      setError('');
      try {

        const backendStatus = await fetch("http://localhost:8000/health");
        if (!backendStatus.ok) throw new Error('Backend is down. Please try again later.');
        else console.log("backend connected")
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const response = await fetch("http://localhost:8000/stockfolio/saveuser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, name, firebaseUID: user.uid })
        });
          console.log(response)
        if (response.ok) {
          navigate('/dashboard')
        } else {
          setError('Something went wrong while saving user.');
        }

      } catch (err) {
        setError(err.message, "okk");
        setIsRegistering(false);
      }
    }
  };


  return (
    <>
      {/* {userLoggedIn && <Navigate to="/dashboard" replace />} */}
      <main className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h3>Create a New Account</h3>
          </div>
          <form onSubmit={onSubmit} className="register-form">
            {/* 👇 Name Input Field */}
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isRegistering}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isRegistering}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isRegistering}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isRegistering}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              disabled={isRegistering}
              className={`submit-button ${isRegistering ? 'disabled' : ''}`}
            >
              {isRegistering ? 'Signing Up...' : 'Sign Up'}
            </button>
            <button onClick={() => handleGoogleSignup()} style={{backgroundColor:"black",marginLeft:"45px "}} className='btn rounded border'><img src="https://www.svgrepo.com/show/475656/google-color.svg" className='m-1' height="30px" width="30px" alt="Google Icon" />{isRegistering ? 'Signing Up...' : 'Continue with Google'}</button>

            <div className="form-footer">
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Continue
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
