import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { image, filename } = await req.json();
    if (!image) {
      return NextResponse.json({ success: false, error: 'Missing image data' }, { status: 400 });
    }
    const safeFilename = filename && typeof filename === 'string' && /^[a-zA-Z0-9_-]+\.png$/.test(filename) 
      ? filename 
      : `crop_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`;
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const dirPath = path.join(process.cwd(), 'public', 'images', 'skills');
    await fs.promises.mkdir(dirPath, { recursive: true });
    const filePath = path.join(dirPath, safeFilename);
    await fs.promises.writeFile(filePath, base64Data, 'base64');
    return NextResponse.json({ success: true, filename: safeFilename });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to save image' }, { status: 500 });
  }
}
