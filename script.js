const ACTUALITE = {
    titre: "",
    date: "",
    texte: "",
    lien: "",
    lienTexte: ""
};

const PROFIL = {
    email: "Ezekieldeli677@gmail.com",
    telephone: "+237 697099589"
};

(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    const hasActualite = [ACTUALITE.titre, ACTUALITE.texte, ACTUALITE.lien]
        .some((value) => value.trim());

    if (hasActualite) {
        const news = document.createElement("section");
        news.className = "section section--paper section--ruled";
        news.id = "actualite";
        news.setAttribute("aria-labelledby", "titre-actualite");

        const grid = document.createElement("div");
        grid.className = "section__grid";
        const head = document.createElement("div");
        head.className = "section__head";
        const heading = document.createElement("h2");
        heading.className = "section__title";
        heading.id = "titre-actualite";
        heading.textContent = "Actualité et projets en cours";
        head.appendChild(heading);

        const body = document.createElement("div");
        body.className = "section__body news reveal";

        if (ACTUALITE.date.trim()) {
            const date = document.createElement("p");
            date.className = "news__date";
            date.textContent = ACTUALITE.date;
            body.appendChild(date);
        }
        if (ACTUALITE.titre.trim()) {
            const title = document.createElement("h3");
            title.className = "news__title";
            title.textContent = ACTUALITE.titre;
            body.appendChild(title);
        }
        if (ACTUALITE.texte.trim()) {
            const text = document.createElement("p");
            text.className = "news__text";
            text.textContent = ACTUALITE.texte;
            body.appendChild(text);
        }
        if (ACTUALITE.lien.trim()) {
            const link = document.createElement("a");
            link.className = "text-link";
            link.href = ACTUALITE.lien;
            link.rel = "noopener";
            link.textContent = ACTUALITE.lienTexte.trim() || "En savoir plus";
            body.appendChild(link);
        }

        grid.append(head, body);
        news.appendChild(grid);
        const hero = $("#accueil");
        if (hero) hero.after(news);

        const navList = $(".site-nav ul");
        if (navList) {
            const item = document.createElement("li");
            const navLink = document.createElement("a");
            navLink.href = "#actualite";
            navLink.textContent = "Actualité";
            item.appendChild(navLink);
            navList.prepend(item);
        }
    }

    /* ---------- Badges : zone masquée tant qu'il n'y a aucun badge ---------- */
    const badgeZone = $("#zone-badges");
    if (badgeZone && !$(".badge", badgeZone)) badgeZone.hidden = true;

    /* ---------- Rubrique active dans la navigation ---------- */
    const navLinks = $$('.site-nav a[href^="#"]');
    const sections = navLinks
        .map((link) => $(link.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const activate = (id) => {
            navLinks.forEach((link) => {
                const isCurrent = link.getAttribute("href") === `#${id}`;
                if (isCurrent) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
        };
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => { if (entry.isIntersecting) activate(entry.target.id); });
        }, { rootMargin: "-45% 0px -50% 0px" });
        sections.forEach((section) => spy.observe(section));
    }

    /* ---------- Apparition au défilement ---------- */
    const revealItems = $$(".reveal");
    if ("IntersectionObserver" in window && revealItems.length) {
        const reveal = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
        revealItems.forEach((item) => reveal.observe(item));
    } else {
        // Anciens navigateurs : tout afficher immédiatement
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    /* ---------- Contact : copier l'email, afficher le téléphone ---------- */
    const status = $("#statut-contact");
    const say = (message) => { if (status) status.textContent = message; };

    const copyButton = $("#btn-copier");
    if (copyButton) {
        const defaultLabel = copyButton.textContent;
        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(PROFIL.email);
                copyButton.textContent = "Adresse copiée";
                say("Adresse email copiée dans le presse-papiers.");
            } catch (error) {
                // Repli : sélectionne l'adresse pour qu'elle puisse être copiée à la main
                const link = $("#lien-email");
                if (link) {
                    const range = document.createRange();
                    range.selectNodeContents(link);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                copyButton.textContent = "Adresse sélectionnée";
                say("Copie automatique impossible. L'adresse est sélectionnée : copiez-la avec Ctrl+C.");
            }
            setTimeout(() => { copyButton.textContent = defaultLabel; }, 2600);
        });
    }

    const phoneButton = $("#btn-telephone");
    const phoneZone = $("#zone-telephone");
    if (phoneButton && phoneZone) {
        if (!PROFIL.telephone) {
            phoneButton.hidden = true;
        } else {
            phoneButton.addEventListener("click", () => {
                const opened = phoneButton.getAttribute("aria-expanded") === "true";
                if (opened) {
                    phoneZone.hidden = true;
                    phoneZone.textContent = "";
                    phoneButton.setAttribute("aria-expanded", "false");
                    phoneButton.textContent = "Afficher le téléphone";
                    return;
                }
                const link = document.createElement("a");
                link.href = `tel:${PROFIL.telephone.replace(/\s+/g, "")}`;
                link.textContent = PROFIL.telephone;
                phoneZone.textContent = "";
                phoneZone.appendChild(link);
                phoneZone.hidden = false;
                phoneButton.setAttribute("aria-expanded", "true");
                phoneButton.textContent = "Masquer le téléphone";
                say("Numéro de téléphone affiché.");
            });
        }
    }

    /* ---------- Galerie : diaporama d'une image à la fois ---------- */
    const box = $("#lightbox");
    const boxImg = $("#lightbox-img");
    const boxCaption = $("#lightbox-caption");
    const galleryViewport = $(".gallery-slider__viewport");
    const galleryDotsWrap = $(".gallery-slider__dots");
    const galleryCaption = $("#gallery-caption");
    const galleryPrev = $("#gallery-prev");
    const galleryNext = $("#gallery-next");
    const initializeGallery = async () => {
        if (!galleryViewport || !galleryDotsWrap) return;

        const response = await fetch("assets/gallery/gallery.json", { cache: "no-cache" });
        if (!response.ok) throw new Error("Gallery manifest unavailable");
        const manifest = await response.json();
        const galleryImages = Array.isArray(manifest.images) ? manifest.images : [];
        if (!galleryImages.length) {
            galleryViewport.textContent = "Aucune image à afficher.";
            return;
        }

        galleryViewport.innerHTML = "";
        galleryDotsWrap.innerHTML = "";

        galleryImages.forEach((src, index) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "gallery__slide";
            item.dataset.full = src;
            item.dataset.caption = `Photo ${index + 1}`;
            item.dataset.alt = `Photo ${index + 1} de la galerie de Deli Mha Ezekiel`;
            item.setAttribute("aria-label", `Afficher la photo ${index + 1}`);

            const img = document.createElement("img");
            img.alt = item.dataset.alt;
            img.width = 1200;
            img.height = 900;
            img.decoding = "async";
            img.addEventListener("load", () => {
                img.classList.toggle("is-landscape", img.naturalWidth > img.naturalHeight);
            });
            item.appendChild(img);

            item.addEventListener("click", () => {
                if (box && boxImg && typeof box.showModal === "function") {
                    boxImg.src = item.dataset.full;
                    boxImg.alt = item.dataset.alt || "";
                    if (boxCaption) boxCaption.textContent = item.dataset.caption || "";
                    box.showModal();
                }
            });

            galleryViewport.appendChild(item);

            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = `gallery-slider__dot${index === 0 ? " is-active" : ""}`;
            dot.setAttribute("aria-label", `Afficher la photo ${index + 1}`);
            galleryDotsWrap.appendChild(dot);
        });

        const gallerySlides = $$(".gallery__slide");
        const galleryDots = $$(".gallery-slider__dot");

        if (gallerySlides.length) {
            let currentSlide = -1;
            let slideRequest = 0;

            const showSlide = (index) => {
                const requestedIndex = (index + gallerySlides.length) % gallerySlides.length;
                const requestId = ++slideRequest;
                const slide = gallerySlides[requestedIndex];
                const image = $("img", slide);
                const activateSlide = () => {
                    if (requestId !== slideRequest) return;
                    currentSlide = requestedIndex;
                    gallerySlides.forEach((item, slideIndex) => {
                        item.classList.toggle("is-active", slideIndex === currentSlide);
                    });
                    galleryDots.forEach((dot, dotIndex) => {
                        dot.classList.toggle("is-active", dotIndex === currentSlide);
                    });
                    if (galleryCaption) galleryCaption.textContent = slide.dataset.caption || "";
                };

                if (image.complete && image.naturalWidth > 0) {
                    activateSlide();
                } else {
                    image.addEventListener("load", activateSlide, { once: true });
                    image.addEventListener("error", activateSlide, { once: true });
                    if (image.dataset.requested !== "true") {
                        image.dataset.requested = "true";
                        image.src = slide.dataset.full;
                    }
                }
            };

            if (galleryPrev) {
                galleryPrev.addEventListener("click", () => {
                    showSlide(currentSlide - 1);
                });
            }

            if (galleryNext) {
                galleryNext.addEventListener("click", () => {
                    showSlide(currentSlide + 1);
                });
            }

            galleryDots.forEach((dot, index) => {
                dot.addEventListener("click", () => {
                    showSlide(index);
                });
            });

            showSlide(0);
        }
    };

    const loadGallery = () => initializeGallery().catch(() => {
        if (galleryViewport) galleryViewport.textContent = "La galerie est momentanément indisponible.";
    });
    const gallerySection = $("#galerie");
    if (gallerySection && "IntersectionObserver" in window) {
        const galleryObserver = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                galleryObserver.disconnect();
                loadGallery();
            }
        }, { rootMargin: "300px 0px" });
        galleryObserver.observe(gallerySection);
    } else {
        loadGallery();
    }

    if (box && boxImg && typeof box.showModal === "function") {
        $("#lightbox-close").addEventListener("click", () => box.close());
        box.addEventListener("click", (event) => { if (event.target === box) box.close(); });
        box.addEventListener("close", () => { boxImg.src = ""; });
    }

    /* ---------- Année du pied de page ---------- */
    const year = $("#annee");
    if (year) year.textContent = String(new Date().getFullYear());
})();
