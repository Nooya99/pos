import React, { useState } from 'react';
import qrisImage from '../assets/qris.jpeg';

export default function QrisModal({ isOpen, onClose }) {
  const [zoom, setZoom] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2.5, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.75, Number((prev - 0.25).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div
      className="modal-backdrop open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1100 }}
    >
      <div className="modal-box qris-modal-box">
        <div className="modal-header">
          <h3>
            <i className="fa-solid fa-qrcode text-warning"></i>
            <span>QRIS Pembayaran</span>
          </h3>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* ZOOM CONTROLS TOOLBAR */}
        <div className="qris-zoom-bar">
          <div className="qris-zoom-group">
            <button
              type="button"
              className="btn-zoom"
              onClick={handleZoomOut}
              disabled={zoom <= 0.75}
              title="Perkecil"
            >
              <i className="fa-solid fa-magnifying-glass-minus"></i>
            </button>
            <span className="zoom-level-badge">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              className="btn-zoom"
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              title="Perbesar"
            >
              <i className="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            {zoom !== 1 && (
              <button
                type="button"
                className="btn-zoom-reset"
                onClick={handleResetZoom}
                title="Reset Ukuran"
              >
                Reset
              </button>
            )}
          </div>

          <a
            href={qrisImage}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-zoom-tab"
            title="Buka gambar ukuran penuh di tab baru"
          >
            <i className="fa-solid fa-up-right-from-square"></i> Tab Baru
          </a>
        </div>

        <div className="modal-body qris-modal-body">
          <div className="qris-image-container">
            <div
              className="qris-image-wrapper"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-out'
              }}
            >
              <img
                src={qrisImage}
                alt="QRIS Pembayaran Toko Kabel"
                className="qris-image"
              />
            </div>
          </div>

          <div className="qris-info-box">
            <p className="qris-info-text">
              <i className="fa-solid fa-camera"></i> Scan barcode di atas dengan aplikasi mobile banking atau e-wallet (BCA, Mandiri, GoPay, OVO, DANA, ShopeePay, dll).
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
