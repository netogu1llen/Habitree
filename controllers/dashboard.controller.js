const Notification = require('../models/notification.model');

exports.getDashboard = async (req, res) => {
    res.render('../views/dashboard.ejs', { title: 'Dashboard' });
};