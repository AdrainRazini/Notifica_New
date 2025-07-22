console.log("Olá Cliente");

window.addEventListener('DOMContentLoaded', () => {
    const urlAtual = window.location.pathname;
    const loading = document.getElementById('loading');

    if (loading) {
        // Mostra o loading se existir o elemento
        loading.style.display = 'flex';
    }

    fetch(urlAtual, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                window.location.href = "404.html";
            } else {
                // Página existe, esconde o loading se existir
                if (loading) {
                    loading.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error("Erro ao verificar a URL:", error);
            window.location.href = "404.html";
        });
});