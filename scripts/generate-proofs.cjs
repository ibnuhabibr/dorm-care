/**
 * Generate fake payment proof images for all completed orders.
 *
 * Creates realistic mobile banking receipt screenshots using sharp (SVG → PNG).
 * Uploads to Supabase Storage bucket "payment-proofs".
 * Inserts transaction records for each order.
 *
 * Usage: node scripts/generate-proofs.cjs
 */

const { createClient } = require("@supabase/supabase-js");
const sharp = require("sharp");

const SUPABASE_URL = "https://jnxpjjbotcipauflkkch.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueHBqamJvdGNpcGF1Zmxra2NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwOTcxMSwiZXhwIjoyMDkxNjg1NzExfQ.20vwSMD6yzxp1UZG15voVrwfJfefzcXKcQsEJ-Ebe-Y";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BANKS = [
  { name: "Bank BCA", color: "#0066AE", bgColor: "#E8F2FA", icon: "BCA" },
  { name: "Bank Mandiri", color: "#003A70", bgColor: "#E8EEF4", icon: "MANDIRI" },
  { name: "Bank BNI", color: "#00706C", bgColor: "#E6F0EF", icon: "BNI" },
  { name: "Bank BRI", color: "#00569C", bgColor: "#E5EDF5", icon: "BRI" },
  { name: "Bank Syariah Indonesia", color: "#00A39B", bgColor: "#E5F6F5", icon: "BSI" },
  { name: "GoPay", color: "#00AA13", bgColor: "#E5F7E8", icon: "GOPAY" },
  { name: "DANA", color: "#108EE9", bgColor: "#E7F3FD", icon: "DANA" },
  { name: "ShopeePay", color: "#EE4D2D", bgColor: "#FDEDEA", icon: "SPAY" },
  { name: "OVO", color: "#4C2A86", bgColor: "#EDE9F3", icon: "OVO" },
];

function formatRupiah(n) {
  return "Rp" + n.toLocaleString("id-ID").replace(/,/g, ".");
}

