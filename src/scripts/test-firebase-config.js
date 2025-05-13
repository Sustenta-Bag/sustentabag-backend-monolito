// Utility script to verify Firebase configuration and connection
import { config } from 'dotenv';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

// Load environment variables
config();

// Print environment variables without values
console.log('Checking Firebase environment variables:');
console.log({
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'Defined' : 'Undefined',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ? 'Defined' : 'Undefined',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'Defined' : 'Undefined',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ? 'Defined' : 'Undefined',
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ? 'Defined' : 'Undefined',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ? 'Defined' : 'Undefined',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'Defined' : 'Undefined',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'Defined (length: ' + 
    process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'Undefined',
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

async function testFirebase() {
  console.log('\nTrying to initialize Firebase...');
  try {
    const app = initializeApp(firebaseConfig);
    console.log('Firebase app initialization successful');
    
    console.log('\nTrying to initialize Firebase Auth...');
    const auth = getAuth(app);
    console.log('Firebase Auth initialization successful');
    
    console.log('\nTrying to sign in anonymously to verify API key...');
    try {
      const userCredential = await signInAnonymously(auth);
      console.log('Anonymous authentication successful! User ID:', userCredential.user.uid);
      console.log('Firebase configuration is working correctly');
    } catch (authError) {
      console.error('Authentication failed:', authError);
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

testFirebase().catch(console.error);
