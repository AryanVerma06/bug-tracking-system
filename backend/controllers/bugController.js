// controllers/bugController.js — Bug CRUD Operations
const Bug = require('../models/Bug');

// Create a new bug
exports.createBug = async (req, res) => {
  try {
    const { title, description, severity, assignedTo, module, environment, stepsToReproduce, expectedBehavior, actualBehavior } = req.body;

    const bug = new Bug({
      title,
      description,
      severity,
      assignedTo: assignedTo || 'Unassigned',
      reportedBy: req.user.id,
      reporterName: req.user.name,
      module: module || 'General',
      environment: environment || 'Development',
      stepsToReproduce: stepsToReproduce || '',
      expectedBehavior: expectedBehavior || '',
      actualBehavior: actualBehavior || '',
      status: 'Open'
    });

    await bug.save();
    res.status(201).json({ message: 'Bug reported successfully', bug });
  } catch (err) {
    res.status(500).json({ message: 'Error creating bug', error: err.message });
  }
};

// Get all bugs (with optional filters)
exports.getAllBugs = async (req, res) => {
  try {
    const { status, severity, module } = req.query;
    let filter = {};

    if (status && status !== 'All') filter.status = status;
    if (severity && severity !== 'All') filter.severity = severity;
    if (module && module !== 'All') filter.module = module;

    // If user is Developer, show only their assigned bugs
    if (req.user.role === 'Developer') {
      filter.$or = [
        { assignedTo: req.user.name },
        { reportedBy: req.user.id }
      ];
    }

    const bugs = await Bug.find(filter).sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bugs', error: err.message });
  }
};

// Get a single bug by ID
exports.getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id).populate('reportedBy', 'name email role');
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    res.json(bug);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bug', error: err.message });
  }
};

// Update bug status
exports.updateBug = async (req, res) => {
  try {
    const { status, severity, assignedTo } = req.body;
    const updateData = { updatedAt: Date.now() };

    if (status) updateData.status = status;
    if (severity) updateData.severity = severity;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const bug = await Bug.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.json({ message: 'Bug updated successfully', bug });
  } catch (err) {
    res.status(500).json({ message: 'Error updating bug', error: err.message });
  }
};

// Delete a bug (Admin only)
exports.deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    res.json({ message: 'Bug deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting bug', error: err.message });
  }
};

// Get bug statistics (for Dashboard)
exports.getStats = async (req, res) => {
  try {
    const total = await Bug.countDocuments();
    const open = await Bug.countDocuments({ status: 'Open' });
    const inProgress = await Bug.countDocuments({ status: 'In Progress' });
    const resolved = await Bug.countDocuments({ status: 'Resolved' });
    const closed = await Bug.countDocuments({ status: 'Closed' });
    const critical = await Bug.countDocuments({ severity: 'Critical' });
    const major = await Bug.countDocuments({ severity: 'Major' });
    const minor = await Bug.countDocuments({ severity: 'Minor' });

    res.json({
      total, open, inProgress, resolved, closed,
      critical, major, minor
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};
