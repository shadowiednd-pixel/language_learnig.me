const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyDq4Z67uR2DXWeZxYaZSuB6tg17rNbgsypAZN2UnlminNJ1bVjzrjw9Ey-b0EG0cBUTw/exec';

const IDIOMAS_CONFIG = {
  Chines: {
    nome: 'Chinês', bandeira: '🇨🇳', tema: 'chines', voz: 'zh-CN', rotacao: 'Mandarim',
    labelFrente: 'Caractere (Hanzi) *', phFrente: 'Ex.: 姐姐',
    labelExtra: 'Pinyin (com tons)', phExtra: 'Ex.: jiějie',
    ocultavel: true, toggleTexto: 'Mostrar Pinyin'
  },
  Sueco: {
    nome: 'Sueco', bandeira: '🇸🇪', tema: 'sueco', voz: 'sv-SE', rotacao: 'Svenska',
    labelFrente: 'Palavra (com en / ett) *', phFrente: 'Ex.: ett äpple',
    labelExtra: 'Plural ou Conjugação', phExtra: 'Ex.: äpplen',
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
  'Escreva um diálogo curto entre duas pessoas se conhecendo em uma cafeteria.',
  'Descreva como foi o seu dia hoje usando pelo menos 4 palavras que você aprendeu esta semana.',
  'Crie um pequeno monólogo de um personagem olhando pela janela em um dia de chuva.',
  'Imagine que você entrou em uma loja mágica ou livraria antiga: o que você vê e pergunta ao vendedor?',
  'Escreva uma carta ou mensagem curta para o seu "eu" do futuro contando o que você está estudando agora.',
  'Descreva sua comida ou bebida favorita e explique por que você gosta dela.',
  'Crie uma cena rápida de viagem: você acabou de chegar a uma estação de trem e precisa pedir informação.',
  'Invente um micro-conto de 5 frases sobre um gato que observa a cidade à noite.'
];

let senhaAtual = sessionStorage.getItem('senha_idiomas') || '';
let idiomasAtivos = JSON.parse(localStorage.getItem('idiomas_ativos_hub') || '["Chines","Sueco"]');
let idiomaAtual = idiomasAtivos[0] || 'Chines';

let hojeServidor = '';
let todosCards = [];
let todasNotas = [];
let todasEscritas = [];
let todoProgresso = [];
let filaRevisao = [];
let indiceCardAtual = 0;
let modoTreinoLivre = false;

let segundosRestantes = 25 * 60;
let intervaloTimer = null;

function escapeHTML(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
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
    sessionStorage.setItem('senha_idiomas', senhaAtual);
    document.getElementById('telaLogin').classList.add('oculto');
    document.getElementById('appEstudos').classList.remove('oculto');
    renderizarBarraIdiomas();
    aplicarIdioma(idiomaAtual);
  } else {
    erro.textContent = 'Senha incorreta ou erro de conexão.';
    erro.style.display = 'block';
  }

  btn.disabled = false;
  btn.textContent = 'Entrar';
});

document.getElementById('btnBloquear').addEventListener('click', () => {
  sessionStorage.removeItem('senha_idiomas');
  senhaAtual = '';
  document.getElementById('appEstudos').classList.add('oculto');
  document.getElementById('telaLogin').classList.remove('oculto');
  document.getElementById('inputSenha').value = '';
});

// 2. GERENCIAR OS 11 IDIOMAS NA BARRA
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
        localStorage.setItem('idiomas_ativos_hub', JSON.stringify(idiomasAtivos));
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
  document.getElementById('tituloFormEscrita').textContent = `Escrita Criativa em ${cfg.nome}`;
  document.getElementById('labelFrente').textContent = cfg.labelFrente;
  document.getElementById('cardFrenteInput').placeholder = cfg.phFrente;
  document.getElementById('labelExtra').textContent = cfg.labelExtra;
  document.getElementById('cardExtraInput').placeholder = cfg.phExtra;

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
}

// 3. NAVEGAÇÃO INFERIOR
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('ativo'));
    document.querySelectorAll('.painel').forEach(p => p.classList.remove('ativo'));
    btn.classList.add('ativo');
    document.getElementById(btn.dataset.painel).classList.add('ativo');
  });
});

// 4. TIMER POMODORO DE ROTAÇÃO
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

// 5. ÁUDIO NATIVO (FLASHCARDS E ESCRITA CRIATIVA)
function falarTextoLivre(texto, velocidade = 1.0) {
  if (!('speechSynthesis' in window) || !texto) return;
  window.speechSynthesis.cancel();

  const cfg = IDIOMAS_CONFIG[idiomaAtual];
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = cfg.voz;
  fala.rate = velocidade;
  window.speechSynthesis.speak(fala);
}

