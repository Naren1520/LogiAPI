const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    method: { type: String, required: true },
    route: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null if public
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);
