const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const userJSONFilePath = path.join(__dirname, "user.json");
const requiredFields = ["id", "name", "realName", "universe"];
let charactersData = { characters: [] };
let charactersList = [];

function hasAllRequiredFields(character) {
  for (const field of requiredFields) {
    if (!(field in character)) {
      return false;
    }
  }
  return true;
}

try {
  if (fs.existsSync(userJSONFilePath)) {
    const fileContent = fs.readFileSync(userJSONFilePath, "utf-8");
    const parsedData = JSON.parse(fileContent);

    if (parsedData && Array.isArray(parsedData.characters)) {
      charactersData = parsedData;
      charactersList = [...parsedData.characters];
      console.log("Successfully loaded characters data");
    } else {
      console.warn(
        "Invalid data structure in user.json. Using default empty data."
      );
    }
  } else {
    console.log("No existing user.json found. Starting with empty data.");
    fs.writeFileSync(userJSONFilePath, JSON.stringify(charactersData, null, 2));
  }
} catch (error) {
  console.error("Error loading characters data:", error);
  charactersData = { characters: [] };
  charactersList = [];
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

app.post("/characters", (req, res) => {
  try {
    const charactersToAdd = Array.isArray(req.body) ? req.body : [req.body];
    let invalidCharacters = [];
    if (charactersToAdd !== null) {
      for (const character of charactersToAdd) {
        if (hasAllRequiredFields(character)) charactersList.push(character);
        else {
          invalidCharacters.push(character);
        }
      }
    } else {
      res.status(400).json({ error: "Characters not provided" });
    }

    if (invalidCharacters.length > 0) {
      return res.status(400).json({
        error: "Some characters are missing required fields",
        invalidCharacters,
      });
    }

    charactersData.characters = charactersList;

    fs.writeFileSync(userJSONFilePath, JSON.stringify(charactersData));
    res.status(201).json(charactersToAdd);
  } catch (error) {
    console.error("Error adding character:", error);
    res.status(500).json({ error: "Failed to add character" });
  }
});

app.listen(port, () => {
  console.log("Listen to port: " + port);
});
