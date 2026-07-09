"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import { Plus, Save, Trash2, GripVertical } from "lucide-react";

export default function BannersPage() {
  const supabase = createClient();
  const [heroBanners, setHeroBanners] = useState([]);
  const [promoBanners, setPromoBanners] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function carregar() {
    const [hero, promo] = await Promise.all([
      supabase.from("banners_hero").select("*").order("ordem"),
      supabase.from("banners_promocionais").select("*").order("ordem"),
    ]);
    setHeroBanners(hero.data || []);
    setPromoBanners(promo.data || []);
  }

  useEffect(() => { carregar(); }, []);

  function updateHero(idx, campo, valor) {
    setHeroBanners((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [campo]: valor };
      return next;
    });
  }

  function updatePromo(idx, campo, valor) {
    setPromoBanners((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [campo]: valor };
      return next;
    });
  }

  async function salvarHero() {
    setSaving(true);
    setMsg("");
    try {
      for (let i = 0; i < heroBanners.length; i++) {
        const b = heroBanners[i];
        if (b.id) {
          await supabase.from("banners_hero").update({ ...b, ordem: i }).eq("id", b.id);
        } else {
          await supabase.from("banners_hero").insert({ ...b, ordem: i });
        }
      }
      setMsg("Banners hero salvos!");
      carregar();
    } catch (err) {
      setMsg("Erro: " + err.message);
    }
    setSaving(false);
  }

  async function salvarPromo() {
    setSaving(true);
    setMsg("");
    try {
      for (let i = 0; i < promoBanners.length; i++) {
        const b = promoBanners[i];
        if (b.id) {
          await supabase.from("banners_promocionais").update({ ...b, ordem: i }).eq("id", b.id);
        } else {
          await supabase.from("banners_promocionais").insert({ ...b, ordem: i });
        }
      }
      setMsg("Banners promocionais salvos!");
      carregar();
    } catch (err) {
      setMsg("Erro: " + err.message);
    }
    setSaving(false);
  }

  const camposHero = [
    { campo: "imagem_url", label: "URL da Imagem", type: "text", placeholder: "https://..." },
    { campo: "eyebrow", label: "Eyebrow (texto pequeno acima)", type: "text", placeholder: "REVENDAS DE JOINVILLE, EM UM SÓ LUGAR" },
    { campo: "titulo", label: "Headline (título principal)", type: "text", placeholder: "Seu próximo carro está aqui perto." },
    { campo: "subtitulo", label: "Subheadline", type: "text", placeholder: "Anúncios direto das revendas..." },
    { campo: "texto_botao", label: "Texto do botão (deixe vazio para ocultar)", type: "text", placeholder: "Anunciar minha revenda" },
    { campo: "link_botao", label: "URL do botão", type: "text", placeholder: "/anuncie" },
  ];

  const camposPromo = [
    { campo: "imagem_url", label: "URL da Imagem (opcional)", type: "text", placeholder: "https://..." },
    { campo: "titulo", label: "Texto do banner", type: "text", placeholder: "Espaço para banner promocional" },
    { campo: "link_url", label: "Link (opcional)", type: "text", placeholder: "https://..." },
  ];

  return (
    <div>
      <h1 className="font-display font-700 text-2xl text-navy-deep mb-6">Banners</h1>

      {msg && (
        <p className={`text-sm mb-4 px-4 py-2 rounded-lg ${msg.startsWith("Erro") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg}
        </p>
      )}

      {/* HERO BANNERS */}
      <section className="bg-white rounded-xl border border-line p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-lg text-navy-deep">Banners Hero (3 banners em rotação)</h2>
          <button
            onClick={salvarHero}
            disabled={saving}
            className="flex items-center gap-2 font-600 text-sm px-4 py-2 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={16} /> Salvar Hero
          </button>
        </div>

        <div className="space-y-6">
          {heroBanners.map((banner, idx) => (
            <div key={banner.id || idx} className="border border-line rounded-xl p-4 bg-sand/30">
              <div className="flex items-center gap-2 mb-3">
                <GripVertical size={16} className="text-muted" />
                <span className="font-600 text-sm text-ink">Banner {idx + 1}</span>
                {!banner.id && <span className="text-xs text-brand-orange font-600">(novo)</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {camposHero.map((c) => (
                  <div key={c.campo} className={c.campo === "subtitulo" ? "md:col-span-2" : ""}>
                    <label className="text-xs font-600 text-muted block mb-0.5">{c.label}</label>
                    <input
                      type={c.type}
                      value={banner[c.campo] || ""}
                      onChange={(e) => updateHero(idx, c.campo, e.target.value)}
                      placeholder={c.placeholder}
                      className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-orange"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {heroBanners.length < 3 && (
          <button
            onClick={() => setHeroBanners((prev) => [...prev, { ativo: true }])}
            className="mt-4 flex items-center gap-2 text-sm font-500 text-brand-orange hover:underline"
          >
            <Plus size={16} /> Adicionar banner hero
          </button>
        )}
      </section>

      {/* BANNERS PROMOCIONAIS */}
      <section className="bg-white rounded-xl border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-lg text-navy-deep">Banners Promocionais (2 banners menores)</h2>
          <button
            onClick={salvarPromo}
            disabled={saving}
            className="flex items-center gap-2 font-600 text-sm px-4 py-2 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={16} /> Salvar Promocionais
          </button>
        </div>

        <div className="space-y-6">
          {promoBanners.map((banner, idx) => (
            <div key={banner.id || idx} className="border border-line rounded-xl p-4 bg-sand/30">
              <div className="flex items-center gap-2 mb-3">
                <GripVertical size={16} className="text-muted" />
                <span className="font-600 text-sm text-ink">Banner Promocional {idx + 1}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {camposPromo.map((c) => (
                  <div key={c.campo}>
                    <label className="text-xs font-600 text-muted block mb-0.5">{c.label}</label>
                    <input
                      type={c.type}
                      value={banner[c.campo] || ""}
                      onChange={(e) => updatePromo(idx, c.campo, e.target.value)}
                      placeholder={c.placeholder}
                      className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-orange"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {promoBanners.length < 2 && (
          <button
            onClick={() => setPromoBanners((prev) => [...prev, { ativo: true }])}
            className="mt-4 flex items-center gap-2 text-sm font-500 text-brand-orange hover:underline"
          >
            <Plus size={16} /> Adicionar banner promocional
          </button>
        )}
      </section>
    </div>
  );
}
