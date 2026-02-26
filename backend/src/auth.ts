import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { createBetterAuth } from "./services/auth/auth";

dotenv.config();

const env = {
    databaseUrl: process.env.DATABASE_URL!,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET!,
    betterAuthUrl: process.env.BETTER_AUTH_URL!,
    betterAuthTrustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    smtpHost: process.env.SMTP_HOST ?? "smtp.gmail.com",
    smtpPort: Number(process.env.SMTP_PORT ?? "587"),
    smtpSecure: (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true",
    smtpUser: process.env.SMTP_USER ?? "",
    smtpPass: process.env.SMTP_PASS ?? "",
    smtpFrom: process.env.SMTP_FROM ?? "AskMyNotes <no-reply@askmynotes.local>",
    googleOauthClientId: process.env.GOOGLE_CLIENT_ID,
    googleOauthClientSecret: process.env.GOOGLE_CLIENT_SECRET
};

const adapter = new PrismaPg({ connectionString: env.databaseUrl });
const prisma = new PrismaClient({ adapter });

export const auth = createBetterAuth(prisma, env);
