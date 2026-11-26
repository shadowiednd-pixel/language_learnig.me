const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUXxrFVI19I8tD-BYYvi8MwJ6W5lQRbGhR4kM70o6KoA6AQG0yaQ_2EazVqjkY8KUxAw/exec';

const IDIOMAS_CONFIG = {
  Chines: {
    nome: 'Chinês', bandeira: '🇨🇳', tema: 'chines', voz: 'zh-CN', rotacao: 'Mandarim',
    labelFrente: 'Caractere (Hanzi) *', phFrente: 'Ex.: 姐姐',
    labelExtra: 'Pinyin (com tons)', phExtra: 'Ex.: jiějie',
    ocultavel: true, toggleTexto: 'Mostrar Pinyin'
  },
  Sueco: {
    nome: 'Sueco', bandeira: '🇸🇪', tema: 'sueco', voz: 'sv-SE', rotacao: 'Svenska',
    labelFrente: 'Palavra ou Frase com [lacuna] *', phFrente: 'Ex.: Han [tvekade] innan han gick.',
    labelExtra: 'Plural / Conjugação / Tradução da frase', phExtra: 'Ex.: Ele hesitou antes de sair',
    ocultavel: false
  },
  Ingles: {
    nome: 'Inglês', bandeira: '🇺🇸', tema: 'ingles', voz: 'en-US', rotacao: 'English',
    labelFrente: 'Palavra / Frase em Inglês *', phFrente: 'Ex.: Good morning!',
    labelExtra: 'Dica de Pronúncia / Fonética', phExtra: 'Ex.: gud mór-nin',
    ocultavel: false
  },
  Coreano: {
    nome: 'Coreano', bandeira: '🇰🇷', tema: 'coreano', voz: 'ko-KR', rotacao: 'Hangul',
    labelFrente: 'Palavra em Hangul *', phFrente: 'Ex.: 감사합니다',
    labelExtra: 'Romanização / Formalidade', phExtra: 'Ex.: gamsahamnida (formal)',
    ocultavel: true, toggleTexto: 'Mostrar Romanização'
  },
  Guarani: {
    nome: 'Guarani', bandeira: '🌿', tema: 'guarani', voz: 'gn', rotacao: 'Avañe’ẽ',
    labelFrente: 'Palavra / Expressão em Guarani *', phFrente: 'Ex.: Mba’éichapa',
    labelExtra: 'Pronúncia nasal / Notas', phExtra: 'Ex.: mba-e-i-cha-pa',
    ocultavel: false
  },
  Italiano: {
    nome: 'Italiano', bandeira: '🇮🇹', tema: 'italiano', voz: 'it-IT', rotacao: 'Italiano',
    labelFrente: 'Palavra / Expressão *', phFrente: 'Ex.: il ragazzo',
    labelExtra: 'Plural ou Conjugação', phExtra: 'Ex.: i ragazzi',
    ocultavel: false
  },
  Japones: {
    nome: 'Japonês', bandeira: '🇯🇵', tema: 'japones', voz: 'ja-JP', rotacao: 'Nihongo',
    labelFrente: 'Kanji / Kana *', phFrente: 'Ex.: 食べる',
    labelExtra: 'Hiragana / Romaji', phExtra: 'Ex.: たべる (taberu)',
    ocultavel: true, toggleTexto: 'Mostrar Leitura'
  },
  Russo: {
    nome: 'Russo', bandeira: '🇷🇺', tema: 'russo', voz: 'ru-RU', rotacao: 'Русский',
    labelFrente: 'Palavra em Cirílico *', phFrente: 'Ex.: Спасибо',
    labelExtra: 'Transliteração e Sílaba Tônica', phExtra: 'Ex.: spasíbo',
    ocultavel: true, toggleTexto: 'Mostrar Transliteração'
  },
  Irlandes: {
    nome: 'Irlandês', bandeira: '🇮🇪', tema: 'irlandes', voz: 'ga-IE', rotacao: 'Gaeilge',
    labelFrente: 'Palavra em Irlandês *', phFrente: 'Ex.: Dia duit',
    labelExtra: 'Guia de Pronúncia', phExtra: 'Ex.: djia gwitch',
    ocultavel: false
  },
  Alemao: {
    nome: 'Alemão', bandeira: '🇩🇪', tema: 'alemao', voz: 'de-DE', rotacao: 'Deutsch',
    labelFrente: 'Substantivo (der / die / das) *', phFrente: 'Ex.: das Buch',
    labelExtra: 'Plural ou Perfekt', phExtra: 'Ex.: die Bücher',
    ocultavel: false
  },
  Creole: {
    nome: 'Creole', bandeira: '🇭🇹', tema: 'creole', voz: 'ht', rotacao: 'Kreyòl',
    labelFrente: 'Palavra / Expressão *', phFrente: 'Ex.: Bonjou, kijan ou ye?',
    labelExtra: 'Notas de Pronúncia', phExtra: 'Ex.: bon-ju, ki-jan u ié',
    ocultavel: false
  },
  Romeno: {
    nome: 'Romeno', bandeira: '🇷🇴', tema: 'romeno', voz: 'ro-RO', rotacao: 'Română',
    labelFrente: 'Palavra (com artigo definido) *', phFrente: 'Ex.: cartea',
    labelExtra: 'Plural / Gênero', phExtra: 'Ex.: cărți (fem.)',
    ocultavel: false
  }
};

const PROMPTS_CRIATIVOS = [
  'Escreva um diálogo tenso entre dois personagens que guardam um segredo.',
  'Descreva uma cena noturna chuvosa usando detalhes sensoriais (sons, luzes, cheiros).',
  'Escreva uma carta ou mensagem que um personagem hesita em enviar.',
  'Crie um diálogo curto pedindo ajuda ou informação em uma situação urgente.',
  'Descreva o reencontro de dois amigos depois de anos sem se verem.'
];

let senhaAtual = localStorage.getItem('senha_idiomas') || '';
let usuarioAtual = '';
let roleAtual = 'student';
let idiomasAtivos = [];
let idiomaAtual = 'Chines';

