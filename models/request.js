const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    shopName: { type: String, required: true },
    productId: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
