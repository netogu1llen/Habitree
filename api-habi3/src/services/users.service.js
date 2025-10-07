const db = require("../../../util/database");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM user");
  return rows;
};


const getLoginUser = async (email, password) => {
  //Buscar usuario por correo
  const [rows] = await db.execute(
    "SELECT IDUser, Name, email, gender, dateOfBirth, coins, password FROM user WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Usuario no encontrado");
  }

  const user = rows[0];

  //Comparar contraseñas con bcrypt
  const isMatch = await bcrypt.compare(password, user.password); // OJO: usar "user.password"

  if (!isMatch) {
    throw new Error("Contraseña incorrecta");
  }

  // 3. Retornar datos del usuario (sin contraseña)
  return {
    id: user.IDUser,
    name: user.Name,
    email: user.email,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    coins: user.coins
  };
};

const getStatsUser = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
        u.IDUser,
        u.name,
        u.email,
        u.coins,
        t.level AS tree_level,
        r.league AS ranking_league
     FROM user u
     LEFT JOIN tree t ON u.IDUser = t.IDUser
     LEFT JOIN ranking r ON t.IDTree = r.IDTree
     WHERE u.IDUser = ?`,
    [id]
  );
  return rows;
};


const postSignupUser = async (name, email, gender, dateOfBirth, coins, password) => {
  try {
    
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    
    const [result] = await db.execute(
      "INSERT INTO user (name, email, gender, dateOfBirth, coins, password, deleted) VALUES (?,?,?,?,?,?,?)",
      [name, email, gender, dateOfBirth, coins, hashedPassword, 0]
    );

    const userId = result.insertId; // ID del usuario recién creado

    // Insertar en tree vinculado a ese usuario
    await db.execute(
      "INSERT INTO tree (IDUser, level) VALUES (?, ?)",
      [userId, 1] // Por defecto nivel 1
    );

    return { userId }; // Devuelve el ID del usuario creado
  } catch (err) {
    throw new Error(err.message);
  }
};

const editUserInfo = async (id, name, email, gender, dateOfBirth) => {
  try {
    const [result] = await db.execute(
      `UPDATE user 
       SET name = ?, email = ?, gender = ?, dateOfBirth = ? 
       WHERE IDUser = ?`,
      [name, email, gender, dateOfBirth, id]
    );

    return { affectedRows: result.affectedRows }; // Te dice cuántos registros se actualizaron
  } catch (err) {
    throw new Error(err.message);
  }
};

const changeUserPassword = async (id, password) => {
  try {
    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Actualizar solo el campo password
    const [result] = await db.execute(
      `UPDATE user 
       SET password = ? 
       WHERE IDUser = ?`,
      [hashedPassword, id]
    );

    return { affectedRows: result.affectedRows }; // 1 si se actualizó, 0 si no encontró el usuario
  } catch (err) {
    throw new Error(err.message);
  }
};
const getMissionsSummaryByUser = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
        m.category,
        SUM(m.value) AS total_value
     FROM userMissions um
     INNER JOIN mission m ON um.IDMission = m.IDMission
     WHERE um.IDUser = ? 
       AND um.status = 1
       AND m.category IN ('Awareness', 'Consumption', 'Energy', 'Nature', 'Transport', 'Waste', 'Water')
     GROUP BY m.category
     ORDER BY m.category`,
    [id]
  );
  
  // Transformar el resultado en un objeto plano
  const summary = rows.reduce((acc, row) => {
    acc[row.category] = row.total_value;
    return acc;
  }, {});
  
  return summary;
};

const getUserRewardsById = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
        r.IDReward,
        r.name,
        r.description,
        r.type,
        r.available,
        r.value,
        ur.IDUserReward
     FROM userRewards ur
     INNER JOIN rewards r ON ur.IDReward = r.IDReward
     WHERE ur.IDUser = ? 
       AND r.type IN ('monetary', 'nonMonetary')
     ORDER BY ur.IDUserReward DESC`,
    [id]
  );
  return rows;
};

module.exports = { getAllUsers, getLoginUser, postSignupUser, getStatsUser, editUserInfo, changeUserPassword,  getMissionsSummaryByUser, getUserRewardsById};

