const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SSR trasa pro administraci
app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, 'admin.html');

    fs.readFile(filePath, 'utf8', (err, htmlContent) => {
        if (err) {
            return res.status(500).send('Chyba při načítání.');
        }

        const serverDataHtml = '<p>Tohle přišlo ze serveru přes SSR!</p>';

        // Tady nahrazujeme ten tvůj prázdný div
        const finalHtml = htmlContent.replace(
            '<div id="dynamicContent"></div>',
            `<div id="dynamicContent">${serverDataHtml}</div>`
        );

        res.send(finalHtml);
    });
});

app.listen(PORT, () => {
    console.log(`Server běží na adrese: http://localhost:3000`);
});