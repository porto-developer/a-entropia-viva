/**
 * Autenticação simples do mestre (client-side).
 */
function initLogin() {
  const form = document.getElementById('login-form');
  const erro = document.getElementById('login-erro');
  if (!form) return;

  if (isLogado()) {
    window.location.href = 'admin.html';
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const senha = document.getElementById('senha').value;
    if (senha === CONFIG.senhaMestre) {
      setLogado(true);
      window.location.href = 'admin.html';
    } else {
      erro.textContent = 'Senha incorreta. Tente novamente.';
      erro.hidden = false;
    }
  });
}

function protegerAdmin() {
  if (!isLogado()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function initLogout() {
  const btn = document.getElementById('btn-logout');
  if (!btn) return;
  btn.addEventListener('click', () => {
    setLogado(false);
    window.location.href = 'index.html';
  });
}
