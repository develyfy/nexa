document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const menu = document.getElementById("menu");
    if (!content || !menu) return;

    const headings = Array.from(content.querySelectorAll("h1,h2,h3,h4,h5,h6"));

    headings.forEach((h, i) => {
        if (!h.id) {
            h.id = `heading-${i}`;
        }
        const level = parseInt(h.tagName.substring(1), 10);

        const li = document.createElement("li");
        li.className = "navigation__menu-item";

        const a = document.createElement("a");
        a.href = `#${h.id}`;
        a.textContent = h.textContent;
        a.style.paddingLeft = `${10 + (level - 1) * 5}px`;

        a.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById(h.id).scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            setActive(h.id);
        });

        li.appendChild(a);
        menu.appendChild(li);
    });

    const links = menu.querySelectorAll("a");

    function clearActive() {
        links.forEach((l) => l.classList.remove("active"));
    }
    function setActive(id) {
        clearActive();
        const link = menu.querySelector(`a[href="#${CSS.escape(id)}"]`);
        if (link) link.classList.add("active");
    }

    const observerOptions = {
        root: null,
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
    };

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, observerOptions);

        headings.forEach((h) => io.observe(h));
    } else {
        window.addEventListener("scroll", () => {
            let current = "";
            headings.forEach((h) => {
                const rect = h.getBoundingClientRect();
                if (rect.top <= 100) current = h.id;
            });
            if (current) setActive(current);
        });
    }
});

hljs.highlightAll();
