import RevendaForm from "../RevendaForm";
import { createClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function NovaRevendaPage() {
  const safeClient = createClient();

  const { data: cidades } = await safeClient
    .from("cidades")
    .select("id, nome, uf")
    .order("nome");

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Nova Revenda</h1>
      <RevendaForm cidades={cidades || []} />
    </div>
  );
}
