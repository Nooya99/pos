import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import SummaryCards from './components/SummaryCards';
import Toolbar from './components/Toolbar';
import ProductFilter from './components/ProductFilter';
import TransactionList from './components/TransactionList';
import PosModal from './components/PosModal';
import ExpenseModal from './components/ExpenseModal';
import QrisModal from './components/QrisModal';
import Toast from './components/Toast';
import {
  DEFAULT_TRANSACTIONS,
  DEFAULT_EXPENSES,
  DEFAULT_INITIAL_BALANCE,
  formatRp
} from './data/initialData';
import {
  isSupabaseConfigured,
  subscribeTransactions,
  subscribeExpenses,
  fetchTransactions,
  fetchExpenses,
  saveTransactionToCloud,
  deleteTransactionFromCloud,
  saveExpenseToCloud,
  deleteExpenseFromCloud
} from './services/supabase';

const STORAGE_KEY = 'kabel_pos_clean_v1';

export default function App() {
  // Clear any old mock data from previous versions
  useEffect(() => {
    localStorage.removeItem('kabel_pos_react_state_v1');
    localStorage.removeItem('kabel_pos_state_v3');
    localStorage.removeItem('kabel_pos_state_v2');
  }, []);

  // Load saved state or default
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.transactions) return parsed.transactions;
      }
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
    }
    return DEFAULT_TRANSACTIONS;
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expenses) return parsed.expenses;
      }
    } catch (e) {
      console.error('Failed to load expenses from localStorage', e);
    }
    return DEFAULT_EXPENSES;
  });

  const [initialBalance, setInitialBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.initialBalance !== undefined) return parsed.initialBalance;
      }
    } catch (e) {
      console.error('Failed to load initialBalance from localStorage', e);
    }
    return DEFAULT_INITIAL_BALANCE;
  });

  const [productFilter, setProductFilter] = useState('all');
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // REALTIME SUBSCRIPTION VIA SUPABASE
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const unsubTx = subscribeTransactions(
      (cloudTransactions) => {
        if (cloudTransactions && cloudTransactions.length > 0) {
          setTransactions(cloudTransactions);
        } else {
          // If cloud is empty but local has transactions, sync local to cloud
          setTransactions((prev) => {
            if (prev && prev.length > 0) {
              prev.forEach((tx) => saveTransactionToCloud(tx));
              return prev;
            }
            return cloudTransactions || [];
          });
        }
      },
      (error) => {
        console.error('Supabase transactions error:', error);
        showToast(`Koneksi Supabase: ${error.message || 'Gagal memuat transaksi'}`, 'danger');
      }
    );

    const unsubExp = subscribeExpenses(
      (cloudExpenses) => {
        if (cloudExpenses && cloudExpenses.length > 0) {
          setExpenses(cloudExpenses);
        } else {
          setExpenses((prev) => {
            if (prev && prev.length > 0) {
              prev.forEach((exp) => saveExpenseToCloud(exp));
              return prev;
            }
            return cloudExpenses || [];
          });
        }
      },
      (error) => {
        console.error('Supabase expenses error:', error);
      }
    );

    return () => {
      unsubTx();
      unsubExp();
    };
  }, []);

  // Local storage backup
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transactions,
          expenses,
          initialBalance
        })
      );
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [transactions, expenses, initialBalance]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Calculations
  const income = useMemo(() => {
    return transactions
      .filter((t) => t.paymentStatus === 'PAID')
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0);
  }, [transactions]);

  const pendingIncome = useMemo(() => {
    return transactions
      .filter((t) => t.paymentStatus === 'PENDING')
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const balance = useMemo(() => {
    return initialBalance + income - totalExpense;
  }, [initialBalance, income, totalExpense]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (productFilter === 'lan-only' && t.productCategory !== 'lan-only') return false;
      if (productFilter === 'rj-only' && t.productCategory !== 'rj-only') return false;
      if (productFilter === 'both' && t.productCategory !== 'both') return false;
      return true;
    });
  }, [transactions, productFilter]);

  const filteredPendingTotal = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.paymentStatus === 'PENDING')
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0);
  }, [filteredTransactions]);

  const filteredPaidTotal = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.paymentStatus === 'PAID')
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0);
  }, [filteredTransactions]);

  const filteredRjPackets = useMemo(() => {
    return filteredTransactions
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
  }, [filteredTransactions]);

  const filteredRjSold = filteredRjPackets * 4;
  const initialRjStock = 200;
  const remainingRjStock = Math.max(0, initialRjStock - filteredRjSold);

  const filteredLanSummary = useMemo(() => {
    return filteredTransactions
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
  }, [filteredTransactions]);

  // Handlers
  const handleOpenNewTransaction = () => {
    setEditTransaction(null);
    setIsPosModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditTransaction(tx);
    setIsPosModalOpen(true);
  };

  const handleSavePos = async (data) => {
    if (data.id) {
      // Edit existing
      const existing = transactions.find((t) => t.id === data.id);
      const merged = { ...existing, ...data };
      setTransactions((prev) =>
        prev.map((t) => (t.id === data.id ? merged : t))
      );
      if (isSupabaseConfigured) {
        const res = await saveTransactionToCloud(merged);
        if (res?.error) {
          showToast(`Gagal simpan ke Supabase: ${res.error.message}`, 'danger');
        } else {
          showToast(`Pesanan ${data.customerName} berhasil diperbarui di cloud!`, 'success');
        }
      } else {
        showToast(`Pesanan ${data.customerName} berhasil diperbarui!`, 'success');
      }
    } else {
      // New transaction
      const now = new Date();
      const invoiceId = `INV-${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(
        100 + Math.random() * 900
      )}`;

      const newTx = {
        ...data,
        id: invoiceId,
        date: now.toISOString(),
        customerPhone: '',
        notes: ''
      };

      setTransactions((prev) => [newTx, ...prev]);
      if (isSupabaseConfigured) {
        const res = await saveTransactionToCloud(newTx);
        if (res?.error) {
          showToast(`Perhatian: Gagal simpan ke Supabase (${res.error.message}). Disimpan di lokal.`, 'danger');
        } else {
          showToast(
            `Transaksi baru ${data.customerName} (${formatRp(data.total)}) berhasil disimpan ke cloud!`,
            'success'
          );
        }
      } else {
        showToast(
          `Transaksi baru ${data.customerName} (${formatRp(data.total)}) berhasil disimpan!`,
          'success'
        );
      }

      // Celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (err) {}
    }
    setIsPosModalOpen(false);
  };

  const handleTogglePayment = async (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    const nextStatus = tx.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
    const updated = { ...tx, paymentStatus: nextStatus };

    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    if (isSupabaseConfigured) {
      const res = await saveTransactionToCloud(updated);
      if (res?.error) {
        showToast(`Gagal update status di Supabase: ${res.error.message}`, 'danger');
        return;
      }
    }
    showToast(`Status bayar ${tx.customerName}: ${nextStatus}`, 'info');
  };

  const handleTogglePickup = async (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    const nextStatus =
      tx.pickupStatus === 'Sudah Diambil' ? 'Belum Diambil' : 'Sudah Diambil';
    const updated = { ...tx, pickupStatus: nextStatus };

    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    if (isSupabaseConfigured) {
      const res = await saveTransactionToCloud(updated);
      if (res?.error) {
        showToast(`Gagal update status di Supabase: ${res.error.message}`, 'danger');
        return;
      }
    }
    showToast(`Status ambil ${tx.customerName}: ${nextStatus}`, 'info');
  };

  const handleDeleteTransaction = async (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    if (window.confirm(`Hapus transaksi ${tx.customerName} (${formatRp(tx.total)})?`)) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      if (isSupabaseConfigured) {
        const res = await deleteTransactionFromCloud(id);
        if (res?.error) {
          showToast(`Gagal hapus dari Supabase: ${res.error.message}`, 'danger');
        }
      }
      showToast(`Transaksi ${tx.customerName} dihapus`, 'info');
    }
  };

  const handleAddExpense = async (expData) => {
    const newExp = {
      ...expData,
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString()
    };
    setExpenses((prev) => [newExp, ...prev]);
    if (isSupabaseConfigured) {
      const res = await saveExpenseToCloud(newExp);
      if (res?.error) {
        showToast(`Gagal simpan expense ke Supabase: ${res.error.message}`, 'danger');
        return;
      }
    }
    showToast(`Expense ${formatRp(expData.amount)} berhasil dicatat`, 'success');
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm(`Hapus catatan expense ${id}?`)) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      if (isSupabaseConfigured) {
        const res = await deleteExpenseFromCloud(id);
        if (res?.error) {
          showToast(`Gagal hapus expense dari Supabase: ${res.error.message}`, 'danger');
          return;
        }
      }
      showToast(`Expense ${id} dihapus`, 'info');
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      if (isSupabaseConfigured) {
        const [txRes, expRes] = await Promise.all([
          fetchTransactions(),
          fetchExpenses()
        ]);

        if (txRes.error) {
          throw new Error(txRes.error.message || 'Gagal memuat transaksi');
        }
        if (expRes.error) {
          throw new Error(expRes.error.message || 'Gagal memuat pengeluaran');
        }

        if (txRes.data) {
          setTransactions(txRes.data);
        }
        if (expRes.data) {
          setExpenses(expRes.data);
        }
        showToast('Data berhasil diperbarui (Refresh)!', 'success');
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.transactions) setTransactions(parsed.transactions);
          if (parsed.expenses) setExpenses(parsed.expenses);
        }
        showToast('Data lokal berhasil di-refresh!', 'info');
      }
    } catch (err) {
      console.error('Refresh error:', err);
      showToast(`Gagal refresh data: ${err.message}`, 'danger');
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 400);
    }
  };

  return (
    <div className="sketch-container">
      {/* 3 KARTU SUMMARY DI ATAS */}
      <SummaryCards
        balance={balance}
        income={income}
        expense={totalExpense}
        pendingIncome={pendingIncome}
      />

      {/* DAFTAR TRANSAKSI & TOOLBAR */}
      <main className="main-table-container">
        <Toolbar
          totalCount={filteredTransactions.length}
          onOpenNewTransaction={handleOpenNewTransaction}
          onOpenQrisModal={() => setIsQrisModalOpen(true)}
          onOpenExpenseManage={() => setIsExpenseModalOpen(true)}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        <ProductFilter
          activeFilter={productFilter}
          onFilterChange={setProductFilter}
        />

        <TransactionList
          transactions={filteredTransactions}
          onTogglePayment={handleTogglePayment}
          onTogglePickup={handleTogglePickup}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />

        <div className="table-sketch-footer">
          <div className="footer-summary-left">
            <span>
              Menampilkan <strong>{filteredTransactions.length}</strong> transaksi
            </span>
          </div>
          <div className="footer-summary-right">
            <div className="footer-stat-chip chip-rj" title="Total RJ45 terjual dan sisa stok dari 200 pcs">
              <i className="fa-solid fa-microchip"></i>
              <span>Total RJ:</span>
              <strong>{filteredRjSold} RJ</strong>
              <span className="chip-stock-sub">({filteredRjPackets} pkt | Stok: {remainingRjStock} pcs)</span>
            </div>
            <div className="footer-stat-chip chip-lan" title="Total Kabel LAN terjual">
              <i className="fa-solid fa-ethernet"></i>
              <span>Total Kabel:</span>
              <strong>{filteredLanSummary.orders} buah</strong>
              <span className="chip-stock-sub">({filteredLanSummary.meters} meter)</span>
            </div>
            <div className="footer-stat-chip chip-pending" title="Total tagihan yang belum dibayar (PENDING)">
              <i className="fa-solid fa-clock"></i>
              <span>Total RP Pending:</span>
              <strong>{formatRp(filteredPendingTotal)}</strong>
            </div>
            <div className="footer-stat-chip chip-paid" title="Total tagihan yang sudah lunas (PAID)">
              <i className="fa-solid fa-circle-check"></i>
              <span>Total Masuk:</span>
              <strong>{formatRp(filteredPaidTotal)}</strong>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL TRANSAKSI BARU / EDIT */}
      <PosModal
        isOpen={isPosModalOpen}
        onClose={() => setIsPosModalOpen(false)}
        onSave={handleSavePos}
        editTransaction={editTransaction}
      />

      {/* MODAL KELOLA EXPENSE */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        expenses={expenses}
        onAddExpense={handleAddExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* MODAL POPUP QRIS */}
      <QrisModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
      />

      {/* TOAST NOTIFIKASI */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
