import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

async function setPublicAndCors() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.error('Missing FIREBASE_PROJECT_ID in .env');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  const bucket = admin.storage().bucket();

  try {
    console.log(`Setting Public Access and CORS for bucket: ${bucket.name}...`);
    
    // 1. Set CORS
    await bucket.setCorsConfiguration([
      {
        origin: ['*'],
        method: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
        responseHeader: ['Content-Type', 'x-goog-resumable'],
        maxAgeSeconds: 3600,
      },
    ]);
    console.log('✅ CORS configuration updated.');

    // 2. Make the bucket public (allow anyone to read)
    // This adds the 'allUsers' member with 'Storage Object Viewer' role
    await bucket.makePublic();
    console.log('✅ Bucket is now public (anyone can view images).');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update bucket permissions:', error);
    process.exit(1);
  }
}

setPublicAndCors();
