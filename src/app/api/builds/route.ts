import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const body = await request.json();
    const { heroId, title, author_name, description, items, arcanas, skills, delete_password } = body;

    if (!heroId || !title || !delete_password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ハッシュ化して保存
    const hashedPassword = crypto.createHash('sha256').update(delete_password).digest('hex');

    const { data, error } = await supabase
      .from('hero_builds')
      .insert({
        hero_id: heroId,
        title,
        author_name: author_name || '匿名',
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
      return NextResponse.json({ error: 'IDとパスワードが必要です' }, { status: 400 });
    }

    // パスワードをハッシュ化して比較用にする
    const hashedPassword = crypto.createHash('sha256').update(delete_password).digest('hex');

    // データベースに登録されているパスワードを取得
    const { data: build, error: fetchError } = await supabase
      .from('hero_builds')
      .select('delete_password')
      .eq('id', id)
      .single();

    if (fetchError || !build) {
      return NextResponse.json({ error: '投稿が見つかりません' }, { status: 404 });
    }

    // 古いデータで delete_password が設定されていない場合は、セキュリティのため削除不可とするか、
    // もしくは NULL であれば無条件で削除できるか。今回は必須にするため、一致しない場合はエラー
    if (build.delete_password !== hashedPassword) {
      return NextResponse.json({ error: 'パスワードが間違っています' }, { status: 403 });
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
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
