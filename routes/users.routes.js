const express = require("express")
const router = express.Router()
const usersController = require("../controllers/users.controller")


router.get("/", usersController.getUsers)
router.post("/", usersController.postUsers)
// Obtener usuario por ID (para edición)
router.get("/:id", usersController.getUserById)
// Editar usuario
router.post("/edit/:id", usersController.editUser)

module.exports = router;