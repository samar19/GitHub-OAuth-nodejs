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

app.get("/callback", (req, res) => {
    const code = req.query.code;
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;

    axios.post("https://github.com/login/oauth/access_token", {
        client_id: clientId,
        client_secret: clientSecret,
        code: code
    }, {
        headers: {
            Accept: "application/json"
        }
    }).then((result) => {
        const accessToken = result.data.access_token;
        // Use the access token to make authenticated requests to GitHub APIs
        axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`
            }
        }).then((response) => {
            const userData = response.data;
            res.send(`Welcome, ${userData.login}!`);
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Error fetching user data from GitHub");
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Error exchanging code for access token");
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
