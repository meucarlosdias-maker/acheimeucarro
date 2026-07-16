import { createClient } from "@/lib/supabaseServer";
import { Building2, Car, MapPin, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDados() {
  const safeClient = createClient();

  const [revendas, veiculos, cidades] = await Promise.all([
    safeClient.from("revendas").select("id, plano, status, plano_fim"),
    safeClient.from("veiculos").select("id, status"),
    safeClient.from("cidades").select("id, ativa"),
  ]);

  const expiradas = (revendas.data || []).filter((r) => {
    if (!r.plano_fim) return false;
    return new Date(r.plano_fim) < new Date();
  });

  return {
    totalRevendas: revendas.data?.length ?? 0,
    totalVeiculos: veiculos.data?.length ?? 0,
    totalCidades: cidades.data?.length ?? 0,
    revendasExpiradas: expiradas.length,
  };
}

export default async function AdminDashboard() {
  const dados = await getDados();

  if (!dados) return null;

  const cards = [
    { label: "Revendas", valor: dados.totalRevendas, icon: Building2, cor: "text-brand-orange", bg: "bg-brand-orange/10" },
    { label: "Veículos", valor: dados.totalVeiculos, icon: Car, cor: "text-navy-deep", bg: "bg-navy-deep/10" },
    { label: "Cidades", valor: dados.totalCidades, icon: MapPin, cor: "text-green-600", bg: "bg-green-100" },
    { label: "Planos Expirados", valor: dados.revendasExpiradas, icon: AlertTriangle, cor: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-line p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted font-500">{card.label}</span>
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon size={18} className={card.cor} />
                </div>
              </div>
              <p className="font-display font-800 text-2xl text-navy-deep">{card.valor}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
