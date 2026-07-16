import Link from "next/link";
import { createClient } from "@/lib/supabaseServer";
import { Edit, Car, CheckCircle, XCircle, Clock, Eye, EyeOff, MapPin, Phone, Mail, Globe, User, Building2, CreditCard, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

const PLANO_LABEL = { bronze: "Bronze", prata: "Prata", ouro: "Ouro" };
const PLANO_LIMITE = { bronze: 5, prata: 10, ouro: 20 };
const STATUS_BADGE = {
  aprovada: "bg-green-100 text-green-700",
  pendente: "bg-yellow-100 text-yellow-700",
  bloqueada: "bg-red-100 text-red-700",
};

export default async function DetalhesRevendaPage({ params }) {
  const safeClient = createClient();

  const id = params.id;

  const { data: revenda } = await safeClient
    .from("revendas")
    .select("*, cidade:cidades(nome, uf)")
    .eq("id", id)
    .single();

  if (!revenda) {
    return <div className="text-center py-16 text-muted">Revenda não encontrada.</div>;
  }

  const { data: veiculos } = await safeClient
    .from("veiculos")
    .select("id, versao, ano_fab, ano_modelo, km, preco, status, slug, created_at, marca:marcas(nome), modelo:modelos(nome), fotos:veiculo_fotos(url, ordem)")
    .eq("revenda_id", revenda.id)
    .order("created_at", { ascending: false });

  const ativos = (veiculos || []).filter((v) => v.status === "ativo").length;
  const vendidos = (veiculos || []).filter((v) => v.status === "vendido").length;
  const limite = PLANO_LIMITE[revenda.plano] || 0;
  const expirado = revenda.plano_fim && new Date(revenda.plano_fim) < new Date();
  const diasRestantes = revenda.plano_fim
    ? Math.ceil((new Date(revenda.plano_fim) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/revendas" className="text-muted hover:text-ink transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <h1 className="font-display font-700 text-2xl text-navy-deep">{revenda.nome}</h1>
        </div>
        <Link
          href={`/admin/revendas/${revenda.id}/editar`}
          className="flex items-center gap-2 font-600 text-sm px-4 py-2 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity"
        >
          <Edit size={16} /> Editar Revenda
        </Link>
      </div>

      {/* Status + Plano alerts */}
      {expirado && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-600 shrink-0" />
          <div>
            <p className="font-600 text-sm text-red-700">Plano expirado</p>
            <p className="text-xs text-red-600">Os anúncios desta revenda estão ocultos do site.</p>
          </div>
        </div>
      )}

      {revenda.status === "pendente" && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <Clock size={20} className="text-yellow-600 shrink-0" />
          <div>
            <p className="font-600 text-sm text-yellow-700">Revenda pendente</p>
            <p className="text-xs text-yellow-600">Esta revenda ainda não foi aprovada.</p>
          </div>
        </div>
      )}

      {revenda.status === "bloqueada" && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <XCircle size={20} className="text-red-600 shrink-0" />
          <div>
            <p className="font-600 text-sm text-red-700">Revenda bloqueada</p>
            <p className="text-xs text-red-600">Esta revenda está bloqueada e não pode gerenciar anúncios.</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
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
            <span className="text-sm text-muted font-500">Vendidos</span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="font-display font-800 text-2xl text-navy-deep">{vendidos}</p>
        </div>

        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted font-500">Plano</span>
            <div className="w-9 h-9 rounded-lg bg-navy-deep/10 flex items-center justify-center">
              <CreditCard size={18} className="text-navy-deep" />
            </div>
          </div>
          <p className="font-display font-800 text-lg text-navy-deep">{PLANO_LABEL[revenda.plano] || "—"}</p>
          {revenda.plano_fim && (
            <p className={`text-xs mt-1 ${expirado ? "text-red-600" : "text-muted"}`}>
              {expirado ? "Expirado" : `Válido até ${new Date(revenda.plano_fim).toLocaleDateString("pt-BR")}`}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted font-500">Status</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              revenda.status === "aprovada" ? "bg-green-100" :
              revenda.status === "pendente" ? "bg-yellow-100" : "bg-red-100"
            }`}>
              {revenda.status === "aprovada" ? <CheckCircle size={18} className="text-green-600" /> :
               revenda.status === "pendente" ? <Clock size={18} className="text-yellow-600" /> :
               <XCircle size={18} className="text-red-600" />}
            </div>
          </div>
          <span className={`text-sm font-600 px-2 py-0.5 rounded-full ${STATUS_BADGE[revenda.status] || ""}`}>
            {revenda.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenda Info */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-line p-6">
          <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Informações da Revenda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Building2 size={16} className="text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-muted text-xs">Nome</p>
                <p className="font-500 text-ink">{revenda.nome}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={16} className="text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-muted text-xs">CNPJ</p>
                <p className="font-500 text-ink">{revenda.cnpj || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-muted text-xs">Email</p>
                <p className="font-500 text-ink">{revenda.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-muted text-xs">Telefone</p>
                <p className="font-500 text-ink">{revenda.telefone || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div>
                <p className="text-muted text-xs">WhatsApp</p>
                <p className="font-500 text-ink">{revenda.whatsapp || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-muted text-xs">Cidade</p>
                <p className="font-500 text-ink">{revenda.cidade?.nome}/{revenda.cidade?.uf}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-muted text-xs">Endereço</p>
                <p className="font-500 text-ink">{revenda.endereco || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe size={16} className="text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-muted text-xs">Website</p>
                <p className="font-500 text-ink">{revenda.website || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5 shrink-0"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <div>
                <p className="text-muted text-xs">Instagram</p>
                <p className="font-500 text-ink">{revenda.instagram || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5 shrink-0"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <div>
                <p className="text-muted text-xs">Facebook</p>
                <p className="font-500 text-ink">{revenda.facebook || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:col-span-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <p className="text-muted text-xs">Horário de Funcionamento</p>
                <p className="font-500 text-ink">{revenda.horario_funcionamento || "—"}</p>
              </div>
            </div>
          </div>
          {revenda.descricao && (
            <div className="mt-4 pt-4 border-t border-line">
              <p className="text-muted text-xs mb-1">Descrição</p>
              <p className="text-sm text-ink">{revenda.descricao}</p>
            </div>
          )}
        </div>

        {/* Plan Info */}
        <div className="bg-white rounded-xl border border-line p-6">
          <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Plano</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-sand">
              <span className="text-sm text-muted">Plano</span>
              <span className="font-700 text-navy-deep capitalize">{PLANO_LABEL[revenda.plano] || "—"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-sand">
              <span className="text-sm text-muted">Limite de carros</span>
              <span className="font-700 text-navy-deep">{limite || "—"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-sand">
              <span className="text-sm text-muted">Duração</span>
              <span className="font-700 text-navy-deep">{revenda.plano_duracao_meses ? `${revenda.plano_duracao_meses} meses` : "—"}</span>
            </div>
            {revenda.plano_inicio && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-sand">
                <span className="text-sm text-muted">Início</span>
                <span className="font-700 text-navy-deep">{new Date(revenda.plano_inicio).toLocaleDateString("pt-BR")}</span>
              </div>
            )}
            {revenda.plano_fim && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-sand">
                <span className="text-sm text-muted">Término</span>
                <span className={`font-700 ${expirado ? "text-red-600" : "text-green-600"}`}>
                  {new Date(revenda.plano_fim).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
            {!expirado && diasRestantes !== null && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-sand">
                <span className="text-sm text-muted">Dias restantes</span>
                <span className={`font-700 ${diasRestantes <= 5 ? "text-red-600" : "text-green-600"}`}>
                  {diasRestantes} {diasRestantes === 1 ? "dia" : "dias"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <div className="bg-white rounded-xl border border-line overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <div>
            <h2 className="font-display font-700 text-lg text-navy-deep">Veículos</h2>
            <p className="text-xs text-muted mt-0.5">{veiculos?.length || 0} veículo(s) cadastrado(s)</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand border-b border-line">
              <th className="text-left px-4 py-3 font-600 text-muted">Veículo</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Ano/KM</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Preço</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {(veiculos || []).map((v) => {
              const foto = (v.fotos || []).sort((a, b) => a.ordem - b.ordem)[0]?.url;
              return (
                <tr key={v.id} className="border-b border-line last:border-0 hover:bg-sand/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded bg-sand overflow-hidden shrink-0">
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
                </tr>
              );
            })}
            {(!veiculos || veiculos.length === 0) && (
              <tr><td colSpan={4} className="text-center py-10 text-muted">Nenhum veículo cadastrado para esta revenda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
