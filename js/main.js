(() => {
  const header = document.getElementById("header");
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const WHATSAPP_URL = "https://wa.me/527226395654";

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const eventModal = document.getElementById("eventModal");
  const newsModal = document.getElementById("newsModal");
  const galleryGrid = document.getElementById("galleryGrid");
  const galleryEmpty = document.getElementById("galleryEmpty");
  const galleryTabs = document.getElementById("galleryTabs");
  const newsGrid = document.getElementById("newsGrid");

  const IMAGE_FALLBACK_BASE =
    "file:///C:/Users/gemelo/.cursor/projects/c-Users-gemelo-Documents-MIKE-TwisoTech-BARBACOA/site/assets/images/";

  let galleryPhotos = [];
  let visiblePhotos = [];
  let lightboxIndex = 0;
  let eventos = [];
  let activeModalOpen = false;

  const IMAGE_ALIASES = {
    "terraza-hero.png": ["IMG3.png", "terraza-hero.png", "LOGO.png"],
    "terraza-bosque.png": ["IMG3.png", "terraza-bosque.png", "LOGO.png"],
    "terraza-montana.png": ["IMG3.png", "terraza-montana.png", "LOGO.png"],
    "cartel-inauguracion.png": ["IMG3.png", "cartel-sabados.png", "LOGO.png"],
    "cartel-sabados.png": ["IMG3.png", "LOGO.png"],
    "logo-gemelos-ortega.png": ["LOGO.png"],
    "LOGO.png": ["LOGO.png"],
    "IMG3.png": ["IMG3.png", "LOGO.png"]
  };

  const fileNameOf = (src) => (src || "").split("/").pop().split("?")[0];

  const candidateSrcs = (src) => {
    const name = fileNameOf(src);
    const aliases = IMAGE_ALIASES[name] || [name];
    const list = [];
    aliases.forEach((alias) => {
      list.push(`assets/images/${alias}`);
      list.push(IMAGE_FALLBACK_BASE + alias);
    });
    return [...new Set(list)];
  };

  const resolveImageSrc = (src) => candidateSrcs(src)[0] || src;

  const attachImageFallback = (root = document) => {
    root.querySelectorAll("img[src*='assets/images/']").forEach((img) => {
      if (img.dataset.fallbackBound === "1") return;
      img.dataset.fallbackBound = "1";
      const original = img.getAttribute("src");
      const candidates = candidateSrcs(original);
      let i = Math.max(0, candidates.indexOf(original));
      img.addEventListener("error", () => {
        i += 1;
        if (i < candidates.length) img.src = candidates[i];
      });
    });
  };

  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  const setActiveLink = () => {
    let current = "inicio";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  const observeReveals = () => {
    const revealEls = document.querySelectorAll(".reveal:not(.is-visible)");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  };

  document.querySelectorAll(".menu-tab[data-category]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.category;
      const tabs = document.querySelectorAll(".menu-tab[data-category]");
      const items = document.querySelectorAll(".menu-item");
      tabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      items.forEach((item) => {
        const show = category === "all" || item.dataset.category === category;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  const setBodyLock = (locked) => {
    document.body.style.overflow = locked || activeModalOpen ? "hidden" : "";
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg || !visiblePhotos.length) return;
    lightboxIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const photo = visiblePhotos[lightboxIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt || "";
    if (lightboxCaption) lightboxCaption.textContent = photo.titulo || photo.alt || "";
    lightbox.hidden = false;
    setBodyLock(true);
    attachImageFallback(lightbox);
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    if (lightboxCaption) lightboxCaption.textContent = "";
    setBodyLock(false);
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(lightboxIndex - 1);
  });
  lightboxNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(lightboxIndex + 1);
  });

  const renderGallery = (category = "all") => {
    if (!galleryGrid) return;
    visiblePhotos =
      category === "all"
        ? [...galleryPhotos]
        : galleryPhotos.filter((p) => p.categoria === category);

    galleryGrid.innerHTML = visiblePhotos
      .map(
        (photo, index) => `
      <button type="button" class="gallery-item reveal" data-index="${index}" aria-label="Ampliar: ${photo.titulo || photo.alt}">
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" />
        <span class="gallery-overlay"><span>${photo.titulo || ""}</span></span>
      </button>`
      )
      .join("");

    if (galleryEmpty) galleryEmpty.hidden = visiblePhotos.length > 0;

    galleryGrid.querySelectorAll(".gallery-item").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(Number(btn.dataset.index)));
    });

    attachImageFallback(galleryGrid);
    observeReveals();
  };

  galleryTabs?.querySelectorAll("[data-gallery]").forEach((tab) => {
    tab.addEventListener("click", () => {
      galleryTabs.querySelectorAll("[data-gallery]").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      renderGallery(tab.dataset.gallery);
    });
  });

  const fillEventModal = (evento) => {
    document.getElementById("eventModalLabel").textContent = evento.etiqueta || "¡Novedad!";
    document.getElementById("eventModalTitle").textContent = evento.titulo || "";
    document.getElementById("eventModalMeta").textContent = [evento.fecha, evento.hora]
      .filter(Boolean)
      .join(" · ");
    document.getElementById("eventModalPlace").textContent = evento.lugar || "Barbacoa La Virgencita";
    document.getElementById("eventModalDesc").textContent = evento.descripcion || "";
    const img = document.getElementById("eventModalImage");
    img.src = evento.imagen || "";
    img.alt = evento.titulo || "Evento";
    const cta = document.getElementById("eventModalCta");
    cta.textContent = evento.ctaTexto || "Ver más";
    cta.setAttribute("href", evento.ctaUrl || "#novedades");
    attachImageFallback(eventModal);
  };

  const openEventModal = (evento) => {
    if (!eventModal || !evento) return;
    fillEventModal(evento);
    eventModal.hidden = false;
    activeModalOpen = true;
    setBodyLock(true);
  };

  const closeEventModal = (persist = true, eventoId = "") => {
    if (!eventModal) return;
    eventModal.hidden = true;
    activeModalOpen = false;
    setBodyLock(false);
    if (persist && eventoId) {
      sessionStorage.setItem(`barbacoa_modal_seen_${eventoId}`, "1");
    }
  };

  document.getElementById("eventModalClose")?.addEventListener("click", () => {
    const active = eventos.find((e) => e.activo && e.mostrarEnModal);
    closeEventModal(true, active?.id || "");
  });
  document.getElementById("eventModalOverlay")?.addEventListener("click", () => {
    const active = eventos.find((e) => e.activo && e.mostrarEnModal);
    closeEventModal(true, active?.id || "");
  });
  document.getElementById("eventModalCta")?.addEventListener("click", () => {
    const active = eventos.find((e) => e.activo && e.mostrarEnModal);
    closeEventModal(true, active?.id || "");
  });

  const openNewsModal = (evento) => {
    if (!newsModal || !evento) return;
    document.getElementById("newsModalTitle").textContent = evento.titulo || "";
    document.getElementById("newsModalMeta").textContent = [evento.fecha, evento.hora, evento.lugar]
      .filter(Boolean)
      .join(" · ");
    document.getElementById("newsModalDesc").textContent =
      evento.descripcionCompleta || evento.descripcion || "";
    const img = document.getElementById("newsModalImage");
    img.src = evento.imagen || "";
    img.alt = evento.titulo || "";
    const cta = document.getElementById("newsModalCta");
    cta.textContent = evento.ctaTexto || "Ver más";
    cta.setAttribute("href", evento.ctaUrl || "#visitanos");
    newsModal.hidden = false;
    activeModalOpen = true;
    setBodyLock(true);
    attachImageFallback(newsModal);
  };

  const closeNewsModal = () => {
    if (!newsModal) return;
    newsModal.hidden = true;
    activeModalOpen = false;
    setBodyLock(false);
  };

  document.getElementById("newsModalClose")?.addEventListener("click", closeNewsModal);
  document.getElementById("newsModalOverlay")?.addEventListener("click", closeNewsModal);
  document.getElementById("newsModalCta")?.addEventListener("click", closeNewsModal);

  const renderNews = () => {
    if (!newsGrid) return;
    const activos = eventos.filter((e) => e.activo);
    if (!activos.length) {
      newsGrid.innerHTML = `<p class="section-lead" style="text-align:center">Pronto publicaremos nuevas novedades.</p>`;
      return;
    }

    newsGrid.innerHTML = activos
      .map(
        (evento, index) => `
      <article class="news-card reveal">
        <div class="news-card-media">
          <img src="${evento.imagen}" alt="${evento.titulo}" loading="lazy" />
        </div>
        <div class="news-card-body">
          <p class="news-card-date">${evento.fecha || ""}${evento.hora ? " · " + evento.hora : ""}</p>
          <h3>${evento.titulo}</h3>
          <p>${evento.descripcion || ""}</p>
          <button type="button" class="btn btn-cta news-read-more" data-news-index="${index}">Leer más</button>
        </div>
      </article>`
      )
      .join("");

    newsGrid.querySelectorAll("[data-news-index]").forEach((btn) => {
      btn.addEventListener("click", () => openNewsModal(activos[Number(btn.dataset.newsIndex)]));
    });

    attachImageFallback(newsGrid);
    observeReveals();
  };

  const scheduleWelcomeModal = () => {
    const activo = eventos.find((e) => e.activo && e.mostrarEnModal);
    if (!activo) return;
    const seenKey = `barbacoa_modal_seen_${activo.id}`;
    if (sessionStorage.getItem(seenKey) === "1") return;

    window.setTimeout(() => {
      openEventModal(activo);
    }, 2500);
  };

  const FALLBACK_GALERIA = {
    fotos: [
      { src: "assets/images/IMG3.png", alt: "Terraza con techo de teja", titulo: "Nuestra terraza", categoria: "lugar" },
      { src: "assets/images/IMG3.png", alt: "Terraza entre el bosque", titulo: "Vista al bosque", categoria: "lugar" },
      { src: "assets/images/LOGO.png", alt: "Horno a la leña", titulo: "Horno y leña", categoria: "lugar" },
      { src: "assets/images/LOGO.png", alt: "Barbacoa de borrego", titulo: "Barbacoa de borrego", categoria: "menu" },
      { src: "assets/images/IMG3.png", alt: "Antojitos en terraza", titulo: "Antojitos en la terraza", categoria: "menu" },
      { src: "assets/images/IMG3.png", alt: "Comida al aire libre", titulo: "Comida al aire libre", categoria: "menu" },
      { src: "assets/images/IMG3.png", alt: "Eventos", titulo: "Eventos en la terraza", categoria: "eventos" },
      { src: "assets/images/LOGO.png", alt: "Marca", titulo: "Nuestra marca", categoria: "eventos" },
      { src: "assets/images/IMG3.png", alt: "Clientes y paisaje", titulo: "Disfrutando el paisaje", categoria: "clientes" },
      { src: "assets/images/IMG3.png", alt: "Reuniones", titulo: "Reuniones en familia", categoria: "clientes" }
    ]
  };

  const FALLBACK_EVENTOS = {
    eventos: [
      {
        id: "inauguracion-terraza-2026",
        titulo: "Inauguración de nuestra terraza",
        etiqueta: "¡Evento Especial!",
        fecha: "28 de Septiembre 2026",
        hora: "9:00 AM",
        lugar: "Barbacoa La Virgencita",
        descripcion: "Ven a disfrutar barbacoa de borrego de horno al aire libre.",
        descripcionCompleta:
          "Te invitamos a la inauguración de nuestra terraza. Barbacoa de borrego de horno y el ambiente del bosque.",
        imagen: "assets/images/IMG3.png",
        activo: true,
        mostrarEnModal: true,
        ctaTexto: "WhatsApp",
        ctaUrl: "https://wa.me/527226395654"
      },
      {
        id: "barbacoa-domingos",
        titulo: "Barbacoa de borrego los domingos",
        etiqueta: "¡Novedad!",
        fecha: "Solo domingos",
        hora: "8:00 a.m. – 1:00 p.m.",
        lugar: "Barbacoa La Virgencita",
        descripcion: "Barbacoa de borrego de horno. Solo domingos de 8:00 a.m. a 1:00 p.m.",
        descripcionCompleta: "Carretera Toluca–Naucalpan Km 32.8.",
        imagen: "assets/images/IMG3.png",
        activo: true,
        mostrarEnModal: false,
        ctaTexto: "Ver menú",
        ctaUrl: "#menu"
      },
      {
        id: "musica-en-vivo",
        titulo: "Música en vivo (próximamente)",
        etiqueta: "¡Novedad!",
        fecha: "Por anunciar",
        hora: "Por confirmar",
        lugar: "Barbacoa La Virgencita",
        descripcion: "Pronto ambientaremos la terraza con música en vivo.",
        descripcionCompleta: "Publicaremos fecha y horario aquí.",
        imagen: "assets/images/LOGO.png",
        activo: true,
        mostrarEnModal: false,
        ctaTexto: "WhatsApp",
        ctaUrl: "https://wa.me/527226395654"
      }
    ]
  };

  const loadJSON = async (path, fallback) => {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      return await res.json();
    } catch (err) {
      console.warn("No se pudo cargar", path, "- usando datos locales.", err);
      return fallback;
    }
  };

  const bootstrap = async () => {
    attachImageFallback(document);

    const galeriaData = await loadJSON("data/galeria.json", FALLBACK_GALERIA);
    galleryPhotos = Array.isArray(galeriaData.fotos) ? galeriaData.fotos : FALLBACK_GALERIA.fotos;
    renderGallery("all");

    const eventosData = await loadJSON("data/eventos.json", FALLBACK_EVENTOS);
    eventos = Array.isArray(eventosData.eventos) ? eventosData.eventos : FALLBACK_EVENTOS.eventos;
    renderNews();
    scheduleWelcomeModal();
    observeReveals();
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeEventModal(true, eventos.find((ev) => ev.activo && ev.mostrarEnModal)?.id || "");
      closeNewsModal();
      closeNav();
    }
    if (!lightbox?.hidden) {
      if (e.key === "ArrowLeft") openLightbox(lightboxIndex - 1);
      if (e.key === "ArrowRight") openLightbox(lightboxIndex + 1);
    }
  });

  bootstrap();
})();
