import express from "express";
import characterRoutes from "./routes/characters.js";
import { loadCharacters } from "./utils/characters.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/characters", characterRoutes);

try {
  app.listen(port, () => {
    loadCharacters();
    console.log(`Server listening on port: ${port}`);
  });
} catch (error) {
  console.error("Failed to start the server:", error);
  process.exit(1);
}
