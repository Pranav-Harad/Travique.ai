const Trip = require("../models/Trip");
const { generateItinerary } = require("../services/aiService");

// CREATE TRIP
exports.createTrip = async (req, res) => {
  try {
    const itinerary = await generateItinerary(req.body);

    const trip = await Trip.create({
      ...req.body,
      user: req.auth.userId, // From Clerk middleware
      itinerary,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER TRIPS
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.auth.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE TRIP
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.auth.userId
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found or unauthorized" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};