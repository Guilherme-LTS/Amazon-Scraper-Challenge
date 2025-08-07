import axios from 'axios';
import { JSDOM } from 'jsdom';

// A função principal que fará o scraping
export async function scrapeAmazon(keyword) {
  if (!keyword) {
    throw new Error('Palavra-chave não pode ser vazia');
  }

  // Monta a URL de busca na Amazon Brasil, codificando a palavra-chave para ser segura na URL
  const searchURL = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

  try {
    // 1. Faz a requisição HTTP para a página da Amazon
    // É crucial enviar um User-Agent para simular um navegador real
    const response = await axios.get(searchURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8',
      },
    });

    // 2. Analisa o HTML da página usando JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const products = [];
    // Seleciona todos os contêineres de resultados de produto
    const productElements = document.querySelectorAll('[data-component-type="s-search-result"]');

    // 3. Itera sobre cada produto encontrado para extrair os dados
    productElements.forEach(element => {
      // Título do produto
      const titleElement = element.querySelector('h2 .a-link-normal span.a-text-normal');
      const title = titleElement ? titleElement.textContent.trim() : null;

      // Avaliação (estrelas)
      const ratingElement = element.querySelector('.a-icon-alt');
      // O texto é "X,X de 5 estrelas". Pegamos apenas o número.
      const ratingText = ratingElement ? ratingElement.textContent.trim() : '0';
      const rating = parseFloat(ratingText.replace(',', '.').split(' ')[0]) || 0;
      
      // Número de avaliações
      const numReviewsElement = element.querySelector('span.a-size-base');
      const numReviewsText = numReviewsElement ? numReviewsElement.textContent.trim().replace(/[().]/g, '') : '0';
      const numReviews = parseInt(numReviewsText) || 0;

      // URL da imagem
      const imageElement = element.querySelector('.s-image');
      const imageUrl = imageElement ? imageElement.getAttribute('src') : null;

      // Adiciona ao array apenas se tivermos conseguido extrair um título e uma imagem
      if (title && imageUrl) {
        products.push({
          title,
          rating,
          numReviews,
          imageUrl,
        });
      }
    });

    return products;

  } catch (error) {
    console.error('Erro ao fazer o scraping:', error);
    // Lança o erro para ser tratado no servidor
    throw new Error('Falha ao tentar obter os dados da Amazon.');
  }
}