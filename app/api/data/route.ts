import { NextResponse } from 'next/server';
import { getSvanthamData } from '@/lib/get-data';

export async function GET() {
  try {
    const data = await getSvanthamData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
