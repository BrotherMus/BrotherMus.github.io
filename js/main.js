(function () {
  'use strict';

  // Skip any incomplete records (for example leftover empty objects) so they never render as blank cards.
  const projects = (Array.isArray(window.PROJECTS) ? window.PROJECTS : []).filter(function (project) { return project && project.id && project.title; });
  const typeLabels = { professional: 'Professional work', personal: 'Original project', client: 'Client project', subproject: 'Part of a project' };
  const projectIndex = document.querySelector('#project-index');
  const projectCategoryStatus = document.querySelector('#project-category-status');
  const projectShowMore = document.querySelector('#project-show-more');
  const featuredProjectIds = ['appsgoolee', 'lepak', 'typerush'];

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character];
    });
  }

  function orderedProjects() {
    const featured = featuredProjectIds.map(function (id) {
      return projects.find(function (project) { return project.id === id; });
    }).filter(Boolean);
    const featuredIdSet = new Set(featured.map(function (project) { return project.id; }));
    projects.forEach(function (project) {
      if (featured.length < 3 && !featuredIdSet.has(project.id)) {
        featured.push(project);
        featuredIdSet.add(project.id);
      }
    });
    return featured.concat(projects.filter(function (project) { return !featuredIdSet.has(project.id); }));
  }

  // Longest word in a title, so big display titles can scale to fit their frame without breaking mid-word.
  function titleChars(title) {
    return Math.max.apply(null, String(title || '').split(/\s+/).map(function (word) { return word.length; }).concat([4]));
  }

  function cleanYear(value) {
    return value && value !== '—' ? String(value).replace(/PRESENT/g, 'present') : '';
  }

  function platformsOf(project) {
    return Array.isArray(project.platforms) ? project.platforms.filter(function (item) { return item && item !== '—'; }).join(' / ') : '';
  }

  function typeOf(project) {
    const parent = project.parentId ? projects.find(function (item) { return item.id === project.parentId; }) : null;
    return parent ? 'Part of ' + parent.title : (typeLabels[project.projectType] || 'Project');
  }

  // Title-card frame: the dark card is always drawn; a real cover (when added) loads on top of it.
  function frameMarkup(project) {
    const cover = project.media && project.media.cover
      ? '<img src="' + escapeHtml(project.media.cover) + '" alt="' + escapeHtml(project.title) + ' cover image" loading="lazy" onerror="this.remove()">'
      : '';
    return '<div class="hud-frame"><div class="hud-inner"><div class="frame"><div class="frame-card" aria-hidden="true"><small>' + escapeHtml(project.category || 'Game development') + '</small><strong style="--chars: ' + titleChars(project.title) + '">' + escapeHtml(project.title) + '</strong><span>' + escapeHtml(platformsOf(project) || 'Interactive project') + '</span></div>' + cover + '</div></div></div>';
  }

  function caseMarkup(project) {
    const url = 'project.html?id=' + encodeURIComponent(project.id);
    const facts = [['Role', project.role], ['Company', project.company], ['Year', cleanYear(project.year)], ['Built with', (project.technologies || []).join(', ')]]
      .filter(function (fact) { return fact[1]; })
      .map(function (fact) { return '<div><dt>' + fact[0] + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>'; }).join('');
    return '<article class="case">' +
      '<div class="case-info"><p class="case-type">' + escapeHtml(typeOf(project)) + '</p><h3>' + escapeHtml(project.title) + '</h3><p>' + escapeHtml(project.shortDescription) + '</p>' +
        '<dl class="case-facts">' + facts + '</dl><a class="text-link" href="' + url + '">Open case study</a></div>' +
      '<a class="case-media" href="' + url + '" tabindex="-1" aria-hidden="true">' + frameMarkup(project) + '</a>' +
    '</article>';
  }

  // Homepage: the three featured case studies; the full list lives on games.html.
  function renderProjectIndex() {
    if (!projectIndex) return;
    const projectOrder = orderedProjects();
    const featured = projectOrder.slice(0, Math.min(3, projectOrder.length));
    const projectCount = document.querySelector('#project-count');
    if (projectCount) {
      projectCount.dataset.count = String(projects.length);
      projectCount.textContent = projectCount.dataset.counted === 'true' ? String(projects.length) : '0';
    }
    if (projectCategoryStatus) projectCategoryStatus.textContent = 'Showing ' + featured.length + ' selected projects';
    if (projectShowMore) {
      projectShowMore.hidden = projectOrder.length <= featured.length;
      projectShowMore.innerHTML = 'View all ' + projectOrder.length + ' games <span aria-hidden="true">→</span>';
    }
    projectIndex.innerHTML = featured.map(caseMarkup).join('');
    observeReveals();
  }

  // Games page: every project as a "level select" cartridge, filterable by project type.
  function levelCardMarkup(project, index) {
    const year = cleanYear(project.year);
    return '<li class="level-card"><a href="project.html?id=' + encodeURIComponent(project.id) + '">' + frameMarkup(project) +
      '<span class="level-meta"><span class="level-no">' + String(index + 1).padStart(2, '0') + '</span><strong>' + escapeHtml(project.title) + '</strong><span class="level-go" aria-hidden="true">Open ▸</span>' +
      '<small>' + escapeHtml(typeOf(project)) + (year ? ' · ' + escapeHtml(year) : '') + '</small></span></a></li>';
  }

  function renderGames() {
    const grid = document.querySelector('#games-grid');
    if (!grid) return;
    const filters = document.querySelector('#games-filters');
    const status = document.querySelector('#games-status');
    const projectOrder = orderedProjects();
    const types = [{ key: 'all', label: 'All', count: projectOrder.length }].concat(Object.keys(typeLabels).map(function (key) {
      return { key: key, label: typeLabels[key], count: projectOrder.filter(function (project) { return project.projectType === key; }).length };
    }).filter(function (type) { return type.count; }));
    let active = 'all';

    function draw() {
      const list = active === 'all' ? projectOrder : projectOrder.filter(function (project) { return project.projectType === active; });
      grid.innerHTML = list.map(levelCardMarkup).join('');
      if (status) status.textContent = 'Showing ' + list.length + ' of ' + projectOrder.length + ' games';
      if (filters) filters.querySelectorAll('[data-filter]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.filter === active)); });
    }

    if (filters) {
      filters.innerHTML = types.map(function (type) {
        return '<button class="level-filter" type="button" data-filter="' + type.key + '" aria-pressed="false">' + escapeHtml(type.label) + ' <span>' + type.count + '</span></button>';
      }).join('');
      filters.addEventListener('click', function (event) {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        active = button.dataset.filter;
        draw();
      });
    }
    draw();
  }

  // Video work: thumbnails only; the YouTube iframe or local <video> loads after a click.
  function hasVideo(video) { return video && (video.youtube || video.src); }

  function videoCardMarkup(video) {
    const title = escapeHtml(video.title);
    const thumb = video.youtube ? 'https://i.ytimg.com/vi/' + encodeURIComponent(video.youtube) + '/hqdefault.jpg' : video.poster;
    const source = video.youtube ? 'data-youtube="' + escapeHtml(video.youtube) + '"' : 'data-src="' + escapeHtml(video.src) + '" data-poster="' + escapeHtml(video.poster) + '"';
    const caption = video.youtube
      ? '<a href="https://www.youtube.com/watch?v=' + escapeHtml(video.youtube) + '" target="_blank" rel="noopener noreferrer">' + title + ' <span aria-hidden="true">↗</span></a>'
      : '<strong>' + title + '</strong>';
    return '<figure class="video-card"><div class="frame video-frame">' +
      '<button class="video-play" type="button" ' + source + ' data-title="' + title + '" aria-label="Play video: ' + title + '">' +
      (thumb ? '<img src="' + escapeHtml(thumb) + '" alt="" loading="lazy" onerror="this.hidden=true">' : '') +
      '<span class="video-play-icon" aria-hidden="true"></span></button></div>' +
      '<figcaption>' + caption + (video.note ? '<small>' + escapeHtml(video.note) + '</small>' : '') + '</figcaption></figure>';
  }

  function renderVideoWork() {
    const data = window.MULTIMEDIA_VIDEOS;
    const block = document.querySelector('#video-work');
    const gallery = document.querySelector('#video-gallery');
    if (!data || !block || !gallery) return;
    const groups = (data.groups || []).filter(function (group) { return group && Array.isArray(group.videos) && group.videos.some(hasVideo); });
    if (!groups.length) return;

    gallery.innerHTML = groups.map(function (group) {
      return '<div class="video-group"><h4 class="video-group-title">' + escapeHtml(group.title) + '</h4><div class="video-grid">' +
        group.videos.filter(hasVideo).map(videoCardMarkup).join('') + '</div></div>';
    }).join('');

    gallery.addEventListener('click', function (event) {
      const button = event.target.closest('.video-play');
      if (!button) return;
      let player;
      if (button.dataset.youtube) {
        player = document.createElement('iframe');
        player.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(button.dataset.youtube) + '?autoplay=1&rel=0';
        player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        player.allowFullscreen = true;
      } else {
        player = document.createElement('video');
        player.src = button.dataset.src;
        if (button.dataset.poster) player.poster = button.dataset.poster;
        player.controls = true;
        player.autoplay = true;
        player.playsInline = true;
      }
      player.title = button.dataset.title;
      button.replaceWith(player);
      player.focus();
    });

    const credit = document.querySelector('#video-credit');
    if (credit && data.credit) credit.textContent = data.credit;
    const more = document.querySelector('#video-more');
    if (more && data.moreUrl) {
      more.href = data.moreUrl;
      more.innerHTML = escapeHtml(data.moreLabel || 'More videos') + ' <span aria-hidden="true">↗</span>';
      more.hidden = false;
    }
    block.hidden = false;
  }

  // Design work: page thumbnails open a full-size viewer (same behaviour as the project screenshot lightbox).
  function renderDesignWork() {
    const data = window.MULTIMEDIA_DESIGNS;
    const block = document.querySelector('#design-work');
    const gallery = document.querySelector('#design-gallery');
    const lightbox = document.querySelector('#lightbox');
    if (!data || !block || !gallery) return;
    const pages = [];
    const designs = (data.designs || []).filter(function (design) { return design && Array.isArray(design.pages) && design.pages.length; });
    if (!designs.length) return;

    gallery.innerHTML = designs.map(function (design) {
      return '<div class="design-group"><h4 class="video-group-title">' + escapeHtml(design.title) + (design.note ? ' <span>· ' + escapeHtml(design.note) + '</span>' : '') + '</h4><div class="design-grid">' +
        design.pages.map(function (page, pageIndex) {
          const index = pages.push({ src: page.src, alt: page.alt || design.title, caption: design.title + (design.pages.length > 1 ? ' · page ' + (pageIndex + 1) + ' of ' + design.pages.length : '') }) - 1;
          return '<button class="design-thumb" type="button" data-design-index="' + index + '" aria-label="View larger: ' + escapeHtml(pages[index].caption) + '">' +
            '<img src="' + escapeHtml(page.thumb || page.src) + '" alt="' + escapeHtml(pages[index].alt) + '" loading="lazy" onerror="this.parentElement.classList.add(\'is-missing\')"></button>';
        }).join('') + '</div></div>';
    }).join('');

    const credit = document.querySelector('#design-credit');
    if (credit && data.credit) credit.textContent = data.credit;
    block.hidden = false;
    if (!lightbox) return;

    const image = lightbox.querySelector('[data-lightbox-image]');
    const placeholder = lightbox.querySelector('[data-lightbox-placeholder]');
    const counter = lightbox.querySelector('[data-lightbox-counter]');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    const closeButton = lightbox.querySelector('.lightbox-close');
    let current = 0;
    let lastFocused = null;
    function show(index) {
      current = (index + pages.length) % pages.length;
      image.hidden = false;
      placeholder.hidden = true;
      image.alt = pages[current].alt;
      image.src = pages[current].src;
      image.onerror = function () { image.hidden = true; placeholder.hidden = false; };
      counter.textContent = (current + 1) + ' / ' + pages.length;
      caption.textContent = pages[current].caption;
    }
    function open(index, trigger) { lastFocused = trigger; show(index); lightbox.hidden = false; document.body.classList.add('lightbox-open'); closeButton.focus(); }
    function close() { lightbox.hidden = true; document.body.classList.remove('lightbox-open'); if (lastFocused) lastFocused.focus(); }
    gallery.addEventListener('click', function (event) {
      const button = event.target.closest('[data-design-index]');
      if (button) open(Number(button.dataset.designIndex), button);
    });
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
    closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', function (event) { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  }

  function observeReveals() {
    const elements = document.querySelectorAll('.reveal:not([data-reveal-bound])');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) { element.classList.add('is-visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px' });
    elements.forEach(function (element) { element.dataset.revealBound = 'true'; observer.observe(element); });
  }

  function initTheme() {
    const toggle = document.querySelector('#theme-toggle');
    if (!toggle) return;
    const root = document.documentElement;
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
      const light = theme === 'light';
      root.dataset.theme = light ? 'light' : 'dark';
      toggle.setAttribute('aria-pressed', String(!light));
      toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      if (themeColor) themeColor.setAttribute('content', light ? '#f3f6fc' : '#0b1020');
    }

    applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
    toggle.addEventListener('click', function () {
      const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      try { localStorage.setItem('musab-theme', nextTheme); } catch (error) {}
    });
  }

  function initNavigation() {
    const header = document.querySelector('[data-header]');
    const progress = document.querySelector('.scroll-progress span');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#site-nav');
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sectionLinks = navLinks.filter(function (link) { return (link.getAttribute('href') || '').charAt(0) === '#'; }).map(function (link) { return { link: link, section: document.querySelector(link.getAttribute('href')) }; }).filter(function (item) { return item.section; });

    function updateScrollState() {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('is-scrolled', scrollTop > 15);
      if (progress) progress.style.width = (maxScroll ? scrollTop / maxScroll * 100 : 0) + '%';
      // Highlight only the section under the header; sections without a nav link (e.g. Explore) highlight nothing.
      let current = null;
      sectionLinks.forEach(function (item) {
        const bounds = item.section.getBoundingClientRect();
        if (bounds.top <= 150 && bounds.bottom > 150) current = item;
      });
      sectionLinks.forEach(function (item) { item.link.classList.toggle('is-active', current && item.link === current.link); });
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    if (!menuToggle || !nav) return;
    function closeMenu() {
      nav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      document.body.classList.remove('menu-open');
    }
    menuToggle.addEventListener('click', function () {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      menuToggle.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      document.body.classList.toggle('menu-open', open);
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
    });
  }

  function initMoreButtons() {
    document.querySelectorAll('.view-more').forEach(function (button) {
      const targetId = button.getAttribute('aria-controls');
      const extra = targetId ? document.getElementById(targetId) : button.previousElementSibling;
      if (!extra) return;
      button.addEventListener('click', function () {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        extra.hidden = expanded;
        button.innerHTML = expanded ? 'View details <span aria-hidden="true">+</span>' : 'Hide details <span aria-hidden="true">−</span>';
      });
    });
  }

  function initPointerEffects() {
    const art = document.querySelector('.hero-art');
    const frame = document.querySelector('.portrait-frame');
    if (!art || !frame || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function resetTilt() {
      frame.style.setProperty('--tilt-x', '0deg');
      frame.style.setProperty('--tilt-y', '0deg');
    }

    art.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return;
      const bounds = frame.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      frame.style.setProperty('--tilt-x', (y * -4).toFixed(2) + 'deg');
      frame.style.setProperty('--tilt-y', (x * 5).toFixed(2) + 'deg');
    });
    art.addEventListener('pointerleave', resetTilt);
  }

  function initCountUps() {
    const counters = [...document.querySelectorAll('.count-up[data-count]')];
    if (!counters.length) return;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function finish(counter) {
      const target = Number(counter.dataset.count);
      if (!Number.isFinite(target)) return;
      counter.textContent = target.toLocaleString() + (counter.dataset.suffix || '');
      counter.dataset.counted = 'true';
    }

    function animate(counter) {
      if (counter.dataset.counted === 'true') return;
      const target = Number(counter.dataset.count);
      if (!Number.isFinite(target)) return;
      if (reducedMotion || !window.requestAnimationFrame) {
        finish(counter);
        return;
      }
      const start = performance.now();
      const duration = 1300;
      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased).toLocaleString() + (counter.dataset.suffix || '');
        if (progress < 1) window.requestAnimationFrame(frame); else counter.dataset.counted = 'true';
      }
      window.requestAnimationFrame(frame);
    }

    if (reducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }
    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .5 });
    counters.forEach(function (counter) { observer.observe(counter); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderProjectIndex();
    renderGames();
    renderVideoWork();
    renderDesignWork();
    document.querySelectorAll('[data-project-total]').forEach(function (element) { element.textContent = String(projects.length); });
    initTheme();
    initNavigation();
    initMoreButtons();
    initPointerEffects();
    initCountUps();
    observeReveals();
    const year = document.querySelector('#current-year');
    if (year) year.textContent = new Date().getFullYear();
  });
}());
