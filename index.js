// index.js
// Proyecto Habitree - Servidor Express básico

const express = require('express');
const app = express();

// Configuración del motor de vistas EJS
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const session = require('express-session');

app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    ignore: (req) => {
        // Ignorar rutas de API y webhooks
        return req.path.startsWith('/api/') || 
               req.path.includes('/webhook') ||
               req.path.includes('/agendar-one-to-one');
    }
});

app.use(csrfProtection);

// Rutas principales
app.get('/shop', (req, res) => {
  res.send();
});

const userRoutes = require('./routes/users.routes');
app.use('/users', userRoutes);

const loginRoutes = require('./routes/login.routes');
app.use('/login', loginRoutes);

const notificationsRoutes = require('./routes/notifications.routes');
app.use('/notifications', notificationsRoutes);

app.get('/leagues', (req, res) => {
  res.send('Leagues route');
});

const missionsRoutes = require('./routes/Missions/missions.routes');
app.use(missionsRoutes);
 

// Ruta raíz
const dashboardRoutes = require('./routes/dashboard.route');
app.use('/', dashboardRoutes);
// Puerto
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
