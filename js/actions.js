/* Business-logic mutators shared across screens. */
window.FixUP = window.FixUP || {};

FixUP.Actions = (function () {
  const S = () => FixUP.Store.get();

  function currentUser() {
    const s = S();
    return s.users[s.role];
  }

  function switchRole(role) {
    FixUP.Store.set(s => { s.role = role; });
  }

  function completeOnboarding() {
    FixUP.Store.set(s => { s.onboarded = true; });
  }

  function markNotificationsRead() {
    FixUP.Store.set(s => { s.notifications.forEach(n => n.read = true); });
  }

  function toggleSaved(listKey, id) {
    FixUP.Store.set(s => {
      const u = s.users.consumer;
      const arr = u[listKey];
      const i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1); else arr.push(id);
    });
  }

  function sendMessage(conversationId, text) {
    FixUP.Store.set(s => {
      const c = s.conversations.find(c => c.id === conversationId);
      if (c) c.messages.push({ from: "me", text, at: Date.now() });
    });
  }

  function createRepairRequest(data) {
    let job;
    FixUP.Store.set(s => {
      job = {
        id: "j-" + Date.now(),
        consumerId: s.users.consumer.id,
        category: data.category,
        title: data.title,
        description: data.description,
        location: s.users.consumer.location,
        status: "matching",
        createdAt: Date.now(),
        timeline: [{ stage: "requested", at: Date.now() }]
      };
      s.jobs.unshift(job);
    });
    return job;
  }

  function confirmQuote(jobId, technicianId, amount) {
    FixUP.Store.set(s => {
      const job = s.jobs.find(j => j.id === jobId);
      job.technicianId = technicianId;
      job.status = "confirmed";
      job.quote = { amount, breakdown: [
        { label: "Diagnostic visit", amount: Math.round(amount * 0.1) },
        { label: "Parts", amount: Math.round(amount * 0.55) },
        { label: "Labour", amount: Math.round(amount * 0.35) }
      ]};
      job.timeline.push({ stage: "matched", at: Date.now() }, { stage: "confirmed", at: Date.now() });
    });
  }

  function advanceJob(jobId, stage) {
    FixUP.Store.set(s => {
      const job = s.jobs.find(j => j.id === jobId);
      job.status = stage;
      job.timeline.push({ stage, at: Date.now() });
    });
  }

  // Awards points to a role's impact profile, returns level-up info for the celebration animation.
  function awardPoints(role, points) {
    const s = S();
    const impact = s.users[role].impact;
    const before = FixUP.computeLevel(impact.points);
    let after;
    FixUP.Store.set(s2 => {
      s2.users[role].impact.points += points;
      after = FixUP.computeLevel(s2.users[role].impact.points);
    });
    return { before, after, leveledUp: after.levelIndex > before.levelIndex, pointsAwarded: points };
  }

  function completeJobWithRating(jobId, ratingData) {
    const s = S();
    const job = s.jobs.find(j => j.id === jobId);
    const factor = FixUP.impactFactors[job.category] || FixUP.impactFactors.other;
    const points = 120 + Math.round(Math.random() * 80);
    const techPoints = 150 + Math.round(Math.random() * 90);

    FixUP.Store.set(s2 => {
      const j = s2.jobs.find(j => j.id === jobId);
      j.status = "completed";
      j.rating = ratingData;
      j.timeline.push({ stage: "completed", at: Date.now() });

      const c = s2.users.consumer.impact;
      c.ewasteKg = +(c.ewasteKg + factor.ewasteKg).toFixed(1);
      c.co2Kg = Math.round(c.co2Kg + factor.co2Kg);
      c.treesEquivalent = +(c.treesEquivalent + factor.co2Kg / 21).toFixed(1);
      c.moneySaved = (c.moneySaved || 0) + Math.round((job.quote?.amount || 3000) * 0.6);
    });

    const consumerResult = awardPoints("consumer", points);
    const techResult = awardPoints("technician", techPoints);
    return { points, techPoints, consumerResult, techResult, factor };
  }

  function createListing(data) {
    FixUP.Store.set(s => {
      s.listings.unshift({
        id: "l-" + Date.now(),
        sellerId: s.users.seller.id,
        sellerName: s.users.seller.businessName,
        title: data.title,
        category: data.category,
        condition: data.condition,
        price: data.price,
        stock: data.stock,
        pointsDiscountable: true
      });
    });
  }

  function updateOrderStatus(orderId, status) {
    FixUP.Store.set(s => {
      const o = s.orders.find(o => o.id === orderId);
      if (o) o.status = status;
    });
  }

  function resetDemo() { FixUP.Store.reset(); }

  function subscribeToPlan(role, planName, price) {
    FixUP.Store.set(s => {
      const u = s.users[role];
      u.subscription = u.subscription || {};
      u.subscription.status = "active";
      u.subscription.plan = planName;
      u.subscription.price = price;
      if (role === "technician") u.subscription.freeJobsRemaining = 0;
    });
  }

  return {
    currentUser, switchRole, completeOnboarding, markNotificationsRead, toggleSaved,
    sendMessage, createRepairRequest, confirmQuote, advanceJob, awardPoints,
    completeJobWithRating, createListing, updateOrderStatus, resetDemo, subscribeToPlan
  };
})();
