function initCategoriesManager() {
    const categoryForm = document.getElementById("categoryForm");
    const categoriesList = document.getElementById("categoriesList");

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
                    <td><strong>${escapeHtml(cat.name)}</strong></td>
                    <td>
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
            const name = document.getElementById("categoryName").value.trim();

            let categories = JSON.parse(localStorage.getItem("categories")) || [];
            categories.push({ name });
            localStorage.setItem("categories", JSON.stringify(categories));

            categoryForm.reset();
            renderCategories();
        });
    }

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