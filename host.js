const express = require('express');
const app = express();
const path = require("path");

app.use('/', (req, resp, next) => {
    console.log("Received request:", req.url);
    next();
});

app.get('/', (req, resp) => resp.redirect("index.html"));
app.get('/require.js', (req, resp) => resp.sendFile(path.join(__dirname, "node_modules", "requirejs", "require.js")));

app.use('/', express.static('./web'));
app.use('/src', express.static('./src'));

app.use('/', (req, resp) => console.log("Failed url:", req.url));

console.log("listening at localhost:8080");
app.listen(8080);