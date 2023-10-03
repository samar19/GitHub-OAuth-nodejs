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
        const code = req.query.code;
        const clientId = "da7ff8b08525ef4711d2";
        const clientSecret = "184a03f0e529a5bdb1b7ba92db1771d6b312f2c0";

        const result = await axios.post("https://github.com/login/oauth/access_token", {
            client_id: clientId,
            client_secret: clientSecret,
            code: code
        }, {
            headers: {
                Accept: "application/json"
            }
        });

        const accessToken = result.data.access_token;

        const response = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`
            }
        });

        const userData = response.data;
        res.send(`Welcome, ${userData.login}!`);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
