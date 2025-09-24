// index.js
// Proyecto Habitree - Servidor Express básico

const express = require('express');
const app = express();
require('dotenv').config();

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

const usersRoutesApi = require("./api-habi3/src/routes/users.routes");
const missionsRoutesApi = require("./api-habi3/src/routes/mission.routes");
app.use("/api/users", usersRoutesApi);
app.use("/api/missions", missionsRoutesApi);

const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // No incluir DELETE aquí si necesitas protección CSRF para eliminación
});

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
    next();
});

app.use(csrfProtection);

// Rutas principales
app.get('/shop', (req, res) => {
  res.send();
});

const userRoutes = require('./routes/users.routes');
app.use('/users', userRoutes);



const rewardsRoutes = require('./routes/Rewards/Rewards.routes');
app.use('/rewards',rewardsRoutes);

const loginRoutes = require('./routes/login.routes');
app.use('/login', loginRoutes);

const notificationsRoutes = require('./routes/notifications/notifications.routes');
app.use('/notifications', notificationsRoutes);

app.get('/leagues', (req, res) => {
  res.send('Leagues route');
});

const missionsRoutes = require('./routes/Missions/missions.routes');
app.use(missionsRoutes);
 
const quizzesRoutes = require ('./routes/quizzes/quizzes.routes');
app.use(quizzesRoutes);

// Ruta raíz
const dashboardRoutes = require ('./routes/dashboard.route');
app.use('/', dashboardRoutes);
// Puerto
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});