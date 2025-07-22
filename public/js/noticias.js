const container = document.getElementById('noticias-container');
const API_KEY = '71304c47d70dadf9040bd81ed5911de8';

async function buscarNoticias(query = '') {
 const url = `https://api.mediastack.com/v1/news?access_key=${API_KEY}&countries=br&languages=pt&limit=10&keywords=${encodeURIComponent(query)}`;

  
  try {
    const res = await fetch(url);
    const data = await res.json();
    container.innerHTML = '';

    data.data.forEach(noticia => {
      const card = document.createElement('div');
      const descricao = noticia.description || '';
      const isLonga = descricao.length > 250; // ajustável

      card.className = 'noticia';
      if (isLonga) card.classList.add('longa');

      card.innerHTML = `
        <img src="${noticia.image || 'https://via.placeholder.com/300x180?text=Sem+Imagem'}" />
        <div class="conteudo">
          <h2>${noticia.title}</h2>
          <p>${descricao}</p>
          <a href="${noticia.url}" target="_blank">Ler mais</a>
        </div>
      `;
      
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Erro ao buscar notícias:', err);
    container.innerHTML = '<p>Erro ao carregar notícias.</p>';
  }
}

buscarNoticias();
document.getElementById('busca').addEventListener('input', e => {
  buscarNoticias(e.target.value);
});

window.gerenciar_url = () => window.location.href = 'admin.html';
window.users_url = () => window.location.href = 'users.html';
