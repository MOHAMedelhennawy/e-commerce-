import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";

export default async function globalSetup() {
  const env = dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

  execSync("npx prisma migrate deploy", {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env, ...env.parsed },
  });
}