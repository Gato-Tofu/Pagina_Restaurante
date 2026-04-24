document.addEventListener('DOMContentLoaded', () => {

  // -- Navbar: añadir clase al hacer scroll --
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // -- Hamburger: abrir/cerrar menú móvil --
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al pulsar un enlace
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Cerrar al hacer clic fuera del nav
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  // -- Reveal al hacer scroll --
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  // -- Filtro del menú --
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      menuCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;

        if (show) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity .4s ease, transform .4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
          card.style.opacity = '';
          card.style.transform = '';
          card.style.transition = '';
        }
      });
    });
  });


  // -- Counter de personas --
  const personasInput = document.getElementById('personas');
  document.getElementById('incBtn').addEventListener('click', () => {
    if (+personasInput.value < 20) personasInput.value = +personasInput.value + 1;
  });
  document.getElementById('decBtn').addEventListener('click', () => {
    if (+personasInput.value > 1) personasInput.value = +personasInput.value - 1;
  });


  // -- Formulario de reserva --
  const reservaForm = document.getElementById('reservaForm');
  const formSuccess = document.getElementById('formSuccess');

  // Fecha mínima: hoy
  document.getElementById('fecha').setAttribute('min', new Date().toISOString().split('T')[0]);

  reservaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const { nombre, email, fecha, hora } = reservaForm;

    if (!nombre.value.trim() || !email.value.trim() || !fecha.value || !hora.value) {
      shakeForm(); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      highlight(email); return;
    }

    submitForm();
  });

  function highlight(field) {
    field.style.borderColor = '#c0392b';
    field.focus();
    setTimeout(() => { field.style.borderColor = ''; }, 2000);
  }

  function shakeForm() {
    reservaForm.style.animation = 'shake .4s ease';
    reservaForm.addEventListener('animationend', () => { reservaForm.style.animation = ''; }, { once: true });
  }

  function submitForm() {
    const btn = reservaForm.querySelector('.btn-primary');
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    setTimeout(() => {
      reservaForm.reset();
      personasInput.value = 2;
      btn.textContent = 'Confirmar reserva';
      btn.disabled = false;
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  }


  // -- Animación shake --
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);


  // -- Smooth scroll con offset del navbar --
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight, behavior: 'smooth' });
    });
  });


  // -- Parallax suave en la imagen del hero --
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight)
        heroImg.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    }, { passive: true });
  }

});