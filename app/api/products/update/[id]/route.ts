import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, getProduct } from '@/lib/firebase-products';
import { auth } from '@/lib/firebase-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verify admin authentication (you should implement proper auth validation)
    // This is a placeholder - in production, use proper auth middleware
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if product exists
    const existingProduct = await getProduct(id);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
    }

    // Update product in Firebase
    await updateProduct(id, {
      ...productData,
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      productId: id
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
} 