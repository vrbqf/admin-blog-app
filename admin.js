document.addEventListener("DOMContentLoaded", () => {
    // 1. Kontrola přihlášení
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Nejprve se musíš přihlásit!");
        window.location.href = "index.html";
        return;
    }

    const loggedUserEl = document.getElementById("loggedUser");
    if (loggedUserEl) {
        loggedUserEl.textContent = `Přihlášen: ${currentUser}`;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    // 2. Přepínání stránek v administraci
    const navLinks = document.querySelectorAll(".nav-link");
    const pageTitle = document.getElementById("pageTitle");
    const dynamicContent = document.getElementById("dynamicContent");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            renderSection(link.getAttribute("data-target"));
        });
    });

    function renderSection(target) {
        switch (target) {
            case "dashboard":
                pageTitle.textContent = "Přehled";

                // Spočítáme reálná data z localStorage
                const postsCount = (JSON.parse(localStorage.getItem("posts")) || []).length;
                const pagesCount = (JSON.parse(localStorage.getItem("pages")) || []).length;
                const categoriesCount = (JSON.parse(localStorage.getItem("categories")) || []).length;

                dynamicContent.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;">
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border: 1px solid #e1e4e8; text-align: center;">
                            <h4 style="color: #666; font-size: 14px; margin-bottom: 5px;">Příspěvky</h4>
                            <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">${postsCount}</span>
                        </div>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border: 1px solid #e1e4e8; text-align: center;">
                            <h4 style="color: #666; font-size: 14px; margin-bottom: 5px;">Stránky</h4>
                            <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">${pagesCount}</span>
                        </div>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border: 1px solid #e1e4e8; text-align: center;">
                            <h4 style="color: #666; font-size: 14px; margin-bottom: 5px;">Kategorie</h4>
                            <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">${categoriesCount}</span>
                        </div>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border: 1px solid #e1e4e8;">
                        <h3 style="font-size: 16px; margin-bottom: 10px; color: #2c3e50;">Vítej v administraci!</h3>
                        <p style="color: #555; font-size: 14px;">Systém běží lokálně, data se ukládají bezpečně do tvého prohlížeče pomocí localStorage. V menu vlevo můžeš spravovat obsah svého webu.</p>
                    </div>
                `;
                break;
            // ... ostatní case zůstávají stejné
            case "posts":
                pageTitle.textContent = "Správa příspěvků";
                dynamicContent.innerHTML = `
                    <div class="crud-container">
                        <h3>Přidat nový příspěvek</h3>
                        <form id="postForm">
                            <input type="text" id="postTitle" placeholder="Nadpis příspěvku" required>
                            
                            <!-- Zde jsme přidali výběr rubriky -->
                            <div style="margin-bottom: 15px;">
                                <label for="postCategory" style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Rubrika:</label>
                                <select id="postCategory" class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                    <option value="">-- Vyberte rubriku --</option>
                                </select>
                            </div>

                            <textarea id="postContent" placeholder="Obsah příspěvku..." rows="4" required></textarea>
                            
                            <h4 style="margin-top: 15px; color: #495057;">SEO Optimalizace</h4>
                            <input type="text" id="seoTitle" placeholder="SEO Titulek (title)">
                            <input type="text" id="seoDescription" placeholder="SEO Popisek (meta description)">

                            <button type="submit">Uložit příspěvek</button>
                        </form>
                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #dee2e6;">
                        <h3>Seznam příspěvků</h3>
                        <div id="postsList"></div>
                    </div>
                `;
                if (typeof initPostsManager === "function") initPostsManager();
                break;
            case "pages":
                pageTitle.textContent = "Správa stránek";
                dynamicContent.innerHTML = `
                    <div class="crud-container">
                        <h3>Přidat novou stránku</h3>
                        <form id="pageForm">
                            <input type="text" id="pageTitleInput" placeholder="Název stránky" required>
                            <textarea id="pageContent" placeholder="Obsah stránky..." rows="4" required></textarea>
                            <button type="submit">Uložit stránku</button>
                        </form>
                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #dee2e6;">
                        <h3>Seznam stránek</h3>
                        <div id="pagesList"></div>
                    </div>
                `;
                if (typeof initPagesManager === "function") initPagesManager();
                break;
            case "categories":
                pageTitle.textContent = "Rubriky a kategorie";
                dynamicContent.innerHTML = `
                    <div class="crud-container">
                        <h3>Přidat novou kategorii</h3>
                        <form id="categoryForm">
                            <input type="text" id="categoryName" placeholder="Název kategorie" required>
                            <button type="submit">Uložit kategorii</button>
                        </form>
                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #dee2e6;">
                        <h3>Seznam kategorií</h3>
                        <div id="categoriesList"></div>
                    </div>
                `;
                if (typeof initCategoriesManager === "function") initCategoriesManager();
                break;
            case "settings":
                pageTitle.textContent = "Nastavení";
                dynamicContent.innerHTML = `
                    <div class="crud-container">
                        <h3>Nastavení systému a účtu</h3>
                        <form id="settingsForm">
                            <label>Název blogu:</label>
                            <input type="text" id="settingBlogName" placeholder="Můj osobní blog">
                            
                            <label style="margin-top: 10px; display: block;">Změna hesla aktuálního uživatele:</label>
                            <input type="password" id="newPassword" placeholder="Nové heslo">
                            
                            <button type="submit" style="margin-top: 15px;">Uložit nastavení</button>
                        </form>
                    </div>
                `;
                if (typeof initSettingsManager === "function") initSettingsManager();
                break;
            default:
                dynamicContent.innerHTML = `<p>Sekce nenalezena.</p>`;
        }
    }

    renderSection("dashboard");
});

// Pomocná bezpečnostní funkce pro HTML entity
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Funkce pro zobrazení hezké notifikace v rohu
function showToast(message) {
    // Zkontrolujeme, jestli prvek už v HTML existuje, jinak ho vytvoříme
    let toast = document.getElementById("toastNotification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastNotification";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    // Po 3 sekundách notifikace zase zmizí
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

