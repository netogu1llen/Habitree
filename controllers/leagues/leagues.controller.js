const leaguesModel = require('../../models/leagues/leagues.model');

exports.getAddLeague = (req, res) => {
    // Renderizado del formulario de Add League (vista completa)
    res.render('leagues/addLeague', { csrfToken: req.csrfToken() });
}

// Endpoint para devolver solo el fragmento del modal (usado por fetch desde el cliente)
exports.getAddLeagueModal = (req, res) => {
    // Renderiza únicamente el partial/modal para insertarlo vía JS en #modal-root
    res.render('leagues/addLeague', { csrfToken: req.csrfToken() });
}

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
        // Llamar al procedure a través del model
        await leaguesModel.createLeagueViaProcedure({ name, lvl: lvlNum });
        return res.redirect('/leagues');
    } catch (err) {
        console.error('Error creando liga via procedure:', err.message || err);
        return res.status(500).send('Error interno al crear liga (ver logs)');
    }
};
