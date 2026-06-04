/**
 * Seed Script — Dorm Care v2
 *
 * Creates realistic dummy data for demo/presentation:
 * - 40 users with Indonesian names & realistic emails
 * - ~65% users have orders (max 4 per user, min 5-day gaps)
 * - Revenue 4-5 million rupiah
 * - Date range: 14 April - 31 May 2026
 * - Only "completed" and "cancelled" statuses
 * - Times avoid multiples of 5/10 minutes
 * - Most orders on affordable services; expensive ones get few/none
 *
 * SAFETY: Only deletes previous seed data (test users), NOT real users.
 * Previous test users identified by email pattern: user##@dormcare.test
 * New test users identified by realistic email patterns.
 *
 * Usage: node scripts/seed-data.cjs
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://jnxpjjbotcipauflkkch.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueHBqamJvdGNpcGF1Zmxra2NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwOTcxMSwiZXhwIjoyMDkxNjg1NzExfQ.20vwSMD6yzxp1UZG15voVrwfJfefzcXKcQsEJ-Ebe-Y";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ────────────────────────────────
// SERVICE PRICING
// ────────────────────────────────
const SERVICES = [
  { id: "svc-basic-clean",      name: "Basic Clean",         price: 20000 },
  { id: "svc-pro-basic-clean",  name: "Pro Basic Clean",     price: 35000 },
  { id: "svc-fan-clean",        name: "Pembersihan Kipas",   price: 7000  },
  { id: "svc-laundry-5",        name: "Jasa Laundry (5 km)", price: 15000 },
  { id: "svc-deep-clean",       name: "Deep Clean",          price: 50000 },
  { id: "svc-extra-deep-clean", name: "Extra Deep Clean",    price: 63000 },
  { id: "svc-laundry-10",       name: "Jasa Laundry (10 km)",price: 30000 },
  { id: "pkg-sahabat-manis",    name: "Sahabat Manis",       price: 38000 },
  { id: "pkg-sahabat-akrab",    name: "Sahabat Akrab",       price: 68000 },
  { id: "svc-special-clean-5",  name: "Special Clean (5 km)",price: 78000 },
  { id: "svc-special-clean-10", name: "Special Clean (10 km)",price: 93000},
  { id: "pkg-soulmate",         name: "Soulmate",            price: 100000 },
  { id: "pkg-chemistry",        name: "Chemistry",           price: 120000 },
  { id: "pkg-kasih-sayang-5",   name: "Kasih Sayang (5 km)",price: 150000 },
  { id: "pkg-kasih-sayang-10",  name: "Kasih Sayang (10 km)",price: 180000},
];

// Weighted probability — bias to mid-tier for 4-5M revenue target
const SERVICE_WEIGHTS = [
  8,   // Basic Clean (20K)
  14,  // Pro Basic Clean (35K)
  1,   // Fan Clean (7K)
  6,   // Laundry 5km (15K)
  22,  // Deep Clean (50K)
  16,  // Extra Deep Clean (63K)
  4,   // Laundry 10km (30K)
  12,  // Sahabat Manis (38K)
  8,   // Sahabat Akrab (68K)
  5,   // Special Clean 5km (78K)
  3,   // Special Clean 10km (93K)
  1,   // Soulmate (100K)
  0,   // Chemistry
  0,   // Kasih Sayang 5km
  0,   // Kasih Sayang 10km
];

// ────────────────────────────────
// USERS with realistic emails
// ────────────────────────────────
const USERS = [
  // [firstName, lastName, gender, birthYear, area, phone, email]
  ["Ahmad",   "Fauzi",      "L", 2000, "Sukolilo",    "08123001001", "ahmadfauzi15@gmail.com"],
  ["Anisa",   "Rahmawati",  "P", 2001, "Keputih",     "08123001002", "anisarahma01@gmail.com"],
  ["Budi",    "Santoso",    "L", 1998, "Gebang",      "08123001003", "budisantoso98@gmail.com"],
  ["Bella",   "Permata",    "P", 2002, "Manyar",      "08123001004", "bellaprmt22@gmail.com"],
  ["Rizky",   "Pratama",    "L", 1999, "Mulyosari",   "08123001005", "rizkypratama99@gmail.com"],
  ["Citra",   "Dewi",       "P", 2000, "Menur",       "08123001006", "citradewi20@gmail.com"],
  ["Dimas",   "Ardiansyah", "L", 2001, "Nginden",     "08123001007", "dimasard01@gmail.com"],
  ["Dewi",    "Lestari",    "P", 1997, "Semolowaru",  "08123001008", "dewilestari97@gmail.com"],
  ["Fajar",   "Nugroho",    "L", 2002, "Klampis",     "08123001009", "fajarnugroho02@gmail.com"],
  ["Eka",     "Putri",      "P", 2003, "Medokan",     "08123001010", "ekaputri0304@gmail.com"],
  ["Aditya",  "Kurniawan",  "L", 1996, "Sukolilo",    "08123001011", "adityakurniawan96@gmail.com"],
  ["Fitri",   "Handayani",  "P", 2001, "Keputih",     "08123001012", "fitrihandayani@gmail.com"],
  ["Bagas",   "Wijaya",     "L", 2000, "Gebang",      "08123001013", "bagaswijaya00@gmail.com"],
  ["Gita",    "Nurhaliza",  "P", 1998, "Manyar",      "08123001014", "gitanurhaliza98@gmail.com"],
  ["Hendra",  "Setiawan",   "L", 1999, "Mulyosari",   "08123001015", "hendrasetiawan@gmail.com"],
  ["Hana",    "Maulida",    "P", 2002, "Menur",       "08123001016", "hanamaulida02@gmail.com"],
  ["Irfan",   "Hakim",      "L", 2003, "Nginden",     "08123001017", "irfanhakim03@gmail.com"],
  ["Intan",   "Saraswati",  "P", 2001, "Semolowaru",  "08123001018", "intansaras01@gmail.com"],
  ["Kevin",   "Gunawan",    "L", 1997, "Klampis",     "08123001019", "kevingunawan97@gmail.com"],
  ["Kartika", "Sari",       "P", 2000, "Medokan",     "08123001020", "kartikasari00@gmail.com"],
  ["Lukman",  "Hidayat",    "L", 1995, "Sukolilo",    "08123001021", "lukmanhidayat95@gmail.com"],
  ["Maya",    "Indah",      "P", 2004, "Keputih",     "08123001022", "mayaindah04@gmail.com"],
  ["Nanda",   "Saputra",    "L", 1998, "Gebang",      "08123001023", "nandasaputra98@gmail.com"],
  ["Nissa",   "Aulia",      "P", 2002, "Manyar",      "08123001024", "nissaaulia02@gmail.com"],
  ["Okta",    "Ramadhan",   "L", 2001, "Mulyosari",   "08123001025", "oktaramadhan21@gmail.com"],
  ["Putri",   "Wulandari",  "P", 1996, "Menur",       "08123001026", "putriwulan96@gmail.com"],
  ["Reza",    "Mahendra",   "L", 2003, "Nginden",     "08123001027", "rezamahendra03@gmail.com"],
  ["Rahma",   "Fadhilah",   "P", 2000, "Semolowaru",  "08123001028", "rahmafadhilah@gmail.com"],
  ["Satria",  "Wibowo",     "L", 1999, "Klampis",     "08123001029", "satriawibowo99@gmail.com"],
  ["Sari",    "Yulianti",   "P", 2002, "Medokan",     "08123001030", "sariyulianti02@gmail.com"],
  ["Teguh",   "Prasetyo",   "L", 2005, "Sukolilo",    "08123001031", "teguhprasetyo05@gmail.com"],
  ["Tari",    "Anggraini",  "P", 2001, "Keputih",     "08123001032", "tarianggraini01@gmail.com"],
  ["Umar",    "Bakri",      "L", 2000, "Gebang",      "08123001033", "umarbakri00@gmail.com"],
  ["Wulan",   "Kusuma",     "P", 1997, "Manyar",      "08123001034", "wulankusuma97@gmail.com"],
  ["Wisnu",   "Adinata",    "L", 2002, "Mulyosari",   "08123001035", "wisnuadinata02@gmail.com"],
  ["Yuni",    "Rahayu",     "P", 2003, "Menur",       "08123001036", "yunirahayu03@gmail.com"],
  ["Yoga",    "Pangestu",   "L", 1999, "Nginden",     "08123001037", "yogapangestu99@gmail.com"],
  ["Zaskia",  "Amira",      "P", 2001, "Semolowaru",  "08123001038", "zaskiaamira01@gmail.com"],
  ["Zaki",    "Alamsyah",   "L", 2004, "Klampis",     "08123001039", "zakialamsyah04@gmail.com"],
  ["Dina",    "Oktaviani",  "P", 1996, "Medokan",     "08123001040", "dinaoktaviani96@gmail.com"],
];

// ────────────────────────────────
// ORDER DISTRIBUTION (max 4 per user)
// ────────────────────────────────
// 13 users with 4 orders = 52
// 8 users with 3 orders = 24
// 5 users with 2 orders = 10
// 3 users with 1 order  = 3
// 11 users with 0 orders = 0
// Total: 29 users with orders (72.5%), 89 orders
// Target avg ~47K = 89 * 47k ≈ 4.18M (after promo discounts ≈ 4.05M)

// 29 users with orders (72.5%), 11 without (27.5%)
// Target: ~100 orders, avg ~47K, revenue ~4.0-4.5M after promos
const ORDER_COUNTS = [
  // [userIndex, numOrders]
  [0, 4],  [1, 3],  [2, 2],  [3, 1],
  [4, 4],  [5, 3],  [6, 2],
  [8, 4],  [9, 4],  [10, 4],
  [11, 3], [12, 2], [13, 4],
  [14, 4], [16, 3], [17, 4],
  [18, 2], [20, 4], [21, 4],
  [22, 4], [23, 3], [24, 2],
  [25, 1], [26, 4], [28, 4],
  [29, 3], [31, 4], [32, 2],
  [33, 3], [35, 3],
];
// 29 entries: 10×4 + 8×3 + 5×2 + 3×1 + 3×0 = 40+24+10+3=77 base + tuning

const ADDRESSES = [
  "Jl. Sukolilo No. 12, Kos Biru",
  "Jl. Keputih 3A No. 5",
  "Kos Pak RT, Gebang Kidul",
  "Jl. Manyar Permai No. 22",
  "Kos Hijau, Mulyosari",
  "Jl. Menur Pumpungan No. 8",
  "Kos Bunga, Nginden",
  "Jl. Semolowaru No. 15",
  "Klampis Asri Blok C-3",
  "Medokan Ayu No. 7",
  "Jl. Sukolilo Lor No. 45",
  "Keputih Timur 2A No. 17",
  "Gebang Lor No. 33",
  "Manyar Jaya No. 10",
  "Mulyosari Utara No. 4",
  "Menur Jaya No. 2",
  "Nginden Baru No. 19",
  "Semolowaru Indah No. 21",
  "Klampis Ngasem No. 14",
  "Medokan Semampir No. 9",
];

const NOTES_POOL = [
  null, null, null, null, null,
  "Tolong fokus kamar mandi ya",
  "Kunci kos bisa ambil di ibu kos",
  "Di belakang ada pintu alternatif",
  "Jangan lupa sudut lemari juga",
  "Kos samping kantin biru",
  "Ruang tamu juga ya",
  "Ada kucing, hati-hati keluar",
  "Lantai 2, belok kanan",
  null, null, null, null,
];

// ────────────────────────────────
// HELPERS
// ────────────────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Time avoiding multiples of 5 and 10
const VALID_MINUTES = [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44, 46, 47, 48, 49, 51, 52, 53, 54, 56, 57, 58, 59];
const VALID_HOURS = [7, 8, 9, 10, 11, 13, 14, 15, 16, 17];

function generateTime() {
  const hour = pick(VALID_HOURS);
  const minute = pick(VALID_MINUTES);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function generateDate(minDate, maxDate) {
  const start = new Date(minDate);
  const end = new Date(maxDate);
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const offset = rand(0, days);
  const d = new Date(start);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

// Generate spaced-apart dates (min 5 days gap)
function generateSpacedDates(numDates, rangeStart, rangeEnd) {
  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

  if (numDates <= 0) return [];
  if (numDates === 1) {
    const offset = rand(0, totalDays);
    const d = new Date(start);
    d.setDate(d.getDate() + offset);
    return [d.toISOString().split("T")[0]];
  }

  // Divide total range into numDates segments, pick one date per segment
  // This guarantees even spacing
  const dates = [];
  const segmentSize = Math.floor(totalDays / numDates);

  for (let i = 0; i < numDates; i++) {
    const segStart = i * segmentSize;
    const segEnd = Math.min((i + 1) * segmentSize - 1, totalDays);
    const margin = Math.min(2, Math.floor((segEnd - segStart) / 3));
    const offset = rand(segStart + margin, Math.max(segStart + margin, segEnd - margin));
    const d = new Date(start);
    d.setDate(d.getDate() + Math.min(offset, totalDays));

    if (d <= end) {
      dates.push(d.toISOString().split("T")[0]);
    }
  }

  // Ensure minimum 5-day gaps by adjusting
  const result = [];
  for (const dateStr of dates) {
    const d = new Date(dateStr);
    const tooClose = result.some(existing => {
      const diff = Math.abs((d - new Date(existing)) / (1000 * 60 * 60 * 24));
      return diff < 5;
    });
    if (!tooClose && d <= end && d >= start) {
      result.push(dateStr);
    }
  }

  result.sort();
  return result;
}

function generateOrderNumber(idx) {
  return `DC-${String(idx).padStart(5, "0")}`;
}

// ────────────────────────────────
// MAIN SEED FUNCTION
// ────────────────────────────────
async function seed() {
  console.log("=== DORM CARE SEED DATA SCRIPT v2 ===\n");

  // ── Step 1: Delete previous test data ──
  console.log("Step 1: Clearing previous test data...");

  // Find both old test users (user##@dormcare.test) and new ones (the emails we're about to create)
  const seedEmails = new Set(USERS.map(u => u[6]));
  const { data: existingUsersList } = await supabase.auth.admin.listUsers({ perPage: 500 });
  const testUsers = (existingUsersList?.users || []).filter(u =>
    u.email?.match(/^user\d+@dormcare\.test$/) || seedEmails.has(u.email)
  );

  console.log(`  Found ${testUsers.length} previous test users`);

  for (const u of testUsers) {
    await supabase.from("orders").delete().eq("user_id", u.id);
    await supabase.from("profiles").delete().eq("id", u.id);
    await supabase.auth.admin.deleteUser(u.id);
  }

  if (testUsers.length > 0) console.log("  Previous test data cleared.\n");

  // ── Step 2: Create users ──
  console.log("Step 2: Creating users...");
  const createdUsers = [];

  const { data: allUsersNow } = await supabase.auth.admin.listUsers({ perPage: 500 });
  const existingEmails = new Set((allUsersNow?.users || []).map(u => u.email));

  for (let i = 0; i < USERS.length; i++) {
    const [first, last, gender, birthYear, area, phone, email] = USERS[i];

    if (existingEmails.has(email)) {
      console.log(`  [${i + 1}/${USERS.length}] ${email} already exists, skipping...`);
      const existing = allUsersNow.users.find(u => u.email === email);
      if (existing) {
        createdUsers.push({ id: existing.id, first, last, gender, birthYear, area, phone, email });
      }
      continue;
    }

    let attempt = 0;
    let success = false;
    while (attempt < 3 && !success) {
      attempt++;
      try {
        const { data: authUser, error } = await supabase.auth.admin.createUser({
          email,
          password: "password123",
          email_confirm: true,
          user_metadata: { first_name: first, last_name: last, birth_year: birthYear, gender },
        });

        if (error) {
          if (error.message?.includes("already been registered") || error.status === 422) {
            const { data: existing } = await supabase.auth.admin.listUsers({ perPage: 500 });
            const found = existing?.users?.find(u => u.email === email);
            if (found) {
              createdUsers.push({ id: found.id, first, last, gender, birthYear, area, phone, email });
              success = true; break;
            }
          }
          console.error(`  Error creating ${email}: ${error.message}`);
          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        createdUsers.push({ id: authUser.user.id, first, last, gender, birthYear, area, phone, email });
        success = true;
      } catch (err) {
        console.error(`  Exception: ${err.message}`);
        await new Promise(r => setTimeout(r, 500));
      }
    }

    if (!success) console.error(`  FAILED: ${email}`);

    if (i % 5 === 4) {
      console.log(`  Created ${i + 1}/${USERS.length} users...`);
      await new Promise(r => setTimeout(r, 800));
    }
  }

  console.log(`  Total users created: ${createdUsers.length}/${USERS.length}`);

  // ── Step 3: Create profiles ──
  console.log("\nStep 3: Creating profiles...");
  let profilesCreated = 0;
  for (const user of createdUsers) {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: user.first,
      last_name: user.last,
      phone: user.phone,
      member_level: "bronze",
      total_orders: 0,
      total_spent: 0,
      role: "user",
    }, { onConflict: "id" });

    if (!error) profilesCreated++;
    else console.error(`  Profile error for ${user.first}: ${error.message}`);
  }
  console.log(`  Profiles created: ${profilesCreated}`);

  // ── Step 4: Generate orders ──
  console.log("\nStep 4: Generating orders...");

  const allOrders = [];
  let orderCounter = 1;
  let totalRevenue = 0;
  const RANGE_START = "2026-04-14";
  const RANGE_END = "2026-05-31";

  function createOrder(userId, userIdx, scheduledDate) {
    const userData = createdUsers[userIdx];
    const service = weightedPick(SERVICES, SERVICE_WEIGHTS);
    const time = generateTime();
    const address = pick(ADDRESSES);
    const notes = pick(NOTES_POOL);

    // 85% completed, 15% cancelled
    const status = Math.random() < 0.85 ? "completed" : "cancelled";

    let promoCode = null;
    let discountAmount = 0;
    if (Math.random() < 0.12 && service.price >= 35000) {
      const discount = Math.floor(service.price * 0.12);
      promoCode = "DORMCARE15";
      discountAmount = discount;
    }

    const total = Math.max(0, service.price - discountAmount);

    return {
      order_number: generateOrderNumber(orderCounter++),
      user_id: userId,
      service_id: null,
      service_name: service.name,
      service_price: service.price,
      address,
      area: userData.area,
      scheduled_date: scheduledDate,
      scheduled_time: time,
      notes,
      status,
      promo_code: promoCode,
      discount_amount: discountAmount,
      total_amount: total,
      rating: status === "completed" && Math.random() < 0.75 ? rand(3, 5) : null,
      review: null,
      created_at: `${scheduledDate}T${time}:${String(rand(0, 59)).padStart(2, "0")}.000Z`,
    };
  }

  for (const [userIdx, numOrders] of ORDER_COUNTS) {
    const userId = createdUsers[userIdx].id;
    const dates = generateSpacedDates(numOrders, RANGE_START, RANGE_END);

    for (const date of dates) {
      const order = createOrder(userId, userIdx, date);
      allOrders.push(order);
      if (order.status !== "cancelled") totalRevenue += order.total_amount;
    }
  }

  // Sort and re-number
  allOrders.sort((a, b) => a.created_at.localeCompare(b.created_at));
  allOrders.forEach((o, i) => { o.order_number = generateOrderNumber(i + 1); });

  const orderableUsers = ORDER_COUNTS.map(e => e[0]);

  // Tuning: add orders for users below cap if revenue < 4M
  const userOrderCounts = {};
  for (const o of allOrders) {
    userOrderCounts[o.user_id] = (userOrderCounts[o.user_id] || 0) + 1;
  }

  let tuneSafety = 0;
  while (totalRevenue < 4000000 && tuneSafety < 200) {
    tuneSafety++;
    // Find users with < 4 orders
    const eligible = orderableUsers.filter(idx => {
      const uid = createdUsers[idx].id;
      return (userOrderCounts[uid] || 0) < 4;
    });
    if (eligible.length === 0) break;

    const idx = pick(eligible);
    const userId = createdUsers[idx].id;
    const offset = rand(0, Math.floor((new Date(RANGE_END) - new Date(RANGE_START)) / (1000 * 60 * 60 * 24)));
    const d = new Date(RANGE_START);
    d.setDate(d.getDate() + offset);
    if (d > new Date(RANGE_END)) continue;

    const date = d.toISOString().split("T")[0];
    const order = createOrder(userId, idx, date);
    allOrders.push(order);
    userOrderCounts[userId] = (userOrderCounts[userId] || 0) + 1;
    if (order.status !== "cancelled") totalRevenue += order.total_amount;
  }

  // If still above 5M, remove some orders (not from users with only 1)
  tuneSafety = 0;
  while (totalRevenue > 5000000 && tuneSafety < 100) {
    tuneSafety++;
    const candidates = allOrders.filter(o => {
      const uid = o.user_id;
      const count = userOrderCounts[uid] || 0;
      return count > 1 && o.status !== "cancelled"; // don't remove last order of a user
    });
    if (candidates.length === 0) break;

    const idx = rand(0, candidates.length - 1);
    const removed = candidates[idx];
    const arrIdx = allOrders.indexOf(removed);
    if (arrIdx >= 0) {
      allOrders.splice(arrIdx, 1);
      userOrderCounts[removed.user_id]--;
      totalRevenue -= removed.total_amount;
    }
  }

  allOrders.sort((a, b) => a.created_at.localeCompare(b.created_at));
  allOrders.forEach((o, i) => { o.order_number = generateOrderNumber(i + 1); });

  console.log(`  Generated ${allOrders.length} orders`);
  console.log(`  Total revenue: Rp ${totalRevenue.toLocaleString("id-ID")}`);

  // ── Step 5: Insert orders ──
  console.log("\nStep 5: Inserting orders...");

  const BATCH_SIZE = 20;
  let insertedOrders = 0;

  for (let i = 0; i < allOrders.length; i += BATCH_SIZE) {
    const batch = allOrders.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("orders").insert(batch);

    if (error) {
      for (const order of batch) {
        const { error: singleErr } = await supabase.from("orders").insert(order);
        if (!singleErr) insertedOrders++;
        else console.error(`    Failed: ${order.order_number}`);
      }
    } else {
      insertedOrders += batch.length;
    }
    console.log(`  Inserted ${Math.min(i + BATCH_SIZE, allOrders.length)}/${allOrders.length} orders`);
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`  Total orders inserted: ${insertedOrders}`);

  // ── Step 6: Update profile stats ──
  console.log("\nStep 6: Updating profile stats...");

  let statsUpdated = 0;
  for (const user of createdUsers) {
    const { data: userOrders } = await supabase
      .from("orders")
      .select("total_amount, status")
      .eq("user_id", user.id);

    if (!userOrders || userOrders.length === 0) continue;

    const completedOrders = userOrders.filter(o => o.status === "completed");
    const totalSpent = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrders = userOrders.length;

    let memberLevel = "bronze";
    if (completedOrders.length >= 4 && totalSpent >= 180000) memberLevel = "silver";
    if (completedOrders.length >= 4 && totalSpent >= 350000) memberLevel = "gold";

    const { error } = await supabase
      .from("profiles")
      .update({ total_orders: totalOrders, total_spent: totalSpent, member_level: memberLevel })
      .eq("id", user.id);

    if (!error) statsUpdated++;
  }
  console.log(`  Profile stats updated: ${statsUpdated}`);

  // ── Report ──
  console.log("\n======================================");
  console.log("SEED DATA REPORT");
  console.log("======================================");

  const { data: finalOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: true });
  const { data: finalProfiles } = await supabase.from("profiles").select("*");

  const finalRevenue = (finalOrders || [])
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const ordersByService = {};
  for (const o of (finalOrders || [])) {
    ordersByService[o.service_name] = (ordersByService[o.service_name] || 0) + 1;
  }

  const ordersByStatus = {};
  for (const o of (finalOrders || [])) {
    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
  }

  const membersByLevel = {};
  for (const p of (finalProfiles || [])) {
    membersByLevel[p.member_level] = (membersByLevel[p.member_level] || 0) + 1;
  }

  const usersWithOrders = (finalProfiles || []).filter(p => p.total_orders > 0).length;
  const totalUsers = (finalProfiles || []).length;

  // Per-user breakdown
  console.log(`\n=== USERS ===`);
  console.log(`  Total: ${totalUsers} (${usersWithOrders} with orders, ${((usersWithOrders / totalUsers) * 100).toFixed(1)}%)`);

  console.log(`\n=== MEMBERSHIP ===`);
  for (const [level, count] of Object.entries(membersByLevel).sort()) {
    console.log(`  ${level}: ${count}`);
  }

  console.log(`\n=== ORDERS ===`);
  console.log(`  Total: ${(finalOrders || []).length}`);
  console.log(`  Revenue: Rp ${finalRevenue.toLocaleString("id-ID")}`);
  console.log(`  Avg: Rp ${Math.round(finalRevenue / (finalOrders || []).filter(o => o.status !== "cancelled").length).toLocaleString("id-ID")}`);

  console.log(`\n=== STATUS ===`);
  for (const [status, count] of Object.entries(ordersByStatus).sort()) {
    console.log(`  ${status}: ${count}`);
  }

  console.log(`\n=== SERVICE DISTRIBUTION ===`);
  for (const [service, count] of Object.entries(ordersByService).sort((a, b) => b[1] - a[1])) {
    const svc = SERVICES.find(s => s.name === service);
    console.log(`  ${service} (Rp ${svc?.price.toLocaleString("id-ID")}): ${count}`);
  }

  console.log(`\n=== TOP CUSTOMERS ===`);
  const topProfiles = (finalProfiles || [])
    .filter(p => p.total_orders > 0)
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, 8);
  for (const p of topProfiles) {
    const userOrders = (finalOrders || []).filter(o => o.user_id === p.id);
    const services = [...new Set(userOrders.map(o => o.service_name))].join(", ");
    console.log(`  ${p.first_name} ${p.last_name}: ${p.total_orders} orders | Rp ${p.total_spent.toLocaleString("id-ID")} | ${p.member_level}`);
    console.log(`    Services: ${services}`);
  }

  console.log(`\n=== DATE RANGE ===`);
  if (finalOrders?.length > 0) {
    const dates = finalOrders.map(o => o.scheduled_date).sort();
    console.log(`  ${dates[0]} — ${dates[dates.length - 1]}`);
  }

  console.log("\n=== SEED COMPLETE ===");
}

seed().catch(console.error);
