import { getVeiculoPorSlug } from "@/lib/queries";
import { ChevronLeft, Calendar, Gauge, Fuel, Car, MapPin, Phone, Mail, MessageCircle, Globe, Instagram, Facebook, Clock } from "lucide-react";
import Link from "next/link";
import ImageGallery from "./ImageGallery";

export const dynamic = "force-dynamic";

const CATEGORIA_ICON = {
  Sedã: "bg-blue-100 text-blue-600",
  Hatch: "bg-green-100 text-green-600",
  SUV: "bg-orange-100 text-orange-600",
  Picape: "bg-purple-100 text-purple-600",
  Utilitário: "bg-gray-100 text-gray-600",
};

function formatPreco(v) {
  return Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
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

  return (
    <div className="min-h-screen bg-sand">
      {/* HEADER SIMPLES */}
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-800 text-xs bg-brand-orange text-white">AM</div>
            <span className="font-display font-700 text-sm text-navy-deep">Achei Meu Carro</span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Voltar */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors mb-4">
          <ChevronLeft size={16} /> Voltar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* COLUNA ESQUERDA — FOTOS + INFO */}
          <div className="lg:col-span-3 space-y-6">
            {/* GALERIA */}
            <ImageGallery fotos={fotos} titulo={`${veiculo.marca?.nome} ${veiculo.modelo?.nome}`} />

            {/* TÍTULO E PREÇO */}
            <div className="bg-white rounded-xl border border-line p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-muted">{veiculo.marca?.nome}</p>
                  <h1 className="font-display font-700 text-2xl text-navy-deep">
                    {veiculo.modelo?.nome} {veiculo.versao || ""}
                  </h1>
                  <p className="text-xs text-muted mt-1">Anúncio #{veiculo.slug}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-800 text-brand-orange">{formatPreco(veiculo.preco)}</p>
                </div>
              </div>
            </div>

            {/* DADOS PRINCIPAIS */}
            <div className="bg-white rounded-xl border border-line p-6">
              <h2 className="font-display font-700 text-lg text-navy-deep mb-4">Informações do Veículo</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoCard icon={<Calendar size={18} />} label="Ano" value={`${veiculo.ano_fab}/${veiculo.ano_modelo}`} />
                <InfoCard icon={<Gauge size={18} />} label="Quilometragem" value={`${Number(veiculo.km).toLocaleString("pt-BR")} km`} />
                <InfoCard icon={<Fuel size={18} />} label="Combustível" value={veiculo.combustivel || "—"} />
                <InfoCard icon={<Car size={18} />} label="Câmbio" value={veiculo.cambio || "—"} />
                <InfoCard icon={<div className="w-4 h-4 rounded-full border border-muted" style={{ backgroundColor: veiculo.cor?.toLowerCase() }} />} label="Cor" value={veiculo.cor || "—"} />
                <InfoCard icon={<span className="font-700 text-sm">P</span>} label="Portas" value={String(veiculo.portas || "—")} />
                {veiculo.categoria && (
                  <div className={`rounded-lg px-3 py-2 text-xs font-600 inline-flex items-center gap-1.5 ${CATEGORIA_ICON[veiculo.categoria] || "bg-sand text-muted"}`}>
                    {veiculo.categoria}
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIÇÃO */}
            {veiculo.descricao && (
              <div className="bg-white rounded-xl border border-line p-6">
                <h2 className="font-display font-700 text-lg text-navy-deep mb-3">Descrição</h2>
                <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{veiculo.descricao}</p>
              </div>
            )}

            {/* VÍDEO */}
            {veiculo.video_url && (
              <div className="bg-white rounded-xl border border-line p-6">
                <h2 className="font-display font-700 text-lg text-navy-deep mb-3">Vídeo</h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={veiculo.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                    title="Vídeo do veículo"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA — REVENDA */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-line p-6 sticky top-6">
              <h2 className="font-display font-700 text-lg text-navy-deep mb-4">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-orange" />
                  {revenda?.cidade?.nome || ""}
                </span>
              </h2>

              {/* Revenda info */}
              <div className="space-y-3 mb-6">
                <p className="font-600 text-ink text-base">{revenda?.nome || "Revenda parceira"}</p>

                {revenda?.whatsapp && (
                  <a
                    href={`https://wa.me/${revenda.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Tenho interesse no ${veiculo.marca?.nome} ${veiculo.modelo?.nome}${veiculo.versao ? ` ${veiculo.versao}` : ""} (${formatPreco(veiculo.preco)}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full font-600 text-sm py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={18} /> Falar no WhatsApp
                  </a>
                )}

                {revenda?.telefone && (
                  <a href={`tel:${revenda.telefone}`} className="flex items-center gap-3 text-sm text-ink hover:text-brand-orange transition-colors py-2">
                    <Phone size={16} className="text-muted shrink-0" />
                    {revenda.telefone}
                  </a>
                )}

                {revenda?.email && (
                  <a href={`mailto:${revenda.email}`} className="flex items-center gap-3 text-sm text-ink hover:text-brand-orange transition-colors py-2">
                    <Mail size={16} className="text-muted shrink-0" />
                    {revenda.email}
                  </a>
                )}
              </div>

              <div className="border-t border-line pt-4 space-y-2 text-sm">
                {revenda?.endereco && (
                  <p className="flex items-start gap-2 text-muted">
                    <MapPin size={14} className="shrink-0 mt-0.5" />
                    {revenda.endereco} - {revenda.cidade?.nome}/{revenda.cidade?.uf}
                  </p>
                )}
                {revenda?.horario_funcionamento && (
                  <p className="flex items-start gap-2 text-muted">
                    <Clock size={14} className="shrink-0 mt-0.5" />
                    {revenda.horario_funcionamento}
                  </p>
                )}
              </div>

              {/* Redes sociais */}
              {(revenda?.instagram || revenda?.facebook || revenda?.website) && (
                <div className="border-t border-line pt-4 mt-4 flex items-center gap-3">
                  {revenda.instagram && (
                    <a href={`https://instagram.com/${revenda.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-colors">
                      <Instagram size={16} />
                    </a>
                  )}
                  {revenda.facebook && (
                    <a href={`https://facebook.com/${revenda.facebook}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-colors">
                      <Facebook size={16} />
                    </a>
                  )}
                  {revenda.website && (
                    <a href={revenda.website.startsWith("http") ? revenda.website : `https://${revenda.website}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-sand flex items-center justify-center text-muted hover:text-ink hover:bg-line transition-colors">
                      <Globe size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-sand/50">
      <div className="text-muted mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-600 text-ink">{value}</p>
      </div>
    </div>
  );
}
