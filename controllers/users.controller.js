const csrf = require("csurf");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.getUsers = async (req, res) => {
    res.render('../views/users', { 
        title: 'Users',  
        csrfToken: req.csrfToken()
    });
};