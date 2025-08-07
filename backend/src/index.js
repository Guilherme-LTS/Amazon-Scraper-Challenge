import express from 'express';
import { scrapeAmazon } from './scraper.js'; // <-- Importamos a função

// 1. Inicialização
const app = express();
const PORT = 3000;

app.use(express.json());

// 2. Definição de Rotas
app.get('/', (req, res) => {
  res.send('<h1>Servidor do Scraper no ar!</h1><p>Use o endpoint /api/scrape?keyword=seu_termo para fazer a busca.</p>');
});

// Rota para o scraping agora usando a função importada
app.get('/api/scrape', async (req, res) => { // <-- Rota agora é async
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'O parâmetro "keyword" é obrigatório.' });
  }

  try {
    console.log(`Iniciando scraping para a palavra-chave: "${keyword}"`);
    const products = await scrapeAmazon(keyword); // <-- Usamos a função
    console.log(`Scraping finalizado. ${products.length} produtos encontrados.`);
    res.json(products); // <-- Retornamos os produtos encontrados

  } catch (error) {
    console.error('Erro na rota /api/scrape:', error);
    res.status(500).json({ error: error.message });
  }
});


// 3. Iniciando o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}. Acesse http://localhost:${PORT}`);
});