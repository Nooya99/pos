import React from 'react';
import qrisImage from '../assets/qris.jpeg';

export default function QrisModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1100 }}
    >
      <div className="modal-box modal-box-md qris-modal-box">
        <div className="modal-header">
          <h3>
            <i className="fa-solid fa-qrcode text-warning"></i>
            <span>QRIS Pembayaran</span>
          </h3>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body qris-modal-body">
          <div className="qris-image-wrapper">
            <img
              src={qrisImage}
              alt="QRIS Pembayaran Toko Kabel"
              className="qris-image"
            />
          </div>

          <div className="qris-info-box">
            <p className="qris-info-text">
              <i className="fa-solid fa-camera"></i> Scan QRIS di atas menggunakan aplikasi perbankan atau e-wallet (BCA, Mandiri, GoPay, OVO, DANA, ShopeePay, dll).
            </p>
          </div>

          <div className="modal-actions-right">
            <a
              href={qrisImage}
              download="QRIS-KABEL.jpeg"
              className="btn btn-outline btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <i className="fa-solid fa-download"></i> Unduh QRIS
            </a>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
