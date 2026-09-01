/**
 * Sons ao atingir o máximo — com fallback via Web Audio API.
 */
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function tocarTomFallback(freq, duracao) {
  if (!getSomAtivo()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duracao);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duracao);
  } catch {
    /* silencioso se Web Audio indisponível */
  }
}

function tocarSomMaximo(medidorId) {
  if (!getSomAtivo()) return;

  const audioMap = {
    colapso: document.getElementById('audio-colapso'),
    cofre: document.getElementById('audio-cofre'),
  };

  const audio = audioMap[medidorId];
  if (audio) {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        const freq = medidorId === 'colapso' ? 220 : 440;
        tocarTomFallback(freq, 0.8);
      });
    }
  } else {
    const freq = medidorId === 'colapso' ? 220 : 440;
    tocarTomFallback(freq, 0.8);
  }
}

function atualizarBotaoSom() {
  const btn = document.getElementById('btn-som');
  if (!btn) return;
  const ativo = getSomAtivo();
  btn.textContent = ativo ? '🔊 Som' : '🔇 Som';
  btn.classList.toggle('btn-som-off', !ativo);
  btn.title = ativo ? 'Desligar sons' : 'Ligar sons';
}

function initSons() {
  atualizarBotaoSom();

  const btn = document.getElementById('btn-som');
  if (btn) {
    btn.addEventListener('click', () => {
      setSomAtivo(!getSomAtivo());
      atualizarBotaoSom();
    });
  }
}
