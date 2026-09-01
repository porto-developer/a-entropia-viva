/**
 * Helpers de localStorage com prefixo entropia_
 */
const STORAGE_KEYS = {
  logado: 'entropia_logado',
  medidores: 'entropia_medidores',
  log: 'entropia_log',
  som: 'entropia_som',
  maxDisparado: 'entropia_max_disparado',
};

function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function storageRemove(key) {
  localStorage.removeItem(key);
}

function isLogado() {
  return storageGet(STORAGE_KEYS.logado, false) === true;
}

function setLogado(valor) {
  storageSet(STORAGE_KEYS.logado, valor);
}

function clampMedidorValor(id, valor) {
  const config = CONFIG.medidores[id];
  if (!config) return valor;
  return Math.max(config.min, Math.min(config.max, valor));
}

function getMedidoresState() {
  const saved = storageGet(STORAGE_KEYS.medidores, null);
  const state = saved ? { ...saved } : {};

  Object.values(CONFIG.medidores).forEach((m) => {
    if (state[m.id] === undefined) {
      state[m.id] = m.inicial;
    } else {
      state[m.id] = clampMedidorValor(m.id, state[m.id]);
    }
  });
  return state;
}

function setMedidorValor(id, valor) {
  const state = getMedidoresState();
  state[id] = clampMedidorValor(id, valor);
  storageSet(STORAGE_KEYS.medidores, state);
  return state;
}

function getLog() {
  return storageGet(STORAGE_KEYS.log, []);
}

function addLogEntry(texto) {
  const log = getLog();
  const entry = {
    texto,
    timestamp: new Date().toISOString(),
  };
  log.unshift(entry);
  if (log.length > 200) log.length = 200;
  storageSet(STORAGE_KEYS.log, log);
  return log;
}

function clearLog() {
  storageSet(STORAGE_KEYS.log, []);
}

function getSomAtivo() {
  return storageGet(STORAGE_KEYS.som, true);
}

function setSomAtivo(ativo) {
  storageSet(STORAGE_KEYS.som, ativo);
}

function getMaxDisparado() {
  return storageGet(STORAGE_KEYS.maxDisparado, {});
}

function setMaxDisparado(id, disparado) {
  const state = getMaxDisparado();
  state[id] = disparado;
  storageSet(STORAGE_KEYS.maxDisparado, state);
}

function resetMaxDisparado(id) {
  const state = getMaxDisparado();
  delete state[id];
  storageSet(STORAGE_KEYS.maxDisparado, state);
}

function exportarEstado() {
  return {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    medidores: getMedidoresState(),
    log: getLog(),
    som: getSomAtivo(),
    maxDisparado: getMaxDisparado(),
  };
}

function importarEstado(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Arquivo inválido.');
  }
  if (data.medidores) storageSet(STORAGE_KEYS.medidores, data.medidores);
  if (data.log) storageSet(STORAGE_KEYS.log, data.log);
  if (typeof data.som === 'boolean') storageSet(STORAGE_KEYS.som, data.som);
  if (data.maxDisparado) storageSet(STORAGE_KEYS.maxDisparado, data.maxDisparado);
}
