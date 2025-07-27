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
  const id = parseInt(req.params.id);
  const charactersList = charactersData.characters;
  let found = false;
  for (const character of charactersList) {
    if (character.id === id) {
      found = true;
      res.json(character);
    }
  }
  if (!found) {
    res.status(400).json({ error: `Could not find character with id: ${id}` });
  }
});

app.listen(port, () => {
  console.log("Listen to port: " + port);
});
