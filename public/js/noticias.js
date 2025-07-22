const container = document.getElementById('noticias-container');
const campoBusca = document.getElementById('busca');
const paginacao = document.getElementById('paginacao');


// Lista de RSS de sites confiáveis
const fontes = [
  { nome: "G1", rss: "https://g1.globo.com/rss/g1/" },
  { nome: "Globo Mundo", rss: "https://g1.globo.com/rss/g1/mundo/" },
  { nome: "Globo Brasil", rss: "https://g1.globo.com/rss/g1/brasil/" },
  { nome: "Estadão", rss: "https://www.estadao.com.br/rss/ultimas.xml" },
  { nome: "Folha", rss: "https://feeds.folha.uol.com.br/emcimadahora/rss091.xml" },
  { nome: "BBC", rss: "http://feeds.bbci.co.uk/portuguese/rss.xml" },
  { nome: "CNN Brasil", rss: "https://www.cnnbrasil.com.br/feed/" },
  { nome: "R7", rss: "https://www.r7.com/rss/" },
  { nome: "UOL", rss: "https://rss.uol.com.br/feed/noticias.xml" },
  { nome: "Terra", rss: "https://www.terra.com.br/rss/0,,EI1,00.xml" }
];

let todasNoticias = [];
let paginaAtual = 1;
const noticiasPorPagina = 10;

async function carregarNoticias() {
  todasNoticias = [];

  for (const fonte of fontes) {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(fonte.rss)}`;
    
    try {
      const res = await fetch(url);
      const json = await res.json();

      const noticias = json.items.map(n => ({
        titulo: `[${fonte.nome}] ${n.title}`,
        descricao: n.description.replace(/<[^>]*>?/gm, '').slice(0, 200),
        imagem: n.thumbnail || 'https://via.placeholder.com/300x180?text=Sem+Imagem',
        link: n.link
      }));

      todasNoticias.push(...noticias);
    } catch (err) {
      console.error(`Erro ao carregar de ${fonte.nome}`, err);
    }
  }

  paginaAtual = 1;
  renderizarNoticias(todasNoticias, paginaAtual);
}

function renderizarNoticias(noticias, pagina = 1) {
  container.innerHTML = '';

  if (noticias.length === 0) {
    container.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
    paginacao.innerHTML = '';
    return;
  }

  const inicio = (pagina - 1) * noticiasPorPagina;
  const fim = inicio + noticiasPorPagina;
  const noticiasPaginadas = noticias.slice(inicio, fim);

  noticiasPaginadas.forEach(noticia => {
    const card = document.createElement('div');
    card.className = 'noticia';

    card.innerHTML = `
      <img src="${noticia.imagem}" />
      <div class="conteudo">
        <h2>${noticia.titulo}</h2>
        <p>${noticia.descricao}...</p>
        <a href="${noticia.link}" target="_blank">Ler mais</a>
      </div>
    `;

    container.appendChild(card);
  });

  renderizarPaginacao(noticias);
}

function renderizarPaginacao(noticias) {
  paginacao.innerHTML = '';

  const totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);
  if (totalPaginas <= 1) return;

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = (i === paginaAtual) ? 'ativo' : '';

    btn.addEventListener('click', () => {
      paginaAtual = i;
      renderizarNoticias(noticias, paginaAtual);
    });

    paginacao.appendChild(btn);
  }
}

// Filtro em tempo real
campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase();
  const filtradas = todasNoticias.filter(n =>
    n.titulo.toLowerCase().includes(termo) ||
    n.descricao.toLowerCase().includes(termo)
  );
  paginaAtual = 1;
  renderizarNoticias(filtradas, paginaAtual);
});

// Inicial
carregarNoticias();
