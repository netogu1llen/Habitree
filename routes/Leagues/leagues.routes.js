const express = require("express")
const router = express.Router()
const isAuth = require('../../util/is-auth');
const leaguesController = require("../../controllers/Leagues/leagues.controller")

// Obtener todas las misiones
router.get("/", isAuth, leaguesController.getLeagues)

module.exports = router