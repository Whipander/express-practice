const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

const userJSONFilePath = path.join(__dirname, "user.json");

app.get("/characters", (req, res) => {
  fs.readFile(userJSONFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: `Error reading ${userJSONFilePath} file` });
    }
    try {
      const characters = JSON.parse(data);
      res.json(characters);
    } catch (parsErr) {
      res
        .status(500)
        .json({ error: `Error parsing ${userJSONFilePath} file ` });
    }
  });
});

app.listen(port, () => {
  console.log("Listen to port: " + port);
});
