import { createClient } from "@/lib/supabaseServer";
import VeiculoForm from "../VeiculoForm";

export const dynamic = "force-dynamic";

const PLANO_LIMITE = { bronze: 5, prata: 10, ouro: 20 };

export default async function NovoVeiculoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: revenda } = await supabase
    .from("revendas")
    .select("id, plano")
    .eq("user_id", user.id)
    .single();

  const { count: ativos } = await supabase
    .from("veiculos")
    .select("*", { count: "exact", head: true })
    .eq("revenda_id", revenda.id)
    .eq("status", "ativo");

  const limite = PLANO_LIMITE[revenda.plano] || 0;

  if (ativos >= limite) {
    return (
      <div className="text-center py-16">
        <h2 className="font-display font-700 text-xl text-navy-deep mb-2">Limite do plano atingido</h2>
        <p className="text-sm text-muted">Seu plano {revenda.plano} permite até {limite} veículos ativos. Marque um como vendido para liberar vaga.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Novo Veículo</h1>
      <VeiculoForm revendaId={revenda.id} />
    </div>
  );
}
