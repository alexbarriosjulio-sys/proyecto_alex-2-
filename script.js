/* ==========================================================
   Alexart - JavaScript
   1. Menú móvil (hamburguesa)
   2. Enlace activo según la sección visible
   3. Aparición suave de las secciones al hacer scroll
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const enlaces = document.querySelectorAll('.menu-list a');

  /* ---------- 1. Menú móvil ---------- */

  const cerrarMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };

  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const abierto = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(abierto));
      toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    // Cerrar al elegir una opción
    enlaces.forEach((enlace) => enlace.addEventListener('click', cerrarMenu));

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrarMenu();
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) cerrarMenu();
    });

    // Cerrar si la pantalla pasa a tamaño de escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) cerrarMenu();
    });
  }

  /* ---------- 2. Enlace activo ---------- */

  const secciones = document.querySelectorAll('main section[id]');

  if ('IntersectionObserver' in window && secciones.length) {
    const marcarActivo = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const id = entrada.target.id;
          enlaces.forEach((enlace) => {
            const activo = enlace.getAttribute('href').endsWith('#' + id);
            enlace.classList.toggle('activo', activo);
            if (activo) {
              enlace.setAttribute('aria-current', 'true');
            } else {
              enlace.removeAttribute('aria-current');
            }
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    secciones.forEach((seccion) => marcarActivo.observe(seccion));
  }

  /* ---------- 3. Aparición suave al hacer scroll ---------- */

  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reducirMovimiento) {
    const elementos = document.querySelectorAll(
      'main section h1, main section h2, main section p, main section img, main section li'
    );

    const revelar = new IntersectionObserver(
      (entradas, observador) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elementos.forEach((el) => {
      el.classList.add('reveal');
      revelar.observe(el);
    });
  }
});