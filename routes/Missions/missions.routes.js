const express = require("express")
const router = express.Router()
const MissionController = require("../../controllers/Missions/Missions.controller")



router.get("/", MissionController.getMissions)

module.exports = router
