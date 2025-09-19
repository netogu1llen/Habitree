const express = require("express")
const router = express.Router()
const quizzesController = require("../../controllers/quizzes/quizzes.controller")

router.get("/quizzes", quizzesController.getQuizzes)
 
//addQuizz
//router.get("/addQuizz", quizzesController.getAddQuizz)

//editQuizz
//router.post("/editQuizz/:id", quizzesController.getEditQuizz)



module.exports = router
