const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/users.controller");
const { getLogin } = require("../controllers/users.controller");
const { postSignup } = require("../controllers/users.controller");
const { getStats } = require("../controllers/users.controller");
const { editUser } = require("../controllers/users.controller");
const { changepasswd } = require("../controllers/users.controller");

// GET /api/users
router.get("/", getUsers);
router.post("/login", getLogin);
router.get("/stats/:id", getStats);
router.post("/signup", postSignup)
router.put("/edit/:id", editUser);
router.patch("/changepasswd/:id", changepasswd)

module.exports = router;