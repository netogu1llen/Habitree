const Mission = require('../../models/Missions/Missions.model');

exports.getMissions = async (req, res) => {
    const missions = await Mission.fetchAll();
    res.render('../views/missions/missions', { title: 'Missions', missions });
};