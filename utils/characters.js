const fs = require("fs");
const path = require("path");

const userJSONFilePath = path.join(__dirname, "user.json");

let charactersData = { characters: [] };
let charactersList = [];

// Read what is inside of the user.json file
const loadCharacters = () => {
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
      fs.writeFileSync(
        userJSONFilePath,
        JSON.stringify(charactersData, null, 2)
      );
    }
  } catch (error) {
    console.error("Error loading characters data:", error);
    charactersData = { characters: [] };
    charactersList = [];
  }
};

const saveCharacters = () => {
  try {
    charactersData.characters = charactersList;
    fs.writeFileSync(userJSONFilePath, JSON.stringify(charactersData, null, 2));
  } catch (error) {
    console.error("Error saving characters data:", error);
  }
};

const getCharacters = () => charactersData;

const getCharacterById = (id) => {
  return charactersList.find((character) => character.id === id);
};

const addCharacters = (charactersToAdd) => {
  const addedCharacters = [];
  for (const character of charactersToAdd) {
    const duplicate = charactersList.some((char) => char.id === character.id);
    if (duplicate) {
      const error = new Error(`Character with id ${character.id} already exists`);
      error.status = 409;
      throw error;
    }
    charactersList.push(character);
    addedCharacters.push(character);
  }
  saveCharacters();
  return addedCharacters;
};

const deleteCharacterById = (id) => {
  const characterIndex = charactersList.findIndex((char) => char.id === id);
  if (characterIndex === -1) {
    return null;
  }
  const [deletedCharacter] = charactersList.splice(characterIndex, 1);
  saveCharacters();
  return deletedCharacter;
};

const updateCharacterById = (id, updatedData) => {
  const characterIndex = charactersList.findIndex((char) => char.id === id);
  if (characterIndex === -1) {
    return null;
  }

  const updatedCharacter = {
    ...charactersList[characterIndex],
    ...updatedData,
    id: id,
  };

  charactersList[characterIndex] = updatedCharacter;
  saveCharacters();
  return updatedCharacter;
};

module.exports = {
  loadCharacters,
  getCharacters,
  getCharacterById,
  addCharacters,
  deleteCharacterById,
  updateCharacterById,
};
