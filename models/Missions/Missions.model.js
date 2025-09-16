const db = require('../../util/database');

// Clase mission
module.exports = class Mission{

    constructor(IDMission,responseVerification,category,description,dateOfCreation,available,experience){

        this.IDMission = IDMission;
        this.responseVerification = responseVerification;
        this.category = category; 
        this.description = description; 
        this.dateOfCreation = dateOfCreation;
        this.available = available;
        this.experience = experience; 

    } 

//Guardar el registro de una mision 

    save(){
 
        const currentDate = new Date();
        return db.execute(
            'INSERT INTO mission (IDMission,responseVerification,category,description,dateOfCreation,available,experience) VALUES(?,?,?,?,?,?,?)',
            [this.IDMission, this.responseVerification, this.category, this.description, currentDate, this.available, this.experience]
        );
    }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM mission');
    }


}
