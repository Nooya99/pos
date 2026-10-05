// src/services/supabase.js - Supabase Configuration & Services
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all and subscribe to Realtime Transactions
 */
export function subscribeTransactions(onUpdate, onError) {
  if (!supabase) return () => {};

  let currentData = [];

  // Initial fetch
  supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        if (onError) onError(error);
        return;
      }
      currentData = data || [];
      onUpdate(currentData);
    });

  // Subscribe to changes
  const channel = supabase
    .channel('public:transactions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'transactions' },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          currentData = [payload.new, ...currentData].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (payload.eventType === 'UPDATE') {
          currentData = currentData.map(item => item.id === payload.new.id ? payload.new : item);
          currentData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (payload.eventType === 'DELETE') {
          currentData = currentData.filter(item => item.id !== payload.old.id);
        }
        onUpdate(currentData);
      }
    )
    .subscribe((status, err) => {
      if (err && onError) onError(err);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Fetch all and subscribe to Realtime Expenses
 */
export function subscribeExpenses(onUpdate, onError) {
  if (!supabase) return () => {};

  let currentData = [];

  // Initial fetch
  supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        if (onError) onError(error);
        return;
      }
      currentData = data || [];
      onUpdate(currentData);
    });

  // Subscribe to changes
  const channel = supabase
    .channel('public:expenses')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'expenses' },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          currentData = [payload.new, ...currentData].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (payload.eventType === 'UPDATE') {
          currentData = currentData.map(item => item.id === payload.new.id ? payload.new : item);
          currentData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (payload.eventType === 'DELETE') {
          currentData = currentData.filter(item => item.id !== payload.old.id);
        }
        onUpdate(currentData);
      }
    )
    .subscribe((status, err) => {
      if (err && onError) onError(err);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Save / Update a Transaction
 */
export async function saveTransactionToCloud(transaction) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('transactions')
    .upsert(transaction);
  if (error) console.error("Error saving transaction:", error);
  return { data, error };
}

/**
 * Delete a Transaction
 */
export async function deleteTransactionFromCloud(id) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  if (error) console.error("Error deleting transaction:", error);
  return { data, error };
}

/**
 * Save / Update an Expense
 */
export async function saveExpenseToCloud(expense) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('expenses')
    .upsert(expense);
  if (error) console.error("Error saving expense:", error);
  return { data, error };
}

/**
 * Delete an Expense
 */
export async function deleteExpenseFromCloud(id) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
  if (error) console.error("Error deleting expense:", error);
  return { data, error };
}
