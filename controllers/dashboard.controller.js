const Notification = require('../models/notification');

exports.getDashboard = async (req, res) => {
    res.render('../views/dashboard.ejs', { title: 'Dashboard' });
};