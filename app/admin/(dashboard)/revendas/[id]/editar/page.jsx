import RevendaForm from "../../RevendaForm";
import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditarRevendaPage({ params }) {
  const safeClient = createClient();

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
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/revendas/${revenda.id}`} className="text-muted hover:text-ink transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <h1 className="font-display font-700 text-2xl text-navy-deep">Editar Revenda</h1>
      </div>
      <RevendaForm cidades={cidades || []} revenda={revenda} />
    </div>
  );
}