let hojeServidor = '';
let todosCards = [];
let todasNotas = [];
let todasEscritas = [];
let todasFanfics = [];
let todosQuizzes = [];
let listaAlunos = [];
let todoProgresso = [];
let filaRevisao = [];
let cardsFeitosSessao = [];
let historicoChat = [];
let modoTreinoLivre = false;
let bloqueioAutoCard = false;

let segundosRestantes = 25 * 60;
let intervaloTimer = null;

function escapeHTML(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function normalizarTexto(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!?;:'"()\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function contarPalavras(texto) {
  const limpo = String(texto || '').trim();
  if (!limpo) return 0;
  return limpo.split(/\s+/).length;
}

// 1. LOGIN
document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const senha = document.getElementById('inputSenha').value;
  const btn = document.getElementById('btnLogin');
  const erro = document.getElementById('erroLogin');

  btn.disabled = true;
  btn.textContent = 'Carregando...';
  erro.style.display = 'none';

  const ok = await sincronizar(senha);
  if (ok) {
    senhaAtual = senha;
    localStorage.setItem('senha_idiomas', senhaAtual);
    iniciarInterfaceLogada();
  } else {
    erro.textContent = 'Senha incorreta ou erro de conexão.';
    erro.style.display = 'block';
  }

  btn.disabled = false;
  btn.textContent = 'Entrar';
});

function iniciarInterfaceLogada() {
  document.getElementById('telaLogin').classList.add('oculto');
  document.getElementById('appEstudos').classList.remove('oculto');

  const chaveStorage = `idiomas_ativos_${usuarioAtual}`;
  const padrao = roleAtual === 'student' ? ['Ingles'] : ['Chines', 'Sueco', 'Ingles'];
  idiomasAtivos = JSON.parse(localStorage.getItem(chaveStorage) || JSON.stringify(padrao));
  idiomaAtual = idiomasAtivos[0] || padrao[0];

  const isTeacher = roleAtual === 'teacher';
  document.getElementById('badgeUsuario').textContent = isTeacher ? `🎓 ${usuarioAtual} (Prof)` : `📖 ${usuarioAtual}`;
  document.getElementById('boxEnviarParaAluno').classList.toggle('oculto', !isTeacher);
  document.getElementById('painelCriarQuiz').classList.toggle('oculto', !isTeacher);
  document.getElementById('navLabelQuiz').textContent = isTeacher ? 'Prof / Quiz' : 'Quizzes';

  if (isTeacher) {
    const selCard = document.getElementById('selectDestinatarioCard');
    const selQuiz = document.getElementById('selectAlunoQuiz');
    selCard.innerHTML = '<option value="PROPRIO">Meu próprio baralho</option>';
    selQuiz.innerHTML = '';

    listaAlunos.forEach(aluno => {
      selCard.add(new Option(`🎓 Enviar para ${aluno}`, aluno));
      selQuiz.add(new Option(`📖 ${aluno}`, aluno));
    });

    if (listaAlunos.length > 1) {
      selCard.add(new Option('🎓 Enviar para TODOS os alunos', 'TODOS'));
      selQuiz.add(new Option('👥 TODOS os alunos', 'TODOS'));
    }
  }

  popularSelectsIA();
  renderizarBarraIdiomas();
  aplicarIdioma(idiomaAtual);
}

document.getElementById('btnBloquear').addEventListener('click', () => {
  localStorage.removeItem('senha_idiomas');
  senhaAtual = '';
  cardsFeitosSessao = [];
  historicoChat = [];
  document.getElementById('appEstudos').classList.add('oculto');
  document.getElementById('telaLogin').classList.remove('oculto');
  document.getElementById('inputSenha').value = '';
});

// 2. SELETOR DOS 12 IDIOMAS
function renderizarBarraIdiomas() {
  const container = document.getElementById('seletorIdioma');
  container.innerHTML = '';

  idiomasAtivos.forEach(chave => {
    const cfg = IDIOMAS_CONFIG[chave];
    if (!cfg) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `lang-btn ${chave === idiomaAtual ? 'ativo' : ''}`;
    btn.textContent = `${cfg.bandeira} ${cfg.nome}`;
    btn.addEventListener('click', () => aplicarIdioma(chave));
    container.appendChild(btn);
  });
}

document.getElementById('btnGerenciarIdiomas').addEventListener('click', () => {
  const painel = document.getElementById('painelConfigIdiomas');
  painel.classList.toggle('oculto');
  if (!painel.classList.contains('oculto')) {
    const grid = document.getElementById('gridCheckIdiomas');
    grid.innerHTML = '';
    Object.keys(IDIOMAS_CONFIG).forEach(chave => {
      const cfg = IDIOMAS_CONFIG[chave];
      const label = document.createElement('label');
      label.className = 'check-idioma-item';
      label.innerHTML = `
        <input type="checkbox" value="${chave}" ${idiomasAtivos.includes(chave) ? 'checked' : ''}>
        <span>${cfg.bandeira} ${cfg.nome}</span>
      `;
      label.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!idiomasAtivos.includes(chave)) idiomasAtivos.push(chave);
        } else {
          if (idiomasAtivos.length <= 1) {
            e.target.checked = true;
            return;
          }
          idiomasAtivos = idiomasAtivos.filter(i => i !== chave);
        }
        localStorage.setItem(`idiomas_ativos_${usuarioAtual}`, JSON.stringify(idiomasAtivos));
        if (!idiomasAtivos.includes(idiomaAtual)) idiomaAtual = idiomasAtivos[0];
        renderizarBarraIdiomas();
        aplicarIdioma(idiomaAtual);
      });
      grid.appendChild(label);
    });
  }
});

document.getElementById('btnFecharConfig').addEventListener('click', () => {
  document.getElementById('painelConfigIdiomas').classList.add('oculto');
});

document.getElementById('btnTrocarRotacao').addEventListener('click', () => {
  const idx = idiomasAtivos.indexOf(idiomaAtual);
  const proximo = idiomasAtivos[(idx + 1) % idiomasAtivos.length];
  aplicarIdioma(proximo);
});

