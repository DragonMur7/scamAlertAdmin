import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase'; // Ensure this import matches your firebase.js setup

// Sign in function
export const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Signed in successfully');
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error; // Optionally throw the error to handle it in the component
  }
};

// Sign out function
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error; // Optionally throw the error to handle it in the component
  }
};