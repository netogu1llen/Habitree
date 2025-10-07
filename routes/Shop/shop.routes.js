const express = require("express");
const router = express.Router();
const ShopController = require("../../controllers/Shop/shop.controller");

// Routes para filtro
router.get("/api/filter-options", ShopController.getFilterOptions);
router.get("/api/filter", ShopController.filterItems);

// Obtener todos los items
router.get("/", ShopController.getItems);

module.exports = router;