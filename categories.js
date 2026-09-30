function initCategoriesManager() {
    const categoryForm = document.getElementById("categoryForm");
    const categoriesList = document.getElementById("categoriesList");
    const categoryNameInput = document.getElementById("categoryName");

    let editingIndex = null;

    function renderCategories() {
        let categories = JSON.parse(localStorage.getItem("categories")) || [];

        if (categories.length === 0) {
            categoriesList.innerHTML = `<p>Zatím nejsou vytvořené žádné kategorie.</p>`;
            return;
        }

        let html = '<table class="data-table"><tr><th>Název kategorie</th><th>Akce</th></tr>';
        categories.forEach((cat, index) => {
            html += `
                <tr>
                    <td>
                        <!-- Kliknutím na název se otevře náhled rubriky -->
                        <a href="#" onclick="previewCategory(${index}); return false;" style="color: #0066cc; text-decoration: none; font-weight: bold;">
                            ${escapeHtml(cat.name)}
                        </a>
                    </td>
                    <td>
                        <button onclick="previewCategory(${index})" class="btn-sm btn-info">Zobrazit</button>
                        <button onclick="editCategory(${index})" class="btn-sm btn-secondary">Upravit</button>
                        <button onclick="deleteCategory(${index})" class="btn-sm btn-danger">Smazat</button>
                    </td>
                </tr>
            `;
        });
        html += '</table>';
        categoriesList.innerHTML = html;
    }

    if (categoryForm) {
        categoryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = categoryNameInput.value.trim();
            if (!name) return;

            let categories = JSON.parse(localStorage.getItem("categories")) || [];

            if (editingIndex !== null) {
                categories[editingIndex] = { name };
                editingIndex = null;
                const submitBtn = categoryForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = "Přidat kategorii";
            } else {
                categories.push({ name });
            }

            localStorage.setItem("categories", JSON.stringify(categories));
            categoryForm.reset();
            renderCategories();
        });
    }

    window.editCategory = function(index) {
        let categories = JSON.parse(localStorage.getItem("categories")) || [];
        categoryNameInput.value = categories[index].name;
        editingIndex = index;

        const submitBtn = categoryForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = "Upravit kategorii";

        categoryNameInput.focus();
    };

    renderCategories();
}

window.deleteCategory = function(index) {
    if (confirm("Opravdu chceš tuto kategorii smazat?")) {
        let categories = JSON.parse(localStorage.getItem("categories")) || [];
        categories.splice(index, 1);
        localStorage.setItem("categories", JSON.stringify(categories));
        initCategoriesManager();
    }
};

// Funkce pro zobrazení náhledu rubriky v novém okně
// Funkce pro zobrazení náhledu rubriky a jejich příspěvků v novém okně
window.previewCategory = function(index) {
    let categories = JSON.parse(localStorage.getItem("categories")) || [];
    const cat = categories[index];

    if (cat) {
        // Načteme všechny příspěvky a vybereme jen ty, které patří do této rubriky
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        const categoryPosts = posts.filter(post => post.category === cat.name);

        let postsHtml = "";
        if (categoryPosts.length === 0) {
            postsHtml = `<p style="color: #666; font-style: italic;">V této rubrice zatím nejsou žádné příspěvky.</p>`;
        } else {
            postsHtml = `<ul style="padding-left: 20px; line-height: 1.8;">`;
            categoryPosts.forEach(post => {
                postsHtml += `<li><strong>${escapeHtml(post.title)}</strong> <span style="font-size: 12px; color: #666;">(${post.date})</span><br><span style="color: #444;">${escapeHtml(post.content.substring(0, 100))}...</span></li>`;
            });
            postsHtml += `</ul>`;
        }

        const win = window.open("", "_blank");
        win.document.write(`
            <html lang="cs">
            <head>
                <title>Rubrika: ${escapeHtml(cat.name)}</title>
            </head>
            <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto; line-height: 1.6;">
                <h1 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">Rubrika: ${escapeHtml(cat.name)}</h1>
                <h3 style="margin-top: 20px; color: #34495e;">Příspěvky v této rubrice:</h3>
                ${postsHtml}
                <br><br>
                <button onclick="window.close()" style="padding: 8px 16px; cursor: pointer; background: #6c757d; color: white; border: none; border-radius: 4px;">Zavřít okno</button>
            </body>
            </html>
        `);
    }
};