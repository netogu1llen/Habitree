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
