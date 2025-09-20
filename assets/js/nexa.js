document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".form-textarea-auto").forEach((textarea) => {
        textarea.style.minHeight = "100px";
        textarea.style.overflow = "hidden";

        const resizeTextarea = (el) => {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        };

        textarea.addEventListener("input", function () {
            resizeTextarea(this);
        });

        resizeTextarea(textarea);
    });
});
// Modal
document.addEventListener("DOMContentLoaded", () => {
    function openModal(modal) {
        modal.classList.add("active");
        const modalName = modal.getAttribute("data-modal-name");
        if (modalName) {
            history.pushState(null, null, `#${modalName}`);
        }
    }

    function closeModal(modal) {
        modal.classList.add("closing");
        setTimeout(() => {
            modal.classList.remove("active", "closing");
            if (modal.getAttribute("data-modal-name")) {
                history.pushState(null, null, window.location.pathname);
            }
        }, 300);
    }

    document.querySelectorAll("[data-modal-btn]").forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal-btn");
            const modal = document.querySelector(`[data-modal="${modalId}"]`);
            openModal(modal);
        });
    });

    document.querySelectorAll("[data-modal-close]").forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal-close");
            const modal = document.querySelector(`[data-modal="${modalId}"]`);
            closeModal(modal);
        });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal && modal.hasAttribute("data-close-backdrop")) {
                closeModal(modal);
            }
        });
    });

    // Открытие модального окна при загрузке, если есть хеш в URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        const modal = document.querySelector(`[data-modal-name="${hash}"]`);
        if (modal) {
            openModal(modal);
        }
    }
});
// --------------------------------------
// Tabs
// --------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const saveToStorage = (key, value) => {
        localStorage.setItem(key, value);
    };

    const getFromStorage = (key) => {
        return localStorage.getItem(key);
    };

    const initTabs = () => {
        document.querySelectorAll(`[data-tabs-container]`).forEach((container) => {
            container.querySelectorAll("[data-tabs-content]").forEach((content) => {
                content.classList.remove("show");
            });
        });
        document.querySelectorAll("[data-tabs]").forEach((tabGroupTabs) => {
            const groupKeyTabs = tabGroupTabs.getAttribute("data-tabs");
            const buttonsTabs = tabGroupTabs.querySelectorAll("[data-tabs-btn]");
            const containersTabs = document.querySelectorAll(`[data-tabs-container="${groupKeyTabs}"]`);

            const activateTab = (targetTabTabs, updateHash = true, saveToStorageFlag = true) => {
                buttonsTabs.forEach((btn) => {
                    btn.classList.toggle("active", btn.getAttribute("data-tabs-btn") === targetTabTabs);
                });

                containersTabs.forEach((containerTabs) => {
                    containerTabs.querySelectorAll("[data-tabs-content]").forEach((contentTabs) => {
                        contentTabs.classList.toggle("show", contentTabs.getAttribute("data-tabs-content") == targetTabTabs);
                    });
                });

                const activeButton = tabGroupTabs.querySelector(`[data-tabs-btn="${targetTabTabs}"]`);
                if (activeButton) {
                    if (updateHash) {
                        if (activeButton.hasAttribute("data-tabs-name")) {
                            history.replaceState(null, null, `#${activeButton.getAttribute("data-tabs-name")}`);
                        } else {
                            history.replaceState(null, null, " ");
                        }
                    }
                    if (!updateHash && saveToStorageFlag && activeButton.hasAttribute("data-tabs-save")) {
                        saveToStorage(`tab_${groupKeyTabs}`, targetTabTabs);
                    }
                }
            };

            const checkHashOrStorage = () => {
                const hashTabs = window.location.hash.substring(1);
                let tabToActivate = null;
                let fp = 0;
                const savedTab = getFromStorage(`tab_${groupKeyTabs}`);
                if (savedTab) {
                    tabToActivate = savedTab;
                }

                if (hashTabs != "") {
                    const buttonWithHash = tabGroupTabs.querySelector(`[data-tabs-name="${hashTabs}"]`);
                    if (buttonWithHash) {
                        tabToActivate = buttonWithHash.getAttribute("data-tabs-btn");
                    }
                }

                if (!tabToActivate) {
                    fp = 1;
                    tabToActivate = buttonsTabs[0]?.getAttribute("data-tabs-btn");
                }

                if (tabToActivate) {
                    activateTab(tabToActivate, fp != 1 ? groupKeyTabs == "tags" : false, groupKeyTabs == "cookie");
                }
            };

            buttonsTabs.forEach((buttonTabs) => {
                buttonTabs.addEventListener("click", () => {
                    activateTab(buttonTabs.getAttribute("data-tabs-btn"), groupKeyTabs == "tags", groupKeyTabs == "cookie");
                });
            });

            checkHashOrStorage();
        });
    };

    initTabs();
});
// --------------------------------
// Drop
// --------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const defaultDropOpen = "click"; // По умолчанию click
    const defaultDropDelay = 0.2 * 1000; // По умолчанию 0.2s для hover
    const drops = document.querySelectorAll(".dropdown, .dropup, .dropend, .dropstart");

    drops.forEach((drop) => {
        const button = drop.querySelector(".drop-toggle");
        const content = drop.querySelector(".drop-content");
        if (!button || !content) return;

        let dropOpenType = button.dataset.dropOpen || defaultDropOpen;
        let hasDropDelay = button.hasAttribute("data-drop-delay");
        let dropDelay = hasDropDelay ? parseFloat(button.dataset.dropDelay) * 1000 : dropOpenType === "hover" ? defaultDropDelay : 0;
        let timeoutId;
        let isMouseOver = false;

        function toggleDrop(forceClose = false) {
            const isOpen = button.classList.contains("active");
            if (forceClose || isOpen) {
                button.classList.remove("active");
                button.blur();
                content.classList.remove("show");
                button.setAttribute("aria-expanded", "false");
            } else {
                closeAllDrops();
                button.classList.add("active");
                content.classList.add("show");
                button.setAttribute("aria-expanded", "true");
            }
        }

        function closeAllDrops() {
            drops.forEach((drop) => {
                const btn = drop.querySelector(".drop-toggle");
                const cont = drop.querySelector(".drop-content");
                if (btn && cont) {
                    btn.classList.remove("active");
                    btn.blur();
                    cont.classList.remove("show");
                    btn.setAttribute("aria-expanded", "false");
                }
            });
        }

        if (dropOpenType === "click") {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleDrop();
            });

            if (hasDropDelay) {
                drop.addEventListener("mouseenter", () => {
                    clearTimeout(timeoutId);
                    isMouseOver = true;
                });

                drop.addEventListener("mouseleave", () => {
                    isMouseOver = false;
                    timeoutId = setTimeout(() => {
                        if (!isMouseOver) toggleDrop(true);
                    }, dropDelay);
                });
            }
        } else if (dropOpenType === "hover") {
            drop.addEventListener("mouseenter", () => {
                clearTimeout(timeoutId);
                isMouseOver = true;
                button.classList.add("active");
                content.classList.add("show");
                button.setAttribute("aria-expanded", "true");
            });

            drop.addEventListener("mouseleave", () => {
                isMouseOver = false;
                timeoutId = setTimeout(() => {
                    if (!isMouseOver) toggleDrop(true);
                }, dropDelay);
            });
        } else if (dropOpenType === "clickonly") {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleDrop();
            });

            if (hasDropDelay) {
                drop.addEventListener("mouseenter", () => {
                    clearTimeout(timeoutId);
                    isMouseOver = true;
                });

                drop.addEventListener("mouseleave", () => {
                    isMouseOver = false;
                    timeoutId = setTimeout(() => {
                        if (!isMouseOver) toggleDrop(true);
                    }, dropDelay);
                });
            }
        }
    });

    document.addEventListener("click", (event) => {
        drops.forEach((drop) => {
            const button = drop.querySelector(".drop-toggle");
            const content = drop.querySelector(".drop-content");
            if (!button || !content) return;

            let dropOpenType = button.dataset.dropOpen || defaultDropOpen;
            let hasDropDelay = button.hasAttribute("data-drop-delay");

            if ((dropOpenType !== "clickonly" || hasDropDelay) && dropOpenType !== "clickonly") {
                if (!drop.contains(event.target)) {
                    button.classList.remove("active");
                    button.blur();
                    content.classList.remove("show");
                    button.setAttribute("aria-expanded", "false");
                }
            }
        });
    });
});