function aplicarIdioma(novoIdioma) {
  idiomaAtual = novoIdioma;
  modoTreinoLivre = false;
  const cfg = IDIOMAS_CONFIG[novoIdioma];

  document.documentElement.setAttribute('data-tema', cfg.tema);
  renderizarBarraIdiomas();

  document.getElementById('labelRotacao').textContent = `Rotação: ${cfg.rotacao}`;
  document.getElementById('tituloFormCard').textContent = `Novo Flashcard de ${cfg.nome}`;
  document.getElementById('tituloFormNota').textContent = `Nova Anotação de ${cfg.nome}`;
  document.getElementById('tituloChatTutor').textContent = `💬 Tutor Gemini (${cfg.nome})`;
  document.getElementById('tituloFormEscrita').textContent = `Escrita Criativa em ${cfg.nome}`;
  document.getElementById('tituloFormFanfic').textContent = `📖 Estúdio de Fanfics (${cfg.nome})`;
  document.getElementById('quizIdiomaBadge').textContent = `${cfg.bandeira} ${cfg.nome}`;
  document.getElementById('labelFrente').textContent = cfg.labelFrente;
  document.getElementById('cardFrenteInput').placeholder = cfg.phFrente;
  document.getElementById('labelExtra').textContent = cfg.labelExtra;
  document.getElementById('cardExtraInput').placeholder = cfg.phExtra;

  const selOrigem = document.getElementById('iaIdiomaOrigem');
  if (selOrigem) selOrigem.value = novoIdioma;

  const boxToggle = document.getElementById('boxToggleExtra');
  if (cfg.ocultavel) {
    boxToggle.classList.remove('oculto');
    document.getElementById('labelToggleExtra').textContent = cfg.toggleTexto;
  } else {
    boxToggle.classList.add('oculto');
  }

  atualizarBarraProgresso();
  atualizarFiltroCategorias();
  montarFilaRevisao();
  renderizarNotas();
  renderizarEscritas();
  renderizarFanfics();
  renderizarQuizzes();
}

// 3. NAVEGAÇÃO INFERIOR & SUB-ABAS
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('ativo'));
    document.querySelectorAll('.painel').forEach(p => p.classList.remove('ativo'));
    btn.classList.add('ativo');
    document.getElementById(btn.dataset.painel).classList.add('ativo');
  });
});

document.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    const alvo = btn.dataset.sub;
    document.getElementById('boxChatTutor').classList.toggle('oculto', alvo !== 'boxChatTutor');
    document.getElementById('boxLabIA').classList.toggle('oculto', alvo !== 'boxLabIA');
    document.getElementById('boxEscritaLivre').classList.toggle('oculto', alvo !== 'boxEscritaLivre');
  });
});

// 4. TIMER POMODORO
function atualizarDisplayTimer() {
  const m = String(Math.floor(segundosRestantes / 60)).padStart(2, '0');
  const s = String(segundosRestantes % 60).padStart(2, '0');
  document.getElementById('displayTimer').textContent = `${m}:${s}`;
}

document.getElementById('btnIniciarTimer').addEventListener('click', (e) => {
  if (intervaloTimer) {
    clearInterval(intervaloTimer);
    intervaloTimer = null;
    e.target.textContent = '▶ Continuar';
    return;
  }

  e.target.textContent = '⏸ Pausar';
  intervaloTimer = setInterval(async () => {
    segundosRestantes--;
    atualizarDisplayTimer();

    if (segundosRestantes <= 0) {
      clearInterval(intervaloTimer);
      intervaloTimer = null;
      e.target.textContent = '▶ Iniciar';
      segundosRestantes = 25 * 60;
      atualizarDisplayTimer();

      await enviarPost({ acao: 'registrar_tempo', senha: senhaAtual, idioma: idiomaAtual, minutos: 25 });
      await sincronizar(senhaAtual);
      alert(`Sessão de 25 min em ${IDIOMAS_CONFIG[idiomaAtual].nome} concluída!`);
    }
  }, 1000);
});

document.getElementById('btnResetTimer').addEventListener('click', () => {
  clearInterval(intervaloTimer);
  intervaloTimer = null;
  segundosRestantes = 25 * 60;
  document.getElementById('btnIniciarTimer').textContent = '▶ Iniciar';
  atualizarDisplayTimer();
});

// 5. ÁUDIO NATIVO
function falarTextoLivre(texto, velocidade = 1.0, idiomaOverride = null) {
  if (!('speechSynthesis' in window) || !texto) return;
  window.speechSynthesis.cancel();

  const chaveIdioma = idiomaOverride && IDIOMAS_CONFIG[idiomaOverride] ? idiomaOverride : idiomaAtual;
  const cfg = IDIOMAS_CONFIG[chaveIdioma];
  const textoLimpo = texto.replace(/[\[\]]/g, '');
  const fala = new SpeechSynthesisUtterance(textoLimpo);
  fala.lang = idiomaOverride === 'Portugues' ? 'pt-BR' : cfg.voz;
  fala.rate = velocidade;
  window.speechSynthesis.speak(fala);
}

document.getElementById('btnAudioNormal').addEventListener('click', () => {
  if (filaRevisao.length > 0) falarTextoLivre(filaRevisao[0].frente, 1.0);
});

document.getElementById('btnAudioLento').addEventListener('click', () => {
  if (filaRevisao.length > 0) falarTextoLivre(filaRevisao[0].frente, 0.65);
});

document.getElementById('btnOuvirEscrita').addEventListener('click', () => {
  const textoRascunho = document.getElementById('escTexto').value.trim();
  if (textoRascunho) falarTextoLivre(textoRascunho, 0.95);
});

document.getElementById('btnOuvirFic').addEventListener('click', () => {
  const textoFic = document.getElementById('ficConteudo').value.trim();
  if (textoFic) falarTextoLivre(textoFic, 0.95);
});

// 6. SINCRONIZAÇÃO & FLASHCARDS (COM SUPORTE A [LACUNAS])
async function sincronizar(senha) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ acao: 'carregar', senha })
    });
    const dados = await res.json();
    if (dados.status !== 'ok') return false;

    usuarioAtual = dados.usuario;
    roleAtual = dados.role;
    hojeServidor = dados.hoje;
    listaAlunos = dados.alunos || ['Amigo', 'Amigo1', 'Amigo2', 'Amigo3'];

    todosCards = (dados.cards || []).map((c, idx) => ({
      ...c,
      _uid: `${c.id}_${idx}_${c.frente}`
    }));

    todasNotas = dados.notas || [];
    todasEscritas = dados.escritas || [];
    todasFanfics = dados.fanfics || [];
    todosQuizzes = dados.quizzes || [];
    todoProgresso = dados.progresso || [];

    if (document.getElementById('appEstudos').classList.contains('oculto') === false) {
      atualizarBarraProgresso();
      atualizarFiltroCategorias();
      montarFilaRevisao();
      renderizarNotas();
      renderizarEscritas();
      renderizarFanfics();
      renderizarQuizzes();
    }
    return true;
  } catch (e) {
    return false;
  }
}

