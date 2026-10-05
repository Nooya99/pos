# LANConnect POS & Pembukuan Kas Toko Kabel LAN & RJ45

Aplikasi Kasir (Point of Sale) dan Pembukuan Keuangan modern berbasis web, dirancang khusus untuk toko/usaha penjualan:
- **Produk A:** Kabel LAN (Cat5e / Cat6 / Cat6a, jual meteran / roll)
- **Produk B:** Konektor RJ45 (Cat5e / Cat6 / Metal Shielded / Pass-Through EZ)
- **Paket Kombo:** Pembelian Kabel LAN + RJ45 sekaligus
- **Layanan Tambahan:** Jasa Pasang/Crimping Kabel + Plug Boot Karet

---

## 🌟 Fitur Utama

### 1. Dashboard Keuangan & Saldo (Financial KPIs)
- **YOUR BALANCE (Saldo Bersih):** Menampilkan kas riil toko secara *real-time* (`Saldo Modal Awal + Total Income - Total Expenses`). Terdapat tombol untuk mengatur Modal Awal.
- **TOTAL INCOME (Pemasukan):** Rekapitulasi otomatis dari transaksi kasir POS yang lunas dan pemasukan jasa lainnya.
- **TOTAL EXPENSES (Pengeluaran):** Rekapitulasi biaya belanja stok roll kabel, box RJ45, tang crimping, tester, dan operasional.
- **PRODUK TERJUAL:** Menghitung total meter Kabel LAN terjual, total pcs RJ45 terjual, serta jumlah pembeli paket kombo (A & B).
- **Grafik Interaktif:**
  - Grafik Batang Arus Kas (Cashflow: Saldo Awal vs Income vs Expense vs Saldo Akhir).
  - Grafik Donat Komposisi Pembelian (Kabel LAN Saja vs RJ45 Saja vs Borong Keduanya).

---

### 2. LIST NAMA YG BELI PRODUK (Pencatatan Pembeli & Transaksi)
Menampilkan tabel lengkap siapa saja yang membeli Produk A, Produk B, atau Keduanya:
- **Filter Cepat:**
  - `Semua Pembeli`
  - `Hanya Kabel LAN (A)`
  - `Hanya RJ45 (B)`
  - `Keduanya (A & B)`
  - `Sudah Bayar - Belum Diambil` *(Fitur Khusus: Menyoroti pembeli yang sudah bayar tetapi barangnya masih dititip/diambil nanti)*
  - `Belum Bayar` *(Menyoroti kasbon / tempo)*
- **Status Interaktif (One-Click Toggle Langsung di Tabel):**
  - **Status Bayar:** Klik badge langsung di tabel untuk mengubah antara `🟢 Sudah Bayar` dan `🔴 Belum Bayar`.
  - **Status Ambil:** Klik badge langsung di tabel untuk mengubah antara `📦 Belum Diambil`, `⏳ Sedang Dirakit`, dan `✅ Sudah Diambil`.
- **Kolom Data:** No, ID Invoice, Tanggal & Jam, Nama Pembeli (disertai inisial avatar), No WhatsApp (bisa langsung diklik buka chat WA), Badge Kategori Produk, Rincian Barang & Qty, Total Bayar, Metode Bayar, Status Bayar, Status Ambil, dan Tombol Struk & Hapus.
- **Pencarian Realtime & Filter Waktu:** Hari Ini, Minggu Ini, Bulan Ini.

---

### 3. LIST EXPENSE (Daftar Pengeluaran Toko)
- Pencatatan seluruh belanja toko:
  - Belanja Stok Kabel LAN (Roll / Bulk)
  - Belanja Stok RJ45 (Box / Pack)
  - Peralatan & Tools (Tang Crimping, LAN Tester)
  - Operasional Toko (Listrik, Wifi, Sewa)
  - Transport & Ongkos Kirim
  - Lain-lain
- Filter per kategori & filter periode waktu.
- Total kalkulasi nominal pengeluaran otomatis.

---

### 4. LIST INCOME (Daftar Pemasukan)
- Terintegrasi otomatis dengan setiap transaksi penjualan kasir POS.
- Memungkinkan pencatatan pemasukan manual tambahan (misal: Jasa Maintenance Jaringan, Setting Router Mikrotik, Jasa Crimping borongan, Modal Tambahan).
- Filter sumber pemasukan dan total kalkulasi pemasukan otomatis.

---

### 5. Terminal Kasir Cepat (POS)
- Input Nama Pembeli & No. WhatsApp.
- Checkbox pilihan produk:
  - **Produk A (Kabel LAN):** Pilihan tipe kabel, input meter dengan tombol cepat (`+5m`, `+10m`, `+20m`, `+50m`, `1 Roll 305m`), harga per meter.
  - **Produk B (RJ45):** Pilihan tipe RJ45, input pcs dengan tombol cepat (`2 pcs`, `4 pcs`, `10 pcs`, `50 pcs`, `1 Box 100 pcs`), harga satuan.
  - **Tambahan Jasa:** Biaya Crimping dan Plug Boot Karet.
- Kalkulasi live: Subtotal, diskon potongan harga, dan Total Akhir.
- Kalkulator uang tunai diterima & kembalian otomatis dengan tombol uang pas / pecahan Rp 20rb, 50rb, 100rb.
- Pilihan Status Pembayaran (`Sudah Bayar` / `Belum Bayar`).
- Pilihan Status Pengambilan (`Sudah Diambil` / `Belum Diambil` / `Sedang Dipotong & Crimping`).
- Tombol **Simpan Transaksi** & **Simpan & Cetak Struk**.

---

### 6. Cetak Struk Belanja & Export Laporan
- **Struk Kasir Thermal (Thermal Receipt 80mm):** Desain nota kasir lengkap dengan nomor nota, tanggal, nama pembeli, rincian barang, total bayar, status bayar, status pengambilan, dan barcode. Siap langsung dicetak (`window.print`).
- **Export Data Excel / CSV:** Bisa mengunduh data daftar pembeli, data pengeluaran (expenses), dan data pemasukan (income) dalam format CSV UTF-8 yang langsung kompatibel dengan Microsoft Excel.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibuat menggunakan **Vanilla HTML5, CSS3, dan JavaScript**, sehingga sangat ringan, cepat, dan tidak memerlukan instalasi dependencies pihak ketiga.

### Opsi 1: Menjalankan dengan Node.js (Rekomendasi)
Buka terminal di folder `d:\KABEL` lalu jalankan:
```bash
node server.js
```
Kemudian buka browser di:
👉 **`http://localhost:3000`**

### Opsi 2: Langsung Buka File HTML di Browser
Cukup klik ganda (double-click) file:
👉 **`d:\KABEL\index.html`** di browser Chrome, Edge, Firefox, atau browser favorit Anda.
Data akan tersimpan secara otomatis di LocalStorage browser Anda.
