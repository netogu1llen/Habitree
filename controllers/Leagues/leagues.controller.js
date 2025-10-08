const { response } = require('express');
const League = require('../../models/Leagues/leagues.model');

exports.getLeagues = async (req, res) => {
   
    const leagues = await League.fetchAll();
    
    res.render('../views/Leagues/leagues.ejs', { title: 'Leagues', leagues, csrfToken: req.csrfToken()});
};
