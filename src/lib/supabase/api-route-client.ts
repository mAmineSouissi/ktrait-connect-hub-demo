import { createServerClient } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Create Supabase client for Next.js Pages API routes
 * This handles cookies from the request/response objects
 */
export function createApiRouteClient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieStore = {
    getAll() {
      // Get cookies from request
      const cookies: { name: string; value: string }[] = [];
      if (req.cookies) {
        Object.entries(req.cookies).forEach(([name, value]) => {
          cookies.push({ name, value: value || "" });
        });
      }
      return cookies;
    },
    setAll(
      cookiesToSet: Array<{ name: string; value: string; options?: any }>
    ) {
      // Set cookies in response
      cookiesToSet.forEach(({ name, value, options }) => {
        const cookieParts = [`${name}=${value}`];

        if (options?.path) cookieParts.push(`Path=${options.path}`);
        if (options?.maxAge) cookieParts.push(`Max-Age=${options.maxAge}`);
        if (options?.httpOnly) cookieParts.push("HttpOnly");
        if (options?.secure) cookieParts.push("Secure");
        if (options?.sameSite) cookieParts.push(`SameSite=${options.sameSite}`);
        if (options?.domain) cookieParts.push(`Domain=${options.domain}`);

        res.setHeader("Set-Cookie", cookieParts.join("; "));
      });
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieStore,
    }
  );
}
