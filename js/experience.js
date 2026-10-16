(function () {
  'use strict';

  const experiences = Array.isArray(window.EXPERIENCES) ? window.EXPERIENCES : [];
  const timeline = Array.isArray(window.EXPERIENCE_TIMELINE) ? window.EXPERIENCE_TIMELINE : [];
  const earlyExperience = Array.isArray(window.EARLY_TECHNICAL_EXPERIENCE) ? window.EARLY_TECHNICAL_EXPERIENCE : [];
  const params = new URLSearchParams(window.location.search);
  const experienceId = params.get('id');
  const experience = experiences.find(function (item) { return item.id === experienceId; });
  const main = document.querySelector('#experience-main');
  const areaAccents = { 'unity-development': 'cyan', 'multimedia-creative-production': 'magenta', 'ai-assisted-web-app-development': 'cyan', 'leadership-project-delivery': 'magenta' };
  const timelineAccents = ['cyan', 'magenta', 'cyan', 'magenta'];

  function accentStyle(name) {
    return name === 'magenta'
      ? '--accent-a: var(--magenta); --accent-b: var(--cyan); --accent-text: var(--magenta-text);'
      : '--accent-a: var(--cyan); --accent-b: var(--magenta); --accent-text: var(--cyan-text);';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character];
    });
  }

  function experienceUrl(id) {
    return 'experience.html?id=' + encodeURIComponent(id);
  }

  function renderList(items, className) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<ul class="' + className + '">' + items.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>';
  }

  function renderSection(number, label, heading, content) {
    return '<section class="experience-section" data-section="' + number + '"><p class="experience-section-label">' + escapeHtml(label) + '</p><div><h2>' + escapeHtml(heading) + '</h2>' + content + '</div></section>';
  }

  function renderOverview() {
    const cards = experiences.map(function (item, index) {
      return '<a class="experience-card" style="' + accentStyle(areaAccents[item.id]) + '" href="' + experienceUrl(item.id) + '"><span>' + escapeHtml(item.eyebrow) + '</span><h2>' + escapeHtml(item.title) + '</h2><p>' + escapeHtml(item.summary) + '</p><strong>Explore experience <i aria-hidden="true">↗</i></strong></a>';
    }).join('');
    const timelineItems = timeline.map(function (item, index) {
      return '<article class="timeline-item" style="--dot: var(--' + timelineAccents[index % timelineAccents.length] + ')"><span>' + escapeHtml(item.period) + '</span><div><p>' + escapeHtml(item.company) + '</p><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.summary) + '</p></div></article>';
    }).join('');
    const earlierItems = earlyExperience.map(function (item) {
      return '<article class="earlier-item"><span>' + escapeHtml(item.period) + '</span><h3>' + escapeHtml(item.title) + '</h3><p class="earlier-company">' + escapeHtml(item.company) + '</p><p>' + escapeHtml(item.summary) + '</p></article>';
    }).join('');

    main.innerHTML = '<div class="experience-container"><header class="experience-overview-hero"><h1>More than<br><em>one role.</em></h1><p>Unity development is my primary specialization. These pages show the wider practice behind it: multimedia production, AI-assisted web and app workflows, and technical leadership.</p><a class="btn btn-gradient" href="games.html">View project portfolio <span>↗</span></a></header><section class="experience-card-grid" aria-label="Experience areas">' + cards + '</section><section class="overview-block"><div class="overview-block-heading"><h2>Professional experience</h2><p>A concise view of the teams, roles and technical work behind the portfolio.</p></div><div class="timeline-list">' + timelineItems + '</div></section><section class="overview-block earlier-block"><div class="overview-block-heading"><h2>Earlier technical experience</h2><p>Creative and technical roles that continue to support my multidisciplinary practice.</p></div><div class="earlier-grid">' + earlierItems + '</div></section></div>';
    main.hidden = false;
    document.title = 'Experience | Mus\'ab Anas';
  }

  function renderProjects(items) {
    if (!Array.isArray(items) || !items.length) return '';
    const cards = items.map(function (item) {
      return '<a class="related-project" style="' + accentStyle(areaAccents[experienceId]) + '" href="project.html?id=' + encodeURIComponent(item.id) + '"><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.description) + '</p><span>View project ↗</span></a>';
    }).join('');
    return '<div class="related-project-grid">' + cards + '</div>';
  }

  function renderPage(item) {
    const index = experiences.findIndex(function (entry) { return entry.id === item.id; });
    const next = experiences.length > 1 ? experiences[(index + 1) % experiences.length] : null;
    let html = '<div class="experience-container"><a class="experience-back" href="experience.html">← Back to experience overview</a><header class="experience-hero" style="' + accentStyle(areaAccents[item.id]) + '"><div><p class="experience-kicker">' + escapeHtml(item.eyebrow) + '</p><h1>' + escapeHtml(item.title) + '</h1><p class="experience-summary">' + escapeHtml(item.summary) + '</p><div class="experience-meta"><div><span>Focus</span><strong>' + escapeHtml(item.focus) + '</strong></div><div><span>Context</span><strong>' + escapeHtml(item.context) + '</strong></div><div><span>Period</span><strong>' + escapeHtml(item.period) + '</strong></div></div></div><aside class="experience-hero-panel"><strong>Unity-first<br>multidisciplinary practice</strong><p>Focused technical development with creative and delivery support around the work.</p></aside></header><div class="experience-content">';
    html += renderSection('01', 'Overview', item.title, '<p>' + escapeHtml(item.description) + '</p>');
    html += renderSection('02', 'Experience', 'How this work appears in practice', renderList(item.roles, 'experience-list'));
    html += renderSection('03', 'Contributions', 'What I bring to the work', renderList(item.contributions, 'experience-list'));
    html += renderSection('04', 'Tools and methods', 'Working toolkit', '<div class="experience-tool-list">' + item.tools.map(function (tool) { return '<span>' + escapeHtml(tool) + '</span>'; }).join('') + '</div>');
    const projects = renderProjects(item.projects);
    if (projects) html += renderSection('05', 'Related work', 'Selected project context', projects);
    html += '</div>';
    if (next) html += '<nav class="experience-next" aria-label="Next experience area"><a style="' + accentStyle(areaAccents[next.id]) + '" href="' + experienceUrl(next.id) + '"><span>Next experience area</span><strong>' + escapeHtml(next.title) + '</strong><i aria-hidden="true">→</i></a></nav>';
    html += '</div>';
    main.innerHTML = html;
    main.setAttribute('style', accentStyle(areaAccents[item.id]));
    main.hidden = false;
    document.title = item.title + ' | Mus\'ab Anas';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', item.summary);
  }

  function renderNotFound() {
    main.innerHTML = '<div class="experience-container experience-not-found"><a class="experience-back" href="experience.html">← Back to experience overview</a><h1>We couldn’t find that experience area.</h1><p>The link may be out of date. Choose one of the four areas on the overview page.</p><a class="btn btn-gradient" href="experience.html">See all experience</a></div>';
    main.hidden = false;
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

  function updateScrollState() {
    const header = document.querySelector('[data-header]');
    const progress = document.querySelector('.scroll-progress span');
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 15);
    if (progress) progress.style.width = (maxScroll ? window.scrollY / maxScroll * 100 : 0) + '%';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!experienceId) renderOverview(); else if (experience) renderPage(experience); else renderNotFound();
    initTheme();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
  });
}());
