import express from "express";
import {
  getCharacters,
  getCharacterById,
  addCharacters,
  deleteCharacterById,
  updateCharacterById,
} from "../utils/characters.js";
import {
  validateCharacter,
  validateCharacterUpdate,
} from "../middleware/validation.js";

const router = express.Router();

router.get("/", (req, res) => {
  const characters = getCharacters();
  if (characters) {
    res.json(characters);
  }
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const character = getCharacterById(id);
  if (character) {
    res.json(character);
  } else {
    res.status(404).json({ error: `Could not find character with id: ${id}` });
  }
});

router.post("/", validateCharacter, (req, res) => {
  try {
    const charactersToAdd = Array.isArray(req.body) ? req.body : [req.body];
    const addedCharacters = addCharacters(charactersToAdd);
    res.status(201).json(addedCharacters);
  } catch (error) {
    if (error.status === 409) {
      return res
        .status(409)
        .json({ error: error.message, characterId: req.body.id });
    }
    console.error("Error adding character:", error);
    res.status(500).json({ error: "Failed to add character" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedCharacter = deleteCharacterById(id);

    if (!deletedCharacter) {
      return res
        .status(404)
        .json({ error: `Could not find a character with the id : ${id}` });
    }

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

router.put("/:id", validateCharacterUpdate, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const updatedCharacter = updateCharacterById(id, updatedData);

    if (!updatedCharacter) {
      return res.status(404).json({
        error: `Character with id ${id} not found`,
      });
    }

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

export default router;
