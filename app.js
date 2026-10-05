/**
 * LANConnect POS & Pembukuan Kas (Sketch Layout Edition)
 * Simpel, Cepat & Sesuai Desain Sketsa:
 * - 3 Kartu Atas: YOUR BALANCE, INCOME, EXPENSE
 * - Kontainer Bawah: DAFTAR TRANSAKSI (TANGGAL, NAMA, PESANAN, PAYMENT, STATUS, AKSI)
 */

// ==========================================
// SAMPLE DEFAULT DATA
// ==========================================
const DEFAULT_INITIAL_BALANCE = 1500000;

const DEFAULT_TRANSACTIONS = [
  {
    id: "INV-202610-001",
    date: "2026-10-05T09:15:00",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    productCategory: "both", // lan-only | rj-only | both
    items: [
      { name: "Cat6 UTP Gigabit", type: "lan", qty: 25, unit: "meter", price: 4000, subtotal: 100000 },
      { name: "RJ45 Cat6 Gold Plated", type: "rj", qty: 6, unit: "pcs", price: 2500, subtotal: 15000 }
    ],
    subtotal: 115000,
    discount: 5000,
    total: 110000,
    paymentMethod: "Tunai / Cash",
    paymentStatus: "PAID",
    pickupStatus: "Sudah Diambil",
    notes: "Kabel straight 2 line kantor"
  },
  {
    id: "INV-202610-002",
    date: "2026-10-05T10:30:00",
    customerName: "Andi Pratama",
    customerPhone: "085698765432",
    productCategory: "lan-only",
    items: [
      { name: "Cat5e UTP Standard", type: "lan", qty: 15, unit: "meter", price: 3500, subtotal: 52500 }
    ],
    subtotal: 52500,
    discount: 0,
    total: 52500,
    paymentMethod: "QRIS",
    paymentStatus: "PAID",
    pickupStatus: "Belum Diambil",
    notes: "Sudah bayar via QRIS, barang titip diambil sore"
  },
  {
    id: "INV-202610-003",
    date: "2026-10-05T11:45:00",
    customerName: "Warnet CyberNet Gaming",
    customerPhone: "081901234567",
    productCategory: "both",
    items: [
      { name: "Cat6 FTP Outdoor", type: "lan", qty: 100, unit: "meter", price: 6500, subtotal: 650000 },
      { name: "RJ45 Pass-Through EZ", type: "rj", qty: 50, unit: "pcs", price: 3000, subtotal: 150000 }
    ],
    subtotal: 800000,
    discount: 50000,
    total: 750000,
    paymentMethod: "Transfer Bank BCA",
    paymentStatus: "PAID",
    pickupStatus: "Sedang Dirakit",
    notes: "Restock kabel billing 10 PC, sedang dirakit"
  },
  {
    id: "INV-202610-004",
    date: "2026-10-05T13:20:00",
    customerName: "Rudi Hartono (Teknisi)",
    customerPhone: "082155667788",
    productCategory: "rj-only",
    items: [
      { name: "RJ45 Cat6 Gold Plated", type: "rj", qty: 20, unit: "pcs", price: 2500, subtotal: 50000 }
    ],
    subtotal: 50000,
    discount: 0,
    total: 50000,
    paymentMethod: "Tempo / Kasbon",
    paymentStatus: "PENDING",
    pickupStatus: "Sudah Diambil",
    notes: "Barang sudah dibawa, janji bayar akhir bulan"
  },
  {
    id: "INV-202610-005",
    date: "2026-10-05T15:10:00",
    customerName: "PT Sinar Global Mandiri",
    customerPhone: "081399887766",
    productCategory: "both",
    items: [
      { name: "Cat6a STP Shielded", type: "lan", qty: 305, unit: "meter", price: 5000, subtotal: 1525000 },
      { name: "RJ45 Metal Shielded", type: "rj", qty: 100, unit: "pcs", price: 4500, subtotal: 450000 }
    ],
    subtotal: 1975000,
    discount: 75000,
    total: 1900000,
    paymentMethod: "Transfer Bank Mandiri",
    paymentStatus: "PAID",
    pickupStatus: "Sudah Diambil",
    notes: "1 Roll kabel + 1 Box RJ45 Metal"
  },
  {
    id: "INV-202610-006",
    date: "2026-10-05T16:05:00",
    customerName: "Fajar Maulana",
    customerPhone: "087788990011",
    productCategory: "rj-only",
    items: [
      { name: "RJ45 Cat5e Standard", type: "rj", qty: 10, unit: "pcs", price: 2000, subtotal: 20000 }
    ],
    subtotal: 20000,
    discount: 0,
    total: 20000,
    paymentMethod: "Tunai / Cash",
    paymentStatus: "PAID",
    pickupStatus: "Belum Diambil",
    notes: "Titip dulu di etalase, diambil pulang sekolah"
  },
  {
    id: "INV-202610-007",
    date: "2026-10-05T17:00:00",
    customerName: "Dedi Kurniawan",
    customerPhone: "081298761234",
    productCategory: "both",
    items: [
      { name: "Cat6 UTP Gigabit", type: "lan", qty: 10, unit: "meter", price: 4000, subtotal: 40000 },
      { name: "RJ45 Cat6 Gold Plated", type: "rj", qty: 2, unit: "pcs", price: 2500, subtotal: 5000 }
    ],
    subtotal: 45000,
    discount: 0,
    total: 45000,
    paymentMethod: "Tunai / Cash",
    paymentStatus: "PENDING",
    pickupStatus: "Belum Diambil",
    notes: "Booking kabel 10m via WA, bayar saat ambil"
  }
];

