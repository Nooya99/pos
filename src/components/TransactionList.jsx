import React from 'react';
import { formatRp, formatDateTime } from '../data/initialData';

export default function TransactionList({
  transactions,
  onTogglePayment,
  onTogglePickup,
  onEditTransaction,
  onDeleteTransaction
}) {
  const pendingTotal = transactions
    .filter((t) => t.paymentStatus === 'PENDING')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const paidTotal = transactions
    .filter((t) => t.paymentStatus === 'PAID')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const pendingCount = transactions.filter((t) => t.paymentStatus === 'PENDING').length;
  const paidCount = transactions.filter((t) => t.paymentStatus === 'PAID').length;

  // Hitung total RJ45 terjual (1 paket = 4 RJ) & sisa stok dari 200 pcs awal
  const totalRjPackets = transactions
    .filter((t) => t.paymentStatus !== 'CANCELLED')
    .reduce((sum, t) => {
      if (!t.items || !Array.isArray(t.items)) {
        if (t.productCategory === 'rj-only' || t.productCategory === 'both') {
          return sum + 1;
        }
        return sum;
      }
      const rjItems = t.items.filter(
        (it) => it.type === 'rj' || (it.name && it.name.toLowerCase().includes('rj'))
      );
      return sum + rjItems.reduce((s, it) => s + (Number(it.qty) || 0), 0);
    }, 0);

  const totalRjSold = totalRjPackets * 4;
  const initialStock = 200;
  const remainingStock = Math.max(0, initialStock - totalRjSold);
  const isStockLow = remainingStock <= 20;

  // Hitung total Kabel LAN terjual (jumlah buah kabel & meter)
  const totalLanSummary = transactions
    .filter((t) => t.paymentStatus !== 'CANCELLED')
    .reduce(
      (acc, t) => {
        if (!t.items || !Array.isArray(t.items)) {
          if (t.productCategory === 'lan-only' || t.productCategory === 'both') {
            acc.orders += 1;
            acc.meters += 1;
          }
          return acc;
        }
        const lanItems = t.items.filter(
          (it) =>
            it.type === 'lan' ||
            (it.name && it.name.toLowerCase().includes('lan')) ||
            (it.name && it.name.toLowerCase().includes('kabel'))
        );
        if (lanItems.length > 0) {
          acc.orders += lanItems.length;
          acc.meters += lanItems.reduce((s, it) => s + (Number(it.qty) || 0), 0);
        }
        return acc;
      },
      { orders: 0, meters: 0 }
    );

  if (transactions.length === 0) {
    return (
      <div className="table-responsive-wrapper">
        <table className="sketch-table">
          <tbody>
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  padding: '45px 20px'
                }}
              >
                <i
                  className="fa-solid fa-cart-arrow-down"
                  style={{
                    fontSize: '2.5rem',
                    marginBottom: '10px',
                    opacity: 0.35,
                    display: 'block'
                  }}
                ></i>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: 'var(--green)',
                    marginBottom: '4px'
                  }}
                >
                  Belum Ada Transaksi
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  Klik tombol <strong>+ Transaksi Baru</strong> di atas untuk mencatat pesanan pertama.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="sketch-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Nama</th>
            <th>Pesanan</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="tbody-transactions">
          {transactions.map((t) => {
            // Badge category
            let catBadge = null;
            if (t.productCategory === 'both') {
              catBadge = (
                <span className="badge-tag-combo">
                  <i className="fa-solid fa-gem"></i> KABEL LAN + RJ45
                </span>
              );
            } else if (t.productCategory === 'lan-only') {
              catBadge = (
                <span className="badge-tag-lan">
                  <i className="fa-solid fa-ethernet"></i> KABEL LAN
                </span>
              );
            } else {
              catBadge = (
                <span className="badge-tag-rj">
                  <i className="fa-solid fa-microchip"></i> RJ45
                </span>
              );
            }

            // Items summary
            const itemsSummary = t.items
              ? t.items.map((it) => `${it.qty} ${it.unit} ${it.name}`).join(' + ')
              : '';

            // Payment status styles
            let payClass = 'btn-status-paid';
            let payIcon = 'fa-check';
            if (t.paymentStatus === 'PENDING') {
              payClass = 'btn-status-pending';
              payIcon = 'fa-clock';
            } else if (t.paymentStatus === 'CANCELLED') {
              payClass = 'btn-status-cancelled';
              payIcon = 'fa-ban';
            }

            // Pickup status styles
            let pickClass = 'btn-status-picked';
            let pickIcon = 'fa-box';
            if (t.pickupStatus === 'Belum Diambil') {
              pickClass = 'btn-status-unpicked';
              pickIcon = 'fa-box-open';
            }

            return (
              <tr key={t.id}>
                {/* 1. TANGGAL */}
                <td className="td-date">{formatDateTime(t.date)}</td>

                {/* 2. NAMA */}
                <td>
                  <div className="td-customer">
                    <strong className="customer-name">{t.customerName}</strong>
                  </div>
                </td>

                {/* 3. PESANAN */}
                <td>
                  <div className="td-order-box">
                    <div className="order-badge-row">{catBadge}</div>
                    <span className="order-detail-text">{itemsSummary}</span>
                  </div>
                </td>

                {/* 4. PAYMENT */}
                <td>
                  <div className="td-payment">
                    <span className="payment-nominal">{formatRp(t.total)}</span>
                    <span className="payment-method">
                      {t.paymentMethod || 'Tunai / Cash'}
                    </span>
                  </div>
                </td>

                {/* 5. STATUS */}
                <td>
                  <div className="td-status-box">
                    <button
                      type="button"
                      className={`status-btn ${payClass}`}
                      onClick={() => onTogglePayment(t.id)}
                      title="Klik untuk ubah status pembayaran"
                    >
                      <i className={`fa-solid ${payIcon}`}></i> {t.paymentStatus}
                    </button>
                    <button
                      type="button"
                      className={`status-btn ${pickClass}`}
                      onClick={() => onTogglePickup(t.id)}
                      title="Klik untuk ubah status pengambilan"
                    >
                      <i className={`fa-solid ${pickIcon}`}></i>{' '}
                      {t.pickupStatus || 'Sudah Diambil'}
                    </button>
                  </div>
                </td>

                {/* 6. AKSI */}
                <td>
                  <div className="td-action-group">
                    <button
                      type="button"
                      className="btn-tbl-action btn-edit"
                      onClick={() => onEditTransaction(t)}
                      title="Edit Pesanan"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-tbl-action btn-del"
                      onClick={() => onDeleteTransaction(t.id)}
                      title="Hapus Transaksi"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="tfoot-summary-row">
            {/* 1 & 2: TANGGAL & NAMA */}
            <td colSpan={2} className="td-foot-label">
              <i className="fa-solid fa-receipt"></i> <strong>TOTAL TABEL INCOME:</strong>
            </td>

            {/* 3: PESANAN (TEPAT DI SEBELAH KIRI TULISAN PENDING) */}
            <td className="td-foot-stock">
              <div className="tfoot-stock-box">
                {/* 1. TOTAL RJ & SISA STOK DARI 200 PCS */}
                <div className="tfoot-stock-item rj-item">
                  <div className="tfoot-stock-main">
                    <span className="rj-badge-icon" title="Konektor RJ45">
                      <i className="fa-solid fa-microchip"></i>
                    </span>
                    <span className="rj-sold-title">
                      Total RJ: <strong>{totalRjSold} RJ</strong>
                    </span>
                    <span className="rj-packets-hint">({totalRjPackets} paket)</span>
                  </div>
                  <div className="tfoot-stock-sub">
                    <small className={`rj-stock-text ${isStockLow ? 'stock-low' : ''}`} title="1 paket = 4 RJ. Stok awal 200 pcs, berkurang otomatis setiap ada pembelian.">
                      <i className="fa-solid fa-boxes-stacked"></i> Stok RJ: <strong>{remainingStock} pcs</strong> / {initialStock} pcs
                    </small>
                  </div>
                </div>

                {/* 2. TOTAL KABEL TERJUAL (DI BAWAH RJ) */}
                <div className="tfoot-stock-item lan-item">
                  <div className="tfoot-stock-main">
                    <span className="lan-badge-icon" title="Kabel LAN">
                      <i className="fa-solid fa-ethernet"></i>
                    </span>
                    <span className="lan-sold-title">
                      Total Kabel: <strong>{totalLanSummary.orders} buah</strong>
                    </span>
                    <span className="lan-meters-hint">({totalLanSummary.meters} meter)</span>
                  </div>
                </div>
              </div>
            </td>

            {/* 4: PAYMENT (TULISAN PENDING & PAID) */}
            <td className="td-foot-payment">
              <div className="tfoot-totals">
                <div className="tfoot-stat stat-pending" title="Total pembayaran pending (belum bayar)">
                  <span className="tfoot-badge-pending">PENDING</span>
                  <span className="tfoot-val-pending">{formatRp(pendingTotal)}</span>
                </div>
                <div className="tfoot-stat stat-paid" title="Total pembayaran lunas (PAID)">
                  <span className="tfoot-badge-paid">PAID</span>
                  <span className="tfoot-val-paid">{formatRp(paidTotal)}</span>
                </div>
              </div>
            </td>

            {/* 5 & 6: STATUS & AKSI */}
            <td colSpan={2} className="td-foot-status">
              <div className="tfoot-status-summary">
                <span className="text-pending-dot">
                  <i className="fa-solid fa-clock"></i> {pendingCount} Pending
                </span>
                <span className="text-paid-dot">
                  <i className="fa-solid fa-circle-check"></i> {paidCount} Lunas
                </span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
