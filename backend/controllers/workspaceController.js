const Workspace = require('../models/workspaceModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

async function createWorkspace(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const imageUrls = req.files.map(file => '/images/' + file.filename);

        const data = new Workspace({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location,
            address: req.body.address,
            area: req.body.area,
            capacity: req.body.capacity,
            smoking: req.body.smoking,
            parking: req.body.parking,
            distanceToTransport: req.body.distanceToTransport,
            images: imageUrls
        });

        const savedData = await data.save();
        console.log('Data saved:', savedData);

        const baseUrl = 'http://localhost:8000';
        const fullImageUrls = imageUrls.map(imageUrl => baseUrl + imageUrl);

        res.status(201).json({ savedData, fullImageUrls });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Error saving data' });
    }
}

const getAllWorkspaces = async (req, res) => {
    try {
        console.log('Fetching workspaces...');
        const workspaces = await Workspace.find();
        console.log('Workspaces:', workspaces);
        res.json(workspaces);
    } catch (err) {
        console.error('Error fetching workspaces:', err.message);
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createWorkspace,
    getAllWorkspaces
};
