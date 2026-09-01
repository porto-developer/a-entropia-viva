/**
 * Log de ações no painel admin.
 */
function renderLog() {
  const lista = document.getElementById('log-lista');
  const vazio = document.getElementById('log-vazio');
  if (!lista) return;

  const log = getLog();
  lista.innerHTML = '';

  if (log.length === 0) {
    if (vazio) vazio.hidden = false;
    return;
  }

  if (vazio) vazio.hidden = true;

  log.forEach((entry) => {
    const li = document.createElement('li');
    const hora = new Date(entry.timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    li.innerHTML = `<span>${entry.texto}</span><span class="log-hora">${hora}</span>`;
    lista.appendChild(li);
  });
}

function initLog() {
  renderLog();

  const btnLimpar = document.getElementById('btn-limpar-log');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', async () => {
      const ok = await mostrarConfirmacao('Limpar todo o log de ações?');
      if (!ok) return;
      clearLog();
      renderLog();
    });
  }
}
