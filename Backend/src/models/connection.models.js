const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  // The person who initiated or owns the connection
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // The person they are connected to
  connectedWith: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  roomID: { type: String }, 
  status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'accepted' },
  connectedAt: { type: Date, default: Date.now }
});

// Create an index so looking up connections is blazing fast
ConnectionSchema.index({ user: 1, connectedWith: 1 }, { unique: true });

module.exports = mongoose.model('Connection', ConnectionSchema);