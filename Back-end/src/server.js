import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/', routes);

const port = Number(process.env.SERVER_PORT) || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});