const DEFAULT_EXPENSES = [
  {
    id: "EXP-001",
    date: "2026-10-04T10:00:00",
    category: "Stok Kabel LAN",
    description: "Belanja 2 Roll Kabel Cat6 Belden Original (610m)",
    amount: 1950000
  },
  {
    id: "EXP-002",
    date: "2026-10-04T11:30:00",
    category: "Stok RJ45",
    description: "Belanja 3 Box Konektor RJ45 Cat6 Gold Plated (300 pcs)",
    amount: 450000
  },
  {
    id: "EXP-003",
    date: "2026-10-04T14:15:00",
    category: "Peralatan & Tools",
    description: "Tang Crimping RJ45 & Cable Tester LAN",
    amount: 175000
  },
  {
    id: "EXP-004",
    date: "2026-10-05T08:30:00",
    category: "Operasional",
    description: "Token Listrik Toko & Wifi 50Mbps",
    amount: 250000
  }
];

const DEFAULT_INCOMES = [
  {
    id: "INC-001",
    date: "2026-10-04T16:00:00",
    source: "Jasa Crimping",
    description: "Jasa pasang 8 titik kabel LAN Toko Buah",
    amount: 120000
  },
  {
    id: "INC-002",
    date: "2026-10-05T14:00:00",
    source: "Jasa Maintenance",
    description: "Setting Mikrotik & Penataan Rack Server",
    amount: 350000
  }
];

// ==========================================
// STATE MANAGEMENT
// ==========================================
const STORAGE_KEY = "LANCONNECT_SKETCH_V3";

let appState = {
  initialBalance: DEFAULT_INITIAL_BALANCE,
  transactions: [],
  expenses: [],
  incomes: [],
  theme: "dark",
  statusFilter: "all",
  productFilter: "all",
  searchQuery: "",
  activeReceiptTx: null
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appState.initialBalance = parsed.initialBalance ?? DEFAULT_INITIAL_BALANCE;
      appState.transactions = parsed.transactions ?? DEFAULT_TRANSACTIONS;
      appState.expenses = parsed.expenses ?? DEFAULT_EXPENSES;
      appState.incomes = parsed.incomes ?? DEFAULT_INCOMES;
      appState.theme = parsed.theme ?? "dark";
      return;
    } catch (e) {
      console.warn("Failed to load local state", e);
    }
  }
  appState.initialBalance = DEFAULT_INITIAL_BALANCE;
  appState.transactions = [...DEFAULT_TRANSACTIONS];
  appState.expenses = [...DEFAULT_EXPENSES];
  appState.incomes = [...DEFAULT_INCOMES];
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    initialBalance: appState.initialBalance,
    transactions: appState.transactions,
    expenses: appState.expenses,
    incomes: appState.incomes,
    theme: appState.theme
  }));
}

