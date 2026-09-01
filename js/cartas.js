/**
 * Sistema de cartas: fetch JSON, grid, modal de detalhes, busca/filtro.
 * Filtros e tags vêm de CONFIG.areas / CONFIG.tiposProcurar / CONFIG.raridades.
 */
let cartasDesastre = [];
let cartasProcurar = [];

async function carregarCartas(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function preencherSelect(select, mapa, placeholder) {
  if (!select) return;
  const entradas = mapa && typeof mapa === 'object' ? Object.entries(mapa) : [];
  if (entradas.length === 0) {
    select.hidden = true;
    return;
  }
  select.hidden = false;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  entradas.forEach(([valor, meta]) => {
    const opt = document.createElement('option');
    opt.value = valor;
    opt.textContent = meta.label || valor;
    select.appendChild(opt);
  });
}

function criarTag(texto, cor) {
  const span = document.createElement('span');
  span.className = 'tag';
  span.textContent = texto;
  if (cor) span.style.color = cor;
  return span;
}

function renderTags(carta, tipo) {
  const tags = document.createElement('div');
  tags.className = 'carta-tags';

  if (carta.area && CONFIG.areas && CONFIG.areas[carta.area]) {
    tags.appendChild(criarTag(CONFIG.areas[carta.area].label, CONFIG.areas[carta.area].cor));
  }
  if (carta.raridade && CONFIG.raridades && CONFIG.raridades[carta.raridade]) {
    tags.appendChild(criarTag(CONFIG.raridades[carta.raridade].label, CONFIG.raridades[carta.raridade].cor));
  }
  if (tipo === 'procurar' && carta.tipo && CONFIG.tiposProcurar && CONFIG.tiposProcurar[carta.tipo]) {
    tags.appendChild(criarTag(CONFIG.tiposProcurar[carta.tipo].label, CONFIG.tiposProcurar[carta.tipo].cor));
  }

  return tags;
}

function visualCarta(carta) {
  if (carta.imagem) {
    return `<img class="carta-imagem" src="${carta.imagem}" alt="">`;
  }
  return `<span class="carta-icone" aria-hidden="true">${carta.icone || '🃏'}</span>`;
}

function criarCartaEl(carta, tipo) {
  const el = document.createElement('article');
  el.className = 'carta';
  el.setAttribute('role', 'button');
  el.tabIndex = 0;
  el.dataset.id = carta.id;

  const areaCor = carta.area && CONFIG.areas && CONFIG.areas[carta.area]
    ? CONFIG.areas[carta.area].cor
    : 'var(--border)';
  el.style.borderColor = areaCor;

  el.innerHTML = `
    ${visualCarta(carta)}
    <div class="carta-nome">${carta.nome}</div>
    <div class="carta-descricao">${carta.descricao || ''}</div>
  `;
  el.appendChild(renderTags(carta, tipo));

  el.addEventListener('click', () => abrirDetalheCarta(carta, tipo));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirDetalheCarta(carta, tipo);
    }
  });

  return el;
}

function tagsHtmlCarta(carta, tipo) {
  let tagsHtml = '';
  if (carta.area && CONFIG.areas && CONFIG.areas[carta.area]) {
    tagsHtml += `<span class="tag" style="color:${CONFIG.areas[carta.area].cor}">${CONFIG.areas[carta.area].label}</span> `;
  }
  if (carta.raridade && CONFIG.raridades && CONFIG.raridades[carta.raridade]) {
    tagsHtml += `<span class="tag" style="color:${CONFIG.raridades[carta.raridade].cor}">${CONFIG.raridades[carta.raridade].label}</span> `;
  }
  if (tipo === 'procurar' && carta.tipo && CONFIG.tiposProcurar && CONFIG.tiposProcurar[carta.tipo]) {
    tagsHtml += `<span class="tag" style="color:${CONFIG.tiposProcurar[carta.tipo].cor}">${CONFIG.tiposProcurar[carta.tipo].label}</span>`;
  }
  return tagsHtml;
}

