const express = require("express");
const router = express.Router();
const { getShopItemsForUser } = require("../controllers/shop.controller");

// GET /api/users
router.get("/:id", getShopItemsForUser );


module.exports = router;