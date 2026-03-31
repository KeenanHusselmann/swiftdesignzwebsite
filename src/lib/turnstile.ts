const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v1/siteverify";

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Returns true if the challenge was solved, false otherwise.
 */
export async function verifyTurnstile(token: unknown): Promise<{ success: boolean; errorCodes: string[] }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not set");
    return { success: false, errorCodes: ["secret-missing"] };
  }
  if (typeof token !== "string" || !token) {
    return { success: false, errorCodes: ["token-missing-or-invalid"] };
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json() as { success: boolean; "error-codes"?: string[]; hostname?: string };
    console.log("[Turnstile] result:", JSON.stringify(data));
    return { success: data.success === true, errorCodes: data["error-codes"] ?? [] };
  } catch (err) {
    console.error("[Turnstile] verification error:", err);
    return { success: false, errorCodes: ["fetch-error"] };
  }
}
