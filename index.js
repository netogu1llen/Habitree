// index.js
// Proyecto Habitree - Servidor Express básico

const express = require('express');
const app = express();

// Configuración del motor de vistas EJS
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas principales
app.get('/shop', (req, res) => {
  res.send();
});

const notificationsRoutes = require('./routes/notifications.routes');
app.use('/notifications', notificationsRoutes);

app.get('/leagues', (req, res) => {
  res.send('Leagues route');
});

app.get('/missions', (req, res) => {
  res.send('Missions route');
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Welcome to Habitree API');
});

// Puerto
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