function atualizarBarraProgresso() {
  const regHoje = todoProgresso.find(p => p.data === hojeServidor && p.idioma === idiomaAtual);
  const cards = regHoje ? regHoje.cards : 0;
  const mins = regHoje ? regHoje.minutos : 0;
  document.getElementById('statusHoje').textContent = `Hoje: ${cards} cards • ${mins} min`;
}

function atualizarFiltroCategorias() {
  const select = document.getElementById('filtroCatCard');
  const cats = [...new Set(todosCards.filter(c => c.idioma === idiomaAtual).map(c => c.categoria))];
  select.innerHTML = '<option value="TODAS">Todas as categorias</option>';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

document.getElementById('filtroCatCard').addEventListener('change', montarFilaRevisao);
document.getElementById('checkOcultarExtra').addEventListener('change', exibirCardAtual);

document.getElementById('btnTreinoLivre').addEventListener('click', () => {
  modoTreinoLivre = true;
  cardsFeitosSessao = [];
  montarFilaRevisao();
});

function montarFilaRevisao() {
  const catFiltro = document.getElementById('filtroCatCard').value;

  const pendentes = todosCards.filter(c => {
    const mesmoIdioma = c.idioma === idiomaAtual;
    const mesmaCat = catFiltro === 'TODAS' || c.categoria === catFiltro;
    const vencidoHoje = modoTreinoLivre || c.proximaRevisao <= hojeServidor;
    return mesmoIdioma && mesmaCat && vencidoHoje;
  });

  const naoVistos = pendentes.filter(c => !cardsFeitosSessao.includes(c._uid));
  const erradosHoje = pendentes.filter(c => cardsFeitosSessao.includes(c._uid));

  filaRevisao = [...naoVistos, ...erradosHoje];
  document.getElementById('qtdPendentes').textContent = filaRevisao.length;
  exibirCardAtual();
}

function avancarProximoCardLocal(cardObj, acertou) {
  if (!cardsFeitosSessao.includes(cardObj._uid)) {
    cardsFeitosSessao.push(cardObj._uid);
  }
  filaRevisao = filaRevisao.filter(c => c._uid !== cardObj._uid);
  if (!acertou) {
    filaRevisao.push(cardObj);
  }
  document.getElementById('qtdPendentes').textContent = filaRevisao.length;
  exibirCardAtual();
}

function exibirCardAtual() {
  const boxCard = document.getElementById('areaFlashcard');
  const boxVazio = document.getElementById('semCardsHoje');
  bloqueioAutoCard = false;

  if (filaRevisao.length === 0) {
    boxCard.classList.add('oculto');
    boxVazio.classList.remove('oculto');
    return;
  }

  boxCard.classList.remove('oculto');
  boxVazio.classList.add('oculto');

  const card = filaRevisao[0];
  const cfg = IDIOMAS_CONFIG[idiomaAtual];

  document.getElementById('cardCategoria').textContent = card.categoria;
  document.getElementById('cardNivel').textContent = `Nível ${card.nivel}/5`;

  const frenteEl = document.getElementById('cardFrente');
  const matchLacuna = card.frente.match(/\[([^\]]+)\]/);
  if (matchLacuna) {
    const escondida = escapeHTML(card.frente).replace(/\[([^\]]+)\]/, '<span class="lacuna-destaque">[ ___ ]</span>');
    frenteEl.innerHTML = escondida;
  } else {
    frenteEl.textContent = card.frente;
  }

  const extraEl = document.getElementById('cardExtra');
  const mostrarLeitura = document.getElementById('checkOcultarExtra').checked;
  extraEl.textContent = card.extra;
  extraEl.classList.toggle('oculto', cfg.ocultavel && !mostrarLeitura);

  document.getElementById('cardTraducao').textContent = card.traducao;
  document.getElementById('cardExemplo').textContent = card.exemplo;

  const inputResp = document.getElementById('inputRespostaCard');
  inputResp.value = '';
  inputResp.disabled = false;
  inputResp.placeholder = matchLacuna ? 'Digite a palavra que falta na lacuna...' : 'Digite a tradução e aperte Enter...';
  document.getElementById('btnVerificarCard').disabled = false;
  document.getElementById('feedbackAutoCard').className = 'feedback-auto oculto';

  document.getElementById('cardVerso').classList.add('oculto');
  document.getElementById('btnVirarCard').classList.remove('oculto');
}

document.getElementById('formCheckResposta').addEventListener('submit', (e) => {
  e.preventDefault();
  if (bloqueioAutoCard || filaRevisao.length === 0) return;

  const card = filaRevisao[0];
  const digitado = normalizarTexto(document.getElementById('inputRespostaCard').value);
  if (!digitado) return;

  bloqueioAutoCard = true;
  document.getElementById('inputRespostaCard').disabled = true;
  document.getElementById('btnVerificarCard').disabled = true;

  const matchLacuna = card.frente.match(/\[([^\]]+)\]/);
  const respostaAlvo = matchLacuna ? `${matchLacuna[1]}/${card.traducao}` : card.traducao;

  const opcoesValidas = respostaAlvo.split(/[\/,]/).map(t => normalizarTexto(t)).filter(Boolean);
  const acertou = opcoesValidas.includes(digitado);

  if (matchLacuna) {
    document.getElementById('cardFrente').innerHTML = escapeHTML(card.frente).replace(
      /\[([^\]]+)\]/,
      `<span class="lacuna-destaque">${escapeHTML(matchLacuna[1])}</span>`
    );
  }

  const feedback = document.getElementById('feedbackAutoCard');
  document.getElementById('cardExtra').classList.remove('oculto');
  falarTextoLivre(card.frente, 1.0);

  if (acertou) {
    feedback.textContent = `✅ Correto! (${matchLacuna ? matchLacuna[1] + ' — ' : ''}${card.traducao})`;
    feedback.className = 'feedback-auto acerto';
    card.proximaRevisao = '9999-12-31';
  } else {
    feedback.textContent = `❌ Resposta: ${matchLacuna ? matchLacuna[1] + ' (' + card.traducao + ')' : card.traducao}`;
    feedback.className = 'feedback-auto erro';
  }

  enviarPost({
    acao: 'revisar_card',
    senha: senhaAtual,
    id: card.id,
    resultado: acertou ? 'bom' : 'errei'
  });

  setTimeout(() => {
    avancarProximoCardLocal(card, acertou);
  }, 1300);
});

