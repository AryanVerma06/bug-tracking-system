// routes/bugRoutes.js — Bug Management Routes
const express = require('express');
const router = express.Router();
const { createBug, getAllBugs, getBugById, updateBug, deleteBug, getStats } = require('../controllers/bugController');
const { auth, authorize } = require('../middleware/auth');

// All routes below require authentication
router.use(auth);

// GET /api/bugs/stats — Get bug statistics for dashboard
router.get('/stats', getStats);

// POST /api/bugs — Create a new bug report
router.post('/', createBug);

// GET /api/bugs — Get all bugs (with filters)
router.get('/', getAllBugs);

// GET /api/bugs/:id — Get a single bug by ID
router.get('/:id', getBugById);

// PUT /api/bugs/:id — Update bug status/details
router.put('/:id', updateBug);

// DELETE /api/bugs/:id — Delete a bug (Admin only)
router.delete('/:id', auth, authorize('Admin'), deleteBug);

module.exports = router;
