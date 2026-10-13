(function () {
  // On the live site, hide unfilled placeholders (images, videos).
  // When previewing locally (file:// or localhost) they stay visible as reminders.
  var h = location.hostname;
  var isPreview = location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '';
  if (!isPreview) document.documentElement.classList.add('is-live');

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- What-if scenario sentence ----------
  var options = {
    event: [
      'a 100-year storm surge',
      'a slow-moving hurricane',
      'a king tide with heavy rainfall',
      'a 3-day extreme rain event'
    ],
    future: [
      '2050, with 0.5 m sea level rise',
      '2100, with 1 m sea level rise',
      'today’s climate',
      '2070, with more paved surfaces'
    ],
    strategy: [
      'build a floodwall along the waterfront',
      'elevate homes in the lowest blocks',
      'add a storage basin and water squares',
      'do nothing'
    ]
  };
  document.querySelectorAll('.chip').forEach(function (chip) {
    var set = options[chip.dataset.set];
    var i = 0;
    chip.setAttribute('aria-label', 'Change: ' + chip.textContent);
    function next() {
      i = (i + 1) % set.length;
      chip.textContent = set[i];
      chip.setAttribute('aria-label', 'Change: ' + set[i]);
      chip.classList.remove('changed');
      void chip.offsetWidth;
      chip.classList.add('changed');
    }
    chip.addEventListener('click', next);
    chip.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    });
  });

  // ---------- Videos ----------
  var playIcon = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#C2361F"/><path d="M19 15l15 9-15 9z" fill="#fff"/></svg>';
  var anySet = false;
  document.querySelectorAll('.video').forEach(function (fig) {
    var yt = (fig.dataset.youtube || '').trim();
    var mp4 = (fig.dataset.mp4 || '').trim();
    var poster = fig.dataset.poster || '';
    var caption = fig.querySelector('figcaption');
    var label = caption ? caption.textContent : 'video';
    var frame = document.createElement('div');
    frame.className = 'video-frame';

    if (yt) {
      anySet = true;
      // Click-to-load: YouTube isn't contacted until the visitor presses play (privacy-friendly).
      var thumb = poster || ('https://i.ytimg.com/vi/' + encodeURIComponent(yt) + '/hqdefault.jpg');
      frame.innerHTML = '<img alt="" src="' + thumb + '"><button type="button" class="play">' + playIcon + '<span>Play: ' + label + ' (loads YouTube)</span></button>';
      frame.querySelector('.play').addEventListener('click', function () {
        frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) +
          '?autoplay=1&rel=0" title="' + label + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      });
    } else if (mp4) {
      anySet = true;
      frame.innerHTML = '<video controls preload="metadata"' + (poster ? ' poster="' + poster + '"' : '') + '><source src="' + mp4 + '" type="video/mp4"></video>';
    } else {
      fig.classList.add('unset');
      frame.classList.add('empty');
      frame.textContent = 'Video placeholder: set data-youtube or data-mp4 in index.html';
    }
    fig.insertBefore(frame, caption);
  });
  var vs = document.getElementById('videos');
  if (vs && !anySet) vs.classList.add('no-videos');

  // ---------- Contact form (Formspree) ----------
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var btn = form.querySelector('button[type=submit]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    form.querySelectorAll('.field-error').forEach(function (el) { el.classList.remove('field-error'); });

    var invalid = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (el) {
      return el.type === 'checkbox' ? !el.checked : !el.value.trim() || (el.type === 'email' && !el.checkValidity());
    });
    if (invalid.length) {
      invalid.forEach(function (el) { el.classList.add('field-error'); });
      status.textContent = invalid.some(function (el) { return el.type === 'checkbox'; }) && invalid.length === 1
        ? 'Tick the box to let us use your details to reply.'
        : 'Fill in your name, a valid email address and a message, and tick the box below.';
      status.classList.add('err');
      invalid[0].focus();
      return;
    }

    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      status.textContent = 'The form isn’t connected yet. Add your Formspree form ID in index.html.';
      status.classList.add('err');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        status.textContent = 'Message sent. We’ll reply by email soon.';
        status.classList.add('ok');
      })
      .catch(function () {
        status.textContent = 'Your message didn’t send. Check your connection and try again.';
        status.classList.add('err');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Send message';
      });
  });
})();
