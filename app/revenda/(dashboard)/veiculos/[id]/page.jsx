import { createClient } from "@/lib/supabaseServer";
import VeiculoForm from "../VeiculoForm";

export const dynamic = "force-dynamic";

export default async function EditarVeiculoPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: revenda } = await supabase
    .from("revendas")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: veiculo } = await supabase
    .from("veiculos")
    .select("*, marca:marcas(nome), modelo:modelos(nome), fotos:veiculo_fotos(url, ordem)")
    .eq("id", params.id)
    .eq("revenda_id", revenda.id)
    .single();

  if (!veiculo) {
    return <div className="text-center py-16 text-muted">Veículo não encontrado.</div>;
  }

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Editar Veículo</h1>
      <VeiculoForm revendaId={revenda.id} veiculo={veiculo} />
    </div>
  );
}