document.getElementById('btnAudioNormal').addEventListener('click', () => {
  if (filaRevisao.length > 0) falarTextoLivre(filaRevisao[indiceCardAtual].frente, 1.0);
});

document.getElementById('btnAudioLento').addEventListener('click', () => {
  if (filaRevisao.length > 0) falarTextoLivre(filaRevisao[indiceCardAtual].frente, 0.68);
});

document.getElementById('btnOuvirEscrita').addEventListener('click', () => {
  const textoRascunho = document.getElementById('escTexto').value.trim();
  if (textoRascunho) falarTextoLivre(textoRascunho, 0.95);
});

// 6. SINCRONIZAÇÃO E FLASHCARDS
async function sincronizar(senha) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ acao: 'carregar', senha })
    });
    const dados = await res.json();
    if (dados.status !== 'ok') return false;

    hojeServidor = dados.hoje;
    todosCards = dados.cards;
    todasNotas = dados.notas;
    todasEscritas = dados.escritas || [];
    todoProgresso = dados.progresso;

    atualizarBarraProgresso();
    atualizarFiltroCategorias();
    montarFilaRevisao();
    renderizarNotas();
    renderizarEscritas();
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
  montarFilaRevisao();
});

function montarFilaRevisao() {
  const catFiltro = document.getElementById('filtroCatCard').value;
  filaRevisao = todosCards.filter(c => {
    const mesmoIdioma = c.idioma === idiomaAtual;
    const mesmaCat = catFiltro === 'TODAS' || c.categoria === catFiltro;
    const vencidoHoje = modoTreinoLivre || c.proximaRevisao <= hojeServidor;
    return mesmoIdioma && mesmaCat && vencidoHoje;
  });

  indiceCardAtual = 0;
  document.getElementById('qtdPendentes').textContent = filaRevisao.length;
  exibirCardAtual();
}

function exibirCardAtual() {
  const boxCard = document.getElementById('areaFlashcard');
  const boxVazio = document.getElementById('semCardsHoje');

  if (filaRevisao.length === 0) {
    boxCard.classList.add('oculto');
    boxVazio.classList.remove('oculto');
    return;
  }

  boxCard.classList.remove('oculto');
  boxVazio.classList.add('oculto');

  const card = filaRevisao[indiceCardAtual];
  const cfg = IDIOMAS_CONFIG[idiomaAtual];

  document.getElementById('cardCategoria').textContent = card.categoria;
  document.getElementById('cardNivel').textContent = `Nível ${card.nivel}/5`;
  document.getElementById('cardFrente').textContent = card.frente;

  const extraEl = document.getElementById('cardExtra');
  const mostrarLeitura = document.getElementById('checkOcultarExtra').checked;
  extraEl.textContent = card.extra;
  extraEl.classList.toggle('oculto', cfg.ocultavel && !mostrarLeitura);

  document.getElementById('cardTraducao').textContent = card.traducao;
  document.getElementById('cardExemplo').textContent = card.exemplo;

  document.getElementById('cardVerso').classList.add('oculto');
  document.getElementById('btnVirarCard').classList.remove('oculto');
}

document.getElementById('btnVirarCard').addEventListener('click', () => {
  document.getElementById('cardVerso').classList.remove('oculto');
  document.getElementById('btnVirarCard').classList.add('oculto');
  document.getElementById('cardExtra').classList.remove('oculto');
});

document.querySelectorAll('.btn-srs').forEach(btn => {
  btn.addEventListener('click', async () => {
    const card = filaRevisao[indiceCardAtual];
    await enviarPost({
      acao: 'revisar_card',
      senha: senhaAtual,
      id: card.id,
      resultado: btn.dataset.res
    });
    await sincronizar(senhaAtual);
  });
});

// 7. CRIAR CARD E ANOTAÇÃO
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

// 8. ESCRITA CRIATIVA
document.getElementById('btnSortearPrompt').addEventListener('click', () => {
  const box = document.getElementById('boxPromptSorteado');
  const sorteado = PROMPTS_CRIATIVOS[Math.floor(Math.random() * PROMPTS_CRIATIVOS.length)];
  box.textContent = `💡 Desafio: ${sorteado}`;
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
      document.getElementById('telaLogin').classList.add('oculto');
      document.getElementById('appEstudos').classList.remove('oculto');
      renderizarBarraIdiomas();
      aplicarIdioma(idiomaAtual);
    } else {
      sessionStorage.removeItem('senha_idiomas');
    }
  });
}