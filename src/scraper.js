import { chromium } from 'playwright';

export async function scrapeAmazon(keyword) {
  if (!keyword) {
    throw new Error('Palavra-chave não pode ser vazia');
  }

  // 1. INICIALIZAÇÃO DO NAVEGADOR
  // Usamos um bloco try...finally para garantir que o navegador sempre fechará
  const browser = await chromium.launch({ headless: true }); // headless: true para rodar em segundo plano
  try {
    const page = await browser.newPage();
    const searchURL = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    
    // 2. NAVEGAÇÃO
    await page.goto(searchURL, { waitUntil: 'domcontentloaded' });

    // 3. ESPERA INTELIGENTE
    // Esperamos que o seletor do produto apareça na página (até 15 segundos)
    // Esta é a etapa que o JSDOM não conseguia fazer: esperar o JS da página rodar.
    await page.waitForSelector('div[data-asin]', { timeout: 15000 });

    // 4. EXTRAÇÃO DE DADOS COM LOCATORS DO PLAYWRIGHT
    const productElements = await page.locator('div[data-asin]').all();
    const products = [];

    for (const element of productElements) {
      // Usamos try-catch para cada item para que um produto com HTML quebrado não pare todo o scraping
      try {
        const title = await element.locator('h2 a.a-link-normal span.a-text-normal').textContent();
        const imageUrl = await element.locator('img.s-image').getAttribute('src');
        
        // Extração de dados que podem não existir (avaliação e reviews)
        let rating = 0;
        if (await element.locator('.a-icon-alt').count() > 0) {
          const ratingText = await element.locator('.a-icon-alt').first().textContent();
          rating = parseFloat(ratingText.replace(',', '.').split(' ')[0]) || 0;
        }

        let numReviews = 0;
        if (await element.locator('span.a-size-base.s-underline-text').count() > 0) {
            const numReviewsText = await element.locator('span.a-size-base.s-underline-text').first().textContent();
            numReviews = parseInt(numReviewsText.replace(/[().]/g, '')) || 0;
        }

        if (title && imageUrl) {
          products.push({ title, rating, numReviews, imageUrl });
        }
      } catch (e) {
        // Ignora erros em um único produto e continua o loop
        console.log(`Pulando um produto devido a um erro de extração: ${e.message}`);
      }
    }

    return products;

  } catch (error) {
    console.error('Erro durante o scraping com Playwright:', error);
    throw new Error('Falha ao obter dados da Amazon com Playwright.');
  } finally {
    // 5. FECHAMENTO DO NAVEGADOR
    // Essencial para não deixar processos abertos consumindo memória
    await browser.close();
  }
}