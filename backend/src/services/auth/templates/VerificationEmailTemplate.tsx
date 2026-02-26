import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components";

export interface VerificationEmailTemplateProps {
  appName: string;
  userName: string;
  verificationUrl: string;
}

export function VerificationEmailTemplate(props: VerificationEmailTemplateProps): React.JSX.Element {
  const { appName, userName, verificationUrl } = props;

  return (
    <Html>
      <Head />
      <Preview>Verify your email for {appName}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}>
        <Container
          style={{
            margin: "32px auto",
            padding: "24px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            maxWidth: "560px"
          }}
        >
          <Heading style={{ marginTop: 0 }}>Verify Your Email</Heading>
          <Text>Hello {userName},</Text>
          <Text>
            Please verify your email address to activate your {appName} account and continue using AskMyNotes.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button
              href={verificationUrl}
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "6px",
                color: "#ffffff",
                padding: "12px 18px",
                textDecoration: "none"
              }}
            >
              Verify Email
            </Button>
          </Section>
          <Text style={{ color: "#64748b", fontSize: "13px" }}>
            If you did not create this account, you can ignore this email.
          </Text>
          <Hr />
          <Text style={{ color: "#94a3b8", fontSize: "12px" }}>{appName}</Text>
        </Container>
      </Body>
    </Html>
  );
}
