import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function getClient() {
  if (supabaseAdmin) return supabaseAdmin;
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
}

export async function POST(request) {
  try {
    const client = getClient();
    const { tipo, banners } = await request.json();

    const tabela = tipo === "hero" ? "banners_hero" : "banners_promocionais";

    await client.from(tabela).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    for (let i = 0; i < banners.length; i++) {
      const { id, created_at, ...rest } = banners[i];
      const { error } = await client.from(tabela).insert({ ...rest, ordem: i });
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
