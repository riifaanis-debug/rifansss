import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// Some verification crawlers only read the very beginning of <head>.
// Force the domain-verification meta to be the first tag inside <head>.
const DOMAIN_VERIFICATION_META =
  '<meta name="domain-verification" content="d0313daa0417c5da8b4c6846b8914d6b7b84bfa2e860117c2acc72b71dcbef2e">';

const domainVerificationMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  const response = (result as { response?: Response }).response ?? (result as unknown as Response);
  if (!(response instanceof Response)) return result;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return result;

  const html = await response.text();
  const headIndex = html.indexOf("<head>");
  if (headIndex === -1) {
    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  const withoutDuplicate = html.replace(
    /<meta name="domain-verification"[^>]*>/i,
    "",
  );
  const insertAt = withoutDuplicate.indexOf("<head>") + "<head>".length;
  const patched =
    withoutDuplicate.slice(0, insertAt) +
    DOMAIN_VERIFICATION_META +
    withoutDuplicate.slice(insertAt);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware, domainVerificationMiddleware],
}));
