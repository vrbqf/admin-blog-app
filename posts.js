function initPostsManager() {
    const postForm = document.getElementById("postForm");
    const postsList = document.getElementById("postsList");

    function renderPosts() {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];

        if (posts.length === 0) {
            postsList.innerHTML = `<p>Zatím nejsou vytvořené žádné příspěvky.</p>`;
            return;
        }

        let html = '<table class="data-table"><tr><th>Nadpis</th><th>Akce</th></tr>';
        posts.forEach((post, index) => {
            html += `
                <tr>
                    <td><strong>${escapeHtml(post.title)}</strong></td>
                    <td>
                        <button onclick="previewPost(${index})" class="btn-sm btn-info">Náhled</button>
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
            const title = document.getElementById("postTitle").value.trim();
            const content = document.getElementById("postContent").value.trim();
            const seoTitle = document.getElementById("seoTitle").value.trim();
            const seoDescription = document.getElementById("seoDescription").value.trim();

            let posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts.push({
                title,
                content,
                seoTitle: seoTitle || title,
                seoDescription: seoDescription || "Popisek není zadaný.",
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem("posts", JSON.stringify(posts));

            postForm.reset();
            renderPosts();
        });
    }

    renderPosts();
}

window.deletePost = function(index) {
    if (confirm("Opravdu chceš tento příspěvek smazat?")) {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
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
            <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto;">
                <div style="background: #e9ecef; padding: 10px; font-size: 12px; margin-bottom: 20px; border-radius: 4px;">
                    <strong>SEO Náhled pro vyhledávače:</strong><br>
                    <span style="color: #1a0dab; font-size: 16px;">${escapeHtml(post.seoTitle)}</span><br>
                    <span style="color: #006621;">https://tvujblog.cz/clanek</span><br>
                    <span style="color: #545454;">${escapeHtml(post.seoDescription)}</span>
                </div>

                <h1>${escapeHtml(post.title)}</h1>
                <p style="color: #6c757d; font-size: 14px;">Publikováno: ${post.date}</p>
                <hr>
                <div style="line-height: 1.6;">${escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                <br><button onclick="window.close()" style="padding: 8px 16px; cursor: pointer;">Zavřít náhled</button>
            </body>
            </html>
        `);
    }
};