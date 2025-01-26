const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;

/**
 * -------------- POST ROUTES ----------------
 */

/**
 * Route for user login.
 * Uses Passport's local authentication strategy.
 */
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "login-success"
  })
);

/**
 * Route for user registration.
 * Creates a new user in the database after hashing the password.
 */
router.post("/register", (req, res, next) => {
  // Generate salt and hash from the provided password
  const saltHash = genPassword(req.body.pw);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  // Create a new User object with data from the registration form
  const newUser = new User({
    username: req.body.uname, // Username from the form ('uname' field)
    hash: hash, // Hashed password
    salt: salt, // Salt used for hashing
    admin: true
  });

  // Save the new user to the database
  newUser.save().then((user) => {
    console.log(user);
  });

  res.redirect("/login");
});

/**
 * -------------- GET ROUTES ----------------
 */

/**
 * Home route - simple landing page.
 */
router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

/**
 * Route to display the login page.
 * Serves a simple HTML form for user login.
 */
router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Route to display the registration page.
 * Serves a simple HTML form for user registration.
 */
router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Protected route - accessible only to authenticated users.
 * Uses 'isAuth' middleware to ensure user is logged in.
 */
router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route.");
});

/**
 * Admin route - accessible only to authenticated admin users.
 * Uses 'isAdmin' middleware to ensure user is logged in and has admin role.
 */
router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("You made it to the admin route.");
});

/**
 * Logout route - logs the user out and redirects to protected route (can be changed).
 * Uses Passport's `req.logout()` function to clear the user session.
 */
router.get("/logout", (req, res, next) => {
  // Passport.js provides the req.logout() function to clear the session.
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/protected-route");
  });
});

/**
 * Route for successful login redirect.
 * User is redirected here by Passport on successful authentication.
 */
router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

/**
 * Route for failed login redirect.
 * User is redirected here by Passport on failed authentication.
 */
router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
