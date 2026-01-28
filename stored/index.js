const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, 'posts.json');

// Helper per leggere i post
const getPosts = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper per salvare i post
const savePost = (post) => {
    const posts = getPosts();
    posts.push(post);
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
};

app.get('/', (req, res) => {
    const posts = getPosts();
    
    // Generiamo l'HTML dei post. Nota: il contenuto non è sanitizzato!
    const postsHtml = posts.map(p => `
        <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px;">
            <strong>${p.username}</strong> dice:<br>
            ${p.content}
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <title>Stored XSS Demo - Forum</title>
            <style>body { font-family: sans-serif; padding: 20px; }</style>
        </head>
        <body>
            <h1>Forum Pubblico</h1>
            
            <div id="posts">
                ${postsHtml}
            </div>

            <hr>
            <h3>Lascia un commento</h3>
            <form method="POST" action="/post">
                <p>
                    <label>Username:</label><br>
                    <input type="text" name="username" required>
                </p>
                <p>
                    <label>Messaggio:</label><br>
                    <textarea name="content" rows="4" cols="50" required></textarea>
                </p>
                <button type="submit">Pubblica</button>
            </form>
            <p><small><a href="/reset">Reset posts</a></small></p>
        </body>
        </html>
    `);
});

app.post('/post', (req, res) => {
    const { username, content } = req.body;
    savePost({ username, content, date: new Date().toISOString() });
    res.redirect('/');
});

app.get('/reset', (req, res) => {
    fs.writeFileSync(DATA_FILE, '[]');
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Stored XSS app in ascolto su http://localhost:${port}`);
});
