import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { PrismaClient } from "../../../generated/prisma/client";
import { renderVerificationEmail } from "./email/EmailTemplateRenderer";
import { SmtpEmailSender } from "./email/SmtpEmailSender";

export interface BetterAuthEnv {
  betterAuthSecret: string;
  betterAuthUrl: string;
  betterAuthTrustedOrigins: string[];
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  googleOauthClientId?: string;
  googleOauthClientSecret?: string;
}

export function createBetterAuth(prisma: PrismaClient, env: BetterAuthEnv) {
  const smtpSender = new SmtpEmailSender({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    user: env.smtpUser,
    pass: env.smtpPass,
    from: env.smtpFrom
  });

  const socialProviders =
    env.googleOauthClientId && env.googleOauthClientSecret
      ? {
          google: {
            clientId: env.googleOauthClientId,
            clientSecret: env.googleOauthClientSecret
          }
        }
      : undefined;

  return betterAuth({
    secret: env.betterAuthSecret,
    baseURL: env.betterAuthUrl,
    trustedOrigins: env.betterAuthTrustedOrigins,
    database: prismaAdapter(prisma, {
      provider: "postgresql"
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        const rendered = await renderVerificationEmail({
          appName: "AskMyNotes",
          userName: user.name,
          verificationUrl: url
        });

        await smtpSender.sendMail({
          to: user.email,
          subject: "Verify your AskMyNotes email",
          html: rendered.html,
          text: rendered.text
        });
      }
    },
    ...(socialProviders ? { socialProviders } : {})
  });
}

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>;
