/**
 * Google OAuth service for authentication
 */

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

/**
 * Get Google OAuth authorization URL
 */
export function getGoogleAuthUrl(redirectUri: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is not configured");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<GoogleTokenResponse | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Google OAuth credentials not configured");
    return null;
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to exchange code for tokens:", error);
      return null;
    }

    const tokens = (await response.json()) as GoogleTokenResponse;
    return tokens;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return null;
  }
}

/**
 * Get Google user info from access token
 */
export async function getGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to get user info:", error);
      return null;
    }

    const userInfo = (await response.json()) as GoogleUserInfo;
    return userInfo;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
}

/**
 * Validate Google OAuth configuration
 */
export function validateGoogleOAuthConfig(): boolean {
  const requiredVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      `Missing required Google OAuth environment variables: ${missingVars.join(", ")}`
    );
    return false;
  }

  return true;
}

/**
 * Get OAuth configuration status
 */
export function getGoogleOAuthStatus() {
  return {
    configured: validateGoogleOAuthConfig(),
    clientIdConfigured: !!process.env.GOOGLE_CLIENT_ID,
    clientSecretConfigured: !!process.env.GOOGLE_CLIENT_SECRET,
  };
}
