'use strict';
/* ═══════════════════════════════════════════════════════════════
   공통 엔진 — 모든 모듈(MM·PP·QM …)이 공유한다. 모듈 콘텐츠는 넣지 않는다.
   router · touchGuide · DemoPlayer · 문서 시각 · 승인 확인 · 아키텍처 모달
═══════════════════════════════════════════════════════════════ */

/* ─── ROUTER ─────────────────────────────── */
window.router = {
  current: 'home',
  go(pageId) {
    try {
      const prev = document.getElementById(this.current);
      const next = document.getElementById(pageId);
      if (!next || pageId === this.current) return;
      if (prev) {
        prev.classList.remove('active');
        prev.style.display = 'none';
      }
      next.classList.remove('entering');
      next.classList.add('active', 'entering');
      next.style.display = 'flex';
      next.style.opacity = '1';
      setTimeout(() => next.classList.remove('entering'), 450);
      this.current = pageId;
      try { applyDocTimes(); } catch(e){}
      try { touchGuide.hideAll(); } catch(e){}
    } catch(e) {
      console.error('router.go error:', e);
    }
  }
};
const router = window.router; // local alias for internal script references

/* ─── TOUCH GUIDE ────────────────────────── */
const touchGuide = {
  overlay: document.getElementById('touch-overlay'),
  rings: [],
  hints: [],
  showPulse(el, label = '👆 여기를 터치하세요') {
    if (!el) return;
    this.hideAll();
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const ring = document.createElement('div');
    ring.className = 'pulse-ring';
    ring.style.left = cx + 'px';
    ring.style.top  = cy + 'px';
    this.overlay.appendChild(ring);
    this.rings.push(ring);
    const hint = document.createElement('div');
    hint.className = 'tap-hint';
    hint.textContent = label;
    hint.style.left = cx + 'px';
    hint.style.top  = (cy + 44) + 'px';
    this.overlay.appendChild(hint);
    this.hints.push(hint);
  },
  hideAll() {
    this.rings.forEach(r => r.remove());
    this.hints.forEach(h => h.remove());
    this.rings = []; this.hints = [];
  }
};

/* ─── RIPPLE ─────────────────────────────── */
document.addEventListener('click', e => {
  const target = e.target.closest('button, .scenario-card, .preset-btn, .action-btn');
  if (!target) return;
  target.style.position = target.style.position || 'relative';
  target.style.overflow = 'hidden';
  const r = document.createElement('span');
  r.className = 'ripple';
  const rect = target.getBoundingClientRect();
  r.style.left = (e.clientX - rect.left - 10) + 'px';
  r.style.top  = (e.clientY - rect.top  - 10) + 'px';
  target.appendChild(r);
  setTimeout(() => r.remove(), 620);
});

/* ─── KEYBOARD NAV ─────────────────────────
   ←/→·Space: 홈에서는 에이전트 이동, 에이전트 화면에서는 다음 단계. 숫자 1~9: n번째 에이전트. ESC: 홈 */
function agentPageIds() {
  /* 홈 카드가 있는 에이전트만 (MM 페이지에 스토리용으로 실린 PP·QM 화면은 제외) */
  return Array.from(document.querySelectorAll('section.page[id]'))
    .map(s => s.id).filter(id => demoPlayers[id] && document.querySelector(`#home [onclick*="'${id}'"]`));
}
document.addEventListener('keydown', e => {
  const agents = ['home', ...agentPageIds()];
  const idx = agents.indexOf(router.current);
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    if (router.current !== 'home' && demoPlayers[router.current]) {
      demoPlayers[router.current].next();
    } else if (idx < agents.length - 1) {
      router.go(agents[idx + 1]);
    }
  }
  if (e.key === 'ArrowLeft') {
    if (idx > 0) router.go(agents[idx - 1]);
  }
  if (e.key === 'Escape') router.go('home');
  if (e.key >= '1' && e.key <= '9' && agents[+e.key]) router.go(agents[+e.key]);
});

/* ─── ARCH TOGGLE ────────────────────────── */
function toggleArch(id) {
  const content = document.getElementById(id);
  const btn = content.previousElementSibling;
  content.classList.toggle('open');
  btn.classList.toggle('open');
}

