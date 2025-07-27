const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const userJSONFilePath = path.join(__dirname, "user.json");
const requiredFields = ["id", "name", "realName", "universe"];
const fieldTypes = {
  id: "number",
  name: "string",
  realName: "string",
  universe: "string",
};
let charactersData = { characters: [] };
let charactersList = [];

function hasAllRequiredFields(character) {
  return requiredFields.every((field) => field in character);
}

// Read what is inside of the user.json file
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

// Input validation middleware
function validateCharacter(req, res, next) {
  const character = req.body;
  if (!character || Object.keys(character).length === 0) {
    return res.status(400).json({ error: "Request body is required" });
  }
  if (Array.isArray(character)) {
    const invalidChars = character.filter(
      (char) => !hasAllRequiredFields(char)
    );
    if (invalidChars.length > 0) {
      return res.status(400).json({
        error: "Some characters are missing required fields",
        invalidCharacters: invalidChars,
        requiredFields,
      });
    }
  } else if (!hasAllRequiredFields(character)) {
    return res.status(400).json({
      error: "Missing required fields",
      requiredFields,
      received: Object.keys(character),
    });
  }
  next();
}

// Validation middleware for updates (doesn't require ID)
function validateCharacterUpdate(req, res, next) {
  const character = req.body;

  if (!character || Object.keys(character).length === 0) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const invalidFields = [];
  for (const [field, value] of Object.entries(character)) {
    if (!(field in fieldTypes)) {
      invalidFields.push({
        field,
        error: "Unexpected field",
      });
      continue;
    }

    const expectedType = fieldTypes[field];
    const actualType = typeof value;

    if (
      expectedType === "number" &&
      (isNaN(value) || actualType !== "number")
    ) {
      invalidFields.push({
        field,
        expected: "number",
        received: actualType,
        value,
      });
    } else if (expectedType === "string" && actualType !== "string") {
      invalidFields.push({
        field,
        expected: "string",
        received: actualType,
        value,
      });
    }
  }

  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      invalidFields,
    });
  }

  next();
}

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

app.post("/characters", validateCharacter, (req, res) => {
  try {
    const charactersToAdd = Array.isArray(req.body) ? req.body : [req.body];
    const addedCharacters = [];

    for (const character of charactersToAdd) {
      // Check for duplicate ID
      const duplicate = charactersList.some((char) => char.id === character.id);
      if (duplicate) {
        return res.status(409).json({
          error: `Character with id ${character.id} already exists`,
          characterId: character.id,
        });
      }
      charactersList.push(character);
      addedCharacters.push(character);
    }
    charactersData.characters = charactersList;
    fs.writeFileSync(userJSONFilePath, JSON.stringify(charactersData, null, 2));
    res.status(201).json(addedCharacters);
  } catch (error) {
    console.error("Error adding character:", error);
    res.status(500).json({ error: "Failed to add character" });
  }
});

app.delete("/characters/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const characterIndex = charactersList.findIndex((char) => char.id === id);

    if (characterIndex === -1) {
      res
        .status(404)
        .json({ error: `Could not find a character with the id : ${id}` });
    }
    const [deletedCharacter] = charactersList.splice(characterIndex, 1);

    charactersData.characters = charactersList;

    fs.writeFileSync(userJSONFilePath, JSON.stringify(charactersData, null, 2));

    res.status(200).json({
      message: `Character with id ${id} deleted successfully`,
      deletedCharacter,
    });
  } catch (error) {
    console.error("Error deleting character:", error);
    res.status(500).json({
      error: "Failed to delete character",
      details: error.message,
    });
  }
});

app.put("/characters/:id", validateCharacterUpdate, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const characterIndex = charactersList.findIndex((char) => char.id === id);

    if (characterIndex === -1) {
      return res.status(404).json({
        error: `Character with id ${id} not found`,
      });
    }

    const updatedCharacter = {
      ...charactersList[characterIndex],
      ...updatedData,
      id: id, // Ensure ID remains the same
    };

    charactersList[characterIndex] = updatedCharacter;
    charactersData.characters = charactersList;
    fs.writeFileSync(userJSONFilePath, JSON.stringify(charactersData, null, 2));

    res.status(200).json({
      message: `Character with id ${id} updated successfully`,
      updatedCharacter,
    });
  } catch (error) {
    console.error("Error updating character:", error);
    res.status(500).json({
      error: "Failed to update character",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("Listen to port: " + port);
});
