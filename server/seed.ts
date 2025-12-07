import bcrypt from "bcrypt";
import { db } from "./db";
import { brokers } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  
  try {
    await db.insert(brokers).values({
      name: "Admin User",
      email: "admin@clearbroker.com",
      password: adminPassword,
      companyName: "ClearBroker Admin",
      isAdmin: true,
    }).onConflictDoNothing();
    
    console.log("Admin user created: admin@clearbroker.com / admin123");
  } catch (error) {
    console.log("Admin user may already exist");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
