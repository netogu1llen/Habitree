const db = require('../../util/database');

// Clase mission
module.exports = class Item{

    constructor(name, state, category, price, image_name){

        this.name = name;
        this.state = state;
        this.category = category; 
        this.price = price; 
        this.image_name = image_name;
    } 

//Guardar el registro de una mision 

    save(){
 
        return db.execute(
            'INSERT INTO shop (name, state, category, price, image_name) VALUES(?,?,?,?,?)',
            [this.name, this.state, this.category, this.price, this.image_name]
        );
    }

}
