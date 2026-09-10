// ==UserScript==
// @name         Torn Attack Page - Last Action
// @namespace    https://torn.com/
// @version      1.0.0
// @description  Shows the target's last action (relative time + status) on the attack page, pulled from the Torn API
// @author       Turt [2472641]
// @match        https://www.torn.com/page.php?sid=attack*
// @match        https://www.torn.com/loader2.php?sid=attack*
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// ==/UserScript==

(function () {
  'use strict';

  const API_KEY_STORE_KEY = 'torn_last_action_api_key';

  function getApiKey() {
    return GM_getValue(API_KEY_STORE_KEY, '');
  }

  function setApiKeyPrompt() {
    const current = getApiKey();
    const key = window.prompt('Enter your Torn API key (Limited access is enough):', current || '');
    if (key !== null) {
      GM_setValue(API_KEY_STORE_KEY, key.trim());
      window.location.reload();
    }
  }

  GM_registerMenuCommand('Set Torn API Key', setApiKeyPrompt);

  function getTargetIdFromUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get('user2ID') || url.searchParams.get('user2Id');
  }

  function isDarkMode() {
    // Torn's dark theme adds a class to <html> or <body>; fall back to prefers-color-scheme.
    const html = document.documentElement;
    const body = document.body;
    const classBlob = (html.className || '') + ' ' + (body.className || '');
    if (/dark/i.test(classBlob)) return true;
    if (/light/i.test(classBlob)) return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function statusColor(status) {
    switch ((status || '').toLowerCase()) {
      case 'online': return '#3ba55d';
      case 'idle': return '#e0a72c';
      case 'offline': return '#e04c4c';
      default: return '#888';
    }
  }

  function buildPanel() {
    const dark = isDarkMode();
    const panel = document.createElement('div');
    panel.id = 'tla-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      top: '70px',
      right: '16px',
      zIndex: 999999,
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontFamily: 'Arial, Helvetica, sans-serif',
      lineHeight: '1.4',
      boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      background: dark ? '#1e1f22' : '#ffffff',
      color: dark ? '#e6e6e6' : '#222222',
      border: dark ? '1px solid #3a3b3e' : '1px solid #d9d9d9',
      minWidth: '150px',
    });
    panel.innerHTML = `<div style="opacity:0.7;margin-bottom:2px;">Last Action</div><div id="tla-body">Loading…</div>`;
    document.body.appendChild(panel);
    return panel;
  }

  function renderResult(panel, data) {
    const body = panel.querySelector('#tla-body');
    console.log('[Torn Last Action] raw response:', data);
    if (!data || !data.last_action) {
      const keys = data ? Object.keys(data).join(', ') : 'none';
      body.innerHTML = `Unavailable<br><span style="opacity:0.6;">fields: ${keys}</span>`;
      return;
    }
    const { status, relative } = data.last_action;
    const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${statusColor(status)};margin-right:6px;"></span>`;
    const name = data.name ? `${data.name} ` : '';
    body.innerHTML = `${dot}<strong>${name}</strong><br>${status || '?'} — ${relative || '?'}`;
  }

  function renderError(panel, message) {
    const body = panel.querySelector('#tla-body');
    body.textContent = message;
  }

  function fetchLastAction(targetId, apiKey, panel) {
    const url = `https://api.torn.com/user/${targetId}?selections=profile&key=${encodeURIComponent(apiKey)}`;
    console.log('[Torn Last Action] requesting:', url.replace(apiKey, '***'));
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: function (res) {
        console.log('[Torn Last Action] raw responseText:', res.responseText);
        try {
          const data = JSON.parse(res.responseText);
          if (data.error) {
            renderError(panel, `API error: ${data.error.error}`);
            return;
          }
          renderResult(panel, data);
        } catch (e) {
          renderError(panel, 'Failed to parse API response');
        }
      },
      onerror: function () {
        renderError(panel, 'Request failed');
      },
    });
  }

  function init() {
    const apiKey = getApiKey();
    const targetId = getTargetIdFromUrl();

    if (!targetId) return; // attack page not recognised

    if (!apiKey) {
      const panel = buildPanel();
      const body = panel.querySelector('#tla-body');
      body.innerHTML = 'No API key set.<br><a href="#" id="tla-setkey" style="color:#4ea1ff;">Click to set one</a>';
      panel.querySelector('#tla-setkey').addEventListener('click', function (e) {
        e.preventDefault();
        setApiKeyPrompt();
      });
      return;
    }

    const panel = buildPanel();
    fetchLastAction(targetId, apiKey, panel);
  }

  // Attack pages are often loaded inside an iframe/loader; run once DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
