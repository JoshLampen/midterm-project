/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


 //Andrew's note - I designated this .js file as the login page route for now.

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {

    res.render('login') // Calls the login page.

    db.query(`SELECT * FROM users;`)  // THis is leftover from the original version I pulled. It has not been implememented.
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};


/* Outstanding items to do:

- Take login info from req.body and use a use query to call user info from the database.
Return error if SELECT * FROM users WHERE email = x AND password = y doesn't match req.body data (inputted email and password)
*/
