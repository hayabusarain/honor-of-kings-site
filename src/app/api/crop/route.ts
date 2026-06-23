import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(process.cwd(), 'public', 'images', 'skills', 'hero_067_4.png');
    fs.writeFileSync(filePath, base64Data, 'base64');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
