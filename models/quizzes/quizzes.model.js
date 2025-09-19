const db = require('../../util/database');

module.exports = class Quiz {

    constructor(IDQuiz, responseVerification, category, description, dateOfCreation, available, experience) {
        this.IDQuiz = IDQuiz;
        this.responseVerification = responseVerification;
        this.category = category;
        this.description = description;
        this.dateOfCreation = dateOfCreation;
        this.available = available;
        this.experience = experience;
    }

    save() {
        return db.execute(
            'INSERT INTO quiz (IDQuiz, responseVerification, category, description, dateOfCreation, available, experience) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [this.IDQuiz, this.responseVerification, this.category, this.description, this.dateOfCreation, this.available, this.experience]
        );
    }

    static fetchAll() {
        return db.execute('SELECT * FROM quiz');
    }
}