function abrirDetalheCarta(carta, tipo) {
  const overlay = document.getElementById('modal-overlay');
  const conteudo = document.getElementById('modal-conteudo');
  if (!overlay || !conteudo) return;

  const visual = carta.imagem
    ? `<img class="modal-detalhe-imagem" src="${carta.imagem}" alt="">`
    : `<div class="modal-detalhe-icone" aria-hidden="true">${carta.icone || '🃏'}</div>`;

  conteudo.innerHTML = `
    <div class="modal-detalhe">
      ${visual}
      <h3 class="modal-detalhe-nome">${carta.nome}</h3>
      <div class="carta-tags" style="justify-content:center;margin-bottom:1rem">${tagsHtmlCarta(carta, tipo)}</div>
      <p class="modal-detalhe-desc">${carta.descricao || 'Sem descrição.'}</p>
      ${carta.efeito ? `<div class="modal-detalhe-efeito"><strong>Efeito:</strong> ${carta.efeito}</div>` : ''}
    </div>
  `;
  overlay.hidden = false;
}

function filtrarCartas(cartas, busca, area, raridade, tipo) {
  return cartas.filter((c) => {
    if (busca && !c.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    if (area && c.area !== area) return false;
    if (raridade && c.raridade !== raridade) return false;
    if (tipo && c.tipo !== tipo) return false;
    return true;
  });
}

function renderGrid(tipo, cartas, gridId, emptyId, temCadastro) {
  const grid = document.getElementById(gridId);
  const empty = document.getElementById(emptyId);
  if (!grid) return;

  grid.innerHTML = '';

  if (cartas.length === 0) {
    if (empty) {
      empty.hidden = false;
      empty.textContent = temCadastro
        ? 'Nenhuma carta corresponde aos filtros.'
        : (tipo === 'desastre'
          ? 'Nenhuma carta de desastre cadastrada.'
          : 'Nenhuma carta de procurar cadastrada.');
    }
    return;
  }

  if (empty) empty.hidden = true;
  cartas.forEach((c) => grid.appendChild(criarCartaEl(c, tipo)));
}

function setupFiltros(tipo, cartasRef, prefix) {
  const busca = document.getElementById(`busca-${prefix}`);
  const filtroArea = document.getElementById(`filtro-area-${prefix}`);
  const filtroRaridade = document.getElementById(`filtro-raridade-${prefix}`);
  const filtroTipo = document.getElementById(`filtro-tipo-${prefix}`);

  preencherSelect(filtroArea, CONFIG.areas, 'Todos os biomas');
  preencherSelect(filtroRaridade, CONFIG.raridades, 'Todas as raridades');
  if (prefix === 'procurar') {
    const tipos = CONFIG.tiposProcurar || {};
    preencherSelect(filtroTipo, tipos, 'Todos os tipos');
    if (Object.keys(tipos).length <= 1 && filtroTipo) filtroTipo.hidden = true;
  }

  function aplicar() {
    const filtradas = filtrarCartas(
      cartasRef,
      busca?.value || '',
      filtroArea?.value || '',
      filtroRaridade?.value || '',
      filtroTipo?.value || ''
    );
    renderGrid(tipo, filtradas, `grid-${prefix}`, `empty-${prefix}`, cartasRef.length > 0);
  }

  [busca, filtroArea, filtroRaridade, filtroTipo].forEach((el) => {
    if (el) el.addEventListener('input', aplicar);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', aplicar);
  });

  aplicar();
}

function mostrarErroCartas(prefix, msg) {
  const erro = document.getElementById(`erro-${prefix}`);
  if (erro) {
    erro.textContent = msg;
    erro.hidden = false;
  }
}

async function initCartas() {
  try {
    cartasDesastre = await carregarCartas(CONFIG.cartas.desastre);
    setupFiltros('desastre', cartasDesastre, 'desastre');
  } catch {
    mostrarErroCartas('desastre',
      'Não foi possível carregar as cartas de desastre. Use um servidor estático (ex: python3 -m http.server) em vez de abrir o arquivo diretamente.');
  }

  try {
    cartasProcurar = await carregarCartas(CONFIG.cartas.procurar);
    setupFiltros('procurar', cartasProcurar, 'procurar');
  } catch {
    mostrarErroCartas('procurar',
      'Não foi possível carregar as cartas de procurar. Use um servidor estático (ex: python3 -m http.server) em vez de abrir o arquivo diretamente.');
  }
}
