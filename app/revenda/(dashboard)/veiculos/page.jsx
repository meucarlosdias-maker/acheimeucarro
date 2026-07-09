import Link from "next/link";
import { createClient } from "@/lib/supabaseServer";
import { Plus, Edit, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const PLANO_LIMITE = { bronze: 5, prata: 10, ouro: 20 };

export default async function VeiculosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: revenda } = await supabase
    .from("revendas")
    .select("id, nome, plano")
    .eq("user_id", user.id)
    .single();

  const { data: veiculos } = await supabase
    .from("veiculos")
    .select("id, versao, ano_fab, ano_modelo, km, preco, status, slug, created_at, marca:marcas(nome), modelo:modelos(nome), fotos:veiculo_fotos(url, ordem)")
    .eq("revenda_id", revenda.id)
    .order("created_at", { ascending: false });

  const ativos = (veiculos || []).filter((v) => v.status === "ativo").length;
  const limite = PLANO_LIMITE[revenda.plano] || 0;
  const podeAdicionar = ativos < limite;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-2xl text-navy-deep">Meus Veículos</h1>
          <p className="text-sm text-muted mt-0.5">{ativos} de {limite} vagas ocupadas</p>
        </div>
        {podeAdicionar ? (
          <Link href="/revenda/veiculos/novo" className="flex items-center gap-2 font-600 text-sm px-4 py-2 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity">
            <Plus size={16} /> Novo Veículo
          </Link>
        ) : (
          <span className="text-sm text-muted bg-sand rounded-lg px-4 py-2">Limite do plano atingido</span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand border-b border-line">
              <th className="text-left px-4 py-3 font-600 text-muted">Veículo</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Ano/KM</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Preço</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Status</th>
              <th className="text-right px-4 py-3 font-600 text-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(veiculos || []).map((v) => {
              const foto = (v.fotos || []).sort((a, b) => a.ordem - b.ordem)[0]?.url;
              return (
                <tr key={v.id} className="border-b border-line last:border-0 hover:bg-sand/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded bg-sand overflow-hidden shrink-0">
                        {foto && <img src={foto} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-600 text-ink">{v.marca?.nome} {v.modelo?.nome} {v.versao || ""}</p>
                        <p className="text-xs text-muted">{v.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {v.ano_fab}/{v.ano_modelo} · {Number(v.km).toLocaleString("pt-BR")} km
                  </td>
                  <td className="px-4 py-3 font-600 text-ink whitespace-nowrap">
                    {Number(v.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-600 px-2 py-0.5 rounded-full ${
                      v.status === "ativo" ? "bg-green-100 text-green-700" :
                      v.status === "vendido" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {v.status === "ativo" ? <Eye size={12} /> : v.status === "vendido" ? <CheckCircle size={12} /> : <EyeOff size={12} />}
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/revenda/veiculos/${v.id}`} className="inline-flex items-center gap-1 text-sm font-500 text-navy-deep hover:underline">
                      <Edit size={14} /> Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
            {(!veiculos || veiculos.length === 0) && (
              <tr><td colSpan={5} className="text-center py-10 text-muted">Nenhum veículo cadastrado ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
