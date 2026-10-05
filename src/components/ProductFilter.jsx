import React from 'react';

export default function ProductFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="product-subfilter-bar">
      <div className="prod-pills-label">
        <i className="fa-solid fa-filter"></i> Filter Produk:
      </div>
      <div className="product-pills" id="product-filter-pills">
        <button
          type="button"
          className={`prod-pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Semua Produk
        </button>
        <button
          type="button"
          className={`prod-pill pill-lan ${activeFilter === 'lan-only' ? 'active' : ''}`}
          onClick={() => onFilterChange('lan-only')}
        >
          <span className="dot-lan"></span> Kabel LAN
        </button>
        <button
          type="button"
          className={`prod-pill pill-rj ${activeFilter === 'rj-only' ? 'active' : ''}`}
          onClick={() => onFilterChange('rj-only')}
        >
          <span className="dot-rj"></span> RJ45
        </button>
        <button
          type="button"
          className={`prod-pill pill-combo ${activeFilter === 'both' ? 'active' : ''}`}
          onClick={() => onFilterChange('both')}
        >
          <span className="dot-combo"></span> Keduanya
        </button>
      </div>
    </div>
  );
}