// Dropdown
document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const dropContent = dropdown.querySelector(".drop-content");
        if (!dropContent) return;

        const position = dropContent.getAttribute("data-drop-position") || "start";

        dropContent.style.position = "absolute";
        dropContent.style.top = "100%";
        dropContent.style.zIndex = "1010";

        switch (position) {
            case "center":
                dropContent.style.left = "50%";
                dropContent.style.transform = "translateX(-50%)";
                break;
            case "end":
                dropContent.style.right = "0";
                break;
            case "start":
            default:
                dropContent.style.left = "0";
                break;
        }
    });
});
// Dropup
document.addEventListener("DOMContentLoaded", function () {
    const dropups = document.querySelectorAll(".dropup");

    dropups.forEach((dropup) => {
        const dropContent = dropup.querySelector(".drop-content");
        if (!dropContent) return;
        const position = dropContent.getAttribute("data-drop-position") || "start";

        dropContent.style.position = "absolute";
        dropContent.style.bottom = "100%";
        dropContent.style.zIndex = "1010";

        switch (position) {
            case "center":
                dropContent.style.left = "50%";
                dropContent.style.transform = "translateX(-50%)";
                break;
            case "end":
                dropContent.style.right = "0";
                break;
            case "start":
            default:
                dropContent.style.left = "0";
                break;
        }
    });
});
// Dropstart
document.addEventListener("DOMContentLoaded", function () {
    const dropstarts = document.querySelectorAll(".dropstart");

    dropstarts.forEach((dropstart) => {
        const dropContent = dropstart.querySelector(".drop-content");
        if (!dropContent) return;

        const position = dropContent.getAttribute("data-drop-position") || "start";

        dropContent.style.position = "absolute";
        dropContent.style.right = "100%";
        dropContent.style.zIndex = "1010";

        switch (position) {
            case "center":
                dropContent.style.top = "50%";
                dropContent.style.transform = "translateY(-50%)";
                break;
            case "end":
                dropContent.style.bottom = "0";
                break;
            case "start":
            default:
                dropContent.style.top = "0";
                break;
        }
    });
});
// Dropend
document.addEventListener("DOMContentLoaded", function () {
    const dropends = document.querySelectorAll(".dropend");

    dropends.forEach((dropstart) => {
        const dropContent = dropstart.querySelector(".drop-content");
        if (!dropContent) return;

        const position = dropContent.getAttribute("data-drop-position") || "start";

        dropContent.style.position = "absolute";
        dropContent.style.left = "100%";
        dropContent.style.zIndex = "1010";

        switch (position) {
            case "center":
                dropContent.style.top = "50%";
                dropContent.style.transform = "translateY(-50%)";
                break;
            case "end":
                dropContent.style.bottom = "0";
                break;
            case "start":
            default:
                dropContent.style.top = "0";
                break;
        }
    });
});
// --------------------------------
// Theme
// --------------------------------
const themeToggleButton = document.getElementById("theme-toggle");
const themeLightButton = document.getElementById("theme-light");
const themeDarkButton = document.getElementById("theme-dark");

