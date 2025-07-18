import express from 'express';
import cors from 'cors';
import routes from './routes/index.js'; // Importa o roteador principal
import errorHandler from './utils/errorHandler';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api', routes); // Usa todas as rotas sob o prefixo /api

app.use(errorHandler); // Tratamento de erros global

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});