// Helpers
function formatRp(amount) {
  const num = Number(amount) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDateOnly(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-check-circle";
  if (type === "danger") icon = "fa-triangle-exclamation";

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

// ==========================================
// FINANCIAL KPIS
// ==========================================
function calculateFinancials() {
  // Income from PAID POS transactions
  const posPaidIncome = appState.transactions
    .filter(t => t.paymentStatus === "PAID")
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  // Manual additional incomes
  const manualIncome = appState.incomes.reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0);

  // Total Income
  const totalIncome = posPaidIncome + manualIncome;

  // Total Expenses
  const totalExpenses = appState.expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  // Balance
  const currentBalance = appState.initialBalance + totalIncome - totalExpenses;

  return {
    initialBalance: appState.initialBalance,
    totalIncome,
    totalExpenses,
    currentBalance,
    totalTransactionsCount: appState.transactions.length
  };
}

function renderKPIs() {
  const fin = calculateFinancials();

  // Balance Card
  const balEl = document.getElementById("kpi-balance");
  const balBadge = document.getElementById("balance-status-badge");
  if (balEl) balEl.textContent = formatRp(fin.currentBalance);
  if (balBadge) {
    if (fin.currentBalance >= 0) {
      balBadge.textContent = "SURPLUS";
      balBadge.className = "badge-status badge-surplus";
    } else {
      balBadge.textContent = "DEFISIT";
      balBadge.className = "badge-status badge-defisit";
    }
  }

  // Income Card
  const incEl = document.getElementById("kpi-income");
  const incBadge = document.getElementById("kpi-income-count");
  if (incEl) incEl.textContent = formatRp(fin.totalIncome);
  if (incBadge) {
    const paidTrx = appState.transactions.filter(t => t.paymentStatus === "PAID").length + appState.incomes.length;
    incBadge.textContent = `${paidTrx} Masuk`;
  }

  // Expense Card
  const expEl = document.getElementById("kpi-expense");
  const expBadge = document.getElementById("kpi-expense-count");
  if (expEl) expEl.textContent = formatRp(fin.totalExpenses);
  if (expBadge) expBadge.textContent = `${appState.expenses.length} Catatan`;

  // Total bubble on table header
  const totalBubble = document.getElementById("badge-total-transactions");
  if (totalBubble) totalBubble.textContent = fin.totalTransactionsCount;
}

// ==========================================
// RENDER MAIN TRANSACTIONS TABLE (SESUAI SKETSA)
// ==========================================
function renderTransactionsTable() {
  const tbody = document.getElementById("tbody-transactions");
  if (!tbody) return;

  const search = appState.searchQuery.toLowerCase().trim();
  const statusFilter = appState.statusFilter;
  const prodFilter = appState.productFilter;

  // Filter
  const filtered = appState.transactions.filter(t => {
    // Status Filter (Semua, PENDING, PAID, UNPICKED, CANCELLED)
    if (statusFilter === "PENDING" && t.paymentStatus !== "PENDING") return false;
    if (statusFilter === "PAID" && t.paymentStatus !== "PAID") return false;
    if (statusFilter === "CANCELLED" && t.paymentStatus !== "CANCELLED") return false;
    if (statusFilter === "UNPICKED") {
      // Belum diambil
      if (t.pickupStatus !== "Belum Diambil" && t.pickupStatus !== "Sedang Dirakit") return false;
    }

    // Product Filter
    if (prodFilter === "lan-only" && t.productCategory !== "lan-only") return false;
    if (prodFilter === "rj-only" && t.productCategory !== "rj-only") return false;
    if (prodFilter === "both" && t.productCategory !== "both") return false;

    // Search Query (Nama, WA, ID, Catatan)
    if (search) {
      const matchName = (t.customerName || "").toLowerCase().includes(search);
      const matchPhone = (t.customerPhone || "").includes(search);
      const matchId = (t.id || "").toLowerCase().includes(search);
      const matchNotes = (t.notes || "").toLowerCase().includes(search);
      if (!matchName && !matchPhone && !matchId && !matchNotes) return false;
    }

    return true;
  });

  // Update summary bar below table
  const countEl = document.getElementById("filtered-count");
  const amountEl = document.getElementById("filtered-amount");
  if (countEl) countEl.textContent = filtered.length;
  if (amountEl) {
    const sumTotal = filtered.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    amountEl.textContent = formatRp(sumTotal);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 45px 20px;">
          <i class="fa-solid fa-inbox" style="font-size: 2.2rem; margin-bottom: 8px; opacity: 0.4; display: block;"></i>
          Tidak ada transaksi yang sesuai dengan filter pencarian.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    // 1. TANGGAL
    const dateFormatted = formatDateTime(t.date);

    // 2. NAMA
    // (Customer name only)

    // 3. PESANAN
    let catBadgeHtml = "";
    if (t.productCategory === "both") {
      catBadgeHtml = `<span class="badge-tag-combo"><i class="fa-solid fa-gem"></i> KABEL LAN + RJ45</span>`;
    } else if (t.productCategory === "lan-only") {
      catBadgeHtml = `<span class="badge-tag-lan"><i class="fa-solid fa-ethernet"></i> KABEL LAN</span>`;
    } else {
      catBadgeHtml = `<span class="badge-tag-rj"><i class="fa-solid fa-microchip"></i> RJ45</span>`;
    }

    const itemsSummary = t.items.map(it => `${it.qty} ${it.unit} ${it.name}`).join(" + ");

    // 4. PAYMENT
    const paymentHtml = `
      <div class="td-payment">
        <span class="payment-nominal">${formatRp(t.total)}</span>
        <span class="payment-method">${t.paymentMethod || "Cash"}</span>
      </div>
    `;

    // 5. STATUS (Payment status + Pickup status with interactive toggle)
    let payStatusBtnClass = "btn-status-paid";
    let payStatusIcon = "fa-check";
    if (t.paymentStatus === "PENDING") {
      payStatusBtnClass = "btn-status-pending";
      payStatusIcon = "fa-clock";
    } else if (t.paymentStatus === "CANCELLED") {
      payStatusBtnClass = "btn-status-cancelled";
      payStatusIcon = "fa-ban";
    }

    let pickStatusBtnClass = "btn-status-picked";
    let pickStatusIcon = "fa-box";
    if (t.pickupStatus === "Belum Diambil") {
      pickStatusBtnClass = "btn-status-unpicked";
      pickStatusIcon = "fa-box-open";
    } else if (t.pickupStatus === "Sedang Dirakit") {
      pickStatusBtnClass = "btn-status-assembling";
      pickStatusIcon = "fa-screwdriver-wrench";
    }

    const statusHtml = `
      <div class="td-status-box">
        <button type="button" class="status-btn ${payStatusBtnClass}" onclick="quickTogglePayment('${t.id}')" title="Klik untuk ubah status bayar">
          <i class="fa-solid ${payStatusIcon}"></i> ${t.paymentStatus}
        </button>
        <button type="button" class="status-btn ${pickStatusBtnClass}" onclick="quickTogglePickup('${t.id}')" title="Klik untuk ubah status ambil">
          <i class="fa-solid ${pickStatusIcon}"></i> ${t.pickupStatus || "Sudah Diambil"}
        </button>
      </div>
    `;

    // 6. AKSI (Edit Pesanan, Hapus)
    const actionHtml = `
      <div class="td-action-group">
        <button type="button" class="btn-tbl-action btn-edit" onclick="openEditTransactionModal('${t.id}')" title="Edit Pesanan">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="btn-tbl-action btn-del" onclick="deleteTransaction('${t.id}')" title="Hapus Transaksi">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    return `
      <tr>
        <td class="td-date">${dateFormatted}</td>
        <td>
          <div class="td-customer">
            <strong class="customer-name">${t.customerName}</strong>
          </div>
        </td>
        <td>
          <div class="td-order-box">
            <div class="order-badge-row">${catBadgeHtml}</div>
            <span class="order-detail-text">${itemsSummary}</span>
          </div>
        </td>
        <td>${paymentHtml}</td>
        <td>${statusHtml}</td>
        <td>${actionHtml}</td>
      </tr>
    `;
  }).join("");
}

// Quick interactive status toggles in table
window.quickTogglePayment = function(id) {
  const tx = appState.transactions.find(t => t.id === id);
  if (!tx) return;
  if (tx.paymentStatus === "PAID") {
    tx.paymentStatus = "PENDING";
  } else if (tx.paymentStatus === "PENDING") {
    tx.paymentStatus = "PAID";
  } else {
    tx.paymentStatus = "PAID";
  }
  saveState();
  renderKPIs();
  renderTransactionsTable();
  showToast(`Status pembayaran ${tx.customerName}: ${tx.paymentStatus}`, "info");
};

window.quickTogglePickup = function(id) {
  const tx = appState.transactions.find(t => t.id === id);
  if (!tx) return;
  if (tx.pickupStatus === "Belum Diambil") {
    tx.pickupStatus = "Sudah Diambil";
  } else if (tx.pickupStatus === "Sedang Dirakit") {
    tx.pickupStatus = "Sudah Diambil";
  } else {
    tx.pickupStatus = "Belum Diambil";
  }
  saveState();
  renderTransactionsTable();
  showToast(`Status pengambilan barang ${tx.customerName}: ${tx.pickupStatus}`, "info");
};

// Delete Transaction
window.deleteTransaction = function(id) {
  if (!confirm(`Hapus transaksi ${id}? Saldo kas akan diperbarui secara otomatis.`)) return;
  appState.transactions = appState.transactions.filter(t => t.id !== id);
  saveState();
  renderKPIs();
  renderTransactionsTable();
  showToast(`Transaksi ${id} dihapus`, "info");
};

// ==========================================
// POS TERMINAL FORM (TRANSAKSI BARU)
// ==========================================
function updatePosCalculations() {
  const checkLan = document.getElementById("check-lan")?.checked ?? false;
  const checkRj = document.getElementById("check-rj")?.checked ?? false;

  const panelLan = document.getElementById("panel-prod-lan");
  const panelRj = document.getElementById("panel-prod-rj");
  const bodyLan = document.getElementById("body-lan");
  const bodyRj = document.getElementById("body-rj");

  if (panelLan) panelLan.className = checkLan ? "product-select-panel active-lan" : "product-select-panel";
  if (panelRj) panelRj.className = checkRj ? "product-select-panel active-rj" : "product-select-panel";
  if (bodyLan) bodyLan.style.display = checkLan ? "block" : "none";
  if (bodyRj) bodyRj.style.display = checkRj ? "block" : "none";

  // Harga kabel: 5000 per meter
  const lanQty = Math.max(0, Number(document.getElementById("lan-qty")?.value) || 0);
  const lanPrice = 5000;
  const lanSub = checkLan ? lanQty * lanPrice : 0;
  const lanSubEl = document.getElementById("lan-subtotal-text");
  if (lanSubEl) lanSubEl.textContent = formatRp(lanSub);

  // RJ 1 itu 4 buah harga 5000 (1 paket = 4 buah = 5000)
  const rjQty = Math.max(0, Number(document.getElementById("rj-qty")?.value) || 0);
  const rjPrice = 5000;
  const rjSub = checkRj ? rjQty * rjPrice : 0;
  const rjSubEl = document.getElementById("rj-subtotal-text");
  if (rjSubEl) rjSubEl.textContent = formatRp(rjSub);

  const grandTotal = lanSub + rjSub;

  const grandEl = document.getElementById("pos-calc-grand-total");
  if (grandEl) grandEl.textContent = formatRp(grandTotal);

  const catEl = document.getElementById("pos-detected-category");
  if (catEl) {
    if (checkLan && checkRj) {
      catEl.textContent = "KABEL LAN + RJ45";
      catEl.style.display = "block";
    } else if (checkLan) {
      catEl.textContent = "KABEL LAN";
      catEl.style.display = "block";
    } else if (checkRj) {
      catEl.textContent = "RJ45";
      catEl.style.display = "block";
    } else {
      catEl.textContent = "PILIH MINIMAL 1 PRODUK";
    }
  }
}

window.resetPosModalForm = function() {
  const form = document.getElementById("pos-form");
  if (form) form.reset();

  const editIdEl = document.getElementById("pos-edit-id");
  if (editIdEl) editIdEl.value = "";

  const titleEl = document.getElementById("pos-modal-title");
  if (titleEl) titleEl.textContent = "Transaksi Baru (Kabel & RJ45)";

  const iconEl = document.getElementById("pos-modal-icon");
  if (iconEl) iconEl.className = "fa-solid fa-cart-plus";

  const btnTextEl = document.getElementById("btn-save-pos-text");
  if (btnTextEl) btnTextEl.textContent = "Simpan";

  const nameEl = document.getElementById("pos-name");
  if (nameEl) nameEl.value = "";

  const checkLan = document.getElementById("check-lan");
  if (checkLan) checkLan.checked = true;

  const checkRj = document.getElementById("check-rj");
  if (checkRj) checkRj.checked = true;

  const lanQty = document.getElementById("lan-qty");
  if (lanQty) lanQty.value = 1;

  const rjQty = document.getElementById("rj-qty");
  if (rjQty) rjQty.value = 1;

  // Status pembayaran & pengambilan pas baru dibuat: belum keduanya!
  const payStatusEl = document.getElementById("pos-payment-status");
  if (payStatusEl) payStatusEl.value = "PENDING"; // Belum Bayar

  const pickupStatusEl = document.getElementById("pos-pickup-status");
  if (pickupStatusEl) pickupStatusEl.value = "Belum Diambil"; // Belum Diambil

  updatePosCalculations();
};

window.openEditTransactionModal = function(id) {
  const tx = appState.transactions.find(t => t.id === id);
  if (!tx) return;

  const editIdEl = document.getElementById("pos-edit-id");
  if (editIdEl) editIdEl.value = tx.id;

  const titleEl = document.getElementById("pos-modal-title");
  if (titleEl) titleEl.textContent = `Edit Pesanan: ${tx.customerName}`;

  const iconEl = document.getElementById("pos-modal-icon");
  if (iconEl) iconEl.className = "fa-solid fa-pen-to-square";

  const btnTextEl = document.getElementById("btn-save-pos-text");
  if (btnTextEl) btnTextEl.textContent = "Simpan Perubahan";

  const nameEl = document.getElementById("pos-name");
  if (nameEl) nameEl.value = tx.customerName || "";

  const lanItem = tx.items.find(it => it.type === "lan" || (it.name && it.name.toLowerCase().includes("kabel")));
  const checkLan = document.getElementById("check-lan");
  const lanQty = document.getElementById("lan-qty");
  if (checkLan) checkLan.checked = !!lanItem;
  if (lanQty) lanQty.value = lanItem ? lanItem.qty : 1;

  const rjItem = tx.items.find(it => it.type === "rj" || (it.name && (it.name.toLowerCase().includes("rj45") || it.name.toLowerCase().includes("konektor"))));
  const checkRj = document.getElementById("check-rj");
  const rjQty = document.getElementById("rj-qty");
  if (checkRj) checkRj.checked = !!rjItem;
  if (rjQty) rjQty.value = rjItem ? rjItem.qty : 1;

  const payStatusEl = document.getElementById("pos-payment-status");
  if (payStatusEl) payStatusEl.value = tx.paymentStatus || "PENDING";

  const pickupStatusEl = document.getElementById("pos-pickup-status");
  if (pickupStatusEl) pickupStatusEl.value = tx.pickupStatus || "Belum Diambil";

  updatePosCalculations();
  openModal("modal-pos");
};

window.setLanMeters = function(m) {
  const el = document.getElementById("lan-qty");
  if (el) {
    el.value = m;
    updatePosCalculations();
  }
};

window.setRjPcs = function(pcs) {
  const el = document.getElementById("rj-qty");
  if (el) {
    el.value = pcs;
    updatePosCalculations();
  }
};

window.handlePosSubmit = function(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("pos-name")?.value.trim();
  if (!name) {
    showToast("Harap isi Nama Pembeli!", "danger");
    return false;
  }

  const checkLan = document.getElementById("check-lan")?.checked ?? false;
  const checkRj = document.getElementById("check-rj")?.checked ?? false;

  if (!checkLan && !checkRj) {
    showToast("Pilih minimal Kabel LAN atau RJ45 yang dibeli!", "danger");
    return false;
  }

  const items = [];
  let productCategory = "both";
  if (checkLan && checkRj) productCategory = "both";
  else if (checkLan) productCategory = "lan-only";
  else productCategory = "rj-only";

  if (checkLan) {
    const lanQty = Math.max(1, Number(document.getElementById("lan-qty")?.value) || 1);
    const lanPrice = 5000;
    items.push({
      name: "Kabel LAN",
      type: "lan",
      qty: lanQty,
      unit: "meter",
      price: lanPrice,
      subtotal: lanQty * lanPrice
    });
  }

  if (checkRj) {
    const rjQty = Math.max(1, Number(document.getElementById("rj-qty")?.value) || 1);
    const rjPrice = 5000; // 1 paket = 4 buah = Rp 5000
    const totalPcs = rjQty * 4;
    items.push({
      name: `Konektor RJ45 (${totalPcs} pcs)`,
      type: "rj",
      qty: rjQty,
      unit: "paket (4 pcs)",
      price: rjPrice,
      subtotal: rjQty * rjPrice
    });
  }

  const subtotal = items.reduce((sum, it) => sum + it.subtotal, 0);
  const total = subtotal;

  const payStatus = document.getElementById("pos-payment-status")?.value || "PENDING";
  const pickupStatus = document.getElementById("pos-pickup-status")?.value || "Belum Diambil";

  const editId = document.getElementById("pos-edit-id")?.value;
  if (editId) {
    const tx = appState.transactions.find(t => t.id === editId);
    if (tx) {
      tx.customerName = name;
      tx.productCategory = productCategory;
      tx.items = items;
      tx.subtotal = subtotal;
      tx.total = total;
      tx.paymentStatus = payStatus;
      tx.pickupStatus = pickupStatus;

      saveState();
      closeModal("modal-pos");
      resetPosModalForm();

      renderKPIs();
      renderTransactionsTable();
      showToast(`Pesanan ${name} (${formatRp(total)}) berhasil diperbarui!`, "success");
      return false;
    }
  }

  const now = new Date();
  const invoiceId = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`;

  const newTx = {
    id: invoiceId,
    date: now.toISOString(),
    customerName: name,
    customerPhone: "",
    productCategory: productCategory,
    items: items,
    subtotal: subtotal,
    discount: 0,
    total: total,
    paymentMethod: "Tunai / Cash",
    paymentStatus: payStatus,
    pickupStatus: pickupStatus,
    notes: ""
  };

  appState.transactions.unshift(newTx);
  saveState();

  closeModal("modal-pos");
  resetPosModalForm();

  renderKPIs();
  renderTransactionsTable();
  showToast(`Transaksi baru ${name} (${formatRp(total)}) berhasil disimpan!`, "success");
  return false;
};

// ==========================================
// EXPENSE & INCOME MANAGEMENT
// ==========================================
function renderExpenseTable() {
  const tbody = document.getElementById("tbody-expenses");
  if (!tbody) return;

  if (appState.expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">Belum ada catatan expense.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.expenses.map((exp) => `
    <tr>
      <td class="td-date" style="white-space: nowrap;">${formatDateOnly(exp.date)}</td>
      <td><span class="exp-cat-pill">${exp.category}</span></td>
      <td><strong>${exp.description}</strong></td>
      <td class="text-danger" style="font-family: var(--font-mono); font-weight: 700; text-align: right; white-space: nowrap;">${formatRp(exp.amount)}</td>
      <td style="text-align: center;">
        <button class="btn-tbl-action btn-del" onclick="deleteExpense('${exp.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join("");
}

function renderIncomeTable() {
  const tbody = document.getElementById("tbody-incomes");
  if (!tbody) return;

  if (appState.incomes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">Belum ada catatan pemasukan manual.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.incomes.map((inc) => `
    <tr>
      <td class="td-date" style="white-space: nowrap;">${formatDateOnly(inc.date)}</td>
      <td><span class="exp-cat-pill">${inc.source}</span></td>
      <td><strong>${inc.description}</strong></td>
      <td class="text-success" style="font-family: var(--font-mono); font-weight: 700; text-align: right; white-space: nowrap;">${formatRp(inc.amount)}</td>
      <td style="text-align: center;">
        <button class="btn-tbl-action btn-del" onclick="deleteIncome('${inc.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join("");
}

window.handleExpenseSubmit = function(event) {
  event.preventDefault();
  const cat = document.getElementById("exp-cat")?.value;
  const desc = document.getElementById("exp-desc")?.value.trim();
  const amount = Number(document.getElementById("exp-amount")?.value) || 0;

  if (!desc || amount <= 0) {
    showToast("Isi deskripsi dan nominal belanja yang valid!", "danger");
    return false;
  }

  const expId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
  appState.expenses.unshift({
    id: expId,
    date: new Date().toISOString(),
    category: cat,
    description: desc,
    amount: amount
  });

  saveState();
  document.getElementById("form-quick-expense")?.reset();
  renderKPIs();
  renderExpenseTable();
  showToast(`Expense ${formatRp(amount)} berhasil dicatat`, "success");
  return false;
};

window.handleIncomeSubmit = function(event) {
  event.preventDefault();
  const source = document.getElementById("inc-source")?.value;
  const desc = document.getElementById("inc-desc")?.value.trim();
  const amount = Number(document.getElementById("inc-amount")?.value) || 0;

  if (!desc || amount <= 0) {
    showToast("Isi keterangan dan nominal pemasukan yang valid!", "danger");
    return false;
  }

  const incId = `INC-${Math.floor(100 + Math.random() * 900)}`;
  appState.incomes.unshift({
    id: incId,
    date: new Date().toISOString(),
    source: source,
    description: desc,
    amount: amount
  });

  saveState();
  document.getElementById("form-quick-income")?.reset();
  renderKPIs();
  renderIncomeTable();
  showToast(`Income ${formatRp(amount)} berhasil dicatat`, "success");
  return false;
};

window.deleteExpense = function(id) {
  if (!confirm(`Hapus catatan expense ${id}?`)) return;
  appState.expenses = appState.expenses.filter(e => e.id !== id);
  saveState();
  renderKPIs();
  renderExpenseTable();
  showToast(`Expense ${id} dihapus`, "info");
};

window.deleteIncome = function(id) {
  if (!confirm(`Hapus catatan income ${id}?`)) return;
  appState.incomes = appState.incomes.filter(i => i.id !== id);
  saveState();
  renderKPIs();
  renderIncomeTable();
  showToast(`Income ${id} dihapus`, "info");
};

window.handleInitialBalanceSubmit = function(event) {
  event.preventDefault();
  const val = Number(document.getElementById("input-initial-balance")?.value) || 0;
  appState.initialBalance = val;
  saveState();
  closeModal("modal-initial-balance");
  renderKPIs();
  showToast(`Modal awal diperbarui menjadi ${formatRp(val)}`, "success");
  return false;
};

// ==========================================
// THERMAL RECEIPT MODAL
// ==========================================
window.openReceiptModal = function(id) {
  const tx = appState.transactions.find(t => t.id === id);
  if (!tx) return;

  document.getElementById("rc-invoice-id").textContent = tx.id;
  document.getElementById("rc-date").textContent = formatDateTime(tx.date);
  document.getElementById("rc-buyer-name").textContent = tx.customerName;

  const catBadge = document.getElementById("rc-prod-category");
  if (catBadge) {
    if (tx.productCategory === "both") catBadge.textContent = "KABEL LAN + RJ45";
    else if (tx.productCategory === "lan-only") catBadge.textContent = "KABEL LAN";
    else catBadge.textContent = "RJ45";
  }

  const rcPay = document.getElementById("rc-payment-status");
  const rcPick = document.getElementById("rc-pickup-status");
  if (rcPay) rcPay.textContent = tx.paymentStatus;
  if (rcPick) rcPick.textContent = tx.pickupStatus || "Sudah Diambil";

  const itemsContainer = document.getElementById("rc-items-list");
  if (itemsContainer) {
    itemsContainer.innerHTML = tx.items.map(it => `
      <div class="rc-item-line">
        <div class="rc-item-top">
          <span>${it.name}</span>
          <span>${formatRp(it.subtotal)}</span>
        </div>
        <div class="rc-item-calc">${it.qty} ${it.unit} x ${formatRp(it.price)}</div>
      </div>
    `).join("");
  }

  document.getElementById("rc-subtotal").textContent = formatRp(tx.subtotal);
  document.getElementById("rc-discount").textContent = "- " + formatRp(tx.discount);
  document.getElementById("rc-grand-total").textContent = formatRp(tx.total);
  document.getElementById("rc-pay-method").textContent = tx.paymentMethod || "Cash";

  openModal("modal-receipt");
};

// ==========================================
// EXPORT TO CSV
// ==========================================
function exportTransactionsCSV() {
  const rows = [
    ["ID Invoice", "Tanggal", "Nama Pembeli", "No WhatsApp", "Kategori Produk", "Detail Pesanan", "Total Bayar", "Metode Pembayaran", "Status Payment", "Status Pengambilan", "Catatan"]
  ];

  appState.transactions.forEach(t => {
    rows.push([
      t.id,
      formatDateTime(t.date),
      t.customerName,
      t.customerPhone || "-",
      t.productCategory,
      t.items.map(i => `${i.qty} ${i.unit} ${i.name}`).join(" + "),
      t.total,
      t.paymentMethod || "-",
      t.paymentStatus,
      t.pickupStatus || "-",
      t.notes || "-"
    ]);
  });

  let csvContent = "\uFEFF";
  rows.forEach(r => {
    csvContent += r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Laporan_Transaksi_Kabel_RJ45_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("File CSV berhasil diunduh!", "success");
}

// ==========================================
// MODAL CONTROLS
// ==========================================
window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("open");
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("open");
};

// ==========================================
// INIT APP & DOM LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  loadState();

  // Apply Theme (Cream Base Palette)
  document.body.className = "palette-cream";

  // Init initial balance input
  const initInput = document.getElementById("input-initial-balance");
  if (initInput) initInput.value = appState.initialBalance;

  // Search input in table header
  const searchInput = document.getElementById("filter-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value;
      renderTransactionsTable();
    });
  }

  // Status Filter Pills (Persis Sketsa: Semua, PENDING, PAID, UNPICKED, CANCELLED)
  document.querySelectorAll("#status-filter-pills .sketch-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#status-filter-pills .sketch-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.statusFilter = btn.getAttribute("data-status-filter");
      renderTransactionsTable();
    });
  });

  // Product Filter Pills (Semua, Kabel LAN, RJ45, Kombo)
  document.querySelectorAll("#product-filter-pills .prod-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#product-filter-pills .prod-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.productFilter = btn.getAttribute("data-prod-filter");
      renderTransactionsTable();
    });
  });

  // Modal open buttons
  document.getElementById("btn-open-pos-modal")?.addEventListener("click", () => {
    resetPosModalForm();
    openModal("modal-pos");
  });
  document.getElementById("btn-open-expense-list")?.addEventListener("click", () => {
    renderExpenseTable();
    openModal("modal-expense-manage");
  });
  document.getElementById("btn-open-income-list")?.addEventListener("click", () => {
    renderIncomeTable();
    openModal("modal-income-manage");
  });
  document.getElementById("card-expense-click")?.addEventListener("click", () => {
    renderExpenseTable();
    openModal("modal-expense-manage");
  });
  document.getElementById("card-income-click")?.addEventListener("click", () => {
    renderIncomeTable();
    openModal("modal-income-manage");
  });
  document.getElementById("btn-quick-add-expense")?.addEventListener("click", (e) => {
    e.stopPropagation();
    renderExpenseTable();
    openModal("modal-expense-manage");
  });
  document.getElementById("btn-quick-add-income")?.addEventListener("click", (e) => {
    e.stopPropagation();
    renderIncomeTable();
    openModal("modal-income-manage");
  });
  document.getElementById("btn-edit-initial-balance")?.addEventListener("click", () => openModal("modal-initial-balance"));

  // POS Calculator inputs
  const calcInputs = ["check-lan", "check-rj", "lan-qty", "rj-qty"];
  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updatePosCalculations);
      el.addEventListener("change", updatePosCalculations);
    }
  });

  // Reset Data
  document.getElementById("btn-reset-data")?.addEventListener("click", () => {
    if (confirm("Reset seluruh data ke contoh awal?")) {
      localStorage.removeItem(STORAGE_KEY);
      loadState();
      renderKPIs();
      renderTransactionsTable();
      showToast("Data direset ke sample awal", "info");
    }
  });

  // Initial Renders
  updatePosCalculations();
  renderKPIs();
  renderTransactionsTable();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("open") === "expense") {
    renderExpenseTable();
    openModal("modal-expense-manage");
  }
});
