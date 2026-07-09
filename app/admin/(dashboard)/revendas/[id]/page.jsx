import RevendaForm from "../RevendaForm";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import AdminSetupMessage from "@/components/AdminSetupMessage";

export const dynamic = "force-dynamic";

export default async function EditarRevendaPage({ params }) {
  const safeClient = supabaseAdmin || createClient();
  if (!safeClient) return <AdminSetupMessage />;

  const id = params.id;

  const { data: cidades } = await safeClient
    .from("cidades")
    .select("id, nome, uf")
    .order("nome");

  const { data: revenda } = await safeClient
    .from("revendas")
    .select("*")
    .eq("id", id)
    .single();

  if (!revenda) {
    return <div className="text-center py-16 text-muted">Revenda não encontrada.</div>;
  }

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Editar Revenda</h1>
      <RevendaForm cidades={cidades || []} revenda={revenda} />
    </div>
  );
}
