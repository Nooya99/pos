import React, { useState } from 'react';
import { formatRp, formatDateOnly } from '../data/initialData';

export default function ExpenseModal({
  isOpen,
  onClose,
  expenses,
  onAddExpense,
  onDeleteExpense
}) {
  const [category, setCategory] = useState('Stok Kabel LAN');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount) || 0;
    if (!desc.trim() || numAmount <= 0) {
      alert('Isi deskripsi dan nominal belanja yang valid!');
      return;
    }

    onAddExpense({
      category,
      description: desc.trim(),
      amount: numAmount
    });

    setDesc('');
    setAmount('');
  };

  return (
    <div className="modal-backdrop open" id="modal-expense-manage">
      <div className="modal-box modal-box-lg">
        <div className="modal-header">
          <h3>
            <i className="fa-solid fa-arrow-trend-down text-danger"></i>
            <span>Daftar &amp; Catat Expense (Pengeluaran)</span>
          </h3>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* FORM CEPAT TAMBAH EXPENSE */}
          <form onSubmit={handleSubmit} className="inline-add-box">
            <h4>+ Catat Pengeluaran Baru:</h4>
            <div className="form-row-4">
              <div className="form-field">
                <label htmlFor="exp-cat">Kategori</label>
                <select
                  id="exp-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="Stok Kabel LAN">Stok Kabel LAN</option>
                  <option value="Stok RJ45">Stok RJ45</option>
                  <option value="Peralatan & Tools">Tang Crimping / Tester</option>
                  <option value="Operasional">Operasional / Listrik / Wifi</option>
                  <option value="Transport / Ongkir">Transport / Ongkir</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="exp-desc">Keterangan Belanja</label>
                <input
                  type="text"
                  id="exp-desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Contoh: Beli 2 Roll Kabel Cat6 Belden"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="exp-amount">Nominal (Rp)</label>
                <input
                  type="number"
                  id="exp-amount"
                  min="1000"
                  step="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Contoh: 1250000"
                  required
                />
              </div>

              <div className="form-field submit-col">
                <label>&nbsp;</label>
                <button type="submit" className="btn btn-danger btn-block">
                  <i className="fa-solid fa-plus"></i> Simpan
                </button>
              </div>
            </div>
          </form>

          {/* TABEL LIST EXPENSE (Desktop Table, Mobile Cards) */}
          <div className="sub-table-wrapper">
            <table className="sketch-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Tanggal</th>
                  <th style={{ width: '150px' }}>Kategori</th>
                  <th>Keterangan</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Nominal</th>
                  <th style={{ width: '60px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody-expenses">
                {expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        padding: '24px'
                      }}
                    >
                      Belum ada catatan expense.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="td-date" style={{ whiteSpace: 'nowrap' }}>
                        {formatDateOnly(exp.date)}
                      </td>
                      <td>
                        <span className="exp-cat-pill">{exp.category}</span>
                      </td>
                      <td>
                        <strong>{exp.description}</strong>
                      </td>
                      <td
                        className="text-danger"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          textAlign: 'right',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {formatRp(exp.amount)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-tbl-action btn-del"
                          onClick={() => onDeleteExpense(exp.id)}
                          title="Hapus"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
