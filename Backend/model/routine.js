const mongoose = require("mongoose");

const RoutineSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sleepHours: {
        type: Number,
        required: true
    },

    sleepMessage: {
        type: String,
        default: ""
    },

    // FIXED — routine must be ARRAY, not STRING
    routine: {
        type: Array,
        default: []
    },

    screenMinutes: {
        type: Number,
        default: 0
    },

    screenMessage: {
        type: String,
        default: ""
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports =
    mongoose.models.Routine || mongoose.model("Routine", RoutineSchema);
