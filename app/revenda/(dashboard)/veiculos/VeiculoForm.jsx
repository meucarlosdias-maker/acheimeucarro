"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseBrowser";
import AccordionSection from "@/components/AccordionSection";
import {
  CATEGORIAS, SITUACOES, TRACOES, DIRECOES, COMBUSTIVEIS, CAMBIOS, PORTAS,
  SECOES_CARACTERISTICAS, mergeCaracteristicas,
} from "@/lib/veiculoCampos";
import { Settings, Shield, CheckSquare, Clock, Cpu, Zap, Sun, FileText, ChevronDown } from "lucide-react";

const secaoIcon = {
  condicoes_comerciais: <CheckSquare size={16} />,
  garantia: <Shield size={16} />,
  situacao_campos: <Clock size={16} />,
  seguranca: <Shield size={16} />,
  conforto: <Settings size={16} />,
  tecnologia: <Cpu size={16} />,
  desempenho: <Zap size={16} />,
  exterior: <Sun size={16} />,
  documentacao: <FileText size={16} />,
};

export default function VeiculoForm({ revendaId, veiculo }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    revenda_id: revendaId,
    marca_nome: veiculo?.marca?.nome || "",
    modelo_nome: veiculo?.modelo?.nome || "",
    versao: veiculo?.versao || "",
    ano_fab: veiculo?.ano_fab || new Date().getFullYear(),
    ano_modelo: veiculo?.ano_modelo || new Date().getFullYear(),
    km: veiculo?.km || "",
    preco: veiculo?.preco || "",
    preco_promocional: veiculo?.preco_promocional || "",
    combustivel: veiculo?.combustivel || "",
    cambio: veiculo?.cambio || "",
    cor: veiculo?.cor || "",
    cor_interna: veiculo?.cor_interna || "",
    tracao: veiculo?.tracao || "",
    tipo_direcao: veiculo?.tipo_direcao || "",
    portas: veiculo?.portas || 4,
    lugares: veiculo?.lugares || "",
    categoria: veiculo?.categoria || "",
    situacao: veiculo?.situacao || "",
    descricao: veiculo?.descricao || "",
    video_url: veiculo?.video_url || "",
    status: veiculo?.status || "ativo",
    slug: veiculo?.slug || "",
    fotos: veiculo?.fotos || [],
    caracteristicas: mergeCaracteristicas(veiculo?.caracteristicas),
  });

  const [novaFoto, setNovaFoto] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleCaracteristica(cat, campo) {
    setForm((prev) => ({
      ...prev,
      caracteristicas: {
        ...prev.caracteristicas,
        [cat]: {
          ...prev.caracteristicas[cat],
          [campo]: !prev.caracteristicas[cat]?.[campo],
        },
      },
    }));
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
      const marca_id = await findOrCreate("marcas", { nome: form.marca_nome.trim() });
      const modelo_id = await findOrCreate("modelos", { nome: form.modelo_nome.trim(), marca_id });

      let veiculoId = veiculo?.id;
      const slugBase = `${form.marca_nome}-${form.modelo_nome}`
        .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const payload = {
        revenda_id: revendaId,
        marca_id,
        modelo_id,
        versao: form.versao,
        ano_fab: Number(form.ano_fab),
        ano_modelo: Number(form.ano_modelo),
        km: Number(form.km),
        preco: Number(form.preco),
        preco_promocional: form.preco_promocional ? Number(form.preco_promocional) : null,
        combustivel: form.combustivel,
        cambio: form.cambio,
        cor: form.cor,
        cor_interna: form.cor_interna,
        tracao: form.tracao,
        tipo_direcao: form.tipo_direcao,
        portas: Number(form.portas),
        lugares: form.lugares ? Number(form.lugares) : null,
        categoria: form.categoria,
        situacao: form.situacao,
        descricao: form.descricao,
        video_url: form.video_url,
        caracteristicas: form.caracteristicas,
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

      router.push("/revenda/veiculos");
      router.refresh();
    } catch (err) {
      setErro(err.message);
      setSaving(false);
    }
  }

  function renderCheckboxGrid(secao) {
    const data = form.caracteristicas[secao.key] || {};
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {secao.itens.map((item) => (
          <label key={item.campo} className="flex items-center gap-2.5 text-sm text-ink cursor-pointer select-none py-1.5 px-3 rounded-lg hover:bg-sand/50 transition-colors">
            <input
              type="checkbox"
              checked={data[item.campo] === true}
              onChange={() => toggleCaracteristica(secao.key, item.campo)}
              className="w-4 h-4 rounded border-line text-brand-orange focus:ring-brand-orange/30"
            />
            {item.label}
          </label>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* DADOS BÁSICOS */}
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
            <label className="text-sm font-600 text-ink block mb-1">Preço Promocional (R$)</label>
            <input name="preco_promocional" type="number" step="0.01" value={form.preco_promocional} onChange={handleChange} placeholder="Opcional" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
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
            <label className="text-sm font-600 text-ink block mb-1">Cor Interna</label>
            <input name="cor_interna" value={form.cor_interna} onChange={handleChange} placeholder="Ex: Bege" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Tração</label>
            <select name="tracao" value={form.tracao} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
              <option value="">Selecione...</option>
              {TRACOES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Tipo de Direção</label>
            <select name="tipo_direcao" value={form.tipo_direcao} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
              <option value="">Selecione...</option>
              {DIRECOES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Portas</label>
            <select name="portas" value={form.portas} onChange={handleChange} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
              {PORTAS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Lugares</label>
            <input name="lugares" type="number" value={form.lugares} onChange={handleChange} placeholder="Ex: 5" min={1} max={9} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Situação do Veículo</label>
            <div className="flex items-center gap-4 pt-1.5">
              {SITUACOES.map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-sm text-ink cursor-pointer">
                  <input type="radio" name="situacao" value={s} checked={form.situacao === s} onChange={handleChange} className="text-brand-orange focus:ring-brand-orange/30" />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÕES DE CARACTERÍSTICAS (ACCORDION) */}
      <section className="bg-white rounded-xl border border-line divide-y divide-line">
        {SECOES_CARACTERISTICAS.map((secao) => (
          <AccordionSection key={secao.key} titulo={secao.titulo} icon={secaoIcon[secao.key]}>
            {renderCheckboxGrid(secao)}
          </AccordionSection>
        ))}
      </section>

      {/* DESCRIÇÃO E MÍDIA */}
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
              <button type="button" onClick={() => removeFoto(idx)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
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
            Vendido (sai do site)
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
