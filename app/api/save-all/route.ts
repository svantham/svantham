import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const expectedPin = process.env.ADMIN_PIN || '1234';

    if (!authHeader || authHeader !== `Bearer ${expectedPin}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // 1. Save to Upstash Redis if available
    let savedToRedis = false;
    if (redis) {
      await redis.set('svantham_data', JSON.stringify(body));
      savedToRedis = true;
    }

    // 2. Also write back to data/content.json for local persistence
    try {
      const filePath = path.join(process.cwd(), 'data', 'content.json');
      await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
    } catch (fsErr) {
      // In read-only serverless environments, writing to disk might fail; that's fine if Redis is used.
      if (!savedToRedis) {
        console.warn('Could not write to local content.json and Redis is not configured:', fsErr);
      }
    }

    return NextResponse.json({ success: true, savedToRedis });
  } catch (error: any) {
    console.error('Save error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
