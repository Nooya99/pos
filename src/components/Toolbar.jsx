import React from 'react';

export default function Toolbar({
  totalCount,
  onOpenNewTransaction,
  onOpenExpenseManage,
  onResetData
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
          className="btn btn-outline btn-sm"
          id="btn-open-expense-list"
          onClick={onOpenExpenseManage}
        >
          <i className="fa-solid fa-receipt"></i>
          <span>Kelola Expense</span>
        </button>

        <button
          type="button"
          className="btn-icon-square"
          id="btn-reset-data"
          title="Reset ke Data Sample"
          onClick={onResetData}
        >
          <i className="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>
  );
}
