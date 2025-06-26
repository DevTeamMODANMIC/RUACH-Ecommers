import { NextResponse, NextRequest } from 'next/server';
import { migrateProductToCloudinary } from '@/lib/cloudinary-migration.server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const result = await migrateProductToCloudinary(id, true);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Migration failed', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 