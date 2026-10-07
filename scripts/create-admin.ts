import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminUser } from "../src/models/AdminUser";

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!uri || !dbName) {
    console.error("Set MONGODB_URI and MONGODB_DB_NAME");
    process.exit(1);
  }
  if (!email || !password || password.length < 8) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars) for bootstrap only");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName });
  const hash = await bcrypt.hash(password, 12);
  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.passwordHash = hash;
    await existing.save();
    console.log("Admin password updated for", email);
  } else {
    await AdminUser.create({ email: email.toLowerCase(), passwordHash: hash });
    console.log("Admin created for", email);
  }
  console.log("Remove ADMIN_PASSWORD from shared environments after first login.");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
