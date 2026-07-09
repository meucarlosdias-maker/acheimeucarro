"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseBrowser";
import { LayoutDashboard, Car, LogOut, Building2, AlertTriangle, Clock } from "lucide-react";

const links = [
  { href: "/revenda", label: "Dashboard", icon: LayoutDashboard },
  { href: "/revenda/veiculos", label: "Meus Veículos", icon: Car },
];

export default function RevendaSidebar({ revenda }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/revenda/login");
    router.refresh();
  }

  const expirado = revenda.plano_fim && new Date(revenda.plano_fim) < new Date();
  const diasRestantes = revenda.plano_fim
    ? Math.ceil((new Date(revenda.plano_fim) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <aside className="w-60 bg-navy-deep text-white flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-display font-800 text-xs flex items-center justify-center">
            AM
          </div>
          <div>
            <p className="font-display font-700 text-sm truncate max-w-[140px]">{revenda.nome}</p>
            <p className="text-xs text-white/50">Painel Revenda</p>
          </div>
        </div>

        {diasRestantes !== null && (
          <div className={`text-xs rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 ${
            expirado ? "bg-red-500/20 text-red-300" :
            diasRestantes <= 1 ? "bg-red-500/20 text-red-300" :
            diasRestantes <= 2 ? "bg-orange-500/20 text-orange-300" :
            diasRestantes <= 5 ? "bg-yellow-500/20 text-yellow-300" :
            "bg-white/10 text-white/60"
          }`}>
            {expirado ? <AlertTriangle size={12} /> : <Clock size={12} />}
            {expirado ? "Plano expirado" : `${diasRestantes}d restantes`}
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const ativa = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-colors ${
                ativa ? "bg-brand-orange text-white" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-white/50">Plano</p>
          <p className="text-sm font-600 text-white capitalize">{revenda.plano || "—"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
}
