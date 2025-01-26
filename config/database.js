const mongoose = require("mongoose");

require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Establish connection to MongoDB using Mongoose.
 * The connection string is expected to be defined in the `.env` file as `DATABASE_URL`.
 */
const conn = process.env.DATABASE_URL;

// Create a Mongoose connection to the MongoDB database using the URL from environment variables.
const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true, // Mongoose option to use the new URL parser
  useUnifiedTopology: true // Mongoose option to use the MongoDB driver's new unified topology
});

// Define the schema for the User model using Mongoose Schema.
// This schema specifies the structure and data types for documents in the 'User' collection in MongoDB.
const UserSchema = new mongoose.Schema({
  username: String, // 'username' field of type String to store the user's username
  hash: String, // 'hash' field of type String to store the hashed password
  salt: String, // 'salt' field of type String to store the salt used for password hashing
  admin: Boolean // 'admin' field of type Boolean to indicate if the user has admin privileges (true/false)
});

// Create the User model using the defined UserSchema and the established database connection.
const User = connection.model("User", UserSchema);

// Expose the connection
module.exports = connection;
