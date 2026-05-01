const Shipment = require('../models/Shipment');
const User = require('../models/User');
const redisClient = require('../cache/redisClient');
const { getIo } = require('../sockets/socket');
const crypto = require('crypto');
const notificationService = require('../services/notificationService');
const { isValidTransition } = require('../config/statusEngine');

exports.createShipment = async (req, res) => {
    try {
        const { sender, receiver } = req.body;
        const trackingId = 'TRK' + crypto.randomBytes(4).toString('hex').toUpperCase();

        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

        const shipment = new Shipment({
            trackingId, sender, receiver,
            userId: req.user._id,
            estimatedDelivery,
            history: [{ status: 'created', message: 'Shipment created' }]
        });

        await shipment.save();
        res.status(201).json(shipment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getShipments = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10, sort = 'desc' } = req.query;
        let query = {};

        if (req.user.role !== 'admin') {
            query.userId = req.user._id;
        }

        if (status) query.status = status;
        if (search) query.$or = [{ sender: new RegExp(search, 'i') }, { receiver: new RegExp(search, 'i') }];

        const shipments = await Shipment.find(query)
            .sort({ createdAt: sort === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json(shipments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getShipmentByTrackingId = async (req, res) => {
    try {
        const { trackingId } = req.params;

        // Check Redis Cache
        const cachedShipment = await redisClient.get(`shipment:${trackingId}`);
        if (cachedShipment) {
            return res.json(JSON.parse(cachedShipment));
        }

        const shipment = await Shipment.findOne({ trackingId });
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

        // Set Cache
        await redisClient.setEx(`shipment:${trackingId}`, 3600, JSON.stringify(shipment));

        res.json(shipment);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { trackingId } = req.params;
        const { status, location, message = '' } = req.body;

        const shipment = await Shipment.findOne({ trackingId });
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

        if (!isValidTransition(shipment.status, status)) {
            return res.status(400).json({ error: `Invalid transition from ${shipment.status} to ${status}` });
        }

        shipment.status = status;
        const newHistoryEntry = { status, timestamp: new Date(), message };
        if (location) newHistoryEntry.location = location;
        shipment.history.push(newHistoryEntry);
        
        await shipment.save();

        await redisClient.del(`shipment:${trackingId}`); // Invalidate Cache

        const io = getIo();
        io.to(trackingId).emit('statusUpdate', shipment); // Real-time Update

        const user = await User.findById(shipment.userId);
        if (user) {
            notificationService.notifyUser(user, shipment); // Triggers Webhook, SMS, Email
        }

        res.json(shipment);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateShipmentDetails = async (req, res) => {
    try {
        const { trackingId } = req.params;
        const { sender, receiver } = req.body;
        
        const shipment = await Shipment.findOneAndUpdate(
            { trackingId },
            { sender, receiver },
            { new: true }
        );

        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        
        await redisClient.del(`shipment:${trackingId}`); // Invalidate Cache

        res.json(shipment);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteShipment = async (req, res) => {
    try {
        const { trackingId } = req.params;
        const shipment = await Shipment.findOneAndDelete({ trackingId });
        
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

        await redisClient.del(`shipment:${trackingId}`); // Invalidate Cache

        res.json({ msg: 'Shipment deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