document.getElementById('btnVirarCard').addEventListener('click', () => {
  document.getElementById('cardVerso').classList.remove('oculto');
  document.getElementById('btnVirarCard').classList.add('oculto');
  document.getElementById('cardExtra').classList.remove('oculto');
});

document.querySelectorAll('.btn-srs').forEach(btn => {
  btn.addEventListener('click', () => {
    if (filaRevisao.length === 0) return;
    const card = filaRevisao[0];
    const res = btn.dataset.res;
    const acertou = res !== 'errei';

    if (acertou) card.proximaRevisao = '9999-12-31';

    enviarPost({
      acao: 'revisar_card',
      senha: senhaAtual,
      id: card.id,
      resultado: res
    });

    avancarProximoCardLocal(card, acertou);
  });
});

// 7. CRIAR CARD & ANOTAÇÃO
document.getElementById('formNovoCard').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSalvarCard');
  const msg = document.getElementById('msgCard');

  btn.disabled = true;
  btn.textContent = 'Salvando...';
  msg.className = 'alerta';

  const res = await enviarPost({
    acao: 'criar_card',
    senha: senhaAtual,
    idioma: idiomaAtual,
    destinatario: document.getElementById('selectDestinatarioCard').value,
    categoria: document.getElementById('cardCatInput').value,
    frente: document.getElementById('cardFrenteInput').value,
    extra: document.getElementById('cardExtraInput').value,
    traducao: document.getElementById('cardTraducaoInput').value,
    exemplo: document.getElementById('cardExemploInput').value
  });

  if (res.status === 'sucesso') {
    msg.textContent = res.mensagem;
    msg.className = 'alerta sucesso';
    e.target.reset();
    await sincronizar(senhaAtual);
  } else {
    msg.textContent = res.mensagem || 'Erro ao salvar.';
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = 'Salvar Flashcard';
});

document.getElementById('formNovaNota').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSalvarNota');
  const msg = document.getElementById('msgNota');

  btn.disabled = true;
  btn.textContent = 'Salvando...';
  msg.className = 'alerta';

  const res = await enviarPost({
    acao: 'criar_nota',
    senha: senhaAtual,
    idioma: idiomaAtual,
    categoria: document.getElementById('notaCat').value,
    titulo: document.getElementById('notaTitulo').value,
    conteudo: document.getElementById('notaConteudo').value
  });

  if (res.status === 'sucesso') {
    msg.textContent = res.mensagem;
    msg.className = 'alerta sucesso';
    e.target.reset();
    await sincronizar(senhaAtual);
  } else {
    msg.textContent = res.mensagem || 'Erro ao salvar anotação.';
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = 'Salvar Anotação';
});

document.getElementById('buscaNotaInput').addEventListener('input', renderizarNotas);

function renderizarNotas() {
  const container = document.getElementById('listaNotas');
  const termo = document.getElementById('buscaNotaInput').value.toLowerCase().trim();

  const filtradas = todasNotas.filter(n => {
    const mesmoIdioma = n.idioma === idiomaAtual;
    const bateBusca = n.titulo.toLowerCase().includes(termo) ||
                      n.conteudo.toLowerCase().includes(termo) ||
                      n.categoria.toLowerCase().includes(termo);
    return mesmoIdioma && bateBusca;
  });

  if (filtradas.length === 0) {
    container.innerHTML = '<p class="texto-sec" style="text-align:center;">Nenhuma anotação encontrada neste idioma.</p>';
    return;
  }

  container.innerHTML = '';
  filtradas.forEach(n => {
    const div = document.createElement('article');
    div.className = 'nota-card';
    div.innerHTML = `
      <div class="nota-topo">
        <span class="tag-tema">${escapeHTML(n.categoria)}</span>
        <small class="texto-sec">${escapeHTML(n.data)}</small>
      </div>
      <h3>${escapeHTML(n.titulo)}</h3>
      <p>${escapeHTML(n.conteudo)}</p>
    `;
    container.appendChild(div);
  });
}

// 8. CHAT TUTOR GEMINI
document.getElementById('btnLimparChat').addEventListener('click', () => {
  historicoChat = [];
  document.getElementById('areaMensagensChat').innerHTML = `
    <div class="msg-bot">Conversa limpa! Mande suas palavras ou dúvidas em ${IDIOMAS_CONFIG[idiomaAtual].nome}.</div>
  `;
});

document.getElementById('formChatTutor').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('inputChatTutor');
  const btn = document.getElementById('btnEnviarChat');
  const erro = document.getElementById('msgErroChat');
  const textoUser = input.value.trim();
  if (!textoUser) return;

  erro.style.display = 'none';
  input.value = '';
  btn.disabled = true;
  btn.textContent = '...';

  historicoChat.push({ role: 'user', text: textoUser });
  adicionarBalaoChat('user', textoUser);

  const res = await enviarPost({
    acao: 'ia_chat',
    senha: senhaAtual,
    idioma: idiomaAtual,
    historico: historicoChat
  });

  if (res.status === 'sucesso') {
    historicoChat.push({ role: 'model', text: res.resposta });
    adicionarBalaoChat('bot', res.resposta);
  } else {
    erro.textContent = res.mensagem === 'SEM_CHAVE'
      ? 'Configure sua chave do Google AI Studio no Apps Script para usar o chat.'
      : (res.mensagem || 'Erro ao responder.');
    erro.style.display = 'block';
  }

  btn.disabled = false;
  btn.textContent = 'Enviar';
});

