import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBGKzfVeaQS6Npdlt1cE9SO-yDVykjF9qc',
    authDomain: 'scamalert-3e1dc.firebaseapp.com',
    projectId: 'scamalert-3e1dc',
    storageBucket: 'scamalert-3e1dc.appspot.com',
    messagingSenderId: '78989433990',
    appId: '1:78989433990:android:69d299582ee9058c1ac507',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
