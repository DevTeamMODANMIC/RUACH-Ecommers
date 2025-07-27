import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
// import { verifyAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

// Create a server-side API endpoint for authenticated Cloudinary uploads
export async function POST(request: NextRequest) {
  try {
    // Log the entire incoming request for debugging
    const data = await request.json();
    console.log('Incoming upload request:', {
      fileType: data.file?.type,
      fileSize: data.file?.base64?.length,
      options: data.options,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    });

    // Validate file data
    if (!data.file || !data.file.base64) {
      console.error('Missing file data in upload request');
      return NextResponse.json({ 
        error: {
          message: 'Missing file data',
          details: 'No base64 file data provided'
        }
      }, { status: 400 });
    }

    // Validate upload preset configuration
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset) {
      console.error('Upload preset is not configured');
      return NextResponse.json({ 
        error: {
          message: 'Upload configuration error',
          details: 'Upload preset is missing in environment configuration'
        }
      }, { status: 500 });
    }

    if (!cloudName) {
      console.error('Cloud name is not configured');
      return NextResponse.json({ 
        error: {
          message: 'Upload configuration error',
          details: 'Cloud name is missing in environment configuration'
        }
      }, { status: 500 });
    }

    // Prepare upload options with extensive logging
    const uploadOptions = {
      folder: data.options?.folder || 'ruach_ecommerce_products',
      upload_preset: uploadPreset,
      timeout: 120000, // 2 minutes
      chunk_size: 6_000_000, // 6 MB chunks
      ...data.options
    };

    console.log('Cloudinary upload options:', {
      folder: uploadOptions.folder,
      upload_preset: uploadOptions.upload_preset,
      cloud_name: cloudName,
      full_upload_preset_env: uploadPreset
    });

    try {
      // Explicitly pass upload_preset
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(
          data.file.base64, 
          {
            ...uploadOptions,
            upload_preset: uploadOptions.upload_preset
          }, 
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload callback error:', {
                error_code: error.http_code,
                error_message: error.message,
                error_details: JSON.stringify(error)
              });
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      console.log('Cloudinary upload successful:', {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: data.file.name || 'product-image'
      });

      return NextResponse.json({
        success: true,
        result: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          original_filename: data.file.name || 'product-image'
        }
      });
    } catch (cloudinaryError: any) {
      console.error('Cloudinary upload error:', {
        message: cloudinaryError.message,
        error_code: cloudinaryError.http_code,
        error_details: JSON.stringify(cloudinaryError.error || 'Unknown Cloudinary error'),
        full_error: JSON.stringify(cloudinaryError)
      });

      return NextResponse.json({ 
        error: {
          message: cloudinaryError.message || 'Cloudinary upload failed',
          code: cloudinaryError.http_code,
          details: JSON.stringify(cloudinaryError.error || 'Unknown Cloudinary error')
        }
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Server-side upload error:', {
      message: error.message,
      stack: error.stack,
      full_error: JSON.stringify(error)
    });

    return NextResponse.json({ 
      error: {
        message: error.message || 'Failed to process upload',
        details: JSON.stringify(error)
      }
    }, { status: 500 });
  }
} 