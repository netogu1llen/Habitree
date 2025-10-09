const { League, createLeagueViaProcedure } = require('../../models/leagues/leagues.model');


exports.getLeagues = async (req, res) => {
    // Ahora llamas a fetchAll() desde la CLASE League desestructurada
    const leagues = await League.fetchAll(); // ✅ Solución para fetchAll()
    
    res.render('../views/Leagues/leagues.ejs', { title: 'Leagues', leagues, csrfToken: req.csrfToken()});
}

exports.getAddLeague = (req, res) => {
    // Renderizado del formulario de Add League (vista completa)
    res.render('leagues/addLeague', { csrfToken: req.csrfToken() });
}

// Endpoint para devolver solo el fragmento del modal (usado por fetch desde el cliente)
exports.getAddLeagueModal = (req, res) => {
    // Renderiza únicamente el partial/modal para insertarlo vía JS en #modal-root
    res.render('leagues/addLeague', { csrfToken: req.csrfToken() });
}

exports.getEditLeagueModal = (req, res) => {
        console.log('GET /leagues/edit-modal', req.query);

    res.render('Leagues/editLeague', {
        csrfToken: req.csrfToken(),
        leagueName: req.query.name,
        leagueLevel: req.query.level
    });
};

exports.postAddLeague = async (req, res) => {
    // DEBUG: mostrar lo que llega desde el form
    console.log('POST /leagues/add body:', req.body);

    const { name, lvl } = req.body;
    // Conversión sencilla y segura: trim y parseInt; rechazar valores no numéricos
    const rawLvl = String(lvl ?? '').trim();
    const lvlNum = parseInt(rawLvl, 10);

    if (!name || rawLvl === '' || Number.isNaN(lvlNum)) {
        return res.status(400).send('Datos inválidos: name y lvl son requeridos');
    }

    try {
        // Ahora llamas a la función createLeagueViaProcedure desestructurada
        await createLeagueViaProcedure({ name, lvl: lvlNum }); // ✅ Solución para postAddLeague
        return res.redirect('/leagues');
    } catch (err) {
        console.error('Error creando liga via procedure:', err.message || err);
        return res.status(500).send('Error interno al crear liga (ver logs)');
    }
};

const leaguesModel = require('../../models/leagues/leagues.model');

exports.postEditLeagueName = async (req, res) => {
    const { nameA, name } = req.body; // nameA = nombre_actual, name = nombre_nuevo
    try {
        await leaguesModel.cambiarNombreLiga(nameA, name);

        res.redirect('/leagues');

    } catch (err) {
        console.error('Error al cambiar nombre de liga:', err);
        res.status(500).send('Error al cambiar nombre de liga');
    }
};

exports.postEditLeagueLevel = async (req, res) => {
    const { nameA, lvl } = req.body; // nameA = nombre_liga, lvl = nuevo_min_level
    try {
        await leaguesModel.cambiarMinLevelLiga(nameA, parseInt(lvl, 10));

        res.redirect('/leagues');
    } catch (err) {
        console.error('Error al cambiar min level de liga:', err);
        res.status(500).send('Error al cambiar min level de liga');
    }
};