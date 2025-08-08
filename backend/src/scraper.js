import { chromium } from 'playwright';

export async function scrapeAmazon(keyword) {
  if (!keyword) {
    throw new Error('Keyword cannot be empty');
  }

  // Set headless: true for the final version, running in the background.
  const browser = await chromium.launch({ headless: true }); 
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
        // --- FINAL & CORRECT SELECTORS ---
        const title = await element.locator('h2.a-text-normal').first().textContent({ timeout: 2000 });
        const imageUrl = await element.locator('img.s-image').first().getAttribute('src');
        
        let rating = 0;
        if (await element.locator('.a-icon-alt').count() > 0) {
          const ratingText = await element.locator('.a-icon-alt').first().textContent({ timeout: 2000 });
          rating = parseFloat(ratingText.replace(',', '.').split(' ')[0]) || 0;
        }

        let numReviews = 0;
        if (await element.locator('span.a-size-base.s-underline-text').count() > 0) {
            const numReviewsText = await element.locator('span.a-size-base.s-underline-text').first().textContent({ timeout: 2000 });
            numReviews = parseInt(numReviewsText.replace(/[().]/g, '')) || 0;
        }

        if (title && imageUrl) {
          products.push({ title, rating, numReviews, imageUrl });
        }
      } catch (e) {
        // Ignore products that might have a slightly different structure or are ads.
      }
    }

    return products;

  } catch (error) {
    // Catch major errors (navigation failure, main timeout).
    console.error('Error during Playwright scraping:', error);
    throw new Error('Failed to fetch data from Amazon with Playwright.');
  } finally {
    // Ensure the browser is always closed to prevent memory leaks.
    await browser.close();
  }
}