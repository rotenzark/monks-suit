/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'monks-suit',
    /* WhatsApp: i link wa.me sono già scritti nell'HTML */
    whatsapp: { number: '', message: '', ids: [] },
    /* pannello Google (riletto il 1/10/2026): lunedì–venerdì 10–19, sabato 10–17, domenica chiuso (la consegna a domicilio a parte) */
    hours: {
      0: [], 1: [['10:00', '19:00']], 2: [['10:00', '19:00']], 3: [['10:00', '19:00']],
      4: [['10:00', '19:00']], 5: [['10:00', '19:00']], 6: [['10:00', '17:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Monks Suit: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.dettagli": "The details",
      "n.servizi": "What we do",
      "n.come": "How it works",
      "n.laboratorio": "The workshop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Bespoke tailoring · Corso Vittorio Emanuele II 22, a short walk from the Duomo",
      "h.titolo": "True luxury is a garment that fits perfectly.",
      "h.seconda": "Bespoke suits, tailoring repairs and alterations, hand-sewn buttonholes. By appointment.",
      "h.testo": "A tailoring house in its third generation: measurements, fittings, alterations on garments by other brands too, in our workshop or at your home.",
      "h.google": "on Google, 69 reviews",
      "h.chi": "Silvia Congiu, in a review on Google (in English: «Without a doubt the best tailor’s in Milan for precision, welcome and service.»)",
      "p.titolo": "The hand-sewn buttonhole",
      "p.desc": "The front of a jacket near the edge, on the tailor’s table. The chalk mark, the eyelet and the cut; then a needle sews the buttonhole stitch one by one all the way round, up to the bar tack. The needle leaves, the chalk is brushed away, the purl edge catches the light. Three buttonholes: navy pinstripe, grey with red thread, shirt.",
      "p.d0": "Navy pinstripe: the keyhole buttonhole of a jacket, in silk thread.",
      "p.d1": "Grey: the keyhole buttonhole, in contrasting red thread.",
      "p.d2": "Shirt: the straight buttonhole, in white thread.",
      "p.modi": "Which buttonhole",
      "p.b0": "Navy pinstripe",
      "p.b1": "Grey",
      "p.b2": "Shirt",
      "p.nota": "The hand-sewn buttonhole: the chalk mark, the cut, the stitches one by one up to the bar tack.",
      "c.etichetta": "The details",
      "c.titolo": "Before the suit, there are the details.",
      "c.sotto": "«Threads, colours, fabrics and expert hands. This is how bespoke takes shape»",
      "a.fili": "Cones of coloured thread in rows, seen from above.",
      "k.fili": "The threads, one for every colour",
      "a.gesso": "Hands marking a grey Prince of Wales check with chalk and a ruler.",
      "k.gesso": "The chalk mark",
      "a.etichetta": "The green MONK SUIT label inside a jacket and the four hand-sewn buttonholes on the sleeve.",
      "k.etichetta": "Hand-sewn buttonholes, on the sleeve",
      "c.p2": "«Because when it comes to bespoke tailoring, even what you don’t see tells a story.»",
      "s.etichetta": "What we do",
      "s.titolo": "For us the work doesn’t end with a simple alteration",
      "s.sotto": "No prices: for a quote or some advice, call us or write to us on WhatsApp.",
      "s.n1": "Repairs and alterations",
      "s.a1": "Shortening sleeves, hems and trousers",
      "s.a2": "Taking in and adjusting: waist, hips, shoulders",
      "s.a3": "Zips, buttons and mending",
      "s.a4": "All fabrics, leather too; garments by other brands too",
      "s.q1": "«Because a repair doesn’t simply mean \"fixing\": it means taking care of a garment and bringing it back to life.»",
      "s.n2": "Bespoke suits",
      "s.b1": "The consultation and the measurements",
      "s.b2": "The fabric, from a wide range of swatches",
      "s.b3": "The fittings along the way",
      "s.b4": "For ceremonies, for the groom, for every day",
      "s.q2": "«Your suit, chosen by you and made entirely by hand by us»",
      "s.n3": "Hand-sewn buttonholes",
      "s.c1": "Sewn by hand, stitch by stitch, on bespoke jackets",
      "s.c2": "And the buttonhole machine, to redo them after shortening sleeves",
      "s.q3": "«A rarity that adds a touch of elegance and craftsmanship to your garments»",
      "s.n4": "At your home",
      "s.d1": "The consultation in our workshop or at your home",
      "s.d2": "Home delivery: Monday to Friday 9 am–5 pm, Saturday 10 am–4 pm",
      "s.q4": "«We do our best to finish your suit within the agreed time… or even earlier!»",
      "f.etichetta": "How it works",
      "f.titolo": "The perfect garment is the one that really fits well.",
      "f.n1": "You book an appointment",
      "f.t1": "By phone or on WhatsApp, in our workshop or at your home.",
      "f.n2": "We take the measurements",
      "f.t2": "And we look at the garment together: what to change, how, with which fabric.",
      "f.n3": "We make the alterations",
      "f.t3": "The alterations needed, or the bespoke garment from start to finish.",
      "f.n4": "The garment is tried on",
      "f.t4": "To check the fit and the final result, before it goes back to whoever will wear it.",
      "f.nota": "The four steps as we tell them on Instagram.",
      "l.etichetta": "The workshop",
      "l.titolo": "Expert hands, a short walk from the Duomo",
      "a.banco": "The table: two tailors at work, the tape measure, a blue fabric marked with chalk.",
      "k.banco": "The table",
      "a.manichino": "Hands measuring a black dress form with the yellow tape measure.",
      "k.manichino": "The measurements",
      "a.mani": "Hands sewing a pink fabric under the presser foot of the machine.",
      "k.mani": "At the machine",
      "a.forbici": "Scissors in the lining of a jacket.",
      "k.forbici": "Scissors in the lining",
      "a.asolatrice": "The mint-green buttonhole machine in front of the wall of blue spools.",
      "k.asolatrice": "The buttonhole machine and the spools",
      "a.manichini": "Three dress forms: one in red check, one black, one in raw canvas.",
      "k.manichini": "The dress forms",
      "a.bavero": "A Prince of Wales jacket with an embroidered lapel, on the dress form.",
      "k.bavero": "An embroidered lapel",
      "a.drappeggio": "A draped blue dress on the dress form; behind, the wall of threads.",
      "k.drappeggio": "A draped dress",
      "a.sposo": "A groom’s brown double-breasted suit, with a white pocket square.",
      "k.sposo": "The groom’s double-breasted suit",
      "a.metro": "The tailor’s tape measure rolled up on the table, in black and white.",
      "k.metro": "The tape measure",
      "d.etichetta": "Reviews",
      "d.titolo": "Made to measure, they say",
      "d.google": "on Google, 69 reviews",
      "d.g3m": "Google, 3 months ago",
      "d.g3s": "Google, 3 weeks ago",
      "d.g5m": "Google, 5 months ago",
      "d.g7m": "Google, 7 months ago",
      "d.g4m": "Google, 4 months ago",
      "d.g1m": "Google, 1 month ago",
      "d.nota": "From the reviews on Google, in Italian, as they were written; […] where we cut. The line at the top comes from another customer, also on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Monday to Friday 10 am–7 pm, Saturday 10 am–5 pm",
      "o.testa": "By appointment",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.chiuso": "closed",
      "o.domicilio": "Home delivery: Monday to Friday 9 am–5 pm, Saturday 10 am–4 pm.",
      "o.nota": "Hours from our Google listing (September 2026). For an appointment, call us or write to us on WhatsApp.",
      "w.mappa": "Map: Monks Suit, Corso Vittorio Emanuele II 22, Milan",
      "a.targa": "The black plaque with MONKSUIT in gold, next to the door.",
      "k.targa": "Our plaque",
      "a.porta": "The grey door with the frosted glass and the mosaic floor.",
      "k.porta": "The door",
      "w.dove": "Where",
      "w.dovev": "Corso Vittorio Emanuele II 22, 20122 Milan: enter through the main door of number 22",
      "w.metro": "By metro",
      "w.metrov": "M1 and M4 San Babila, about 200 metres away; M1 and M3 Duomo, about 460",
      "w.bus": "By bus",
      "w.busv": "61 and 84, San Babila stop",
      "w.tel": "Phone",
      "w.mail": "Email",
      "f2.riga": "Bespoke tailoring · repairs and alterations · hand-sewn buttonholes",
      "f2.orario": "Monday to Friday 10 am–7 pm · Saturday 10 am–5 pm · by appointment",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from their Google listing (September 2026); their words from Instagram and their website; the photos from Instagram, their website and their Google listing. We drew the buttonhole ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ MONKS SUIT — Corso Vittorio Emanuele II 22 ══════════
     la FIRMA — «l'asola fatta a mano»: il davanti di una giacca sul banco (sopra un'asola già fatta, sotto una solo segnata); al
     centro il segno col gesso, l'occhiello e il taglio, poi l'ago cuce il punto asola uno per uno fino al travetto (un filo solo,
     pathLength 1); l'ago se ne va, il gesso si spazzola via, il cordonetto prende la luce. Lo stato è M (blu gessato, grisaglia,
     camicia), T (0…1) e V (0 al suo posto; fino a 1 il tessuto esce a destra; da −1 a 0 entra da sinistra il prossimo, senza l'asola
     nuova). Senza JS e alla fine: blu gessato, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): il tessuto senza l'asola nuova.
     Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,560],"via":640,"fasi":{"gesso":{"t":0.03,"d":0.11},"occhio":{"t":0.14,"d":0.05},"taglio":{"t":0.19,"d":0.07},"entra":{"t":0.22,"d":0.08},"punti":{"t":0.3,"d":0.5},"esce":{"t":0.8,"d":0.09},"spazzola":{"t":0.82,"d":0.08},"lucido":{"t":0.9,"d":0.1}},"ago":{"x":700,"y":150},"modi":[{"nome":"Blu gessato","occhio":true,"giro":[[109,270],[124.2,270],[139.4,270],[154.6,270],[169.8,270],[185,270],[200.2,270],[215.4,270],[230.6,270],[245.8,270],[261,270],[276.2,270],[291.4,270],[306.6,270],[321.8,270],[337,270],[352.2,270],[367.4,270],[382.6,270],[397.8,270],[413,270],[416.9,265],[437.5,267.8],[449.5,284.7],[445.2,305],[427.5,315.8],[407.5,310.1],[406.6,310],[391.4,310],[376.2,310],[361,310],[345.8,310],[330.6,310],[315.4,310],[300.2,310],[285,310],[269.8,310],[254.6,310],[239.4,310],[224.2,310],[209,310],[193.8,310],[178.6,310],[163.4,310],[148.2,310],[133,310],[117.8,310],[113,274.2],[113,287],[113,299.8],[113,306.2]]},{"nome":"Grisaglia","occhio":true,"giro":[[109,270],[124.2,270],[139.4,270],[154.6,270],[169.8,270],[185,270],[200.2,270],[215.4,270],[230.6,270],[245.8,270],[261,270],[276.2,270],[291.4,270],[306.6,270],[321.8,270],[337,270],[352.2,270],[367.4,270],[382.6,270],[397.8,270],[413,270],[416.9,265],[437.5,267.8],[449.5,284.7],[445.2,305],[427.5,315.8],[407.5,310.1],[406.6,310],[391.4,310],[376.2,310],[361,310],[345.8,310],[330.6,310],[315.4,310],[300.2,310],[285,310],[269.8,310],[254.6,310],[239.4,310],[224.2,310],[209,310],[193.8,310],[178.6,310],[163.4,310],[148.2,310],[133,310],[117.8,310],[113,274.2],[113,287],[113,299.8],[113,306.2]]},{"nome":"Camicia","occhio":false,"giro":[[135,272.5],[150.2,272.5],[165.4,272.5],[180.6,272.5],[195.8,272.5],[211,272.5],[226.2,272.5],[241.4,272.5],[256.6,272.5],[271.8,272.5],[287,272.5],[302.2,272.5],[317.4,272.5],[332.6,272.5],[347.8,272.5],[363,272.5],[378.2,272.5],[393.4,272.5],[418,273.5],[418,286.3],[418,299.1],[401.2,307.5],[386,307.5],[370.8,307.5],[355.6,307.5],[340.4,307.5],[325.2,307.5],[310,307.5],[294.8,307.5],[279.6,307.5],[264.4,307.5],[249.2,307.5],[234,307.5],[218.8,307.5],[203.6,307.5],[188.4,307.5],[173.2,307.5],[158,307.5],[142.8,307.5],[138,303.3],[138,290.5],[138,277.7],[138,274.5]]}],"tempi":{"inizio":300,"asola":7000,"servi":480,"arriva":520,"asolaV":6200}};
  /* l'asola a (M, T, V) — una sola fonte: la usano _mks_firma.mjs (l'HTML allo stato finale), main.js (via mks_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Sul davanti di una giacca (o di una camicia), vicino al bordo: il segno col gesso, l'occhiello e il taglio, poi arriva l'ago e
     cuce il punto asola uno per uno tutto intorno, fino al travetto; l'ago se ne va, il gesso si spazzola via, il cordonetto prende la
     luce. Il tessuto e il filo li dà il modo (CSS); la forma dell'asola anche (a goccia o dritta). Col V il tessuto esce a destra; il
     prossimo, senza asola, entra da sinistra. */
  function creaAsola(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q1 = function (c) { return svg.querySelector('.' + c); };
    var servito = q1('servito'), ago = q1('ago');
    var P = D.modi.map(function (M, m) {
      var q = function (c) { return svg.querySelector('.' + c + '[data-m="' + m + '"]'); };
      return { gesso: q('gesso'), taglio: q('taglio'), occhio: M.occhio ? q('occhio') : null, punti: q('punti'), lucido: q('lucido') };
    });
    /* un tratto disegnato da 0 a «quanto» (pathLength = 1) */
    var tratto = function (el, quanto) { el.setAttribute('stroke-dasharray', r3(quanto) + ' 2'); el.setAttribute('stroke-dashoffset', '0'); };
    function disegna(m, t, v) {
      var F = D.fasi, q = P[m], M = D.modi[m], A = D.ago;
      /* il gesso: si traccia, a lavoro finito si spazzola via */
      tratto(q.gesso, dolce(fase(t, F.gesso)));
      q.gesso.setAttribute('opacity', String(r3(1 - dolce(fase(t, F.spazzola)))));
      /* l'occhiello (se l'asola è a goccia) e il taglio */
      if (q.occhio) tratto(q.occhio, dolce(fase(t, F.occhio)));
      tratto(q.taglio, dolce(fase(t, F.taglio)));
      /* i punti: uno per uno, a velocità costante; l'ago li segue */
      var u = fase(t, F.punti);
      tratto(q.punti, u);
      var G = M.giro, n = G.length - 1, x, y;
      var a = dolce(fase(t, F.entra)), b = dolce(fase(t, F.esce));
      if (b > 0) { x = G[n][0] + (A.x - G[n][0]) * b; y = G[n][1] + (A.y - G[n][1]) * b; }
      else if (u > 0) { var k = u * n, i = Math.min(n - 1, Math.floor(k)), f = k - i; x = G[i][0] + (G[i + 1][0] - G[i][0]) * f; y = G[i][1] + (G[i + 1][1] - G[i][1]) * f; }
      else { x = A.x + (G[0][0] - A.x) * a; y = A.y + (G[0][1] - A.y) * a; }
      ago.setAttribute('transform', 'translate(' + r1(x) + ' ' + r1(y) + ')');
      /* alla fine il cordonetto prende la luce */
      q.lucido.setAttribute('opacity', String(r3(dolce(fase(t, F.lucido)))));
      /* col V il tessuto esce a destra; il prossimo entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!(servito && ago) && P.every(function (q, m) {
      return q.gesso && q.taglio && q.punti && q.lucido && (!D.modi[m].occhio || q.occhio);
    });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('asola-firma'), svgF = prendi('asolaSvg'), leggiF = prendi('asolaLeggi');
  var ASOLA = svgF ? creaAsola(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.campione__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.campione__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    ASOLA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) ASOLA.disegna(k, 1, 0); });
    ASOLA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta il tessuto senza l'asola nuova */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il tessuto senza l'asola nuova */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.asola, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.asola });
  }
  /* il gesto: scegliere l'asola. Se è quella che si sta già cucendo, niente; altrimenti tutto si ferma dov'è, il
     tessuto esce a destra, entra da sinistra il prossimo senza l'asola nuova, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.asolaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && ASOLA && ASOLA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaAsola); } catch (e) {}
    window.__asola = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__asola.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta il tessuto senza l'asola nuova */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__asola.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
