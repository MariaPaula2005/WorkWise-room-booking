const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: 'public/images/' });

router.post('/post', upload.array('images', 5), workspaceController.createWorkspace);
router.get('/workspaces', workspaceController.getAllWorkspaces);

module.exports = router;
