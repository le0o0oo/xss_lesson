const express = require("express");
const alasql = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>SQLi - Union-like</title>
      <style>body { font-family: sans-serif; padding: 20px; }</style>
    </head>
    <body>
      <h1>Product Lookup (Union-like)</h1>
      <p>Query vulnerabile su parametro <code>id</code>.</p>
      <p>Payload esempio: <code>1 UNION SELECT id, username, password FROM users</code></p>
      <form method="GET" action="/union-like/search">
        <input type="text" name="id" placeholder="ID prodotto" required>
        <button type="submit">Cerca</button>
      </form>
      <p><a href="/inspector?id=1%20UNION%20SELECT%20id,%20username,%20password%20FROM%20users">Vedi come viene costruita la query</a></p>
      <p><a href="/">Home</a></p>
    </body>
    </html>
  `);
});

router.get("/search", (req, res) => {
  const id = req.query.id || "1";
  const query = `SELECT id, name, price FROM products WHERE id = ${id}`;

  let result = [];
  try {
    result = alasql(query);
  } catch (err) {
    return res.send(
      `<h2>Errore SQL</h2><pre>${err.message}</pre><p><a href="/union-like">Torna indietro</a></p>`,
    );
  }

  const list = result.map((row) => `<li>${JSON.stringify(row)}</li>`).join("");
  res.send(
    `<h2>Risultati</h2><ul>${list || "<li>Nessun risultato</li>"}</ul><p><a href="/union-like">Riprova</a></p>`,
  );
});

module.exports = router;
