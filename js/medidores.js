/**
 * Medidores: gauge circular, slider, cores, pulso, modal de máximo, reset.
 */
let medidorModo = 'admin';
let valoresAnteriores = {};

function interpolarCor(ratio, inverter = false) {
  // Colapso: verde (0) → amarelo (0.5) → vermelho (1)
  // Cofre:   vermelho (0) → amarelo (0.5) → verde (1)
  const t = inverter ? 1 - ratio : ratio;
  let r, g, b;
  if (t <= 0.5) {
    const k = t * 2;
    r = Math.round(34 + (251 - 34) * k);
    g = Math.round(197 + (191 - 197) * k);
    b = Math.round(94 + (36 - 94) * k);
  } else {
    const k = (t - 0.5) * 2;
    r = Math.round(251 + (239 - 251) * k);
    g = Math.round(191 + (68 - 191) * k);
    b = Math.round(36 + (68 - 36) * k);
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function classesPulso(ratio, inverter) {
  if (ratio >= 1) return inverter ? 'pulso-max-positivo' : 'pulso-max';
  if (ratio >= CONFIG.limiarPulso) return inverter ? 'pulso-positivo' : 'pulso';
  return '';
}

function calcularRatio(valor, min, max) {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (valor - min) / (max - min)));
}

function formatarHora(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function renderGaugeRing(el, valor, config) {
  const ratio = calcularRatio(valor, config.min, config.max);
  const cor = interpolarCor(ratio, config.inverterCores);
  const pct = Math.round(ratio * 100);
  const ring = el.querySelector('.gauge-ring');
  const valorEl = el.querySelector('.gauge-valor');

  ring.style.background = `conic-gradient(${cor} ${pct}%, var(--border) ${pct}%)`;
  valorEl.textContent = valor;
  valorEl.style.color = cor;

  ring.classList.remove('pulso', 'pulso-max', 'pulso-positivo', 'pulso-max-positivo');
  const classe = classesPulso(ratio, config.inverterCores);
  if (classe) ring.classList.add(classe);
}

function criarMedidorHTML(config, valor, modo) {
  const card = document.createElement('div');
  card.className = 'medidor-card';
  card.dataset.id = config.id;

  const ratio = calcularRatio(valor, config.min, config.max);
  const cor = interpolarCor(ratio, config.inverterCores);
  const pct = Math.round(ratio * 100);
  const classePulso = classesPulso(ratio, config.inverterCores);

  card.innerHTML = `
    <div class="medidor-header">
      <span class="medidor-icone" aria-hidden="true">${config.icone}</span>
      <h3>${config.nome}</h3>
    </div>
    <div class="gauge" aria-label="${config.nome}: ${valor} de ${config.max}">
      <div class="gauge-ring ${classePulso}"
           style="background: conic-gradient(${cor} ${pct}%, var(--border) ${pct}%)">
        <div class="gauge-inner">
          <span class="gauge-valor" style="color: ${cor}">${valor}</span>
          <span class="gauge-max">/ ${config.max}</span>
        </div>
      </div>
    </div>
    ${modo === 'admin' ? `
      <input type="range" class="medidor-slider"
             min="${config.min}" max="${config.max}" value="${valor}"
             aria-label="Ajustar ${config.nome}">
      <div class="medidor-actions">
        <button type="button" class="btn btn-ghost btn-sm btn-reset" data-id="${config.id}">
          Resetar
        </button>
      </div>
    ` : ''}
  `;

  return card;
}

function mostrarModalEvento(config) {
  const overlay = document.getElementById('modal-overlay');
  const conteudo = document.getElementById('modal-conteudo');
  if (!overlay || !conteudo) return;

  const classeTema = config.tema === 'colapso' ? 'modal-evento-colapso' : 'modal-evento-cofre';
  conteudo.innerHTML = `
    <div class="${classeTema}">
      <div class="modal-evento-icone" aria-hidden="true">${config.icone}</div>
      <h3 class="modal-evento-titulo">${config.eventoMaximo}</h3>
      <p class="modal-evento-desc">${config.descricaoEvento}</p>
    </div>
  `;
  overlay.hidden = false;
}

function fecharModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.hidden = true;
}

function mostrarConfirmacao(mensagem) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('confirm-overlay');
    const msgEl = document.getElementById('confirm-mensagem');
    const btnOk = document.getElementById('confirm-ok');
    const btnCancel = document.getElementById('confirm-cancelar');
    if (!overlay || !msgEl || !btnOk || !btnCancel) {
      resolve(false);
      return;
    }

    msgEl.textContent = mensagem;
    overlay.hidden = false;

    function cleanup(result) {
      overlay.hidden = true;
      btnOk.removeEventListener('click', onOk);
      btnCancel.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onBackdrop);
      document.removeEventListener('keydown', onEscape);
      resolve(result);
    }

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onBackdrop(e) {
      if (e.target === overlay) cleanup(false);
    }
    function onEscape(e) {
      if (e.key === 'Escape') cleanup(false);
    }

    btnOk.addEventListener('click', onOk);
    btnCancel.addEventListener('click', onCancel);
    overlay.addEventListener('click', onBackdrop);
    document.addEventListener('keydown', onEscape);
  });
}

