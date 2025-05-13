// Debug script to verify Firebase configuration
console.log('Firebase Configuration Debug');
console.log('---------------------------');

// Check environment variables without showing sensitive values
console.log('Environment Variables:');
console.log(`FIREBASE_API_KEY: ${process.env.FIREBASE_API_KEY ? 'Present (length: ' + 
  process.env.FIREBASE_API_KEY.length + ')' : 'Missing!'}`);
console.log(`FIREBASE_AUTH_DOMAIN: ${process.env.FIREBASE_AUTH_DOMAIN || 'Missing!'}`);
console.log(`FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID || 'Missing!'}`);
console.log(`FIREBASE_STORAGE_BUCKET: ${process.env.FIREBASE_STORAGE_BUCKET || 'Missing!'}`);
console.log(`FIREBASE_MESSAGING_SENDER_ID: ${process.env.FIREBASE_MESSAGING_SENDER_ID || 'Missing!'}`);
console.log(`FIREBASE_APP_ID: ${process.env.FIREBASE_APP_ID ? 'Present' : 'Missing!'}`);
console.log(`FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL || 'Missing!'}`);
console.log(`FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? 
  'Present (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'Missing!'}`);

// Check if the environment variables can be loaded correctly
try {
  const dotenv = require('dotenv');
  console.log('\nLoading .env file result:', dotenv.config());
} catch (err) {
  console.log('\nError loading dotenv:', err.message);
}

// Check Node.js version and other system info
console.log('\nSystem Information:');
console.log(`Node.js: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`User: ${process.env.USER || process.env.USERNAME || 'Unknown'}`);

// List files in the current directory
const fs = require('fs');
console.log('\nFiles in current directory:');
try {
  fs.readdirSync('.').forEach(file => {
    console.log(file);
  });
} catch (err) {
  console.log('Error listing files:', err.message);
}

// List files in the src directory
console.log('\nFiles in src directory:');
try {
  fs.readdirSync('./src').forEach(file => {
    console.log(`src/${file}`);
  });
} catch (err) {
  console.log('Error listing src files:', err.message);
}
