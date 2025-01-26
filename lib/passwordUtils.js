const crypto = require("crypto");

/**
 * Generates a hashed password and a unique salt.
 * Used when creating a new user or changing a password.
 * @param {string} password - The plain text password to hash.
 * @returns {Object} - An object containing the generated salt and hash.
 */
function genPassword(password) {
  // Generate a cryptographically strong random salt (32 bytes, hex encoded).
  // Salt is used to make each password hash unique, even for the same password.
  let salt = crypto.randomBytes(32).toString("hex");

  // Hash the password using PBKDF2 (Password-Based Key Derivation Function 2).
  // PBKDF2 is a strong hashing algorithm that includes salting and iterations
  // to make password cracking more difficult.
  let genHash = crypto
    .pbkdf2Sync(
      password, // The password to hash
      salt, // The unique salt for this password
      10000, // Number of iterations - higher is more secure but slower
      64, // Length of the output hash (in bytes)
      "sha512" // Hashing algorithm to use (SHA512 is a strong algorithm)
    )
    .toString("hex"); // Convert the buffer to a hexadecimal string

  // Return both the generated salt and the hash.
  // The salt needs to be stored along with the hash, usually in the database,
  // so it can be used later to validate the password during login.
  return {
    salt: salt,
    hash: genHash
  };
}

/**
 * Validates a provided password against a stored hash and salt.
 * Used during login to check if the entered password is correct.
 * @param {string} password - The plain text password entered by the user.
 * @param {string} hash - The stored hash retrieved from the database for this user.
 * @param {string} salt - The salt that was originally used to hash the stored hash.
 * @returns {boolean} - True if the password is valid (matches the stored hash), false otherwise.
 */
function validPassword(password, hash, salt) {
  // Hash the input password using the SAME salt and parameters (iterations, key length, algorithm)
  // that were used to generate the stored hash.
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  // Compare the newly generated hash (`hashVerify`) with the stored hash (`hash`).
  // If they are identical, it means the provided password, when hashed with the correct salt,
  // matches the stored password hash, indicating a valid password.
  return hash === hashVerify;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
