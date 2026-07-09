import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import { Plus, Edit, CheckCircle, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const PLANO_LABEL = { bronze: "Bronze", prata: "Prata", ouro: "Ouro" };
const STATUS_BADGE = {
  aprovada: "bg-green-100 text-green-700",
  pendente: "bg-yellow-100 text-yellow-700",
  bloqueada: "bg-red-100 text-red-700",
};

export default async function RevendasPage() {
  const safeClient = supabaseAdmin || createClient();

  const { data: revendas } = await safeClient
    .from("revendas")
    .select("*, cidade:cidades(nome, uf)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-700 text-2xl text-navy-deep">Revendas</h1>
        <Link href="/admin/revendas/nova" className="flex items-center gap-2 font-600 text-sm px-4 py-2 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity">
          <Plus size={16} /> Nova Revenda
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand border-b border-line">
              <th className="text-left px-4 py-3 font-600 text-muted">Revenda</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Cidade</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Plano</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Vigência</th>
              <th className="text-left px-4 py-3 font-600 text-muted">Status</th>
              <th className="text-right px-4 py-3 font-600 text-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(revendas || []).map((r) => {
              const expirado = r.plano_fim && new Date(r.plano_fim) < new Date();
              return (
                <tr key={r.id} className="border-b border-line last:border-0 hover:bg-sand/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/revendas/${r.id}`} className="font-600 text-ink hover:text-brand-orange transition-colors">
                      {r.nome}
                    </Link>
                    <p className="text-xs text-muted">{r.email || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{r.cidade?.nome}/{r.cidade?.uf}</td>
                  <td className="px-4 py-3">
                    {r.plano ? <span className="font-600 text-ink">{PLANO_LABEL[r.plano] || r.plano}</span> : <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {r.plano_inicio ? (
                      <div className="text-xs text-muted">
                        {new Date(r.plano_inicio).toLocaleDateString("pt-BR")}
                        {" → "}
                        <span className={expirado ? "text-red-600 font-600" : "text-green-600 font-600"}>
                          {new Date(r.plano_fim).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    ) : <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {expirado ? <Clock size={14} className="text-red-600" /> : r.status === "aprovada" ? <CheckCircle size={14} className="text-green-600" /> : r.status === "pendente" ? <Clock size={14} className="text-yellow-600" /> : <XCircle size={14} className="text-red-600" />}
                      <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${STATUS_BADGE[r.status] || ""}`}>{r.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/revendas/${r.id}/editar`} className="inline-flex items-center gap-1 text-sm font-500 text-brand-orange hover:underline">
                      <Edit size={14} /> Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
            {(!revendas || revendas.length === 0) && (
              <tr><td colSpan={6} className="text-center py-10 text-muted">Nenhuma revenda cadastrada ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
