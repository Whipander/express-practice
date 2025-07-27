try {
  const express = require("express");
  const characterRoutes = require("./routes/characters");
  const { loadCharacters } = require("./utils/characters");

  const app = express();
  const port = 3000;

  app.use(express.json());

  app.use("/characters", characterRoutes);

  app.listen(port, () => {
    loadCharacters();
    console.log(`Server listening on port: ${port}`);
  });
} catch (error) {
  console.error("Failed to start the server:", error);
  process.exit(1);
}
