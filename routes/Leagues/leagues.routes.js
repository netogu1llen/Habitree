const express = require("express")
const router = express.Router()
const isAuth = require('../../util/is-auth');
const leaguesController = require("../../controllers/leagues/leagues.controller")



router.get("/", isAuth, leaguesController.getLeagues);

router.get("/add-league", isAuth, leaguesController.getAddLeague);

// Endpoint usado por el cliente para obtener el HTML del modal via fetch
router.get('/add-modal', isAuth, leaguesController.getAddLeagueModal);

router.post("/add", isAuth, leaguesController.postAddLeague);


module.exports = router