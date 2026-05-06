export const SKU_PART_CONFIG = {
  under_review: { label: "Under Review", cls: "badge-sku-review" },
  locked:       { label: "Locked",       cls: "badge-sku-locked" },
  excluded:     { label: "Excluded",     cls: "badge-sku-excluded" },
};

export const SKU_ROWS_INITIAL = [
  { id: "SKU-880021", brand: "Nestlé",   name: "Nescafé Gold Blend 200g",        cat: "Beverages",     origPrice: 128, sellPrice: 108, avgPsp: 99,  pppPrice: 95,   discRate: "8%",  partStatus: "under_review" },
  { id: "SKU-880022", brand: "Nestlé",   name: "Nescafé 3-in-1 Original 30pk",   cat: "Beverages",     origPrice: 68,  sellPrice: 62,  avgPsp: 58,  pppPrice: 55,   discRate: "8%",  partStatus: "under_review" },
  { id: "SKU-770031", brand: "Unilever", name: "Dove Body Lotion 400ml",          cat: "Personal Care", origPrice: 88,  sellPrice: 72,  avgPsp: 65,  pppPrice: null, discRate: "10%", partStatus: "under_review" },
  { id: "SKU-770032", brand: "Unilever", name: "Lipton Yellow Label Tea 100-bag", cat: "Beverages",     origPrice: 55,  sellPrice: 49,  avgPsp: 45,  pppPrice: null, discRate: "8%",  partStatus: "under_review" },
  { id: "SKU-660041", brand: "P&G",      name: "Pantene Pro-V Shampoo 750ml",     cat: "Personal Care", origPrice: 118, sellPrice: 99,  avgPsp: 90,  pppPrice: 88,   discRate: "12%", partStatus: "under_review" },
  { id: "SKU-660042", brand: "P&G",      name: "Ariel Liquid Detergent 3L",       cat: "Home Care",     origPrice: 148, sellPrice: 128, avgPsp: 118, pppPrice: null, discRate: "15%", partStatus: "under_review" },
  { id: "SKU-550051", brand: "Vitasoy",  name: "Vitasoy Original Soymilk 1L ×6", cat: "Beverages",     origPrice: 58,  sellPrice: 52,  avgPsp: 48,  pppPrice: null, discRate: "8%",  partStatus: "under_review" },
  { id: "SKU-550052", brand: "Vitasoy",  name: "Vitasoy Cocoa Malt 250ml ×24",   cat: "Beverages",     origPrice: 78,  sellPrice: 68,  avgPsp: 62,  pppPrice: 60,   discRate: "8%",  partStatus: "under_review" },
  { id: "SKU-440061", brand: "Kraft",    name: "Philadelphia Cream Cheese 250g",  cat: "Dairy",         origPrice: 46,  sellPrice: 42,  avgPsp: 38,  pppPrice: 36,   discRate: "5%",  partStatus: "under_review" },
  { id: "SKU-440062", brand: "Kraft",    name: "Heinz Tomato Ketchup 570g",       cat: "Condiments",    origPrice: 39,  sellPrice: 35,  avgPsp: 32,  pppPrice: null, discRate: "7%",  partStatus: "under_review" },
  { id: "SKU-330071", brand: "LG H&H",  name: "The History of Whoo Cream 60ml",  cat: "Beauty",        origPrice: 680, sellPrice: 598, avgPsp: 550, pppPrice: null, discRate: "12%", partStatus: "under_review" },
  { id: "SKU-330072", brand: "LG H&H",  name: "Belif True Cream Bomb 75ml",      cat: "Beauty",        origPrice: 320, sellPrice: 288, avgPsp: 265, pppPrice: 260,  discRate: "10%", partStatus: "under_review" },
];
