(function () {
  'use strict';

  // Skip incomplete records so routing and "next project" never land on an empty entry.
  const projects = (Array.isArray(window.PROJECTS) ? window.PROJECTS : []).filter(function (item) { return item && item.id && item.title; });
  // Signal colour per project: alternates cyan / magenta in catalogue order (sub-projects follow their parent).
  function accentFor(item) {
    const key = item && item.parentId ? item.parentId : item && item.id;
    const index = projects.findIndex(function (entry) { return entry.id === key; });
    return index % 2 === 1 ? 'magenta' : 'cyan';
  }
  function accentStyle(name) {
    return name === 'magenta'
      ? '--accent-a: var(--magenta); --accent-b: var(--cyan); --accent-text: var(--magenta-text);'
      : '--accent-a: var(--cyan); --accent-b: var(--magenta); --accent-text: var(--cyan-text);';
  }
  const typeLabels = { professional: 'Full-time job', personal: 'Own game', client: 'Freelance', subproject: 'Part of a project' };
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');
  const project = projects.find(function (item) { return item.id === projectId; });
  const main = document.querySelector('#project-main');
  let galleryImages = [];
  let galleryIndex = 0;
  let lastFocusedElement = null;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character];
    });
  }

  function safeUrl(value) {
    if (!value) return '';
    if (/^(?:\.\.\/|\.\/|assets\/)/i.test(value)) return value;
    try {
      const url = new URL(value, window.location.href);
      return /^(https?:|mailto:|tel:)/i.test(url.protocol) ? url.href : '';
    } catch (error) {
      return '';
    }
  }

  function projectUrl(id) {
    return 'project.html?id=' + encodeURIComponent(id);
  }

  function mediaPlaceholder(title, label) {
    return '<div class="media-placeholder"><strong>' + escapeHtml(title) + '</strong><small>' + escapeHtml(label || 'Screenshot coming soon') + '</small></div>';
  }

  // Longest word in a title, so big display titles can scale to fit their frame without breaking mid-word.
  function titleChars(title) {
    return Math.max.apply(null, String(title || '').split(/\s+/).map(function (word) { return word.length; }).concat([4]));
  }

  // Title-card frame is always drawn; a real cover (when added) loads on top of it.
  function coverMarkup(item) {
    const cover = item.media && item.media.cover ? safeUrl(item.media.cover) : '';
    const platforms = (item.platforms || []).filter(function (entry) { return entry && entry !== '—'; }).join(' / ');
    const img = cover ? '<img src="' + escapeHtml(cover) + '" alt="' + escapeHtml(item.title) + ' cover image" onerror="this.remove()">' : '';
    return '<figure class="project-cover"><div class="hud-frame"><div class="hud-inner"><div class="frame"><div class="frame-card" aria-hidden="true"><small>' + escapeHtml(item.category || 'Game development') + '</small><strong style="--chars: ' + titleChars(item.title) + '">' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(platforms || 'Interactive project') + '</span></div>' + img + '</div></div></div></figure>';
  }

  function displayYear(value) {
    return String(value || '—').replace(/PRESENT/g, 'present');
  }

  function renderList(items, className) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<ul class="' + className + '">' + items.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>';
  }

  function renderSection(number, label, heading, content) {
    return '<section class="project-section" data-section="' + number + '"><p class="project-section-label">' + escapeHtml(label) + '</p><div><h2>' + escapeHtml(heading) + '</h2>' + content + '</div></section>';
  }

  function youtubeEmbed(value) {
    const url = safeUrl(value);
    if (!url) return '';
    try {
      const parsed = new URL(url);
      let id = parsed.searchParams.get('v');
      if (!id && parsed.hostname === 'youtu.be') id = parsed.pathname.slice(1);
      if (!id && parsed.pathname.indexOf('/embed/') === 0) id = parsed.pathname.split('/')[2];
      return id ? 'https://www.youtube.com/embed/' + encodeURIComponent(id) : '';
    } catch (error) {
      return '';
    }
  }

  function renderVideo(item) {
    const video = item.media && item.media.video;
    if (!video || !video.url) return '';
    const url = safeUrl(video.url);
    if (!url) return '';
    if (video.type === 'youtube') {
      const embed = youtubeEmbed(url);
      if (embed) return '<div class="project-video"><iframe src="' + escapeHtml(embed) + '" title="' + escapeHtml(item.title) + ' gameplay video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    }
    if (video.type === 'local') return '<div class="project-video"><video controls preload="metadata"><source src="' + escapeHtml(url) + '" type="video/mp4">Your browser does not support this video.</video></div>';
    return '<a class="text-link video-link" href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer">Watch video <span>↗</span></a>';
  }

  function renderLinks(item) {
    const labels = { itch: 'Play on itch.io ↗', youtube: 'Watch video ↗', website: 'Visit website ↗', steam: 'View on Steam ↗', github: 'View on GitHub ↗', demo: 'View demo ↗' };
    const links = item.links || {};
    const markup = Object.keys(labels).map(function (key) {
      const url = safeUrl(links[key]);
      return url ? '<a href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer">' + labels[key] + '</a>' : '';
    }).join('');
    return markup ? '<div class="project-links">' + markup + '</div>' : '';
  }

  function renderGallery(item) {
    const screenshots = item.media && Array.isArray(item.media.screenshots) ? item.media.screenshots.filter(Boolean) : [];
    galleryImages = screenshots.map(function (image, index) {
      const src = typeof image === 'string' ? image : image.src;
      return { src: safeUrl(src), alt: typeof image === 'string' ? item.title + ' screenshot ' + (index + 1) : image.alt || item.title + ' screenshot ' + (index + 1), caption: typeof image === 'string' ? '' : image.caption || '' };
    }).filter(function (image) { return image.src; });
    if (!galleryImages.length) return '';
    const cards = galleryImages.map(function (image, index) { return '<button class="gallery-item" type="button" data-gallery-index="' + index + '" aria-label="Open screenshot ' + (index + 1) + '"><img src="' + escapeHtml(image.src) + '" alt="' + escapeHtml(image.alt) + '" loading="lazy" onerror="var f=this.nextElementSibling;this.remove();if(f)f.hidden=false"><div class="media-placeholder" hidden>Screenshot unavailable</div></button>'; }).join('');
    return '<div class="gallery-grid">' + cards + '</div>';
  }

  function renderSubprojects(item) {
    if (!Array.isArray(item.subprojects) || !item.subprojects.length) return '';
    const cards = item.subprojects.map(function (subproject) { return '<a class="subproject" style="' + accentStyle(accentFor(item)) + '" href="' + projectUrl(subproject.id) + '"><strong>' + escapeHtml(subproject.title) + '</strong><span>' + escapeHtml(subproject.status || 'Project') + '</span><p>' + escapeHtml(subproject.description) + '</p></a>'; }).join('');
    return renderSection('06', 'Inside the project', 'Games inside ' + item.title, '<div class="subprojects">' + cards + '</div>');
  }

  function isListed(entry) {
    const display = window.PROJECT_DISPLAY || {};
    return (display.shown || []).indexOf(entry.id) !== -1;
  }

  function renderPage(item) {
    const media = item.media || {};
    // "Next project" walks only the projects the personal site lists (see PROJECT_DISPLAY in projects-data.js).
    const listed = projects.filter(function (entry) { return isListed(entry) || entry.id === item.id; });
    const projectIndex = listed.findIndex(function (entry) { return entry.id === item.id; });
    const next = listed.length > 1 ? listed[(projectIndex + 1) % listed.length] : null;
    const roleContent = item.role ? '<p class="role-line">' + escapeHtml(item.role) + '</p>' : '';
    const contributionContent = roleContent + renderList(item.contributions, 'contribution-list');
    const featureContent = renderList(item.features, 'feature-list');
    const videoContent = renderVideo(item);
    const galleryContent = renderGallery(item);
    const linksContent = renderLinks(item);
    const parent = item.parentId ? projects.find(function (entry) { return entry.id === item.parentId; }) : null;
    const accent = accentFor(item);
    const kicker = parent ? 'Part of ' + parent.title : (typeLabels[item.projectType] || 'Project');
    const platforms = (item.platforms || []).filter(function (entry) { return entry && entry !== '—'; }).join(' · ');
    let html = '<div class="project-container"><a class="project-back" href="games.html">← Back to games</a>' +
      '<header class="project-hero" style="' + accentStyle(accent) + '"><div class="project-hero-copy">' +
        '<p class="project-kicker">' + escapeHtml(kicker) + '</p>' +
        '<h1 style="--chars: ' + titleChars(item.title) + '">' + escapeHtml(item.title) + '</h1>' +
        '<p class="project-short-description">' + escapeHtml(item.shortDescription) + '</p>' +
        '<dl class="project-meta"><div><dt>Category</dt><dd>' + escapeHtml(item.category) + '</dd></div><div><dt>Year</dt><dd>' + escapeHtml(displayYear(item.year)) + '</dd></div><div><dt>Company</dt><dd class="project-company">' + escapeHtml(item.company || 'Project details') + '</dd></div>' + (platforms ? '<div><dt>Platforms</dt><dd>' + escapeHtml(platforms) + '</dd></div>' : '') + '</dl>' +
        (parent ? '<p class="parent-project">Part of <a href="' + projectUrl(parent.id) + '">' + escapeHtml(parent.title) + '</a></p>' : '') +
      '</div>' + coverMarkup(item) + '</header><div class="project-content">';
    if (item.description) html += renderSection('01', 'About the project', item.title, '<p>' + escapeHtml(item.description) + '</p>');
    if (contributionContent) html += renderSection('02', 'My role / contribution', 'What I worked on', contributionContent);
    if (featureContent) html += renderSection('03', 'Features / what I built', 'Built into the experience', featureContent);
    if (videoContent) html += renderSection('04', 'Video / gameplay', 'See it in motion', videoContent);
    if (galleryContent) html += renderSection('05', 'Screenshots', 'A closer look', galleryContent);
    html += renderSubprojects(item);
    if (item.technologies && item.technologies.length) html += renderSection('07', 'Tech used', 'Technology', '<div class="tech-list">' + item.technologies.map(function (technology) { return '<span>' + escapeHtml(technology) + '</span>'; }).join('') + '</div>');
    if (linksContent) html += renderSection('08', 'Project links', 'Continue elsewhere', linksContent);
    html += '</div>';
    if (next) html += '<nav class="project-next" aria-label="Next project"><a class="next-project-link" style="' + accentStyle(accentFor(next)) + '" href="' + projectUrl(next.id) + '"><span class="project-next-label">Next project</span><strong>' + escapeHtml(next.title) + '</strong><small>' + escapeHtml(next.category || '') + '</small><i aria-hidden="true">→</i></a></nav>';
    html += '</div>';
    main.innerHTML = html;
    main.setAttribute('style', accentStyle(accent));
    main.hidden = false;
    document.title = item.title + ' | Mus\'ab Anas';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', item.shortDescription);
  }

  function renderNotFound() {
    main.innerHTML = '<div class="project-container project-not-found"><a class="project-back" href="games.html">← Back to games</a><h1>We couldn’t find that project.</h1><p>The link may be out of date. Pick a game from the games page instead.</p><a class="btn btn-gradient" href="games.html">See all games</a></div>';
    main.hidden = false;
  }

  function updateScrollProgress() {
    const progress = document.querySelector('.scroll-progress span');
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (maxScroll ? window.scrollY / maxScroll * 100 : 0) + '%';
  }

  function initGallery() {
    const lightbox = document.querySelector('#lightbox');
    if (!lightbox || !galleryImages.length) return;
    const image = lightbox.querySelector('[data-lightbox-image]');
    const placeholder = lightbox.querySelector('[data-lightbox-placeholder]');
    const counter = lightbox.querySelector('[data-lightbox-counter]');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    const closeButton = lightbox.querySelector('.lightbox-close');
    lastFocusedElement = null;
    function showImage(index) {
      galleryIndex = (index + galleryImages.length) % galleryImages.length;
      const current = galleryImages[galleryIndex];
      image.hidden = false;
      placeholder.hidden = true;
      image.alt = current.alt;
      image.src = current.src;
      image.onerror = function () { image.hidden = true; placeholder.hidden = false; };
      counter.textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
      caption.textContent = current.caption;
    }
    function open(index, trigger) { lastFocusedElement = trigger || document.activeElement; showImage(index); lightbox.hidden = false; document.body.classList.add('lightbox-open'); closeButton.focus(); }
    function close() { lightbox.hidden = true; document.body.classList.remove('lightbox-open'); if (lastFocusedElement) lastFocusedElement.focus(); }
    document.querySelectorAll('[data-gallery-index]').forEach(function (button) { button.addEventListener('click', function () { open(Number(button.dataset.galleryIndex), button); }); });
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { showImage(galleryIndex - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { showImage(galleryIndex + 1); });
    closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', function (event) { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', function (event) { if (lightbox.hidden) return; if (event.key === 'Escape') close(); if (event.key === 'ArrowLeft') showImage(galleryIndex - 1); if (event.key === 'ArrowRight') showImage(galleryIndex + 1); });
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
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try { localStorage.setItem('musab-theme', nextTheme); } catch (error) {}
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    if (project) renderPage(project); else renderNotFound();
    initGallery();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  });
}());
