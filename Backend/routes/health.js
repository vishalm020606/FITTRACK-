const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Health = require("../models/Health");

/* --- BMI CALCULATION --- */
router.post("/bmi", auth, (req, res) => {
    const { weight, height } = req.body;

    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.status(400).json({ error: "Invalid height or weight!" });
    }

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const calories = Math.round(weight * 30);
    const protein = Math.round(weight * 1.6);

    let diet = "";
    if (bmi < 18.5) diet = "Eat more calorie-dense foods, nuts, rice & dairy.";
    else if (bmi <= 24.9) diet = "Maintain a balanced diet with fruits, veggies & lean protein.";
    else diet = "Reduce fried foods, sugar, and high-fat snacks.";

    let workout = "";
    if (bmi < 18.5) workout = "Perform strength training 4x/week to gain muscle.";
    else if (bmi <= 24.9) workout = "Do light workouts: 20–30 mins walking or yoga.";
    else workout = "Do 30 mins cardio + 10 mins strength training daily.";

    res.json({ bmi, calories, protein, diet, workout });
});

/* --- SAVE HEALTH DATA --- */
router.post("/save", auth, async(req, res) => {
    const { height, weight, bmi, calories, protein, diet, workout } = req.body;

    if (!bmi || !calories || !protein || !diet || !workout) {
        return res.status(400).json({ error: "Missing health data" });
    }

    await Health.create({
        userId: req.userId,
        height,
        weight,
        bmi,
        calories,
        protein,
        diet,
        workout
    });

    res.json({ message: "Health data saved" });
});

/* --- GET LATEST HEALTH DATA --- */
router.get("/", auth, async(req, res) => {
    const latest = await Health.findOne({ userId: req.userId }).sort({ date: -1 });
    res.json(latest);
});

module.exports = router;