function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let currentTheme = localStorage.getItem("theme") || getSystemTheme();
document.documentElement.setAttribute("data-theme", currentTheme);
updateActiveButton();

function setTheme(theme) {
    if (document.documentElement.getAttribute("data-theme") !== theme) {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        updateActiveButton();
    }
}

function toggleTheme() {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
}

function updateActiveButton() {
    const appliedTheme = document.documentElement.getAttribute("data-theme");

    if (themeLightButton) {
        themeLightButton.classList.toggle("active", appliedTheme === "light");
    }
    if (themeDarkButton) {
        themeDarkButton.classList.toggle("active", appliedTheme === "dark");
    }
    if (themeToggleButton) {
        themeToggleButton.classList.toggle("active", appliedTheme === "dark");
    }
}

if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
}

if (themeLightButton) {
    themeLightButton.addEventListener("click", () => setTheme("light"));
}

if (themeDarkButton) {
    themeDarkButton.addEventListener("click", () => setTheme("dark"));
}

// --------------------------------
// Spoiler
// --------------------------------

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".spoiler > .spoiler-toggle").forEach((button) => {
        button.addEventListener("click", () => {
            const content = button.nextElementSibling;
            button.classList.toggle("active");

            if (content.classList.contains("show")) {
                content.style.maxHeight = null;
                setTimeout(() => (content.style.visibility = "hidden"), 300);
            } else {
                content.style.visibility = "visible";
                content.style.maxHeight = content.scrollHeight + "px";
            }

            content.classList.toggle("show");
        });
    });
});
// --------------------------------
// Accordion
// --------------------------------
document.querySelectorAll(".accordion").forEach((accordion) => {
    const mode = accordion.dataset.accordion || "hide";

    accordion.querySelectorAll(".accordion-item").forEach((item) => {
        const content = item.querySelector(".accordion-content");
        const button = item.querySelector(".accordion-toggle");
        const isOpen = item.hasAttribute("data-accordion-open");

        content.style.overflow = "hidden";
        content.style.transition = "height 0.3s ease";

        if (isOpen) {
            item.classList.add("active");
            button.classList.add("open");
            content.style.height = content.scrollHeight + "px";
        } else {
            content.style.height = "0";
        }
    });

    accordion.querySelectorAll(".accordion-toggle").forEach((button) => {
        button.addEventListener("click", function () {
            const item = this.closest(".accordion-item");
            const content = item.querySelector(".accordion-content");
            const isActive = item.classList.contains("active");

            if (mode === "hide") {
                if (!isActive) {
                    accordion.querySelectorAll(".accordion-item.active").forEach((openItem) => {
                        openItem.classList.remove("active");
                        openItem.querySelector(".accordion-toggle").classList.remove("open");
                        const openContent = openItem.querySelector(".accordion-content");
                        openContent.style.height = openContent.scrollHeight + "px";
                        setTimeout(() => (openContent.style.height = "0"), 1);
                    });
                }
            }

            item.classList.toggle("active", !isActive);
            this.classList.toggle("open", !isActive);

            if (!isActive) {
                content.style.height = content.scrollHeight + "px";
            } else {
                content.style.height = content.scrollHeight + "px";
                setTimeout(() => (content.style.height = "0"), 1);
            }
        });
    });
});

