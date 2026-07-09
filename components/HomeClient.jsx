"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Calendar,
  Phone,
  ArrowRight,
  Fuel,
  Car,
  Instagram,
  Facebook,
  Heart,
  MessageCircle,
} from "lucide-react";

const CATEGORIAS = ["Todos", "Sedã", "Hatch", "SUV", "Picape", "Utilitário"];
const FAIXAS = [
  { label: "Qualquer preço", min: 0, max: Infinity },
  { label: "Até R$ 70.000", min: 0, max: 70000 },
  { label: "R$ 70.000 – R$ 120.000", min: 70000, max: 120000 },
  { label: "Acima de R$ 120.000", min: 120000, max: Infinity },
];

const FALLBACK_FOTO =
  "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=800&auto=format&fit=crop";

function formatPreco(v) {
  return Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function fotoCapa(veiculo) {
  const fotos = [...(veiculo.fotos || [])].sort((a, b) => a.ordem - b.ordem);
  return fotos[0]?.url || FALLBACK_FOTO;
}

export default function HomeClient({ veiculos, marcas, banners, bannersPromo }) {
  const [categoria, setCategoria] = useState("Todos");
  const [marca, setMarca] = useState("Todas as marcas");
  const [faixaIdx, setFaixaIdx] = useState(0);
  const [slide, setSlide] = useState(0);

  const slides = banners && banners.length > 0 ? banners : [];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slide, slides.length]);

  const prevSlide = () => setSlide((s) => (s - 1 + slides.length) % slides.length);
  const nextSlide = () => setSlide((s) => (s + 1) % slides.length);
  const current = slides[slide];

  const resultados = useMemo(() => {
    const faixa = FAIXAS[faixaIdx];
    return (veiculos || []).filter((v) => {
      const okCategoria = categoria === "Todos" || v.categoria === categoria;
      const okMarca = marca === "Todas as marcas" || v.marca?.nome === marca;
      const okFaixa = v.preco >= faixa.min && v.preco <= faixa.max;
      return okCategoria && okMarca && okFaixa;
    });
  }, [veiculos, categoria, marca, faixaIdx]);

  return (
    <div className="min-h-screen w-full">
      {/* HEADER */}
      <header className="w-full bg-navy-deep">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-800 bg-brand-orange text-white">
              AM
            </div>
            <span className="font-display font-700 text-lg text-white">Achei Meu Carro</span>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 bg-white/10">
            <MapPin size={16} className="text-brand-orange" />
            <span className="text-sm text-white">Joinville, SC</span>
            <ChevronDown size={14} className="text-white/50" />
          </div>

          <a href="/revenda/cadastro" className="inline-block text-sm font-600 px-4 py-2 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity">
            Anuncie sua revenda
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="w-full relative overflow-hidden bg-navy-deep">
        {slides.length > 0 && (
          <div className="absolute inset-0">
            {slides.map((s, i) => (
              <div
                key={s.id ?? i}
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                  backgroundImage: `url(${s.imagem_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: i === slide ? 1 : 0,
                }}
              />
            ))}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,42,71,0.92) 0%, rgba(21,64,99,0.86) 55%, rgba(31,92,140,0.7) 100%)",
              }}
            />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-28 text-center relative z-10">
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Slide anterior"
                className="hidden md:flex absolute left-0 items-center justify-center w-11 h-11 rounded-full bg-white shadow-md hover:scale-105 transition-transform z-20"
                style={{ top: "38%" }}
              >
                <ChevronLeft size={20} className="text-navy-deep" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Próximo slide"
                className="hidden md:flex absolute right-0 items-center justify-center w-11 h-11 rounded-full bg-white shadow-md hover:scale-105 transition-transform z-20"
                style={{ top: "38%" }}
              >
                <ChevronRight size={20} className="text-navy-deep" />
              </button>
            </>
          )}

          <div style={{ minHeight: 210 }}>
            <p className="font-600 text-sm tracking-wide mb-3 text-brand-orange">
              {current?.eyebrow || "REVENDAS DE JOINVILLE, EM UM SÓ LUGAR"}
            </p>
            <h1 className="font-display font-800 text-white text-4xl md:text-5xl leading-tight max-w-2xl mx-auto">
              {current?.titulo || "Seu próximo carro está aqui perto."}
            </h1>
            <p className="mt-4 text-base md:text-lg max-w-xl mx-auto text-white/75">
              {current?.subtitulo ||
                "Anúncios direto das revendas cadastradas na sua cidade — sem cadastro de particular, sem intermediário."}
            </p>

            {current?.texto_botao && (
              <a
                href={current.link_botao || "#"}
                className="inline-block mt-6 font-600 text-sm px-6 py-3 rounded-lg bg-brand-orange text-white hover:opacity-90 transition-opacity"
              >
                {current.texto_botao}
              </a>
            )}

            {(!current || slide === 0) && (
              <div className="road-track mt-8 max-w-sm mx-auto h-12 rounded-full bg-white/10" aria-hidden="true">
                <div className="absolute inset-0 flex items-center px-6">
                  <div className="w-full border-t-2 border-dashed border-white/25" />
                </div>
                <div className="car-drive">
                  <Car size={22} className="text-brand-orange" />
                </div>
              </div>
            )}
          </div>

          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === slide ? "w-6 bg-brand-orange" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* SEARCH CARD - floating */}
        <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 rounded-lg px-3 py-3 border border-line">
              <MapPin size={18} className="text-brand-orange" />
              <div className="flex flex-col">
                <span className="text-xs text-muted">Cidade</span>
                <span className="text-sm font-600">Joinville, SC</span>
              </div>
            </div>

            <select
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="rounded-lg px-3 py-3 border border-line text-sm font-500 text-ink"
            >
              <option>Todas as marcas</option>
              {marcas.map((m) => (
                <option key={m.id}>{m.nome}</option>
              ))}
            </select>

            <select
              value={faixaIdx}
              onChange={(e) => setFaixaIdx(Number(e.target.value))}
              className="rounded-lg px-3 py-3 border border-line text-sm font-500 text-ink"
            >
              {FAIXAS.map((f, i) => (
                <option key={f.label} value={i}>
                  {f.label}
                </option>
              ))}
            </select>

            <button className="rounded-lg font-600 text-sm flex items-center justify-center gap-2 py-3 bg-brand-orange text-white hover:opacity-90 transition-opacity">
              <Search size={16} /> Buscar carros
            </button>
          </div>
        </div>
      </section>

      {/* BANNERS PROMOCIONAIS */}
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(bannersPromo || []).length > 0 ? (
            (bannersPromo || []).map((b) => (
              <a
                key={b.id}
                href={b.link_url || "#"}
                target={b.link_url ? "_blank" : undefined}
                rel={b.link_url ? "noopener noreferrer" : undefined}
                className="h-28 md:h-32 rounded-xl overflow-hidden bg-white border border-line flex items-center justify-center group hover:shadow-md transition-shadow"
              >
                {b.imagem_url ? (
                  <img src={b.imagem_url} alt={b.titulo || ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-600 text-muted px-4 text-center">
                    {b.titulo || "Espaço para banner promocional"}
                  </span>
                )}
              </a>
            ))
          ) : (
            [1, 2].map((n) => (
              <div
                key={n}
                className="h-28 md:h-32 rounded-xl border-2 border-dashed border-line bg-white flex flex-col items-center justify-center gap-1"
              >
                <span className="text-sm font-600 text-muted">Espaço para banner promocional {n}</span>
                <span className="text-xs text-muted">Disponível para revendas parceiras · 970×250</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CATEGORIAS + RESULTADOS */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="font-display font-700 text-2xl text-navy-deep">Recém-chegados em Joinville</h2>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`text-sm font-600 px-4 py-2 rounded-full border transition-colors ${
                  categoria === cat
                    ? "bg-navy-deep text-white border-navy-deep"
                    : "bg-white text-navy-deep border-line"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {resultados.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-line text-muted">
            Nenhum carro encontrado com esses filtros. Tente ampliar a faixa de preço ou trocar a marca.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resultados.map((v) => (
              <a
                key={v.id}
                href={`/carros/${v.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-lg transition-shadow cursor-pointer block"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img src={fotoCapa(v)} alt={`${v.marca?.nome} ${v.modelo?.nome}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-600 text-muted">{v.marca?.nome}</p>
                  <h3 className="font-display font-700 text-base mb-2 text-ink">
                    {v.modelo?.nome} {v.versao || ""}
                  </h3>

                  <div className="flex items-center gap-3 text-xs mb-3 text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {v.ano_fab}/{v.ano_modelo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge size={13} />
                      {Number(v.km).toLocaleString("pt-BR")} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel size={13} />
                      {v.combustivel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display font-800 text-lg text-navy-deep">{formatPreco(v.preco)}</span>
                    <span className="text-xs font-600 text-brand-orange">{v.revenda?.nome}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* CTA REVENDAS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-navy-deep">
          <div>
            <h3 className="font-display font-700 text-white text-xl md:text-2xl mb-2">
              Sua revenda ainda não está no Achei Meu Carro?
            </h3>
            <p className="text-sm md:text-base text-white/70">
              Cadastre seu estoque e apareça para quem já está procurando carro em Joinville agora.
            </p>
          </div>
          <button className="whitespace-nowrap font-600 text-sm px-6 py-3 rounded-lg flex items-center gap-2 bg-brand-orange text-white hover:opacity-90 transition-opacity">
            Quero anunciar minha revenda <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Instagram size={22} className="text-brand-orangeDark" />
            <div>
              <h3 className="font-display font-700 text-xl text-navy-deep">@acheimeucarro no Instagram</h3>
              <p className="text-sm text-muted">Carros novos chegando, bastidores das revendas e dicas de compra.</p>
            </div>
          </div>
          <button className="text-sm font-600 px-4 py-2 rounded-full border border-navy-deep text-navy-deep hover:text-white hover:bg-navy-deep transition-colors">
            Seguir no Instagram
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0 md:overflow-visible md:justify-start">
          {resultados.slice(0, 5).map((v, i) => (
            <div
              key={v.id}
              className="flex-shrink-0 w-2/5 sm:w-1/3 md:w-32 md:h-32 h-28 snap-start relative rounded-lg overflow-hidden group cursor-pointer"
            >
              <img src={fotoCapa(v)} alt="Post do Instagram" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-deep/55">
                <span className="flex items-center gap-1 text-white text-xs font-600">
                  <Heart size={13} fill="white" /> {24 + i * 7}
                </span>
                <span className="flex items-center gap-1 text-white text-xs font-600">
                  <MessageCircle size={13} /> {3 + i}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full rounded-t-3xl bg-navy-deep">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-800 text-xs bg-brand-orange text-white">
                  AM
                </div>
                <span className="font-display font-700 text-white text-lg">Achei Meu Carro</span>
              </div>
              <p className="text-sm max-w-xs text-white/65">
                Feito pra facilitar sua busca por carro — e a vida das revendas de Joinville.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10">
                <Instagram size={18} className="text-white" />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10">
                <Facebook size={18} className="text-white" />
              </a>
              <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-orange">
                <Phone size={18} className="text-white" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            <div>
              <p className="font-600 text-sm mb-3 text-white">Cidades</p>
              <p className="text-sm mb-1 text-white/75">Joinville, SC</p>
              <p className="text-sm text-white/45">Outras cidades em breve</p>
            </div>
            <div>
              <p className="font-600 text-sm mb-3 text-white">Para revendas</p>
              <p className="text-sm mb-1 text-white/75">Anunciar minha revenda</p>
              <p className="text-sm text-white/75">Entrar no painel</p>
            </div>
            <div>
              <p className="font-600 text-sm mb-3 text-white">Ajuda</p>
              <p className="text-sm mb-1 text-white/75">Como funciona</p>
              <p className="text-sm text-white/75">Perguntas frequentes</p>
            </div>
            <div>
              <p className="font-600 text-sm mb-3 text-white">Fala com a gente</p>
              <p className="text-sm flex items-center gap-2 mb-1 text-white/75">
                <Phone size={14} /> (47) 99999-0000
              </p>
              <p className="text-sm text-white/75">contato@acheimeucarro.com.br</p>
            </div>
          </div>

          <p className="text-xs text-center pt-6 border-t border-white/10 text-white/35">
            © {new Date().getFullYear()} Achei Meu Carro — feito com carinho em Joinville, SC.
          </p>
        </div>
      </footer>
    </div>
  );
}
