/* Shared / cross-cutting screens: onboarding, auth, notifications, messaging, profile, settings, impact, achievements, leaderboard, saved. */
(function () {
  const R = FixUP.Router, UI = FixUP.UI, L = FixUP.Layout, A = FixUP.Actions, icon = UI.icon;
  const DEFAULT_HOME = { consumer: "home", technician: "techJobs", seller: "listings" };

  /* ---------- Splash ---------- */
  R.register("splash", (el) => {
    el.innerHTML = `
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:var(--cream);">
        <img src="assets/logo-full.png" alt="FixUP" class="ambient-drift pop-in" style="width:220px;height:auto;">
        <div class="text-small text-muted">Repair, not replace.</div>
      </div>`;
    setTimeout(() => R.replaceStack("onboarding"), 1400);
  });

  /* ---------- Onboarding carousel ---------- */
  const SLIDES = [
    { icon: "wrench", title: "Repair, not replace", desc: "Find trustworthy, verified technicians for anything worth fixing — electronics, appliances, vehicles, garments." },
    { icon: "shield", title: "Verified technicians you can trust", desc: "ID checks, skill assessments, and real reviews — no more guessing who's letting into your home." },
    { icon: "leaf", title: "Every fix has an impact", desc: "Track e-waste avoided, CO₂ saved, and watch your impact score grow with every repair." }
  ];
  R.register("onboarding", (el, params) => {
    const i = params.i || 0;
    const s = SLIDES[i];
    el.innerHTML = `
      <div style="height:100%;display:flex;flex-direction:column;padding:${'var(--sp-6)'} var(--sp-6) var(--sp-8);">
        <div style="text-align:right"><button class="btn btn-ghost btn-sm" data-skip>Skip</button></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:var(--sp-4);">
          <div class="pop-in" style="width:120px;height:120px;border-radius:32px;background:var(--mint);color:var(--deep-blue);display:flex;align-items:center;justify-content:center;">
            <span style="width:56px;height:56px;display:block">${icon(s.icon)}</span>
          </div>
          <div class="text-display">${s.title}</div>
          <div class="text-body text-muted">${s.desc}</div>
        </div>
        <div style="display:flex;justify-content:center;gap:6px;margin-bottom:var(--sp-6);">
          ${SLIDES.map((_, idx) => `<span style="width:${idx === i ? 20 : 6}px;height:6px;border-radius:99px;background:${idx === i ? 'var(--deep-blue)' : 'var(--border-strong)'};transition:width .2s"></span>`).join("")}
        </div>
        <button class="btn btn-primary btn-block" data-next>${i === SLIDES.length - 1 ? "Get started" : "Next"}</button>
      </div>`;
    el.querySelector("[data-skip]").onclick = () => R.replaceStack("roleSelect");
    el.querySelector("[data-next]").onclick = () => {
      if (i < SLIDES.length - 1) R.go("onboarding", { i: i + 1 });
      else R.replaceStack("roleSelect");
    };
  });

  /* ---------- Role selection ---------- */
  const ROLE_META = {
    consumer: { icon: "home", title: "I need something repaired", desc: "Post a repair and get matched with verified technicians nearby.", tint: "mint", ink: "deep-blue" },
    technician: { icon: "wrench", title: "I'm a technician", desc: "Get instant-match jobs, source parts, and build a trusted reputation.", tint: "sky", ink: "indigo" },
    seller: { icon: "box", title: "I sell parts & materials", desc: "List surplus, salvaged, or new spare parts to a wide network.", tint: "sage", ink: "deep-blue" }
  };
  R.register("roleSelect", (el) => {
    el.innerHTML = `
      <div style="padding:var(--sp-8) var(--sp-6) var(--sp-4);">
        <img src="assets/logo-mark.png" alt="" style="width:32px;height:auto;margin-bottom:var(--sp-6);">
        <div class="text-micro" style="color:var(--deep-blue);margin-bottom:8px;">Get started</div>
        <div class="text-h1" style="margin-bottom:6px;">Who are you on FixUP?</div>
        <div class="text-body text-muted" style="margin-bottom:var(--sp-6);">Pick how you'll use the platform. You can explore the other views any time from Settings.</div>
        <div class="u-flex-col u-gap-3">
          ${Object.keys(ROLE_META).map(key => {
            const r = ROLE_META[key];
            return `
            <button class="card card--pressable" data-role="${key}" style="text-align:left;display:flex;align-items:center;gap:var(--sp-3);width:100%;">
              <span style="width:46px;height:46px;border-radius:14px;background:var(--${r.tint});color:var(--${r.ink});display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="width:22px;height:22px;display:block">${icon(r.icon)}</span></span>
              <span style="flex:1;min-width:0;">
                <div class="text-h2" style="margin-bottom:2px;">${r.title}</div>
                <div class="text-small text-muted" style="font-weight:400;">${r.desc}</div>
              </span>
              <span style="color:var(--ink-faint);flex-shrink:0;width:18px;height:18px;">${icon('chevronRight')}</span>
            </button>`;
          }).join("")}
        </div>
      </div>`;
    el.querySelectorAll("[data-role]").forEach(b => b.onclick = () => {
      A.switchRole(b.dataset.role);
      R.go("auth", { role: b.dataset.role });
    });
  });

  /* ---------- Auth ---------- */
  R.register("auth", (el, params) => {
    const role = params.role || FixUP.Store.get().role;
    const user = FixUP.Store.get().users[role];
    const meta = ROLE_META[role];
    el.innerHTML = `
      ${L.topbar("", { back: true })}
      <div style="padding:0 var(--sp-6);">
        <img src="assets/logo-mark.png" alt="" style="width:30px;height:auto;margin:var(--sp-1) 0 var(--sp-5);">
        <button class="chip" data-change-role style="background:var(--${meta.tint});color:var(--${meta.ink});margin-bottom:var(--sp-4);">${icon(meta.icon)} Signing up as ${role[0].toUpperCase() + role.slice(1)}</button>
        <div class="text-h1" style="margin-bottom:4px;">Create your account</div>
        <div class="text-body text-muted" style="margin-bottom:var(--sp-6);">Just for this demo — prefilled with a sample profile.</div>
        <div class="u-flex-col u-gap-4">
          <div class="field">
            <label>Full name</label>
            <div class="input-icon">${icon('user')}<input type="text" value="${user.name}"></div>
          </div>
          <div class="field">
            <label>Email</label>
            <div class="input-icon">${icon('mail')}<input type="email" value="${user.name.split(' ')[0].toLowerCase()}@example.com"></div>
          </div>
          <div class="field">
            <label>Password</label>
            <div class="input-icon">${icon('lock')}<input type="password" value="fixup2026" data-password><button type="button" class="input-icon__action" data-toggle-pw>${icon('eye')}</button></div>
          </div>
        </div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-4) var(--sp-6);background:var(--cream);border-top:1px solid var(--border);">
        <button class="btn btn-primary btn-block" data-continue>Continue</button>
        <div class="text-micro text-muted" style="text-align:center;margin-top:10px;text-transform:none;letter-spacing:0;">
          ${role === "technician" ? "You'll verify your identity next." : "By continuing, you agree to FixUP's Terms and Privacy Policy."}
        </div>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector("[data-change-role]").onclick = () => R.back();
    el.querySelector("[data-toggle-pw]").onclick = (e) => {
      const input = el.querySelector("[data-password]");
      const isPw = input.type === "password";
      input.type = isPw ? "text" : "password";
      e.currentTarget.innerHTML = icon(isPw ? "eyeOff" : "eye");
    };
    el.querySelector("[data-continue]").onclick = () => {
      if (role === "technician") R.go("verification");
      else { A.completeOnboarding(); R.replaceStack(DEFAULT_HOME[role]); UI.toast("Welcome to FixUP!", "checkCircle"); }
    };
  });

  /* ---------- Technician verification ---------- */
  R.register("verification", (el) => {
    el.innerHTML = `
      <div style="padding:var(--sp-6);">
        ${L.topbar("Get verified")}
        <div class="text-body text-muted" style="margin:0 var(--sp-2) var(--sp-6);">Verification builds the trust score consumers see on your profile.</div>
        <div class="u-flex-col u-gap-3" style="padding:0 var(--sp-2)">
          <div class="card u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon('shield')}</span><div><div class="text-body" style="font-weight:700">ID verification</div><div class="text-small text-muted">Upload a government-issued ID</div></div></div>
          <div class="upload-grid" style="grid-template-columns:repeat(3,1fr)"><div class="upload-tile">${icon('camera')}</div></div>
          <div class="card u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon('wrench')}</span><div><div class="text-body" style="font-weight:700">Skill assessment</div><div class="text-small text-muted">Electronics & Appliances — short quiz</div></div></div>
          <div class="card u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon('medal')}</span><div><div class="text-body" style="font-weight:700">VTA certification</div><div class="text-small text-muted">Optional — boosts your trust score</div></div></div>
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:var(--sp-6);" data-submit>Submit for review</button>
      </div>`;
    el.querySelector("[data-nav-back]") && (el.querySelector("[data-nav-back]").onclick = () => R.back());
    el.querySelector("[data-submit]").onclick = () => R.go("verificationSuccess");
  });
  R.register("verificationSuccess", (el) => {
    el.innerHTML = `
      <div class="state-block" style="padding-top:var(--sp-10)">
        <div class="check-pulse">${icon('checkCircle')}</div>
        <div class="text-h1">Under review</div>
        <div class="state-block__desc">We'll verify your details within 24 hours. You can start browsing jobs right away with 5 free trial jobs.</div>
        <button class="btn btn-primary btn-block" style="margin-top:var(--sp-4)" data-continue>Continue to FixUP</button>
      </div>`;
    el.querySelector("[data-continue]").onclick = () => {
      A.completeOnboarding();
      R.replaceStack("techJobs");
      UI.toast("You're in! 5 free jobs waiting.", "gift");
    };
  });

  /* ---------- Notifications ---------- */
  R.register("notifications", (el) => {
    const s = FixUP.Store.get();
    const iconFor = { job: "wrench", badge: "medal", message: "message", payment: "wallet", system: "info" };
    const today = s.notifications.filter(n => Date.now() - n.at < 86400000);
    const earlier = s.notifications.filter(n => Date.now() - n.at >= 86400000);
    const row = (n) => `
      <div class="card card--flat" style="display:flex;gap:var(--sp-3);align-items:flex-start;background:${n.read ? 'transparent' : 'var(--mint)'};border:none;">
        <span style="width:38px;height:38px;border-radius:50%;background:var(--surface);color:var(--deep-blue);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--border-crisp)"><span style="width:18px;height:18px;display:block">${icon(iconFor[n.type] || 'bell')}</span></span>
        <div><div class="text-small" style="font-weight:600;color:var(--ink)">${n.text}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;font-weight:500;margin-top:2px;">${FixUP.fmt.timeAgo(n.at)}</div></div>
      </div>`;
    el.innerHTML = `
      ${L.topbar("Notifications", { back: true })}
      <div style="padding:0 var(--sp-4)">
        ${today.length ? `<div class="text-micro text-muted" style="margin:var(--sp-2) 0">Today</div><div class="u-flex-col u-gap-1">${today.map(row).join("")}</div>` : ""}
        ${earlier.length ? `<div class="text-micro text-muted" style="margin:var(--sp-4) 0 var(--sp-2)">Earlier</div><div class="u-flex-col u-gap-1">${earlier.map(row).join("")}</div>` : ""}
        ${!s.notifications.length ? emptyState("bell", "You're all caught up", "New updates on your jobs and impact will show up here.") : ""}
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    A.markNotificationsRead();
  });

  /* ---------- Messaging: thread list ---------- */
  R.register("messages", (el) => {
    const s = FixUP.Store.get();
    el.innerHTML = `
      ${L.topbar("Messages", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="u-flex-col u-gap-2">
          ${s.conversations.map(c => {
            const last = c.messages[c.messages.length - 1];
            return `<button class="card card--pressable" data-open="${c.id}" style="text-align:left;display:flex;gap:var(--sp-3);align-items:center;width:100%;">
              <span class="avatar avatar-md">${c.withInitials}</span>
              <span style="flex:1;min-width:0;">
                <div class="u-flex u-justify-between"><span class="text-body" style="font-weight:700">${c.withName}</span><span class="text-micro text-muted" style="text-transform:none;letter-spacing:0;font-weight:500">${FixUP.fmt.timeAgo(last.at)}</span></div>
                <div class="text-small text-muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${last.text}</div>
              </span>
            </button>`;
          }).join("") || emptyState("message", "No conversations yet", "Messages with your technicians will appear here.")}
        </div>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelectorAll("[data-open]").forEach(b => b.onclick = () => R.go("chat", { id: b.dataset.open }));
  });

  R.register("chat", (el, params) => {
    const s = FixUP.Store.get();
    const c = s.conversations.find(c => c.id === params.id);
    const bubble = (m) => `<div style="display:flex;justify-content:${m.from === 'me' ? 'flex-end' : 'flex-start'};margin-bottom:8px;">
      <div style="max-width:75%;padding:10px 14px;border-radius:16px;background:${m.from === 'me' ? 'var(--deep-blue)' : 'var(--surface)'};color:${m.from === 'me' ? '#fff' : 'var(--ink)'};border:1px solid ${m.from === 'me' ? 'transparent' : 'var(--border-crisp)'};font-size:14px;">${m.text}</div>
    </div>`;
    el.innerHTML = `
      ${L.topbar(c.withName, { back: true })}
      <div style="padding:0 var(--sp-4) var(--sp-3);">
        <div class="chip" style="background:var(--mint);color:var(--indigo);width:100%;justify-content:center;">${icon('wrench')} ${c.jobTitle}</div>
      </div>
      <div style="padding:0 var(--sp-4);min-height:200px;">${c.messages.map(bubble).join("")}</div>
      <div style="padding:var(--sp-3) var(--sp-4);display:flex;gap:6px;flex-wrap:wrap;">
        ${["On my way", "Thank you!", "Can you share a photo?"].map(q => `<button class="chip chip--outline" data-quick>${q}</button>`).join("")}
      </div>
      <div style="position:sticky;bottom:0;background:var(--cream);padding:var(--sp-2) var(--sp-4) var(--sp-2);display:flex;gap:8px;align-items:center;">
        <input type="text" placeholder="Message..." class="text-body" style="flex:1;border:1.5px solid var(--border-strong);border-radius:var(--radius-pill);padding:12px 16px;background:var(--surface);" data-input>
        <button class="btn-icon" style="background:var(--deep-blue);color:#fff;" data-send>${icon('send')}</button>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    const input = el.querySelector("[data-input]");
    const send = (text) => { if (!text.trim()) return; A.sendMessage(c.id, text); R.go("chat", { id: c.id }); };
    el.querySelector("[data-send]").onclick = () => send(input.value);
    input.onkeydown = (e) => { if (e.key === "Enter") send(input.value); };
    el.querySelectorAll("[data-quick]").forEach(b => b.onclick = () => send(b.textContent));
    el.scrollTop = el.scrollHeight;
  });

  /* ---------- Impact overview ---------- */
  R.register("impact", (el) => {
    const s = FixUP.Store.get();
    const u = s.users[s.role];
    const lvl = FixUP.computeLevel(u.impact.points);
    const r = 46, c = 2 * Math.PI * r;
    el.innerHTML = `
      ${L.topbar("Your Impact", { actions: [{ action: "info", icon: "info" }] })}
      <div style="padding:0 var(--sp-4)">
        <div class="card--tint card" style="display:flex;flex-direction:column;align-items:center;gap:var(--sp-2);padding:var(--sp-6);">
          <div class="ring-progress" style="width:132px;height:132px;">
            <svg width="132" height="132"><circle class="ring-progress__track" cx="66" cy="66" r="${r}" stroke-width="10"/><circle class="ring-progress__fill" id="ring" cx="66" cy="66" r="${r}" stroke-width="10" stroke-dasharray="${c}" stroke-dashoffset="${c}"/></svg>
            <div class="ring-progress__label"><div class="text-h1" id="ringPts">0</div><div class="text-micro text-muted">points</div></div>
          </div>
          <div class="level-badge ambient-drift">${icon('leaf')} ${lvl.levelName}</div>
          <div class="text-small text-muted">${lvl.isMax ? "Top tier reached" : `${lvl.pointsForLevel - lvl.pointsIntoLevel} pts to ${lvl.nextLevelName}`}</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3);margin-top:var(--sp-4)">
          ${statTile("recycle", "E-waste avoided", u.impact.ewasteKg, "kg", "ewaste")}
          ${statTile("co2", "CO₂ avoided", u.impact.co2Kg, "kg", "co2")}
          ${statTile("tree", "Trees equivalent", u.impact.treesEquivalent, "", "trees")}
          ${u.impact.moneySaved != null ? statTile("wallet", "Money saved", u.impact.moneySaved, "Rs.", "money", true) : statTile("flame", "Day streak", u.impact.streakDays, "days", "streak")}
        </div>

        <div class="u-flex u-justify-between u-items-center" style="margin:var(--sp-6) 0 var(--sp-2)">
          <div class="text-h2">Achievements</div>
          <button class="text-small" style="color:var(--deep-blue);font-weight:700" data-go="achievements">See all</button>
        </div>
        <div style="display:flex;gap:var(--sp-2);overflow-x:auto;padding-bottom:4px;">
          ${s.badges.slice(0, 5).map(b => {
            const unlocked = u.impact.badges.includes(b.id);
            return `<div style="flex-shrink:0;width:72px;text-align:center;">
              <div style="width:56px;height:56px;border-radius:16px;background:${unlocked ? 'var(--mint)' : 'var(--surface-sunken)'};color:${unlocked ? 'var(--deep-blue)' : 'var(--ink-faint)'};display:flex;align-items:center;justify-content:center;margin:0 auto 6px;"><span style="width:26px;height:26px;display:block">${icon('medal')}</span></div>
              <div class="text-micro" style="text-transform:none;letter-spacing:0;color:var(--ink-soft);line-height:1.2">${b.name}</div>
            </div>`;
          }).join("")}
        </div>

        <button class="card card--pressable u-flex u-items-center u-justify-between" style="margin-top:var(--sp-4);width:100%;" data-go="leaderboard">
          <span class="u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon('trophy')}</span><span class="text-body" style="font-weight:700">Leaderboard</span></span>
          <span style="color:var(--ink-faint)">${icon('chevronRight')}</span>
        </button>
      </div>`;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => R.go(b.dataset.go));
    el.querySelector('[data-action="info"]').onclick = () => UI.toast("Estimates use published EPA/EU e-waste averages per category.", "info");
    requestAnimationFrame(() => {
      const pct = lvl.pct / 100;
      el.querySelector("#ring").style.strokeDashoffset = c - c * pct;
      UI.animateCount(el.querySelector("#ringPts"), 0, u.impact.points, 900, { format: (v) => Math.round(v).toLocaleString() });
      const statVals = { ewaste: u.impact.ewasteKg, co2: u.impact.co2Kg, trees: u.impact.treesEquivalent, money: u.impact.moneySaved, streak: u.impact.streakDays };
      el.querySelectorAll("[data-stat]").forEach(node => {
        const key = node.dataset.stat;
        const target = statVals[key] || 0;
        const isMoney = key === "money";
        const isDecimal = key === "trees" || (key === "ewaste");
        UI.animateCount(node, 0, target, 1000, {
          format: (v) => isMoney ? FixUP.fmt.money(Math.round(v)) : (isDecimal ? v.toFixed(1) : Math.round(v).toLocaleString())
        });
      });
    });
  });

  function statTile(iconName, label, value, unit, key, money) {
    return `<div class="card">
      <div class="u-flex u-items-center u-gap-2" style="margin-bottom:8px;color:var(--mid-blue)"><span style="width:18px;height:18px;display:block">${icon(iconName)}</span><span class="text-micro text-muted">${label}</span></div>
      <div class="text-h1 tabular" data-stat="${key}">${money ? "Rs. 0" : "0"}</div>
      ${unit && !money ? `<div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;">${unit}</div>` : ""}
    </div>`;
  }

  function emptyState(iconName, title, desc) {
    return `<div class="state-block"><div class="state-block__icon">${icon(iconName)}</div><div class="state-block__title">${title}</div><div class="state-block__desc">${desc}</div></div>`;
  }
  window.FixUP._emptyState = emptyState;

  /* ---------- Achievements ---------- */
  R.register("achievements", (el) => {
    const s = FixUP.Store.get();
    const u = s.users[s.role];
    el.innerHTML = `
      ${L.topbar("Achievements", { back: true })}
      <div style="padding:0 var(--sp-4);display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3)">
        ${s.badges.map(b => {
          const unlocked = u.impact.badges.includes(b.id);
          return `<div class="card" style="text-align:center;opacity:${unlocked ? 1 : 0.55}">
            <div style="width:56px;height:56px;border-radius:16px;background:${unlocked ? 'var(--mint)' : 'var(--surface-sunken)'};color:var(--deep-blue);display:flex;align-items:center;justify-content:center;margin:0 auto 8px;"><span style="width:26px;height:26px;display:block">${icon('medal')}</span></div>
            <div class="text-small" style="font-weight:700">${b.name}</div>
            <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;margin-top:4px;">${b.desc}</div>
            <div class="chip chip--outline" style="margin-top:8px;font-size:10px;padding:3px 8px;">${b.rarity}</div>
          </div>`;
        }).join("")}
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
  });

  /* ---------- Leaderboard ---------- */
  R.register("leaderboard", (el) => {
    const s = FixUP.Store.get();
    const isC = s.role === "consumer";
    const list = isC ? s.leaderboard.consumers : s.leaderboard.technicians;
    el.innerHTML = `
      ${L.topbar("Leaderboard", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="text-small text-muted" style="margin-bottom:var(--sp-3)">${isC ? "Ranked by impact points this season" : "Ranked by job volume and rating — not just speed"}</div>
        <div class="u-flex-col u-gap-2">
          ${list.map((p, i) => `
            <div class="card" style="display:flex;align-items:center;gap:var(--sp-3);${p.isMe ? 'border-color:var(--deep-blue);background:var(--mint);' : ''}">
              <div class="text-h2" style="width:24px;color:${i < 3 ? 'var(--deep-blue)' : 'var(--ink-faint)'}">${i + 1}</div>
              <span class="avatar avatar-md">${p.name.split(" ").map(n => n[0]).join("")}</span>
              <span style="flex:1"><div class="text-body" style="font-weight:700">${p.name}${p.isMe ? " (You)" : ""}</div></span>
              <div style="text-align:right">${isC ? `<div class="text-body tabular" style="font-weight:700">${p.points.toLocaleString()}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">pts</div>` : `<div class="text-body tabular" style="font-weight:700">${p.jobs} jobs</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${UI.stars(p.rating, 11)}</div>`}</div>
            </div>`).join("")}
        </div>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
  });

  /* ---------- Profile ---------- */
  R.register("profile", (el) => {
    const s = FixUP.Store.get();
    const u = s.users[s.role];
    const lvl = FixUP.computeLevel(u.impact.points);
    el.innerHTML = `
      ${L.topbar("Profile", { actions: [{ action: "edit", icon: "edit" }] })}
      <div style="padding:0 var(--sp-4)">
        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:var(--sp-4) 0 var(--sp-6);">
          <span class="avatar avatar-lg ${s.role === 'technician' ? 'avatar--verified' : ''}">${u.initials}</span>
          <div class="text-h1">${u.name}${s.role === "seller" ? "" : ""}</div>
          ${s.role === "seller" ? `<div class="text-small text-muted">${u.businessName}</div>` : ""}
          <div class="u-flex u-gap-2">
            ${s.role === "technician" ? `<span class="badge-verified">${icon('shield')} Verified</span>` : ""}
            <span class="level-badge">${icon('leaf')} ${lvl.levelName}</span>
          </div>
          ${s.role !== "consumer" ? `<div class="u-flex u-items-center u-gap-1">${UI.stars(u.rating)}<span class="text-small text-muted" style="margin-left:4px">${u.rating} (${u.reviewCount})</span></div>` : ""}
          <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0"><span style="display:inline-flex;width:12px;height:12px;vertical-align:-2px">${icon('mapPin')}</span> ${u.location}</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--sp-2);margin-bottom:var(--sp-6)">
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${u.impact.points.toLocaleString()}</div><div class="text-micro text-muted">points</div></div>
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${u.impact.ewasteKg}</div><div class="text-micro text-muted">kg saved</div></div>
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${u.impact.streakDays}</div><div class="text-micro text-muted">day streak</div></div>
        </div>

        ${s.role === "technician" ? `
          <div class="text-h2" style="margin-bottom:var(--sp-2)">Portfolio</div>
          <div class="u-flex-col u-gap-2" style="margin-bottom:var(--sp-6)">
            ${u.portfolio.map(p => `<div class="card u-flex u-items-center u-justify-between"><span class="text-small" style="font-weight:600">${p.title}</span><span class="chip">${p.tag}</span></div>`).join("")}
          </div>
          <div class="text-h2" style="margin-bottom:var(--sp-2)">About</div>
          <p class="text-small text-muted" style="margin-bottom:var(--sp-6)">${u.bio}</p>
        ` : ""}

        ${s.role === "consumer" ? `
          <button class="card card--pressable u-flex u-items-center u-justify-between" style="width:100%;margin-bottom:var(--sp-3)" data-go="saved"><span class="u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon('bookmark')}</span><span class="text-body" style="font-weight:700">Saved items</span></span><span style="color:var(--ink-faint)">${icon('chevronRight')}</span></button>
        ` : ""}
        ${s.role === "seller" ? `
          <div class="text-h2" style="margin-bottom:var(--sp-2)">Business</div>
          <div class="card u-flex u-justify-between" style="margin-bottom:var(--sp-6)"><span class="text-small text-muted">Total revenue</span><span class="text-body" style="font-weight:700">${FixUP.fmt.money(u.salesSummary.totalRevenue)}</span></div>
        ` : ""}

        <button class="card card--pressable u-flex u-items-center u-justify-between" style="width:100%" data-go="settings"><span class="u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon('settings')}</span><span class="text-body" style="font-weight:700">Settings</span></span><span style="color:var(--ink-faint)">${icon('chevronRight')}</span></button>
      </div>`;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => R.go(b.dataset.go));
  });

  /* ---------- Saved items (consumer) ---------- */
  R.register("saved", (el) => {
    const s = FixUP.Store.get();
    const u = s.users.consumer;
    const techs = s.technicians.filter(t => u.savedTechnicianIds.includes(t.id));
    const listings = s.listings.filter(l => u.savedListingIds.includes(l.id));
    el.innerHTML = `
      ${L.topbar("Saved items", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="text-h2" style="margin-bottom:var(--sp-2)">Technicians</div>
        <div class="u-flex-col u-gap-2" style="margin-bottom:var(--sp-6)">
          ${techs.map(t => techRow(t)).join("") || `<div class="text-small text-muted">No saved technicians yet.</div>`}
        </div>
        <div class="text-h2" style="margin-bottom:var(--sp-2)">Parts & listings</div>
        <div class="u-flex-col u-gap-2">
          ${listings.map(l => `<div class="card u-flex u-justify-between u-items-center"><span class="text-small" style="font-weight:600">${l.title}</span><span class="text-small tabular" style="font-weight:700">${FixUP.fmt.money(l.price)}</span></div>`).join("") || `<div class="text-small text-muted">No saved listings yet.</div>`}
        </div>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelectorAll("[data-open-tech]").forEach(b => b.onclick = () => R.go("techProfile", { id: b.dataset.openTech }));
  });
  function techRow(t) {
    return `<button class="card card--pressable u-flex u-items-center u-gap-3" style="width:100%;text-align:left" data-open-tech="${t.id}">
      <span class="avatar avatar-md avatar--verified">${t.initials}</span>
      <span style="flex:1"><div class="text-body" style="font-weight:700">${t.name}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${FixUP.UI.stars(t.rating, 11)} <span style="margin-left:4px">${t.rating}</span></div></span>
      <span style="color:var(--ink-faint)">${FixUP.UI.icon('chevronRight')}</span>
    </button>`;
  }
  window.FixUP._techRow = techRow;

  /* ---------- Settings ---------- */
  R.register("settings", (el) => {
    const s = FixUP.Store.get();
    const row = (iconName, label, right) => `<div class="card u-flex u-items-center u-justify-between"><span class="u-flex u-items-center u-gap-3"><span style="color:var(--deep-blue)">${icon(iconName)}</span><span class="text-small" style="font-weight:600">${label}</span></span>${right}</div>`;
    el.innerHTML = `
      ${L.topbar("Settings", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="text-micro text-muted" style="margin:var(--sp-2) 0">Demo controls</div>
        <div class="card" style="margin-bottom:var(--sp-3)">
          <div class="text-small" style="font-weight:700;margin-bottom:8px">View as</div>
          <div class="u-flex u-gap-2">
            ${["consumer", "technician", "seller"].map(r => `<button class="chip chip--selectable ${s.role === r ? 'chip--selected' : ''}" data-role="${r}" style="flex:1;justify-content:center">${r[0].toUpperCase() + r.slice(1)}</button>`).join("")}
          </div>
        </div>
        <div class="text-micro text-muted" style="margin:var(--sp-4) 0 var(--sp-2)">Preferences</div>
        <div class="u-flex-col u-gap-2">
          ${row("bell", "Push notifications", `<div class="toggle is-on" data-toggle></div>`)}
          ${row("shield", "Privacy", `<span style="color:var(--ink-faint)">${icon('chevronRight')}</span>`)}
          ${row("wallet", "Payment methods", `<span style="color:var(--ink-faint)">${icon('chevronRight')}</span>`)}
          ${row("message", "WhatsApp bot access", `<div class="toggle" data-toggle></div>`)}
          ${row("leaf", "Reduced motion", `<div class="toggle" data-toggle></div>`)}
        </div>
        <div class="text-micro text-muted" style="margin:var(--sp-4) 0 var(--sp-2)">Support</div>
        <div class="u-flex-col u-gap-2" style="margin-bottom:var(--sp-6)">${row("info", "Help & FAQ", `<span style="color:var(--ink-faint)">${icon('chevronRight')}</span>`)}</div>
        <button class="btn btn-secondary btn-block" data-reset>Reset demo data</button>
        <button class="btn btn-ghost btn-block" style="color:var(--danger);margin-top:8px" data-logout>${icon('logout')} Log out</button>
      </div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelectorAll("[data-toggle]").forEach(t => t.onclick = () => t.classList.toggle("is-on"));
    el.querySelectorAll("[data-role]").forEach(b => b.onclick = () => {
      A.switchRole(b.dataset.role);
      R.replaceStack(DEFAULT_HOME[b.dataset.role]);
      UI.toast(`Viewing as ${b.dataset.role}`, "user");
    });
    el.querySelector("[data-reset]").onclick = () => { A.resetDemo(); R.replaceStack("splash"); };
    el.querySelector("[data-logout]").onclick = () => { A.resetDemo(); R.replaceStack("splash"); };
  });

  // animate stat tiles whenever the impact screen (or profile) mounts with data-stat targets
  document.addEventListener("fixup:statmount", () => {});
})();
