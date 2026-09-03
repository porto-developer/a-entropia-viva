/**
 * Helpers de localStorage com prefixo entropia_
 */
const STORAGE_KEYS = {
  logado: 'entropia_logado',
  medidores: 'entropia_medidores',
  maxDisparado: 'entropia_max_disparado',
  cartasAtivas: 'entropia_cartas_ativas',
  colapsoAplicado: 'entropia_colapso_aplicado',
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

function getCartasAtivas() {
  const saved = storageGet(STORAGE_KEYS.cartasAtivas, null);
  if (saved && Array.isArray(saved.ids)) {
    return { ids: [...saved.ids], destaque: saved.destaque || null };
  }
  return { ids: [], destaque: null };
}

function setCartasAtivas(state) {
  storageSet(STORAGE_KEYS.cartasAtivas, {
    ids: state.ids || [],
    destaque: state.destaque || null,
  });
}

function isCartaAtiva(id) {
  return getCartasAtivas().ids.includes(id);
}

function getColapsoAplicado() {
  return storageGet(STORAGE_KEYS.colapsoAplicado, {});
}

function marcarColapsoAplicado(id) {
  const state = getColapsoAplicado();
  state[id] = true;
  storageSet(STORAGE_KEYS.colapsoAplicado, state);
}

function jaAplicouColapso(id) {
  return !!getColapsoAplicado()[id];
}

function setDestaqueCarta(id) {
  const state = getCartasAtivas();
  if (!state.ids.includes(id)) return;
  state.destaque = id;
  setCartasAtivas(state);
}

function limparDestaqueCarta() {
  const state = getCartasAtivas();
  state.destaque = null;
  setCartasAtivas(state);
}

function exportarEstado() {
  return {
    versao: 2,
    exportadoEm: new Date().toISOString(),
    medidores: getMedidoresState(),
    maxDisparado: getMaxDisparado(),
    cartasAtivas: getCartasAtivas(),
    colapsoAplicado: getColapsoAplicado(),
  };
}

function importarEstado(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Arquivo inválido.');
  }
  if (data.medidores) storageSet(STORAGE_KEYS.medidores, data.medidores);
  if (data.maxDisparado) storageSet(STORAGE_KEYS.maxDisparado, data.maxDisparado);
  if (data.cartasAtivas) setCartasAtivas(data.cartasAtivas);
  if (data.colapsoAplicado) storageSet(STORAGE_KEYS.colapsoAplicado, data.colapsoAplicado);
}
