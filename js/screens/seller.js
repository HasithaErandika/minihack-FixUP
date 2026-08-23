/* Seller screens: listings, post listing, orders, marketplace insights. */
(function () {
  const R = FixUP.Router, UI = FixUP.UI, L = FixUP.Layout, A = FixUP.Actions, icon = UI.icon, empty = FixUP._emptyState;

  R.register("listings", (el) => {
    const s = FixUP.Store.get();
    const u = s.users.seller;
    const mine = s.listings.filter(l => l.sellerId === u.id);
    const lowStock = mine.filter(l => l.stock < 10).length;
    const pending = s.orders.filter(o => o.status === "pending").length;
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="u-flex u-justify-between u-items-center" style="margin-bottom:var(--sp-4)">
          <div><div class="text-small text-muted">${u.businessName}</div><div class="text-h1">Your listings</div></div>
          <button class="btn-icon" data-go="notifications">${icon('bell')}${UI.notifBadge(s.notifications.filter(n => !n.read).length)}</button>
        </div>
        <div class="search-bar" style="margin-bottom:var(--sp-4)">${icon('search')}<input placeholder="Search your listings" data-search><button class="btn-icon" style="width:32px;height:32px" data-filter>${icon('filter')}</button></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--sp-2);margin-bottom:var(--sp-6)">
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${mine.length}</div><div class="text-micro text-muted">active</div></div>
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular" style="${lowStock ? 'color:var(--warning)' : ''}">${lowStock}</div><div class="text-micro text-muted">low stock</div></div>
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${pending}</div><div class="text-micro text-muted">pending</div></div>
        </div>
        <div class="u-flex-col u-gap-2">${mine.map(sellerListingCard).join("") || empty("box", "No listings yet", "Post your first part to reach technicians and consumers nearby.")}</div>
      </div>`;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => R.go(b.dataset.go));
    el.querySelectorAll("[data-open]").forEach(b => b.onclick = () => R.go("partDetail", { id: b.dataset.open }));
    el.querySelector("[data-filter]").onclick = () => UI.openSheet("filterSheet");
  });

  function sellerListingCard(l) {
    const low = l.stock < 10;
    return `<button class="card card--pressable u-flex u-items-center u-gap-3" style="width:100%;text-align:left" data-open="${l.id}">
      ${UI.categoryTile(l.category, 52)}
      <span style="flex:1;min-width:0">
        <div class="text-small" style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.title}</div>
        <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;margin-top:2px">${l.category} · ${l.condition}</div>
        <div style="margin-top:5px">${low ? `<span class="status-badge status-badge--progress">${l.stock} left</span>` : `<span class="status-badge status-badge--done">${l.stock} in stock</span>`}</div>
      </span>
      <span class="text-body tabular" style="font-weight:700;flex-shrink:0">${FixUP.fmt.money(l.price)}</span>
    </button>`;
  }

  R.register("postListing", (el) => {
    el.innerHTML = `
      ${L.topbar("New listing", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="upload-grid" style="margin-bottom:var(--sp-4)">${[1, 2, 3].map(() => `<div class="upload-tile">${icon('camera')}</div>`).join("")}</div>
        <div class="text-micro text-muted" style="margin:-8px 0 var(--sp-4);text-transform:none;letter-spacing:0">Clear photos help buyers trust a listing — add up to 6.</div>
        <div class="u-flex-col u-gap-4">
          <div class="field"><label>Title</label><input type="text" placeholder="e.g. Compressor start relay" data-title></div>
          <div class="field"><label>Category</label><select data-category><option>Electronics</option><option>Appliances</option><option>Vehicles</option><option>Garments</option></select></div>
          <div class="field"><label>Condition</label><select data-condition><option>New</option><option>Refurbished</option><option>Used</option><option>Salvaged</option></select></div>
          <div class="field"><label>Price (Rs.)</label><input type="number" placeholder="1200" data-price></div>
          <div class="field"><label>Stock quantity</label><input type="number" placeholder="10" data-stock></div>
        </div>
      </div>
      <div style="position:sticky;bottom:0;padding:var(--sp-3) var(--sp-4);background:var(--cream);"><button class="btn btn-primary btn-block" data-publish>Publish listing</button></div>`;
    el.querySelector("[data-nav-back]").onclick = () => R.back();
    el.querySelector("[data-publish]").onclick = (e) => {
      const title = el.querySelector("[data-title]").value || "Untitled part";
      e.target.classList.add("btn-loading");
      setTimeout(() => {
        A.createListing({
          title, category: el.querySelector("[data-category]").value, condition: el.querySelector("[data-condition]").value,
          price: +el.querySelector("[data-price]").value || 1000, stock: +el.querySelector("[data-stock]").value || 1
        });
        UI.toast("Listing published", "checkCircle");
        R.replaceStack("listings");
      }, 600);
    };
  });

  R.register("orders", (el) => {
    const s = FixUP.Store.get();
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="text-h1" style="margin-bottom:var(--sp-4)">Orders</div>
        <div class="u-flex-col u-gap-2">${s.orders.map(orderRow).join("") || empty("briefcase", "No orders yet", "Orders from technicians and consumers will show here.")}</div>
      </div>`;
    el.querySelectorAll("[data-fulfill]").forEach(b => b.onclick = () => { A.updateOrderStatus(b.dataset.fulfill, "fulfilled"); R.go("orders"); UI.toast("Order marked fulfilled", "checkCircle"); });
  });

  function orderRow(o) {
    const cls = { pending: "progress", shipped: "open", fulfilled: "done" }[o.status];
    const buyerIcon = o.buyerType === "technician" ? "wrench" : "user";
    const buyerLabel = o.buyerType === "technician" ? "Technician" : "Consumer";
    return `<div class="card">
      <div class="u-flex u-justify-between u-items-center" style="margin-bottom:8px">
        <span class="text-small" style="font-weight:700">${o.listingTitle}</span>
        <span class="status-badge status-badge--${cls}">${o.status}</span>
      </div>
      <div class="u-flex u-items-center u-gap-2" style="margin-bottom:${o.status === 'pending' ? '10px' : '0'}">
        <span class="chip chip--outline" style="padding:3px 9px;font-size:10.5px"><span style="width:11px;height:11px;display:inline-flex;vertical-align:-2px;margin-right:3px">${icon(buyerIcon)}</span>${buyerLabel}</span>
        <span class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${o.buyerName} · Qty ${o.quantity} · ${FixUP.fmt.timeAgo(o.createdAt)}</span>
      </div>
      ${o.status === "pending" ? `<button class="btn btn-secondary btn-sm btn-block" data-fulfill="${o.id}">Mark fulfilled</button>` : ""}
    </div>`;
  }

  R.register("insights", (el) => {
    const s = FixUP.Store.get();
    const u = s.users.seller;
    const sum = Object.assign({ growthPct: 0, avgOrderValue: 0, buyerSplit: { technician: 0, consumer: 0 }, categorySplit: [] }, u.salesSummary);
    const top = [...s.listings].filter(l => l.sellerId === u.id).slice(0, 3);
    const bars = [3200, 5400, 4100, 8200, 6900, 7600, 9100];
    const max = Math.max(...bars);
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="text-h1" style="margin-bottom:var(--sp-4)">Marketplace Insights</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3);margin-bottom:var(--sp-3)">
          <div class="card">
            <div class="text-micro text-muted">This month</div>
            <div class="text-h2 tabular">${FixUP.fmt.money(sum.thisMonth)}</div>
            <div class="u-flex u-items-center u-gap-1" style="margin-top:4px;color:var(--success)"><span style="width:13px;height:13px;display:inline-flex">${icon('chart')}</span><span class="text-micro" style="text-transform:none;letter-spacing:0;font-weight:700">+${sum.growthPct}% vs last month</span></div>
          </div>
          <div class="card"><div class="text-micro text-muted">Avg order value</div><div class="text-h2 tabular">${FixUP.fmt.money(sum.avgOrderValue)}</div></div>
        </div>

        <div class="card" style="margin-bottom:var(--sp-4)">
          <div class="text-small" style="font-weight:700;margin-bottom:12px">Revenue — last 7 days</div>
          <div style="display:flex;align-items:flex-end;gap:8px;height:90px;">
            ${bars.map(v => `<div style="flex:1;background:var(--mid-blue);border-radius:6px 6px 0 0;height:${(v / max) * 76}px"></div>`).join("")}
          </div>
        </div>

        <div class="text-h2" style="margin-bottom:var(--sp-2)">Who's buying</div>
        <div class="card" style="margin-bottom:var(--sp-4)">
          <div class="u-flex u-items-center u-justify-between" style="margin-bottom:6px"><span class="text-small" style="font-weight:600"><span style="width:14px;height:14px;display:inline-flex;vertical-align:-2px;margin-right:4px;color:var(--deep-blue)">${icon('wrench')}</span>Technicians</span><span class="text-small tabular" style="font-weight:700">${sum.buyerSplit.technician}%</span></div>
          <div class="progress-bar" style="margin-bottom:12px"><div class="progress-bar__fill" style="width:${sum.buyerSplit.technician}%"></div></div>
          <div class="u-flex u-items-center u-justify-between" style="margin-bottom:6px"><span class="text-small" style="font-weight:600"><span style="width:14px;height:14px;display:inline-flex;vertical-align:-2px;margin-right:4px;color:var(--deep-blue)">${icon('user')}</span>Consumers</span><span class="text-small tabular" style="font-weight:700">${sum.buyerSplit.consumer}%</span></div>
          <div class="progress-bar"><div class="progress-bar__fill" style="width:${sum.buyerSplit.consumer}%"></div></div>
        </div>

        <div class="text-h2" style="margin-bottom:var(--sp-2)">Sales by category</div>
        <div class="card" style="margin-bottom:var(--sp-4)">
          ${sum.categorySplit.map((c, i) => `
            <div style="${i > 0 ? 'margin-top:12px' : ''}">
              <div class="u-flex u-justify-between" style="margin-bottom:6px"><span class="text-small" style="font-weight:600">${c.label}</span><span class="text-small tabular text-muted">${c.pct}%</span></div>
              <div class="progress-bar"><div class="progress-bar__fill" style="width:${c.pct}%;background:var(--sky)"></div></div>
            </div>`).join("")}
        </div>

        <div class="text-h2" style="margin-bottom:var(--sp-2)">Top-selling parts</div>
        <div class="u-flex-col u-gap-2" style="margin-bottom:var(--sp-4)">
          ${top.map(l => `<div class="card u-flex u-items-center u-gap-3">${UI.categoryTile(l.category, 36)}<span class="text-small" style="font-weight:600;flex:1">${l.title}</span><span class="text-small tabular" style="font-weight:700">${FixUP.fmt.money(l.price)}</span></div>`).join("")}
        </div>

        <button class="card card--tint card--pressable u-flex u-items-center u-justify-between" style="width:100%" data-go="subscription">
          <span class="u-flex u-items-center u-gap-2"><span style="color:var(--deep-blue)">${icon('shield')}</span><span class="text-small" style="font-weight:700">Seller plan: ${u.subscription.plan}</span></span>
          <span class="u-flex u-items-center u-gap-1" style="color:var(--deep-blue);font-weight:700"><span class="text-small">Manage</span>${icon('chevronRight')}</span>
        </button>
      </div>`;
    el.querySelector("[data-go]").onclick = () => R.go("subscription");
  });
})();
