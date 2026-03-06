const express = require("express");
const tautologyRoutes = require("./routes/tautology");
const commentBypassRoutes = require("./routes/comment_bypass");
const unionLikeRoutes = require("./routes/union_like");
const alasql = require("./db");

const app = express();
const port = 3004;

app.use(express.urlencoded({ extended: true }));
app.use("/payloads", express.static("payloads"));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>SQL Injection Demo</title>
      <style>body { font-family: sans-serif; padding: 20px; }</style>
    </head>
    <body>
      <h1>SQL Injection Lab</h1>
      <ul>
        <li><a href="/tautology">Tautology login</a></li>
        <li><a href="/comment-bypass">Comment bypass login</a></li>
        <li><a href="/union-like">Union-like data extraction</a></li>
        <li><a href="/inspector">Payload/query inspector + tables</a></li>
      </ul>
      <p>Payload di esempio:</p>
      <ul>
        <li><a href="/payloads/tautology.html">tautology.html</a></li>
        <li><a href="/payloads/comment_bypass.html">comment_bypass.html</a></li>
        <li><a href="/payloads/union_like.html">union_like.html</a></li>
      </ul>
      <footer>
        <p><a href="https://github.com/le0o0oo/xss_lesson/blob/main/sqli/index.js">Codice sorgente</a></p>
      </footer>
    </body>
    </html>
  `);
});

app.get("/inspector", (req, res) => {
  const username = req.query.username || "admin' -- ";
  const password = req.query.password || "whatever";
  const id = req.query.id || "1 UNION SELECT id, username, password FROM users";

  const loginQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  const unionQuery = `SELECT id, name, price FROM products WHERE id = ${id}`;

  const users = alasql("SELECT * FROM users");
  const products = alasql("SELECT * FROM products");

  const usersRows = users
    .map(
      (u) =>
        `<tr><td>${u.id}</td><td>${u.username}</td><td>${u.password}</td><td>${u.role}</td></tr>`,
    )
    .join("");
  const productsRows = products
    .map(
      (p) => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.price}</td></tr>`,
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>SQLi Inspector</title>
      <style>body { font-family: sans-serif; padding: 20px; } code, pre { background: #f4f4f4; padding: 6px; display: block; } table { border-collapse: collapse; margin-top: 8px; } td, th { border: 1px solid #ccc; padding: 6px 10px; }</style>
    </head>
    <body>
      <h1>Payload / Query Inspector</h1>
      <form method="GET" action="/inspector">
        <p><label>username:</label><br><input type="text" name="username" value="${username}" style="width: 520px"></p>
        <p><label>password:</label><br><input type="text" name="password" value="${password}" style="width: 520px"></p>
        <p><label>id (union-like):</label><br><input type="text" name="id" value="${id}" style="width: 520px"></p>
        <button type="submit">Preview query</button>
      </form>

      <h2>Login query (tautology/comment bypass)</h2>
      <pre>${loginQuery}</pre>

      <h2>Union-like query</h2>
      <pre>${unionQuery}</pre>

      <h2>Table: users</h2>
      <table>
        <tr><th>id</th><th>username</th><th>password</th><th>role</th></tr>
        ${usersRows}
      </table>

      <h2>Table: products</h2>
      <table>
        <tr><th>id</th><th>name</th><th>price</th></tr>
        ${productsRows}
      </table>

      <p><a href="/">Home</a></p>
    </body>
    </html>
  `);
});

app.use("/tautology", tautologyRoutes);
app.use("/comment-bypass", commentBypassRoutes);
app.use("/union-like", unionLikeRoutes);

app.listen(port, () => {
  console.log(`SQLi app in ascolto su http://localhost:${port}`);
});
