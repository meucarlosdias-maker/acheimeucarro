import { Settings } from "lucide-react";

export default function AdminSetupMessage() {
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <div className="w-14 h-14 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-4">
        <Settings size={28} />
      </div>
      <h2 className="font-display font-700 text-xl text-navy-deep mb-2">
        Configuração necessária
      </h2>
      <p className="text-sm text-muted mb-4">
        Para usar o painel master, adicione a chave <strong>SUPABASE_SERVICE_ROLE_KEY</strong> no arquivo <code className="bg-sand px-1 rounded">.env.local</code>.
      </p>
      <div className="bg-sand rounded-lg p-4 text-left text-xs text-muted space-y-1">
        <p className="font-600 text-ink">Passos:</p>
        <p>1. Supabase Dashboard → Settings → API</p>
        <p>2. Copiar a <strong>service_role key</strong></p>
        <p>3. Colar no .env.local:</p>
        <code className="block bg-white p-2 rounded mt-1">
          SUPABASE_SERVICE_ROLE_KEY=eyJh...
        </code>
      </div>
    </div>
  );
}
