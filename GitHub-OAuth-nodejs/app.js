const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/auth", (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=da7ff8b08525ef4711d2`);
});

app.get("/callback", async (req, res) => {
    try {
        // ... (rest of your code for handling OAuth)
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
