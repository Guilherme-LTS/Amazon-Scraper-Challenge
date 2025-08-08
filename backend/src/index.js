import express from 'express';
import cors from 'cors'; // <-- 1. IMPORTE O PACOTE
import { scrapeAmazon } from './scraper.js';

// 1. Inicialização
const app = express();
const PORT = 3000;


app.use(cors()); // <-- 2. USE O MIDDLEWARE

app.use(express.json());

// 3. Definição de Rotas
app.get('/', (req, res) => {
  res.send('<h1>Servidor do Scraper no ar!</h1><p>Use o endpoint /api/scrape?keyword=seu_termo para fazer a busca.</p>');
});

app.get('/api/scrape', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'O parâmetro "keyword" é obrigatório.' });
  }

  try {
    console.log(`Iniciando scraping para a palavra-chave: "${keyword}"`);
    const products = await scrapeAmazon(keyword);
    console.log(`Scraping finalizado. ${products.length} produtos encontrados.`);
    res.json(products);

  } catch (error) {
    console.error('Erro na rota /api/scrape:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Iniciando o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}. Acesse http://localhost:${PORT}`);
});