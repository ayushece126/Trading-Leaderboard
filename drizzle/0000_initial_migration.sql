CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  nickname TEXT,
  telegram TEXT,
  discord TEXT,
  twitter TEXT,
  twitch TEXT,
  kick TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

