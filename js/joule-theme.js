/* ═══════════════════════════════════════════════════════════════
   JOULE SPACES THEME — layout restructure, chat chrome, color remap
═══════════════════════════════════════════════════════════════ */
(function jouleSpacesTheme(){
  'use strict';
  document.body.classList.add('light');

  const ICON = {
    logo: `<svg viewBox="0 0 53 53" width="30" height="30"><defs><radialGradient id="jlg__ID__" cx="0.64" cy="0.36" r="0.78"><stop offset="0" stop-color="#B57BF1"/><stop offset=".45" stop-color="#8446E6"/><stop offset="1" stop-color="#3A1BD6"/></radialGradient></defs><path d="M12 1H41Q44 1 46 3.5L51 13Q53 17 50.5 20.5L29 50Q26.5 53 24 50L2.5 20.5Q0 17 2 13L7 3.5Q9 1 12 1Z" fill="url(#jlg__ID__)"/><path d="M36.5 9.5C37.3 15.5 39 17.2 45 18C39 18.8 37.3 20.5 36.5 26.5C35.7 20.5 34 18.8 28 18C34 17.2 35.7 15.5 36.5 9.5Z" fill="#fff"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>`,
    space: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>`,
    agents: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4.5" r="1.8"/><circle cx="12" cy="19.5" r="1.8"/><circle cx="4.5" cy="8.2" r="1.8"/><circle cx="19.5" cy="8.2" r="1.8"/><circle cx="4.5" cy="15.8" r="1.8"/><circle cx="19.5" cy="15.8" r="1.8"/></svg>`,
    doc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>`,
    up: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 11v9H4v-9zM7 11l4-8c1.5 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 6.6A2.5 2.5 0 0 1 17.3 20H7"/></svg>`,
    down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 13V4H4v9zM7 13l4 8c1.5 0 2.5-1 2.2-2.6L12.6 15H19a2 2 0 0 0 2-2.3l-1.2-6.6A2.5 2.5 0 0 0 17.3 4H7"/></svg>`,
    redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg>`,
    bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>`
  };

  let railSeq = 0;
  function rail(activeSpace) {
    const logo = ICON.logo.replace(/__ID__/g, String(++railSeq));
    const nav = document.createElement('nav');
    nav.className = 'j-rail';
    nav.innerHTML = `
      <div class="j-rail-logo" title="홈" onclick="router.go('home')">${logo}</div>
      <div class="j-rail-btn" title="Chat">${ICON.chat}</div>
      <div class="j-rail-btn ${activeSpace ? 'on' : ''}" title="Spaces" onclick="router.go('home')">${ICON.space}</div>
      <div class="j-rail-spacer"></div>
      <div class="j-rail-btn" title="Agents">${ICON.agents}</div>
      <div class="j-rail-avatar" title="김재형">JK</div>`;
    return nav;
  }

  /* ── Home: rail + canvas ── */
  const home = document.getElementById('home');
  if (home && !home.classList.contains('j-shell')) {
    const canvas = document.createElement('div');
    canvas.className = 'j-canvas';
    while (home.firstChild) canvas.appendChild(home.firstChild);
    home.appendChild(rail(true));
    home.appendChild(canvas);
    home.classList.add('j-shell');
    canvas.style.marginRight = '10px';
  }

  /* ── Agent pages: rail | canvas(header, flow, result, arch) | chat ── */
  document.querySelectorAll('section.page[id^="agent"]').forEach(sec => {
    if (sec.classList.contains('j-shell')) return;
    const header = sec.querySelector(':scope > .page-header');
    const flow   = sec.querySelector(':scope > .process-flow-bar');
    const area   = sec.querySelector(':scope > .demo-area');
    const arch   = sec.querySelector(':scope > .arch-section');
    const panel  = area && area.querySelector('.joule-panel');
    const result = area && area.querySelector('.result-panel');
    if (!header || !panel || !result) return;

    // toolbar doc chip + "refreshed" label in title row
    const title = header.querySelector('.agent-title');
    const numEl = title && title.querySelector('.agent-num');
    const plainTitle = title ? title.textContent.slice(numEl ? numEl.textContent.length : 0).trim() : '';
    const chip = document.createElement('span');
    chip.className = 'j-doc-chip';
    chip.innerHTML = `${ICON.doc}<span>${plainTitle}</span>`;
    header.insertBefore(chip, header.querySelector('.demo-controls'));
    if (title) {
      const r = document.createElement('span');
      r.className = 'j-refreshed';
      r.textContent = '방금 업데이트됨';
      title.appendChild(r);
    }

    // chat header → title + icons
    const ph = panel.querySelector('.joule-panel-header');
    const sub = ph && ph.querySelector('p');
    const agentName = sub ? sub.textContent.split('·')[0].trim() : 'Joule';
    if (ph) ph.innerHTML = `<span class="j-chat-title">${plainTitle}</span><span class="j-chat-icons"><span>⋯</span><span>✕</span></span>`;

    // message input box
    const input = document.createElement('div');
    input.className = 'j-input';
    input.innerHTML = `
      <div class="j-input-ph">Message Joule...</div>
      <div class="j-input-bar">
        <span class="j-ib">＋</span><span class="j-ib">@</span><span class="j-ib on">☰</span>
        <span class="j-tag j-tag-pink">@ ${agentName} <i>✕</i></span>
        <span class="j-tag j-tag-lilac">◈ Space <i>✕</i></span>
        <span class="j-send"></span>
      </div>`;
    panel.appendChild(input);

    const canvas = document.createElement('div');
    canvas.className = 'j-canvas';
    [header, flow, result, arch].forEach(el => el && canvas.appendChild(el));
    sec.innerHTML = '';
    sec.appendChild(rail(true));
    sec.appendChild(canvas);
    sec.appendChild(panel);
    sec.classList.add('j-shell');
  });

  /* ── AI message chrome: action icons + sources ── */
  if (typeof DemoPlayer !== 'undefined' && !DemoPlayer.prototype._jWrapped) {
    const origAddMsg = DemoPlayer.prototype.addMsg;
    let srcSeed = 0;
    DemoPlayer.prototype.addMsg = function(type, html, cb) {
      const wrap = origAddMsg.call(this, type, html, cb);
      if (wrap && type === 'ai') {
        const bubble = wrap.querySelector('.bubble');
        const col = document.createElement('div');
        col.className = 'j-msg-col';
        bubble.replaceWith(col);
        col.appendChild(bubble);
        const n = 2 + (srcSeed++ % 4);
        const act = document.createElement('div');
        act.className = 'j-msg-actions';
        act.innerHTML = `${ICON.copy}${ICON.up}${ICON.down}${ICON.redo}${ICON.bulb}<span class="j-sources">Sources <b>${n}</b></span>`;
        col.appendChild(act);
        const chat = this.chat(); if (chat) chat.scrollTop = chat.scrollHeight;
      }
      return wrap;
    };
    DemoPlayer.prototype._jWrapped = true;
  }

  /* ── Color remap: legacy dark-theme neon → Horizon palette ── */
  const MAP = {
    '#ff4444':'#AA0808','#ff6464':'#AA0808','#ff6666':'#AA0808','#ff6b6b':'#AA0808',
    '#ff9a3c':'#C35500','#ffb86c':'#C35500','#ff8c00':'#E76500',
    '#5aafff':'#0064D9','#7ac0ff':'#0064D9','#7ec8ff':'#0064D9','#2196f3':'#0064D9',
    '#4cde72':'#256F3A','#5de080':'#256F3A',
    '#a78bfa':'#5D36FF','#b39dff':'#5D36FF','#c4b5fd':'#C9BDFF',
    '#bb0000':'#D20A0A','#e9730c':'#E76500','#0070f2':'#0064D9',
    '#7c3aed':'#5D36FF','#7c4dff':'#5D36FF','#6d28d9':'#4A2BD9','#a855f7':'#7858FF',
    '#00e5d1':'#0064D9','#00e5c9':'#0064D9','#0ec4d1':'#0064D9',
    '#2e4a6a':'#A9B4BE','#5a7a9a':'#758CA4','#8090a0':'#758CA4'
  };
  const HEX = /#[0-9a-fA-F]{6}\b/g;
  const swap = s => s.replace(HEX, h => MAP[h.toLowerCase()] || h);
  const SKIP = '.scoring-formula-card, #arch-modal, .arch-svg-wrap, .j-rail';
  function remapEl(el) {
    if (!el || el.nodeType !== 1 || el.closest(SKIP)) return;
    for (const a of ['style','fill','stroke']) {
      const v = el.getAttribute(a);
      if (v && HEX.test(v)) { HEX.lastIndex = 0; const nv = swap(v); if (nv !== v) el.setAttribute(a, nv); }
      HEX.lastIndex = 0;
    }
  }
  function remapTree(root) {
    remapEl(root);
    if (root.querySelectorAll) root.querySelectorAll('[style],[fill],[stroke]').forEach(remapEl);
  }
  remapTree(document.body);
  new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) remapTree(n); }));
  }).observe(document.body, { childList: true, subtree: true });
})();
