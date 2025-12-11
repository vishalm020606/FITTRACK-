const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Routine = require("../models/Routine");

/* ---------------- SAVE ROUTINE DATA ---------------- */
router.post("/save", auth, async(req, res) => {
    try {
        const {
            sleepHours,
            sleepMessage,
            routine,
            screenMinutes,
            screenMessage
        } = req.body;

        await Routine.create({
            userId: req.userId,
            sleepHours,
            sleepMessage,
            routine,
            screenMinutes,
            screenMessage
        });

        res.json({ message: "Routine data saved" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Routine save failed" });
    }
});

/* ---------------- GET LATEST ROUTINE DATA ---------------- */
router.get("/", auth, async(req, res) => {
    const latest = await Routine.findOne({ userId: req.userId }).sort({ date: -1 });
    res.json(latest);
});

module.exports = router;