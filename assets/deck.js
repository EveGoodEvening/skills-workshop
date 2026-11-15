// Minimal slide engine: fixed 1920x1080 stage, keyboard/touch nav, fragments, overview, speaker notes.
(function () {
  const stage = document.getElementById('stage');
  const slides = Array.from(stage.querySelectorAll('.slide'));
  const bar = document.getElementById('bar');
  const counter = document.getElementById('counter');
  const notes = document.getElementById('notes');
  const grid = document.getElementById('grid');
  const help = document.getElementById('help');
  let cur = 0;

  function fit() {
    const reserved = document.body.classList.contains('notes') ? notes.offsetHeight : 0;
    const h = window.innerHeight - reserved;
    const k = Math.min(window.innerWidth / 1920, h / 1080);
    const top = Math.max(0, (h - 1080 * k) / 2);
    stage.style.transform = 'translate(-50%, ' + top + 'px) scale(' + k + ')';
  }

  function frags(i) { return Array.from(slides[i].querySelectorAll('.frag')); }

  function renderNotes() {
    const a = slides[cur].querySelector(':scope > aside');
    const body = a ? a.innerHTML : '<p>（本页无讲稿）</p>';
    notes.innerHTML = '<h4>讲稿 · 第 ' + (cur + 1) + ' 页</h4>' + body;
    notes.scrollTop = 0;
  }

  function show(i, revealAll) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, n) { s.classList.toggle('active', n === cur); });
    frags(cur).forEach(function (f) { f.classList.toggle('on', !!revealAll); });
    bar.style.width = ((cur + 1) / slides.length * 100) + '%';
    counter.textContent = (cur + 1) + ' / ' + slides.length;
    if (location.hash !== '#' + (cur + 1)) history.replaceState(null, '', '#' + (cur + 1));
    document.title = (slides[cur].dataset.title || 'Slides') + ' · ' + (cur + 1);
    renderNotes();
  }

  function next() {
    const pending = frags(cur).filter(function (f) { return !f.classList.contains('on'); });
    if (pending.length) { pending[0].classList.add('on'); return; }
    if (cur < slides.length - 1) show(cur + 1, false);
  }
  function prev() {
    const shown = frags(cur).filter(function (f) { return f.classList.contains('on'); });
    if (shown.length) { shown[shown.length - 1].classList.remove('on'); return; }
    if (cur > 0) show(cur - 1, true);
  }

  function toggleNotes() { document.body.classList.toggle('notes'); fit(); }

  function toggleOverview() {
    const on = document.body.classList.toggle('overview');
    if (!on) return;
    grid.innerHTML = '';
    slides.forEach(function (s, n) {
      const t = document.createElement('div');
      t.className = 'thumb' + (n === cur ? ' cur' : '');
      const c = s.cloneNode(true);
      c.classList.add('active');
      c.removeAttribute('id');
      t.appendChild(c);
      const label = document.createElement('span');
      label.textContent = n + 1;
      t.appendChild(label);
      t.addEventListener('click', function () { document.body.classList.remove('overview'); show(n, false); });
      grid.appendChild(t);
    });
    const c = grid.querySelector('.cur');
    if (c) c.scrollIntoView({ block: 'center' });
  }

  function jumpChapter(dir) {
    const starts = slides.map(function (s, n) { return s.classList.contains('divider') || n === 0 ? n : -1; }).filter(function (n) { return n >= 0; });
    if (dir > 0) { const t = starts.find(function (n) { return n > cur; }); show(t === undefined ? slides.length - 1 : t, false); }
    else { const before = starts.filter(function (n) { return n < cur; }); show(before.length ? before[before.length - 1] : 0, false); }
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (help.classList.contains('on')) { help.classList.remove('on'); return; }
    switch (e.key) {
      case 'ArrowRight': case ' ': case 'PageDown': case 'Enter': case 'j': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': case 'Backspace': case 'k': e.preventDefault(); prev(); break;
      case 'ArrowDown': e.preventDefault(); jumpChapter(1); break;
      case 'ArrowUp': e.preventDefault(); jumpChapter(-1); break;
      case 'Home': show(0, false); break;
      case 'End': show(slides.length - 1, false); break;
      case 'n': case 'N': case 's': case 'S': toggleNotes(); break;
      case 'o': case 'O': case 'Escape': if (e.key !== 'Escape' || document.body.classList.contains('overview')) toggleOverview(); break;
      case 'f': case 'F': if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); break;
      case '?': case 'h': case 'H': help.classList.add('on'); break;
    }
  });
  help.addEventListener('click', function () { help.classList.remove('on'); });

  let tx = null;
  document.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
  });

  document.getElementById('b-prev').addEventListener('click', prev);
  document.getElementById('b-next').addEventListener('click', next);
  document.getElementById('b-notes').addEventListener('click', toggleNotes);
  document.getElementById('b-over').addEventListener('click', toggleOverview);
  document.getElementById('b-help').addEventListener('click', function () { help.classList.add('on'); });

  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', function () {
    const n = parseInt(location.hash.slice(1), 10);
    if (n && n - 1 !== cur) show(n - 1, false);
  });

  const start = parseInt(location.hash.slice(1), 10);
  show(start ? start - 1 : 0, false);
  fit();
})();
