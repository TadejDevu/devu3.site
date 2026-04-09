/**
 * DeVu Portfolio - Glavna Aplikacija
 * Dinamično nalaganje strani in upravljanje navigacije
 */

const content = document.getElementById("content");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

const titles = {
    "home": "Domov",
    "about_me": "Kdo sem",
    "about_work": "Kaj delam",
    "gallery": "Galerija",
    "contact": "Kontakt"
};

const cache = {};

/**
 * Dinamično naloži stran
 * @param {string} page - Ime strani (brez .html)
 * @param {boolean} push - Ali dodati v history
 */
async function loadPage(page, push = true) {
    content.style.opacity = "0.5";
    
    try {
        let html;

        if (cache[page]) {
            html = cache[page];
        } else {
            const res = await fetch("pages/" + page + ".html");
            if (!res.ok) throw new Error(`404: Stran '${page}' ne obstaja`);
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
        console.error("❌ Napaka:", err);
        content.innerHTML = `<h2>⚠️ Napaka pri nalaganju</h2><p>${err.message}</p>`;
    }
    
    content.style.opacity = "1";
}

function router() {
    const page = location.hash ? location.hash.substring(1) : "home";
    loadPage(page, false);
}

document.addEventListener("click", (e) => {
    
    const burger = e.target.closest(".burger-toggle");
    if (burger) {
        menu.classList.toggle("open");
        hamburger.textContent = menu.classList.contains("open") ? "✕" : "☰";
        hamburger.setAttribute("aria-expanded", menu.classList.contains("open"));
        return;
    }

    const link = e.target.closest(".menu-link");
    if (!link) return;

    if (link.classList.contains("has-sub")) {
        link.parentElement.classList.toggle("open");
        link.setAttribute("aria-expanded", link.parentElement.classList.contains("open"));
        return;
    }

    const page = link.dataset.page;
    if (page) {
        loadPage(page);

        if (window.innerWidth <= 768) {
            menu.classList.remove("open");
            hamburger.textContent = "☰";
            hamburger.setAttribute("aria-expanded", false);
        }
    }
});

function updateMenu(page) {
    document.querySelectorAll(".menu-item")
        .forEach(item => item.classList.remove("open"));

    document.querySelectorAll(".menu-link")
        .forEach(link => link.classList.remove("active"));

    const activeLink = document.querySelector(`[data-page="${page}"]`);

    if (activeLink) {
        activeLink.classList.add("active");
        const parentMenu = activeLink.closest(".menu-item");
        if (parentMenu) {
            parentMenu.classList.add("open");
        }
    }
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const menuHtml = await fetch("menu.html").then(r => r.text());
        document.getElementById("menu").innerHTML = menuHtml;

        router();

        const preloadPages = ["home", "about_me"];
        for (const page of preloadPages) {
            try {
                const res = await fetch("pages/" + page + ".html");
                if (res.ok) {
                    cache[page] = await res.text();
                    console.log(`✅ Preloaded: ${page}`);
                }
            } catch (err) {
                console.warn(`⚠️ Preload ${page} failed`);
            }
        }

    } catch (err) {
        console.error("❌ Napaka pri inicijalizaciji:", err);
        content.innerHTML = "<h2>Napaka pri nalaganju aplikacije</h2>";
    }
});
