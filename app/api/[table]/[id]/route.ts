import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { isTableName } from "@/lib/data-tables";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ table: string; id: string }> }) {
  const { table, id } = await params;
  if (!isTableName(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }

  const { error } = await getSupabaseServer().from(table).delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
