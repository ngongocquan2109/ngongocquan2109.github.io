(function () {
  'use strict';

  var BASE = 'assets/du-an-web/';
  var DESIGN = { title: 'Ấn phẩm thiết kế', dir: 'assets/thiet-ke-web/', count: 7 };
  var designMode = false;
  var PROJECTS = {
    yep2025: { title: 'VuiHoc Year End Party 2025', video: 'DujAYLjKqvQ', dir: 'vuihoc-yep-2025', count: 6 },
    yep2024: { title: 'VuiHoc Year End Party 2024', video: '0M7APrqxCIs', dir: 'vuihoc-yep-2024', count: 6 },
    tb2024: { title: 'VuiHoc Team Building 2024', video: 'HjfBSG1M6IA', dir: 'vuihoc-team-building-2024', count: 5 },
    anniv2023: { title: 'SotaTek 8th Anniversary 2023', video: 'dQX5dU3QWyE', dir: 'sotatek-8th-anniversary-2023', count: 6 },
    trip2023: { title: 'SotaTek Summer Trip 2023', video: 'T0sB9LxC4gM', dir: 'sotatek-summer-trip-2023', count: 3 }
  };

  var dlg = document.getElementById('md-dialog');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var titleEl = dlg.querySelector('.md__title');
  var videoEl = dlg.querySelector('.md__video');
  var gridEl = dlg.querySelector('.md__grid');
  var viewer = dlg.querySelector('.md__viewer');
  var viewerImg = viewer.querySelector('img');
  var viewerCount = viewer.querySelector('.md__count');
  var lastFocus = null;
  var current = null;
  var index = 0;

  function imgSrc(p, i) {
    if (p === DESIGN) return DESIGN.dir + 'an-pham-' + (i + 1 < 10 ? '0' : '') + (i + 1) + '.jpg';
    return BASE + p.dir + '/' + (i === 0 ? 'bia' : 'anh-' + (i < 10 ? '0' + i : i)) + '.jpg';
  }

  function openDesign(n, trigger) {
    designMode = true;
    current = DESIGN;
    lastFocus = trigger;
    dlg.classList.add('md--design');
    videoEl.innerHTML = '';
    gridEl.innerHTML = '';
    dlg.showModal();
    showViewer(n);
  }

  function open(key, trigger) {
    var p = PROJECTS[key];
    if (!p) return;
    designMode = false;
    dlg.classList.remove('md--design');
    current = p;
    lastFocus = trigger;
    titleEl.textContent = p.title;

    videoEl.innerHTML = '';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + p.video + '?rel=0&modestbranding=1&playsinline=1';
    f.title = 'Video ' + p.title;
    f.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.loading = 'lazy';
    videoEl.appendChild(f);

    gridEl.innerHTML = '';
    for (var i = 0; i < p.count; i++) {
      (function (n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'md__thumb';
        b.setAttribute('aria-label', 'Phóng to ảnh ' + (n + 1) + ' trên ' + p.count);
        var im = document.createElement('img');
        im.src = imgSrc(p, n);
        im.alt = p.title + ', ảnh ' + (n + 1);
        im.loading = 'lazy';
        b.appendChild(im);
        b.addEventListener('click', function () { showViewer(n); });
        gridEl.appendChild(b);
      })(i);
    }

    hideViewer();
    dlg.showModal();
    dlg.scrollTop = 0;
  }

  function showViewer(n) {
    index = (n + current.count) % current.count;
    viewerImg.src = imgSrc(current, index);
    viewerImg.alt = current.title + ', ảnh ' + (index + 1);
    viewerCount.textContent = (index + 1) + ' / ' + current.count;
    viewer.hidden = false;
    viewer.querySelector('.md__vclose').focus();
  }

  function hideViewer() {
    viewer.hidden = true;
    viewerImg.removeAttribute('src');
    viewerImg.style.transform = '';
    viewerImg.style.opacity = '';
    if (designMode && dlg.open) dlg.close();
  }

  function closeAll() { dlg.close(); }

  dlg.addEventListener('close', function () {
    videoEl.innerHTML = '';
    hideViewer();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  });

  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) closeAll();
  });

  dlg.querySelector('.md__close').addEventListener('click', closeAll);
  viewer.querySelector('.md__vclose').addEventListener('click', hideViewer);

  // Bấm vùng tối quanh ảnh để quay lại kho ảnh
  viewer.addEventListener('click', function (e) {
    if (e.target === viewer || e.target.classList.contains('md__bar')) hideViewer();
  });

  // Vuốt xuống để thoát (màn cảm ứng)
  var tx = 0, ty = 0, tracking = false;
  viewer.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    tx = e.touches[0].clientX; ty = e.touches[0].clientY; tracking = true;
    viewerImg.style.transition = 'none';
  }, { passive: true });
  viewer.addEventListener('touchmove', function (e) {
    if (!tracking) return;
    var dx = e.touches[0].clientX - tx, dy = e.touches[0].clientY - ty;
    if (dy > 0 && dy > Math.abs(dx)) {
      viewerImg.style.transform = 'translateY(' + dy + 'px)';
      viewerImg.style.opacity = String(Math.max(0.4, 1 - dy / 400));
    }
  }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    viewerImg.style.transition = '';
    if (dy > 80 && dy > Math.abs(dx)) { hideViewer(); }
    else { viewerImg.style.transform = ''; viewerImg.style.opacity = ''; }
  });
  viewer.querySelector('.md__prev').addEventListener('click', function () { showViewer(index - 1); });
  viewer.querySelector('.md__next').addEventListener('click', function () { showViewer(index + 1); });

  dlg.addEventListener('keydown', function (e) {
    if (viewer.hidden) return;
    if (e.key === 'ArrowLeft') { showViewer(index - 1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { showViewer(index + 1); e.preventDefault(); }
    else if (e.key === 'Escape') { hideViewer(); e.preventDefault(); }
  });

  document.addEventListener('click', function (e) {
    var d = e.target.closest('[data-design]');
    if (d) { openDesign(parseInt(d.getAttribute('data-design'), 10), d); return; }
    var t = e.target.closest('[data-media]');
    if (t) open(t.getAttribute('data-media'), t);
  });
})();
