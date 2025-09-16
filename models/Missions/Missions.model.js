// eslint-disable-next-line no-undef
const db = require('../../util/database');

// eslint-disable-next-line no-undef
module.exports = class Mission{

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM mission');
    }


}