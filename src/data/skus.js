export const CAT_CODES = {
  'Beverages':     'AA11112730001',
  'Personal Care': 'AA11113200001',
  'Home Care':     'AA11113610001',
  'Dairy':         'AA11114200001',
  'Condiments':    'AA11114700001',
  'Beauty':        'AA11115200001',
  'Snacks':        'AA11116100001',
  'Health':        'AA11116500001',
  'Baby Care':     'AA11117200001',
  'Household':     'AA11117800001',
};

export const SKU_PART_CONFIG = {
  under_review: { label: "Under Review", cls: "badge-sku-review",    dotColor: "#FA8C16" },
  locked:       { label: "Locked",       cls: "badge-sku-locked",    dotColor: "#52C41A" },
  excluded:     { label: "Excluded",     cls: "badge-sku-excluded",  dotColor: "#F5222D" },
};

const _TEMPLATES = [
  // Beverages
  { brand: "Nestlé",       name: "Nescafé Gold Blend {s}",          cat: "Beverages",     base: 128, disc: "8%"  },
  { brand: "Nestlé",       name: "Nescafé 3-in-1 Original {s}",     cat: "Beverages",     base: 68,  disc: "8%"  },
  { brand: "Nestlé",       name: "Nestea Lemon Ice Tea {s}",         cat: "Beverages",     base: 42,  disc: "7%"  },
  { brand: "Unilever",     name: "Lipton Yellow Label Tea {s}",      cat: "Beverages",     base: 55,  disc: "8%"  },
  { brand: "Unilever",     name: "Lipton Green Tea {s}",             cat: "Beverages",     base: 48,  disc: "8%"  },
  { brand: "Vitasoy",      name: "Vitasoy Original Soymilk {s}",     cat: "Beverages",     base: 58,  disc: "8%"  },
  { brand: "Vitasoy",      name: "Vitasoy Cocoa Malt {s}",           cat: "Beverages",     base: 78,  disc: "8%"  },
  { brand: "Vitasoy",      name: "Vita Lemon Tea {s}",               cat: "Beverages",     base: 38,  disc: "6%"  },
  { brand: "Pokka",        name: "Pokka Jasmine Green Tea {s}",       cat: "Beverages",     base: 32,  disc: "6%"  },
  { brand: "Pokka",        name: "Pokka Lychee Tea {s}",              cat: "Beverages",     base: 32,  disc: "6%"  },
  { brand: "Coca-Cola",    name: "Coca-Cola Zero {s}",                cat: "Beverages",     base: 25,  disc: "5%"  },
  { brand: "Coca-Cola",    name: "Sprite {s}",                        cat: "Beverages",     base: 25,  disc: "5%"  },
  { brand: "Red Bull",     name: "Red Bull Energy Drink {s}",         cat: "Beverages",     base: 18,  disc: "5%"  },
  { brand: "Yeo's",        name: "Yeo's Chrysanthemum Tea {s}",       cat: "Beverages",     base: 28,  disc: "6%"  },
  { brand: "Minute Maid",  name: "Minute Maid Pulpy Orange {s}",      cat: "Beverages",     base: 22,  disc: "5%"  },
  // Personal Care
  { brand: "Unilever",     name: "Dove Body Lotion {s}",              cat: "Personal Care", base: 88,  disc: "10%" },
  { brand: "Unilever",     name: "Dove Shower Gel {s}",               cat: "Personal Care", base: 72,  disc: "10%" },
  { brand: "Unilever",     name: "Dove Shampoo {s}",                  cat: "Personal Care", base: 82,  disc: "10%" },
  { brand: "P&G",          name: "Pantene Pro-V Shampoo {s}",         cat: "Personal Care", base: 118, disc: "12%" },
  { brand: "P&G",          name: "Pantene Conditioner {s}",           cat: "Personal Care", base: 108, disc: "12%" },
  { brand: "P&G",          name: "Head & Shoulders Classic {s}",      cat: "Personal Care", base: 98,  disc: "10%" },
  { brand: "P&G",          name: "Oral-B Toothbrush {s}",             cat: "Personal Care", base: 62,  disc: "8%"  },
  { brand: "Colgate",      name: "Colgate Total Advanced {s}",        cat: "Personal Care", base: 38,  disc: "8%"  },
  { brand: "Colgate",      name: "Colgate Whitening Toothpaste {s}",  cat: "Personal Care", base: 42,  disc: "8%"  },
  { brand: "Nivea",        name: "Nivea Body Lotion {s}",             cat: "Personal Care", base: 72,  disc: "10%" },
  { brand: "Nivea",        name: "Nivea Men Face Wash {s}",           cat: "Personal Care", base: 68,  disc: "8%"  },
  // Home Care
  { brand: "P&G",          name: "Ariel Liquid Detergent {s}",        cat: "Home Care",     base: 148, disc: "15%" },
  { brand: "P&G",          name: "Fairy Dish Soap {s}",               cat: "Home Care",     base: 48,  disc: "10%" },
  { brand: "Unilever",     name: "Surf Excel Detergent {s}",          cat: "Home Care",     base: 88,  disc: "12%" },
  { brand: "Unilever",     name: "Comfort Fabric Softener {s}",       cat: "Home Care",     base: 68,  disc: "10%" },
  { brand: "SC Johnson",   name: "Pledge Multi-Surface {s}",          cat: "Home Care",     base: 58,  disc: "8%"  },
  { brand: "SC Johnson",   name: "Mr Muscle Kitchen Cleaner {s}",     cat: "Home Care",     base: 45,  disc: "8%"  },
  { brand: "Kao",          name: "Attack Laundry Detergent {s}",      cat: "Home Care",     base: 112, disc: "12%" },
  { brand: "Kao",          name: "Magiclean Floor Cleaner {s}",       cat: "Home Care",     base: 52,  disc: "8%"  },
  // Dairy
  { brand: "Kraft",        name: "Philadelphia Cream Cheese {s}",     cat: "Dairy",         base: 46,  disc: "5%"  },
  { brand: "Meiji",        name: "Meiji Fresh Milk {s}",              cat: "Dairy",         base: 32,  disc: "5%"  },
  { brand: "Meiji",        name: "Meiji Yogurt Drink {s}",            cat: "Dairy",         base: 28,  disc: "5%"  },
  { brand: "Yakult",       name: "Yakult Original {s}",               cat: "Dairy",         base: 22,  disc: "5%"  },
  { brand: "Danone",       name: "Activia Yogurt {s}",                cat: "Dairy",         base: 35,  disc: "6%"  },
  { brand: "Danone",       name: "Danone Fresh Milk {s}",             cat: "Dairy",         base: 28,  disc: "5%"  },
  // Condiments
  { brand: "Kraft",        name: "Heinz Tomato Ketchup {s}",          cat: "Condiments",    base: 39,  disc: "7%"  },
  { brand: "Lee Kum Kee",  name: "Lee Kum Kee Oyster Sauce {s}",      cat: "Condiments",    base: 42,  disc: "8%"  },
  { brand: "Lee Kum Kee",  name: "Lee Kum Kee Soy Sauce {s}",         cat: "Condiments",    base: 35,  disc: "7%"  },
  { brand: "Kikkoman",     name: "Kikkoman Soy Sauce {s}",            cat: "Condiments",    base: 48,  disc: "8%"  },
  { brand: "Tabasco",      name: "Tabasco Original Sauce {s}",        cat: "Condiments",    base: 52,  disc: "8%"  },
  // Beauty
  { brand: "LG H&H",       name: "The History of Whoo Cream {s}",     cat: "Beauty",        base: 680, disc: "12%" },
  { brand: "LG H&H",       name: "Belif True Cream Bomb {s}",         cat: "Beauty",        base: 320, disc: "10%" },
  { brand: "Innisfree",    name: "Innisfree Green Tea Serum {s}",      cat: "Beauty",        base: 188, disc: "10%" },
  { brand: "Innisfree",    name: "Innisfree Jeju Sunscreen {s}",       cat: "Beauty",        base: 148, disc: "10%" },
  { brand: "Laneige",      name: "Laneige Lip Sleeping Mask {s}",      cat: "Beauty",        base: 158, disc: "10%" },
  { brand: "Laneige",      name: "Laneige Water Sleeping Mask {s}",    cat: "Beauty",        base: 248, disc: "10%" },
  { brand: "COSRX",        name: "COSRX Snail Mucin Essence {s}",      cat: "Beauty",        base: 168, disc: "10%" },
  { brand: "COSRX",        name: "COSRX Salicylic Acid Toner {s}",     cat: "Beauty",        base: 138, disc: "10%" },
  // Snacks
  { brand: "Nestlé",       name: "KitKat {s}",                        cat: "Snacks",        base: 28,  disc: "6%"  },
  { brand: "Nestlé",       name: "Nestlé Milo Bar {s}",               cat: "Snacks",        base: 32,  disc: "6%"  },
  { brand: "P&G",          name: "Pringles Original {s}",             cat: "Snacks",        base: 38,  disc: "8%"  },
  { brand: "Lay's",        name: "Lay's Classic {s}",                 cat: "Snacks",        base: 22,  disc: "5%"  },
  { brand: "Lay's",        name: "Lay's Sour Cream {s}",              cat: "Snacks",        base: 22,  disc: "5%"  },
  { brand: "Oreo",         name: "Oreo Original {s}",                 cat: "Snacks",        base: 25,  disc: "6%"  },
  { brand: "Oreo",         name: "Oreo Golden {s}",                   cat: "Snacks",        base: 25,  disc: "6%"  },
  { brand: "Meiji",        name: "Meiji Melty Kiss {s}",              cat: "Snacks",        base: 45,  disc: "7%"  },
  // Health
  { brand: "Nestlé",       name: "Nestlé Boost High Protein {s}",     cat: "Health",        base: 98,  disc: "8%"  },
  { brand: "Abbott",       name: "Ensure Gold {s}",                   cat: "Health",        base: 228, disc: "8%"  },
  { brand: "Abbott",       name: "Pediasure Complete {s}",            cat: "Health",        base: 198, disc: "8%"  },
  { brand: "Centrum",      name: "Centrum Adults {s}",                cat: "Health",        base: 128, disc: "6%"  },
  { brand: "Centrum",      name: "Centrum Women {s}",                 cat: "Health",        base: 138, disc: "6%"  },
  { brand: "Blackmores",   name: "Blackmores Fish Oil {s}",           cat: "Health",        base: 168, disc: "8%"  },
  { brand: "Blackmores",   name: "Blackmores Vitamin C {s}",          cat: "Health",        base: 88,  disc: "6%"  },
  // Baby Care
  { brand: "P&G",          name: "Pampers Premium Care {s}",          cat: "Baby Care",     base: 188, disc: "10%" },
  { brand: "P&G",          name: "Pampers Active Baby {s}",           cat: "Baby Care",     base: 148, disc: "10%" },
  { brand: "Unilever",     name: "Dove Baby Wash {s}",                cat: "Baby Care",     base: 88,  disc: "8%"  },
  { brand: "Nestlé",       name: "NAN Optipro {s}",                   cat: "Baby Care",     base: 298, disc: "8%"  },
  { brand: "Abbott",       name: "Similac Gold {s}",                  cat: "Baby Care",     base: 328, disc: "8%"  },
  // Household
  { brand: "SC Johnson",   name: "Raid Insect Killer {s}",            cat: "Household",     base: 52,  disc: "8%"  },
  { brand: "SC Johnson",   name: "Glade Air Freshener {s}",           cat: "Household",     base: 48,  disc: "7%"  },
  { brand: "Energizer",    name: "Energizer AA Batteries {s}",        cat: "Household",     base: 45,  disc: "6%"  },
  { brand: "Energizer",    name: "Energizer AAA Batteries {s}",       cat: "Household",     base: 42,  disc: "6%"  },
  { brand: "3M",           name: "Scotch-Brite Sponge {s}",           cat: "Household",     base: 28,  disc: "5%"  },
  { brand: "3M",           name: "Scotch Magic Tape {s}",             cat: "Household",     base: 22,  disc: "5%"  },
];

