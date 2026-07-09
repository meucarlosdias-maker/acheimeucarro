"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export default function RevendaLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }

    router.push("/revenda");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl border border-line">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-navy-deep text-white font-display font-800 text-lg flex items-center justify-center mx-auto mb-3">
            AM
          </div>
          <h1 className="font-display font-700 text-xl text-navy-deep">
            Painel Revenda
          </h1>
          <p className="text-sm text-muted mt-1">Achei Meu Carro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-600 text-ink block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-deep transition-colors"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-600 text-sm py-2.5 rounded-lg bg-navy-deep text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-xs text-center text-muted mt-6">
            Não tem cadastro?{" "}
            <a href="/revenda/cadastro" className="text-navy-deep font-600 hover:underline">Cadastre sua revenda</a>
          </p>
        </form>
      </div>
    </div>
  );
}
