import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const heroId = searchParams.get('heroId');

  if (!heroId) {
    return NextResponse.json({ error: 'Missing heroId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('hero_counters')
    .select('*')
    .eq('hero_id', heroId);

  if (error) {
    console.warn("Supabase error ignored for hero_counters:", error.message);
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { heroId, counterHeroId, voteType, action } = body;

    if (!heroId || !counterHeroId || !voteType || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Find existing record
    const { data: existing, error: findError } = await supabase
      .from('hero_counters')
      .select('*')
      .eq('hero_id', heroId)
      .eq('counter_hero_id', counterHeroId)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (existing) {
      // Update existing record
      let updates = {
        upvotes: existing.upvotes || 0,
        downvotes: existing.downvotes || 0
      };

      if (voteType === 'up') {
        if (action === 'add') updates.upvotes += 1;
        if (action === 'remove') updates.upvotes = Math.max(0, updates.upvotes - 1);
      } else if (voteType === 'down') {
        if (action === 'add') updates.downvotes += 1;
        if (action === 'remove') updates.downvotes = Math.max(0, updates.downvotes - 1);
      }

      const { data: updated, error: updateError } = await supabase
        .from('hero_counters')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      return NextResponse.json({ data: updated });
    } else {
      // Create new record
      if (action === 'remove') {
        return NextResponse.json({ error: 'Cannot remove from non-existent record' }, { status: 400 });
      }

      const newRecord = {
        hero_id: heroId,
        counter_hero_id: counterHeroId,
        upvotes: voteType === 'up' ? 1 : 0,
        downvotes: voteType === 'down' ? 1 : 0
      };

      const { data: inserted, error: insertError } = await supabase
        .from('hero_counters')
        .insert(newRecord)
        .select()
        .single();

      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
      return NextResponse.json({ data: inserted });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
