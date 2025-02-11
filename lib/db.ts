// import { neon, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
// import { eq } from "drizzle-orm";

// neonConfig.fetchConnectionCache = true;

// const sql = neon(process.env.POSTGRES_URL!);
// export const db = drizzle(sql);

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   walletAddress: text("wallet_address").notNull().unique(),
//   nickname: text("nickname"),
//   telegram: text("telegram"),
//   discord: text("discord"),
//   twitter: text("twitter"),
//   twitch: text("twitch"),
//   kick: text("kick"),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// // Function to initialize the database
// export async function initDatabase() {
//   console.log("Initializing database...");
//   try {
//     // Check if the table exists
//     const tableExists = await db
//       .select()
//       .from(users)
//       .limit(1)
//       .catch(() => null);

//     if (tableExists === null) {
//       console.log("Users table doesn't exist. Creating...");
//       await db.execute(sql`
//         CREATE TABLE IF NOT EXISTS users (
//           id SERIAL PRIMARY KEY,
//           wallet_address TEXT NOT NULL UNIQUE,
//           nickname TEXT,
//           telegram TEXT,
//           discord TEXT,
//           twitter TEXT,
//           twitch TEXT,
//           kick TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         )
//       `);
//       console.log("Users table created successfully");
//     } else {
//       console.log("Users table already exists");
//     }

//     console.log("Database initialized successfully");
//   } catch (error) {
//     console.error("Error initializing database:", error);
//     throw new Error(
//       `Failed to initialize database: ${
//         error instanceof Error ? error.message : String(error)
//       }`
//     );
//   }
// }

// export async function addUser(
//   walletAddress: string,
//   socials?: {
//     nickname?: string;
//     telegram?: string;
//     discord?: string;
//     twitter?: string;
//     twitch?: string;
//     kick?: string;
//   }
// ) {
//   console.log("Adding user:", walletAddress, socials);
//   try {
//     const result = await db
//       .insert(users)
//       .values({
//         walletAddress,
//         nickname: socials?.nickname || null,
//         telegram: socials?.telegram || null,
//         discord: socials?.discord || null,
//         twitter: socials?.twitter || null,
//         twitch: socials?.twitch || null,
//         kick: socials?.kick || null,
//       })
//       .returning();

//     if (result.length === 0) {
//       console.error("Failed to insert user");
//       throw new Error("Failed to insert user");
//     }
//     console.log("User added successfully:", result[0]);
//     return result[0];
//   } catch (error) {
//     console.error("Error adding user to database:", error);
//     if (error instanceof Error) {
//       if (
//         error.message.includes("duplicate key value violates unique constraint")
//       ) {
//         throw new Error("User with this wallet address already exists");
//       }
//     }
//     throw new Error(
//       `Failed to add user to database: ${
//         error instanceof Error ? error.message : String(error)
//       }`
//     );
//   }
// }

// export async function getUserByWalletAddress(walletAddress: string) {
//   console.log("Fetching user by wallet address:", walletAddress);
//   try {
//     const result = await db
//       .select()
//       .from(users)
//       .where(eq(users.walletAddress, walletAddress));
//     console.log("User fetch result:", result[0] || "User not found");
//     return result[0] || null;
//   } catch (error) {
//     console.error("Error fetching user from database:", error);
//     throw new Error(
//       `Failed to fetch user from database: ${
//         error instanceof Error ? error.message : String(error)
//       }`
//     );
//   }
// }

// export async function updateUser(
//   walletAddress: string,
//   data: {
//     nickname?: string;
//     telegram?: string;
//     discord?: string;
//     twitter?: string;
//     twitch?: string;
//     kick?: string;
//   }
// ) {
//   console.log("Updating user:", walletAddress, data);
//   try {
//     const result = await db
//       .update(users)
//       .set(data)
//       .where(eq(users.walletAddress, walletAddress))
//       .returning();

//     if (result.length === 0) {
//       throw new Error("User not found");
//     }
//     console.log("User updated successfully:", result[0]);
//     return result[0];
//   } catch (error) {
//     console.error("Error updating user in database:", error);
//     throw new Error(
//       `Failed to update user in database: ${
//         error instanceof Error ? error.message : String(error)
//       }`
//     );
//   }
// }
