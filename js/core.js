/* Core: state store, level math, router, small UI helpers. Vanilla JS, no framework. */
window.FixUP = window.FixUP || {};

// Repair-request items use lowercase job category keys (phone, fridge, ...); shared by
// consumer and technician job screens for a consistent item photo per category.
FixUP.JOB_CATEGORY_PHOTO = {
  phone: "electronics", laptop: "electronics", tv: "electronics",
  fridge: "appliances", washer: "appliances",
  garment: "garment", vehicle: "vehicle"
};

/* ---------------- Levels ---------------- */
FixUP.LEVELS = [
  { name: "Repair Rookie", min: 0 },
  { name: "Getting Started", min: 300 },
  { name: "Repair Regular", min: 800 },
  { name: "Fix Pro", min: 1600 },
  { name: "Fix Master", min: 3000 },
  { name: "Circular Champion", min: 5000 }
];
FixUP.computeLevel = function (points) {
  const L = FixUP.LEVELS;
  let idx = 0;
  for (let i = 0; i < L.length; i++) if (points >= L[i].min) idx = i;
  const cur = L[idx], next = L[idx + 1];
  const pointsIntoLevel = points - cur.min;
  const pointsForLevel = next ? next.min - cur.min : pointsIntoLevel || 1;
  return {
    levelIndex: idx,
    levelName: cur.name,
    nextLevelName: next ? next.name : "Max level",
    pointsIntoLevel,
    pointsForLevel,
    pct: next ? Math.min(100, Math.round((pointsIntoLevel / pointsForLevel) * 100)) : 100,
    isMax: !next
  };
};

/* ---------------- Store ---------------- */
FixUP.Store = (function () {
  const KEY = "fixup_state_v2";
  let state = null;
  const subs = {};

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return FixUP.seed();
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function get() { return state; }
  function set(mutator) {
    mutator(state);
    persist();
    emit("*");
  }
  function subscribe(key, cb) {
    (subs[key] = subs[key] || []).push(cb);
    return () => { subs[key] = subs[key].filter(f => f !== cb); };
  }
  function emit(key) {
    (subs[key] || []).forEach(cb => cb(state));
    if (key !== "*") (subs["*"] || []).forEach(cb => cb(state));
  }
  function init() { state = load(); }
  function reset() { state = FixUP.seed(); persist(); emit("*"); }

  return { init, get, set, subscribe, reset };
})();

/* ---------------- Formatting helpers ---------------- */
FixUP.fmt = {
  money: (n) => "Rs. " + Number(n || 0).toLocaleString("en-LK"),
  num: (n) => Number(n || 0).toLocaleString("en-LK"),
  timeAgo(ts) {
    const diff = Date.now() - ts;
    const h = diff / 3600000;
    if (h < 1) return Math.max(1, Math.round(h * 60)) + "m ago";
    if (h < 24) return Math.round(h) + "h ago";
    return Math.round(h / 24) + "d ago";
  }
};

/* ---------------- Router ---------------- */
FixUP.Router = (function () {
  let viewport, current = null, stack = [];
  const registry = {};

  function register(name, renderFn) { registry[name] = renderFn; }

  function init(viewportEl) { viewport = viewportEl; }

  function go(name, params = {}, dir = "fwd") {
    if (!registry[name]) { console.warn("No screen:", name); return; }
    const el = document.createElement("div");
    el.className = "screen " + (dir === "fwd" ? "screen--entering-fwd" : "screen--entering-back");
    el.dataset.screen = name;
    viewport.querySelectorAll(".screen").forEach(s => s.remove());
    viewport.appendChild(el);
    registry[name](el, params);
    current = { name, params };
    if (dir === "fwd") stack.push({ name, params });
    window.scrollTo(0, 0);
    el.scrollTop = 0;
    FixUP.Layout.applyChrome(name);
  }

  function back() {
    if (stack.length > 1) {
      stack.pop();
      const prev = stack[stack.length - 1];
      go(prev.name, prev.params, "back");
    }
  }

  function replaceStack(name, params = {}) {
    stack = [{ name, params }];
    go(name, params, "fwd");
  }

  return { register, init, go, back, replaceStack, current: () => current };
})();

