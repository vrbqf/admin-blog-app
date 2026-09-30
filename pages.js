function initPagesManager() {
    const pageForm = document.getElementById("pageForm");
    const pagesList = document.getElementById("pagesList");
    const pageTitleInput = document.getElementById("pageTitleInput");
    const pageContentInput = document.getElementById("pageContent");

    let editingIndex = null;

    function renderPages() {
        let pages = JSON.parse(localStorage.getItem("pages")) || [];

        if (pages.length === 0) {
            pagesList.innerHTML = `<p>Zatím nejsou vytvořené žádné stránky.</p>`;
            return;
        }

        let html = '<table class="data-table"><tr><th>Název stránky</th><th>Akce</th></tr>';
        pages.forEach((page, index) => {
            html += `
                <tr>
                    <td>
                        <!-- Kliknutím na název nebo tlačítko se otevře náhled stránky -->
                        <a href="#" onclick="previewPage(${index}); return false;" style="color: #0066cc; text-decoration: none; font-weight: bold;">
                            ${escapeHtml(page.title)}
                        </a>
                    </td>
                    <td>
                        <button onclick="previewPage(${index})" class="btn-sm btn-info">Zobrazit</button>
                        <button onclick="editPage(${index})" class="btn-sm btn-secondary">Upravit</button>
                        <button onclick="deletePage(${index})" class="btn-sm btn-danger">Smazat</button>
                    </td>
                </tr>
            `;
        });
        html += '</table>';
        pagesList.innerHTML = html;
    }

    if (pageForm) {
        pageForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = pageTitleInput.value.trim();
            const content = pageContentInput.value.trim();

            if (!title) return;

            let pages = JSON.parse(localStorage.getItem("pages")) || [];

            if (editingIndex !== null) {
                pages[editingIndex] = { title, content };
                editingIndex = null;
                const submitBtn = pageForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = "Přidat stránku";

                // Zobrazení notifikace při úpravě
                if (typeof showToast === "function") showToast("Stránka byla úspěšně upravena!");
            } else {
                pages.push({ title, content });

                // Zobrazení notifikace při vytvoření nového
                if (typeof showToast === "function") showToast("Stránka byla úspěšně vytvořena!");
            }

            localStorage.setItem("pages", JSON.stringify(pages));
            pageForm.reset();
            renderPages();
        });
    }

    window.editPage = function(index) {
        let pages = JSON.parse(localStorage.getItem("pages")) || [];
        const page = pages[index];
        if (page) {
            pageTitleInput.value = page.title;
            pageContentInput.value = page.content || "";
            editingIndex = index;

            const submitBtn = pageForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = "Upravit stránku";

            pageTitleInput.focus();
        }
    };

    renderPages();
}

window.deletePage = function(index) {
    if (confirm("Opravdu chceš tuto stránku smazat?")) {
        let pages = JSON.parse(localStorage.getItem("pages")) || [];
        pages.splice(index, 1);
        localStorage.setItem("pages", JSON.stringify(pages));

        // Zobrazení notifikace při smazání
        if (typeof showToast === "function") showToast("Stránka byla smazána.");

        initPagesManager();
    }
};

// Funkce pro zobrazení obsahu stránky v novém okně (náhled)
window.previewPage = function(index) {
    let pages = JSON.parse(localStorage.getItem("pages")) || [];
    const page = pages[index];
    if (page) {
        const win = window.open("", "_blank");
        win.document.write(`
            <html lang="cs">
            <head>
                <title>${escapeHtml(page.title)}</title>
            </head>
            <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto; line-height: 1.6;">
                <h1>${escapeHtml(page.title)}</h1>
                <hr style="margin: 20px 0;">
                <div>${escapeHtml(page.content).replace(/\n/g, '<br>')}</div>
                <br><br>
                <button onclick="window.close()" style="padding: 8px 16px; cursor: pointer;">Zavřít okno</button>
            </body>
            </html>
        `);
    }
};