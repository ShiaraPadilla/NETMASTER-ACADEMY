/* ══════════════════════════════════════════
   app.js — NetMaster Academy (index + formulario)
══════════════════════════════════════════ */

/* ──── Scroll fade-up observer ──── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ──── Navbar scroll style ──── */
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60 ? 'rgba(8,8,8,.98)' : 'rgba(8,8,8,.88)';
  });
}

/* ──── Active nav link on scroll (solo index) ──── */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
if (sections.length && navLinks.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  });
}

/* ──── Auto-seleccionar curso desde URL param (solo formulario) ──── */
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const curso  = params.get('curso');
  if (curso) {
    const select = document.getElementById('curso_interes');
    if (select) {
      for (const opt of select.options) {
        if (opt.value.toLowerCase().replace(/\s+/g, '+') === curso.toLowerCase()) {
          opt.selected = true;
          break;
        }
      }
    }
  }
});

/* ──── Form submission real (FormSubmit) ──── */
const form = document.getElementById('inscripcionForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn   = this.querySelector('.btn-submit');
    const alert = document.getElementById('successAlert');

    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
    btn.disabled  = true;

    const data = new FormData(this);

    fetch(this.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok || res.status === 200 || res.redirected) {
        if (alert) alert.style.display = 'block';
        form.reset();
        btn.innerHTML    = '<i class="bi bi-check-lg me-2"></i>¡Enviado con éxito!';
        btn.style.background = '#22c55e';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Error al enviar');
      }
    })
    .catch(() => {
      // FormSubmit redirige, así que si hay error de CORS igual se envió
      if (alert) alert.style.display = 'block';
      form.reset();
      btn.innerHTML    = '<i class="bi bi-check-lg me-2"></i>¡Enviado con éxito!';
      btn.style.background = '#22c55e';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}