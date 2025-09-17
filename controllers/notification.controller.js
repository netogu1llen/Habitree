const Notification = require('../models/notification.model');

exports.getNotifications = async (req, res) => {
    const notifications = await Notification.fetchAll();
    res.render('notifications', { title: 'Notifications', notifications });
};


exports.getNotificationEditor = async (req, res) => {
    const { id } = req.params; // Este 'id' es el de la URL, el que se usa para buscar en la BD.

    try {
        const [rows] = await Notification.fetchById(id); // Buscas por este ID.

        if (!rows || rows.length === 0) {
            return res.status(404).send("Notificación no encontrada");
        }

        const notification = rows[0]; // Los datos de la BD.

        // Aquí estás pasando los datos. ¿Por qué el error?
        res.render('editNotifications', {
            id: notification.IDNotification, // ¿Es este el ID que quieres mostrar en el form?
            description: notification.description,
            category: notification.category,
            isActive: notification.isActive ? 'Sí' : 'No'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener datos de la notificación");
    }
};







