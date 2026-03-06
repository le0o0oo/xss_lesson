const express = require("express");
const alasql = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>SQLi - Comment Bypass</title>
      <style>body { font-family: sans-serif; padding: 20px; }</style>
    </head>
    <body>
      <h1>Comment Bypass Login</h1>
      <p>Payload tipico nello username: <code>admin' -- </code></p>
      <form method="POST" action="/comment-bypass/login">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Accedi</button>
      </form>
      <p><a href="/inspector?username=admin'%20--%20&password=x">Vedi come viene costruita la query</a></p>
      <p><a href="/">Home</a></p>
    </body>
    </html>
  `);
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  const result = alasql(query);

  if (result.length > 0) {
    return res.send(
      `<h2>Login riuscito come ${result[0].username}</h2><p><a href="/comment-bypass">Riprova</a></p>`,
    );
  }

  res.send(
    '<h2>Credenziali non valide</h2><p><a href="/comment-bypass">Riprova</a></p>',
  );
});

module.exports = router;
