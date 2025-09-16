const { response } = require('express');
const Mission = require('../../models/Missions/Missions.model');

exports.getMissions = async (req, res) => {
    const missions = await Mission.fetchAll();
    res.render('../views/missions/missions', { title: 'Missions', missions, csrfToken: req.csrfToken()});
};

exports.postMissions = async(req,res,next) => {

    const addMissions = new Mission (
        req.body.IDMission, 
        req.body.responseVerification,
        req.body.category,
        req.body.description,
        new Date(),
        req.body.available,
        req.body.experience,
    ); 
    addMissions.save()
        .then(() => {
            res.redirect('/');
    })
    .catch(err => console.log(err));
}
