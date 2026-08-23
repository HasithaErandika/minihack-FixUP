(function () {
  const DEFAULT_HOME = { consumer: "home", technician: "techJobs", seller: "listings" };

  function renderStatusbar() {
    const el = document.getElementById("statusbar");
    const t = new Date();
    let h = t.getHours(), m = t.getMinutes();
    const time = (h % 12 || 12) + ":" + String(m).padStart(2, "0");
    el.innerHTML = `<span>${time}</span><span class="statusbar__icons">` +
      `<span style="width:17px;height:12px;display:block">${FixUP.UI.icon('signal')}</span>` +
      `<span style="width:12px;height:12px;display:block">${FixUP.UI.icon('wifi')}</span>` +
      `<span style="width:24px;height:12px;display:block">${FixUP.UI.icon('battery')}</span></span>`;
  }

  function wireBottomNav() {
    document.getElementById("bottomNav").addEventListener("click", (e) => {
      const item = e.target.closest("[data-nav-to]");
      if (!item) return;
      FixUP.Router.replaceStack(item.dataset.navTo);
    });
  }

  function wireFilterSheet() {
    const overlay = document.getElementById("filterSheet");
    overlay.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip--selectable");
      if (chip) { chip.parentElement.querySelectorAll(".chip--selectable").forEach(c => c.classList.remove("chip--selected")); chip.classList.add("chip--selected"); return; }
      if (e.target === overlay || e.target.closest("[data-close-sheet]")) FixUP.UI.closeSheet("filterSheet");
      if (e.target.closest("[data-apply-filter]")) { FixUP.UI.closeSheet("filterSheet"); FixUP.UI.toast("Filters applied", "filter"); }
    });
  }

  function boot() {
    FixUP.Store.init();
    FixUP.Router.init(document.getElementById("viewport"));
    renderStatusbar();
    setInterval(renderStatusbar, 30000);
    wireBottomNav();
    wireFilterSheet();

    const s = FixUP.Store.get();
    if (!s.onboarded) {
      FixUP.Router.replaceStack("splash");
    } else {
      FixUP.Router.replaceStack(DEFAULT_HOME[s.role]);
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
