const requiredFields = ["id", "name", "realName", "universe"];
const fieldTypes = {
  id: "number",
  name: "string",
  realName: "string",
  universe: "string",
};

export function validateCharacter(req, res, next) {
  const character = req.body;

  if (!character || Object.keys(character).length === 0) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const charactersToValidate = Array.isArray(character)
    ? character
    : [character];
  const validationErrors = [];

  for (let i = 0; i < charactersToValidate.length; i++) {
    const char = charactersToValidate[i];
    const indexInfo = charactersToValidate.length > 1 ? ` at index ${i}` : "";

    const missingFields = requiredFields.filter((field) => !(field in char));
    if (missingFields.length > 0) {
      validationErrors.push({
        error: `Missing required fields${indexInfo}`,
        missingFields,
        requiredFields,
        received: Object.keys(char),
      });
      continue;
    }

    const typeErrors = [];
    for (const [field, value] of Object.entries(char)) {
      if (!(field in fieldTypes)) {
        typeErrors.push({
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
        typeErrors.push({
          field,
          expected: "number",
          received: actualType,
          value,
        });
      } else if (expectedType === "string" && actualType !== "string") {
        typeErrors.push({
          field,
          expected: "string",
          received: actualType,
          value,
        });
      }
    }

    if (typeErrors.length > 0) {
      validationErrors.push({
        error: `Type validation failed${indexInfo}`,
        details: typeErrors,
      });
    }
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      validationErrors,
    });
  }

  next();
}

export function validateCharacterUpdate(req, res, next) {
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

