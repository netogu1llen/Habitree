const express = require("express");
const router = express.Router();
const quizzesController = require("../../controllers/quizzes/quizzes.controller");

router.get("/quizzes", quizzesController.getQuizzes);
router.post("/quizzes", quizzesController.postAddQuiz);

module.exports = router;
