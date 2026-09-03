/**
 * Telão: cartas de desastre ativas e modal do jogador.
 */
let cartasDesastrePublico = [];
let ultimoDestaque = null;
let modalAbertoId = null;

async function carregarDesastresPublico() {
  if (cartasDesastrePublico.length) return cartasDesastrePublico;
  const resp = await fetch(CONFIG.cartas.desastre);
  if (!resp.ok) throw new Error('fetch failed');
  cartasDesastrePublico = await resp.json();
  return cartasDesastrePublico;
}

function getCartaPublico(id) {
  return cartasDesastrePublico.find((c) => c.id === id);
}

function renderModalJogador(carta) {
  const overlay = document.getElementById('modal-overlay');
  const conteudo = document.getElementById('modal-conteudo');
  if (!overlay || !conteudo || !carta) return;

  const meta = CONFIG.areas[carta.area];
  modalAbertoId = carta.id;

  let html = `
    <div class="modal-jogador ${carta.irreversivel ? 'modal-jogador-irreversivel' : ''}">
      <div class="modal-detalhe-header">
        <span class="carta-codigo modal-codigo-grande">${carta.codigo || carta.id}</span>
        <h2 class="modal-jogador-titulo">${carta.nome}</h2>
        ${meta ? `<div class="carta-tags"><span class="tag tag-grande" style="color:${meta.cor}">${meta.label}</span></div>` : ''}
        ${carta.irreversivel ? '<p class="aviso-irreversivel-telao">Evento irreversível — sem solução neste turno</p>' : ''}
      </div>
      <div class="modal-jogador-narrativa">${carta.jogador?.narrativa || ''}</div>
  `;

  if (carta.jogador?.pergunta && !carta.irreversivel) {
    html += `<div class="modal-jogador-pergunta">${carta.jogador.pergunta}</div>`;
  }

  html += '</div>';
  conteudo.innerHTML = html;
  const acoes = document.getElementById('modal-acoes');
  if (acoes) acoes.innerHTML = '';
  overlay.hidden = false;
}

function fecharModalPublico() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.hidden = true;
  modalAbertoId = null;
  limparDestaqueCarta();
}

function renderCartasAtivasPublico() {
  const container = document.getElementById('cartas-ativas-publico');
  if (!container) return;

  const { ids, destaque } = getCartasAtivas();
  container.innerHTML = '';

  if (ids.length === 0) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  const titulo = document.createElement('h2');
  titulo.className = 'publico-cartas-titulo';
  titulo.textContent = 'Desastres ativos';
  container.appendChild(titulo);

  const grid = document.createElement('div');
  grid.className = 'cartas-ativas-grid';

  ids.forEach((id) => {
    const carta = getCartaPublico(id);
    if (!carta) return;

    const meta = CONFIG.areas[carta.area];
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'carta-ativa-tile';
    if (destaque === id) tile.classList.add('carta-ativa-destaque');
    if (meta) tile.style.borderColor = meta.cor;

    tile.innerHTML = `
      <span class="carta-codigo">${carta.codigo}</span>
      <span class="carta-icone">${carta.icone || '☢'}</span>
      <span class="carta-ativa-nome">${carta.nome}</span>
      ${meta ? `<span class="tag" style="color:${meta.cor}">${meta.label}</span>` : ''}
    `;

    tile.addEventListener('click', () => {
      setDestaqueCarta(id);
      renderModalJogador(carta);
      renderCartasAtivasPublico();
    });

    grid.appendChild(tile);
  });

  container.appendChild(grid);
}

function sincronizarPublicoCartas() {
  renderCartasAtivasPublico();

  const { destaque } = getCartasAtivas();
  if (destaque && destaque !== ultimoDestaque) {
    const carta = getCartaPublico(destaque);
    if (carta) renderModalJogador(carta);
  } else if (!destaque && modalAbertoId && ultimoDestaque) {
    fecharModalPublico();
  }
  ultimoDestaque = destaque;
}

async function initPublicoCartas() {
  const btnFechar = document.getElementById('modal-fechar');
  const overlay = document.getElementById('modal-overlay');
  if (btnFechar) btnFechar.addEventListener('click', fecharModalPublico);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModalPublico();
    });
  }

  try {
    await carregarDesastresPublico();
    sincronizarPublicoCartas();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEYS.cartasAtivas) sincronizarPublicoCartas();
    });

    setInterval(sincronizarPublicoCartas, 10000);
  } catch {
    /* cartas indisponíveis em file:// */
  }
}
