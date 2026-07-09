import { getVeiculoPorSlug, getVeiculosPorModelo } from "@/lib/queries";
import {
  ChevronLeft, Gauge, Calendar, Fuel, Car, MapPin, Phone, Mail,
  MessageCircle, Globe, Instagram, Facebook, Clock, Heart, Share2,
  CheckCircle, ShieldCheck, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ImageGallery from "./ImageGallery";

export const dynamic = "force-dynamic";

function formatPreco(v) {
  return Number(v).toLocaleString("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  });
}

function fotoCapa(veiculo) {
  const fotos = [...(veiculo.fotos || [])].sort((a, b) => a.ordem - b.ordem);
  return fotos[0]?.url || "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=800&auto=format&fit=crop";
}

export default async function CarroPage({ params }) {
  const veiculo = await getVeiculoPorSlug(params.slug);

  if (!veiculo) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Car size={48} className="text-muted mx-auto mb-4" />
          <h1 className="font-display font-700 text-xl text-navy-deep mb-2">Veículo não encontrado</h1>
          <p className="text-sm text-muted mb-6">Este veículo pode ter sido vendido ou está indisponível.</p>
          <Link href="/" className="inline-flex items-center gap-2 font-600 text-sm px-5 py-2.5 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity">
            <ChevronLeft size={16} /> Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  const fotos = (veiculo.fotos || []).sort((a, b) => a.ordem - b.ordem);
  const revenda = veiculo.revenda;
  const relacionados = await getVeiculosPorModelo(veiculo.modelo?.nome, veiculo.slug);

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-white border-b border-line sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-800 text-xs bg-brand-orange text-white">AM</div>
            <span className="font-display font-700 text-sm text-navy-deep hidden sm:inline">Achei Meu Carro</span>
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-ink transition-colors flex items-center gap-1">
            <ChevronLeft size={14} /> Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* === COLUNA PRINCIPAL === */}
          <div className="lg:col-span-3 space-y-6">
            {/* GALERIA */}
            <ImageGallery fotos={fotos} videoUrl={veiculo.video_url} titulo={`${veiculo.marca?.nome} ${veiculo.modelo?.nome}`} />

            {/* SPECS GRID */}
            <div className="bg-white rounded-xl border border-line p-5">
              <h2 className="font-display font-700 text-base text-navy-deep mb-4">Informações do Veículo</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SpecCard icon={<Calendar size={18} />} label="Ano" value={`${veiculo.ano_fab}/${veiculo.ano_modelo}`} />
                <SpecCard icon={<Gauge size={18} />} label="Quilometragem" value={`${Number(veiculo.km).toLocaleString("pt-BR")} km`} />
                <SpecCard icon={<Fuel size={18} />} label="Combustível" value={veiculo.combustivel || "—"} />
                <SpecCard icon={<Car size={18} />} label="Câmbio" value={veiculo.cambio || "—"} />
                {veiculo.cor && <SpecCard icon={<div className="w-4 h-4 rounded-full border border-muted" style={{ backgroundColor: veiculo.cor.toLowerCase() }} />} label="Cor" value={veiculo.cor} />}
                {veiculo.categoria && <SpecCard icon={<ShieldCheck size={18} />} label="Categoria" value={veiculo.categoria} />}
                {veiculo.portas && <SpecCard icon={<span className="font-700 text-sm">P</span>} label="Portas" value={`${veiculo.portas} portas`} />}
              </div>
            </div>

            {/* DESCRIÇÃO */}
            {veiculo.descricao && (
              <div className="bg-white rounded-xl border border-line p-6">
                <h2 className="font-display font-700 text-base text-navy-deep mb-3">Descrição do Veículo</h2>
                <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{veiculo.descricao}</p>
              </div>
            )}

            {/* CARROS DO MESMO MODELO */}
            {relacionados.length > 0 && (
              <div className="bg-white rounded-xl border border-line p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-700 text-base text-navy-deep">
                    Outros {veiculo.modelo?.nome} disponíveis
                  </h2>
                  <span className="text-xs text-muted">{relacionados.length} veículo(s)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relacionados.map((v) => (
                    <Link
                      key={v.id}
                      href={`/carros/${v.slug}`}
                      className="flex gap-3 p-3 rounded-xl border border-line hover:bg-sand/50 transition-colors group"
                    >
                      <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-sand">
                        <img src={fotoCapa(v)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-600 text-sm text-ink truncate">{v.marca?.nome} {v.modelo?.nome} {v.versao || ""}</p>
                        <p className="text-xs text-muted">{v.ano_fab}/{v.ano_modelo} · {Number(v.km).toLocaleString("pt-BR")} km</p>
                        <p className="font-700 text-sm text-brand-orange mt-1">{formatPreco(v.preco)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === SIDEBAR === */}
          <div className="lg:col-span-2 space-y-4">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* TÍTULO + PREÇO */}
              <div className="bg-white rounded-xl border border-line p-6">
                <p className="text-xs text-muted uppercase tracking-wide mb-1">{veiculo.marca?.nome}</p>
                <h1 className="font-display font-700 text-xl text-navy-deep leading-tight mb-3">
                  {veiculo.modelo?.nome} {veiculo.versao || ""}
                </h1>
                <p className="font-display font-800 text-3xl text-brand-orange">{formatPreco(veiculo.preco)}</p>
              </div>

              {/* BOTÃO PRINCIPAL + AÇÕES SECUNDÁRIAS */}
              <div className="bg-white rounded-xl border border-line p-6">
                {revenda?.whatsapp ? (
                  <a
                    href={`https://wa.me/${revenda.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Olá! Tenho interesse no ${veiculo.marca?.nome} ${veiculo.modelo?.nome}${veiculo.versao ? ` ${veiculo.versao}` : ""} (${formatPreco(veiculo.preco)}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full font-700 text-sm py-3.5 rounded-xl bg-brand-orange text-white hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <MessageCircle size={20} /> Tenho Interesse
                  </a>
                ) : revenda?.telefone ? (
                  <a
                    href={`tel:${revenda.telefone}`}
                    className="flex items-center justify-center gap-2 w-full font-700 text-sm py-3.5 rounded-xl bg-brand-orange text-white hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <Phone size={20} /> Tenho Interesse
                  </a>
                ) : null}

                <div className="flex items-center justify-center gap-4 mt-3">
                  <button className="flex items-center gap-1.5 text-xs text-muted hover:text-red-500 transition-colors">
                    <Heart size={16} /> Favoritar
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors">
                    <Share2 size={16} /> Compartilhar
                  </button>
                </div>
              </div>

              {/* VENDEDOR */}
              <div className="bg-white rounded-xl border border-line p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-navy-deep text-white font-display font-800 text-sm flex items-center justify-center shrink-0">
                    {revenda?.nome?.charAt(0) || "R"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-600 text-ink text-sm">{revenda?.nome || "Revenda parceira"}</p>
                      <CheckCircle size={14} className="text-blue-500 shrink-0" />
                    </div>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={11} />
                      {revenda?.cidade?.nome}/{revenda?.cidade?.uf}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {revenda?.telefone && (
                    <a href={`tel:${revenda.telefone}`} className="flex items-center gap-3 py-1.5 text-ink hover:text-brand-orange transition-colors">
                      <Phone size={15} className="text-muted shrink-0" /> {revenda.telefone}
                    </a>
                  )}
                  {revenda?.email && (
                    <a href={`mailto:${revenda.email}`} className="flex items-center gap-3 py-1.5 text-ink hover:text-brand-orange transition-colors">
                      <Mail size={15} className="text-muted shrink-0" /> {revenda.email}
                    </a>
                  )}
                  {revenda?.endereco && (
                    <p className="flex items-start gap-3 py-1.5 text-muted">
                      <MapPin size={15} className="shrink-0 mt-0.5" /> {revenda.endereco}
                    </p>
                  )}
                  {revenda?.horario_funcionamento && (
                    <p className="flex items-start gap-3 py-1.5 text-muted">
                      <Clock size={15} className="shrink-0 mt-0.5" /> {revenda.horario_funcionamento}
                    </p>
                  )}
                </div>

                {(revenda?.instagram || revenda?.facebook || revenda?.website) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-line">
                    {revenda.instagram && (
                      <a href={`https://instagram.com/${revenda.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-colors">
                        <Instagram size={15} />
                      </a>
                    )}
                    {revenda.facebook && (
                      <a href={`https://facebook.com/${revenda.facebook}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-colors">
                        <Facebook size={15} />
                      </a>
                    )}
                    {revenda.website && (
                      <a href={revenda.website.startsWith("http") ? revenda.website : `https://${revenda.website}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-colors">
                        <Globe size={15} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-sand/40 border border-line/50">
      <div className="text-muted shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] text-muted leading-tight">{label}</p>
        <p className="text-sm font-600 text-ink leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
