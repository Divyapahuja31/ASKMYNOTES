import type { BetterAuthEnv } from "../services/auth/auth";

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a number.`);
  }
  return value;
}

function readBooleanEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  return raw.toLowerCase() === "true";
}

function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    return undefined;
  }
  return value;
}

export interface AuthBootstrapEnv extends BetterAuthEnv {
  databaseUrl: string;
}

export function loadAuthEnv(): AuthBootstrapEnv {
  return {
    databaseUrl: readEnv("DATABASE_URL"),
    betterAuthSecret: readEnv("BETTER_AUTH_SECRET"),
    betterAuthUrl: readEnv("BETTER_AUTH_URL"),
    betterAuthTrustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0),
    smtpHost: readEnv("SMTP_HOST"),
    smtpPort: readNumberEnv("SMTP_PORT", 587),
    smtpSecure: readBooleanEnv("SMTP_SECURE", false),
    smtpUser: readEnv("SMTP_USER"),
    smtpPass: readEnv("SMTP_PASS"),
    smtpFrom: readEnv("SMTP_FROM"),
    googleOauthClientId: readOptionalEnv("GOOGLE_CLIENT_ID"),
    googleOauthClientSecret: readOptionalEnv("GOOGLE_CLIENT_SECRET")
  };
}
