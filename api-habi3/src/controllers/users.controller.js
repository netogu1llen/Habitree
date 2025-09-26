const userService = require("../services/users.service");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener usuarios",
      details: err.message,
    });
  }
};


const getLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que vengan datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Faltan credenciales",
      });
    }

    // Llamar al servicio
    const user = await userService.getLoginUser(email, password);

    // Respuesta exitosa
    res.json({
      success: true,
      message: "✅ Login exitoso",
      user,
    });

  } catch (err) {
    res.status(401).json({
      success: false,
      message: "❌ Credenciales inválidas",
      details: err.message, // opcional
    });
  }
};

const getStats = async (req, res) => {
  try {
    const id = req.params.id; 
    const passkeys = await userService.getStatsUser(id);
    res.json(passkeys);
  } catch (err) {
    res.status(500).json({
      error: "Error obtaining user credcentials",
      details: err.message,
    });
  }
};

const postSignup = async (req, res) => {
  try {
    const {name, email, gender, dateOfBirth, coins, password} = req.body;
    const rows = await userService.postSignupUser(name, email, gender, dateOfBirth, coins, password);
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener usuarios",
      details: err.message,
    });
  }
};

module.exports = { getUsers, getLogin, postSignup, getStats };