const Shipment = require('../models/Shipment');

// Initial seed shipments for first time initialization
const INITIAL_SAMPLE_SHIPMENTS = [
  {
    title: 'Commercial Consignment of 1121 XXL Basmati Rice & Indian Spices',
    fromLocation: 'Nhava Sheva Port (JNPT), Mumbai, India',
    toLocation: 'Jebel Ali Port, Dubai, United Arab Emirates',
    date: new Date('2026-11-20'),
    mediaLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: '2 x 40ft FCL containerized export with verified phytosanitary clearance, SGS inspection certificate, and vacuum barrier packaging.',
    status: 'In Transit',
    isActive: true,
    sortOrder: 1
  },
  {
    title: 'Luxury Hand-Hammered Copperware & Pure Mulberry Silk Stoles',
    fromLocation: 'Mundra Port, Gujarat, India',
    toLocation: 'Port of Rotterdam, Netherlands (European Gateway)',
    date: new Date('2026-11-15'),
    mediaLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Artisanal tabletop copper vessels and GI-certified silk textiles consigned to premium European lifestyle distributor.',
    status: 'Delivered',
    isActive: true,
    sortOrder: 2
  },
  {
    title: 'Alleppey Bold Green Cardamom (8mm+) & Salem High-Curcumin Turmeric',
    fromLocation: 'Cochin Port (ICTT Vallarpadam), Kerala, India',
    toLocation: 'Port of Hamburg, Germany',
    date: new Date('2026-11-28'),
    mediaLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Direct grower-sourced aroma-sealed consignments dispatched via temperature-regulated sea freight.',
    status: 'Scheduled',
    isActive: true,
    sortOrder: 3
  }
];

// Helper to auto-seed initial shipments if collection is empty
const ensureShipmentsSeeded = async () => {
  try {
    const count = await Shipment.countDocuments();
    if (count === 0) {
      await Shipment.insertMany(INITIAL_SAMPLE_SHIPMENTS);
      console.log('[AutoSeed] Seeded initial trade shipment journeys.');
    }
  } catch (err) {
    console.warn('[AutoSeed Warning] Shipments:', err.message);
  }
};

// @desc    Get all active shipments (sorted upside / newest date first)
// @route   GET /api/shipments
// @access  Public
const getShipments = async (req, res) => {
  try {
    await ensureShipmentsSeeded();

    const { status, search } = req.query;
    const filter = {};

    // Allow filtering by status if provided (and not 'ALL')
    if (status && status !== 'ALL') {
      filter.status = status;
    }

    // Keyword search over title, fromLocation, toLocation
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { fromLocation: { $regex: q, $options: 'i' } },
        { toLocation: { $regex: q, $options: 'i' } }
      ];
    }

    // Sequence on date upside (descending: newest date first)
    const shipments = await Shipment.find(filter).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shipments.length,
      shipments
    });
  } catch (error) {
    console.error('[Shipments API Error]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve shipments',
      error: error.message
    });
  }
};

// @desc    Get single shipment by ID
// @route   GET /api/shipments/:id
// @access  Public
const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      shipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve shipment details',
      error: error.message
    });
  }
};

// @desc    Create a new shipment journey
// @route   POST /api/shipments
// @access  Private (Admin only)
const createShipment = async (req, res) => {
  try {
    const { fromLocation, toLocation, date, mediaLink, title, description, status } = req.body;

    if (!fromLocation || !toLocation || !date || !mediaLink) {
      return res.status(400).json({
        success: false,
        message: 'Please provide From Location, Destination Location, Date, and Media Link.'
      });
    }

    const newShipment = await Shipment.create({
      title: title && title.trim() ? title.trim() : `${fromLocation.trim()} → ${toLocation.trim()} Consignment`,
      fromLocation: fromLocation.trim(),
      toLocation: toLocation.trim(),
      date: new Date(date),
      mediaLink: mediaLink.trim(),
      description: description ? description.trim() : '',
      status: status || 'In Transit'
    });

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      shipment: newShipment
    });
  } catch (error) {
    console.error('[Create Shipment Error]', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create shipment'
    });
  }
};

// @desc    Update an existing shipment
// @route   PUT /api/shipments/:id
// @access  Private (Admin only)
const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const { fromLocation, toLocation, date, mediaLink, title, description, status, isActive } = req.body;

    if (fromLocation !== undefined) shipment.fromLocation = fromLocation.trim();
    if (toLocation !== undefined) shipment.toLocation = toLocation.trim();
    if (date !== undefined) shipment.date = new Date(date);
    if (mediaLink !== undefined) shipment.mediaLink = mediaLink.trim();
    if (title !== undefined) shipment.title = title.trim();
    if (description !== undefined) shipment.description = description.trim();
    if (status !== undefined) shipment.status = status;
    if (isActive !== undefined) shipment.isActive = isActive;

    await shipment.save();

    res.status(200).json({
      success: true,
      message: 'Shipment updated successfully',
      shipment
    });
  } catch (error) {
    console.error('[Update Shipment Error]', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update shipment'
    });
  }
};

// @desc    Delete a shipment
// @route   DELETE /api/shipments/:id
// @access  Private (Admin only)
const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    await Shipment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    console.error('[Delete Shipment Error]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shipment',
      error: error.message
    });
  }
};

module.exports = {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment
};
