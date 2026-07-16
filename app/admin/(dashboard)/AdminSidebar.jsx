"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseBrowser";
import {
  LayoutDashboard,
  Building2,
  Car,
  MapPin,
  Image,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/revendas", label: "Revendas", icon: Building2 },
  { href: "/admin/veiculos", label: "Veículos", icon: Car },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/cidades", label: "Cidades", icon: MapPin },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-60 bg-navy-deep text-white flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-display font-800 text-xs flex items-center justify-center">
          AM
        </div>
        <div>
          <p className="font-display font-700 text-sm">Achei Meu Carro</p>
          <p className="text-xs text-white/50">Painel Master</p>
        </div>
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
                ativa
                  ? "bg-brand-orange text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 mb-2 text-xs text-white/50 truncate">
          {user.email}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
