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
  },
  tiposProcurar: {
    pista: { label: 'Pista', cor: '#fbbf24' }
  },
};
