function initPagesManager() {
    const pageForm = document.getElementById("pageForm");
    const pagesList = document.getElementById("pagesList");

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
                    <td><strong>${escapeHtml(page.title)}</strong></td>
                    <td>
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
            const title = document.getElementById("pageTitleInput").value.trim();
            const content = document.getElementById("pageContent").value.trim();

            let pages = JSON.parse(localStorage.getItem("pages")) || [];
            pages.push({ title, content });
            localStorage.setItem("pages", JSON.stringify(pages));

            pageForm.reset();
            renderPages();
        });
    }

    renderPages();
}

window.deletePage = function(index) {
    if (confirm("Opravdu chceš tuto stránku smazat?")) {
        let pages = JSON.parse(localStorage.getItem("pages")) || [];
        pages.splice(index, 1);
        localStorage.setItem("pages", JSON.stringify(pages));
        initPagesManager();
    }
};