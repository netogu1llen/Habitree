const { response } = require('express');
const Reward = require('../../models/Rewards/Rewards.model');

/**
 * Listar todas las recompensas
 */
exports.getRewards = async (req, res) => {
    try {
        const [rewards] = await Reward.fetchAll();
        res.render('Rewards/rewards', { 
            title: 'Rewards', 
            rewards, 
            csrfToken: req.csrfToken() 
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching rewards' });
    }
};

/** Registrar nueva recompensa
 */
exports.postRewards = async (req, res, next) => {
    try {
        const addReward = new Reward(
            req.body.IDReward,
            req.body.name,
            req.body.description,
            req.body.type,        // monetary / nonMonetary
            req.body.available,   // 0/1
            req.body.value        // número o código
        );

        await addReward.save();
        res.redirect('/rewards');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error saving reward' });
    }
};

/**
 * Obtener recompensa por ID
 */
exports.getRewardById = async (req, res) => {
    try {
        const reward = await Reward.fetchById(req.params.id);
        if (reward[0].length === 0) {
            return res.status(404).json({ error: 'Reward not found' });
        }
        res.json(reward[0][0]);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching reward' });
    }
};

/**
 * Editar recompensa existente
 */
exports.editReward = async (req, res) => {
    try {
        const id = req.params.id;
        const data = {
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            available: req.body.available,
            value: req.body.value
        };

        const result = await Reward.update(id, data);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Reward not found' });
        }
        res.json({ success: true, message: 'Reward updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating reward' });
    }
};

/**
 * Eliminar recompensa por ID
 */
exports.deleteReward = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Reward.deleteRewardById(id);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Reward not found' });
        }
        res.json({ success: true, message: 'Reward deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting reward' });
    }
};
