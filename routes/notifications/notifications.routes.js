const express = require("express")
const router = express.Router()
const notificationController = require("../../controllers/notifications/notification.controller")



router.get("/", notificationController.getNotifications)

router.get("/add-modal", notificationController.getAddNotification);

router.get("/edit/:id", notificationController.getNotificationEditor);

router.post("/delete", notificationController.postDelete);

router.post("/update", notificationController.postUpdate);
module.exports = router