// --------------------------------
// Validation
// --------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    const inputs = form.querySelectorAll("[data-valid]");
    const submitButton = form.querySelector("button[type='submit']");

    const validateInput = (input) => {
        const isEmpty = input.value.trim() === "";
        const notify = input.dataset.validNotify === "true";
        const errorText = input.dataset.validNotifyText || "Это поле обязательно";

        input.classList.toggle("error", isEmpty);

        let errorDiv = input.nextElementSibling;
        if (errorDiv?.classList.contains("form-error")) {
            errorDiv.remove();
        }

        if (isEmpty && notify) {
            errorDiv = document.createElement("div");
            errorDiv.className = "form-error";
            errorDiv.textContent = errorText;
            input.insertAdjacentElement("afterend", errorDiv);
        }
    };

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        form.querySelectorAll(".form-error").forEach((el) => el.remove());
        inputs.forEach(validateInput);
    });

    inputs.forEach((input) => {
        input.addEventListener("input", () => validateInput(input));

        if (input.dataset.valid.includes("native")) {
            input.addEventListener("blur", () => validateInput(input));
        }
    });
});
// --------------------------------
// Validation
// --------------------------------

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-pane-btn]");
        if (btn) {
            const idPane = btn.getAttribute("data-pane-btn");
            const pane = document.querySelector(`[data-pane='${idPane}']`);
            if (!pane) return;

            const content = pane.querySelector("[data-pane-content]");
            if (!content) return;

            pane.classList.toggle("open");
            content.classList.toggle("show");

            const backdrop = document.querySelector(`[data-pane-backdrop='true']`);
            if (backdrop) {
                document.body.classList.toggle("backdrop", pane.classList.contains("open"));
            }
            return;
        }

        const closeBtn = e.target.closest("[data-pane-close]");
        if (closeBtn) {
            const pane = closeBtn.closest("[data-pane]");
            if (!pane) return;

            const content = pane.querySelector("[data-pane-content]");
            if (!content) return;

            pane.classList.remove("open");
            content.classList.remove("show");
            document.body.classList.remove("backdrop");
            return;
        }

        document.querySelectorAll("[data-pane].open").forEach((pane) => {
            const content = pane.querySelector("[data-pane-content]");
            if (content && !content.contains(e.target)) {
                pane.classList.remove("open");
                content.classList.remove("show");
                document.body.classList.remove("backdrop");
            }
        });
    });
});

// --------------------------------
// Scroll
// --------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll("[data-scroll]");

    const checkScroll = () => {
        elements.forEach((el) => {
            const scrollValue = parseInt(el.getAttribute("data-scroll"), 10) || 0;
            const customClass = el.getAttribute("data-scroll-class") || "event";

            if (window.scrollY >= scrollValue) {
                el.classList.add(customClass);
            } else {
                el.classList.remove(customClass);
            }
        });
    };

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});

// --------------------------------
// Date
// --------------------------------

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-date="Y"]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });
});
