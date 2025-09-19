exports.getQuizzes = async (req, res) => {
    res.render('quizzes/quizzes.ejs', { title: 'Quizzes' });
};
