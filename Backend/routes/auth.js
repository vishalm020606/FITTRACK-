const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// ---------------- SIGNUP ---------------- //
router.post("/signup", async(req, res) => {
    try {
        const { fullname, email, username, password } = req.body;

        // Check if user exists
        const exists = await User.findOne({ username });
        if (exists) return res.json({ error: "Username already taken" });

        // Hash password
        const hashedPass = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({
            fullname,
            email,
            username,
            password: hashedPass
        });

        await newUser.save();

        res.json({ message: "Signup Successful" });

    } catch (err) {
        console.log(err);
        res.json({ error: "Signup Failed" });
    }
});

// ---------------- LOGIN ---------------- //
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ error: "Wrong password" });

        // Create token
        const token = jwt.sign({ id: user._id }, "SECRET123", {
            expiresIn: "7d"
        });

        res.json({ message: "Login Success", token });

    } catch (err) {
        console.log(err);
        res.json({ error: "Login Failed" });
    }
});

module.exports = router;