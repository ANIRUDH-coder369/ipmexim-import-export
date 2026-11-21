const express = require('express');
const router = express.Router();
const {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment
} = require('../controllers/shipmentController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getShipments);
router.get('/:id', getShipmentById);

// Admin-protected CRUD endpoints
router.post('/', protectAdmin, createShipment);
router.put('/:id', protectAdmin, updateShipment);
router.patch('/:id', protectAdmin, updateShipment);
router.delete('/:id', protectAdmin, deleteShipment);

module.exports = router;
