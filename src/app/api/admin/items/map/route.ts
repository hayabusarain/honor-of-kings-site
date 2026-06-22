import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { screenshotName, itemId } = await request.json();
    if (!screenshotName || !itemId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const publicDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'images', 'items');
    const rawPath = path.join(publicDir, 'raw', screenshotName);
    const destPath = path.join(publicDir, `${itemId}.png`);

    if (!fs.existsSync(rawPath)) {
      return NextResponse.json({ error: `File not found: ${screenshotName}` }, { status: 404 });
    }

    // Rename (move) the file
    fs.renameSync(rawPath, destPath);

    // Save/update mapping in src/data/item_mappings.json
    const mappingPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'src', 'data', 'item_mappings.json');
    let mapping: Record<string, string> = {};
    if (fs.existsSync(mappingPath)) {
      try {
        mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
      } catch (e) {
        console.error('Failed to parse mapping file:', e);
      }
    }
    mapping[itemId] = screenshotName;
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');

    return NextResponse.json({ success: true, itemId, screenshotName });
  } catch (error: any) {
    console.error('Failed to map item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET to return list of unmapped screenshots and current mappings
export async function GET() {
  try {
    const publicDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'images', 'items');
    const rawDir = path.join(publicDir, 'raw');
    
    let rawScreenshots: string[] = [];
    if (fs.existsSync(rawDir)) {
      rawScreenshots = fs.readdirSync(rawDir)
        .filter(file => file.endsWith('.png'))
        .sort((a, b) => {
          // Sort numerically by the number in "スクリーンショット (xx).png"
          const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
          const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
          return numA - numB;
        });
    }

    const mappingPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'src', 'data', 'item_mappings.json');
    let mappings: Record<string, string> = {};
    if (fs.existsSync(mappingPath)) {
      mappings = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    }

    return NextResponse.json({ rawScreenshots, mappings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
