const csrf = require("csurf");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Usuario = require("../models/user.model");

// Función para generar una contraseña aleatoria segura
function generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);      
}

exports.getUsers = async (req, res) => {
    res.render('../views/users', { 
        title: 'Users',  
        csrfToken: req.csrfToken()
    });
};

exports.postUsers = async (req, res) => {
    console.log("Datos recibidos en POST /users:", req.body);

    try {
        // Generar contraseña aleatoria o usar la del body
        const passwordPlano = generateRandomPassword(12);
        // Hashear
        const hashedPassword = await bcrypt.hash(passwordPlano, 12);

        // Crear usuario en la BD
        await Usuario.save({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
        });

        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating user");
    }
};