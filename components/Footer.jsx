import { Phone, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full rounded-t-3xl bg-navy-deep mt-14">
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
            <Link href="/revenda/cadastro" className="block text-sm text-white/75 hover:text-white transition-colors">Anunciar minha revenda</Link>
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
  );
}
