import React from 'react';
import { formatRp, formatDateTime } from '../data/initialData';

export default function TransactionList({
  transactions,
  onTogglePayment,
  onTogglePickup,
  onEditTransaction,
  onDeleteTransaction
}) {
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
            } else if (t.pickupStatus === 'Sedang Dirakit') {
              pickClass = 'btn-status-assembling';
              pickIcon = 'fa-screwdriver-wrench';
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
      </table>
    </div>
  );
}
