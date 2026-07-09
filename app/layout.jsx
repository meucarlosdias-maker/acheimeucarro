import "./globals.css";

export const metadata = {
  title: "Achei Meu Carro — Carros das revendas de Joinville",
  description:
    "Anúncios de veículos direto das revendas cadastradas em Joinville, SC. Sem particular, sem intermediário.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans bg-sand text-ink">{children}</body>
    </html>
  );
}
