function noCache(url) {
    return url + "?v=" + Date.now();
}
const titles = {
    "home.html": "Domov",
    "about_me.html": "O meni - Kdo sem",
    "about_work.html": "O meni - Moje delo",
    "gallery.html": "Galerija",
    "contact.html": "Kontakt"
};

document.addEventListener("DOMContentLoaded", function () {

    fetch(noCache("menu.html"))
        .then(r => r.text())
        .then(html => {
            document.getElementById("menu").innerHTML = html;
        });

    const page = location.hash
        ? location.hash.substring(1) + ".html"
        : "home.html";

    loadPage(page, false);
});

function loadPage(page, isSubmenu = false) {
    fetch(noCache(page))
        .then(r => r.text())
        .then(html => {

            document.getElementById("content").innerHTML = html;

            document.title = titles[page] || "Moja stran";

            location.hash = page.replace(".html", "");

            // 🔥 zapri vse submenuje
            document.querySelectorAll(".menu-item").forEach(item => {
                item.classList.remove("open");
            });

            // 🔥 če je submenu klik → odpri pravi parent
            if (isSubmenu) {
                document.querySelectorAll(".submenu a").forEach(link => {
                    if (link.getAttribute("onclick")?.includes(page)) {
                        const parent = link.closest(".menu-item");
                        if (parent) parent.classList.add("open");
                    }
                });
            }

            // zapri hamburger
            const menu = document.querySelector(".side-menu");
            if (menu) menu.classList.remove("open");
        });
}

function toggleMenu() {
    const menu = document.querySelector(".side-menu");
    if (menu) menu.classList.toggle("open");
}

function toggleSubmenu(element) {
    const current = element.parentElement;

    document.querySelectorAll(".menu-item").forEach(item => {
        if (item !== current) {
            item.classList.remove("open");
        }
    });

    current.classList.toggle("open");
}

window.addEventListener("hashchange", function () {
    const page = location.hash
        ? location.hash.substring(1) + ".html"
        : "home.html";

    loadPage(page, false);
});