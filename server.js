import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 8086;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server port: ${port}`));
  })
  .catch((err) => {
    console.error("Error conexión DB:", err);
    process.exit(1);
  });
