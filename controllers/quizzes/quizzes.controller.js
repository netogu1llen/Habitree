const Quiz = require('../../models/quizzes/quizzes.model');
const db = require('../../util/database');

exports.getQuizzes = async (req, res) => {
    try {
        const [quizzes] = await Quiz.fetchAll();
        const uniqueQuizzes = Array.from(new Set(quizzes.map(q => q.IDQuiz)))
            .map(id => quizzes.find(q => q.IDQuiz === id));

        res.render('quizzes/quizzes.ejs', {
            title: 'Quizzes',
            quizzes: uniqueQuizzes,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading quizzes');
    }
};

exports.postAddQuiz = async (req, res) => {
    let connection;

    try {
        // Obtener conexión con la base de datos
        connection = await db.getConnection();
        await connection.beginTransaction();

        const { category, description, experience, questions } = req.body;
        const dateOfCreation = new Date().toISOString().slice(0, 10);

        // 1. Crear el quiz
        const [quizResult] = await connection.execute(
            'INSERT INTO quiz (responseVerification, category, description, dateOfCreation, available, experience) VALUES (?, ?, ?, ?, ?, ?)',
            [1, category, description, dateOfCreation, 1, experience]
        );

        // 2. Obtener el ID del quiz recién creado
        const newQuizId = quizResult.insertId;

        // 3. Guardar las preguntas usando la misma conexión
        if (questions && questions.length > 0) {

            for (const questionData of questions) {
                await connection.execute(
                    'INSERT INTO question (IDQuiz, question, answer) VALUES (?, ?, ?)',
                    [newQuizId, questionData.question, questionData.answer]
                );
            }
            console.log('Preguntas guardadas exitosamente');
        } else {
            console.log('No hay preguntas para guardar');
        }

        await connection.commit();
        console.log('Transacción completada exitosamente');

        res.status(200).json({
            success: true,
            message: 'Quiz and questions created successfully',
            quizId: newQuizId
        });
    } catch (error) {
        console.error('Error completo en postAddQuiz:', error);

        if (connection) {
            await connection.rollback();
            console.log('Transacción revertida');
        }

        res.status(500).json({
            success: false,
            message: 'Error creating quiz and questions: ' + error.message
        });
    } finally {
        if (connection) {
            connection.release();
            console.log('Conexión liberada');
        }
    }
};


exports.deleteQuiz = async (req, res) => {
    let connection;
    try {
        const quizId = req.params.id;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Eliminar primero las preguntas del quiz
        await connection.execute('DELETE FROM question WHERE IDQuiz = ?', [quizId]);

        // Luego el quiz
        await connection.execute('DELETE FROM quiz WHERE IDQuiz = ?', [quizId]);

        await connection.commit();

        res.json({ success: true, message: "Quiz deleted successfully" });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ success: false, message: "Error deleting quiz: " + error.message });
    } finally {
        if (connection) connection.release();
    }
};
