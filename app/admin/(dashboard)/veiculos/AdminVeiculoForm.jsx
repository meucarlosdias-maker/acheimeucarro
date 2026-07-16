"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseBrowser";

const CATEGORIAS = ["Sedã", "Hatch", "SUV", "Picape", "Utilitário"];
const COMBUSTIVEIS = ["Flex", "Gasolina", "Etanol", "Diesel", "Elétrico", "Híbrido"];
const CAMBIOS = ["Manual", "Automático", "Automatizado"];

export default function AdminVeiculoForm({ revendas, veiculo }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    revenda_id: veiculo?.revenda_id || "",
    marca_nome: veiculo?.marca?.nome || "",
    modelo_nome: veiculo?.modelo?.nome || "",
    versao: veiculo?.versao || "",
    ano_fab: veiculo?.ano_fab || new Date().getFullYear(),
    ano_modelo: veiculo?.ano_modelo || new Date().getFullYear(),
    km: veiculo?.km || "",
    preco: veiculo?.preco || "",
    combustivel: veiculo?.combustivel || "",
    cambio: veiculo?.cambio || "",
    cor: veiculo?.cor || "",
    portas: veiculo?.portas || 4,
    categoria: veiculo?.categoria || "",
    descricao: veiculo?.descricao || "",
    video_url: veiculo?.video_url || "",
    status: veiculo?.status || "ativo",
    slug: veiculo?.slug || "",
    fotos: veiculo?.fotos || [],
  });

  const [novaFoto, setNovaFoto] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addFoto() {
    if (!novaFoto.trim()) return;
    setForm((prev) => ({
      ...prev,
      fotos: [...(prev.fotos || []), { url: novaFoto.trim(), ordem: prev.fotos?.length || 0 }],
    }));
    setNovaFoto("");
  }

  function removeFoto(idx) {
    setForm((prev) => ({
      ...prev,
      fotos: (prev.fotos || []).filter((_, i) => i !== idx),
    }));
  }

  async function findOrCreate(tabela, dados) {
    const { data: existente } = await supabase.from(tabela).select("id").match(dados).maybeSingle();
    if (existente) return existente.id;
    const { data: novo, error } = await supabase.from(tabela).insert(dados).select("id").single();
    if (error) throw error;
    return novo.id;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErro("");

    try {
      if (!form.revenda_id) {
        throw new Error("Selecione uma revenda.");
      }

      const marca_id = await findOrCreate("marcas", { nome: form.marca_nome.trim() });
      const modelo_id = await findOrCreate("modelos", { nome: form.modelo_nome.trim(), marca_id });

      let veiculoId = veiculo?.id;
      const slugBase = `${form.marca_nome}-${form.modelo_nome}`
        .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const payload = {
        revenda_id: form.revenda_id,
        marca_id,
        modelo_id,
        versao: form.versao,
        ano_fab: Number(form.ano_fab),
        ano_modelo: Number(form.ano_modelo),
        km: Number(form.km),
        preco: Number(form.preco),
        combustivel: form.combustivel,
        cambio: form.cambio,
        cor: form.cor,
        portas: Number(form.portas),
        categoria: form.categoria,
        descricao: form.descricao,
        video_url: form.video_url,
        status: form.status,
        slug: form.slug || `${slugBase}-${Date.now()}`,
      };

      if (veiculoId) {
        const { error } = await supabase.from("veiculos").update(payload).eq("id", veiculoId);
        if (error) throw error;
        await supabase.from("veiculo_fotos").delete().eq("veiculo_id", veiculoId);
      } else {
        const { data, error } = await supabase.from("veiculos").insert(payload).select("id");
        if (error) throw error;
        veiculoId = data[0].id;
      }

      if (form.fotos?.length > 0) {
        const fotosData = form.fotos.map((f, i) => ({
          veiculo_id: veiculoId,
          url: f.url,
          ordem: i,
        }));
        const { error: fotoError } = await supabase.from("veiculo_fotos").insert(fotosData);
        if (fotoError) throw fotoError;
      }

      router.push("/admin/veiculos");
      router.refresh();
    } catch (err) {
      setErro(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* REVENDA */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Revenda</h2>
        <div>
          <label className="text-sm font-600 text-ink block mb-1">Revenda *</label>
          <select name="revenda_id" value={form.revenda_id} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
            <option value="">Selecione uma revenda...</option>
            {revendas.map((r) => (
              <option key={r.id} value={r.id}>{r.nome}</option>
            ))}
          </select>
        </div>
      </section>

      {/* DADOS PRINCIPAIS */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Dados do Veículo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Marca *</label>
            <input name="marca_nome" value={form.marca_nome} onChange={handleChange} placeholder="Ex: Volkswagen" required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Modelo *</label>
            <input name="modelo_nome" value={form.modelo_nome} onChange={handleChange} placeholder="Ex: Gol" required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Versão</label>
            <input name="versao" value={form.versao} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Categoria *</label>
            <select name="categoria" value={form.categoria} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
              <option value="">Selecione...</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Ano Fabricação *</label>
            <input name="ano_fab" type="number" value={form.ano_fab} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Ano Modelo *</label>
            <input name="ano_modelo" type="number" value={form.ano_modelo} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Quilometragem *</label>
            <input name="km" type="number" value={form.km} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Preço (R$) *</label>
            <input name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Combustível</label>
            <select name="combustivel" value={form.combustivel} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
              <option value="">Selecione...</option>
              {COMBUSTIVEIS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Câmbio</label>
            <select name="cambio" value={form.cambio} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
              <option value="">Selecione...</option>
              {CAMBIOS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Cor</label>
            <input name="cor" value={form.cor} onChange={handleChange} placeholder="Ex: Vermelho" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Portas</label>
            <select name="portas" value={form.portas} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>
      </section>

      {/* DESCRIÇÃO E VÍDEO */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Descrição e Mídia</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Descrição do veículo</label>
            <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange resize-none" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">URL do Vídeo (YouTube/Vimeo)</label>
            <input name="video_url" value={form.video_url} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
        </div>
      </section>

      {/* FOTOS */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Fotos</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={novaFoto}
            onChange={(e) => setNovaFoto(e.target.value)}
            placeholder="URL da foto..."
            className="flex-1 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
          <button type="button" onClick={addFoto} className="font-600 text-sm px-4 py-2 rounded-lg bg-sand border border-line hover:bg-line transition-colors">
            Adicionar
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(form.fotos || []).map((foto, idx) => (
            <div key={idx} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-line bg-sand">
              <img src={foto.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeFoto(idx)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </button>
              {idx === 0 && <span className="absolute bottom-1 left-1 text-[10px] font-600 bg-navy-deep text-white px-1.5 py-0.5 rounded">Capa</span>}
            </div>
          ))}
        </div>
      </section>

      {/* STATUS */}
      <section className="bg-white rounded-xl border border-line p-6">
        <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Status do Anúncio</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input type="radio" name="status" value="ativo" checked={form.status === "ativo"} onChange={handleChange} className="text-brand-orange" />
            Ativo (aparece no site)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input type="radio" name="status" value="vendido" checked={form.status === "vendido"} onChange={handleChange} className="text-brand-orange" />
            Vendido
          </label>
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input type="radio" name="status" value="pausado" checked={form.status === "pausado"} onChange={handleChange} className="text-brand-orange" />
            Pausado
          </label>
        </div>
      </section>

      {erro && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{erro}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="font-600 text-sm px-6 py-2.5 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity disabled:opacity-50">
          {saving ? "Salvando..." : veiculo ? "Salvar alterações" : "Publicar veículo"}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm font-500 text-muted hover:text-ink transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
