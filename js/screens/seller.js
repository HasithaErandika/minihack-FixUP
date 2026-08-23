/* Seller screens: listings, post listing, orders, marketplace insights. */
(function () {
  const R = FixUP.Router, UI = FixUP.UI, L = FixUP.Layout, A = FixUP.Actions, icon = UI.icon, empty = FixUP._emptyState;

  R.register("listings", (el) => {
    const s = FixUP.Store.get();
    const mine = s.listings.filter(l => l.sellerId === s.users.seller.id);
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="u-flex u-justify-between u-items-center" style="margin-bottom:var(--sp-4)">
          <div><div class="text-small text-muted">${s.users.seller.businessName}</div><div class="text-h1">Your listings</div></div>
          <button class="btn-icon" data-go="notifications">${icon('bell')}${UI.notifBadge(s.notifications.filter(n => !n.read).length)}</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--sp-2);margin-bottom:var(--sp-6)">
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${mine.length}</div><div class="text-micro text-muted">active</div></div>
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${mine.filter(l=>l.stock<10).length}</div><div class="text-micro text-muted">low stock</div></div>
          <div class="card" style="text-align:center;padding:12px"><div class="text-h2 tabular">${s.orders.filter(o=>o.status==='pending').length}</div><div class="text-micro text-muted">pending</div></div>
        </div>
        <div class="u-flex-col u-gap-2">${mine.map(sellerListingCard).join("") || empty("box", "No listings yet", "Post your first part to reach technicians nearby.")}</div>
      </div>`;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => R.go(b.dataset.go));
    el.querySelectorAll("[data-open]").forEach(b => b.onclick = () => R.go("partDetail", { id: b.dataset.open }));
  });
  function sellerListingCard(l) {
    return `<button class="card card--pressable u-flex u-items-center u-gap-3" style="width:100%;text-align:left" data-open="${l.id}">
      <span style="width:48px;height:48px;border-radius:14px;background:var(--sky);color:var(--indigo);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${icon('box')}</span>
      <span style="flex:1"><div class="text-small" style="font-weight:700">${l.title}</div><div class="text-micro text-muted" style="text-transform:none;letter-spacing:0">${l.category} · ${l.stock} in stock</div></span>
      <span class="text-body tabular" style="font-weight:700">${FixUP.fmt.money(l.price)}</span>
    </button>`;
  }

  R.register("postListing", (el) => {
    el.innerHTML = `
      ${L.topbar("New listing", { back: true })}
      <div style="padding:0 var(--sp-4)">
        <div class="upload-grid" style="margin-bottom:var(--sp-4)">${[1,2,3].map(() => `<div class="upload-tile">${icon('camera')}</div>`).join("")}</div>
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
    return `<div class="card">
      <div class="u-flex u-justify-between u-items-center" style="margin-bottom:6px">
        <span class="text-small" style="font-weight:700">${o.listingTitle}</span>
        <span class="status-badge status-badge--${cls}">${o.status}</span>
      </div>
      <div class="text-micro text-muted" style="text-transform:none;letter-spacing:0;margin-bottom:${o.status === 'pending' ? '10px' : '0'}">${o.buyerName} · Qty ${o.quantity} · ${FixUP.fmt.timeAgo(o.createdAt)}</div>
      ${o.status === "pending" ? `<button class="btn btn-secondary btn-sm btn-block" data-fulfill="${o.id}">Mark fulfilled</button>` : ""}
    </div>`;
  }

  R.register("insights", (el) => {
    const s = FixUP.Store.get();
    const u = s.users.seller;
    const top = [...s.listings].filter(l=>l.sellerId===u.id).slice(0,3);
    const bars = [3200, 5400, 4100, 8200, 6900, 7600, 9100];
    const max = Math.max(...bars);
    el.innerHTML = `
      <div style="padding:var(--sp-6) var(--sp-4) 0;">
        <div class="text-h1" style="margin-bottom:var(--sp-4)">Marketplace Insights</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3);margin-bottom:var(--sp-4)">
          <div class="card"><div class="text-micro text-muted">This month</div><div class="text-h2 tabular">${FixUP.fmt.money(u.salesSummary.thisMonth)}</div></div>
          <div class="card"><div class="text-micro text-muted">Orders fulfilled</div><div class="text-h2 tabular">${u.salesSummary.ordersFulfilled}</div></div>
        </div>
        <div class="card" style="margin-bottom:var(--sp-4)">
          <div class="text-small" style="font-weight:700;margin-bottom:12px">Revenue — last 7 days</div>
          <div style="display:flex;align-items:flex-end;gap:8px;height:90px;">
            ${bars.map(v => `<div style="flex:1;background:var(--mid-blue);border-radius:6px 6px 0 0;height:${(v/max)*76}px"></div>`).join("")}
          </div>
        </div>
        <div class="text-h2" style="margin-bottom:var(--sp-2)">Top-selling parts</div>
        <div class="u-flex-col u-gap-2" style="margin-bottom:var(--sp-4)">
          ${top.map(l => `<div class="card u-flex u-justify-between"><span class="text-small" style="font-weight:600">${l.title}</span><span class="text-small tabular">${FixUP.fmt.money(l.price)}</span></div>`).join("")}
        </div>
        <div class="card card--tint u-flex u-items-center u-justify-between">
          <span class="u-flex u-items-center u-gap-2"><span style="color:var(--deep-blue)">${icon('shield')}</span><span class="text-small" style="font-weight:700">Seller plan: Growth</span></span>
          <button class="text-small" style="color:var(--deep-blue);font-weight:700" data-manage>Manage</button>
        </div>
      </div>`;
    el.querySelector("[data-manage]").onclick = () => UI.toast("Seller subscription plans coming soon", "info");
  });
})();
