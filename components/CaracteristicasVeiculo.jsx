"use client";

import AccordionSection from "./AccordionSection";
import { SECOES_CARACTERISTICAS } from "@/lib/veiculoCampos";
import { Gauge, Calendar, Fuel, Zap, Palette, Car, Settings, ShieldCheck, ArmchairIcon, Cpu, ToyBrick, Sun, FileText } from "lucide-react";
import { Check } from "lucide-react";

function formatPreco(v) {
  return Number(v).toLocaleString("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  });
}

const icons = {
  condicoes_comerciais: <Settings size={16} />,
  garantia: <ShieldCheck size={16} />,
  situacao_campos: <FileText size={16} />,
  seguranca: <ShieldCheck size={16} />,
  conforto: <ArmchairIcon size={16} />,
  tecnologia: <Cpu size={16} />,
  desempenho: <ToyBrick size={16} />,
  exterior: <Sun size={16} />,
  documentacao: <FileText size={16} />,
};

export default function CaracteristicasVeiculo({ veiculo }) {
  const caracteristicas = veiculo.caracteristicas || {};

  function hasAny(section) {
    const data = caracteristicas[section.key];
    if (!data || typeof data !== "object") return false;
    return section.itens.some((item) => data[item.campo] === true);
  }

  function renderGrid(section) {
    const data = caracteristicas[section.key] || {};
    const ativos = section.itens.filter((item) => data[item.campo] === true);
    if (ativos.length === 0) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ativos.map((item) => (
          <div key={item.campo} className="flex items-center gap-2.5 text-sm text-ink">
            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <Check size={12} strokeWidth={3} />
            </span>
            {item.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AccordionSection titulo="Especificações" icon={<Settings size={16} />} defaultOpen>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SpecMini icon={<Calendar size={14} />} label="Ano" value={`${veiculo.ano_fab}/${veiculo.ano_modelo}`} />
          <SpecMini icon={<Gauge size={14} />} label="Quilometragem" value={`${Number(veiculo.km).toLocaleString("pt-BR")} km`} />
          <SpecMini icon={<Fuel size={14} />} label="Combustível" value={veiculo.combustivel} />
          <SpecMini icon={<Zap size={14} />} label="Câmbio" value={veiculo.cambio} />
          {veiculo.cor && <SpecMini icon={<Palette size={14} />} label="Cor" value={veiculo.cor} />}
          {veiculo.cor_interna && <SpecMini icon={<Palette size={14} />} label="Cor Interna" value={veiculo.cor_interna} />}
          {veiculo.tracao && <SpecMini icon={<Car size={14} />} label="Tração" value={veiculo.tracao} />}
          {veiculo.tipo_direcao && <SpecMini icon={<Settings size={14} />} label="Direção" value={veiculo.tipo_direcao} />}
          {veiculo.lugares && <SpecMini icon={<Car size={14} />} label="Lugares" value={`${veiculo.lugares}`} />}
          {veiculo.portas && <SpecMini icon={<Car size={14} />} label="Portas" value={`${veiculo.portas}`} />}
          {veiculo.categoria && <SpecMini icon={<Car size={14} />} label="Categoria" value={veiculo.categoria} />}
          {veiculo.situacao && <SpecMini icon={<Settings size={14} />} label="Situação" value={veiculo.situacao} />}
        </div>
      </AccordionSection>

      {SECOES_CARACTERISTICAS.map((secao) => {
        if (!hasAny(secao)) return null;
        return (
          <AccordionSection key={secao.key} titulo={secao.titulo} icon={icons[secao.key]}>
            {renderGrid(secao)}
          </AccordionSection>
        );
      })}

      {veiculo.preco_promocional && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 mt-2">
          <p className="text-xs text-green-700 font-600 mb-1">Preço Promocional</p>
          <p className="font-display font-800 text-2xl text-green-700">
            {formatPreco(veiculo.preco_promocional)}
          </p>
        </div>
      )}
    </div>
  );
}

function SpecMini({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sand/50 border border-line/50">
      <span className="text-muted shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted font-500">{label}</p>
        <p className="text-sm font-600 text-ink truncate">{value}</p>
      </div>
    </div>
  );
}
