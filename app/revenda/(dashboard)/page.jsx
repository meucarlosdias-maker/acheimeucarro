import { createClient } from "@/lib/supabaseServer";
import { Car, AlertTriangle, Clock, Calendar, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const PLANO_LIMITE = { bronze: 5, prata: 10, ouro: 20 };
const PLANO_LABEL = { bronze: "Bronze", prata: "Prata", ouro: "Ouro" };

export default async function RevendaDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: revenda } = await supabase
    .from("revendas")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!revenda) {
    return <div className="text-center py-16 text-muted">Revenda não encontrada.</div>;
  }

  const { count: totalVeiculos } = await supabase
    .from("veiculos")
    .select("*", { count: "exact", head: true })
    .eq("revenda_id", revenda.id);

  const { count: ativos } = await supabase
    .from("veiculos")
    .select("*", { count: "exact", head: true })
    .eq("revenda_id", revenda.id)
    .eq("status", "ativo");

  const { count: vendidos } = await supabase
    .from("veiculos")
    .select("*", { count: "exact", head: true })
    .eq("revenda_id", revenda.id)
    .eq("status", "vendido");

  const limite = PLANO_LIMITE[revenda.plano] || 0;
  const vagasRestantes = Math.max(0, limite - ativos);

  const expirado = revenda.plano_fim && new Date(revenda.plano_fim) < new Date();
  const diasRestantes = revenda.plano_fim
    ? Math.ceil((new Date(revenda.plano_fim) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Dashboard</h1>

      {/* ALERTA DE EXPIRAÇÃO */}
      {expirado && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-600 shrink-0" />
          <div>
            <p className="font-600 text-sm text-red-700">Plano expirado</p>
            <p className="text-xs text-red-600">Seus anúncios estão ocultos do site. Renove o plano para reativá-los.</p>
          </div>
        </div>
      )}

      {!expirado && diasRestantes !== null && diasRestantes <= 5 && (
        <div className={`mb-4 rounded-xl px-5 py-3 flex items-center gap-3 border ${
          diasRestantes <= 1 ? "bg-red-50 border-red-200" :
          diasRestantes <= 2 ? "bg-orange-50 border-orange-200" :
          "bg-yellow-50 border-yellow-200"
        }`}>
          <Clock size={20} className={`shrink-0 ${
            diasRestantes <= 1 ? "text-red-600" :
            diasRestantes <= 2 ? "text-orange-600" :
            "text-yellow-600"
          }`} />
          <div>
            <p className="font-600 text-sm text-ink">Plano expira em {diasRestantes} {diasRestantes === 1 ? "dia" : "dias"}</p>
            <p className="text-xs text-muted">{new Date(revenda.plano_fim).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted font-500">Veículos Ativos</span>
            <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center">
              <Car size={18} className="text-brand-orange" />
            </div>
          </div>
          <p className="font-display font-800 text-2xl text-navy-deep">{ativos}</p>
          <p className="text-xs text-muted mt-1">de {limite} vagas</p>
        </div>

        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted font-500">Vagas Restantes</span>
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-green-600" />
            </div>
          </div>
          <p className="font-display font-800 text-2xl text-navy-deep">{vagasRestantes}</p>
        </div>

        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted font-500">Vendidos</span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="font-display font-800 text-2xl text-navy-deep">{vendidos}</p>
        </div>

        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted font-500">Plano</span>
            <div className="w-9 h-9 rounded-lg bg-navy-deep/10 flex items-center justify-center">
              <Calendar size={18} className="text-navy-deep" />
            </div>
          </div>
          <p className="font-display font-800 text-lg text-navy-deep capitalize">{PLANO_LABEL[revenda.plano] || "—"}</p>
          {revenda.plano_fim && (
            <p className="text-xs text-muted mt-1">Válido até {new Date(revenda.plano_fim).toLocaleDateString("pt-BR")}</p>
          )}
        </div>
      </div>

      {/* INFORMAÇÕES DA REVENDA */}
      <div className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-3">Minha Revenda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <p><span className="text-muted">Nome:</span> <span className="font-500">{revenda.nome}</span></p>
          <p><span className="text-muted">Email:</span> <span className="font-500">{revenda.email || "—"}</span></p>
          <p><span className="text-muted">Telefone:</span> <span className="font-500">{revenda.telefone || "—"}</span></p>
          <p><span className="text-muted">WhatsApp:</span> <span className="font-500">{revenda.whatsapp || "—"}</span></p>
          <p><span className="text-muted">Endereço:</span> <span className="font-500">{revenda.endereco || "—"}</span></p>
          <p><span className="text-muted">CNPJ:</span> <span className="font-500">{revenda.cnpj || "—"}</span></p>
        </div>
      </div>
    </div>
  );
}
