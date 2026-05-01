const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, adminMiddleware, shipmentController.createShipment);
router.get('/', authMiddleware, shipmentController.getShipments);
router.get('/:trackingId', authMiddleware, shipmentController.getShipmentByTrackingId);

router.patch('/:trackingId/status', authMiddleware, adminMiddleware, shipmentController.updateStatus);
router.put('/:trackingId', authMiddleware, adminMiddleware, shipmentController.updateShipmentDetails);
router.delete('/:trackingId', authMiddleware, adminMiddleware, shipmentController.deleteShipment);

module.exports = router;
