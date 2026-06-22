import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ITEMS_FILE_PATH = path.join(/*turbopackIgnore: true*/ process.cwd(), 'src', 'data', 'physical_items_final.json');

export async function POST(req: Request) {
  try {
    // 開発環境（ローカル）でのみ許可
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment) {
      return NextResponse.json({ error: 'Forbidden: Local environment only' }, { status: 403 });
    }

    const body = await req.json();
    const { itemId, stats, passives } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId parameter' }, { status: 400 });
    }

    if (!fs.existsSync(ITEMS_FILE_PATH)) {
      return NextResponse.json({ error: 'Items data file not found' }, { status: 404 });
    }

    // Read existing items
    const itemsData = JSON.parse(fs.readFileSync(ITEMS_FILE_PATH, 'utf-8'));
    
    // Find item
    const itemIndex = itemsData.findIndex((item: any) => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: `Item not found: ${itemId}` }, { status: 404 });
    }

    // Update item stats & passives
    if (stats !== undefined) {
      if (!Array.isArray(stats)) {
        return NextResponse.json({ error: 'Stats must be an array of strings' }, { status: 400 });
      }
      itemsData[itemIndex].stats = stats;
    }

    if (passives !== undefined) {
      if (!Array.isArray(passives)) {
        return NextResponse.json({ error: 'Passives must be an array of objects' }, { status: 400 });
      }
      for (const p of passives) {
        if (typeof p !== 'object' || typeof p.name !== 'string' || typeof p.description !== 'string') {
          return NextResponse.json({ error: 'Invalid passive structure' }, { status: 400 });
        }
      }
      itemsData[itemIndex].passives = passives;
    }

    // Write back to file
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(itemsData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, item: itemsData[itemIndex] });

  } catch (error: any) {
    console.error('Failed to update item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
