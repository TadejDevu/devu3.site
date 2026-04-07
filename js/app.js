const content = document.getElementById("content");
const hamburger = document.getElementById("hamburger");

const titles = {
    "home": "Domov",
    "about_me": "Kdo sem",
    "about_work": "Kaj delam",
    "gallery": "Galerija",
    "contact": "Kontakt"
};

const cache = {};

// =======================
// LOAD PAGE
// =======================
async function loadPage(page, push = true) {
    content.style.opacity = "0.5";
    try {
        let html;

        if (cache[page]) {
            html = cache[page];
        } else {
            const res = await fetch("pages/" + page + ".html");
            if (!res.ok) throw new Error("404");
            html = await res.text();
            cache[page] = html;
        }

        content.innerHTML = html;

        if (push) {
            history.pushState({ page }, "", "#" + page);
        }

        document.title = "DeVu – " + (titles[page] || "Stran");

        updateMenu(page);

    } catch (err) {
        content.innerHTML = "<h2>Stran ne obstaja</h2>";
    }
    content.style.opacity = "1";
}

// =======================
// ROUTER
// =======================
function router() {
    const page = location.hash
        ? location.hash.substring(1)
        : "home";

    loadPage(page, false);
}

// =======================
// CLICK HANDLER
// =======================
document.addEventListener("click", (e) => {

    const burger = e.target.closest(".burger-toggle");

    if (burger) {

        const menu = document.getElementById("menu");
        menu.classList.toggle("open");

        hamburger.textContent =
            menu.classList.contains("open") ? "✕" : "☰";

        return;
    }

    const link = e.target.closest(".menu-link");
    if (!link) return;

    if (link.classList.contains("has-sub")) {
        link.parentElement.classList.toggle("open");
        return;
    }

    const page = link.dataset.page;
    if (page) {

        loadPage(page);

        if (window.innerWidth <= 768) {
            const menu = document.getElementById("menu");
            menu.classList.remove("open");
            hamburger.textContent = "☰";
        }
    }
});

// =======================
// SUBMENU
// =======================
function updateMenu(page) {

    // zapri vse submenu
    document.querySelectorAll(".menu-item")
        .forEach(item => item.classList.remove("open"));

    // odstrani active iz vseh
    document.querySelectorAll(".menu-link")
        .forEach(link => link.classList.remove("active"));

    // najdi aktiven link
    const activeLink = document.querySelector(`[data-page="${page}"]`);

    if (activeLink) {
        activeLink.classList.add("active");

        // če je v submenu → odpri parent
        const parentMenu = activeLink.closest(".menu-item");
        if (parentMenu) {
            parentMenu.classList.add("open");
        }
    }
}

// =======================
window.addEventListener("popstate", router);

// =======================
document.addEventListener("DOMContentLoaded", async () => {

    const html = await fetch("menu.html").then(r => r.text());
    document.getElementById("menu").innerHTML = html;

    router();

    // preload najpogostejše strani
    ["home", "about_me"].forEach(async (p) => {
        try {
            const res = await fetch("pages/" + p + ".html");
            cache[p] = await res.text();
        } 
        catch {}
    });

});

/* preload najpogostejše strani
["home", "about_me"].forEach(async (p) => {
    try {
        const res = await fetch("pages/" + p + ".html");
        cache[p] = await res.text();
    } 
    catch {}
});*/

// ACTIVE LINK
document.querySelectorAll(".menu-link")
    .forEach(link => link.classList.remove("active"));

const activeLink = document.querySelector(`[data-page="${page}"]`);
if (activeLink) {
    activeLink.classList.add("active");
}