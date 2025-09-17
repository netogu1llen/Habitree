const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notification.controller")



router.get("/", notificationController.getNotifications)

router.get("/edit/:id", notificationController.getNotificationEditor);

router.post("/delete", notificationController.postDelete);

router.post("/update", notificationController.postUpdate);
module.exports = router
