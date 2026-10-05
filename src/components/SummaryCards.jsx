import React from 'react';
import { formatRp } from '../data/initialData';

export default function SummaryCards({ balance, income, expense }) {
  return (
    <section className="top-cards-row">
      {/* 1. YOUR BALANCE */}
      <div className="summary-card card-balance">
        <div className="summary-card-header">
          <span className="card-title">YOUR BALANCE</span>
        </div>
        <div className="card-main-val">
          <h2>{formatRp(balance)}</h2>
        </div>
      </div>

      {/* 2. INCOME */}
      <div className="summary-card card-income">
        <div className="summary-card-header">
          <span className="card-title">INCOME</span>
        </div>
        <div className="card-main-val">
          <h2>{formatRp(income)}</h2>
        </div>
      </div>

      {/* 3. EXPENSE */}
      <div className="summary-card card-expense">
        <div className="summary-card-header">
          <span className="card-title">EXPENSE</span>
        </div>
        <div className="card-main-val">
          <h2>{formatRp(expense)}</h2>
        </div>
      </div>
    </section>
  );
}