/* ---------------- UI helpers ---------------- */
FixUP.UI = (function () {
  function icon(name, cls) {
    const s = FixUP.icons[name] || "";
    return cls ? s.replace("<svg ", `<svg class="${cls}" `) : s;
  }

  function toast(msg, iconName) {
    const host = document.getElementById("toastHost");
    if (!host) return;
    host.innerHTML = `${iconName ? `<span style="width:15px;height:15px;display:block;flex-shrink:0">${icon(iconName)}</span>` : ""}<span>${msg}</span>`;
    host.classList.add("is-visible");
    clearTimeout(host._t);
    host._t = setTimeout(() => host.classList.remove("is-visible"), 2200);
  }

  function openSheet(id) { document.getElementById(id)?.classList.add("is-open"); }
  function closeSheet(id) { document.getElementById(id)?.classList.remove("is-open"); }

  function updateNavActive(screenName) {
    document.querySelectorAll(".nav-item").forEach(n => {
      n.classList.toggle("is-active", n.dataset.screen === screenName);
    });
  }

  function animateCount(el, from, to, duration, opts = {}) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = opts.format ? opts.format(to) : to; return; }
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const val = from + (to - from) * ease(t);
      el.textContent = opts.format ? opts.format(val) : Math.round(val);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = opts.format ? opts.format(to) : to;
    }
    requestAnimationFrame(frame);
  }

  const CATEGORY_VISUAL = {
    Electronics: "assets/photos/electronics.jpg",
    Appliances: "assets/photos/appliances.jpg",
    Vehicles: "assets/photos/vehicle.jpg",
    Garments: "assets/photos/garment.jpg"
  };
  function categoryTile(category, size) {
    const src = CATEGORY_VISUAL[category] || "assets/photos/other.jpg";
    const s = size || 48;
    const r = Math.round(s * 0.3);
    return `<img src="${src}" alt="${category || 'Item'}" style="width:${s}px;height:${s}px;border-radius:${r}px;flex-shrink:0;object-fit:cover;">`;
  }

  // Repair-request items use lowercase job category keys (phone, fridge, ...) rather than
  // the Title-case marketplace categories categoryTile() uses — same photo set, different map.
  function jobPhotoSrc(category) { return `assets/photos/${FixUP.JOB_CATEGORY_PHOTO[category] || "other"}.jpg`; }
  function jobImage(category, size, radius) {
    const s = size || 48;
    const r = radius != null ? radius : Math.round(s * 0.3);
    return `<img src="${jobPhotoSrc(category)}" alt="" style="width:${s}px;height:${s}px;border-radius:${r}px;flex-shrink:0;object-fit:cover;display:block">`;
  }

  function notifBadge(count) {
    return count > 0 ? `<span class="notif-dot">${count > 9 ? "9+" : count}</span>` : "";
  }

  // Static illustrated map card — stands in for a live map in this offline prototype.
  function mapPreview(label, opts = {}) {
    const h = opts.height || 150;
    const pins = opts.pins || [{ x: 200, y: 96, me: true }];
    const pinSvg = (p) => p.me
      ? `<g class="map-pin-pulse" style="transform-origin:${p.x}px ${p.y}px">
           <circle cx="${p.x}" cy="${p.y}" r="16" fill="var(--deep-blue)" opacity="0.16"/>
         </g>
         <ellipse cx="${p.x}" cy="${p.y + 13}" rx="6" ry="2" fill="#1C2430" opacity="0.12"/>
         <path d="M${p.x} ${p.y - 12}c-6 0-10 4.3-10 10 0 7 10 16 10 16s10-9 10-16c0-5.7-4-10-10-10Z" fill="var(--deep-blue)"/>
         <circle cx="${p.x}" cy="${p.y - 2}" r="3.5" fill="#fff"/>`
      : `<ellipse cx="${p.x}" cy="${p.y + 9}" rx="4" ry="1.5" fill="#1C2430" opacity="0.1"/>
         <path d="M${p.x} ${p.y - 8}c-4.2 0-7 3-7 7 0 4.8 7 11 7 11s7-6.2 7-11c0-4-2.8-7-7-7Z" fill="var(--mid-blue)"/>
         <circle cx="${p.x}" cy="${p.y - 1}" r="2.3" fill="#fff"/>`;
    return `<div style="position:relative;width:100%;height:${h}px;border-radius:16px;overflow:hidden;background:#DCEAE8;border:1px solid var(--border-crisp)">
      <svg viewBox="0 0 400 ${h}" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="400" height="${h}" fill="#DCEAE8"/>
        <rect x="0" y="${h * 0.14}" width="400" height="${h * 0.1}" fill="#CFE1DE"/>
        <rect x="0" y="${h * 0.62}" width="400" height="${h * 0.08}" fill="#CFE1DE"/>
        <rect x="60" y="0" width="${h * 0.09}" height="${h}" fill="#CFE1DE"/>
        <rect x="290" y="0" width="${h * 0.09}" height="${h}" fill="#CFE1DE"/>
        <rect x="90" y="${h * 0.28}" width="70" height="${h * 0.26}" rx="4" fill="#BEE8CE" opacity="0.7"/>
        <rect x="230" y="${h * 0.34}" width="90" height="${h * 0.34}" rx="4" fill="#BEE8CE" opacity="0.7"/>
        <rect x="20" y="${h * 0.72}" width="50" height="${h * 0.2}" rx="4" fill="#BEE8CE" opacity="0.5"/>
        <circle cx="${pins[0].x}" cy="${pins[0].y}" r="70" fill="none" stroke="var(--mid-blue)" stroke-width="1.5" stroke-dasharray="4 5" opacity="0.55"/>
        ${pins.map(pinSvg).join("")}
      </svg>
      ${label ? `<div style="position:absolute;left:10px;bottom:10px;right:10px;background:rgba(255,255,255,0.94);backdrop-filter:blur(2px);border-radius:10px;padding:8px 10px;display:flex;align-items:center;gap:6px;">
        <span style="width:14px;height:14px;color:var(--deep-blue);flex-shrink:0;display:block">${icon('mapPin')}</span>
        <span class="text-small" style="font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${label}</span>
      </div>` : ""}
    </div>`;
  }

  function stars(n, size = 14) {
    let out = "";
    for (let i = 1; i <= 5; i++) {
      out += `<span style="color:${i <= Math.round(n) ? 'var(--warning)' : 'var(--border-strong)'};width:${size}px;height:${size}px;display:inline-flex">${icon('starFill')}</span>`;
    }
    return out;
  }

  return { icon, toast, openSheet, closeSheet, updateNavActive, animateCount, stars, notifBadge, categoryTile, jobImage, jobPhotoSrc, mapPreview };
})();

