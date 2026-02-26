import React from "react";
import { render } from "@react-email/render";
import {
  VerificationEmailTemplate,
  type VerificationEmailTemplateProps
} from "../templates/VerificationEmailTemplate";

export interface RenderedEmail {
  html: string;
  text: string;
}

export async function renderVerificationEmail(
  props: VerificationEmailTemplateProps
): Promise<RenderedEmail> {
  const element = React.createElement(VerificationEmailTemplate, props);

  const html = await render(element);
  const text = await render(element, { plainText: true });

  return { html, text };
}
