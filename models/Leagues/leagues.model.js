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



async function deleteLeagueByName(leagueName) {
    try {
        const [rows] = await db.query(`CALL EliminarLigaCompleta(?)`, [leagueName]);

        if (Array.isArray(rows) && rows[0] && rows[0][0] && rows[0][0].mensaje) {
            return { success: true, message: rows[0][0].mensaje };
        }

        return { success: true, message: 'League deleted successfully' };
    } catch (err) {
        console.error("Error en deleteLeagueByName:", err);
        throw err;
    }
}



// 💡 EXPORTACIÓN COMBINADA: Exporta ambas cosas
module.exports = {
    League, // Exporta la clase
    createLeagueViaProcedure, // Exporta la función
    deleteLeagueByName,
};