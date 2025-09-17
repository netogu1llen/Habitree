const express = require("express")
const router = express.Router()
const MissionController = require("../../controllers/Missions/Missions.controller")



router.get("/missions", MissionController.getMissions)
router.post("/missions", MissionController.postMissions)

module.exports = router
