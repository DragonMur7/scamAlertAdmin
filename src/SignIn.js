import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { auth } from './firebase';

import './SignIn.css'; // Import the CSS file

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to admin panel or handle successful login
      console.log('Signed in successfully');
      navigate('/admin'); // Navigate to the admin panel on successful sign-in

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signInContainer">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;