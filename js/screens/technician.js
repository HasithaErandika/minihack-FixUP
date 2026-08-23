/* Technician screens: job feed, job detail, parts marketplace, earnings, subscription. */
(function () {
  const R = FixUP.Router, UI = FixUP.UI, L = FixUP.Layout, A = FixUP.Actions, icon = UI.icon, empty = FixUP._emptyState;

  R.register("techJobs", (el) => {
    const s = FixUP.Store.get();
    const u = s.users.technician;
    const myJobs = s.jobs.filter(j => j.technicianId === "t-1" && j.status !== "completed");
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="u-flex u-justify-between u-items-center" style="margin-bottom:var(--sp-4)">
          <div><div class="text-small text-muted">Welcome back,</div><div class="text-h1">${u.name.split(" ")[0]}</div></div>
          <div class="u-flex u-gap-2">
            <button class="btn-icon" data-go="messages">${icon('message')}</button>
            <button class="btn-icon" data-go="notifications">${icon('bell')}${UI.notifBadge(s.notifications.filter(n => !n.read).length)}</button>
          </div>
        </div>

        ${u.subscription.status === "trial" ? `
        <div class="card card--tint u-flex u-items-center u-justify-between" style="margin-bottom:var(--sp-4)">
          <span class="u-flex u-items-center u-gap-2"><span style="color:var(--deep-blue)">${icon('gift')}</span><span class="text-small" style="font-weight:700">${u.subscription.freeJobsRemaining} of ${u.subscription.freeJobsTotal} free jobs left</span></span>
          <button class="text-small" style="color:var(--deep-blue);font-weight:700" data-go="subscription">Upgrade</button>
        </div>` : `
        <button class="card card--pressable u-flex u-items-center u-justify-between" style="width:100%;margin-bottom:var(--sp-4)" data-go="subscription">
          <span class="u-flex u-items-center u-gap-2"><span style="color:var(--success)">${icon('checkCircle')}</span><span class="text-small" style="font-weight:700">${u.subscription.plan} plan active</span></span>
          <span style="color:var(--ink-faint)">${icon('chevronRight')}</span>
        </button>`}

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3);margin-bottom:var(--sp-6)">
          <div class="card"><div class="text-micro text-muted">This week</div><div class="text-h2 tabular">${FixUP.fmt.money(u.earnings.thisWeek)}</div></div>
          <div class="card"><div class="text-micro text-muted">Rating</div><div class="text-h2">${u.rating} ${UI.stars(u.rating, 12)}</div></div>
        </div>

        ${myJobs.length ? `<div class="text-h2" style="margin-bottom:var(--sp-2)">Your active jobs</div><div class="u-flex-col u-gap-2" style="margin-bottom:var(--sp-6)">${myJobs.map(activeJobRow).join("")}</div>` : ""}

        <div class="u-flex u-justify-between u-items-center" style="margin-bottom:var(--sp-2)">
          <div class="text-h2">Job feed</div>
          <div class="chip chip--outline">${icon('filter')} All categories</div>
        </div>
        <div class="u-flex-col u-gap-2">${s.jobFeed.map(feedCard).join("") || empty("briefcase", "No jobs nearby", "New matched jobs will appear here.")}</div>
      </div>`;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => R.go(b.dataset.go));
    el.querySelectorAll("[data-accept]").forEach(b => b.onclick = () => { UI.toast("Job accepted!", "checkCircle"); R.go("techJobDetail", { id: "j-1" }); });
    el.querySelectorAll("[data-open-job]").forEach(b => b.onclick = () => R.go("techJobDetail", { id: b.dataset.openJob }));
  });

  function activeJobRow(j) {
    const statusClass = { confirmed: "open", "in-progress": "progress" }[j.status] || "open";
    return `<button class="card card--pressable u-flex u-items-center u-gap-3" style="width:100%;text-align:left" data-open-job="${j.id}">
      <span style="width:40px;height:40px;border-radius:12px;background:var(--mint);color:var(--deep-blue);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${icon('wrench')}</span>
      <span style="flex:1"><div class="text-small" style="font-weight:700">${j.title}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${j.location}</div></span>
      <span class="status-badge status-badge--${statusClass}">${j.status.replace("-"," ")}</span>
    </button>`;
  }
  function feedCard(j) {
    return `<div class="card">
      <div class="u-flex u-justify-between u-items-center" style="margin-bottom:6px">
        <span class="text-body" style="font-weight:700">${j.title}</span>
        <span class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${j.postedHrsAgo}h ago</span>
      </div>
      <div class="text-small text-muted" style="margin-bottom:10px"><span style="display:inline-flex;width:12px;height:12px;vertical-align:-2px">${icon('mapPin')}</span> ${j.location} · ${j.distanceKm}km · Budget Rs. ${j.budget}</div>
      <button class="btn btn-primary btn-block btn-sm" data-accept="${j.id}">Accept job</button>
    </div>`;
  }

  R.register("techJobDetail", (el, params) => {
    const s = FixUP.Store.get();
    const job = s.jobs.find(j => j.id === params.id) || s.jobs[0];
    el.innerHTML = `
      ${L.topbar("Job detail", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="text-h2" style="margin-bottom:6px">${job.title}</div>
        <div class="text-small text-muted" style="margin-bottom:var(--sp-4)">${job.description || ""}</div>
        <div class="card u-flex u-justify-between" style="margin-bottom:var(--sp-3)"><span class="text-small text-muted">Location</span><span class="text-small" style="font-weight:700">${job.location}</span></div>
        ${job.quote ? `<div class="card u-flex u-justify-between" style="margin-bottom:var(--sp-3)"><span class="text-small text-muted">Fixed quote</span><span class="text-small tabular" style="font-weight:700">${FixUP.fmt.money(job.quote.amount)}</span></div>` : ""}
        <button class="card card--pressable u-flex u-items-center u-justify-between" style="width:100%;margin-bottom:var(--sp-6)" data-go="partsMarket">
          <span class="u-flex u-items-center u-gap-2"><span style="color:var(--deep-blue)">${icon('box')}</span><span class="text-small" style="font-weight:700">Need a part? Search the pool</span></span>
          <span style="color:var(--ink-faint)">${icon('chevronRight')}</span>
        </button>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);">
        <button class="btn btn-primary btn-block" data-complete>Mark job complete</button>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector("[data-go]").onclick = () => R.go("partsMarket");
    el.querySelector("[data-complete]").onclick = () => {
      UI.toast("Waiting for customer confirmation", "clock");
      R.back();
    };
  });

  /* ---------- Parts marketplace ---------- */
  R.register("partsMarket", (el) => {
    const s = FixUP.Store.get();
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="text-h1" style="margin-bottom:var(--sp-4)">Parts Marketplace</div>
        <div class="search-bar" style="margin-bottom:var(--sp-4)">${icon('search')}<input placeholder="Search parts & materials" data-search><button class="btn-icon" style="width:32px;height:32px" data-filter>${icon('filter')}</button></div>
        <div class="u-flex-col u-gap-2">${s.listings.map(listingCard).join("")}</div>
      </div>`;
    el.querySelectorAll("[data-open]").forEach(b => b.onclick = () => R.go("partDetail", { id: b.dataset.open }));
    el.querySelector("[data-filter]").onclick = () => UI.toast("Filter by condition, price, seller rating", "filter");
  });
  function listingCard(l) {
    return `<button class="card card--pressable u-flex u-items-center u-gap-3" style="width:100%;text-align:left" data-open="${l.id}">
      ${UI.categoryTile(l.category, 52)}
      <span style="flex:1;min-width:0">
        <div class="text-small" style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.title}</div>
        <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;margin-top:2px">${l.sellerName} · ${l.condition} · ${l.stock} in stock</div>
      </span>
      <span class="text-body tabular" style="font-weight:700;flex-shrink:0">${FixUP.fmt.money(l.price)}</span>
    </button>`;
  }

  R.register("partDetail", (el, params) => {
    const s = FixUP.Store.get();
    const l = s.listings.find(l => l.id === params.id) || s.listings[0];
    const saved = s.users.consumer.savedListingIds.includes(l.id);
    const CAT_ICON = { Electronics: "wrench", Appliances: "box", Vehicles: "wrench", Garments: "leaf" };
    const heroIcon = CAT_ICON[l.category] || "box";
    el.innerHTML = `
      ${L.topbar("Product detail", { back: true, actions: [{ action: "save", icon: saved ? "bookmarkFill" : "bookmark" }] })}
      <div style="padding:0 var(--sp-4)">
        <div style="width:100%;aspect-ratio:1.5;border-radius:var(--radius-card);background:var(--sky);display:flex;align-items:center;justify-content:center;color:var(--indigo);margin-bottom:var(--sp-2);position:relative;overflow:hidden">
          <span style="width:64px;height:64px;display:block">${icon(heroIcon)}</span>
        </div>
        <div class="u-flex u-gap-1" style="justify-content:center;margin-bottom:var(--sp-4)">
          <span style="width:16px;height:5px;border-radius:999px;background:var(--deep-blue)"></span>
          <span style="width:5px;height:5px;border-radius:999px;background:var(--border-strong)"></span>
          <span style="width:5px;height:5px;border-radius:999px;background:var(--border-strong)"></span>
        </div>
        <div class="text-h1" style="margin-bottom:6px">${l.title}</div>
        <div class="text-h2 tabular" style="color:var(--deep-blue);margin-bottom:10px">${FixUP.fmt.money(l.price)}</div>
        <div class="u-flex u-gap-2" style="margin-bottom:var(--sp-4);flex-wrap:wrap"><span class="chip chip--outline">${l.category}</span><span class="chip chip--outline">${l.condition}</span><span class="chip chip--outline">${l.stock} in stock</span>${l.pointsDiscountable ? `<span class="chip">${icon('ticket')} Points eligible</span>` : ""}</div>

        <div class="card" style="margin-bottom:var(--sp-4)">
          <div class="u-flex u-justify-between" style="margin-bottom:8px"><span class="text-small text-muted">Category</span><span class="text-small" style="font-weight:700">${l.category}</span></div>
          <div class="u-flex u-justify-between" style="margin-bottom:8px"><span class="text-small text-muted">Condition</span><span class="text-small" style="font-weight:700">${l.condition}</span></div>
          <div class="u-flex u-justify-between"><span class="text-small text-muted">Fit</span><span class="text-small" style="font-weight:700">Universal / multi-model</span></div>
        </div>

        <div class="card u-flex u-items-center u-gap-3" style="margin-bottom:var(--sp-6)">
          <span class="avatar avatar-md">${l.sellerName[0]}</span>
          <span style="flex:1"><div class="text-small" style="font-weight:700">${l.sellerName}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${UI.stars(l.sellerRating || 4.5, 11)} <span style="margin-left:4px">${l.sellerRating || 4.5} · Verified seller</span></div></span>
        </div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);display:flex;gap:8px;">
        <button class="btn btn-secondary" style="flex:1" data-request>Request part</button>
        <button class="btn btn-primary" style="flex:1" data-buy>Buy now</button>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector('[data-action="save"]').onclick = () => { A.toggleSaved("savedListingIds", l.id); R.go("partDetail", { id: l.id }); };
    el.querySelector("[data-request]").onclick = () => { UI.toast("Part requested from " + l.sellerName, "box"); R.back(); };
    el.querySelector("[data-buy]").onclick = () => { UI.toast("Purchase confirmed", "checkCircle"); R.back(); };
  });

  /* ---------- Earnings ---------- */
  R.register("earnings", (el) => {
    const s = FixUP.Store.get();
    const u = s.users.technician;
    const max = Math.max(...u.earnings.history.map(h => h.amount), 1);
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="text-h1" style="margin-bottom:var(--sp-4)">Earnings</div>
        <div class="card" style="margin-bottom:var(--sp-4)">
          <div class="text-micro text-muted">Total earned</div>
          <div class="text-display tabular">${FixUP.fmt.money(u.earnings.total)}</div>
        </div>
        <div class="card" style="margin-bottom:var(--sp-4)">
          <div class="text-small" style="font-weight:700;margin-bottom:12px">This week — ${FixUP.fmt.money(u.earnings.thisWeek)}</div>
          <div style="display:flex;align-items:flex-end;gap:8px;height:100px;">
            ${u.earnings.history.map(h => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
              <div style="width:100%;background:var(--mid-blue);border-radius:6px 6px 0 0;height:${Math.max(4, (h.amount/max)*76)}px"></div>
              <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${h.label}</div>
            </div>`).join("")}
          </div>
        </div>
        <button class="card card--pressable u-flex u-items-center u-justify-between" style="width:100%;margin-bottom:var(--sp-3)" data-go="subscription">
          <span class="u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon('gift')}</span><span class="text-body" style="font-weight:700">Subscription plan</span></span>
          <span style="color:var(--ink-faint)">${icon('chevronRight')}</span>
        </button>
        <div class="text-h2" style="margin:var(--sp-4) 0 var(--sp-2)">Points & discounts</div>
        <div class="card u-flex u-justify-between u-items-center">
          <span><div class="text-small text-muted">Available balance</div><div class="text-h2 tabular">${u.impact.points.toLocaleString()} pts</div></span>
          <button class="btn btn-secondary btn-sm" data-go="partsMarket">Redeem on parts</button>
        </div>
      </div>`;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => R.go(b.dataset.go));
  });

})();
