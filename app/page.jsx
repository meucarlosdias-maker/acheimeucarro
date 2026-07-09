import { getVeiculosPorCidade, getMarcas, getBannersHero, getBannersPromocionais } from "@/lib/queries";
import HomeClient from "@/components/HomeClient";

const CIDADE_SLUG = "joinville-sc";

export const revalidate = 60;

export default async function HomePage() {
  const [veiculos, marcas, banners, bannersPromo] = await Promise.all([
    getVeiculosPorCidade(CIDADE_SLUG),
    getMarcas(),
    getBannersHero(),
    getBannersPromocionais(),
  ]);

  return (
    <HomeClient
      veiculos={veiculos}
      marcas={marcas}
      banners={banners}
      bannersPromo={bannersPromo}
    />
  );
}
