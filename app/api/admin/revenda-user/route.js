import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Criação de usuário exige SUPABASE_SERVICE_ROLE_KEY no .env.local" }, { status: 500 });
  }

  try {
    const { revendaId, email, password } = await request.json();

    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) throw createError;

    const { error: updateError } = await supabaseAdmin
      .from("revendas")
      .update({ user_id: user.user.id })
      .eq("id", revendaId);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true, userId: user.user.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
