const db = require('../../util/database');

module.exports = class Quiz {

    constructor(responseVerification, category, description, dateOfCreation, available, experience) {
        this.responseVerification = responseVerification;
        this.category = category;
        this.description = description;
        this.dateOfCreation = dateOfCreation;
        this.available = available;
        this.experience = experience;
    }

    save() {
        return db.execute(
            'INSERT INTO quiz (responseVerification, category, description, dateOfCreation, available, experience) VALUES (?, ?, ?, ?, ?, ?)',
            [this.responseVerification, this.category, this.description, this.dateOfCreation, this.available, this.experience]
        );
    }

    static fetchAll() {
        return db.execute('SELECT * FROM quiz');
    }
}

class Question {
    constructor(IDQuestion, IDQuiz, question, answer) {
        this.IDQuestion = IDQuestion;
        this.IDQuiz = IDQuiz;
        this.question = question;
        this.answer = answer;
    }

    save() {
        return db.execute(
            'INSERT INTO question (IDQuiz, question, answer) VALUES (?, ?, ?)',
            [this.IDQuiz, this.question, this.answer]
        );
    }

    static fetchByQuizId(quizId) {
        return db.execute('SELECT * FROM question WHERE IDQuiz = ?', [quizId]);
    }

    static update(id, question, answer) {
        return db.execute(
            'UPDATE question SET question = ?, answer = ? WHERE IDQuestion = ?',
            [question, answer, id]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM question WHERE IDQuestion = ?', [id]);
    }
}
