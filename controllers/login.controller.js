const csrf = require("csurf");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res) => {
  res.render('../views/login', {
    csrfToken: req.csrfToken(),
  });
};