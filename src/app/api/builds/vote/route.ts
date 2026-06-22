import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { buildId, action } = await request.json();

    if (!buildId || !action) {
      return NextResponse.json({ error: 'Missing buildId or action' }, { status: 400 });
    }

    // Call Supabase RPC to safely increment/decrement
    // If RPC is not defined, we'll do a basic fetch and update.
    // Note: In production, use RPC to avoid race conditions.
    const { data: current, error: fetchError } = await supabase
      .from('hero_builds')
      .select('upvotes')
      .eq('id', buildId)
      .single();

    if (fetchError) throw fetchError;

    const newUpvotes = action === 'add' ? current.upvotes + 1 : Math.max(0, current.upvotes - 1);

    const { error: updateError } = await supabase
      .from('hero_builds')
      .update({ upvotes: newUpvotes })
      .eq('id', buildId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, upvotes: newUpvotes });
  } catch (error) {
    console.error('Error voting on build:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
