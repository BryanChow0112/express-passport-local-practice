# Node.js Authentication with Passport.js Local Strategy

This basic project is all about exploring user authentication using Node.js, Express.js and Passport.js with the Local Strategy.  I built this to really understand how backend authentication works and how Passport.js can help secure user credentials. It's a hands-on way to understand the core backend pieces of authentication, like user registration, login, keeping users logged in with sessions and protecting parts of your application.  

## Badges

[![Passport.js](https://img.shields.io/badge/passport.js-34B089?style=for-the-badge&logo=passport&logoColor=white)](http://www.passportjs.org/)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://www.javascript.com/)


## Features

- **User Registration (Backend API):**  Users can register through a `/register` route.  It's set up to securely handle usernames and passwords, hashing and salting passwords before saving them in the database.
- **Local Authentication (Backend API):**  The `/login` route uses Passport.js Local Strategy to authenticate users when they log in with a username and password.
- **Login & Logout (Backend API):** Simple `/login` and `/logout` routes to manage user sessions. Login creates a session, and logout ends it.
- **Backend Session Management:**  Uses `express-session` and `connect-mongo` to handle sessions on the server-side.  Sessions are stored in MongoDB, so logins persist even if the server restarts.
- **Protected Backend Routes:**  Shows how to protect API routes like `/protected-route` and `/admin-route` so only logged-in users can access them.
- **Admin-Only Backend Routes:**  Demonstrates how to create routes like `/admin-route` that are only for users with admin privileges, using role-based checks.
- **Secure Password Handling (Backend):**  Passwords are hashed using PBKDF2 with salts, a strong way to keep passwords secure in the database.
- **Basic HTML Forms Included:**  For easy testing, there are basic HTML forms for login and registration directly served from the backend.  This is just for demonstration, not a full frontend.
