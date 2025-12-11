const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {

    let token = req.headers["authorization"];
    console.log("TOKEN RECEIVED:", token);

    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    if (!token) {
        console.log("NO TOKEN FOUND");
        return res.json({ error: "No token" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET123");
        console.log("DECODED USER:", decoded);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err);
        return res.json({ error: "Invalid token" });
    }
};
