const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Models
const Health = require("../models/Health");
const Routine = require("../models/Routine");

router.get("/", auth, async(req, res) => {
    try {
        // Fetch latest entries
        const health = await Health.findOne({ userId: req.userId }).sort({ date: -1 });
        const routine = await Routine.findOne({ userId: req.userId }).sort({ date: -1 });

        if (!health || !routine) {
            return res.json({ error: "Dashboard needs health and routine data." });
        }

        /* ------------------ ENERGY SCORE LOGIC ------------------ */
        let energy = 0;

        // Sleep calculation
        if (routine.sleepHours >= 7) energy += 40;
        else if (routine.sleepHours >= 6) energy += 25;
        else energy += 10;

        // Screen time calculation (comes from Routine model)
        if (routine.screenMinutes <= 120) energy += 40;
        else if (routine.screenMinutes <= 180) energy += 25;
        else energy += 10;

        // BMI calculation
        if (health.bmi <= 24.9) energy += 20;
        else energy += 10;

        if (energy > 100) energy = 100;
        let insights = [];

        if (routine.sleepHours < 6) {
            insights.push("😴 Try to sleep at least 7 hours for better recovery.");
        }

        if (routine.screenMinutes > 180) {
            insights.push("📱 High screen time — reduce usage to avoid fatigue.");
        }

        if (health.bmi > 25) {
            insights.push("⚖️ Focus on reducing calories and adding light workouts.");
        }

        if (insights.length === 0) {
            insights.push("✨ You are maintaining a good balance! Keep it up.");
        }
        res.json({
            // Health
            bmi: health.bmi,
            calories: health.calories,
            protein: health.protein,
            diet: health.diet,
            workout: health.workout,

            // Routine
            sleepHours: routine.sleepHours,
            sleepMessage: routine.sleepMessage,
            routinePlan: routine.routine,

            // Screen
            screenMinutes: routine.screenMinutes,
            screenMessage: routine.screenMessage,

            // Score
            energyScore: energy,

            // Insights added
            insights
        });


    } catch (err) {
        console.log(err);
        res.json({ error: "Dashboard error occurred" });
    }
});

module.exports = router;