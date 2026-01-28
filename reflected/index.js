const express = require('express');
const app = express();
const port = 3001;

// Reflected XSS: Il valore del parametro 'q' viene inserito direttamente nella risposta HTML senza sanitizzazione.
app.get('/', (req, res) => {
    const query = req.query.q || '';
    res.send(`
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <title>Reflected XSS Demo</title>
            <style>body { font-family: sans-serif; padding: 20px; }</style>
        </head>
        <body>
            <h1>Ricerca Prodotti</h1>
            <form method="GET" action="/">
                <input type="text" name="q" placeholder="Cerca..." value="${query}">
                <button type="submit">Cerca</button>
            </form>
            
            ${query ? `<p>Risultati per: <b>${query}</b></p>` : ''}
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Reflected XSS app in ascolto su http://localhost:${port}`);
});
