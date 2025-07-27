const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const userJSONFilePath = path.join(__dirname, "user.json");
let charactersData;

try {
  const fileContent = fs.readFileSync(userJSONFilePath, "utf-8");
  charactersData = JSON.parse(fileContent);
} catch (error) {
  console.error("Error loading characters data:", error);
}

// GET /characters ==> Get all characters
// POST /characters ==> Create a new character
// GET /characters/:id ==> Get a character by ID
// PUT /characters/:id ==> Update a character by ID
// DELETE /characters/:id ==> Delete a character by ID

app.use(express.json());

app.get("/characters", (req, res) => {
  if (charactersData) {
    res.json(charactersData);
  }
});

app.get("/characters/:id", (req, res) => {
  fs.readFile(userJSONFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: `Error reading ${userJSONFilePath} file` });
    }
    try {
      const characters = JSON.parse(data).characters;
      const id = parseInt(req.params.id);
      isFound = false;
      for (const character of characters) {
        if (character.id === id) {
          res.json(character);
          isFound = true;
        }
      }
      if (!isFound) {
        res
          .status(400)
          .json({ error: `Could not find the character with the id: ${id}` });
      }
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
