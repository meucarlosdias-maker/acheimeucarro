"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseBrowser";

export default function RevendaForm({ cidades: cidadesSSR, revenda }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [cidades, setCidades] = useState(cidadesSSR || []);
  const isEditing = !!revenda?.id;
  const [form, setForm] = useState({
    nome: revenda?.nome || "",
    slug: revenda?.slug || "",
    cidade_id: revenda?.cidade_id || "",
    email: revenda?.email || "",
    cnpj: revenda?.cnpj || "",
    telefone: revenda?.telefone || "",
    whatsapp: revenda?.whatsapp || "",
    website: revenda?.website || "",
    instagram: revenda?.instagram || "",
    facebook: revenda?.facebook || "",
    endereco: revenda?.endereco || "",
    horario_funcionamento: revenda?.horario_funcionamento || "",
    descricao: revenda?.descricao || "",
    logo_url: revenda?.logo_url || "",
    status: revenda?.status || "pendente",
    plano: revenda?.plano || "",
    plano_duracao_meses: revenda?.plano_duracao_meses || "",
    plano_inicio: revenda?.plano_inicio || "",

  });

  useEffect(() => {
    if (cidades.length === 0) {
      supabase.from("cidades").select("id, nome, uf").order("nome").then(({ data }) => {
        if (data) setCidades(data);
      });
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErro("");

    try {
      const payload = { ...form, id: revenda?.id };

      const res = await fetch("/api/admin/revendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/admin/revendas");
      router.refresh();
    } catch (err) {
      setErro(err.message);
      setSaving(false);
    }
  }

  async function gerarSlug() {
    if (!form.nome) return;
    const slug = form.nome
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((prev) => ({ ...prev, slug }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* DADOS PRINCIPAIS */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">
          Dados da Revenda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-600 text-ink block mb-1">
              Nome da revenda *
            </label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">
              Slug
            </label>
            <div className="flex gap-2">
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
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
          <div>
            <label className="text-sm font-600 text-ink block mb-1">
              Cidade *
            </label>
            <select
              name="cidade_id"
              value={form.cidade_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            >
              <option value="">Selecione uma cidade...</option>
              {cidades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}/{c.uf}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            >
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="bloqueada">Bloqueada</option>
            </select>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">
          Contato
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">CNPJ</label>
            <input
              name="cnpj"
              value={form.cnpj}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">WhatsApp</label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Instagram</label>
            <input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Facebook</label>
            <input
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Endereço</label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
        </div>
      </section>

      {/* PLANO */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">
          Plano e Vigência
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Plano</label>
            <select
              name="plano"
              value={form.plano}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            >
              <option value="">Selecione...</option>
              <option value="bronze">Bronze (até 5 carros)</option>
              <option value="prata">Prata (até 10 carros)</option>
              <option value="ouro">Ouro (até 20 carros)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Duração</label>
            <select
              name="plano_duracao_meses"
              value={form.plano_duracao_meses}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            >
              <option value="">Selecione...</option>
              <option value={3}>3 meses</option>
              <option value={6}>6 meses</option>
              <option value={12}>12 meses</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">
              Data de início
            </label>
            <input
              name="plano_inicio"
              type="date"
              value={form.plano_inicio}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
        </div>
        {form.plano && (
          <div className="mt-3 text-xs text-muted bg-sand rounded-lg px-3 py-2">
            Limite do plano:{" "}
            <strong>
              {form.plano === "bronze"
                ? "5"
                : form.plano === "prata"
                ? "10"
                : "20"}{" "}
              carros
            </strong>
          </div>
        )}
      </section>

      {/* ENDEREÇO E DESCRIÇÃO */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">
          Complementos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-600 text-ink block mb-1">
              Horário de funcionamento
            </label>
            <input
              name="horario_funcionamento"
              value={form.horario_funcionamento}
              onChange={handleChange}
              placeholder="Ex: Seg–Sex 8h–18h, Sáb 8h–12h"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">
              Logo (URL)
            </label>
            <input
              name="logo_url"
              value={form.logo_url}
              onChange={handleChange}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-600 text-ink block mb-1">
            Descrição da revenda
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange resize-none"
          />
        </div>
      </section>



      {erro && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
          {erro}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="font-600 text-sm px-6 py-2.5 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar revenda"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-500 text-muted hover:text-ink transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
