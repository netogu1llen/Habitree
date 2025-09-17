const csrf = require("csurf");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.getUsers = async (req, res) => {
    res.render('../views/users', { 
        title: 'Users',  
        csrfToken: req.csrfToken()
    });
};

exports.postUser = (req, res) => {
    console.log("Datos recibidos en POST /users:", request.body);

    const user = new Usuario(
        req.body.name = my_name,
        req.body.name = my_email,
        req.body.namepassword = my_password,
        req.body.namegender = my_gender,
        req.body.dateOfBirth = my_dateOfBirth
    )
    
    
}