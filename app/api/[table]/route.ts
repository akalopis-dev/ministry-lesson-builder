import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { TABLES, isTableName } from "@/lib/data-tables";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  if (!isTableName(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }
  const supabaseServer = getSupabaseServer();

  const { count, error: countError } = await supabaseServer
    .from(table)
    .select("id", { count: "exact", head: true });

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const seed = TABLES[table].seed;
  if (count === 0 && seed && seed.length > 0) {
    const rows = seed.map((item) => ({ id: item.id, data: item }));
    const { error: seedError } = await supabaseServer
      .from(table)
      .upsert(rows, { onConflict: "id", ignoreDuplicates: true });
    if (seedError) {
      return NextResponse.json({ error: seedError.message }, { status: 500 });
    }
  }

  const { data, error } = await supabaseServer.from(table).select("data");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map((row) => row.data));
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  if (!isTableName(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }

  const body = await request.json();
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Body must include an id" }, { status: 400 });
  }

  const { error } = await getSupabaseServer()
    .from(table)
    .upsert({ id: body.id, data: body, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