/* ─── DEMO PLAYER ────────────────────────── */
class DemoPlayer {
  constructor(cfg) {
    this.id        = cfg.id;          // 'agent1' etc
    this.steps     = cfg.steps;       // array of step functions
    this.flowData  = cfg.flow;        // [{icon,label}]
    this.archData  = cfg.arch;        // arch nodes config
    this.techData  = cfg.tech;        // tech badge strings
    this.curStep   = 0;
    this.playing   = false;
    this.autoTimer = null;
    this._init();
  }

  _init() {
    this._buildFlow();
    this._buildArch();
    this._buildTech();
    this._updateCounter();
    const totalEl = document.getElementById(this.id.replace('agent','a') + '-step-tot');
    if (totalEl) totalEl.textContent = this.steps.length;
  }

  _buildFlow() {
    const bar = document.getElementById(this.id.replace('agent','a') + '-flow');
    if (!bar) return;
    bar.innerHTML = '';
    this.flowData.forEach((s, i) => {
      if (i > 0) {
        const arr = document.createElement('span');
        arr.className = 'flow-arrow';
        arr.id = `${this.id}-farr-${i}`;
        arr.textContent = '→';
        bar.appendChild(arr);
      }
      const div = document.createElement('div');
      div.className = 'flow-step';
      div.id = `${this.id}-fstep-${i}`;
      div.innerHTML = `<span class="step-icon">${s.icon}</span><span>${s.label}</span>`;
      bar.appendChild(div);
    });
  }

  _buildArch() {
    const inner = document.getElementById(this.id.replace('agent','a') + '-arch-inner');
    if (!inner || !this.archData) return;
    inner.innerHTML = '';
    this.archData.forEach((item, i) => {
      if (item.arrow) {
        const arr = document.createElement('div');
        arr.className = 'arch-arrow';
        arr.innerHTML = `${item.label ? `<span class="arrow-label">${item.label}</span>` : ''}→`;
        inner.appendChild(arr);
      } else {
        const node = document.createElement('div');
        node.className = 'arch-node';
        node.innerHTML = `
          <span class="arch-icon">${item.icon}</span>
          <div class="arch-node-box ${item.type}">${item.name}</div>
          <span class="arch-label">${item.sub || ''}</span>`;
        inner.appendChild(node);
      }
    });
  }

  _buildTech() {
    const el = document.getElementById(this.id.replace('agent','a') + '-tech');
    if (!el || !this.techData) return;
    el.innerHTML = this.techData.map(t =>
      `<span class="tech-badge ${t.cls || ''}">${t.label}</span>`
    ).join('');
  }

  _updateCounter() {
    const cur = document.getElementById(this.id.replace('agent','a') + '-step-cur');
    if (cur) cur.textContent = this.curStep;
  }

  _setFlowActive(stepIdx) {
    this.flowData.forEach((_, i) => {
      const el  = document.getElementById(`${this.id}-fstep-${i}`);
      const arr = document.getElementById(`${this.id}-farr-${i}`);
      if (!el) return;
      el.classList.remove('active','done');
      if (arr) arr.classList.remove('lit');
      if (i < stepIdx)      { el.classList.add('done'); if (arr) arr.classList.add('lit'); }
      else if (i === stepIdx) el.classList.add('active');
    });
  }

  start() {
    if (this.playing) { this.next(); return; }
    this.playing = true;
    const btn = document.getElementById(this.id.replace('agent','a') + '-btn');
    if (btn) { btn.textContent = '⏭ 다음 단계'; btn.classList.add('playing'); }
    this.next();
  }

  next() {
    if (this.curStep >= this.steps.length) { this._complete(); return; }
    const stepFn = this.steps[this.curStep];
    stepFn(this);
    this.curStep++;
    this._updateCounter();
  }

  reset() {
    clearTimeout(this.autoTimer);
    this.curStep = 0;
    this.playing = false;
    const btn = document.getElementById(this.id.replace('agent','a') + '-btn');
    if (btn) { btn.textContent = '▶ 데모 시작'; btn.classList.remove('playing'); }
    const chat = document.getElementById(this.id.replace('agent','a') + '-chat');
    const result = document.getElementById(this.id.replace('agent','a') + '-result');
    const presets = document.getElementById(this.id.replace('agent','a') + '-presets');
    if (chat) chat.innerHTML = '';
    if (result) result.innerHTML = '<div class="result-title">📊 분석 결과 & 액션</div>';
    if (presets) presets.innerHTML = '';
    this._buildFlow();
    this._updateCounter();
    touchGuide.hideAll();
  }

