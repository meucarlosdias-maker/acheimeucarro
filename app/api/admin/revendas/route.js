import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function POST(request) {
  try {
    const client = getClient();
    const dados = await request.json();

    if (dados.plano_inicio && dados.plano_duracao_meses) {
      const inicio = new Date(dados.plano_inicio);
      const fim = new Date(inicio);
      fim.setMonth(fim.getMonth() + Number(dados.plano_duracao_meses));
      dados.plano_fim = fim.toISOString().split("T")[0];
    }

    if (dados.id) {
      const { id, ...rest } = dados;
      const { error } = await client.from("revendas").update(rest).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await client.from("revendas").insert(dados);
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
