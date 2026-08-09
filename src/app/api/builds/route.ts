import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/api-auth';
import { z } from 'zod';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const buildSchema = z.object({
  heroId: z.string(),
  title: z.string().max(100),
  delete_password: z.string(),
  description: z.string().max(500).optional(),
  author_name: z.string().max(50).optional(),
  items: z.array(z.any()).optional(),
  arcanas: z.record(z.string(), z.any()).optional(),
  skills: z.array(z.any()).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const heroId = searchParams.get('heroId');

  if (!heroId) {
    return NextResponse.json({ error: 'Missing heroId' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('hero_builds')
      .select('id, hero_id, title, author_name, description, items, arcanas, skills, upvotes, created_at')
      .eq('hero_id', heroId)
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching builds:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = buildSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
    }

    const { heroId, title, author_name, description, items, arcanas, skills, delete_password } = parsed.data;

    // ハッシュ化して保存
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256').update(delete_password + salt).digest('hex');
    const hashedPassword = `${salt}:${hash}`;

    const { data, error } = await supabase
      .from('hero_builds')
      .insert({
        hero_id: heroId,
        title,
        author_name: author_name || '',
        description,
        items: items || [],
        arcanas: arcanas || {},
        skills: skills || [],
        delete_password: hashedPassword
      })
      .select('id, hero_id, title, author_name, description, items, arcanas, skills, upvotes, created_at')
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error submitting build:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, delete_password } = body;

    if (!id || !delete_password) {
      return NextResponse.json({ error: 'MISSING_AUTH' }, { status: 400 });
    }

    const { data: build, error: fetchError } = await supabase
      .from('hero_builds')
      .select('delete_password')
      .eq('id', id)
      .single();

    if (fetchError || !build || !build.delete_password) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }

    const [salt, storedHash] = build.delete_password.split(':');
    if (!salt || !storedHash) {
      return NextResponse.json({ error: 'INVALID_STORED_PASSWORD' }, { status: 500 });
    }

    const hashToCompare = crypto.createHash('sha256').update(delete_password + salt).digest('hex');

    if (storedHash !== hashToCompare) {
      return NextResponse.json({ error: 'WRONG_PASSWORD' }, { status: 403 });
    }

    // 削除実行
    const { error: deleteError } = await supabase
      .from('hero_builds')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting build:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
