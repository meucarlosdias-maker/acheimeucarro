import { getVeiculoPorSlug, getVeiculosPorModelo } from "@/lib/queries";
import {
  ChevronLeft, MapPin, Phone, Mail,
  MessageCircle, Globe, Instagram, Facebook, Clock, Heart, Share2,
  CheckCircle, Car,
} from "lucide-react";
import Link from "next/link";
import ImageGallery from "./ImageGallery";
import CaracteristicasVeiculo from "@/components/CaracteristicasVeiculo";

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
          <div className="w-16 h-16 rounded-2xl bg-navy-deep/5 flex items-center justify-center mx-auto mb-6">
            <Car size={32} className="text-navy-deep/40" />
          </div>
          <h1 className="font-display font-700 text-2xl text-navy-deep mb-2">Veículo não encontrado</h1>
          <p className="text-sm text-muted mb-8 leading-relaxed">Este veículo pode ter sido vendido ou está indisponível no momento.</p>
          <Link href="/" className="inline-flex items-center gap-2 font-600 text-sm px-6 py-3 rounded-xl bg-navy-deep text-white hover:bg-navy-mid transition-all duration-200">
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
      <header className="bg-white/80 backdrop-blur-md border-b border-line sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-800 text-sm bg-navy-deep text-white group-hover:bg-brand-orange transition-colors duration-300">
              AM
            </div>
            <span className="font-display font-700 text-sm text-navy-deep hidden sm:inline">Achei Meu Carro</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/carros" className="text-sm text-muted hover:text-ink transition-colors hidden sm:inline">
              Todos os veículos
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-sm font-500 text-muted hover:text-navy-deep transition-colors px-4 py-2 rounded-lg border border-line hover:border-navy-deep/20">
              <ChevronLeft size={14} /> Voltar
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            <ImageGallery fotos={fotos} videoUrl={veiculo.video_url} titulo={`${veiculo.marca?.nome} ${veiculo.modelo?.nome}`} />

            <div className="lg:hidden space-y-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-widest font-600">{veiculo.marca?.nome}</p>
                <h1 className="font-display font-700 text-2xl text-navy-deep leading-tight mt-1">
                  {veiculo.modelo?.nome}{veiculo.versao ? ` ${veiculo.versao}` : ""}
                </h1>
              </div>
              <p className="font-display font-800 text-4xl text-brand-orange">{formatPreco(veiculo.preco)}</p>
              {revenda?.whatsapp ? (
                <a
                  href={`https://wa.me/${revenda.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Olá! Tenho interesse no ${veiculo.marca?.nome} ${veiculo.modelo?.nome}${veiculo.versao ? ` ${veiculo.versao}` : ""} (${formatPreco(veiculo.preco)}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full font-700 text-sm py-3.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orangeDark transition-all duration-200 shadow-lg shadow-brand-orange/25"
                >
                  <MessageCircle size={20} /> Tenho Interesse
                </a>
              ) : revenda?.telefone ? (
                <a
                  href={`tel:${revenda.telefone}`}
                  className="flex items-center justify-center gap-2 w-full font-700 text-sm py-3.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orangeDark transition-all duration-200 shadow-lg shadow-brand-orange/25"
                >
                  <Phone size={20} /> Tenho Interesse
                </a>
              ) : null}
            </div>

            <section className="bg-white rounded-2xl border border-line p-5 sm:p-6">
              <CaracteristicasVeiculo veiculo={veiculo} />
            </section>

            {veiculo.descricao && (
              <section className="bg-white rounded-2xl border border-line p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-brand-orange rounded-full" />
                  <h2 className="font-display font-700 text-base text-navy-deep">Sobre este veículo</h2>
                </div>
                <div className="prose prose-sm max-w-none text-ink leading-relaxed">
                  <p className="whitespace-pre-line text-[15px] leading-7">{veiculo.descricao}</p>
                </div>
              </section>
            )}

            {relacionados.length > 0 && (
              <section className="bg-white rounded-2xl border border-line p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-orange rounded-full" />
                    <h2 className="font-display font-700 text-base text-navy-deep">
                      Outros {veiculo.modelo?.nome}
                    </h2>
                  </div>
                  <span className="text-xs font-500 text-muted bg-sand px-3 py-1 rounded-full">{relacionados.length} disponível(is)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relacionados.map((v) => (
                    <Link
                      key={v.id}
                      href={`/carros/${v.slug}`}
                      className="flex gap-4 p-3 rounded-xl border border-line hover:border-brand-orange/30 hover:bg-brand-orange/[0.02] transition-all duration-200 group"
                    >
                      <div className="w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-sand">
                        <img src={fotoCapa(v)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <p className="font-600 text-sm text-ink truncate">{v.marca?.nome} {v.modelo?.nome} {v.versao || ""}</p>
                        <p className="text-xs text-muted mt-0.5">{v.ano_fab}/{v.ano_modelo} · {Number(v.km).toLocaleString("pt-BR")} km</p>
                        <p className="font-700 text-sm text-brand-orange mt-1.5">{formatPreco(v.preco)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-5">
              <div className="hidden lg:block bg-white rounded-2xl border border-line p-6 sm:p-7">
                <p className="text-xs text-muted uppercase tracking-widest font-600">{veiculo.marca?.nome}</p>
                <h1 className="font-display font-700 text-xl sm:text-2xl text-navy-deep leading-tight mt-1.5">
                  {veiculo.modelo?.nome}{veiculo.versao ? ` ${veiculo.versao}` : ""}
                </h1>
                <div className="mt-4 pt-4 border-t border-line">
                  <p className="text-xs text-muted mb-1">Preço</p>
                  <p className="font-display font-800 text-3xl sm:text-4xl text-brand-orange tracking-tight">
                    {formatPreco(veiculo.preco)}
                  </p>
                </div>
              </div>

              <div className="hidden lg:block bg-white rounded-2xl border border-line p-6">
                {revenda?.whatsapp ? (
                  <a
                    href={`https://wa.me/${revenda.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Olá! Tenho interesse no ${veiculo.marca?.nome} ${veiculo.modelo?.nome}${veiculo.versao ? ` ${veiculo.versao}` : ""} (${formatPreco(veiculo.preco)}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full font-700 text-sm py-3.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orangeDark transition-all duration-200 shadow-lg shadow-brand-orange/25"
                  >
                    <MessageCircle size={20} /> Tenho Interesse
                  </a>
                ) : revenda?.telefone ? (
                  <a
                    href={`tel:${revenda.telefone}`}
                    className="flex items-center justify-center gap-2 w-full font-700 text-sm py-3.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orangeDark transition-all duration-200 shadow-lg shadow-brand-orange/25"
                  >
                    <Phone size={20} /> Tenho Interesse
                  </a>
                ) : null}

                <div className="flex items-center justify-center gap-6 mt-4">
                  <button className="flex items-center gap-1.5 text-xs text-muted hover:text-red-400 transition-colors group">
                    <Heart size={15} className="group-hover:scale-110 transition-transform" /> Favoritar
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors group">
                    <Share2 size={15} className="group-hover:scale-110 transition-transform" /> Compartilhar
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6 sm:p-7">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-navy-deep text-white font-display font-800 text-lg flex items-center justify-center shrink-0 shadow-md shadow-navy-deep/10">
                    {revenda?.nome?.charAt(0) || "R"}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-600 text-ink text-sm">{revenda?.nome || "Revenda parceira"}</p>
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                    </div>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={11} />
                      {revenda?.cidade?.nome}/{revenda?.cidade?.uf}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 divide-y divide-line/50">
                  {revenda?.telefone && (
                    <a href={`tel:${revenda.telefone}`} className="flex items-center gap-3 py-2.5 text-sm text-ink hover:text-brand-orange transition-colors group">
                      <span className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                        <Phone size={14} className="text-muted" />
                      </span>
                      {revenda.telefone}
                    </a>
                  )}
                  {revenda?.email && (
                    <a href={`mailto:${revenda.email}`} className="flex items-center gap-3 py-2.5 text-sm text-ink hover:text-brand-orange transition-colors group">
                      <span className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                        <Mail size={14} className="text-muted" />
                      </span>
                      {revenda.email}
                    </a>
                  )}
                  {revenda?.endereco && (
                    <div className="flex items-start gap-3 py-2.5 text-sm text-muted">
                      <span className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center shrink-0">
                        <MapPin size={14} />
                      </span>
                      <span className="pt-1.5">{revenda.endereco}</span>
                    </div>
                  )}
                  {revenda?.horario_funcionamento && (
                    <div className="flex items-start gap-3 py-2.5 text-sm text-muted">
                      <span className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center shrink-0">
                        <Clock size={14} />
                      </span>
                      <span className="pt-1.5">{revenda.horario_funcionamento}</span>
                    </div>
                  )}
                </div>

                {(revenda?.instagram || revenda?.facebook || revenda?.website) && (
                  <div className="flex items-center gap-2 mt-5 pt-5 border-t border-line">
                    {revenda.instagram && (
                      <a href={`https://instagram.com/${revenda.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-all duration-200">
                        <Instagram size={16} />
                      </a>
                    )}
                    {revenda.facebook && (
                      <a href={`https://facebook.com/${revenda.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-all duration-200">
                        <Facebook size={16} />
                      </a>
                    )}
                    {revenda.website && (
                      <a href={revenda.website.startsWith("http") ? revenda.website : `https://${revenda.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-all duration-200">
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

