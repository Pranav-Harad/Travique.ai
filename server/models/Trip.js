const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: String, // Clerk User ID
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    travelers: {
      type: Number,
      required: true,
      default: 1,
    },
    transportMode: {
      type: String,
      required: true,
      default: 'flight',
    },
    budget: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    interests: {
      type: String,
      required: true,
    },
    itinerary: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);