/*
  Impact estimate methodology:
  Per-category kg-of-e-waste-avoided and kg-CO2-avoided figures are rough
  averages derived from published EPA / EU e-waste report category weights
  and typical embodied-carbon-of-manufacture figures for a replacement unit.
  These are illustrative estimates for a prototype, not a precise LCA model —
  shown transparently on the Impact screen via "How we calculate this".
*/
window.FixUP = window.FixUP || {};

window.FixUP.impactFactors = {
  phone:        { label: "Phone",           ewasteKg: 0.2,  co2Kg: 55,  treesPerCo2: 21 },
  laptop:       { label: "Laptop",          ewasteKg: 2.5,  co2Kg: 210, treesPerCo2: 21 },
  fridge:       { label: "Refrigerator",    ewasteKg: 45,   co2Kg: 450, treesPerCo2: 21 },
  washer:       { label: "Washing machine", ewasteKg: 55,   co2Kg: 390, treesPerCo2: 21 },
  tv:           { label: "Television",      ewasteKg: 12,   co2Kg: 310, treesPerCo2: 21 },
  garment:      { label: "Garment",         ewasteKg: 0.4,  co2Kg: 22,  treesPerCo2: 21 },
  vehicle:      { label: "Vehicle part",    ewasteKg: 8,    co2Kg: 140, treesPerCo2: 21 },
  other:        { label: "Other item",      ewasteKg: 3,    co2Kg: 60,  treesPerCo2: 21 }
};

// Roughly: 1 mature tree absorbs ~21kg CO2/year — used to translate CO2 into a relatable "trees" unit.
window.FixUP.co2ToTrees = (co2Kg) => co2Kg / 21;
