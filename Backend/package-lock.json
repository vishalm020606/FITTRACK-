const mongoose = require("mongoose");

const HealthSchema = new mongoose.Schema({
    userId: { type: String, required: true },

    height: Number,
    weight: Number,

    bmi: Number,
    calories: Number,
    protein: Number,

    diet: String,
    workout: String,

    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Health", HealthSchema);
