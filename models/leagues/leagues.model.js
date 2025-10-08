// eslint-disable-next-line no-undef
const db = require('../../util/database');

async function createLeagueViaProcedure({ name, lvl}, connection) {
  const procName = 'InsertarLiga'; // reemplaza por el nombre real de tu procedure
  const params = [name, lvl];

  try {
    if (connection) {
      // Si el servicio ya tiene una conexión/transaction abierta
      const [result] = await connection.execute(`CALL ${procName}(?, ?)`, params);
      return result;
    } else {
      // Usar el pool por defecto
      const [result] = await db.execute(`CALL ${procName}(?, ?)`, params);
      return result;
    }
  } catch (err) {
    // Dejar que el service/controller maneje/loguee el error
    throw err;
  }
}

module.exports = {
  createLeagueViaProcedure,
};