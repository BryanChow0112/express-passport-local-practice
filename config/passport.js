const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const User = connection.models.User;
const validPassword = require("../lib/passwordUtils").validPassword;

/**
 * Custom field configuration for the login form
 * Maps form field names to what passport expects
 */
const customFields = {
  usernameField: "uname", // Form field name for username
  passwordField: "pw" // Form field name for password
};

/**
 * Verification callback for Local Strategy
 * This is called when user attempts to log in
 */
const verifyCallback = (username, password, done) => {
  // Look for user in database
  User.findOne({ username: username })
    .then((user) => {
      // If user not found
      if (!user) {
        return done(null, false);
      }

      // Check if password is valid using our utility function
      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        // If password valid, pass user object to done
        return done(null, user);
      } else {
        // If password invalid, pass false to done
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

// Create new Local Strategy with our custom configuration
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

/**
 * Serialization: Determines which data of the user object should be stored in the session
 * Here we just store the user ID
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialization: Uses the ID from the session to get the full user object
 * This runs on every request when the user is logged in
 */
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
