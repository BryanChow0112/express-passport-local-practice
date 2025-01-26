const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const User = connection.models.User;
const validPassword = require("../lib/passwordUtils").validPassword;

/**
 * Custom field configuration for login form.
 * Maps form fields to Passport's expected fields.
 */
const customFields = {
  usernameField: "uname", // Username field in the form is 'uname'
  passwordField: "pw" // Password field in the form is 'pw'
};

/**
 * Verification callback for Local Strategy.
 * Called when user attempts to log in.
 */
const verifyCallback = (username, password, done) => {
  // Find user in database by username
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        // User not found
        return done(null, false); // Authentication fails: no user
      }

      const isValid = validPassword(password, user.hash, user.salt); // Validate password

      if (isValid) {
        // Password valid
        return done(null, user); // Authentication success: return user object
      } else {
        // Password invalid
        return done(null, false); // Authentication fails: invalid password
      }
    })
    .catch((err) => {
      done(err); // Database error during lookup
    });
};

// Create a new Local Strategy instance using the configurations defined above:
// - `customFields`:  To tell Passport to use 'uname' and 'pw' for username and password fields.
// - `verifyCallback`: The function that will be executed to verify the user's credentials.
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

/**
 * **Serialization:**
 * Passport needs to serialize user information to store it in the session.
 * Serialization determines what data from the user object should be stored in the session.
 * For simplicity and security, we usually store only the user's ID in the session.
 *
 * This function is called by Passport after successful authentication (in `verifyCallback` when `done(null, user)` is called).
 * It takes the `user` object (from `verifyCallback`) and the `done` callback.
 */
passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

/**
 * **Deserialization:**
 * When a user makes subsequent requests, Passport needs to retrieve the user information from the session.
 * Deserialization is the process of taking the serialized user data from the session (in our case, just the user ID)
 * and retrieving the full user object from the database.
 *
 * This function is called by Passport on every subsequent request to restore the user object based on the information
 * stored in the session.
 * It takes the serialized user ID (that we stored in `serializeUser`) as the first argument and the `done` callback.
 */
passport.deserializeUser((userId, done) => {
  // `userId` here is the user ID we stored in the session during serialization.
  User.findById(userId)
    .then((user) => {
      done(null, user); // User found, attach to req.user
    })
    .catch((err) => done(err)); // Error during deserialization
});

module.exports = passport;
