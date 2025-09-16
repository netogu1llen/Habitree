const express = require("express")
const router = express.Router()
const MissionController = require("../../controllers/Missions/Missions.controller")

// Obtener todas las misiones
router.get("/missions", MissionController.getMissions)
// Registrar nueva misión
router.post("/missions", MissionController.postMissions)
// Obtener misión por ID (para edición)
router.get("/missions/:id", MissionController.getMissionById)
// Editar misión
router.post("/missions/edit/:id", MissionController.editMission)

module.exports = router