/* ---------------- Level-up celebration ---------------- */
FixUP.Celebrate = (function () {
  function confettiBurst(host) {
    const colors = ["var(--mid-blue)", "var(--sky)", "var(--mint)", "var(--royal)", "var(--sage)"];
    host.innerHTML = "";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("span");
      p.className = "confetti-piece";
      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 110;
      p.style.setProperty("--tx", `calc(-50% + ${Math.cos(angle) * dist}px)`);
      p.style.setProperty("--ty", `calc(-50% + ${Math.sin(angle) * dist}px)`);
      p.style.setProperty("--rot", Math.round(Math.random() * 400 - 200) + "deg");
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 120) + "ms";
      host.appendChild(p);
    }
  }

  function levelUp(overlayEl, levelName) {
    overlayEl.querySelector(".levelup-name").textContent = levelName;
    confettiBurst(overlayEl.querySelector(".confetti-host"));
    overlayEl.classList.add("is-open");
  }

  function dismiss(overlayEl) { overlayEl.classList.remove("is-open"); }

  return { levelUp, dismiss };
})();

/* ---------------- Layout: topbar + role-aware bottom nav + FAB ---------------- */
FixUP.Layout = (function () {
  const NAV = {
    consumer: [
      { screen: "home", icon: "home", label: "Home" },
      { screen: "discover", icon: "compass", label: "Discover" },
      { screen: "impact", icon: "leaf", label: "Impact" },
      { screen: "profile", icon: "user", label: "Profile" }
    ],
    technician: [
      { screen: "techJobs", icon: "briefcase", label: "Jobs" },
      { screen: "partsMarket", icon: "box", label: "Parts" },
      { screen: "earnings", icon: "wallet", label: "Earnings" },
      { screen: "impact", icon: "leaf", label: "Impact" },
      { screen: "profile", icon: "user", label: "Profile" }
    ],
    seller: [
      { screen: "listings", icon: "box", label: "Listings" },
      { screen: "orders", icon: "briefcase", label: "Orders" },
      { screen: "insights", icon: "chart", label: "Insights" },
      { screen: "profile", icon: "user", label: "Profile" }
    ]
  };
  const NO_CHROME = new Set(["splash", "onboarding", "roleSelect", "auth", "verification"]);
  const FAB_MAP = {
    home: { icon: "plus", to: "postRepair" },
    discover: { icon: "plus", to: "postRepair" },
    listings: { icon: "plus", to: "postListing" }
  };
  // maps sub-screens to the tab they should highlight
  const TAB_ALIAS = {
    techJobDetail: "techJobs", jobTracking: "home", instantMatch: "home", quoteReview: "home",
    ratingReview: "home", techProfile: "discover", partDetail: "partsMarket", postListing: "listings",
    orderDetail: "orders", postRepair: "home"
  };

  function topbar(title, { back, actions = [] } = {}) {
    const backBtn = back
      ? `<button class="btn-icon" data-nav-back>${FixUP.UI.icon("chevronLeft")}</button>`
      : `<span style="width:40px"></span>`;
    const actionsHtml = actions.map(a => `
      <button class="btn-icon" data-action="${a.action}">${FixUP.UI.icon(a.icon)}
        ${a.badge ? `<span class="notif-dot">${a.badge}</span>` : ""}
      </button>`).join("");
    return `<div class="topbar">${backBtn}<div class="topbar__title">${title}</div>${actionsHtml || `<span style="width:40px"></span>`}</div>`;
  }

  function renderNav(role) {
    const host = document.getElementById("bottomNav");
    const items = NAV[role] || [];
    host.innerHTML = items.map(it => `
      <button class="nav-item" data-screen="${it.screen}" data-nav-to="${it.screen}">
        ${FixUP.UI.icon(it.icon)}<span>${it.label}</span>
      </button>`).join("");
  }

  function applyChrome(screenName) {
    const s = FixUP.Store.get();
    const bottomNav = document.getElementById("bottomNav");
    const fab = document.getElementById("fab");
    if (NO_CHROME.has(screenName) || !s.onboarded) {
      bottomNav.hidden = true; fab.hidden = true; return;
    }
    bottomNav.hidden = false;
    renderNav(s.role);
    const activeTab = TAB_ALIAS[screenName] || screenName;
    FixUP.UI.updateNavActive(activeTab);

    const fabCfg = FAB_MAP[screenName];
    if (fabCfg && (s.role === "consumer" || screenName === "listings")) {
      fab.hidden = false;
      fab.innerHTML = FixUP.UI.icon(fabCfg.icon);
      fab.onclick = () => FixUP.Router.go(fabCfg.to, {}, "fwd");
    } else {
      fab.hidden = true;
    }
  }

  return { topbar, renderNav, applyChrome, NAV };
})();
