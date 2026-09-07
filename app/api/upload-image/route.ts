import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const expectedPin = process.env.ADMIN_PIN || '1234';

    if (!authHeader || authHeader !== `Bearer ${expectedPin}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || 'svantham';
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || `https://${bucketName}.r2.dev`;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      return NextResponse.json({
        error: 'Cloudflare R2 credentials not configured.'
      }, { status: 400 });
    }

    // Accept multipart/form-data with the actual file
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    const ext = file.name.split('.').pop() || 'bin';
    const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueKey = `images/${cleanBase}_${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type || 'application/octet-stream',
    }));

    const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${uniqueKey}`;

    return NextResponse.json({ success: true, publicUrl, key: uniqueKey });
  } catch (error: any) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
