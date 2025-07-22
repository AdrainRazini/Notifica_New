const container = document.getElementById('noticias-container');
const campoBusca = document.getElementById('busca');
const paginacao = document.getElementById('paginacao');
const filtros = document.getElementById('filtros');

// Fontes RSS compatíveis com rss2json
const fontes = [
  { nome: "G1", rss: "https://g1.globo.com/rss/g1/" },
  { nome: "Globo Mundo", rss: "https://g1.globo.com/rss/g1/mundo/" },
  { nome: "Globo Brasil", rss: "https://g1.globo.com/rss/g1/brasil/" },
  { nome: "Folha", rss: "https://feeds.folha.uol.com.br/emcimadahora/rss091.xml" },
  { nome: "BBC", rss: "http://feeds.bbci.co.uk/portuguese/rss.xml" },
  { nome: "CNN Brasil", rss: "https://www.cnnbrasil.com.br/feed/" },
  { nome: "UOL", rss: "https://rss.uol.com.br/feed/noticias.xml" },
  { nome: "Exame", rss: "https://exame.com/feed/" }
];

let todasNoticias = [];
let noticiasFiltradas = [];
let paginaAtual = 1;
const noticiasPorPagina = 10;
let filtroFonteAtual = 'todas';

async function carregarNoticias() {
  todasNoticias = [];

  for (const fonte of fontes) {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(fonte.rss)}`;
    try {
      const res = await fetch(url);
      const json = await res.json();

      if (!json.items || !Array.isArray(json.items)) {
        console.warn(`Sem itens válidos: ${fonte.nome}`);
        continue;
      }

      const noticias = json.items.map(n => ({
        titulo: `[${fonte.nome}] ${n.title}`,
        descricao: n.description?.replace(/<[^>]*>?/gm, '').slice(0, 200) || 'Sem descrição.',
        imagem: n.thumbnail || 'https://via.placeholder.com/300x180?text=Sem+Imagem',
        link: n.link,
        fonte: fonte.nome,
        pubDate: n.pubDate
      }));

      todasNoticias.push(...noticias);
    } catch (err) {
      console.error(`Erro ao carregar ${fonte.nome}`, err);
    }
  }

  // Ordenar do mais recente para o mais antigo
  todasNoticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  criarBotoesDeFiltro();
  aplicarFiltros();
}

function aplicarFiltros() {
  const termo = campoBusca.value.toLowerCase();

  noticiasFiltradas = todasNoticias.filter(n => {
    const busca = n.titulo.toLowerCase().includes(termo) ||
                  n.descricao.toLowerCase().includes(termo);
    const filtroFonte = (filtroFonteAtual === 'todas') ||
                        (n.fonte === filtroFonteAtual);
    return busca && filtroFonte;
  });

  paginaAtual = 1;
  renderizarNoticias(noticiasFiltradas, paginaAtual);
}

function criarBotoesDeFiltro() {
  filtros.innerHTML = '';

  const btnTodas = document.createElement('button');
  btnTodas.textContent = 'Todas';
  btnTodas.className = filtroFonteAtual === 'todas' ? 'ativo' : '';
  btnTodas.addEventListener('click', () => {
    filtroFonteAtual = 'todas';
    aplicarFiltros();
  });
  filtros.appendChild(btnTodas);

  fontes.forEach(f => {
    const btn = document.createElement('button');
    btn.textContent = f.nome;
    btn.className = filtroFonteAtual === f.nome ? 'ativo' : '';
    btn.addEventListener('click', () => {
      filtroFonteAtual = f.nome;
      aplicarFiltros();
    });
    filtros.appendChild(btn);
  });
}

function renderizarNoticias(noticias, pagina = 1) {
  container.innerHTML = '';
  paginacao.innerHTML = '';

  if (noticias.length === 0) {
    container.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
    return;
  }

  const inicio = (pagina - 1) * noticiasPorPagina;
  const fim = inicio + noticiasPorPagina;
  const pageNews = noticias.slice(inicio, fim);

  pageNews.forEach(n => {
    const card = document.createElement('div');
    card.className = 'noticia';
    card.innerHTML = `
      <img src="${n.imagem}" />
      <div class="conteudo">
        <h2>${n.titulo}</h2>
        <p>${n.descricao}...</p>
        <small>${new Date(n.pubDate).toLocaleString()}</small>
        <a href="${n.link}" target="_blank">Ler mais</a>
      </div>
    `;
    container.appendChild(card);
  });

  const totalPag = Math.ceil(noticias.length / noticiasPorPagina);
  if (totalPag > 1) {
    for (let i = 1; i <= totalPag; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === paginaAtual ? 'ativo' : '';
      btn.addEventListener('click', () => {
        paginaAtual = i;
        renderizarNoticias(noticias, i);
      });
      paginacao.appendChild(btn);
    }
  }
}

// Busca em tempo real
campoBusca.addEventListener('input', aplicarFiltros);

// Inicialização
carregarNoticias();
