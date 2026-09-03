/**
 * Exportar e importar estado da sessão.
 */
function initExportImport() {
  const btnExportar = document.getElementById('btn-exportar');
  const inputImportar = document.getElementById('input-importar');
  const feedback = document.getElementById('importar-feedback');

  if (btnExportar) {
    btnExportar.addEventListener('click', () => {
      const data = exportarEstado();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dataStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `entropia-viva-backup-${dataStr}.json`;
      a.click();
      URL.revokeObjectURL(url);

      if (feedback) {
        feedback.textContent = 'Estado exportado com sucesso.';
        feedback.className = 'feedback';
        feedback.hidden = false;
        setTimeout(() => { feedback.hidden = true; }, 3000);
      }
    });
  }

  if (inputImportar) {
    inputImportar.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          importarEstado(data);

          if (typeof renderMedidores === 'function') renderMedidores('admin');
          if (typeof renderLog === 'function') renderLog();
          if (typeof atualizarBotaoSom === 'function') atualizarBotaoSom();
          if (typeof refreshGridsDesastre === 'function') refreshGridsDesastre();

          if (feedback) {
            feedback.textContent = 'Estado importado com sucesso.';
            feedback.className = 'feedback';
            feedback.hidden = false;
          }
        } catch (err) {
          if (feedback) {
            feedback.textContent = `Erro ao importar: ${err.message}`;
            feedback.className = 'feedback erro';
            feedback.hidden = false;
          }
        }
        inputImportar.value = '';
      };
      reader.readAsText(file);
    });
  }
}
