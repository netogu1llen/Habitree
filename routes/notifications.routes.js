const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notification.controller")



router.get("/", notificationController.getNotifications)

router.get("/edit/:id", notificationController.getNotificationEditor);
module.exports = router
