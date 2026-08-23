/* Consumer screens: home, discover, technician profile, post-repair flow, match, quote, tracking, rating. */
(function () {
  const R = FixUP.Router, UI = FixUP.UI, L = FixUP.Layout, A = FixUP.Actions, icon = UI.icon, empty = FixUP._emptyState, techRow = FixUP._techRow;
  let draft = {};

  /* ---------- Home ---------- */
  R.register("home", (el) => {
    const s = FixUP.Store.get();
    const u = s.users.consumer;
    const lvl = FixUP.computeLevel(u.impact.points);
    const active = s.jobs.filter(j => j.consumerId === u.id && !["completed", "cancelled"].includes(j.status));
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="u-flex u-justify-between u-items-center" style="margin-bottom:var(--sp-4)">
          <div class="u-flex u-items-center u-gap-2">
            <img src="assets/logo-mark.png" alt="" style="width:22px;height:auto;flex-shrink:0">
            <div><div class="text-small text-muted">Good to see you,</div><div class="text-h1">${u.name.split(" ")[0]}</div></div>
          </div>
          <div class="u-flex u-gap-2">
            <button class="btn-icon" data-go="messages">${icon('message')}</button>
            <button class="btn-icon" data-go="notifications">${icon('bell')}${UI.notifBadge(s.notifications.filter(n => !n.read).length)}</button>
          </div>
        </div>

        <button class="card card--pressable" style="width:100%;box-sizing:border-box;max-width:100%;text-align:left;display:flex;align-items:center;gap:var(--sp-3);background:${cssGradient()};border:none;color:#fff;" data-go="impact">
          <div class="ambient-drift" style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="width:24px;height:24px;display:block">${icon('leaf')}</span></div>
          <div style="flex:1;min-width:0">
            <div class="text-small" style="opacity:0.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${lvl.levelName} · ${u.impact.points.toLocaleString()} pts</div>
            <div class="progress-bar" style="background:rgba(255,255,255,0.25);margin-top:6px"><div class="progress-bar__fill" style="width:${lvl.pct}%;background:#fff"></div></div>
          </div>
          <span style="opacity:0.85;flex-shrink:0;width:18px;height:18px;display:block">${icon('chevronRight')}</span>
        </button>

        <button class="btn btn-primary btn-block" style="margin-top:var(--sp-4)" data-go="postRepair"><span style="width:18px;height:18px;display:block">${icon('plus')}</span> Post a repair request</button>

        ${active.length ? `
          <div class="text-h2" style="margin:var(--sp-6) 0 var(--sp-2)">Active repairs</div>
          <div class="u-flex-col u-gap-2">${active.map(jobCard).join("")}</div>
        ` : ""}

        <div class="text-h2" style="margin:var(--sp-6) 0 var(--sp-2)">Recommended for you</div>
        <div style="display:flex;gap:var(--sp-3);overflow-x:auto;padding-bottom:6px;">
          ${s.technicians.slice(0, 4).map(t => `
            <button class="card card--pressable" style="flex-shrink:0;width:150px;text-align:left" data-open-tech="${t.id}">
              <span class="avatar avatar-md avatar--verified">${t.initials}</span>
              <div class="text-small" style="font-weight:700;margin-top:8px">${t.name}</div>
              <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;margin-top:2px">${t.categories[0]} · ${t.distanceKm}km</div>
              <div style="margin-top:4px">${UI.stars(t.rating, 11)}</div>
            </button>`).join("")}
        </div>

        <div class="text-h2" style="margin:var(--sp-6) 0 var(--sp-2)">Sustainability Spotlight</div>
        <div class="card card--tint" style="display:flex;gap:var(--sp-3);align-items:center;">
          <span style="width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;color:var(--deep-blue);flex-shrink:0;">${icon('recycle')}</span>
          <div><div class="text-small" style="font-weight:700">Choosing repair over replacement</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">saves ~${u.impact.co2Kg > 0 ? Math.round(u.impact.co2Kg / Math.max(1, s.jobs.filter(j=>j.consumerId===u.id&&j.status==='completed').length)) : 200}kg CO₂ per fixed device on average.</div></div>
        </div>
      </div>`;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => R.go(b.dataset.go));
    el.querySelectorAll("[data-open-tech]").forEach(b => b.onclick = () => R.go("techProfile", { id: b.dataset.openTech }));
    el.querySelectorAll("[data-open-job]").forEach(b => b.onclick = () => R.go("jobTracking", { id: b.dataset.openJob }));
  });

  function cssGradient() { return getComputedStyle(document.documentElement).getPropertyValue('--gradient-brand'); }

  function jobCard(j) {
    const s = FixUP.Store.get();
    const t = s.technicians.find(t => t.id === j.technicianId);
    const statusClass = { matching: "progress", confirmed: "open", "in-progress": "progress", completed: "done", requested: "open" }[j.status] || "open";
    return `<button class="card card--pressable u-flex u-items-center u-gap-3" style="width:100%;text-align:left" data-open-job="${j.id}">
      ${UI.jobImage(j.category, 44, 12)}
      <span style="flex:1;min-width:0"><div class="text-small" style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${j.title}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${t ? t.name : "Matching..."}</div></span>
      <span class="status-badge status-badge--${statusClass}" style="flex-shrink:0">${j.status.replace("-", " ")}</span>
    </button>`;
  }

  /* ---------- Discover ---------- */
  R.register("discover", (el) => {
    const s = FixUP.Store.get();
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="text-h1" style="margin-bottom:var(--sp-4)">Discover</div>
        <div class="search-bar" style="margin-bottom:var(--sp-4)">${icon('search')}<input placeholder="Search technicians, categories, parts" data-search><button class="btn-icon" style="width:32px;height:32px" data-filter>${icon('filter')}</button></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp-2);margin-bottom:var(--sp-6)">
          ${s.categories.slice(0, 6).map(c => `
            <button class="card card--pressable" style="text-align:center;padding:14px 8px" data-cat="${c.key}">
              <div style="width:26px;height:26px;color:var(--deep-blue);display:flex;align-items:center;justify-content:center;margin:0 auto 8px;">${icon(catIcon(c.key))}</div>
              <div class="text-micro" style="text-transform:none;letter-spacing:0;font-weight:600">${c.label}</div>
            </button>`).join("")}
        </div>
        <div class="text-h2" style="margin-bottom:var(--sp-3)">Featured technicians</div>
        <div class="u-flex-col u-gap-3">${s.technicians.map(t => techRow(t)).join("")}</div>
      </div>`;
    el.querySelectorAll("[data-open-tech]").forEach(b => b.onclick = () => R.go("techProfile", { id: b.dataset.openTech }));
    el.querySelector("[data-filter]").onclick = () => UI.openSheet("filterSheet");
    el.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => UI.toast("Filtered by " + b.dataset.cat, "filter"));
  });
  function catIcon(key) {
    return { phone: "wrench", laptop: "wrench", tv: "wrench", fridge: "box", washer: "box", garment: "leaf", vehicle: "wrench", other: "box" }[key] || "wrench";
  }

  /* ---------- Technician profile ---------- */
  R.register("techProfile", (el, params) => {
    const s = FixUP.Store.get();
    const t = s.technicians.find(t => t.id === params.id) || s.technicians[0];
    const saved = s.users.consumer.savedTechnicianIds.includes(t.id);
    el.innerHTML = `
      ${L.topbar("Technician", { back: true, actions: [{ action: "save", icon: saved ? "bookmarkFill" : "bookmark" }] })}
      <div style="padding:0 var(--sp-4)">
        <div style="text-align:center;padding:var(--sp-2) 0 var(--sp-6)">
          <span class="avatar avatar-lg avatar--verified" style="margin:0 auto">${t.initials}</span>
          <div class="text-h1" style="margin-top:10px">${t.name}</div>
          <div class="u-flex u-gap-2" style="justify-content:center;flex-wrap:wrap;max-width:100%;margin-top:6px">
            <span class="badge-verified" style="max-width:100%">${icon('shield')} Verified</span>
            <span class="level-badge" style="max-width:100%">${icon('leaf')} ${t.levelName}</span>
          </div>
          <div class="u-flex u-items-center u-gap-1" style="justify-content:center;margin-top:8px">${UI.stars(t.rating)}<span class="text-small text-muted" style="margin-left:6px">${t.rating} (${t.reviewCount} reviews)</span></div>
          <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;margin-top:4px"><span style="display:inline-flex;width:12px;height:12px;vertical-align:-2px">${icon('mapPin')}</span> ${t.location} · ${t.distanceKm}km away</div>
        </div>
        <div class="u-flex u-gap-2" style="margin-bottom:var(--sp-6)">${t.categories.map(c => `<span class="chip">${c}</span>`).join("")}</div>
        <div class="text-h2" style="margin-bottom:var(--sp-2)">Portfolio</div>
        <div class="u-flex-col u-gap-2" style="margin-bottom:var(--sp-6)">
          <div class="card u-flex u-justify-between"><span class="text-small" style="font-weight:600">Fridge compressor swap</span><span class="chip chip--outline">Appliances</span></div>
          <div class="card u-flex u-justify-between"><span class="text-small" style="font-weight:600">Laptop motherboard reflow</span><span class="chip chip--outline">Electronics</span></div>
        </div>
        <div class="text-h2" style="margin-bottom:var(--sp-3)">Reviews</div>
        <div class="u-flex u-items-center u-gap-3" style="margin-bottom:var(--sp-4)">
          <span class="text-display" style="font-size:26px">${t.rating}</span>
          <div>${UI.stars(t.rating, 13)}<div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;margin-top:2px">${t.reviewCount} reviews</div></div>
        </div>
        <div style="margin-bottom:var(--sp-2)">
          <div class="u-flex u-items-center u-gap-3" style="margin-bottom:8px">
            <span class="avatar avatar-sm">AG</span>
            <span><div class="text-small" style="font-weight:700">Amaya G.</div>${UI.stars(5, 11)}</span>
          </div>
          <p class="text-small text-soft" style="line-height:20px;margin:0">Quick, fair price, explained everything before starting.</p>
        </div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);">
        <button class="btn btn-primary btn-block" data-request>Request a quote</button>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector('[data-action="save"]').onclick = () => { A.toggleSaved("savedTechnicianIds", t.id); R.go("techProfile", { id: t.id }); };
    el.querySelector("[data-request]").onclick = () => R.go("postRepair", { step: 1, techId: t.id });
  });

  /* ---------- Post repair request (multi-step) ---------- */
  const CATS = [
    { key: "phone", label: "Phone", img: "electronics" }, { key: "laptop", label: "Laptop", img: "electronics" },
    { key: "fridge", label: "Fridge", img: "appliances" }, { key: "washer", label: "Washing Machine", img: "appliances" },
    { key: "tv", label: "TV", img: "electronics" }, { key: "garment", label: "Garment", img: "garment" },
    { key: "vehicle", label: "Vehicle", img: "vehicle" }, { key: "other", label: "Other", img: "other" }
  ];
  R.register("postRepair", (el, params) => {
    const step = params.step || 1;
    if (step === 1) draft = { techId: params.techId };
    const stepsHtml = () => `<div class="progress-bar" style="margin-bottom:var(--sp-4)"><div class="progress-bar__fill" style="width:${step * 25}%"></div></div>`;

    if (step === 1) {
      el.innerHTML = `<div style="padding:var(--sp-4)">${L.topbar("Post a repair", { back: true })}${stepsHtml()}
        <div class="text-h2" style="margin-bottom:var(--sp-4)">What needs fixing?</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--sp-2)">
          ${CATS.map(c => `<button class="card card--pressable" data-cat="${c.key}" style="text-align:center;padding:12px 8px 14px">
            <img src="assets/photos/${c.img}.jpg" alt="" style="width:100%;aspect-ratio:2;border-radius:10px;object-fit:cover;margin-bottom:6px;display:block">
            <div class="text-small" style="font-weight:600">${c.label}</div></button>`).join("")}
        </div></div>`;
      el.querySelector("[data-nav-back]").onclick = () => R.back();
      el.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { draft.category = b.dataset.cat; R.go("postRepair", { step: 2 }); });
      return;
    }
    if (step === 2) {
      el.innerHTML = `<div style="padding:var(--sp-4)">${L.topbar("Add photos", { back: true })}${stepsHtml()}
        <div class="text-h2" style="margin-bottom:var(--sp-2)">Show us the issue</div>
        <div class="text-small text-muted" style="margin-bottom:var(--sp-4)">Photos help technicians quote accurately.</div>
        <div class="upload-grid" style="margin-bottom:var(--sp-6)">${[1,2,3,4].map(() => `<div class="upload-tile">${icon('camera')}</div>`).join("")}</div>
        <div class="field"><label>Describe the problem</label><textarea placeholder="e.g. Fridge stopped cooling, makes a humming noise..." data-desc></textarea></div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);"><button class="btn btn-primary btn-block" data-next>Continue</button></div>`;
      el.querySelector("[data-nav-back]").onclick = () => R.back();
      el.querySelector("[data-next]").onclick = () => { draft.description = el.querySelector("[data-desc]").value || "No description provided."; R.go("postRepair", { step: 3 }); };
      return;
    }
    if (step === 3) {
      const s = FixUP.Store.get();
      el.innerHTML = `<div style="padding:var(--sp-4)">${L.topbar("Location & time", { back: true })}${stepsHtml()}
        <div style="margin-bottom:var(--sp-4)">${UI.mapPreview(s.users.consumer.location, { height: 150 })}</div>
        <div class="field" style="margin-bottom:var(--sp-4)"><label>Location</label><input type="text" value="${s.users.consumer.location}" data-loc></div>
        <div class="field"><label>Preferred time</label><select data-time><option>As soon as possible</option><option>Today, afternoon</option><option>Tomorrow morning</option></select></div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);"><button class="btn btn-primary btn-block" data-next>Review request</button></div>`;
      el.querySelector("[data-nav-back]").onclick = () => R.back();
      el.querySelector("[data-next]").onclick = () => R.go("postRepair", { step: 4 });
      return;
    }
    // step 4: review & submit
    const catLabel = CATS.find(c => c.key === draft.category)?.label || "Item";
    el.innerHTML = `<div style="padding:var(--sp-4)">${L.topbar("Review & submit", { back: true })}${stepsHtml()}
      <div class="card" style="margin-bottom:var(--sp-4)">
        <div class="u-flex u-justify-between" style="margin-bottom:8px"><span class="text-small text-muted">Category</span><span class="text-small" style="font-weight:700">${catLabel}</span></div>
        <div class="u-flex u-justify-between" style="margin-bottom:8px"><span class="text-small text-muted">Location</span><span class="text-small" style="font-weight:700">${FixUP.Store.get().users.consumer.location}</span></div>
        <hr class="divider" style="margin:8px 0">
        <div class="text-small text-muted">${draft.description || ""}</div>
      </div>
      <div class="card card--tint u-flex u-gap-2" style="align-items:flex-start">
        <span style="color:var(--deep-blue);width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">${icon('leaf')}</span>
        <span class="text-small">Choosing repair here could avoid up to <b>${FixUP.impactFactors[draft.category]?.co2Kg || 60}kg CO₂</b> vs. buying new.</span>
      </div>
    </div>
    <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);"><button class="btn btn-primary btn-block" data-submit>Submit request</button></div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector("[data-submit]").onclick = (e) => {
      e.target.classList.add("btn-loading");
      setTimeout(() => {
        const job = A.createRepairRequest({ category: draft.category, title: `${catLabel} repair`, description: draft.description });
        R.replaceStack("instantMatch", { jobId: job.id });
      }, 700);
    };
  });

  /* ---------- Instant match ---------- */
  R.register("instantMatch", (el, params) => {
    const s = FixUP.Store.get();
    const job = s.jobs.find(j => j.id === params.jobId);
    const matches = s.technicians.filter(t => draft.category ? true : true).slice(0, 3);
    el.innerHTML = `
      ${L.topbar("Matched for you", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="text-body text-muted" style="margin-bottom:var(--sp-4)">3 nearby verified technicians, ranked by rating, distance, and price.</div>
        <div class="u-flex-col u-gap-3">
          ${matches.map((t, i) => `
            <button class="card card--pressable" data-pick="${t.id}" style="width:100%;text-align:left">
              <div class="u-flex u-items-center u-gap-3">
                <span class="avatar avatar-md avatar--verified">${t.initials}</span>
                <span style="flex:1">
                  <div class="text-body" style="font-weight:700">${t.name} ${i === 0 ? '<span class="chip" style="font-size:10px;padding:2px 8px;margin-left:4px">Best match</span>' : ''}</div>
                  <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${UI.stars(t.rating, 11)} ${t.rating} · ${t.distanceKm}km · from ${FixUP.fmt.money(t.priceFrom)}</div>
                </span>
              </div>
            </button>`).join("")}
        </div>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => R.go("quoteReview", { jobId: job.id, techId: b.dataset.pick }));
  });

  /* ---------- Quote review ---------- */
  R.register("quoteReview", (el, params) => {
    const s = FixUP.Store.get();
    const job = s.jobs.find(j => j.id === params.jobId);
    const t = s.technicians.find(t => t.id === params.techId);
    const factor = FixUP.impactFactors[job.category] || FixUP.impactFactors.other;
    const amount = Math.round((t.priceFrom + Math.random() * 3000) / 50) * 50;
    el.innerHTML = `
      ${L.topbar("Review quote", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="card u-flex u-items-center u-gap-3" style="margin-bottom:var(--sp-4)">
          <span class="avatar avatar-md avatar--verified">${t.initials}</span>
          <span><div class="text-body" style="font-weight:700">${t.name}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${UI.stars(t.rating,11)} ${t.rating}</div></span>
        </div>
        <div class="card" style="margin-bottom:var(--sp-4)">
          <div class="text-h2" style="margin-bottom:10px">Fixed quote</div>
          <div class="u-flex u-justify-between" style="margin-bottom:6px"><span class="text-small text-muted">Diagnostic visit</span><span class="text-small tabular">${FixUP.fmt.money(Math.round(amount * 0.1))}</span></div>
          <div class="u-flex u-justify-between" style="margin-bottom:6px"><span class="text-small text-muted">Parts</span><span class="text-small tabular">${FixUP.fmt.money(Math.round(amount * 0.55))}</span></div>
          <div class="u-flex u-justify-between" style="margin-bottom:6px"><span class="text-small text-muted">Labour</span><span class="text-small tabular">${FixUP.fmt.money(Math.round(amount * 0.35))}</span></div>
          <hr class="divider" style="margin:8px 0">
          <div class="u-flex u-justify-between"><span class="text-body" style="font-weight:700">Total</span><span class="text-h2 tabular">${FixUP.fmt.money(amount)}</span></div>
        </div>
        <div class="card card--tint u-flex u-gap-2" style="align-items:flex-start;margin-bottom:var(--sp-6)">
          <span style="color:var(--deep-blue);width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">${icon('recycle')}</span>
          <span class="text-small">Avoids ~${factor.ewasteKg}kg e-waste and ~${factor.co2Kg}kg CO₂ vs. replacing.</span>
        </div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);"><button class="btn btn-primary btn-block" data-confirm>Confirm & book</button></div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector("[data-confirm]").onclick = (e) => {
      e.target.classList.add("btn-loading");
      setTimeout(() => {
        A.confirmQuote(job.id, t.id, amount);
        UI.toast("Repair confirmed!", "checkCircle");
        R.replaceStack("jobTracking", { id: job.id });
      }, 700);
    };
  });

  /* ---------- Job tracking ---------- */
  const STAGES = [
    { key: "requested", label: "Requested" }, { key: "confirmed", label: "Confirmed" },
    { key: "in-progress", label: "In progress" }, { key: "completed", label: "Completed" }
  ];
  R.register("jobTracking", (el, params) => {
    const s = FixUP.Store.get();
    const job = s.jobs.find(j => j.id === params.id);
    const t = s.technicians.find(t => t.id === job.technicianId);
    const stageIdx = STAGES.findIndex(st => st.key === job.status);
    el.innerHTML = `
      ${L.topbar("Track repair", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <img src="${UI.jobPhotoSrc(job.category)}" alt="" style="width:100%;aspect-ratio:2.2;border-radius:16px;object-fit:cover;margin-bottom:var(--sp-3);display:block">
        <div class="text-h2" style="margin-bottom:var(--sp-4)">${job.title}</div>
        <div class="stepper" style="margin-bottom:var(--sp-6)">
          ${STAGES.map((st, i) => `<div class="stepper__step ${i < stageIdx ? 'is-done' : i === stageIdx ? 'is-active' : ''}"><div class="stepper__line"></div><div class="stepper__dot">${i < stageIdx ? icon('check') : i + 1}</div><div class="stepper__label">${st.label}</div></div>`).join("")}
        </div>
        ${t ? `<div class="card u-flex u-items-center u-gap-3" style="margin-bottom:var(--sp-4)">
          <span class="avatar avatar-md avatar--verified">${t.initials}</span>
          <span style="flex:1"><div class="text-body" style="font-weight:700">${t.name}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">Assigned technician</div></span>
          <button class="btn-icon" data-msg>${icon('message')}</button>
        </div>` : ""}
        ${job.quote ? `<div class="card u-flex u-justify-between" style="margin-bottom:var(--sp-4)"><span class="text-small text-muted">Fixed quote</span><span class="text-body tabular" style="font-weight:700">${FixUP.fmt.money(job.quote.amount)}</span></div>` : ""}
        ${job.status === "in-progress" ? `<div class="card card--tint u-flex u-gap-2" style="align-items:flex-start;margin-bottom:var(--sp-4)"><span style="color:var(--deep-blue);width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">${icon('box')}</span><span class="text-small">Sourcing part from the spare-parts pooling network...</span></div>` : ""}
      </div>
      ${job.status !== "completed" ? `<div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);"><button class="btn btn-primary btn-block" data-advance>${advanceLabel(job.status)}</button></div>` : ""}`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector("[data-msg]") && (el.querySelector("[data-msg]").onclick = () => {
      const convo = s.conversations.find(c => c.jobId === job.id);
      R.go("chat", { id: convo ? convo.id : s.conversations[0].id });
    });
    el.querySelector("[data-advance]") && (el.querySelector("[data-advance]").onclick = () => {
      const flow = { confirmed: "in-progress", "in-progress": "completed" };
      const next = flow[job.status];
      if (next === "completed") { R.go("ratingReview", { id: job.id }); return; }
      if (next) { A.advanceJob(job.id, next); R.go("jobTracking", { id: job.id }); }
    });
  });
  function advanceLabel(status) {
    return { requested: "Waiting for technician...", confirmed: "Simulate: start repair", "in-progress": "Simulate: mark complete" }[status] || "Continue";
  }

  /* ---------- Rating & review -> triggers Impact Score sequence ---------- */
  R.register("ratingReview", (el, params) => {
    const s = FixUP.Store.get();
    const job = s.jobs.find(j => j.id === params.id);
    const t = s.technicians.find(t => t.id === job.technicianId);
    let rating = 5;
    const tags = ["On time", "Fair price", "Great work", "Clean job"];
    const picked = new Set();
    el.innerHTML = `
      ${L.topbar("Rate your repair", { back: true })}
      <div style="padding:0 var(--sp-4);text-align:center">
        <span class="avatar avatar-lg avatar--verified" style="margin:0 auto">${t.initials}</span>
        <div class="text-h2" style="margin-top:10px">How was ${t.name.split(" ")[0]}'s work?</div>
        <div id="starRow" style="margin:var(--sp-3) 0;display:flex;justify-content:center;gap:6px">
          ${[1,2,3,4,5].map(n => `<button data-star="${n}" style="width:34px;height:34px;color:var(--warning)">${icon('starFill')}</button>`).join("")}
        </div>
        <div class="u-flex u-gap-2" style="flex-wrap:wrap;justify-content:center;margin-bottom:var(--sp-4)">
          ${tags.map(tg => `<button class="chip chip--selectable" data-tag="${tg}">${tg}</button>`).join("")}
        </div>
        <div class="field" style="text-align:left;margin-bottom:var(--sp-6)"><textarea placeholder="Add a comment (optional)" data-comment></textarea></div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);"><button class="btn btn-primary btn-block" data-submit>Submit & complete</button></div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    function paintStars() { el.querySelectorAll("[data-star]").forEach(b => b.style.opacity = +b.dataset.star <= rating ? 1 : 0.3); }
    paintStars();
    el.querySelectorAll("[data-star]").forEach(b => b.onclick = () => { rating = +b.dataset.star; paintStars(); });
    el.querySelectorAll("[data-tag]").forEach(b => b.onclick = () => { b.classList.toggle("chip--selected"); picked.has(b.dataset.tag) ? picked.delete(b.dataset.tag) : picked.add(b.dataset.tag); });
    el.querySelector("[data-submit]").onclick = (e) => {
      e.target.classList.add("btn-loading");
      setTimeout(() => {
        const result = A.completeJobWithRating(job.id, { stars: rating, tags: [...picked], comment: el.querySelector("[data-comment]").value });
        R.replaceStack("repairComplete", { jobId: job.id, result: JSON.stringify(result) });
      }, 600);
    };
  });

  /* ---------- Repair completed celebration screen ---------- */
  R.register("repairComplete", (el, params) => {
    const result = JSON.parse(params.result);
    el.innerHTML = `
      <div style="padding:var(--sp-8) var(--sp-6);text-align:center;position:relative;min-height:100%;">
        <div class="check-pulse" style="margin:0 auto var(--sp-4)">${icon('checkCircle')}</div>
        <div class="text-h1">Repair completed!</div>
        <div class="text-small text-muted" style="margin-top:4px">Nice work choosing repair over replacement.</div>

        <div class="card" style="margin-top:var(--sp-6);position:relative;overflow:visible">
          <div class="u-flex u-justify-between u-items-center" style="margin-bottom:10px">
            <span class="text-small text-muted">Impact points earned</span>
            <span id="ptsChipHost" style="position:relative"></span>
          </div>
          <div class="text-display tabular" id="ptsCount" style="text-align:left">0</div>
          <div class="progress-bar" style="margin-top:14px"><div class="progress-bar__fill" id="fillBar" style="width:0%;background:var(--deep-blue)"></div></div>
          <div class="text-micro text-muted" style="margin-top:6px;text-transform:none;letter-spacing:0" id="lvlHint"></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3);margin-top:var(--sp-4)">
          <div class="card">
            <div class="u-flex u-items-center u-gap-2" style="margin-bottom:8px">
              <span style="width:28px;height:28px;border-radius:8px;background:#E4F1E8;color:#4C8B6B;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="width:15px;height:15px;display:block">${icon('recycle')}</span></span>
              <span class="text-micro text-muted">E-waste avoided</span>
            </div>
            <div class="text-h2 tabular" id="statEwaste">0 kg</div>
          </div>
          <div class="card">
            <div class="u-flex u-items-center u-gap-2" style="margin-bottom:8px">
              <span style="width:28px;height:28px;border-radius:8px;background:#E3EEF8;color:#3368A0;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="width:15px;height:15px;display:block">${icon('co2')}</span></span>
              <span class="text-micro text-muted">CO₂ avoided</span>
            </div>
            <div class="text-h2 tabular" id="statCo2">0 kg</div>
          </div>
        </div>

        <button class="btn btn-primary btn-block" style="margin-top:var(--sp-8)" data-done>Back to Home</button>
      </div>
      <div class="levelup-overlay" id="localLevelup">
        <div class="confetti-host" style="position:absolute;inset:0;overflow:hidden;"></div>
        <div class="levelup-badge">${icon('trophy')}</div>
        <div class="levelup-name"></div>
        <div class="levelup-sub">New level unlocked</div>
        <div class="levelup-tap" data-dismiss>Tap anywhere to continue</div>
      </div>`;
    el.querySelector("[data-done]").onclick = () => R.replaceStack("home");

    const consumerBefore = result.consumerResult.before;
    const consumerAfter = result.consumerResult.after;
    const ptsCount = el.querySelector("#ptsCount");
    const chipHost = el.querySelector("#ptsChipHost");
    const fillBar = el.querySelector("#fillBar");
    const lvlHint = el.querySelector("#lvlHint");

    setTimeout(() => {
      UI.animateCount(ptsCount, 0, result.points, 700, { format: (v) => "+" + Math.round(v) });
      const chip = document.createElement("span");
      chip.className = "pts-chip";
      chip.textContent = "+" + result.points + " pts";
      chipHost.appendChild(chip);
      setTimeout(() => chip.remove(), 500);
    }, 200);

    setTimeout(() => {
      fillBar.style.width = consumerBefore.pct + "%";
      requestAnimationFrame(() => {
        fillBar.style.width = (consumerAfter.levelIndex > consumerBefore.levelIndex ? 100 : consumerAfter.pct) + "%";
      });
      lvlHint.textContent = consumerAfter.isMax ? "Top impact tier reached" : `${consumerAfter.pointsForLevel - consumerAfter.pointsIntoLevel} pts to ${consumerAfter.nextLevelName}`;
    }, 300);

    const statEl = el.querySelector("#statEwaste"), co2El = el.querySelector("#statCo2");
    setTimeout(() => {
      UI.animateCount(statEl, 0, result.factor.ewasteKg, 1000, { format: (v) => v.toFixed(1) + " kg" });
      UI.animateCount(co2El, 0, result.factor.co2Kg, 1000, { format: (v) => Math.round(v) + " kg" });
    }, 500);

    if (result.consumerResult.leveledUp) {
      setTimeout(() => {
        const overlay = el.querySelector("#localLevelup");
        FixUP.Celebrate.levelUp(overlay, consumerAfter.levelName);
        overlay.onclick = () => FixUP.Celebrate.dismiss(overlay);
      }, 1400);
    }
  });
})();
