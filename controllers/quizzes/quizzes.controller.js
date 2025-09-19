const Quiz = require('../../models/quizzes/quizzes.model');

exports.getQuizzes = async (req, res) => {
    try {
        const [quizzes] = await Quiz.fetchAll();
        res.render('quizzes/quizzes.ejs', { 
            title: 'Quizzes',
            quizzes: quizzes,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading quizzes');
    }
};

exports.postAddQuiz = async (req, res) => {
    try {
        const { category, description, experience } = req.body;
        const dateOfCreation = new Date().toISOString().slice(0, 10);
        
        const quiz = new Quiz(
            0, // responseVerification default
            category,
            description,
            dateOfCreation,
            0, // available default
            experience
        );
        
        await quiz.save();
        res.status(200).json({ 
            success: true, 
            message: 'Quiz created successfully' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating quiz' 
        });
    }
};
