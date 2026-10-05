import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import SummaryCards from './components/SummaryCards';
import Toolbar from './components/Toolbar';
import ProductFilter from './components/ProductFilter';
import TransactionList from './components/TransactionList';
import PosModal from './components/PosModal';
import ExpenseModal from './components/ExpenseModal';
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
  const [toast, setToast] = useState(null);

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
      setTransactions((prev) =>
        prev.map((t) => (t.id === data.id ? { ...t, ...data } : t))
      );
      if (isSupabaseConfigured) {
        const res = await saveTransactionToCloud(data);
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

  const handleResetData = () => {
    if (window.confirm('Reset seluruh data transaksi dan expense?')) {
      localStorage.removeItem(STORAGE_KEY);
      setTransactions(DEFAULT_TRANSACTIONS);
      setExpenses(DEFAULT_EXPENSES);
      setInitialBalance(DEFAULT_INITIAL_BALANCE);
      setProductFilter('all');
      showToast('Semua data berhasil dibersihkan', 'info');
    }
  };

  return (
    <div className="sketch-container">
      {/* 3 KARTU SUMMARY DI ATAS */}
      <SummaryCards
        balance={balance}
        income={income}
        expense={totalExpense}
      />

      {/* DAFTAR TRANSAKSI & TOOLBAR */}
      <main className="main-table-container">
        <Toolbar
          totalCount={filteredTransactions.length}
          onOpenNewTransaction={handleOpenNewTransaction}
          onOpenExpenseManage={() => setIsExpenseModalOpen(true)}
          onResetData={handleResetData}
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

      {/* TOAST NOTIFIKASI */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
