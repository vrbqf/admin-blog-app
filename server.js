const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// SSR trasa pro administraci
app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, 'admin.html');

    fs.readFile(filePath, 'utf8', (err, htmlContent) => {
        if (err) {
            return res.status(500).send('Chyba při načítání stránky.');
        }

        // Tady si server připraví data (můžeš si sem pak načítat třeba vlastní soubor s daty)
        const posts = [
            { title: "Ukázkový příspěvek ze serveru", date: "16.09.2026" }
        ];

        // Vygenerujeme HTML kód pro tabulku
        const tableRows = posts.map(p => `<tr><td>${p.title}</td><td>${p.date}</td></tr>`).join('');

        // Server "vlepí" data do HTML ještě před odesláním uživateli
        // (V admin.html musíš mít připravené např. <tbody id="posts-table"></tbody>)
        const finalHtml = htmlContent.replace('<tbody></tbody>', `<tbody>${tableRows}</tbody>`);

        // Pošleme hotovou stránku (SSR)
        res.send(finalHtml);
    });
});

app.listen(PORT, () => {
    console.log(`Server běží na adrese: http://localhost:3000`);
});