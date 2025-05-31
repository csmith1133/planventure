/**
 * Authentication endpoints for PlanVenture API
 */

/**
 * Login endpoint
 * @name Login
 * @route {POST} /auth/login
 * @authentication None
 * @bodyparam {string} email User's email address
 * @bodyparam {string} password User's password
 * @returns {Object} 200 - Success response with access token
 * @returns {Object} 401 - Authentication failed
 * @example
 * // Request
 * POST /auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "userpassword"
 * }
 * 
 * // Success Response
 * {
 *   "access_token": "eyJ0...",
 *   "message": "Login successful",
 *   "user": {
 *     "id": 1,
 *     "email": "user@example.com"
 *   }
 * }
 */

/**
 * Register new user
 * @name Register
 * @route {POST} /auth/register
 * @bodyparam {string} email User's email address
 * @bodyparam {string} password User's password
 * @returns {Object} 201 - User created successfully
 * @returns {Object} 400 - Invalid input
 * @example
 * // Request
 * POST /auth/register
 * {
 *   "email": "newuser@example.com",
 *   "password": "newpassword123"
 * }
 */
