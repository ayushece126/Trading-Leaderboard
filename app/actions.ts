"use server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addUserToDatabase(walletAddress: string) {
  try {
    const [user] = await db.insert(users).values({ walletAddress }).returning();

    return { success: true, user };
  } catch (error) {
    console.error("Error adding user to database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getUserData(walletAddress: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);
    console.log(user);
    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateUserSocials(
  nickname: string,
  walletAddress: string,
  socials: {
    telegram: string;
    discord: string;
    twitter: string;
    twitch: string;
    kick: string;
  }
) {
  try {
    const [user] = await db
      .insert(users)
      .values({
        walletAddress,
        nickname,
        ...socials,
      })
      .onConflictDoUpdate({
        target: users.walletAddress,
        set: {
          nickname,
          ...socials,
        },
      })
      .returning();

    return { success: true, user };
  } catch (error) {
    console.error("Error updating user socials:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
