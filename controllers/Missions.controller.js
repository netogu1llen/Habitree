const Mission = require('../models/Missions.model');

exports.getMissions = async (req, res) => {
    try{
        const missions = await Mission.fetchAll();
        res.render('../views/missions', { title: 'Missions', missions });

    }catch(error){
        console.error(error);
        res.status(500).send("No se pudo conectar a la base de datos")
    }
    };