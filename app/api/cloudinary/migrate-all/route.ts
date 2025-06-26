import { NextResponse } from 'next/server';
import { migrateProductImagesToCloudinary } from '@/lib/cloudinary-migration.server';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const results = await migrateProductImagesToCloudinary(true);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Migration failed', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 