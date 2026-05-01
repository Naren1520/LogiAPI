const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    status: { type: String, enum: ['created', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'failed'], default: 'created' },
    history: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        location: { lat: Number, lng: Number },
        message: String
    }],
    estimatedDelivery: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Shipment', ShipmentSchema);