function formatDate(d) {
  const date = new Date(d);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(d) {
  const date = new Date(d);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")} WIB`;
}

function randomRef() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "";
  for (let i = 0; i < 14; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

function buildReceiptSvg(order) {
  const bank = BANKS[Math.floor(Math.random() * BANKS.length)];
  const ref = randomRef();
  const dateStr = formatDate(order.created_at);
  const timeStr = formatTime(order.created_at);
  const amountStr = formatRupiah(order.total_amount);
  const serviceName = order.service_name;

  // Generate a consistent but random-looking nominal
  const nominal = order.total_amount.toLocaleString("id-ID");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="430" height="780" viewBox="0 0 430 780">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap');
      text { font-family: 'Inter', -apple-system, sans-serif; }
    </style>
  </defs>

  <!-- Background - mobile screen -->
  <rect width="430" height="780" fill="#F5F5F5" rx="0"/>

  <!-- Status bar -->
  <rect width="430" height="52" fill="${bank.color}"/>
  <text x="24" y="34" font-size="13" font-weight="600" fill="white">09:41</text>

  <!-- App header -->
  <rect width="430" height="100" y="52" fill="${bank.color}"/>
  <text x="215" y="90" text-anchor="middle" font-size="15" font-weight="700" fill="white" letter-spacing="0.5">${bank.name}</text>
  <text x="215" y="120" text-anchor="middle" font-size="12" font-weight="500" fill="rgba(255,255,255,0.8)">Mobile Banking</text>

  <!-- Card -->
  <rect x="20" y="170" width="390" height="560" rx="18" fill="white"/>
  <!-- Shadow for card -->
  <rect x="20" y="170" width="390" height="560" rx="18" fill="none" stroke="#E0E0E0" stroke-width="1"/>

  <!-- Success icon -->
  <circle cx="215" cy="230" r="32" fill="#E8F5E9"/>
  <text x="215" y="240" text-anchor="middle" font-size="28" fill="#4CAF50">✓</text>

  <!-- Success text -->
  <text x="215" y="290" text-anchor="middle" font-size="19" font-weight="800" fill="#1A1A1A">Transfer Berhasil</text>

  <!-- Amount -->
  <text x="215" y="330" text-anchor="middle" font-size="28" font-weight="800" fill="${bank.color}">${amountStr}</text>

  <!-- Divider -->
  <line x1="60" y1="355" x2="370" y2="355" stroke="#EEEEEE" stroke-width="1.5"/>

  <!-- Details -->
  <text x="50" y="395" font-size="12" font-weight="600" fill="#999" letter-spacing="0.5">DETAIL TRANSAKSI</text>

  <!-- Detail rows -->
  <text x="50" y="430" font-size="13" font-weight="500" fill="#666">Tanggal</text>
  <text x="215" y="430" text-anchor="end" font-size="13" font-weight="600" fill="#1A1A1A">${dateStr} · ${timeStr}</text>

  <text x="50" y="462" font-size="13" font-weight="500" fill="#666">No. Referensi</text>
  <text x="380" y="462" text-anchor="end" font-size="12" font-weight="600" fill="#1A1A1A" letter-spacing="0.5">${ref}</text>

  <text x="50" y="494" font-size="13" font-weight="500" fill="#666">Tujuan</text>
  <text x="380" y="494" text-anchor="end" font-size="13" font-weight="600" fill="#1A1A1A">Dorm Care</text>

  <text x="50" y="526" font-size="13" font-weight="500" fill="#666">Bank Tujuan</text>
  <text x="380" y="526" text-anchor="end" font-size="13" font-weight="600" fill="#1A1A1A">Mandiri</text>

  <text x="50" y="558" font-size="13" font-weight="500" fill="#666">Keterangan</text>
  <text x="380" y="558" text-anchor="end" font-size="13" font-weight="600" fill="#1A1A1A">${serviceName} · ${order.order_number}</text>

  <text x="50" y="590" font-size="13" font-weight="500" fill="#666">Status</text>
  <text x="380" y="590" text-anchor="end" font-size="13" font-weight="700" fill="#4CAF50">BERHASIL</text>

  <!-- Divider -->
  <line x1="60" y1="615" x2="370" y2="615" stroke="#EEEEEE" stroke-width="1.5"/>

  <!-- Notes -->
  <text x="50" y="650" font-size="11" font-weight="500" fill="#999">Biaya Admin</text>
  <text x="380" y="650" text-anchor="end" font-size="11" font-weight="600" fill="#1A1A1A">Rp 0</text>

  <text x="215" y="690" text-anchor="middle" font-size="11" font-weight="400" fill="#BBB">Transaksi diproses otomatis oleh sistem</text>

  <!-- Bottom bank logo -->
  <text x="215" y="715" text-anchor="middle" font-size="11" font-weight="700" fill="${bank.color}" letter-spacing="0.5">${bank.name}</text>
</svg>`;
}

async function generateProofImage(order) {
  const svg = buildReceiptSvg(order);
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log("Fetching completed orders...\n");

  // Get all completed orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "completed")
    .order("created_at", { ascending: true });

  if (ordersError) {
    console.error("Failed to fetch orders:", ordersError.message);
    process.exit(1);
  }

  console.log(`Found ${orders.length} completed orders\n`);

  // Get existing transaction order_ids to skip
  const { data: existingTx } = await supabase
    .from("transactions")
    .select("order_id");

  const existingOrderIds = new Set((existingTx || []).map((t) => t.order_id));
  const toProcess = orders.filter((o) => !existingOrderIds.has(o.id));

  console.log(`Already have proofs: ${orders.length - toProcess.length}`);
  console.log(`Need proofs: ${toProcess.length}\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const order = toProcess[i];
    const pct = `[${i + 1}/${toProcess.length}]`;

    try {
      // Generate image
      const pngBuffer = await generateProofImage(order);
      const fileName = `proof_${order.id}.png`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, pngBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      const proofUrl = urlData?.publicUrl || "";

      // Insert transaction record
      const { error: txError } = await supabase.from("transactions").insert({
        order_id: order.id,
        user_id: order.user_id,
        amount: order.total_amount,
        status: "verified",
        proof_url: proofUrl,
        payment_method: "qris",
      });

      if (txError) throw txError;

      console.log(`${pct} OK  ${order.order_number} | ${order.service_name}`);
      success++;
    } catch (err) {
      console.error(`${pct} ERR ${order.order_number}: ${err.message}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    if (i % 5 === 4) await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n--- Done ---`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
