import express from 'express';
import mongoose from 'mongoose';
import recintosRouter from './routes/recintos.js';
import eventosRouter from './routes/eventos.js';

mongoose.connect('mongodb+srv://lauraamarttinez_db_user:contrasenyasecreta@clusterlaura.dtrz8kp.mongodb.net/')
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error conectando a MongoDB:', error));

const app = express();

app.use(express.json());

app.use('/recintos', recintosRouter);
app.use('/eventos', eventosRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
