/**
 * Configuração central — edite aqui senha, medidores e textos de eventos.
 */
const CONFIG = {
  senhaMestre: 'entropia2026',
  medidores: {
    colapso: {
      id: 'colapso',
      nome: 'Colapso devido à Entropia Viva',
      icone: 'skull',
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
      nome: 'Proximidade de abertura do cofre',
      icone: 'lock-keyhole',
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
  },
  telao: {
    sucessoContencao: {
      titulo: 'Sucesso de contenção de desastre',
      limiar: '≥ 10',
      texto: 'Debate ou resolução interdisciplinar e cientificamente precisa = Resultado de 2D6 + bônus da tabela de interdisciplinaridade + bônus do personagem quando disponível.',
    },
  },
  areas: {
    gelo: { label: 'Gelo', cor: '#6b8cff' },
    litoranea: { label: 'Litorânea', cor: '#ff8c42' },
    mata: { label: 'Mata', cor: '#4ade80' },
    seca: { label: 'Seca', cor: '#fbbf24' },
    cidade: { label: 'Cidade', cor: '#c084fc' },
    global: { label: 'Global', cor: '#94a3b8' },
  },
  regrasMestre: {
    intro: {
      titulo: 'GUIA DO MESTRE: CARTAS DE DESASTRE',
      subtitulo: 'A Entropia Viva — RPG Pedagógico sobre Sustentabilidade e Desastres Ambientais',
      paragrafos: [
        'Este apêndice contém todas as cartas de desastre que compõem o baralho da Fase da Natureza do jogo (incluindo as Colapso Irreversível), dispostas de acordo com as regiões do mapa (Gelo, Litorânea, Seca, Mata e Cidade). Cada carta inclui a narrativa exibida no telão.',
        'Cada carta de desastre foi criada para que a solução apresentada pelos jogadores necessite da combinação de múltiplos eixos de conhecimento científico, não sendo suficiente um único eixo para resolvê-la. Esta exigência representa, na dinâmica do jogo, a concretização da discussão central deste trabalho, que aborda a fragmentação do conhecimento e a urgência de uma abordagem interdisciplinar no ensino das Ciências.',
      ],
    },
    impactoPadrao: 'Quando a carta de desastre é apresentada, o medidor de Colapso aumenta conforme a carta.',
    sucessoContencao: {
      titulo: 'Sucesso (Soma >= 10): O desastre é evitado e o Medidor de Colapso diminui 1 nível, enquanto o Cofre sobe para o nível que o mestre observou na tabela de interdisciplinaridade.',
      texto: 'Debate ou resolução interdisciplinar e cientificamente precisa = Resultado de 2D6 + bônus da tabela de interdisciplinaridade + bônus do personagem quando disponível.',
    },
    falhaContencao: {
      titulo: 'Falha na contenção: Uma proposta com uma resolução insatisfatória, que foi ignorada ou apenas parcialmente atendida só usar o + bônus do personagem.',
      texto: 'Proposta insatisfatória, ignorada ou não atendida (nível 0) - joga somente 2D6. O desastre se intensifica: colapso não diminui e o cofre não avança',
    },
    irreversivel: 'Antes de deixar qualquer área, uma carta de desastre irreversível é puxada. Não há solução no jogo: +1 no Colapso e a narrativa segue.',
    interdisciplinaridade: [
      {
        nivel: 0,
        cofre: 0,
        titulo: 'Pensamento fragmentado',
        caracteristica: 'Menciona um eixo',
        descricao: 'Citam conceitos científicos ou dados socioambientais de forma isolada, sem estabelecer relações de causa e efeito ou propor soluções integradas (com só um eixo), articulam informações incorretas ou oferecem explicação cientificamente errada/"mágica" (resolve sem explicar).',
      },
      {
        nivel: 1,
        cofre: 1,
        titulo: 'Dois eixos',
        caracteristica: 'Menciona dois eixos',
        descricao: 'Usa corretamente dois conceitos (Física, Química, Biologia) para atacar ou discutir o efeito do problema, mas não relaciona os efeitos entre si.',
      },
      {
        nivel: 2,
        cofre: 2,
        titulo: 'Início de um pensamento sistêmico',
        caracteristica: 'Conecta dois eixos',
        descricao: 'Explica por que um eixo influencia o outro (não só cita os dois lado a lado) para atacar ou discutir o efeito do desastre.',
      },
      {
        nivel: 3,
        cofre: 3,
        titulo: 'Pensamento sistêmico e holístico',
        caracteristica: 'Eixos articulados',
        descricao: 'Constrói uma cadeia entre três eixos, chega à causa raiz conectando os três e propõe solução (reduzindo a chance do problema voltar) ou discussão complexa acerca do desastre.',
      },
    ],
    eixos: [
      'Compreensão das leis da natureza (energia, calor, forças, fluidos)',
      'Domínio das transformações da matéria (reações, combustão, toxicidade)',
      'Entendimento da vida e dos ecossistemas (cadeias alimentares, comportamento, fisiologia)',
    ],
  },
};
