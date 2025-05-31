```typescript
/**
 * Authentication API module
 * @module auth
 */

/**
 * Login user with credentials
 * @param {Object} credentials - User login information
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response containing user data and tokens
 * @throws {Error} When login fails
 * 
 * @example
 * const response = await login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Response
 * {
 *   user: { id: 1, email: 'user@example.com' },
 *   access_token: 'jwt.token.here',
 *   refresh_token: 'refresh.token.here'
 * }
 */
export async function login({ email, password }: { email: string; password: string }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}
```