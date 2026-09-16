document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const toRegisterBtn = document.getElementById("toRegister");
    const toLoginBtn = document.getElementById("toLogin");

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // Přepínání mezi formuláři
    toRegisterBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginSection.style.display = "none";
        registerSection.style.display = "block";
    });

    toLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        registerSection.style.display = "none";
        loginSection.style.display = "block";
    });

    // Registrace uživatele
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("regUsername").value.trim();
        const password = document.getElementById("regPassword").value;

        // Načteme existující uživatele z localStorage (nebo prázdné pole)
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Kontrola, jestli už uživatel existuje
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            alert("Tento uživatel už existuje!");
            return;
        }

        // Přidáme nového uživatele
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registrace byla úspěšná! Nyní se můžeš přihlásit.");
        registerForm.reset();
        registerSection.style.display = "none";
        loginSection.style.display = "block";
    });

    // Přihlášení uživatele
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Hledáme uživatele se správným jménem a heslem
        const validUser = users.find(user => user.username === username && user.password === password);

        if (validUser) {
            // Uložíme informaci o tom, že je uživatel přihlášený
            localStorage.setItem("currentUser", username);
            alert("Přihlášení úspěšné!");
            // Tady ho pak pošleme do administrace
            window.location.href = "admin.html";
        } else {
            alert("Nesprávné uživatelské jméno nebo heslo!");
        }
    });
});