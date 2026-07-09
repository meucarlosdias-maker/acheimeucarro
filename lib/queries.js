import { supabase } from "./supabaseClient";

// Busca os veículos ativos de uma cidade, já com marca/modelo/revenda/fotos.
export async function getVeiculosPorCidade(cidadeSlug) {
  const hoje = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("veiculos")
    .select(
      `
      id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, categoria, slug, created_at,
      marca:marcas ( nome ),
      modelo:modelos ( nome ),
      revenda:revendas!inner ( nome, slug, plano_fim, cidade:cidades!inner ( slug ) ),
      fotos:veiculo_fotos ( url, ordem )
    `
    )
    .eq("status", "ativo")
    .eq("revenda.cidade.slug", cidadeSlug)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar veículos:", error.message);
    return [];
  }

  // Filtra revendas com plano expirado
  return (data ?? []).filter(
    (v) => !v.revenda.plano_fim || v.revenda.plano_fim >= hoje
  );
}

export async function getMarcas() {
  const { data, error } = await supabase.from("marcas").select("id, nome").order("nome");
  if (error) {
    console.error("Erro ao buscar marcas:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBannersHero() {
  const { data, error } = await supabase
    .from("banners_hero")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) {
    console.error("Erro ao buscar banners:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getVeiculoPorSlug(slug) {
  const hoje = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("veiculos")
    .select(`
      id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, cor, portas,
      categoria, descricao, video_url, slug, created_at,
      marca:marcas ( nome ),
      modelo:modelos ( nome ),
      revenda:revendas ( nome, slug, email, telefone, whatsapp, endereco, website,
                         instagram, facebook, horario_funcionamento, descricao, logo_url,
                         cidade:cidades ( nome, uf, slug ) ),
      fotos:veiculo_fotos ( url, ordem )
    `)
    .eq("slug", slug)
    .eq("status", "ativo")
    .single();

  if (error || !data) return null;

  if (data.revenda?.plano_fim && data.revenda.plano_fim < hoje) return null;

  return data;
}

export async function getBannersPromocionais() {
  const { data, error } = await supabase
    .from("banners_promocionais")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) {
    console.error("Erro ao buscar banners promocionais:", error.message);
    return [];
  }
  return data ?? [];
}