const _SIZES = ["200g", "400ml", "750ml", "1L", "1.5L", "2L", "500ml", "250g", "1kg", "300g",
                "6-pack", "24-pack", "30pk", "48pk", "Family Pack", "Twin Pack", "Value Pack"];
const _DISC_RATES = ["5%","6%","7%","8%","10%","12%","15%"];

function _r(min, max) { return Math.floor(min + (max - min) * 0.618033); }

function _row(idx, tpl, size) {
  const orig  = tpl.base + _r(0, Math.round(tpl.base * 0.2));
  const sell  = Math.round(orig  * (1 - parseInt(tpl.disc) / 100 * 0.5));
  const avgP  = Math.round(sell  * 0.92);
  const ppp   = Math.round(avgP  * 0.95);
  const padId = String(idx + 1).padStart(3, '0');
  return {
    id:         `SKU-${100000 + idx * 317}`,
    brand:      tpl.brand,
    name:       tpl.name.replace('{s}', size),
    cat:        tpl.cat,
    origPrice:  orig,
    sellPrice:  sell,
    avgPsp:     avgP,
    pppPrice:   ppp,
    discRate:   tpl.disc,
    partStatus: 'under_review',
  };
}

export const SKU_ROWS_INITIAL = Array.from({ length: 200 }, (_, i) => {
  const tpl  = _TEMPLATES[i % _TEMPLATES.length];
  const size = _SIZES[i % _SIZES.length];
  return _row(i, tpl, size);
});
