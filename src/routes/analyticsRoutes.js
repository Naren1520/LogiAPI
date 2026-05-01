const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalShipments = await Shipment.countDocuments();
        const delivered = await Shipment.countDocuments({ status: 'delivered' });
        const inTransit = await Shipment.countDocuments({ status: { $in: ['picked-up', 'in-transit', 'out-for-delivery'] } });

        const userObjectId = req.user._id;
        const userShipments = await Shipment.countDocuments({ userId: userObjectId });

        res.json({
            totalShipments,
            delivered,
            inTransit,
            userShipments
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
