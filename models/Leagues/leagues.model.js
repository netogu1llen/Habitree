// leagues.model.js
// eslint-disable-next-line no-undef
const db = require('../../util/database');

async function createLeagueViaProcedure({ name, lvl}, connection) {
    // ... (Tu código de createLeagueViaProcedure)
    const procName = 'InsertarLiga'; 
    const params = [name, lvl];
    // ... (resto de la lógica)
    try {
        if (connection) {
            const [result] = await connection.execute(`CALL ${procName}(?, ?)`, params);
            return result;
        } else {
            const [result] = await db.execute(`CALL ${procName}(?, ?)`, params);
            return result;
        }
    } catch (err) {
        throw err;
    }
}

// Renombra la clase a League para mayor claridad
class League {
    constructor(ID_league, league, min_level){
        this.ID_league = ID_league;
        this.league = league;
        this.min_level = min_level; 
    } 

    /**
     * Devuelve todas las ligas.
     */
    static fetchAll() {
        return db.execute('SELECT * FROM Leagues');
    }
}

// 💡 EXPORTACIÓN COMBINADA: Exporta ambas cosas
module.exports = {
    League, // Exporta la clase
    createLeagueViaProcedure, // Exporta la función
};