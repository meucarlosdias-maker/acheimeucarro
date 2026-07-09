import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import RevendaSidebar from "./RevendaSidebar";
import { Clock } from "lucide-react";

export default async function RevendaLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/revenda/login");
  }

  const { data: revenda } = await supabase
    .from("revendas")
    .select("*, cidade:cidades(*)")
    .eq("user_id", user.id)
    .single();

  if (!revenda) {
    const { data: isAdmin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (isAdmin) redirect("/admin");
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-line text-center">
          <div className="w-14 h-14 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-4">
            <Clock size={28} />
          </div>
          <h1 className="font-display font-700 text-xl text-navy-deep mb-2">Cadastro pendente</h1>
          <p className="text-sm text-muted mb-6">
            Sua solicitação de cadastro ainda não foi aprovada. O administrador vai analisar e liberar seu acesso em breve.
          </p>
          <form action="/revenda/login" method="get">
            <button type="submit" className="font-600 text-sm px-6 py-2.5 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity">
              Sair
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (revenda.status === "pendente") {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-line text-center">
          <div className="w-14 h-14 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-4">
            <Clock size={28} />
          </div>
          <h1 className="font-display font-700 text-xl text-navy-deep mb-2">Aprovação pendente</h1>
          <p className="text-sm text-muted mb-6">
            Seu cadastro foi enviado e está aguardando aprovação do administrador. Você receberá um email quando for liberado.
          </p>
          <form action="/revenda/login" method="get">
            <button type="submit" className="font-600 text-sm px-6 py-2.5 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity">
              Sair
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand flex">
      <RevendaSidebar revenda={revenda} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