function esconderModais() {
  const modal = document.getElementById('modal-overlay');
  const confirm = document.getElementById('confirm-overlay');
  if (modal) modal.hidden = true;
  if (confirm) confirm.hidden = true;
}

function verificarMaximo(id, valorAnterior, valorNovo, config) {
  if (valorNovo < config.max) {
    if (valorAnterior >= config.max && medidorModo === 'admin') {
      resetMaxDisparado(id);
    }
    return;
  }

  if (valorAnterior < config.max) {
    if (medidorModo === 'publico') {
      mostrarModalEvento(config);
      return;
    }

    const disparado = getMaxDisparado();
    if (!disparado[id]) {
      setMaxDisparado(id, true);
      mostrarModalEvento(config);
      if (typeof tocarSomMaximo === 'function') {
        tocarSomMaximo(id);
      }
    }
  }
}

function atualizarMedidor(id, valorNovo) {
  const config = CONFIG.medidores[id];
  if (!config) return;

  const valorAnterior = valoresAnteriores[id] ?? config.inicial;
  setMedidorValor(id, valorNovo);
  valoresAnteriores[id] = valorNovo;

  const card = document.querySelector(`.medidor-card[data-id="${id}"]`);
  if (card) {
    const gauge = card.querySelector('.gauge');
    renderGaugeRing(gauge, valorNovo, config);
    const slider = card.querySelector('.medidor-slider');
    if (slider) slider.value = valorNovo;
  }

  verificarMaximo(id, valorAnterior, valorNovo, config);

  if (medidorModo === 'admin' && valorAnterior !== valorNovo) {
    const hora = formatarHora(new Date().toISOString());
    const texto = `${config.nome} ajustado de ${valorAnterior} para ${valorNovo} às ${hora}`;
    if (typeof addLogEntry === 'function') {
      addLogEntry(texto);
      if (typeof renderLog === 'function') renderLog();
    }
  }
}

async function resetarMedidor(id) {
  const config = CONFIG.medidores[id];
  if (!config) return;

  const ok = await mostrarConfirmacao(
    `Resetar "${config.nome}" para ${config.inicial}? Esta ação não pode ser desfeita automaticamente.`
  );
  if (!ok) return;

  const valorAnterior = valoresAnteriores[id] ?? config.inicial;
  resetMaxDisparado(id);
  atualizarMedidor(id, config.inicial);

  if (medidorModo === 'admin') {
    const hora = formatarHora(new Date().toISOString());
    addLogEntry(`${config.nome} resetado de ${valorAnterior} para ${config.inicial} às ${hora}`);
    if (typeof renderLog === 'function') renderLog();
  }
}

function renderMedidores(modo) {
  const container = document.getElementById('medidores-container');
  if (!container) return;

  const state = getMedidoresState();
  container.innerHTML = '';

  Object.values(CONFIG.medidores).forEach((config) => {
    const valor = state[config.id] ?? config.inicial;
    valoresAnteriores[config.id] = valor;
    container.appendChild(criarMedidorHTML(config, valor, modo));

    // Se já estava no máximo ao carregar, marca como disparado sem abrir modal
    if (valor >= config.max) {
      setMaxDisparado(config.id, true);
    }
  });

  if (modo === 'admin') {
    container.querySelectorAll('.medidor-slider').forEach((slider) => {
      const card = slider.closest('.medidor-card');
      const id = card.dataset.id;
      slider.addEventListener('input', () => {
        atualizarMedidor(id, parseInt(slider.value, 10));
      });
    });

    container.querySelectorAll('.btn-reset').forEach((btn) => {
      btn.addEventListener('click', () => resetarMedidor(btn.dataset.id));
    });
  }
}

function sincronizarMedidoresPublico() {
  const state = getMedidoresState();
  Object.values(CONFIG.medidores).forEach((config) => {
    const valorNovo = state[config.id] ?? config.inicial;
    const valorAnterior = valoresAnteriores[config.id] ?? config.inicial;

    if (valorNovo === valorAnterior) return;

    const card = document.querySelector(`.medidor-card[data-id="${config.id}"]`);
    if (card) {
      renderGaugeRing(card.querySelector('.gauge'), valorNovo, config);
    }

    verificarMaximo(config.id, valorAnterior, valorNovo, config);
    valoresAnteriores[config.id] = valorNovo;
  });
}

function initModalEvento() {
  const btnFechar = document.getElementById('modal-fechar');
  const overlay = document.getElementById('modal-overlay');
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModal();
    });
  }
}

function initMedidores(modo) {
  medidorModo = modo;
  esconderModais();
  renderMedidores(modo);

  if (modo === 'admin') {
    initModalEvento();
  }

  if (modo === 'publico') {
    initModalEvento();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEYS.medidores) {
        sincronizarMedidoresPublico();
      }
    });

    setInterval(sincronizarMedidoresPublico, 10000);
  }
}
