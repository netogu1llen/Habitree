const db = require('../../util/database');

// Clase mission
module.exports = class Mission{

    constructor(IDRanking,IDTree,league){

        this.IDRanking = IDRanking;
        this.IDTree = IDTree;
        this.league = league; 
      
    } 


    /**
     * Devuelve todas las misiones.
     * @returns {Promise}
     */
    static fetchAll() {
    // Solo misiones activas (borrado lógico)
    return db.execute('SELECT * FROM ranking');
    }


    
}
