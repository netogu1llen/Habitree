// eslint-disable-next-line no-undef
  const db = require("../util/database");
  const bcrypt = require("bcryptjs");


  module.exports = class Usuario {
    //class constructor
    constructor(
        //todo: add constructor later
    ) {

    }
   
    static fetchOne(email) {
        return db.execute("SELECT * FROM user WHERE email=?", [
            email,
        ]);
    }

    static async getRolByUserId(idUsuario) {
        return db.execute(
            `SELECT r.rol
            FROM user u
            JOIN rol r ON u.IDRol = r.IDRol
            WHERE u.IDUser = ?`,
            [idUsuario]
        );
    }
};
    