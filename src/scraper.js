import { chromium } from 'playwright';

export async function scrapeAmazon(keyword) {
  if (!keyword) {
    throw new Error('Palavra-chave não pode ser vazia');
  }

  console.log('Iniciando navegador...');
  const browser = await chromium.launch({ headless: false }); 
  try {
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    });
    
    console.log(`Navegando para a busca por "${keyword}"...`);
    const searchURL = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    await page.goto(searchURL, { waitUntil: 'domcontentloaded' });
    
    console.log('Esperando pelos contêineres de produto...');
    await page.waitForSelector('div[data-asin]', { timeout: 15000 });
    console.log('Contêineres encontrados!');

    const productElements = await page.locator('div[data-asin]').all();
    console.log(`Encontrados ${productElements.length} elementos de produto. Iniciando extração simplificada...`);
    const products = [];

    // --- LOOP DE TESTE SUPER SIMPLIFICADO ---
    for (const element of productElements) {
      try {
        const asin = await element.getAttribute('data-asin');
        if (asin) {
          products.push({ asin: asin }); // Adicionando apenas o ASIN para teste
        }
      } catch (e) {
        // Ignora erros
      }
    }
    console.log('Extração simplificada finalizada.');
    return products;

  } catch (error) {
    console.error('Erro durante o scraping com Playwright:', error);
    throw new Error('Falha ao obter dados da Amazon com Playwright.');
  } finally {
    console.log('Fechando o navegador...');
    await browser.close();
    console.log('Navegador fechado.');
  }
}