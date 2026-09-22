/**
 * Sistema de cartas: fetch, grid, modal do mestre, ativação no telão.
 */
let cartasDesastre = [];
let cartaModalAtual = null;

async function carregarCartas(url) {
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const cartas = await resp.json();
  return cartas.map(normalizarIconeCarta);
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

function areaMeta(area) {
  return CONFIG.areas && CONFIG.areas[area] ? CONFIG.areas[area] : null;
}

function renderTagsDesastre(carta) {
  const tags = document.createElement('div');
  tags.className = 'carta-tags';
  const meta = areaMeta(carta.area);
  if (meta) tags.appendChild(criarTag(meta.label, meta.cor));
  if (carta.perigo) tags.appendChild(criarTag(`Perigo ${carta.perigo.codigo}`, '#ef4444'));
  if (carta.irreversivel) tags.appendChild(criarTag('Irreversível', '#ef4444'));
  tags.appendChild(criarTag(`+${carta.aumentoColapso} Colapso`, '#f87171'));
  if (isCartaAtiva(carta.id)) tags.appendChild(criarTag('Ativa', '#22c55e'));
  return tags;
}

function ordenarCartasDesastre(cartas) {
  return [...cartas].sort((a, b) => Number(!!b.perigo) - Number(!!a.perigo));
}

function htmlPerigoMestre(carta) {
  if (!carta.perigo) return '';
  return `
    <div class="perigo-mestre perigo-mestre-topo">
      <h4>Perigo associado — ${carta.perigo.codigo}: ${carta.perigo.nome}</h4>
      <p>${carta.perigo.descricao || ''}</p>
      ${carta.perigo.efeito ? `<p><strong>Efeito:</strong> ${carta.perigo.efeito}</p>` : ''}
    </div>`;
}

function resumoCarta(carta) {
  if (carta.jogador?.narrativa) return carta.jogador.narrativa;
  return carta.descricao || '';
}

function criarCartaDesastreEl(carta) {
  const el = document.createElement('article');
  el.className = 'carta carta-desastre';
  if (carta.perigo) el.classList.add('carta-com-perigo');
  if (isCartaAtiva(carta.id)) el.classList.add('carta-ativa');
  el.setAttribute('role', 'button');
  el.tabIndex = 0;
  el.dataset.id = carta.id;

  const meta = areaMeta(carta.area);
  el.style.borderColor = meta ? meta.cor : 'var(--border)';

  el.innerHTML = `
    <span class="carta-codigo">${carta.codigo || carta.id}</span>
    ${icon(carta.icone || ICON_DEFAULTS.desastre, 'carta-icone')}
    <div class="carta-nome">${carta.nome}</div>
    <div class="carta-descricao">${resumoCarta(carta).slice(0, 120)}${resumoCarta(carta).length > 120 ? '…' : ''}</div>
  `;
  el.appendChild(renderTagsDesastre(carta));

  el.addEventListener('click', () => abrirModalMestre(carta));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirModalMestre(carta);
    }
  });
  return el;
}