function adicionarBalaoChat(tipo, texto) {
  const box = document.getElementById('areaMensagensChat');
  const div = document.createElement('div');
  div.className = tipo === 'user' ? 'msg-user' : 'msg-bot';

  if (tipo === 'user') {
    div.textContent = texto;
  } else {
    div.innerHTML = `
      <div>${escapeHTML(texto)}</div>
      <div class="chat-acoes-bot">
        <button type="button" class="btn-audio-mini btn-ouvir-chat">🔊 Ouvir</button>
        <button type="button" class="btn-audio-mini btn-card-chat">➕ Levar p/ Novo Card</button>
      </div>
    `;
    div.querySelector('.btn-ouvir-chat').addEventListener('click', () => falarTextoLivre(texto, 0.95));
    div.querySelector('.btn-card-chat').addEventListener('click', () => {
      document.getElementById('cardExemploInput').value = texto.slice(0, 300);
      document.querySelector('.nav-item[data-painel="abaCriar"]').click();
    });
  }

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// 9. LABORATÓRIO DE TRADUÇÃO COM IA
function popularSelectsIA() {
  const selOrigem = document.getElementById('iaIdiomaOrigem');
  const selDestino = document.getElementById('iaIdiomaDestino');
  selOrigem.innerHTML = '';
  selDestino.innerHTML = '';

  const opcoes = [
    { val: 'Portugues', label: '🇧🇷 Português' },
    ...Object.keys(IDIOMAS_CONFIG).map(k => ({ val: k, label: `${IDIOMAS_CONFIG[k].bandeira} ${IDIOMAS_CONFIG[k].nome}` }))
  ];

  opcoes.forEach(op => {
    selOrigem.add(new Option(op.label, op.val));
    selDestino.add(new Option(op.label, op.val));
  });

  selOrigem.value = idiomaAtual;
  selDestino.value = 'Portugues';
}

document.getElementById('btnGerarTextoIA').addEventListener('click', async () => {
  const btn = document.getElementById('btnGerarTextoIA');
  const msg = document.getElementById('msgIA');
  const origem = document.getElementById('iaIdiomaOrigem').value;
  const destino = document.getElementById('iaIdiomaDestino').value;
  const nivel = document.getElementById('iaNivel').value;
  const genero = document.getElementById('iaGenero').value;

  btn.disabled = true;
  btn.textContent = '✨ Gerando história...';
  msg.className = 'alerta';
  document.getElementById('boxFeedbackIA').classList.add('oculto');

  const res = await enviarPost({
    acao: 'ia_gerar_texto',
    senha: senhaAtual,
    origem,
    destino,
    nivel,
    genero
  });

  if (res.status === 'sucesso') {
    document.getElementById('textoGeradoIA').textContent = res.texto;
    document.getElementById('inputTraducaoIA').value = '';
    document.getElementById('areaExercicioIA').classList.remove('oculto');
  } else {
    msg.textContent = res.mensagem === 'SEM_CHAVE'
      ? 'Cole sua chave gratuita do Google AI Studio na constante GEMINI_API_KEY do Apps Script.'
      : (res.mensagem || 'Erro ao gerar texto.');
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = '✨ Gerar Trecho de História';
});

document.getElementById('btnOuvirTextoIA').addEventListener('click', () => {
  const texto = document.getElementById('textoGeradoIA').textContent;
  const origem = document.getElementById('iaIdiomaOrigem').value;
  falarTextoLivre(texto, 0.95, origem);
});

document.getElementById('btnCorrigirIA').addEventListener('click', async () => {
  const btn = document.getElementById('btnCorrigirIA');
  const original = document.getElementById('textoGeradoIA').textContent;
  const traducao = document.getElementById('inputTraducaoIA').value.trim();
  const origem = document.getElementById('iaIdiomaOrigem').value;
  const destino = document.getElementById('iaIdiomaDestino').value;

  if (!traducao) return;

  btn.disabled = true;
  btn.textContent = '🔍 Avaliando...';

  const res = await enviarPost({
    acao: 'ia_corrigir_traducao',
    senha: senhaAtual,
    origem,
    destino,
    original,
    traducao
  });

  if (res.status === 'sucesso') {
    document.getElementById('textoFeedbackIA').textContent = res.feedback;
    document.getElementById('boxFeedbackIA').classList.remove('oculto');
  } else {
    const msg = document.getElementById('msgIA');
    msg.textContent = res.mensagem || 'Erro ao corrigir tradução.';
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = '🔍 Corrigir Tradução';
});

document.getElementById('btnSalvarTreinoIA').addEventListener('click', async () => {
  const btn = document.getElementById('btnSalvarTreinoIA');
  const original = document.getElementById('textoGeradoIA').textContent;
  const traducao = document.getElementById('inputTraducaoIA').value.trim();
  const feedback = document.getElementById('textoFeedbackIA').textContent;
  const genero = document.getElementById('iaGenero').value || 'Prática IA';

  btn.disabled = true;
  btn.textContent = 'Salvando...';

  const res = await enviarPost({
    acao: 'criar_escrita',
    senha: senhaAtual,
    idioma: idiomaAtual,
    titulo: `Tradução IA — ${genero}`,
    texto: original,
    traducao: `Minha tradução:\n${traducao}${feedback ? '\n\nCorreção:\n' + feedback : ''}`
  });

  const msg = document.getElementById('msgIA');
  if (res.status === 'sucesso') {
    msg.textContent = 'Treino salvo na sua lista de Escrita!';
    msg.className = 'alerta sucesso';
    await sincronizar(senhaAtual);
  }

  btn.disabled = false;
  btn.textContent = '💾 Salvar no Caderno';
});

// 10. ESCRITA CRIATIVA COM 3 PALAVRAS DO BARALHO
document.getElementById('escTexto').addEventListener('input', (e) => {
  document.getElementById('contadorPalavrasEscrita').textContent = `${contarPalavras(e.target.value)} palavras`;
});

document.getElementById('btnSortearPrompt').addEventListener('click', () => {
  const box = document.getElementById('boxPromptSorteado');
  const tema = PROMPTS_CRIATIVOS[Math.floor(Math.random() * PROMPTS_CRIATIVOS.length)];

  const cardsDoIdioma = todosCards.filter(c => c.idioma === idiomaAtual);
  const embaralhados = [...cardsDoIdioma].sort(() => 0.5 - Math.random()).slice(0, 3);
  const palavrasAlvo = embaralhados.map(c => c.frente.replace(/[\[\]]/g, ''));

  box.innerHTML = `
    <strong>💡 Cena:</strong> ${escapeHTML(tema)}
    ${palavrasAlvo.length > 0 ? `<br><strong>🎯 Tente encaixar do seu baralho:</strong> ${escapeHTML(palavrasAlvo.join(' • '))}` : ''}
  `;
  box.classList.remove('oculto');
});

document.getElementById('formNovaEscrita').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSalvarEscrita');
  const msg = document.getElementById('msgEscrita');

  btn.disabled = true;
  btn.textContent = 'Salvando...';
  msg.className = 'alerta';

  const res = await enviarPost({
    acao: 'criar_escrita',
    senha: senhaAtual,
    idioma: idiomaAtual,
    titulo: document.getElementById('escTitulo').value,
    texto: document.getElementById('escTexto').value,
    traducao: document.getElementById('escTraducao').value
  });

  if (res.status === 'sucesso') {
    msg.textContent = res.mensagem;
    msg.className = 'alerta sucesso';
    e.target.reset();
    document.getElementById('contadorPalavrasEscrita').textContent = '0 palavras';
    document.getElementById('boxPromptSorteado').classList.add('oculto');
    await sincronizar(senhaAtual);
  } else {
    msg.textContent = res.mensagem || 'Erro ao salvar texto.';
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = 'Salvar Texto Criativo';
});

function renderizarEscritas() {
  const container = document.getElementById('listaEscritas');
  const doIdioma = todasEscritas.filter(item => item.idioma === idiomaAtual);

  if (doIdioma.length === 0) {
    container.innerHTML = '<p class="texto-sec" style="text-align:center;">Nenhum texto criativo escrito neste idioma ainda.</p>';
    return;
  }

  container.innerHTML = '';
  doIdioma.forEach(item => {
    const div = document.createElement('article');
    div.className = 'nota-card';
    div.innerHTML = `
      <div class="nota-topo">
        <small class="texto-sec">${escapeHTML(item.data)}</small>
        <button type="button" class="btn-audio-mini">🔊 Ouvir texto</button>
      </div>
      <h3>${escapeHTML(item.titulo)}</h3>
      <p>${escapeHTML(item.texto)}</p>
      ${item.traducao ? `<p class="escrita-traducao">${escapeHTML(item.traducao)}</p>` : ''}
    `;
    div.querySelector('button').addEventListener('click', () => falarTextoLivre(item.texto, 0.95));
    container.appendChild(div);
  });
}

// 11. ESTÚDIO DE FANFICS & HISTÓRIAS
document.getElementById('ficConteudo').addEventListener('input', (e) => {
  document.getElementById('contadorPalavrasFic').textContent = `${contarPalavras(e.target.value)} palavras`;
});

document.getElementById('btnNovaFicLimpar').addEventListener('click', () => {
  document.getElementById('formFanfic').reset();
  document.getElementById('ficIdEditando').value = '';
  document.getElementById('contadorPalavrasFic').textContent = '0 palavras';
  document.getElementById('boxFeedbackFicIA').classList.add('oculto');
  document.getElementById('msgFic').className = 'alerta';
});

document.getElementById('formFanfic').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSalvarFic');
  const msg = document.getElementById('msgFic');

  btn.disabled = true;
  btn.textContent = 'Salvando...';
  msg.className = 'alerta';

  const idAtual = document.getElementById('ficIdEditando').value;

  const res = await enviarPost({
    acao: 'salvar_fanfic',
    senha: senhaAtual,
    id: idAtual ? Number(idAtual) : null,
    idioma: idiomaAtual,
    fandom: document.getElementById('ficFandom').value,
    titulo: document.getElementById('ficTitulo').value,
    conteudo: document.getElementById('ficConteudo').value,
    notas: document.getElementById('ficNotas').value
  });

  if (res.status === 'sucesso') {
    document.getElementById('ficIdEditando').value = res.id;
    msg.textContent = res.mensagem;
    msg.className = 'alerta sucesso';
    await sincronizar(senhaAtual);
  } else {
    msg.textContent = res.mensagem || 'Erro ao salvar fanfic.';
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = '💾 Salvar Capítulo';
});

document.getElementById('btnRevisarFicIA').addEventListener('click', async () => {
  const btn = document.getElementById('btnRevisarFicIA');
  const texto = document.getElementById('ficConteudo').value.trim();
  if (!texto) return;

  btn.disabled = true;
  btn.textContent = '✨ Revisando...';

  const res = await enviarPost({
    acao: 'ia_revisar_fanfic',
    senha: senhaAtual,
    idioma: idiomaAtual,
    texto
  });

  if (res.status === 'sucesso') {
    document.getElementById('textoFeedbackFicIA').textContent = res.feedback;
    document.getElementById('boxFeedbackFicIA').classList.remove('oculto');
  } else {
    const msg = document.getElementById('msgFic');
    msg.textContent = res.mensagem === 'SEM_CHAVE'
      ? 'Configure sua chave do Google AI Studio no Apps Script para usar a revisão literária.'
      : (res.mensagem || 'Erro na revisão.');
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = '✨ Revisão Literária (IA)';
});

function renderizarFanfics() {
  const container = document.getElementById('listaFanfics');
  const ficsDoIdioma = todasFanfics.filter(f => f.idioma === idiomaAtual);

  if (ficsDoIdioma.length === 0) {
    container.innerHTML = '<p class="texto-sec" style="text-align:center;">Nenhum capítulo escrito neste idioma ainda. Comece o primeiro acima!</p>';
    return;
  }

  container.innerHTML = '';
  ficsDoIdioma.forEach(f => {
    const div = document.createElement('article');
    div.className = 'nota-card';
    div.innerHTML = `
      <div class="nota-topo">
        <span class="tag-tema">${escapeHTML(f.fandom)} • ${contarPalavras(f.conteudo)} palavras</span>
        <div style="display:flex; gap:0.4rem;">
          <button type="button" class="btn-audio-mini btn-ouvir-fic-item">🔊 Ouvir</button>
          <button type="button" class="btn-audio-mini btn-editar-fic-item">✏️ Continuar editando</button>
        </div>
      </div>
      <h3>${escapeHTML(f.titulo)}</h3>
      <p>${escapeHTML(f.conteudo)}</p>
      ${f.notas ? `<p class="escrita-traducao">${escapeHTML(f.notas)}</p>` : ''}
    `;

    div.querySelector('.btn-ouvir-fic-item').addEventListener('click', () => falarTextoLivre(f.conteudo, 0.95));
    div.querySelector('.btn-editar-fic-item').addEventListener('click', () => {
      document.getElementById('ficIdEditando').value = f.id;
      document.getElementById('ficFandom').value = f.fandom;
      document.getElementById('ficTitulo').value = f.titulo;
      document.getElementById('ficConteudo').value = f.conteudo;
      document.getElementById('ficNotas').value = f.notas;
      document.getElementById('contadorPalavrasFic').textContent = `${contarPalavras(f.conteudo)} palavras`;
      document.getElementById('formFanfic').scrollIntoView({ behavior: 'smooth' });
    });

    container.appendChild(div);
  });
}

// 12. QUIZZES & MODO PROFESSOR
document.getElementById('formNovoQuiz').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnEnviarQuiz');
  const msg = document.getElementById('msgQuiz');

  btn.disabled = true;
  btn.textContent = 'Enviando...';
  msg.className = 'alerta';

  const res = await enviarPost({
    acao: 'criar_quiz',
    senha: senhaAtual,
    idioma: idiomaAtual,
    alunoAlvo: document.getElementById('selectAlunoQuiz').value,
    titulo: document.getElementById('quizTitulo').value,
    perguntas: document.getElementById('quizPerguntas').value
  });

  if (res.status === 'sucesso') {
    msg.textContent = res.mensagem;
    msg.className = 'alerta sucesso';
    e.target.reset();
    await sincronizar(senhaAtual);
  } else {
    msg.textContent = res.mensagem || 'Erro ao enviar quiz.';
    msg.className = 'alerta erro';
  }

  btn.disabled = false;
  btn.textContent = 'Enviar Quiz';
});

