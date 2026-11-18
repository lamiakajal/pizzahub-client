// Promotes an existing account to admin. Run it yourself on your own machine:
//   npm run seed:admin -- admin@example.com
// Admin access is never granted through public sign up.
import { MongoClient } from "mongodb";

const email = process.argv[2]?.trim().toLowerCase();
const uri = process.env.MONGODB_URI;

if (!email) {
  console.error("Usage: npm run seed:admin -- <email>");
  process.exit(1);
}

if (!uri) {
  console.error("MONGODB_URI is not set. Check your .env.local file.");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const users = client.db("pizzahub").collection("user");

  const result = await users.updateOne(
    { email },
    { $set: { role: "admin", isBlocked: false, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    console.error(`No account found for ${email}. Sign up first, then run this again.`);
    process.exitCode = 1;
  } else {
    console.log(`${email} is now an admin.`);
  }
} finally {
  await client.close();
}
