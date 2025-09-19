const csrf = require("csurf");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Usuario = require("../models/user.model");
const nodemailer = require("nodemailer")

// Configurar el transporter de Nodemailer, es una cuenta de gmail con contraseña de app
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS  // tu contraseña de aplicación
    }
});

// Función para generar una contraseña aleatoria segura
function generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);      
}

exports.getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.fetchAll();
        res.render('../views/users', {
            title: 'Users',
            usuarios,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener usuarios");
    }
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


        // Datos para el correo
        const userEmail = req.body.email;
        const userPassword = passwordPlano;

        // Configurar el correo
        const mailOptions = {
            from: `"Habitree App" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Login Credentials",
            html: `
                <h2>Registration Succesful!</h2>
                <p>Here are your login credentials:</p>
                <ul>
                    <li><strong>Email:</strong> ${userEmail}</li>
                    <li><strong>Password:</strong> ${userPassword}</li>
                </ul>
                <p>Please store this information securely and do not share it with anyone.</p>
            `,
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado a:", userEmail);

        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating user");
    }
};