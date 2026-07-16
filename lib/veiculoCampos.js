export const CATEGORIAS = [
  "Hatch", "Sedan", "SUV", "Picape", "Conversível", "Coupé", "Van", "Minivan", "Elétrico", "Híbrido",
];

export const SITUACOES = ["Novo", "Seminovo", "Usado"];
export const TRACOES = ["Dianteira", "Traseira", "Integral", "4x4", "4x2"];
export const DIRECOES = ["Mecânica", "Hidráulica", "Elétrica", "Eletro-hidráulica"];
export const COMBUSTIVEIS = ["Flex", "Gasolina", "Etanol", "Diesel", "Elétrico", "Híbrido"];
export const CAMBIOS = ["Manual", "Automático", "Automatizado"];
export const PORTAS = [2, 4];

export const SECOES_CARACTERISTICAS = [
  {
    key: "condicoes_comerciais",
    titulo: "Condições Comerciais",
    itens: [
      { campo: "aceita_veiculo_troca", label: "Aceita veículo na troca" },
      { campo: "aceita_moto_troca", label: "Aceita moto na troca" },
      { campo: "financia", label: "Financia" },
      { campo: "entrada_facilitada", label: "Entrada facilitada" },
      { campo: "entrada_zero", label: "Entrada zero" },
      { campo: "aceita_consorcio", label: "Aceita Consórcio" },
      { campo: "aceita_carta_credito", label: "Aceita Carta de Crédito" },
      { campo: "aceita_pix", label: "Aceita PIX" },
      { campo: "aceita_cartao", label: "Aceita Cartão" },
      { campo: "ipva_pago", label: "IPVA Pago" },
      { campo: "licenciado", label: "Licenciado" },
    ],
  },
  {
    key: "garantia",
    titulo: "Garantia",
    itens: [
      { campo: "loja", label: "Loja" },
      { campo: "motor_cambio", label: "Motor e câmbio" },
      { campo: "fabrica", label: "Fábrica" },
      { campo: "sem_garantia", label: "Sem garantia" },
      { campo: "revisado", label: "Revisado" },
      { campo: "laudo_cautelar_aprovado", label: "Laudo cautelar aprovado" },
      { campo: "manual", label: "Manual" },
      { campo: "chave_reserva", label: "Chave reserva" },
      { campo: "unico_dono", label: "Único dono" },
      { campo: "baixa_quilometragem", label: "Baixa quilometragem" },
      { campo: "todas_revisoes_concessionaria", label: "Todas revisões na concessionária" },
    ],
  },
  {
    key: "situacao_campos",
    titulo: "Situação do Veículo",
    itens: [
      { campo: "unico_dono", label: "Único dono" },
      { campo: "nunca_bateu", label: "Nunca bateu" },
      { campo: "recuperado_sinistro", label: "Recuperado de sinistro" },
      { campo: "blindado", label: "Blindado" },
      { campo: "pcd", label: "PCD" },
      { campo: "taxi", label: "Táxi" },
      { campo: "locadora", label: "Locadora" },
      { campo: "colecionador", label: "Colecionador" },
      { campo: "veiculo_nao_fumante", label: "Veículo de não fumante" },
    ],
  },
  {
    key: "seguranca",
    titulo: "Segurança",
    itens: [
      { campo: "abs", label: "ABS" },
      { campo: "airbag_motorista", label: "Airbag motorista" },
      { campo: "airbag_passageiro", label: "Airbag passageiro" },
      { campo: "airbags_laterais", label: "Airbags laterais" },
      { campo: "airbags_cortina", label: "Airbags cortina" },
      { campo: "airbag_joelho", label: "Airbag joelho" },
      { campo: "controle_estabilidade", label: "Controle de estabilidade" },
      { campo: "controle_tracao", label: "Controle de tração" },
      { campo: "assistente_partida_rampa", label: "Assistente de partida em rampa" },
      { campo: "assistente_descida", label: "Assistente de descida" },
      { campo: "frenagem_automatica", label: "Frenagem automática" },
      { campo: "sensor_fadiga", label: "Sensor de fadiga" },
      { campo: "alerta_colisao_frontal", label: "Alerta de colisão frontal" },
      { campo: "alerta_ponto_cego", label: "Alerta de ponto cego" },
      { campo: "alerta_mudanca_faixa", label: "Alerta de mudança de faixa" },
      { campo: "permanencia_faixa", label: "Permanência em faixa" },
      { campo: "isofix", label: "ISOFIX" },
      { campo: "camera_360", label: "Câmera 360°" },
      { campo: "sensor_dianteiro", label: "Sensor dianteiro" },
      { campo: "sensor_traseiro", label: "Sensor traseiro" },
      { campo: "monitoramento_pressao_pneus", label: "Monitoramento da pressão dos pneus" },
      { campo: "farol_automatico", label: "Farol automático" },
      { campo: "farol_alto_automatico", label: "Farol alto automático" },
      { campo: "farol_neblina", label: "Farol de neblina" },
      { campo: "freio_eletronico", label: "Freio eletrônico" },
      { campo: "alarme", label: "Alarme" },
      { campo: "imobilizador", label: "Imobilizador" },
    ],
  },
  {
    key: "conforto",
    titulo: "Conforto",
    itens: [
      { campo: "ar_condicionado", label: "Ar condicionado" },
      { campo: "ar_digital", label: "Ar digital" },
      { campo: "ar_dual_zone", label: "Ar Dual Zone" },
      { campo: "ar_trizone", label: "Ar Trizone" },
      { campo: "bancos_couro", label: "Bancos em couro" },
      { campo: "bancos_ventilados", label: "Bancos ventilados" },
      { campo: "bancos_aquecidos", label: "Bancos aquecidos" },
      { campo: "banco_eletrico", label: "Banco elétrico" },
      { campo: "memoria_bancos", label: "Memória dos bancos" },
      { campo: "teto_solar", label: "Teto solar" },
      { campo: "teto_panoramico", label: "Teto panorâmico" },
      { campo: "chave_presencial", label: "Chave presencial" },
      { campo: "partida_botao", label: "Partida por botão" },
      { campo: "retrovisor_eletrico", label: "Retrovisor elétrico" },
      { campo: "retrovisor_rebativel", label: "Retrovisor rebatível" },
      { campo: "vidros_eletricos", label: "Vidros elétricos" },
      { campo: "banco_traseiro_bipartido", label: "Banco traseiro bipartido" },
      { campo: "porta_malas_eletrico", label: "Porta malas elétrico" },
      { campo: "sensor_chuva", label: "Sensor de chuva" },
      { campo: "volante_multifuncional", label: "Volante multifuncional" },
      { campo: "regulagem_volante", label: "Regulagem de volante" },
      { campo: "apoio_braco", label: "Apoio de braço" },
      { campo: "descanso_braco_traseiro", label: "Descanso de braço traseiro" },
      { campo: "cortinas_laterais", label: "Cortinas laterais" },
    ],
  },
  {
    key: "tecnologia",
    titulo: "Tecnologia",
    itens: [
      { campo: "central_multimidia", label: "Central multimídia" },
      { campo: "android_auto", label: "Android Auto" },
      { campo: "apple_carplay", label: "Apple CarPlay" },
      { campo: "gps", label: "GPS" },
      { campo: "wi_fi", label: "Wi-Fi" },
      { campo: "bluetooth", label: "Bluetooth" },
      { campo: "usb", label: "USB" },
      { campo: "usb_c", label: "USB-C" },
      { campo: "carregador_inducao", label: "Carregador por indução" },
      { campo: "computador_bordo", label: "Computador de bordo" },
      { campo: "painel_digital", label: "Painel digital" },
      { campo: "head_up_display", label: "Head-up Display" },
      { campo: "som_premium", label: "Som Premium" },
      { campo: "comando_voz", label: "Comando de voz" },
      { campo: "internet_embarcada", label: "Internet embarcada" },
      { campo: "aplicativo_remoto", label: "Aplicativo remoto" },
    ],
  },
  {
    key: "desempenho",
    titulo: "Desempenho",
    itens: [
      { campo: "turbo", label: "Turbo" },
      { campo: "cambio_automatico", label: "Câmbio Automático" },
      { campo: "paddle_shift", label: "Paddle Shift" },
      { campo: "tracao_integral", label: "Tração Integral" },
      { campo: "tracao_4x4", label: "Tração 4x4" },
      { campo: "seletor_modo_conducao", label: "Seletor de modo de condução" },
      { campo: "controle_descida", label: "Controle de descida" },
      { campo: "piloto_automatico", label: "Piloto automático" },
      { campo: "piloto_automatico_adaptativo", label: "Piloto automático adaptativo" },
      { campo: "start_stop", label: "Start Stop" },
      { campo: "suspensao_adaptativa", label: "Suspensão adaptativa" },
      { campo: "freio_estacionamento_eletronico", label: "Freio de estacionamento eletrônico" },
    ],
  },
  {
    key: "exterior",
    titulo: "Exterior",
    itens: [
      { campo: "rodas_liga_leve", label: "Rodas de liga leve" },
      { campo: "rodas_aro", label: "Rodas aro" },
      { campo: "farol_led", label: "Farol LED" },
      { campo: "farol_full_led", label: "Farol Full LED" },
      { campo: "drl", label: "DRL" },
      { campo: "lanterna_led", label: "Lanterna LED" },
      { campo: "rack_teto", label: "Rack de teto" },
      { campo: "engate", label: "Engate" },
      { campo: "estribo", label: "Estribo" },
      { campo: "santo_antonio", label: "Santo Antônio" },
      { campo: "capota_maritima", label: "Capota marítima" },
      { campo: "aerofolio", label: "Aerofólio" },
    ],
  },
  {
    key: "documentacao",
    titulo: "Documentação",
    itens: [
      { campo: "ipva_2026_pago", label: "IPVA 2026 Pago" },
      { campo: "licenciado", label: "Licenciado" },
      { campo: "sem_multas", label: "Sem multas" },
      { campo: "alienado", label: "Alienado" },
      { campo: "quitado", label: "Quitado" },
      { campo: "manual", label: "Manual" },
      { campo: "chave_reserva", label: "Chave reserva" },
      { campo: "nota_fiscal", label: "Nota Fiscal" },
      { campo: "laudo_cautelar", label: "Laudo cautelar" },
      { campo: "historico_manutencao", label: "Histórico de manutenção" },
    ],
  },
];

export function getDefaultCaracteristicas() {
  const d = {};
  SECOES_CARACTERISTICAS.forEach((s) => {
    d[s.key] = {};
    s.itens.forEach((i) => { d[s.key][i.campo] = false; });
  });
  return d;
}

export function mergeCaracteristicas(existing) {
  const def = getDefaultCaracteristicas();
  if (!existing || typeof existing !== "object") return def;
  SECOES_CARACTERISTICAS.forEach((s) => {
    if (existing[s.key] && typeof existing[s.key] === "object") {
      Object.keys(def[s.key]).forEach((k) => {
        if (typeof existing[s.key][k] === "boolean") {
          def[s.key][k] = existing[s.key][k];
        }
      });
    }
  });
  return def;
}
