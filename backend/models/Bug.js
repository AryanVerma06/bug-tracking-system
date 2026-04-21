// models/Bug.js — MongoDB Bug Schema
const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bug title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Bug description is required']
  },
  severity: {
    type: String,
    enum: ['Critical', 'Major', 'Minor'],
    required: [true, 'Severity is required']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: {
    type: String,
    default: 'Unassigned'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporterName: {
    type: String
  },
  module: {
    type: String,
    default: 'General'
  },
  environment: {
    type: String,
    enum: ['Development', 'Staging', 'Production', 'UAT'],
    default: 'Development'
  },
  stepsToReproduce: {
    type: String,
    default: ''
  },
  expectedBehavior: {
    type: String,
    default: ''
  },
  actualBehavior: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update the updatedAt field on save
BugSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bug', BugSchema);
