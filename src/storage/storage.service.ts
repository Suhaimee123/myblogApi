import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements OnModuleInit {
  private storage: admin.storage.Storage;

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
    this.storage = admin.storage();
  }

  /**
   * Generates a signed URL for direct client-side upload with custom path
   */
  async getSignedUrl(filename: string, contentType: string, folder: string = 'blog'): Promise<{ uploadUrl: string, publicUrl: string }> {
    const bucket = this.storage.bucket();
    
    // Structure: folder/unique-id-filename
    const uniqueFilename = `${folder}/${uuidv4()}-${filename}`;
    const file = bucket.file(uniqueFilename);

    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
    
    return { uploadUrl, publicUrl };
  }

  /**
   * Deletes a file from Firebase Storage given its public URL or path
   */
  async deleteFile(fileUrl: string): Promise<void> {
    const bucket = this.storage.bucket();
    console.log(`[Storage] Attempting to delete file: ${fileUrl}`);
    
    try {
      // Improved path extraction: Look for the bucket name or the /o/ in the URL
      let filePath = '';
      if (fileUrl.includes(bucket.name)) {
        filePath = fileUrl.split(`${bucket.name}/`)[1];
      } else {
        // Fallback for different URL formats
        const parts = fileUrl.split('/');
        filePath = parts.slice(4).join('/'); // Skip https://storage.googleapis.com/bucket-name/
      }

      // Remove query parameters if any
      filePath = filePath.split('?')[0];
      
      console.log(`[Storage] Extracted file path: ${filePath}`);
      const file = bucket.file(filePath);
      
      const [exists] = await file.exists();
      if (!exists) {
        console.warn(`[Storage] File does not exist in Firebase: ${filePath}`);
        return;
      }

      await file.delete();
      console.log(`[Storage] ✅ Successfully deleted: ${filePath}`);
    } catch (error) {
      console.error('[Storage] ❌ Failed to delete file:', error.message);
      throw error;
    }
  }
}
