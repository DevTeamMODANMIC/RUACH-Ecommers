import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
// import { verifyAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

// Create a server-side API endpoint for authenticated Cloudinary uploads
export async function POST(request: NextRequest) {
  try {
    // IMPORTANT: Authentication is temporarily bypassed for development.
    // TODO: Before deploying to production, re-enable Firebase auth verification.
    /*
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const authUser = await verifyAuth(token);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    */

    const data = await request.json();
    const { file, options } = data;

    if (!file || !file.base64) {
      return NextResponse.json({ error: 'Missing file data' }, { status: 400 });
    }

    const uploadOptions = {
      folder: 'ruach_ecommerce_products', // Specific folder for this app
      ...options
    };

    const result = await cloudinary.uploader.upload(file.base64, uploadOptions);

    return NextResponse.json({
      success: true,
      result: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: file.name || 'product-image'
      }
    });
    
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to upload image' 
    }, { status: 500 });
  }
} 