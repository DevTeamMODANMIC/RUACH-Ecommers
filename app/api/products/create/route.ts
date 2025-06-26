import { NextRequest, NextResponse } from 'next/server';
import { addProduct } from '@/lib/firebase-products';
import { auth } from '@/lib/firebase-auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication (you should implement proper auth validation)
    // This is a placeholder - in production, use proper auth middleware
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, and category are required' },
        { status: 400 }
      );
    }

    // Ensure Cloudinary images are properly formatted
    if (productData.cloudinaryImages && Array.isArray(productData.cloudinaryImages)) {
      // Validate each cloudinary image has the required fields
      const validImages = productData.cloudinaryImages.every(
        (img: any) => img.publicId && img.url
      );
      
      if (!validImages) {
        return NextResponse.json(
          { error: 'Invalid Cloudinary image format. Each image must have publicId and url' },
          { status: 400 }
        );
      }
    } else if (!productData.images || productData.images.length === 0) {
      // If no Cloudinary images and no regular images, use a default
      productData.images = ['/product_images/unknown-product.jpg'];
    }

    // Add product to Firebase
    const productId = await addProduct({
      ...productData,
      // Ensure all required fields have default values if not provided
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      stockQuantity: productData.stockQuantity || 100,
      origin: productData.origin || '',
      availableCountries: productData.availableCountries || ['United Kingdom'],
      tags: productData.tags || [],
      reviews: productData.reviews || { average: 0, count: 0 },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Product added successfully',
      productId
    });
  } catch (error: any) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product', details: error.message },
      { status: 500 }
    );
  }
} 