function listaHtml(items) {
  if (!items || !items.length) return '';
  return `<ul class="lista-mestre">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

function abrirModalMestre(carta) {
  cartaModalAtual = carta;
  const overlay = document.getElementById('modal-overlay');
  const conteudo = document.getElementById('modal-conteudo');
  if (!overlay || !conteudo) return;

  const meta = areaMeta(carta.area);
  const ativa = isCartaAtiva(carta.id);
  let html = `
    <div class="modal-detalhe modal-mestre" ${meta ? `style="border-top: 4px solid ${meta.cor}"` : ''}>
      <div class="modal-detalhe-header">
        <span class="carta-codigo modal-codigo">${carta.codigo || carta.id}</span>
        ${icon(carta.icone || ICON_DEFAULTS.desastre, 'modal-detalhe-icone')}
        <h3 class="modal-detalhe-nome">${carta.nome}</h3>
        <div class="carta-tags">
          ${meta ? `<span class="tag" style="color:${meta.cor}">${meta.label}</span>` : ''}
          <span class="tag" style="color:#f87171">+${carta.aumentoColapso} Colapso</span>
          ${carta.irreversivel ? '<span class="tag" style="color:#ef4444">Irreversível</span>' : ''}
        </div>
      </div>
      ${htmlPerigoMestre(carta)}
  `;

  if (carta.jogador?.narrativa) {
    html += `
      <div class="bloco-jogador-preview">
        <h4>Texto do jogador (telão)</h4>
        <p>${carta.jogador.narrativa}</p>
        ${carta.jogador.pergunta ? `<p class="pergunta-preview"><strong>Pergunta:</strong> ${carta.jogador.pergunta}</p>` : ''}
      </div>`;
  }

  if (carta.mestre) {
    html += `
      <div class="secao-mestre">
        <h4>O que está acontecendo</h4>
        <p>${carta.mestre.oQueAcontece || ''}</p>
        ${carta.mestre.informacoesGuia?.length ? `<h4>Informações para guiar</h4>${listaHtml(carta.mestre.informacoesGuia)}` : ''}
        ${carta.mestre.causas?.length ? `<h4>Possíveis causas</h4>${listaHtml(carta.mestre.causas)}` : ''}
        ${carta.mestre.pista ? `<div class="pista-mestre"><strong>Pista para o mestre:</strong> ${carta.mestre.pista}</div>` : ''}
      </div>`;
  } else if (carta.irreversivel) {
    html += `<p class="aviso-irreversivel">Carta sem solução no jogo. +1 no Colapso; a narrativa segue.</p>`;
  }

  html += `
    </div>`;

  conteudo.innerHTML = html;
  renderModalAcoesDesastre(carta, ativa);
  refreshIcons(conteudo);
  overlay.hidden = false;
}

function limparModalAcoes() {
  const acoes = document.getElementById('modal-acoes');
  if (acoes) acoes.innerHTML = '';
}

function renderModalAcoesDesastre(carta, ativa) {
  const acoes = document.getElementById('modal-acoes');
  if (!acoes) return;

  const emExibicao = getCartasAtivas().destaque === carta.id;

  acoes.innerHTML = `
    <button type="button" class="btn ${ativa ? 'btn-confirm' : 'btn-primary'}" id="btn-toggle-ativa">
      ${ativa ? 'Desativar no telão' : 'Ativar no telão'}
    </button>
    ${ativa ? `<button type="button" class="btn ${emExibicao ? 'btn-ghost' : 'btn-secondary'}" id="btn-exibir-telao">${emExibicao ? 'Remover exibição' : 'Exibir no telão'}</button>` : ''}
  `;

  document.getElementById('btn-toggle-ativa')?.addEventListener('click', () => toggleCartaAtiva(carta));
  document.getElementById('btn-exibir-telao')?.addEventListener('click', () => {
    if (getCartasAtivas().destaque === carta.id) removerExibicaoTelao();
    else exibirNoTelao(carta.id);
  });
  refreshIcons(acoes);
}

async function toggleCartaAtiva(carta) {
  if (isCartaAtiva(carta.id)) {
    await desativarCarta(carta);
  } else {
    await ativarCarta(carta);
  }
}

async function ativarCarta(carta) {
  const state = getCartasAtivas();
  if (state.ids.includes(carta.id)) return;

  if (!jaAplicouColapso(carta.id)) {
    const ok = await mostrarConfirmacao(
      `Ativar "${carta.nome}" no telão e somar +${carta.aumentoColapso} no Medidor de Colapso?`
    );
    if (!ok) return;

    const medState = getMedidoresState();
    const novo = clampMedidorValor('colapso', medState.colapso + carta.aumentoColapso);
    setMedidorValor('colapso', novo);
    marcarColapsoAplicado(carta.id);
    if (typeof renderMedidores === 'function') renderMedidores('admin');
  }

  state.ids.push(carta.id);
  setCartasAtivas(state);
  fecharModalCartas();
  refreshGridsDesastre();
}

async function desativarCarta(carta) {
  const colapsoFoiAplicado = jaAplicouColapso(carta.id);
  const msg = colapsoFoiAplicado
    ? `Remover "${carta.nome}" do telão e subtrair ${carta.aumentoColapso} do Medidor de Colapso?`
    : `Remover "${carta.nome}" do telão?`;
  const ok = await mostrarConfirmacao(msg);
  if (!ok) return;

  if (colapsoFoiAplicado) {
    const medState = getMedidoresState();
    const novo = clampMedidorValor('colapso', medState.colapso - carta.aumentoColapso);
    setMedidorValor('colapso', novo);
    desmarcarColapsoAplicado(carta.id);
    if (typeof renderMedidores === 'function') renderMedidores('admin');
  }

  const state = getCartasAtivas();
  state.ids = state.ids.filter((id) => id !== carta.id);
  if (state.destaque === carta.id) state.destaque = null;
  setCartasAtivas(state);
  fecharModalCartas();
  refreshGridsDesastre();
}

function exibirNoTelao(id) {
  setDestaqueCarta(id);
  fecharModalCartas();
  renderCartasAtivas();
}

function removerExibicaoTelao() {
  limparDestaqueCarta();
  renderCartasAtivas();
  if (cartaModalAtual) {
    renderModalAcoesDesastre(cartaModalAtual, isCartaAtiva(cartaModalAtual.id));
  }
}

function fecharModalCartas() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.hidden = true;
  limparModalAcoes();
  cartaModalAtual = null;
}

function filtrarDesastre(cartas, busca, area, tipo) {
  return cartas.filter((c) => {
    if (busca) {
      const q = busca.toLowerCase();
      const alvo = `${c.nome} ${c.codigo} ${c.id}`.toLowerCase();
      if (!alvo.includes(q)) return false;
    }
    if (area && c.area !== area) return false;
    if (tipo === 'regional' && c.irreversivel) return false;
    if (tipo === 'irreversivel' && !c.irreversivel) return false;
    return true;
  });
}

function renderGridDesastre(cartas, temCadastro) {
  const grid = document.getElementById('grid-desastre');
  const empty = document.getElementById('empty-desastre');
  if (!grid) return;
  grid.innerHTML = '';
  if (cartas.length === 0) {
    if (empty) {
      empty.hidden = false;
      empty.textContent = temCadastro ? 'Nenhuma carta corresponde aos filtros.' : 'Nenhuma carta de desastre cadastrada.';
    }
    return;
  }
  if (empty) empty.hidden = true;
  cartas.forEach((c) => grid.appendChild(criarCartaDesastreEl(c)));
  refreshIcons(grid);
}

function refreshGridsDesastre() {
  const busca = document.getElementById('busca-desastre');
  const filtroArea = document.getElementById('filtro-area-desastre');
  const filtroTipo = document.getElementById('filtro-tipo-desastre');
  const filtradas = ordenarCartasDesastre(filtrarDesastre(
    cartasDesastre,
    busca?.value || '',
    filtroArea?.value || '',
    filtroTipo?.value || ''
  ));
  renderGridDesastre(filtradas, cartasDesastre.length > 0);
  renderCartasAtivas();
}

function renderCartasAtivas() {
  const lista = document.getElementById('lista-cartas-ativas');
  const empty = document.getElementById('empty-ativas');
  if (!lista) return;

  const { ids, destaque } = getCartasAtivas();
  const ativas = ids
    .map((id) => cartasDesastre.find((c) => c.id === id))
    .filter(Boolean);

  lista.innerHTML = '';

  if (ativas.length === 0) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  ativas.forEach((carta) => {
    const meta = areaMeta(carta.area);
    const emExibicao = destaque === carta.id;
    const item = document.createElement('div');
    item.className = 'carta-ativa-admin-item';
    if (emExibicao) item.classList.add('carta-ativa-admin-destaque');
    if (meta) item.style.borderLeftColor = meta.cor;

    item.innerHTML = `
      <button type="button" class="carta-ativa-admin-info" aria-label="Abrir detalhes de ${carta.nome}">
        <span class="carta-codigo">${carta.codigo || carta.id}</span>
        <span class="carta-ativa-admin-nome">${carta.nome}</span>
        ${meta ? `<span class="tag" style="color:${meta.cor}">${meta.label}</span>` : ''}
        ${emExibicao ? '<span class="tag tag-exibindo">Exibindo</span>' : ''}
      </button>
      <div class="carta-ativa-admin-acoes">
        <button type="button" class="btn btn-sm btn-exibir-ativa ${emExibicao ? 'btn-secondary' : 'btn-ghost'}">${emExibicao ? 'Remover exibição' : 'Exibir'}</button>
        <button type="button" class="btn btn-danger btn-sm btn-desativar-ativa">Desativar</button>
      </div>
    `;

    item.querySelector('.carta-ativa-admin-info')?.addEventListener('click', () => abrirModalMestre(carta));
    item.querySelector('.btn-exibir-ativa')?.addEventListener('click', () => {
      if (getCartasAtivas().destaque === carta.id) removerExibicaoTelao();
      else exibirNoTelao(carta.id);
    });
    item.querySelector('.btn-desativar-ativa')?.addEventListener('click', () => desativarCarta(carta));

    lista.appendChild(item);
  });
  refreshIcons(lista);
}

function renderIntroGuia() {
  const el = document.getElementById('guia-intro');
  if (!el || !CONFIG.regrasMestre?.intro) return;
  const intro = CONFIG.regrasMestre.intro;

  el.innerHTML = `
    <h2 id="titulo-guia-intro" class="guia-intro-titulo">${intro.titulo}</h2>
    <p class="guia-intro-subtitulo">${intro.subtitulo}</p>
    ${intro.paragrafos.map((p) => `<p class="guia-intro-texto">${p}</p>`).join('')}
  `;
}

function renderConsultaMestre() {
  const el = document.getElementById('consulta-mestre-conteudo');
  if (!el || !CONFIG.regrasMestre) return;
  const r = CONFIG.regrasMestre;

  const regionais = cartasDesastre.filter((c) => !c.irreversivel);
  const linhasCartas = regionais.map((c) => {
    const regiao = areaMeta(c.area)?.label || c.area || '—';
    return `<tr>
      <td class="col-numero">${c.codigo}</td>
      <td class="col-carta">${c.nome}</td>
      <td class="col-regiao">${regiao}</td>
      <td class="col-aumento">${c.aumentoColapso}</td>
    </tr>`;
  }).join('');

  el.innerHTML = `
    <div class="consulta-rapida-bloco">
      <table class="tabela-consulta tabela-consulta-rapida" aria-label="Consulta rápida — cartas de desastre">
        <thead>
          <tr>
            <th>Número</th>
            <th>Carta</th>
            <th>Região</th>
            <th>Aumento do medidor</th>
          </tr>
        </thead>
        <tbody>${linhasCartas || '<tr><td colspan="4">Carregando cartas…</td></tr>'}</tbody>
      </table>
    </div>

    <details class="consulta-detalhes">
      <summary>Regras de contenção e interdisciplinaridade</summary>
      <div class="consulta-detalhes-conteudo">
        <p>${r.impactoPadrao}</p>
        <div class="consulta-bloco">
          <h4>${r.sucessoContencao.titulo}</h4>
          <p>${r.sucessoContencao.texto}</p>
        </div>
        <div class="consulta-bloco">
          <h4>${r.falhaContencao.titulo}</h4>
          <p>${r.falhaContencao.texto}</p>
        </div>
        <div class="consulta-bloco">
          <h4>${r.regraInvestigacao.titulo}</h4>
          <p>${r.regraInvestigacao.texto}</p>
        </div>
        <div class="consulta-bloco">
          <h4>Colapso irreversível</h4>
          <p>${r.irreversivel}</p>
        </div>
        <h4>Tabela de interdisciplinaridade</h4>
        <table class="tabela-consulta">
          <thead><tr><th>Nível</th><th>Pontos no Cofre</th><th>O que caracteriza a resposta</th><th>Descrição</th></tr></thead>
          <tbody>
            ${r.interdisciplinaridade.map((row) => {
              const pontos = row.cofre === 0 ? '0 pontos' : `+${row.cofre} ponto${row.cofre > 1 ? 's' : ''}`;
              return `<tr>
                <td><strong>${row.titulo}</strong> (${row.nivel})</td>
                <td>${pontos}</td>
                <td>${row.caracteristica || '—'}</td>
                <td>${row.descricao}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
        <h4>Três eixos de conhecimento</h4>
        ${listaHtml(r.eixos)}
      </div>
    </details>
  `;
}

function setupFiltrosDesastre() {
  const busca = document.getElementById('busca-desastre');
  const filtroArea = document.getElementById('filtro-area-desastre');
  const filtroTipo = document.getElementById('filtro-tipo-desastre');

  preencherSelect(filtroArea, CONFIG.areas, 'Todas as regiões');
  if (filtroTipo) {
    filtroTipo.innerHTML = `
      <option value="">Todas as cartas</option>
      <option value="regional">Regionais</option>
      <option value="irreversivel">Irreversíveis</option>
    `;
  }

  function aplicar() { refreshGridsDesastre(); }
  [busca, filtroArea, filtroTipo].forEach((el) => {
    if (el) {
      el.addEventListener('input', aplicar);
      if (el.tagName === 'SELECT') el.addEventListener('change', aplicar);
    }
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

function initModalCartasAdmin() {
  const btnFechar = document.getElementById('modal-fechar');
  const overlay = document.getElementById('modal-overlay');
  if (btnFechar) btnFechar.addEventListener('click', fecharModalCartas);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModalCartas();
    });
  }
}

async function initCartas() {
  initModalCartasAdmin();
  renderIntroGuia();

  try {
    cartasDesastre = await carregarCartas(CONFIG.cartas.desastre);
    setupFiltrosDesastre();
    renderConsultaMestre();
  } catch {
    mostrarErroCartas('desastre',
      'Não foi possível carregar as cartas de desastre. Use um servidor estático (ex: python3 -m http.server).');
    renderConsultaMestre();
  }

  renderCartasAtivas();
}

function getCartaDesastrePorId(id) {
  return cartasDesastre.find((c) => c.id === id);
}