  _complete() {
    this.playing = false;
    const btn = document.getElementById(this.id.replace('agent','a') + '-btn');
    if (btn) { btn.textContent = '✅ 완료'; btn.classList.remove('playing'); }
    this._setFlowActive(this.flowData.length);
    touchGuide.hideAll();
  }

  /* ── helpers ── */
  chat(id) { return document.getElementById(this.id.replace('agent','a') + '-chat'); }
  result(id) { return document.getElementById(this.id.replace('agent','a') + '-result'); }
  presets() { return document.getElementById(this.id.replace('agent','a') + '-presets'); }

  addMsg(type, html, cb) {
    const chat = this.chat();
    if (!chat) return null;
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${type}`;
    const avatarText = type === 'user' ? '나' : type === 'ai' ? 'J' : '⚙';
    wrap.innerHTML = `
      <div class="msg-avatar">${avatarText}</div>
      <div class="bubble">${html}</div>`;
    chat.appendChild(wrap);
    chat.scrollTop = chat.scrollHeight;
    if (cb) cb(wrap.querySelector('.bubble'));
    return wrap;
  }

  addThinking(text = '분석 중') {
    const chat = this.chat();
    if (!chat) return null;
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ai';
    wrap.id = `${this.id}-thinking`;
    const steps = Array.isArray(text) ? text : [text];
    wrap.innerHTML = `
      <div class="msg-avatar">J</div>
      <div class="thinking-bubble cot">
        <div class="cot-head">
          <span class="thinking-label">추론 중</span>
          <div class="thinking-dots"><span></span><span></span><span></span></div>
        </div>
        <ol class="cot-steps"></ol>
      </div>`;
    chat.appendChild(wrap);
    const list = wrap.querySelector('.cot-steps');
    let i = 0;
    const showNext = () => {
      const prev = list.lastElementChild;
      if (prev) prev.classList.add('done');
      if (i >= steps.length) return;
      const li = document.createElement('li');
      li.textContent = steps[i++];
      list.appendChild(li);
      chat.scrollTop = chat.scrollHeight;
    };
    showNext();
    this._thinkingTimer = setInterval(() => {
      if (i >= steps.length) { clearInterval(this._thinkingTimer); return; }
      showNext();
    }, 550);
    chat.scrollTop = chat.scrollHeight;
    return wrap;
  }

  removeThinking() {
    clearInterval(this._thinkingTimer);
    const el = document.getElementById(`${this.id}-thinking`);
    if (!el) return;
    // 추론이 끝나면 버블을 지우지 않고 접힌 토글로 남겨 다시 볼 수 있게 함
    el.removeAttribute('id');
    const bubble = el.querySelector('.thinking-bubble');
    const list = el.querySelector('.cot-steps');
    if (!bubble || !list) { el.remove(); return; }
    list.querySelectorAll('li').forEach(li => li.classList.add('done'));
    const n = list.children.length;
    const details = document.createElement('details');
    details.className = 'thinking-bubble cot cot-done';
    details.innerHTML = `<summary class="cot-head"><span class="cot-caret">▸</span><span class="thinking-label"><span class="lbl-closed">추론 과정 보기</span><span class="lbl-open">추론 과정 접기</span></span><span class="cot-count">${n}단계</span></summary>`;
    details.appendChild(list);
    bubble.replaceWith(details);
  }

  addResultCard(html) {
    const panel = this.result();
    if (!panel) return;
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = html;
    panel.appendChild(card);
  }

  addPresets(buttons) {
    const p = this.presets();
    if (!p) return;
    p.innerHTML = '';
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn' + (b.highlight ? ' highlight' : '');
      btn.textContent = b.label;
      btn.onclick = b.action || (() => this.next());
      p.appendChild(btn);
    });
    if (buttons.length > 0) {
      const firstHighlight = p.querySelector('.highlight') || p.querySelector('.preset-btn');
      touchGuide.showPulse(firstHighlight);
    }
  }

  typewriter(el, text, speed = 22, cb) {
    if (!el) return;
    el.classList.add('tw-cursor');
    let i = 0;
    const orig = el.innerHTML;
    el.innerHTML = '';
    const tick = () => {
      if (i < text.length) {
        el.innerHTML += text[i] === '<' 
          ? (() => { const end = text.indexOf('>', i); const tag = text.slice(i, end+1); i = end; return tag; })()
          : text[i];
        i++;
        setTimeout(tick, speed);
      } else {
        el.classList.remove('tw-cursor');
        if (cb) cb();
      }
    };
    tick();
  }

  delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}

/* ─── DEMO PLAYERS (populated in STEP 3~5) ── */
const demoPlayers = {};
window.demoPlayers = demoPlayers; // ← ensure onclick="" handlers can access demoPlayers

/* ─── CLOCK ──────────────────────────────── */
function updateClock() {
  const el = document.getElementById('home-clock');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  const mo = now.getMonth()+1; const d = now.getDate();
  el.innerHTML = `<div style="font-size:11px;color:var(--sap-text-dim);margin-bottom:1px">${now.getFullYear()}.${String(mo).padStart(2,'0')}.${String(d).padStart(2,'0')}</div>${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ─── DOCUMENT TIMESTAMPS ─────────────────
   Fiori 문서(PO 변경·회계전표·PR·STO) 생성 시각을 화면 시계와 맞춤.
   채팅에서 문서가 생성되는 순간 stampDoc(key)로 시각을 기록하고,
   기록이 없으면 Fiori 화면을 처음 연 시각을 사용한다. */
const docTimes = {};
function fmtDocTime(d, fmt) {
  const p = n => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}.${p(d.getMonth()+1)}.${p(d.getDate())}`;
  if (fmt === 'date') return date;
  if (fmt === 'minute') return `${date} ${p(d.getHours())}:${p(d.getMinutes())}`;
  return `${date} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function applyDocTimes() {
  document.querySelectorAll('[data-doc-time]').forEach(el => {
    const key = el.dataset.docTime;
    if (!docTimes[key]) {
      const page = el.closest('section.page');
      if (!page || page.style.display === 'none' || !page.classList.contains('active')) return;
      docTimes[key] = new Date();
    }
    el.textContent = fmtDocTime(docTimes[key], el.dataset.fmt);
  });
}
function stampDoc(key) { docTimes[key] = new Date(); applyDocTimes(); }
setInterval(applyDocTimes, 1000);

/* ─── APPROVAL CONFIRM (예 / 아니오) ─────────
   승인이 필요한 AI 메시지 하단에 질문 + 예/아니오 버튼을 붙인다.
   예 → 다음 단계 진행, 아니오 → 보류 안내 후 '다시 진행하기' 제안 */
function jConfirm(agentId, question) {
  return `<div class="j-confirm" data-agent="${agentId}">
    <div class="j-confirm-q">${question}</div>
    <div class="j-confirm-btns">
      <button class="j-confirm-btn j-yes" onclick="jConfirmClick(this, true)">예</button>
      <button class="j-confirm-btn j-no" onclick="jConfirmClick(this, false)">아니오</button>
    </div>
  </div>`;
}
function jYesBtn(p) {
  const all = p.chat() ? p.chat().querySelectorAll('.j-confirm .j-yes:not(:disabled)') : [];
  return all.length ? all[all.length - 1] : null;
}
function jConfirmClick(btn, yes) {
  const box = btn.closest('.j-confirm');
  if (!box || box.classList.contains('answered')) return;
  const p = demoPlayers[box.dataset.agent];
  if (!p) return;
  box.classList.add('answered');
  box.querySelectorAll('button').forEach(b => { b.disabled = true; });
  btn.classList.add('chosen');
  try { touchGuide.hideAll(); } catch(e){}
  if (p.presets()) p.presets().innerHTML = '';
  if (yes) { p.next(); return; }
  p.addMsg('user', '아니오');
  setTimeout(() => {
    p.addMsg('ai', '알겠습니다. 이 작업은 진행하지 않고 보류해 둘게요. 필요하시면 언제든 다시 요청해 주세요.');
    p.addPresets([{ label: '↩ 다시 진행하기', highlight: true }]);
  }, 500);
}

/* ─── HOME CARD PULSE GUIDE ─────────────── */
setTimeout(() => {
  const c = document.getElementById('card1');
  const home = document.getElementById('home');
  if (c && home && home.classList.contains('active')) {
    c.classList.add('pulse-guide');
    touchGuide.showPulse(c, '👆 카드를 터치해 데모 시작');
    setTimeout(() => {
      c.classList.remove('pulse-guide');
      touchGuide.hideAll();
    }, 6000);
  }
}, 2000);

/* ─── ARCHITECTURE MODAL ─────────────────
   모듈은 ARCH_MODAL_META[agentId] = {title, subtitle, badges} 를 등록하고,
   다이어그램은 js/arch-diagram.js 가 AGENT_ARCH[agentId] 에 만든다. */
window.ARCH_MODAL_META = window.ARCH_MODAL_META || {};
window.AGENT_ARCH = window.AGENT_ARCH || {};
window.openArchModal = function (agentId) {
  const m = ARCH_MODAL_META[agentId] || { title: '아키텍처', subtitle: '', badges: [] };
  document.getElementById('arch-modal-title').textContent = m.title;
  document.getElementById('arch-modal-subtitle').textContent = m.subtitle || '';
  document.getElementById('arch-modal-svg').innerHTML = AGENT_ARCH[agentId] || '';
  document.getElementById('arch-modal-badges').innerHTML = (m.badges || []).map(b => `<span class="tech-badge">${b}</span>`).join('');
  document.getElementById('arch-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeArchModal = function () {
  document.getElementById('arch-modal').classList.remove('open');
  document.body.style.overflow = '';
};
(function () {
  const m = document.getElementById('arch-modal');
  if (m) m.addEventListener('click', function (e) { if (e.target === this) closeArchModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeArchModal(); });
})();

/* ─── Joule 아바타 아이콘 ─── */
document.addEventListener('DOMContentLoaded', () => {
  const JOULE_SVG = `<svg viewBox="0 0 53 53" style="width:100%;height:100%;display:block" aria-label="Joule"><use href="#fi-joule"/></svg>`;
  document.querySelectorAll('.joule-avatar').forEach(el => { el.innerHTML = JOULE_SVG; });
});

/* ─── 결과 패널 대시보드 헬퍼 (모듈 공용) ───
   색은 var(--j-pos) 같은 토큰을 넘기면 다크 모드에서도 그대로 맞는다. */
window.DB = {
  card: (inner) => `<div class="db-card">${inner}</div>`,
  hdr: (icon, title, sub) => `<div class="db-hdr"><span class="db-hdr-icon">${icon}</span><div><div class="db-hdr-title">${title}</div><div class="db-hdr-sub">${sub}</div></div></div>`,
  kpis: (items) => `<div class="db-kpi-row">${items.map(([val, lbl, col, sub]) => `<div class="db-kpi" style="--db-acc:${col}"><div class="db-kpi-lbl">${lbl}</div><div class="db-kpi-val" style="color:${col}">${val}</div>${sub ? `<div class="db-kpi-sub">${sub}</div>` : ''}</div>`).join('')}</div>`,
  bar: (lbl, w, col, amt) => `<div class="db-bar-row"><div class="db-bar-lbl"><span>${lbl}</span><span style="color:${col};font-weight:700">${amt}</span></div><div class="db-bar-trk"><div class="db-bar-fill" style="width:${w}%;background:${col}"></div></div></div>`,
  chart: (title, inner) => `<div class="db-chart-wrap" style="margin-top:12px"><div class="db-chart-ttl">${title}</div>${inner}</div>`,
  insight: (html) => `<div class="db-insight" style="margin-top:10px">${html}</div>`,
  done: (p, title, desc) => {
    const b = document.createElement('div'); b.className = 'completion-banner';
    b.innerHTML = `<span class="banner-icon">🎉</span><div><h3>${title}</h3><p>${desc}</p></div>`;
    p.result().appendChild(b);
  }
};

/* ─── 모듈 탭 (홈 화면 제목 아래) ─── */
window.MODULES = [
  { id: 'mm', label: 'MM 구매·재고', href: 'index.html' },
  { id: 'pp', label: 'PP 생산', href: 'pp.html' },
  { id: 'qm', label: 'QM 품질', href: 'qm.html' }
];
document.addEventListener('DOMContentLoaded', () => {
  const box = document.getElementById('mod-tabs'); if (!box) return;
  const cur = document.body.dataset.module || 'mm';
  box.innerHTML = MODULES.map(m => m.id === cur
    ? `<span class="mod-tab on">${m.label}</span>`
    : `<a class="mod-tab" href="${m.href}">${m.label}</a>`).join('');
});
