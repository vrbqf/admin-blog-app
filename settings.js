function initSettingsManager() {
    const settingsForm = document.getElementById("settingsForm");
    const settingBlogName = document.getElementById("settingBlogName");
    const newPasswordInput = document.getElementById("newPassword");

    // Načtení stávajících nastavení z localStorage
    let settings = JSON.parse(localStorage.getItem("blogSettings")) || { blogName: "Můj blog" };
    settingBlogName.value = settings.blogName;

    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Uložení názvu blogu
            settings.blogName = settingBlogName.value.trim();
            localStorage.setItem("blogSettings", JSON.stringify(settings));

            // Případná změna hesla přihlášeného uživatele
            const newPassword = newPasswordInput.value.trim();
            const currentUser = localStorage.getItem("currentUser");

            if (newPassword && currentUser) {
                let users = JSON.parse(localStorage.getItem("users")) || {};
                if (users[currentUser]) {
                    users[currentUser] = newPassword;
                    localStorage.setItem("users", JSON.stringify(users));
                    alert("Nastavení a heslo byly úspěšně uloženy!");
                } else {
                    alert("Nastavení uloženo, ale uživatel nebyl nalezen v databázi uživatelů.");
                }
                newPasswordInput.value = "";
            } else {
                alert("Nastavení bylo úspěšně uloženy!");
            }
        });
    }
}