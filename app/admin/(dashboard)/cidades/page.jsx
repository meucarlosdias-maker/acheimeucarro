"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import { CheckCircle, XCircle } from "lucide-react";

export default function CidadesPage() {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", uf: "", slug: "", ativa: true });

  async function carregar() {
    const supabase = createClient();
    const { data } = await supabase
      .from("cidades")
      .select("*")
      .order("nome");
    setCidades(data || []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function resetForm() {
    setForm({ nome: "", uf: "", slug: "", ativa: true });
    setEditando(null);
  }

  function editar(c) {
    setForm({
      nome: c.nome,
      uf: c.uf,
      slug: c.slug,
      ativa: c.ativa,
    });
    setEditando(c.id);
  }

  function gerarSlug() {
    if (!form.nome || !form.uf) return;
    const slug = `${form.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${form.uf.toLowerCase()}`;
    setForm((prev) => ({ ...prev, slug }));
  }

  async function salvar(e) {
    e.preventDefault();
    const payload = { ...form };
    if (editando) payload.id = editando;

    await fetch("/api/admin/cidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    carregar();
  }

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">
        Cidades
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORMULÁRIO */}
        <form onSubmit={salvar} className="bg-white rounded-xl border border-line p-6 h-fit">
          <h2 className="font-display font-700 text-lg text-navy-deep mb-4">
            {editando ? "Editar cidade" : "Nova cidade"}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-600 text-ink block mb-1">Nome</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="text-sm font-600 text-ink block mb-1">UF</label>
              <input
                value={form.uf}
                onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase() })}
                required
                maxLength={2}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="text-sm font-600 text-ink block mb-1">Slug</label>
              <div className="flex gap-2">
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="flex-1 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
                />
                <button
                  type="button"
                  onClick={gerarSlug}
                  className="text-xs font-600 px-3 rounded-lg bg-sand border border-line hover:bg-line transition-colors"
                >
                  Gerar
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.ativa}
                onChange={(e) => setForm({ ...form, ativa: e.target.checked })}
                className="rounded border-line"
              />
              Cidade ativa
            </label>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              type="submit"
              className="font-600 text-sm px-4 py-2 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity"
            >
              {editando ? "Salvar" : "Criar"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-500 text-muted hover:text-ink"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* LISTA */}
        <div className="bg-white rounded-xl border border-line overflow-hidden h-fit">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand border-b border-line">
                <th className="text-left px-4 py-3 font-600 text-muted">Cidade</th>
                <th className="text-left px-4 py-3 font-600 text-muted">UF</th>
                <th className="text-left px-4 py-3 font-600 text-muted">Ativa</th>
                <th className="text-right px-4 py-3 font-600 text-muted">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted">
                    Carregando...
                  </td>
                </tr>
              ) : cidades.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted">
                    Nenhuma cidade cadastrada.
                  </td>
                </tr>
              ) : (
                cidades.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-500 text-ink">{c.nome}</td>
                    <td className="px-4 py-3 text-muted">{c.uf}</td>
                    <td className="px-4 py-3">
                      {c.ativa ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <XCircle size={16} className="text-red-600" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => editar(c)}
                        className="text-sm font-500 text-brand-orange hover:underline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
