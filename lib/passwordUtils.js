const crypto = require("crypto");

/**
 * Generates a hashed password along with a salt
 * @param {string} password - The plain text password to hash
 * @returns {Object} - Contains the generated salt and hash
 */
function genPassword(password) {
  // Generate a random 32-byte salt using Node's crypto library
  let salt = crypto.randomBytes(32).toString("hex");

  // Hash the password using PBKDF2 (Password-Based Key Derivation Function 2)
  // - password: the plain text password
  // - salt: random value to make each hash unique
  // - 10000: number of iterations for increased security
  // - 64: length of the generated hash in bytes
  // - sha512: the hashing algorithm to use
  let genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash
  };
}

/**
 * Validates a password by comparing it with a stored hash
 * @param {string} password - The password to verify
 * @param {string} hash - The stored hash to compare against
 * @param {string} salt - The salt used in the original hash
 * @returns {boolean} - True if password matches, false otherwise
 */
function validPassword(password, hash, salt) {
  // Hash the input password using the same parameters and salt
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  // Compare the generated hash with the stored hash
  return hash === hashVerify;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
