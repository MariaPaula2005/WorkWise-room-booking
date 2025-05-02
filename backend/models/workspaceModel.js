const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    location: String,
    address: String,
    area: Number,
    capacity: String,
    smoking: String,
    parking: String,
    distanceToTransport: Number,
    images: [String]
});

const Workspace = mongoose.model('Workspaces', schema);

module.exports = Workspace;
