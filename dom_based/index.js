const express = require('express');
const app = express();
const path = require('path');
const port = 3003;

app.use(express.static(path.join(__dirname, 'public')));
// Tutto quello dopo il cancelletto non viene inviato al server, infatti questo hosta soltanto il file html
app.listen(port, () => {
    console.log(`DOM-based XSS app in ascolto su http://localhost:${port}`);
    console.log(`Visita http://localhost:${port}/index.html#TuoMessaggio`);
});
