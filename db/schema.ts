import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  nickname: text("nickname"),
  telegram: text("telegram"),
  discord: text("discord"),
  twitter: text("twitter"),
  twitch: text("twitch"),
  kick: text("kick"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Function to initialize the database
