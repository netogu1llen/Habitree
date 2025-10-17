const { response } = require('express');
const Indicator = require('../../models/indicators/indicators.model');

/**
 * Listar todos los indicadores
 */
exports.getIndicators = async (req, res) => {
    try {
        const indicators = await Indicator.fetchAll();
        res.render('indicators/indicators', { 
            title: 'Indicators', 
            indicators, 
            csrfToken: req.csrfToken() 
        });
    } catch (err) {
        console.error('Error fetching indicators:', err);
        res.render('indicators/indicators', { 
            title: 'Indicators', 
            indicators: [], 
            csrfToken: req.csrfToken() 
        });
    }
};