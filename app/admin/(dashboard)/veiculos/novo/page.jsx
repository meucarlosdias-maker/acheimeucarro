import { createClient } from "@/lib/supabaseServer";
import AdminVeiculoForm from "../AdminVeiculoForm";

export const dynamic = "force-dynamic";

export default async function NovoVeiculoPage() {
  const safeClient = createClient();
  const { data: revendas } = await safeClient.from("revendas").select("id, nome").order("nome");

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Novo Veículo</h1>
      <AdminVeiculoForm revendas={revendas || []} />
    </div>
  );
}
