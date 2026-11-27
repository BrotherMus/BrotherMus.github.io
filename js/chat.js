/* Quick questions widget. Scripted, not AI: answers come from js/chat-data.js.
   A floating button opens a small panel; visitors pick a question and the answer appears as a chat reply. */
(function () {
  'use strict';

  const script = window.CHAT_SCRIPT;
  if (!script || !Array.isArray(script.questions) || !script.questions.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const asked = new Set();
  let started = false;
  let busy = false;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  const chatIcon = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4 5h16v11H9l-5 4z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M8 10h.01M12 10h.01M16 10h.01"/></svg>';

  const root = el('div', 'chat');
  const toggle = el('button', 'chat-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'chat-panel');
  toggle.innerHTML = chatIcon + '<span class="chat-toggle-text">Ask me</span>';

  const panel = el('section', 'chat-panel');
  panel.id = 'chat-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'chat-title');

  const head = el('div', 'chat-head');
  const headText = el('div', 'chat-head-text');
  const title = el('h2', 'chat-title', script.title);
  title.id = 'chat-title';
  headText.append(title, el('p', 'chat-subtitle', script.subtitle));
  const close = el('button', 'chat-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close quick questions');
  close.innerHTML = '<span aria-hidden="true">×</span>';
  head.append(headText, close);

  const log = el('div', 'chat-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  const options = el('div', 'chat-options');
  options.setAttribute('aria-label', 'Questions');
  options.setAttribute('role', 'group');

  panel.append(head, log);
  root.append(panel, toggle);
  document.body.appendChild(root);

  function scrollToEnd() {
    log.scrollTop = log.scrollHeight;
  }

  function addMessage(from, text, links) {
    const message = el('div', 'chat-msg chat-msg-' + from);
    if (from === 'bot') {
      const who = el('span', 'sr-only', 'Mus\'ab: ');
      message.appendChild(who);
    } else {
      message.appendChild(el('span', 'sr-only', 'You asked: '));
    }
    message.appendChild(el('p', '', text));
    if (links && links.length) {
      const row = el('div', 'chat-links');
      links.forEach(function (link) {
        const a = el('a', 'chat-link', link.label);
        a.href = link.href;
        if (link.external) {
          a.target = '_blank';
          a.rel = 'noreferrer';
          a.insertAdjacentHTML('beforeend', ' <span aria-hidden="true">↗</span>');
        } else if (link.href.indexOf('mailto:') !== 0) {
          a.insertAdjacentHTML('beforeend', ' <span aria-hidden="true">→</span>');
        }
        row.appendChild(a);
      });
      message.appendChild(row);
    }
    log.insertBefore(message, options.parentNode === log ? options : null);
    scrollToEnd();
    return message;
  }

  function renderOptions(focusFirst) {
    options.innerHTML = '';
    if (asked.size >= script.questions.length) asked.clear();
    script.questions.forEach(function (item) {
      if (asked.has(item.id)) return;
      const button = el('button', 'chat-option', item.q);
      button.type = 'button';
      button.addEventListener('click', function () { ask(item); });
      options.appendChild(button);
    });
    if (focusFirst && options.firstElementChild) options.firstElementChild.focus();
  }

  function ask(item) {
    if (busy) return;
    busy = true;
    asked.add(item.id);
    options.innerHTML = '';
    addMessage('user', item.q);

    function answer(typing) {
      if (typing) typing.remove();
      const reply = addMessage('bot', item.a, item.links);
      busy = false;
      renderOptions(false);
      if (options.firstElementChild) {
        options.insertBefore(el('p', 'chat-more', script.moreLabel), options.firstElementChild);
      }
      // Show the answer from its top, with the next questions underneath it.
      log.scrollTop = Math.max(0, reply.offsetTop - 12);
      const next = options.querySelector('.chat-option');
      if (next) next.focus({ preventScroll: true });
    }

    if (reduceMotion) {
      answer(null);
    } else {
      const typing = el('div', 'chat-msg chat-msg-bot chat-typing');
      typing.setAttribute('aria-hidden', 'true');
      typing.innerHTML = '<span></span><span></span><span></span>';
      log.insertBefore(typing, options);
      scrollToEnd();
      window.setTimeout(function () { answer(typing); }, 650);
    }
  }

  function open() {
    panel.hidden = false;
    root.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      addMessage('bot', script.greeting);
      log.appendChild(options);
      renderOptions(false);
    }
    const first = options.querySelector('.chat-option') || close;
    first.focus();
  }

  function shut(returnFocus) {
    panel.hidden = true;
    root.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (panel.hidden) open(); else shut(false);
  });
  close.addEventListener('click', function () { shut(true); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !panel.hidden) shut(true);
  });
}());
