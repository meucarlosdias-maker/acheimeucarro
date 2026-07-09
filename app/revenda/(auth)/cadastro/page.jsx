"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseBrowser";
import { Building2, ChevronLeft } from "lucide-react";

export default function CadastroRevendaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [passo, setPasso] = useState(1);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const [cidades, setCidades] = useState([]);
  const [form, setForm] = useState({
    nome: "", slug: "", email: "", password: "", telefone: "", whatsapp: "",
    endereco: "", cnpj: "", website: "", instagram: "", facebook: "",
    horario_funcionamento: "", descricao: "", cidade_id: "",
  });

  useEffect(() => {
    supabase.from("cidades").select("id, nome, uf").eq("ativa", true).order("nome").then(({ data }) => {
      if (data) setCidades(data);
    });
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function gerarSlug() {
    if (!form.nome) return;
    const slug = form.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm((prev) => ({ ...prev, slug }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErro("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar conta");

      const slug = form.slug || form.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const { error: insertError } = await supabase.rpc("criar_revenda", {
        p_nome: form.nome,
        p_slug: `${slug}-${Date.now()}`,
        p_email: form.email,
        p_user_id: authData.user.id,
        p_cidade_id: form.cidade_id,
        p_telefone: form.telefone || null,
        p_whatsapp: form.whatsapp || null,
        p_endereco: form.endereco || null,
        p_cnpj: form.cnpj || null,
        p_website: form.website || null,
        p_instagram: form.instagram || null,
        p_facebook: form.facebook || null,
        p_horario_funcionamento: form.horario_funcionamento || null,
        p_descricao: form.descricao || null,
      });

      if (insertError) throw insertError;

      setSucesso(true);
    } catch (err) {
      setErro(err.message);
      setSaving(false);
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-line text-center">
          <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} />
          </div>
          <h1 className="font-display font-700 text-xl text-navy-deep mb-2">Cadastro enviado!</h1>
          <p className="text-sm text-muted mb-6">
            Sua revenda foi cadastrada com sucesso! Agora é só fazer login e começar a anunciar.
          </p>
          <button onClick={() => router.push("/revenda/login")} className="font-600 text-sm px-6 py-2.5 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity">
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-6 transition-colors">
          <ChevronLeft size={16} /> Voltar ao site
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-line p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-navy-deep text-white font-display font-800 text-lg flex items-center justify-center mx-auto mb-3">
              AM
            </div>
            <h1 className="font-display font-700 text-2xl text-navy-deep">Cadastre sua Revenda</h1>
            <p className="text-sm text-muted mt-1">Após aprovação você poderá anunciar seus veículos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-600 text-ink block mb-1">Nome da revenda *</label>
                <input name="nome" value={form.nome} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-600 text-ink block mb-1">Cidade *</label>
                <select name="cidade_id" value={form.cidade_id} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep">
                  <option value="">Selecione sua cidade...</option>
                  {cidades.map((c) => <option key={c.id} value={c.id}>{c.nome}/{c.uf}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Senha *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Telefone</label>
                <input name="telefone" value={form.telefone} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">WhatsApp</label>
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">CNPJ</label>
                <input name="cnpj" value={form.cnpj} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Website</label>
                <input name="website" value={form.website} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Instagram</label>
                <input name="instagram" value={form.instagram} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Facebook</label>
                <input name="facebook" value={form.facebook} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Endereço</label>
                <input name="endereco" value={form.endereco} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
              <div>
                <label className="text-sm font-600 text-ink block mb-1">Horário de funcionamento</label>
                <input name="horario_funcionamento" value={form.horario_funcionamento} onChange={handleChange} placeholder="Seg–Sex 8h–18h" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep" />
              </div>
            </div>
            <div>
              <label className="text-sm font-600 text-ink block mb-1">Descrição da revenda</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep resize-none" />
            </div>

            {erro && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{erro}</p>}

            <button type="submit" disabled={saving} className="w-full font-600 text-sm py-2.5 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Cadastrando..." : "Solicitar cadastro"}
            </button>

            <p className="text-xs text-center text-muted">
              Já tem cadastro?{" "}
              <a href="/revenda/login" className="text-navy-deep font-600 hover:underline">Faça login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
