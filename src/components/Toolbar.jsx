import React from 'react';

export default function Toolbar({
  totalCount,
  onOpenNewTransaction,
  onOpenQrisModal,
  onOpenExpenseManage,
  onRefreshData,
  isRefreshing = false
}) {
  return (
    <div className="table-sketch-header">
      <div className="sketch-title-box">
        <h2>DAFTAR TRANSAKSI</h2>
        <span className="trx-count-bubble" id="badge-total-transactions">
          {totalCount}
        </span>

      </div>

      <div className="sketch-toolbar-right">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          id="btn-open-pos-modal"
          onClick={onOpenNewTransaction}
        >
          <i className="fa-solid fa-cart-plus"></i>
          <span>+ Transaksi Baru</span>
        </button>

        <button
          type="button"
          className="btn btn-outline btn-sm btn-qris-toggle"
          id="btn-open-qris-modal"
          onClick={onOpenQrisModal}
          title="Tampilkan QRIS Pembayaran"
        >
          <i className="fa-solid fa-qrcode"></i>
          <span>QRIS</span>
        </button>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          id="btn-open-expense-list"
          onClick={onOpenExpenseManage}
        >
          <i className="fa-solid fa-receipt"></i>
          <span>Kelola Expense</span>
        </button>

        <button
          type="button"
          className={`btn-icon-square btn-refresh ${isRefreshing ? 'is-refreshing' : ''}`}
          id="btn-refresh-data"
          title="Refresh Data & Sinkronisasi"
          onClick={onRefreshData}
          disabled={isRefreshing}
        >
          <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? 'fa-spin' : ''}`}></i>
        </button>
      </div>
    </div>
  );
}
