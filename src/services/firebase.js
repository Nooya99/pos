// src/services/firebase.js - Firebase Firestore Realtime Configuration & Services
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY'
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { db };

/**
 * Subscribe to Realtime Transactions
 */
export function subscribeTransactions(onUpdate, onError) {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const txList = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id
        }));
        onUpdate(txList);
      },
      (err) => {
        console.error('Realtime transactions snapshot error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.error('Error attaching transactions listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to Realtime Expenses
 */
export function subscribeExpenses(onUpdate, onError) {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const expList = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id
        }));
        onUpdate(expList);
      },
      (err) => {
        console.error('Realtime expenses snapshot error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.error('Error attaching expenses listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Save / Update a Transaction
 */
export async function saveTransactionToCloud(transaction) {
  if (!db) return;
  const docRef = doc(db, 'transactions', transaction.id);
  await setDoc(docRef, transaction, { merge: true });
}

/**
 * Delete a Transaction
 */
export async function deleteTransactionFromCloud(id) {
  if (!db) return;
  const docRef = doc(db, 'transactions', id);
  await deleteDoc(docRef);
}

/**
 * Save / Update an Expense
 */
export async function saveExpenseToCloud(expense) {
  if (!db) return;
  const docRef = doc(db, 'expenses', expense.id);
  await setDoc(docRef, expense, { merge: true });
}

/**
 * Delete an Expense
 */
export async function deleteExpenseFromCloud(id) {
  if (!db) return;
  const docRef = doc(db, 'expenses', id);
  await deleteDoc(docRef);
}
