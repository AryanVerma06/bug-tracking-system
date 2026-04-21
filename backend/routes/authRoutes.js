// routes/authRoutes.js — Authentication Routes
const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');

// POST /api/auth/register — Register a new user
router.post('/register', register);

// POST /api/auth/login — Login and get JWT token
router.post('/login', login);

// GET /api/auth/profile — Get current user profile (protected)
router.get('/profile', auth, getProfile);

// GET /api/auth/users — Get all users (Admin only)
router.get('/users', auth, authorize('Admin'), getAllUsers);

module.exports = router;
