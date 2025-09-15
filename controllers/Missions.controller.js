const Mission = require('../models/Missions.model');

exports.getMissions = async (req, res) => {
    const missions = await Mission.fetchAll();
    res.render('../views/missions', { title: 'Missions', missions });
};