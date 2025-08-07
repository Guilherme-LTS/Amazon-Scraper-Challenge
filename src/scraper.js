import { chromium } from 'playwright';

export async function scrapeAmazon(keyword) {
  if (!keyword) {
    throw new Error('Palavra-chave não pode ser vazia');
  }

  // Usaremos headless: false para assistir à mágica, depois mudamos para true.
  const browser = await chromium.launch({ headless: false }); 
  try {
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    });
    
    const searchURL = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    await page.goto(searchURL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('div[data-asin]', { timeout: 15000 });

    const productElements = await page.locator('div[data-asin]').all();
    const products = [];

    for (const element of productElements) {
      try {
        // --- SELETORES INTERNOS ATUALIZADOS ---
        // Título: Buscando por uma classe mais comum e estável para o título.
        const title = await element.locator('span.a-size-base-plus.a-color-base.a-text-normal, span.a-size-medium.a-color-base.a-text-normal').first().textContent({ timeout: 5000 });

        const imageUrl = await element.locator('img.s-image').getAttribute('src');
        
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
        // console.log(`Pulando um produto. Erro: ${e.message}`);
      }
    }

    return products;

  } catch (error) {
    console.error('Erro durante o scraping com Playwright:', error);
    throw new Error('Falha ao obter dados da Amazon com Playwright.');
  } finally {
    await browser.close();
  }
}