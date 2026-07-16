import { createClient } from "@/lib/supabaseServer";
import AdminVeiculoForm from "../AdminVeiculoForm";

export const dynamic = "force-dynamic";

export default async function EditarVeiculoPage({ params }) {
  const { id } = await params;
  const safeClient = createClient();

  const { data: revendas } = await safeClient.from("revendas").select("id, nome").order("nome");

  const { data: veiculo } = await safeClient
    .from("veiculos")
    .select("*, marca:marcas(nome), modelo:modelos(nome), fotos:veiculo_fotos(url, ordem)")
    .eq("id", id)
    .single();

  if (!veiculo) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-lg">Veículo não encontrado.</p>
      </div>
    );
  }

  const veiculoForm = {
    ...veiculo,
    ano_fab: veiculo.ano_fab ? Number(veiculo.ano_fab) : veiculo.ano_fab,
    ano_modelo: veiculo.ano_modelo ? Number(veiculo.ano_modelo) : veiculo.ano_modelo,
    preco: Number(veiculo.preco),
    km: Number(veiculo.km),
    fotos: (veiculo.fotos || []).sort((a, b) => a.ordem - b.ordem).map((f) => ({ url: f.url, ordem: f.ordem })),
  };

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">
        Editar {veiculo.marca?.nome} {veiculo.modelo?.nome}
      </h1>
      <AdminVeiculoForm revendas={revendas || []} veiculo={veiculoForm} />
    </div>
  );
}
