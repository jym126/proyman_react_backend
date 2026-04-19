const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const dbConnection  = require('./config/db.config'); //Database connection


const app = express();
app.use(cors({
    origin: "*"
}));

const port = process.env.PORT || 4000;
dbConnection(); //execute db connection


// 1. Aumentar el límite de tamaño ANTES de las rutas
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Las rutas de la API deben ir PRIMERO
// Esto asegura que /projects/upload sea atendido por tu controlador
app.use(routes);

// 3. Los archivos estáticos DESPUÉS
// Si ninguna ruta de la API coincide, entonces busca en la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// 4. Manejo de React Router (opcional pero recomendado)
// Si el usuario refresca la página en una ruta de React, sirve el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, ()=> {
    console.log(`Corriendo en puerto port ${port}`);
});