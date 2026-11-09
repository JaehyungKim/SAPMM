(function(){
  'use strict';
  var ALL_PAGES = [
    'home','agent1','agent2','agent3','agent4','agent5','agent6','agent7',
    'risk-scoring','fiori-po-delivery','fiori-accounting-doc','fiori-pr-display','fiori-sto-display',
    'fiori-sto-object','fiori-matdoc','story-closing'
  ];

  /* Ensure step counters match actual step lengths */
  if (window.demoPlayers) {
    Object.keys(window.demoPlayers).forEach(function(k) {
      var p = window.demoPlayers[k];
      if (p && p._init) p._init();
    });
  }

  function goTo(id) {
    ALL_PAGES.forEach(function(p) {
      var el = document.getElementById(p);
      if (!el) return;
      if (p === id) {
        el.classList.add('active', 'entering');
        el.style.display = 'flex';
        el.style.opacity = '1';
        setTimeout(function(){ el.classList.remove('entering'); }, 450);
      } else {
        el.classList.remove('active', 'entering');
        el.style.display = 'none';
        el.style.opacity = '0';
      }
    });
    window.router.current = id;

    if (window.touchGuide && window.touchGuide.hideAll) {
      try { window.touchGuide.hideAll(); } catch(e){}
    }

    /* Automatically trigger Step 0 (welcome & preset buttons) when entering an agent page */
    if (id.indexOf('agent') === 0 && window.demoPlayers && window.demoPlayers[id]) {
      var player = window.demoPlayers[id];
      if (player.curStep === 0 && !player.playing) {
        setTimeout(function() {
          player.start();
        }, 250);
      }
    }
  }

  window.router = {
    current: 'home',
    go: function(id) {
      try { goTo(id); } catch(e) { console.error('nav error', e); }
    }
  };

  /* Ensure home is visible on initial load */
  ALL_PAGES.forEach(function(p) {
    var el = document.getElementById(p);
    if (!el) return;
    if (p === 'home') {
      el.classList.add('active');
      el.style.display = 'flex';
      el.style.opacity = '1';
    } else {
      el.classList.remove('active');
      el.style.display = 'none';
    }
  });

  if (!window.demoPlayers) window.demoPlayers = {};

  console.log('✅ Navigation & Auto-start patch active — router:', window.router.current);
})();
