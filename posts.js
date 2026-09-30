function initPostsManager() {
    const postForm = document.getElementById("postForm");
    const postsList = document.getElementById("postsList");
    const postTitleInput = document.getElementById("postTitle");
    const postContentInput = document.getElementById("postContent");
    const seoTitleInput = document.getElementById("seoTitle");
    const seoDescriptionInput = document.getElementById("seoDescription");
    const postCategorySelect = document.getElementById("postCategory");

    let editingIndex = null;

    // Funkce pro naplnění selectu kategoriemi z localStorage
    function renderCategoryOptions(selectedCategory = "") {
        if (!postCategorySelect) return;
        let categories = JSON.parse(localStorage.getItem("categories")) || [];

        let html = '<option value="">-- Vyberte rubriku --</option>';
        categories.forEach(cat => {
            const isSelected = cat.name === selectedCategory ? 'selected' : '';
            html += `<option value="${escapeHtml(cat.name)}" ${isSelected}>${escapeHtml(cat.name)}</option>`;
        });
        postCategorySelect.innerHTML = html;
    }

    function renderPosts() {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];

        if (posts.length === 0) {
            postsList.innerHTML = `<p>Zatím nejsou vytvořené žádné příspěvky.</p>`;
            return;
        }

        let html = '<table class="data-table"><tr><th>Nadpis</th><th>Rubrika</th><th>Akce</th></tr>';
        posts.forEach((post, index) => {
            html += `
                <tr>
                    <td>
                        <a href="#" onclick="previewPost(${index}); return false;" style="color: #0066cc; text-decoration: none; font-weight: bold;">
                            ${escapeHtml(post.title)}
                        </a>
                    </td>
                    <td><span style="background: #e9ecef; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${escapeHtml(post.category || "Bez rubriky")}</span></td>
                    <td>
                        <button onclick="previewPost(${index})" class="btn-sm btn-info">Zobrazit</button>
                        <button onclick="editPost(${index})" class="btn-sm btn-secondary">Upravit</button>
                        <button onclick="deletePost(${index})" class="btn-sm btn-danger">Smazat</button>
                    </td>
                </tr>
            `;
        });
        html += '</table>';
        postsList.innerHTML = html;
    }

    if (postForm) {
        postForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = postTitleInput.value.trim();
            const content = postContentInput.value.trim();
            const seoTitle = seoTitleInput.value.trim();
            const seoDescription = seoDescriptionInput.value.trim();
            const category = postCategorySelect ? postCategorySelect.value : "";

            if (!title || !content) return;

            let posts = JSON.parse(localStorage.getItem("posts")) || [];

            const postData = {
                title,
                content,
                seoTitle: seoTitle || title,
                seoDescription: seoDescription || "Popisek není zadaný.",
                category,
                date: editingIndex !== null ? posts[editingIndex].date : new Date().toLocaleDateString()
            };

            if (editingIndex !== null) {
                posts[editingIndex] = postData;
                editingIndex = null;
                const submitBtn = postForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = "Uložit příspěvek";

                // Notifikace při úpravě
                if (typeof showToast === "function") showToast("Příspěvek byl úspěšně upraven!");
            } else {
                posts.push(postData);

                // Notifikace při vytvoření nového
                if (typeof showToast === "function") showToast("Příspěvek byl úspěšně vytvořen!");
            }

            localStorage.setItem("posts", JSON.stringify(posts));
            postForm.reset();
            renderCategoryOptions();
            renderPosts();
        });
    }

    window.editPost = function(index) {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        const post = posts[index];
        if (post) {
            postTitleInput.value = post.title;
            postContentInput.value = post.content;
            seoTitleInput.value = post.seoTitle || "";
            seoDescriptionInput.value = post.seoDescription || "";
            renderCategoryOptions(post.category || ""); // Předvybere správnou rubriku při úpravě
            editingIndex = index;

            const submitBtn = postForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = "Upravit příspěvek";

            postTitleInput.focus();
        }
    };

    // Při startu správce příspěvků rovnou naplníme select možnostmi
    renderCategoryOptions();
    renderPosts();
}

window.deletePost = function(index) {
    if (confirm("Opravdu chceš tento příspěvek smazat?")) {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));

        // Notifikace při smazání
        if (typeof showToast === "function") showToast("Příspěvek byl smazán.");

        initPostsManager();
    }
};

window.previewPost = function(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts[index];
    if (post) {
        const win = window.open("", "_blank");
        win.document.write(`
            <html lang="cs">
            <head>
                <title>Náhled: ${escapeHtml(post.seoTitle)}</title>
                <meta name="description" content="${escapeHtml(post.seoDescription)}">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto; line-height: 1.6;">
                <div style="background: #e9ecef; padding: 10px; font-size: 12px; margin-bottom: 20px; border-radius: 4px;">
                    <strong>SEO Náhled pro vyhledávače:</strong><br>
                    <span style="color: #1a0dab; font-size: 16px;">${escapeHtml(post.seoTitle)}</span><br>
                    <span style="color: #006621;">https://tvujblog.cz/clanek</span><br>
                    <span style="color: #545454;">${escapeHtml(post.seoDescription)}</span>
                </div>

                <p style="color: #666; font-size: 14px;">Rubrika: <strong>${escapeHtml(post.category || "Bez rubriky")}</strong> | Publikováno: ${post.date}</p>
                <h1>${escapeHtml(post.title)}</h1>
                <hr style="margin: 20px 0;">
                <div>${escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                <br><button onclick="window.close()" style="padding: 8px 16px; cursor: pointer;">Zavřít náhled</button>
            </body>
            </html>
        `);
    }
};