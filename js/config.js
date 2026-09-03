/**
 * Configuração central — edite aqui senha, medidores e textos de eventos.
 */
const CONFIG = {
  senhaMestre: 'entropia2026',
  medidores: {
    colapso: {
      id: 'colapso',
      nome: 'Colapso',
      icone: '☢',
      min: 0,
      max: 10,
      inicial: 0,
      eventoMaximo: 'O céu escurece e o ar torna-se irrespirável. A Entropia Viva triunfou.',
      descricaoEvento: 'Vocês foram derrotados, vítimas do saber fragmentado. A complexidade do mundo real avançou sem barreiras. Que sirva de lição: no mundo real, agir de forma segmentada é apenas outra forma de decretar a nossa própria ruína.',
      tema: 'colapso',
      inverterCores: false,
    },
    cofre: {
      id: 'cofre',
      nome: 'Proximidade do Cofre',
      icone: '🔐',
      min: 0,
      max: 15,
      inicial: 0,
      eventoMaximo: 'As engrenagens de bronze do Cofre finalmente giram, destravando um brilho suave que afasta as sombras da Entropia. Vocês venceram!',
      descricaoEvento: 'Mas olhem para trás: este cofre não se abriu pela força bruta, por códigos matemáticos convencionais ou pela resposta isolada de um único pesquisador. Ele exigiu a soma viva de suas mentes. Nenhuma ciência é uma ilha. Ao tecerem conexões entre a Física, a Química e a Biologia, vocês provaram que a resposta para a crise socioambiental não está em gavetas separadas, mas no diálogo, na reciprocidade e na atitude interdisciplinar.',
      tema: 'cofre',
      inverterCores: true,
    },
  },
  limiarPulso: 0.8,
  cartas: {
    desastre: 'data/cartas-desastre.json',
    procurar: 'data/cartas-procurar.json',
  },
  areas: {
    gelo: { label: 'Gelo', cor: '#6b8cff' },
    litoranea: { label: 'Litorânea', cor: '#ff8c42' },
    mata: { label: 'Mata', cor: '#4ade80' },
    seca: { label: 'Seca', cor: '#fbbf24' },
    cidade: { label: 'Cidade', cor: '#c084fc' },
    global: { label: 'Global', cor: '#94a3b8' },
  },
  tiposProcurar: {
    pista: { label: 'Pista', cor: '#fbbf24' },
    dado: { label: 'Dado Científico', cor: '#38bdf8' },
    acao: { label: 'Ação Especial', cor: '#f472b6' },
  },
  regrasMestre: {
    intro: {
      titulo: 'GUIA DO MESTRE: CARTAS DE DESASTRE',
      subtitulo: 'A Entropia Viva — RPG Pedagógico sobre Sustentabilidade e Desastres Ambientais',
      paragrafos: [
        'Este apêndice contém todas as cartas de desastre que compõem o baralho da Fase da Natureza do jogo (incluindo as Colapso Irreversível), dispostas de acordo com as regiões do mapa (Gelo, Litorânea, Seca, Mata e Cidade), assim como as cartas do baralho de Procurar.',
        'Cada carta de desastre foi criada para que a solução apresentada pelos jogadores necessite da combinação de múltiplos eixos de conhecimento científico, não sendo suficiente um único eixo para resolvê-la. Esta exigência representa, na dinâmica do jogo, a concretização da discussão central deste trabalho, que aborda a fragmentação do conhecimento e a urgência de uma abordagem interdisciplinar no ensino das Ciências.',
      ],
    },
    impactoPadrao: 'Quando a carta de desastre é apresentada, o medidor de Colapso aumenta conforme a carta.',
    sucessoContencao: {
      titulo: 'Sucesso na contenção (Soma ≥ 10)',
      texto: 'Debate ou resolução interdisciplinar e cientificamente precisa. bonus da tabela de interdisciplinaridade de +3 no dado + bônus do personagem. O desastre é evitado: Colapso diminui 1 nível e o Cofre sobe conforme a tabela de interdisciplinaridade.',
    },
    falhaContencao: {
      titulo: 'Falha na contenção (Soma < 10)',
      texto: 'Proposta insatisfatória, ignorada ou parcialmente atendida (só bônus do personagem). O desastre continua ou se intensifica: Colapso não diminui e o Cofre não avança.',
    },
    irreversivel: 'Antes de deixar qualquer área, uma carta de desastre irreversível é puxada. Não há solução no jogo: +1 no Colapso e a narrativa segue.',
    cartasPorTurno: [
      { nivel: '1–3', fase: 'Início da crise', reveladas: 1 },
      { nivel: '4–5', fase: 'Agravamento', reveladas: 2 },
      { nivel: '6–9', fase: 'Situação crítica', reveladas: 2 },
      { nivel: '10', fase: 'Colapso', reveladas: 'Fim do jogo' },
    ],
    interdisciplinaridade: [
      { nivel: 0, cofre: 0, titulo: 'Pensamento fragmentado', descricao: 'Menciona um eixo ou articula informações incorretas. Conceitos isolados, sem causa e efeito, ou explicação "mágica". Resposta de Nível 0 correta (um eixo) impede Colapso de subir, mas não avança o Cofre.' },
      { nivel: 1, cofre: 1, titulo: 'Dois eixos', descricao: 'Usa corretamente dois conceitos (Física, Química, Biologia) mas não relaciona os efeitos entre si.' },
      { nivel: 2, cofre: 2, titulo: 'Início sistêmico', descricao: 'Explica por que um eixo influencia o outro (não só cita os dois lado a lado).' },
      { nivel: 3, cofre: 3, titulo: 'Pensamento holístico', descricao: 'Constrói cadeia entre os três eixos, chega à causa raiz e propõe solução que reduz a chance do problema voltar.' },
    ],
    eixos: [
      'Compreensão das leis da natureza (energia, calor, forças, fluidos)',
      'Domínio das transformações da matéria (reações, combustão, toxicidade)',
      'Entendimento da vida e dos ecossistemas (cadeias alimentares, comportamento, fisiologia)',
    ],
  },
};
