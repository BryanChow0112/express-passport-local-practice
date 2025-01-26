const express = require("express");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes");
const connection = require("./config/database");

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo")(session);

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport"); // Execute the passport configuration in './config/passport.js' to set up Passport strategies

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json()); // Parses request bodies in JSON format and makes them available in req.body

// Middleware to parse incoming URL-encoded requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded request bodies (like from HTML forms) and makes them available in req.body

/**
 * -------------- SESSION SETUP ----------------
 */

// Configure MongoDB store for sessions using connect-mongo
const sessionStore = new MongoStore({
  mongooseConnection: connection, // Use the Mongoose connection from our database config
  collection: "sessions"
});

// Configure express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key used to sign the session ID cookie
    resave: false, // Don't save session if unmodified - prevents race conditions
    saveUninitialized: true, // Save new sessions even if not modified - needed for login sessions to be created
    store: sessionStore, // Use the MongoDB session store configured above
    // Configure session cookie options
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // Set cookie to expire after 24 hours (in milliseconds)
    }
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Initialize Passport.js middleware - required to use Passport
app.use(passport.initialize());

// Enable Passport session management - uses express-session to persist login sessions
app.use(passport.session());

// Custom middleware to log session and user information for debugging
app.use((req, res, next) => {
  console.log(req.session); // Log the session object for each request
  console.log(req.user); // Log the user object attached by Passport after deserialization (if user is logged in)
  next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Start the server and listen for incoming requests on port 3000
app.listen(3000);
