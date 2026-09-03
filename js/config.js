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
      eventoMaximo: 'O Colapso se iniciou!',
      descricaoEvento: 'A entropia atingiu o limite. O mundo começa a desmoronar.',
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
      eventoMaximo: 'O Cofre foi aberto!',
      descricaoEvento: 'O mecanismo final se revela. O segredo está ao alcance.',
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
    impactoPadrao: 'Quando a carta de desastre é apresentada, o medidor de Colapso aumenta conforme a carta.',
    sucessoContencao: {
      titulo: 'Sucesso na contenção (Soma ≥ 10)',
      texto: 'Debate ou resolução interdisciplinar e cientificamente precisa. Bônus de +3 no dado + bônus do personagem. O desastre é evitado: Colapso diminui 1 nível e o Cofre sobe conforme a tabela de interdisciplinaridade.',
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
