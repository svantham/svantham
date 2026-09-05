import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || `https://${bucketName}.r2.dev`;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      return NextResponse.json({
        error: 'Cloudflare R2 credentials not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in environment variables.'
      }, { status: 400 });
    }

    const { filename, contentType } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const ext = filename.split('.').pop() || 'png';
    const cleanBase = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueKey = `uploads/${cleanBase}_${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      ContentType: contentType || 'application/octet-stream',
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${uniqueKey}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      key: uniqueKey,
      publicUrl,
    });
  } catch (error: any) {
    console.error('R2 Presigned URL error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
