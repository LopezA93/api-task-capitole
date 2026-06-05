import "dotenv/config";
import mongoose from "mongoose";
import connectionMongoDB from "./src/config/db.js";
import User from "./src/models/User.js";

const seedAdmin = async () => {
  await connectionMongoDB();

  const name = "Admin";
  const email = "admin@capitole.com";
  const password = "admin123";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log(`Admin ya existe: ${email}`);
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`Admin creado: ${email} / ${password}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error("Seed falló:", err.message);
  process.exit(1);
});
