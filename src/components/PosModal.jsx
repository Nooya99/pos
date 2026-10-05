import React, { useState, useEffect } from 'react';
import { formatRp } from '../data/initialData';

export default function PosModal({
  isOpen,
  onClose,
  onSave,
  editTransaction
}) {
  const [name, setName] = useState('');
  const [checkLan, setCheckLan] = useState(true);
  const [checkRj, setCheckRj] = useState(true);
  const [lanQty, setLanQty] = useState(1);
  const [rjQty, setRjQty] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [pickupStatus, setPickupStatus] = useState('Belum Diambil');

  const [isCustomTotal, setIsCustomTotal] = useState(false);
  const [customTotal, setCustomTotal] = useState('');

  // When modal opens or editTransaction changes, populate state
  useEffect(() => {
    if (!isOpen) return;

    if (editTransaction) {
      setName(editTransaction.customerName || '');
      const hasLan = editTransaction.items?.some((it) => it.type === 'lan');
      const hasRj = editTransaction.items?.some((it) => it.type === 'rj');
      setCheckLan(hasLan);
      setCheckRj(hasRj);

      const lanItem = editTransaction.items?.find((it) => it.type === 'lan');
      const lQty = lanItem ? lanItem.qty : 1;
      setLanQty(lQty);

      const rjItem = editTransaction.items?.find((it) => it.type === 'rj');
      const rQty = rjItem ? rjItem.qty : 1;
      setRjQty(rQty);

      setPaymentStatus(editTransaction.paymentStatus || 'PENDING');
      setPickupStatus(editTransaction.pickupStatus || 'Belum Diambil');

      const expectedTotal =
        (hasLan ? Math.max(0, Number(lQty) || 0) * 5000 : 0) +
        (hasRj ? Math.max(0, Number(rQty) || 0) * 5000 : 0);

      if (
        editTransaction.total !== undefined &&
        editTransaction.total !== null &&
        Number(editTransaction.total) !== expectedTotal
      ) {
        setIsCustomTotal(true);
        setCustomTotal(Number(editTransaction.total));
      } else {
        setIsCustomTotal(false);
        setCustomTotal('');
      }
    } else {
      // Default creation state
      setName('');
      setCheckLan(true);
      setCheckRj(true);
      setLanQty(1);
      setRjQty(1);
      setPaymentStatus('PENDING');
      setPickupStatus('Belum Diambil');
      setIsCustomTotal(false);
      setCustomTotal('');
    }
  }, [isOpen, editTransaction]);

  if (!isOpen) return null;

  // Price calculations
  // Kabel LAN: 5000 / meter
  const lanPrice = 5000;
  const lanSubtotal = checkLan ? Math.max(0, Number(lanQty) || 0) * lanPrice : 0;

  // RJ45: 1 paket = 4 buah = 5000
  const rjPrice = 5000;
  const rjSubtotal = checkRj ? Math.max(0, Number(rjQty) || 0) * rjPrice : 0;

  const calculatedTotal = lanSubtotal + rjSubtotal;
  const grandTotal = isCustomTotal
    ? (customTotal === '' ? 0 : Math.max(0, Number(customTotal) || 0))
    : calculatedTotal;

  const displayTotal = isCustomTotal
    ? (customTotal === '' ? '' : Number(customTotal).toLocaleString('id-ID'))
    : calculatedTotal.toLocaleString('id-ID');

  const handleTotalChange = (e) => {
    setIsCustomTotal(true);
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) {
      setCustomTotal('');
    } else {
      setCustomTotal(Number(digits));
    }
  };

  const handleResetTotal = () => {
    setIsCustomTotal(false);
    setCustomTotal('');
  };

  let detectedCategory = 'PILIH MINIMAL 1 PRODUK';
  if (checkLan && checkRj) detectedCategory = 'KABEL LAN + RJ45';
  else if (checkLan) detectedCategory = 'KABEL LAN';
  else if (checkRj) detectedCategory = 'RJ45';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Harap isi Nama Pembeli!');
      return;
    }
    if (!checkLan && !checkRj) {
      alert('Pilih minimal Kabel LAN atau RJ45 yang dibeli!');
      return;
    }

    const items = [];
    if (checkLan) {
      const q = Math.max(1, Number(lanQty) || 1);
      items.push({
        name: 'Kabel LAN',
        type: 'lan',
        qty: q,
        unit: 'meter',
        price: lanPrice,
        subtotal: q * lanPrice
      });
    }

    if (checkRj) {
      const q = Math.max(1, Number(rjQty) || 1);
      items.push({
        name: `Konektor RJ45 (${q * 4} pcs)`,
        type: 'rj',
        qty: q,
        unit: 'paket (4 pcs)',
        price: rjPrice,
        subtotal: q * rjPrice
      });
    }

    let prodCat = 'both';
    if (checkLan && checkRj) prodCat = 'both';
    else if (checkLan) prodCat = 'lan-only';
    else prodCat = 'rj-only';

    onSave({
      id: editTransaction ? editTransaction.id : null,
      customerName: name.trim(),
      productCategory: prodCat,
      items,
      subtotal: grandTotal,
      total: grandTotal,
      paymentStatus,
      pickupStatus,
      paymentMethod: editTransaction?.paymentMethod || 'Tunai / Cash',
      ...(editTransaction?.date ? { date: editTransaction.date } : {}),
      ...(editTransaction?.customerPhone ? { customerPhone: editTransaction.customerPhone } : {}),
      ...(editTransaction?.notes ? { notes: editTransaction.notes } : {})
    });
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-box modal-box-md">
        <div className="modal-header">
          <h3>
            <i
              className={`fa-solid ${
                editTransaction ? 'fa-pen-to-square' : 'fa-cart-plus'
              }`}
            ></i>
            <span>
              {editTransaction
                ? 'Edit Pesanan (Kabel & RJ45)'
                : 'Transaksi Baru (Kabel & RJ45)'}
            </span>
          </h3>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* 1. NAMA */}
            <div className="form-field">
              <label htmlFor="pos-name">
                NAMA PEMBELI <span className="required">*</span>
              </label>
              <input
                type="text"
                id="pos-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama pembeli..."
                required
                autoFocus
              />
            </div>

            {/* 2. CHECKBOX KABEL */}
            <div
              className={`product-select-panel ${
                checkLan ? 'active-lan' : ''
              }`}
              id="panel-prod-lan"
            >
              <div className="panel-header-check">
                <label className="check-container">
                  <input
                    type="checkbox"
                    id="check-lan"
                    checked={checkLan}
                    onChange={(e) => setCheckLan(e.target.checked)}
                  />
                  <span className="custom-check"></span>
                  <span className="label-prod prod-a-text">KABEL LAN</span>
                </label>
                <span className="panel-subtotal">
                  {formatRp(lanSubtotal)}
                </span>
              </div>

              {checkLan && (
                <div className="panel-content-body">
                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="lan-qty">Jumlah (Meter)</label>
                      <input
                        type="number"
                        id="lan-qty"
                        min="1"
                        max="10000"
                        value={lanQty}
                        onChange={(e) => setLanQty(Math.max(1, Number(e.target.value)))}
                      />
                      <div className="quick-tags">
                        <button
                          type="button"
                          className="btn-tag"
                          onClick={() => setLanQty(1)}
                        >
                          1m
                        </button>
                        <button
                          type="button"
                          className="btn-tag"
                          onClick={() => setLanQty(5)}
                        >
                          5m
                        </button>
                        <button
                          type="button"
                          className="btn-tag"
                          onClick={() => setLanQty(10)}
                        >
                          10m
                        </button>
                        <button
                          type="button"
                          className="btn-tag"
                          onClick={() => setLanQty(20)}
                        >
                          20m
                        </button>
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Harga Kabel</label>
                      <div className="fixed-price-tag">Rp 5.000 / meter</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. CHECKBOX RJ45 */}
            <div
              className={`product-select-panel ${
                checkRj ? 'active-rj' : ''
              }`}
              id="panel-prod-rj"
            >
              <div className="panel-header-check">
                <label className="check-container">
                  <input
                    type="checkbox"
                    id="check-rj"
                    checked={checkRj}
                    onChange={(e) => setCheckRj(e.target.checked)}
                  />
                  <span className="custom-check"></span>
                  <span className="label-prod prod-b-text">RJ45</span>
                </label>
                <span className="panel-subtotal">
                  {formatRp(rjSubtotal)}
                </span>
              </div>

              {checkRj && (
                <div className="panel-content-body">
                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="rj-qty">
                        Jumlah (1 Paket = 4 Buah)
                      </label>
                      <input
                        type="number"
                        id="rj-qty"
                        min="1"
                        max="1000"
                        value={rjQty}
                        onChange={(e) => setRjQty(Math.max(1, Number(e.target.value)))}
                      />
                      <div className="quick-tags">
                        <button
                          type="button"
                          className="btn-tag"
                          onClick={() => setRjQty(1)}
                        >
                          1 Paket (4 bh)
                        </button>
                        <button
                          type="button"
                          className="btn-tag"
                          onClick={() => setRjQty(2)}
                        >
                          2 Paket (8 bh)
                        </button>
                        <button
                          type="button"
                          className="btn-tag"
                          onClick={() => setRjQty(5)}
                        >
                          5 Paket (20 bh)
                        </button>
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Harga RJ45</label>
                      <div className="fixed-price-tag">
                        4 buah = Rp 5.000
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. STATUS PEMBAYARAN & PENGAMBILAN */}
            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="pos-payment-status">Status Pembayaran</label>
                <select
                  id="pos-payment-status"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="PENDING">Belum Bayar (PENDING)</option>
                  <option value="PAID">Sudah Bayar (PAID)</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="pos-pickup-status">Status Pengambilan</label>
                <select
                  id="pos-pickup-status"
                  value={pickupStatus}
                  onChange={(e) => setPickupStatus(e.target.value)}
                >
                  <option value="Belum Diambil">Belum Diambil</option>
                  <option value="Sudah Diambil">Sudah Diambil</option>
                </select>
              </div>
            </div>

            {/* 5. TOTAL HARGA (BISA DIEDIT) */}
            <div className="pos-total-callout">
              <div className="total-info">
                <div className="total-label-row">
                  <label htmlFor="pos-calc-grand-total">Total Harga:</label>
                  {isCustomTotal && (
                    <button
                      type="button"
                      className="btn-reset-total"
                      onClick={handleResetTotal}
                      title="Kembalikan ke hitungan harga otomatis dari item"
                    >
                      <i className="fa-solid fa-rotate-left"></i> Reset Otomatis
                    </button>
                  )}
                </div>

                <div className="total-input-box">
                  <span className="total-currency-prefix">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="pos-calc-grand-total"
                    className="pos-total-input-field"
                    value={displayTotal}
                    onChange={handleTotalChange}
                    placeholder="0"
                    title="Klik untuk mengubah total harga secara manual"
                  />
                  <label
                    htmlFor="pos-calc-grand-total"
                    className="total-edit-icon"
                    title="Total harga dapat diedit manual"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </label>
                </div>

                {isCustomTotal && (
                  <div className="custom-total-notice">
                    <i className="fa-solid fa-circle-info"></i> Diubah manual (Standar item: {formatRp(calculatedTotal)})
                  </div>
                )}
              </div>
              <div className="total-badge-category" id="pos-detected-category">
                {detectedCategory}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="btn-save-pos"
            >
              <i className="fa-solid fa-check"></i>
              <span>{editTransaction ? 'Simpan Perubahan' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
