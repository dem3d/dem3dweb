// DEM3D — interacciones básicas

document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Filtros de galería
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  // Formulario de contacto (envío vía mailto como fallback)
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const service = form.querySelector('#service').value;
      const message = form.querySelector('#message').value;

      const subject = encodeURIComponent(`Consulta de servicio — ${name}`);
      const body = encodeURIComponent(
        `Nombre: ${name}\nEmail: ${email}\nServicio de interés: ${service}\n\nMensaje:\n${message}`
      );

      window.location.href = `mailto:ddem3d@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Desplegable de colores (clic en el cuadrado de color)
  const swatchButtons = document.querySelectorAll('.material-card .swatch');

  const closeAllSwatches = (except) => {
    document.querySelectorAll('.swatch-wrap.is-open').forEach(wrap => {
      if (wrap !== except) {
        wrap.classList.remove('is-open');
        wrap.querySelector('.swatch').setAttribute('aria-expanded', 'false');
      }
    });
  };

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrap = btn.closest('.swatch-wrap');
      const isOpen = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      closeAllSwatches(isOpen ? wrap : null);
    });
  });

  document.addEventListener('click', () => closeAllSwatches(null));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllSwatches(null);
  });

  // Parallax del fondo del hero
  const parallaxEl = document.querySelector('[data-parallax]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (parallaxEl && !prefersReducedMotion) {
    const speed = 0.35; // 0 = fijo, 1 = se mueve igual que el scroll
    let ticking = false;

    const updateParallax = () => {
      const offset = window.scrollY * speed;
      parallaxEl.style.transform = `translateY(${offset}px)`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      // Solo merece la pena calcular mientras el hero esté cerca del viewport
      if (window.scrollY > window.innerHeight * 1.5) return;
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
});
