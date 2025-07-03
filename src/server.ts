import express from 'express';
import bodyParser from 'body-parser';
import contactRoutes from './routes/contactRoutes';

const app = express();
app.use(bodyParser.json());
app.use('/', contactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});