/**
 * Strava OAuth Authentication
 * Handles user authentication flow with Strava API
 */

// IMPORTANT: Replace with your actual Strava Client ID
// Get it from https://www.strava.com/settings/api
const STRAVA_CLIENT_ID = '201045';  // TODO: Replace with actual Client ID

// Redirect URI - must match what's registered in Strava API settings
// For GitHub Pages: https://[username].github.io/running.html
// For local testing: http://localhost:8000/running.html
const REDIRECT_URI = window.location.origin + '/running.html';

// Scopes - what permissions we're requesting
const SCOPES = 'read,activity:read';

// LocalStorage keys
const TOKEN_KEY = 'strava_token';
const TOKEN_EXPIRY_KEY = 'strava_token_expiry';

/**
 * Initiates the Strava OAuth flow
 * Redirects user to Strava authorization page
 */
function initiateStravaAuth() {
  // Check if Client ID is configured
  if (STRAVA_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
    showError('Strava Client ID not configured. Please see setup instructions in README.md');
    return;
  }

  // Build authorization URL
  const authUrl = new URL('https://www.strava.com/oauth/authorize');
  authUrl.searchParams.append('client_id', STRAVA_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', SCOPES);

  console.log('Redirecting to Strava for authorization...');

  // Redirect to Strava
  window.location.href = authUrl.toString();
}

/**
 * Handles the OAuth callback from Strava
 * Exchanges authorization code for access token
 */
async function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  // Check for authorization errors
  if (error) {
    showError(`Strava authorization failed: ${error}`);
    return false;
  }

  // If no code, user hasn't authenticated yet
  if (!code) {
    return false;
  }

  console.log('Authorization code received, exchanging for token...');
  showLoading(true);

  try {
    // Exchange code for token
    // Note: For a static site, we need to do this client-side
    // This requires exposing the Client Secret, which is not ideal
    // For production, consider using a serverless function (AWS Lambda, Netlify Function, etc.)
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: '954b0d46236079c78891d8c440a2e8a56e2a5665',  // TODO: This should NOT be in client-side code!
        code: code,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    // Store token data
    saveToken(tokenData.access_token, tokenData.expires_at);

    // Clean up URL (remove query parameters)
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    console.log('Authentication successful!');
    return true;

  } catch (error) {
    console.error('Token exchange error:', error);
    showError('Failed to complete authentication. Please try again.');
    return false;
  } finally {
    showLoading(false);
  }
}

/**
 * Saves access token to localStorage
 */
function saveToken(accessToken, expiresAt) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
}

/**
 * Gets access token from localStorage
 * Returns null if not found or expired
 */
function getAccessToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) {
    return null;
  }

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (now >= parseInt(expiry)) {
    console.log('Token expired');
    clearToken();
    return null;
  }

  return token;
}

/**
 * Clears stored token data
 */
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Logs out user by clearing token and refreshing page
 */
function logout() {
  clearToken();
  window.location.reload();
}

/**
 * Checks if user is authenticated
 */
function isAuthenticated() {
  return getAccessToken() !== null;
}
