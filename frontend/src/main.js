import './style.css';

// 1. SELEÇÃO DOS ELEMENTOS DO DOM
const searchForm = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword-input');
const resultsContainer = document.querySelector('#results-container');
const loadingIndicator = document.querySelector('#loading');
const errorMessageDiv = document.querySelector('#error-message');

// 2. FUNÇÃO PRINCIPAL QUE LIDERA COM O ENVIO DO FORMULÁRIO
const handleSubmit = async (event) => {
  // Previne o recarregamento padrão da página ao enviar um formulário
  event.preventDefault(); 
  
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    renderError('Por favor, digite um termo para a busca.');
    return;
  }

  // Prepara a UI para uma nova busca
  showLoading(true);
  clearResultsAndErrors();

  try {
    // 3. FAZ A CHAMADA À API DO BACKEND
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    // Verifica se a resposta da rede foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json();
      // Lança um erro para ser pego pelo bloco catch
      throw new Error(errorData.error || 'Ocorreu um erro no servidor.');
    }

    const products = await response.json();

    // 4. RENDERIZA OS RESULTADOS
    if (products.length === 0) {
      renderError('Nenhum produto foi encontrado. Tente um termo diferente.');
    } else {
      renderProducts(products);
    }

  } catch (error) {
    // Captura erros de rede ou os erros que lançamos manualmente
    console.error('Erro ao buscar dados:', error);
    renderError(error.message);
  } finally {
    // Garante que o indicador de "carregando" seja escondido no final
    showLoading(false);
  }
};

// 5. FUNÇÕES AUXILIARES PARA MANIPULAR A UI

// Limpa os resultados e mensagens de erro anteriores
function clearResultsAndErrors() {
  resultsContainer.innerHTML = '';
  errorMessageDiv.innerHTML = '';
  errorMessageDiv.classList.add('hidden');
}

// Controla a visibilidade do indicador de "carregando"
function showLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.classList.remove('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

// Mostra uma mensagem de erro na tela
function renderError(message) {
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove('hidden');
}

// Cria e insere os cards dos produtos na página
function renderProducts(products) {
  const productCards = products.map(product => `
    <div class="product-card">
      <img src="${product.imageUrl}" alt="${product.title}">
      <h3>${product.title}</h3>
      <div class="rating">
        <span>⭐ ${product.rating} (${product.numReviews.toLocaleString('pt-BR')} reviews)</span>
      </div>
    </div>
  `).join('');

  resultsContainer.innerHTML = productCards;
}

// 6. ADICIONA O EVENT LISTENER AO FORMULÁRIO
searchForm.addEventListener('submit', handleSubmit);