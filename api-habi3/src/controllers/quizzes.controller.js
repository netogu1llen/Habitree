const quizzesService = require("../services/quizzes.service");

const getQuizzes = async (req, res) => {
  try {
    const { id } = req.params;; // ejemplo: leer de query
    const quizzes = await quizzesService.getAllQuizzes(id);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({
      error: "Error obtaining the quizzes",
      details: err.message,
    });
  }
};

const getQuiz = async (req, res) => {
  try {
    const { id } = req.params; // quizId
    const quiz = await quizzesService.getQuizById(id);
    
    if (!quiz) {
      return res.status(404).json({
        error: "Quiz not found"
      });
    }
    
    res.json(quiz);
  } catch (err) {
    res.status(500).json({
      error: "Error obtaining the quiz",
      details: err.message,
    });
  }
};



module.exports = {getQuizzes, getQuiz};