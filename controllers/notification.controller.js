const Notification = require('../models/notification');

exports.getNotifications = async (req, res) => {
    const notifications = await Notification.fetchAll();
    res.render('../views/notifications', { title: 'Notifications', notifications });
};