function renderizarQuizzes() {
  const container = document.getElementById('listaQuizzes');
  const isTeacher = roleAtual === 'teacher';
  const lista = todosQuizzes;

  if (lista.length === 0) {
    container.innerHTML = '<p class="texto-sec" style="text-align:center;">Nenhum quiz disponível aqui ainda.</p>';
    return;
  }

  container.innerHTML = '';
  lista.forEach(q => {
    const cfg = IDIOMAS_CONFIG[q.idioma] || { bandeira: '📝', nome: q.idioma };
    const div = document.createElement('article');
    div.className = 'nota-card';

    let areaInteracao = '';

    if (!isTeacher) {
      if (q.status === 'Pendente') {
        areaInteracao = `
          <form class="form-resp-quiz" data-id="${q.id}" style="margin-top:0.85rem;">
            <label>Suas Respostas:</label>
            <textarea rows="4" required placeholder="Escreva suas respostas aqui..."></textarea>
            <button type="submit" class="btn-tema full">Enviar Respostas</button>
          </form>
        `;
      } else {
        areaInteracao = `
          <div class="quiz-bloco">
            <strong>Suas Respostas:</strong>
            <p>${escapeHTML(q.respostas)}</p>
          </div>
          ${q.correcao ? `
            <div class="quiz-bloco" style="border-color: var(--cor-primaria);">
              <strong>🎓 Correção & Comentários:</strong>
              <p>${escapeHTML(q.correcao)}</p>
            </div>
          ` : '<p class="texto-sec" style="margin-top:0.65rem;">⏳ Aguardando correção...</p>'}
        `;
      }
    } else {
      areaInteracao = `
        <div class="quiz-bloco">
          <strong>Respostas do Aluno (${escapeHTML(q.aluno)}):</strong>
          <p>${q.respostas ? escapeHTML(q.respostas) : 'Ainda não respondido pelo aluno.'}</p>
        </div>
        <form class="form-corr-quiz" data-id="${q.id}" style="margin-top:0.85rem;">
          <label>Sua Correção / Feedback / Nota:</label>
          <textarea rows="3" required placeholder="Escreva a correção, dicas de gramática ou nota...">${escapeHTML(q.correcao)}</textarea>
          <button type="submit" class="btn-tema full">Salvar Correção</button>
        </form>
      `;
    }

    div.innerHTML = `
      <div class="nota-topo">
        <span class="tag-tema">${cfg.bandeira} ${cfg.nome} • ${escapeHTML(q.data)}</span>
        <span class="status-pill ${escapeHTML(q.status)}">${escapeHTML(q.status)}</span>
      </div>
      <h3>${escapeHTML(q.titulo)} ${isTeacher ? `<small class="texto-sec">(${escapeHTML(q.aluno)})</small>` : ''}</h3>
      <div class="quiz-bloco">
        <strong>Perguntas:</strong>
        <p>${escapeHTML(q.perguntas)}</p>
      </div>
      ${areaInteracao}
    `;

    const formResp = div.querySelector('.form-resp-quiz');
    if (formResp) {
      formResp.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = formResp.querySelector('button');
        const textoResp = formResp.querySelector('textarea').value;
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        await enviarPost({ acao: 'responder_quiz', senha: senhaAtual, id: q.id, respostas: textoResp });
        await sincronizar(senhaAtual);
      });
    }

    const formCorr = div.querySelector('.form-corr-quiz');
    if (formCorr) {
      formCorr.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = formCorr.querySelector('button');
        const textoCorr = formCorr.querySelector('textarea').value;
        btn.disabled = true;
        btn.textContent = 'Salvando...';
        await enviarPost({ acao: 'corrigir_quiz', senha: senhaAtual, id: q.id, correcao: textoCorr });
        await sincronizar(senhaAtual);
      });
    }

    container.appendChild(div);
  });
}

async function enviarPost(payload) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    return { status: 'erro', mensagem: 'Falha de conexão.' };
  }
}

if (senhaAtual) {
  sincronizar(senhaAtual).then(ok => {
    if (ok) {
      iniciarInterfaceLogada();
    } else {
      localStorage.removeItem('senha_idiomas');
    }
  });
}