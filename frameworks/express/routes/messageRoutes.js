const express = require('express');
const MessageController = require('../../../adapters/controllers/MessageController');

const router = express.Router();
const messageController = new MessageController();

router.post('/process-message', (req, res) => messageController.processMessage(req, res));
router.get('/patients', (req, res) => messageController.getAllPatients(req, res));

module.exports = router;