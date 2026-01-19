import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  doc, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';
import { 
  Plus, Trash2, Wallet, TrendingUp, Download, Search, Pencil, 
  AlertCircle, Moon, Sun, X, Check, ChevronLeft, ChevronRight, 
  ArrowUpRight, ArrowDownRight, Filter, Calendar, LogOut, Lock,
  AlertTriangle, CreditCard, Banknote, Landmark, PieChart,
  ArrowUpDown, List as ListIcon, LayoutGrid, CalendarRange, BarChart3,
  Flame, PiggyBank, HandCoins, Target, User, Settings, Smartphone
} from 'lucide-react';

// ==========================================
// 🚀 STEP 1: FIREBASE CONFIGURATION
// ==========================================
const userFirebaseConfig = {
  apiKey: "AIzaSyBsb-1ondR3cyGnYg93IDl4rG8AObbPZK4",
  authDomain: "pemanager-49940.firebaseapp.com",
  projectId: "pemanager-49940",
  storageBucket: "pemanager-49940.firebasestorage.app",
  messagingSenderId: "816708859299",
  appId: "1:816708859299:web:c4f2232cdc1bc085065616",
  measurementId: "G-K6B3D825LG"
};

// ==========================================
// 🔒 STEP 2: SET YOUR GMAIL ADDRESS HERE
// ==========================================
const ALLOWED_EMAIL = "vivekdn2504@gmail.com"; 

// --- Initialization Logic ---
const isConfigured = userFirebaseConfig.apiKey !== "YOUR_API_KEY";
const firebaseConfig = isConfigured ? userFirebaseConfig : (typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : userFirebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

// --- Components ---

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const bg = type === 'error' ? 'bg-red-500' : 'bg-indigo-600';
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white font-medium text-sm flex items-center gap-2 z-[90] animate-fade-in-down ${bg}`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4"/> : <Check className="w-4 h-4"/>}
      {message}
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDarkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-xs p-6 rounded-3xl shadow-2xl scale-100 transition-all ${isDarkMode ? 'bg-[#1c1c1f] text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Wallet className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
      <p className="text-gray-500 mb-8 text-sm">Personal Expense Manager<br/>Secure Login</p>
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      <button onClick={onLogin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
        Sign in with Google
      </button>
      <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">Restricted Access</p>
      <p className="text-xs text-gray-500 font-mono mt-1">{ALLOWED_EMAIL}</p>
    </div>
  </div>
);

const SetupScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 font-mono text-sm">
    <div className="max-w-2xl w-full space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center animate-pulse"><Lock className="w-6 h-6" /></div>
        <div><h1 className="text-xl font-bold">Setup Required</h1><p className="text-gray-400">Connect your Firebase project</p></div>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700"><h3 className="font-bold text-indigo-400 mb-2">Step 1: Get Config</h3><p className="text-gray-300">Firebase Console &gt; Project Settings.</p></div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700"><h3 className="font-bold text-indigo-400 mb-2">Step 2: Update Code</h3><p className="text-gray-300">Update lines 26-33.</p></div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700"><h3 className="font-bold text-indigo-400 mb-2">Step 3: Set Email</h3><p className="text-gray-300">Update line 40.</p></div>
      </div>
    </div>
  </div>
);

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]); // SAVINGS GOALS
  const [debts, setDebts] = useState([]); // DEBT TRACKER
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [toast, setToast] = useState(null);

  // --- UI State ---
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, collection: 'expenses' });
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'insights' | 'goals' | 'debt'
  const [sortMode, setSortMode] = useState('date');
  
  // --- Filter State ---
  const [filterMode, setFilterMode] = useState('month'); 
  const [referenceDate, setReferenceDate] = useState(new Date()); 
  const [customRange, setCustomRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10),
    end: new Date().toISOString().slice(0,10)
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [budget, setBudget] = useState(() => localStorage.getItem('monthly_budget') || '20000');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  
  // Category Budgeting State
  const [catBudgets, setCatBudgets] = useState(() => {
      try { return JSON.parse(localStorage.getItem('cat_budgets')) || {} } catch { return {} }
  });
  const [isEditingCatBudget, setIsEditingCatBudget] = useState(false);

  // --- Categories State ---
  const expenseCategories = ['Groceries', 'Food', 'Transport', 'Rent', 'Bills', 'Shopping', 'Health', 'Fun', 'Travel'];
  const incomeCategories = ['Salary', 'Bonus', 'Freelance', 'Other'];
  const [customCategories, setCustomCategories] = useState(() => {
    try { const saved = localStorage.getItem('custom_categories'); return saved ? JSON.parse(saved) : []; } catch(e) { return [] }
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // --- Payment Modes State ---
  const [paymentModes, setPaymentModes] = useState(() => {
    try { const saved = localStorage.getItem('payment_modes'); return saved ? JSON.parse(saved) : ['Cash', 'UPI', 'Bank Account', 'Credit Card']; } catch(e) { return ['Cash', 'UPI', 'Bank Account', 'Credit Card'] }
  });
  const [isAddingPaymentMode, setIsAddingPaymentMode] = useState(false);
  const [newPaymentModeName, setNewPaymentModeName] = useState('');

  // --- Form State (Shared for all types) ---
  const [formType, setFormType] = useState('expense'); // 'expense'|'income'|'goal'|'debt'
  const [editingId, setEditingId] = useState(null);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState(''); // For Goal/Debt Title or Category
  const [paymentMode, setPaymentMode] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Additional fields for Goals/Debts
  const [targetAmount, setTargetAmount] = useState(''); // Goal Target
  const [debtType, setDebtType] = useState('borrowed'); // 'lent' | 'borrowed'

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return; }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) {
        if (currentUser.email === ALLOWED_EMAIL) {
           setUser(currentUser);
           setAuthError(null);
        } else {
           signOut(auth);
           setAuthError(`Access Denied: ${currentUser.email} is not authorized.`);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Data
  useEffect(() => {
    if (!user) return;
    
    // Transactions
    const expUnsub = onSnapshot(collection(db, 'users', user.uid, 'expenses'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate() || new Date() }));
      data.sort((a, b) => b.date - a.date);
      setTransactions(data);
    });

    // Goals
    const goalUnsub = onSnapshot(collection(db, 'users', user.uid, 'goals'), (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Debts
    const debtUnsub = onSnapshot(collection(db, 'users', user.uid, 'debts'), (snap) => {
      setDebts(snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate() || new Date() })));
    });

    return () => { expUnsub(); goalUnsub(); debtUnsub(); };
  }, [user]);

  useEffect(() => { localStorage.setItem('monthly_budget', budget); }, [budget]);
  useEffect(() => { localStorage.setItem('custom_categories', JSON.stringify(customCategories)); }, [customCategories]);
  useEffect(() => { localStorage.setItem('payment_modes', JSON.stringify(paymentModes)); }, [paymentModes]);
  useEffect(() => { localStorage.setItem('cat_budgets', JSON.stringify(catBudgets)); }, [catBudgets]);

  // --- Handlers ---
  const handleLogin = async () => {
    try {
        setAuthError(null);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (err) { setAuthError(err.message); }
  };

  const handleLogout = async () => await signOut(auth);
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  // Date Logic
  const handleDateNavigate = (dir) => {
    const d = new Date(referenceDate);
    if (filterMode === 'month') d.setMonth(d.getMonth() + dir);
    else if (filterMode === 'year') d.setFullYear(d.getFullYear() + dir);
    setReferenceDate(d);
  };

  const getFilterRange = () => {
    if (filterMode === 'custom') return { start: new Date(customRange.start), end: new Date(new Date(customRange.end).setHours(23, 59, 59)) };
    const y = referenceDate.getFullYear(), m = referenceDate.getMonth();
    if (filterMode === 'year') return { start: new Date(y, 0, 1), end: new Date(y, 11, 31, 23, 59, 59) };
    return { start: new Date(y, m, 1), end: new Date(y, m + 1, 0, 23, 59, 59) };
  };

  // Form Management
  const openDrawer = (item = null, typeOverride = null) => {
    setEditingId(item?.id || null);
    
    // Determine Type
    let type = typeOverride || (activeTab === 'goals' ? 'goal' : activeTab === 'debt' ? 'debt' : 'expense');
    if (item?.type) type = item.type;
    
    setFormType(type);
    
    // Populate Fields
    setAmount(item?.amount || '');
    setTitle(item?.category || item?.title || item?.person || '');
    setTargetAmount(item?.targetAmount || '');
    setDebtType(item?.debtType || 'borrowed');
    setPaymentMode(item?.paymentMode || 'Cash');
    setDescription(item?.description || '');
    setDate((item?.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]));
    
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !user) return;
    
    let collectionName = 'expenses';
    let data = {
        amount: parseFloat(amount),
        description,
        updatedAt: Timestamp.now()
    };

    if (formType === 'goal') {
        collectionName = 'goals';
        data = { ...data, title, targetAmount: parseFloat(targetAmount), savedAmount: parseFloat(amount) }; // amount here is 'current saved'
    } else if (formType === 'debt') {
        collectionName = 'debts';
        data = { ...data, person: title, debtType, date: new Date(date) };
    } else {
        // Expense/Income
        data = { ...data, type: formType, category: title || (formType === 'expense' ? expenseCategories[0] : incomeCategories[0]), paymentMode: paymentMode || 'Cash', date: new Date(date) };
    }

    try {
        const colRef = collection(db, 'users', user.uid, collectionName);
        if (editingId) {
            await updateDoc(doc(colRef, editingId), data);
            showToast("Updated successfully");
        } else {
            data.createdAt = Timestamp.now();
            await addDoc(colRef, data);
            showToast("Added successfully");
        }
        setIsDrawerOpen(false);
    } catch (err) { console.error(err); showToast("Save failed", "error"); }
  };

  const promptDelete = (id, collectionName) => setDeleteModal({ isOpen: true, id, collection: collectionName });

  const confirmDelete = async () => {
    if (!user || !deleteModal.id) return;
    try {
        await deleteDoc(doc(db, 'users', user.uid, deleteModal.collection, deleteModal.id));
        showToast("Deleted");
        setIsDrawerOpen(false);
    } catch (err) { showToast("Delete failed", "error"); } 
    finally { setDeleteModal({ isOpen: false, id: null, collection: 'expenses' }); }
  };

  // Add Category/Payment Handlers
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
        const newCat = newCategoryName.trim();
        if (![...expenseCategories, ...incomeCategories, ...customCategories].includes(newCat)) {
            setCustomCategories([...customCategories, newCat]);
            setTitle(newCat);
            showToast("Category added");
        }
        setNewCategoryName('');
        setIsAddingCategory(false);
    }
  };

  const handleAddPaymentMode = () => {
    if (newPaymentModeName.trim()) {
        const newMode = newPaymentModeName.trim();
        if (!paymentModes.includes(newMode)) {
            setPaymentModes([...paymentModes, newMode]);
            setPaymentMode(newMode);
            showToast("Payment method added");
        }
        setNewPaymentModeName('');
        setIsAddingPaymentMode(false);
    }
  };

  // --- Computed Data ---
  const activeCategories = formType === 'expense' ? [...expenseCategories, ...customCategories] : incomeCategories;
  
  // Combine all expense categories for Budget Settings (Even those with no spending)
  const allExpenseCategories = useMemo(() => {
      return [...new Set([...expenseCategories, ...customCategories])];
  }, [customCategories]);

  const currentRange = getFilterRange();

  const filteredTransactions = useMemo(() => {
    const { start, end } = currentRange;
    let filtered = transactions.filter(t => {
        const inRange = t.date >= start && t.date <= end;
        const term = searchTerm.toLowerCase();
        const matchSearch = !term || t.category.toLowerCase().includes(term) || (t.description||'').toLowerCase().includes(term) || (t.paymentMode||'').toLowerCase().includes(term);
        const matchCat = categoryFilter === 'All' || t.category === categoryFilter || (categoryFilter === 'Income' && t.type === 'income');
        return inRange && matchSearch && matchCat;
    });
    return filtered.sort((a, b) => sortMode === 'amount' ? b.amount - a.amount : b.date - a.date);
  }, [transactions, currentRange, searchTerm, categoryFilter, sortMode]);

  const stats = useMemo(() => {
    let inc = 0, exp = 0;
    filteredTransactions.forEach(t => { t.type === 'income' ? inc += t.amount : exp += t.amount; });
    const diffTime = Math.abs(currentRange.end - currentRange.start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return { income: inc, expense: exp, balance: inc - exp, dailyAvg: totalDays > 0 ? Math.round(exp / totalDays) : 0 };
  }, [filteredTransactions, currentRange]);

  const categoryBreakdown = useMemo(() => {
      const breakdown = {};
      let totalExp = 0;
      filteredTransactions.forEach(t => {
          if (t.type !== 'income') {
              breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
              totalExp += t.amount;
          }
      });
      return Object.entries(breakdown).map(([name, value]) => ({ name, value, pct: totalExp > 0 ? (value / totalExp) * 100 : 0 })).sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
        const dKey = t.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        if (!groups[dKey]) groups[dKey] = [];
        groups[dKey].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(transactions.filter(t => t.date >= currentRange.start && t.date <= currentRange.end).map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, [transactions, currentRange]);

  // Icons Helper
  const getIcon = (cat) => {
    const l = (cat||'').toLowerCase();
    if (l.includes('food') || l.includes('dine')) return '🍔'; if (l.includes('shop')) return '🛍️'; if (l.includes('transport') || l.includes('fuel')) return '🚕';
    if (l.includes('rent')) return '🏠'; if (l.includes('health')) return '💊'; if (l.includes('entertain')) return '🍿'; if (l.includes('grocer')) return '🥦';
    return '💸';
  };

  const getPaymentIcon = (mode) => {
    const l = (mode || '').toLowerCase();
    if (l.includes('card') || l.includes('credit') || l.includes('debit')) return <CreditCard className="w-3 h-3 text-indigo-400" />;
    if (l.includes('bank') || l.includes('transfer')) return <Landmark className="w-3 h-3 text-blue-400" />;
    if (l.includes('upi') || l.includes('gpay') || l.includes('paytm')) return <Smartphone className="w-3 h-3 text-purple-400" />;
    return <Banknote className="w-3 h-3 text-green-400" />;
  };

  // --- Main Render ---
  if (!isConfigured) return <SetupScreen />;
  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin h-8 w-8 border-2 border-indigo-600 rounded-full border-t-transparent"></div></div>;
  if (!user) return <LoginScreen onLogin={handleLogin} error={authError} />;

  return (
    <div className={`min-h-screen font-sans pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-[#09090b] text-gray-100' : 'bg-slate-50 text-slate-900'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal isOpen={deleteModal.isOpen} title="Delete Item?" message="Cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })} isDarkMode={isDarkMode} />

      {/* HEADER */}
      <div className={`sticky top-0 z-20 px-5 py-4 flex justify-between items-center backdrop-blur-xl border-b ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg"><Wallet className="w-5 h-5" /></div>
            <h1 className="font-bold text-lg tracking-tight">FinManager</h1>
        </div>
        <div className="flex gap-2">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-full ${isDarkMode ? 'bg-white/10 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>{isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            <button onClick={handleLogout} className="p-2.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 space-y-6 mb-20">
        
        {/* === TAB 1: TRANSACTIONS (HOME) === */}
        {activeTab === 'transactions' && (
            <>
                {/* Balance Card */}
                <div className="relative overflow-hidden rounded-[28px] p-6 shadow-2xl shadow-indigo-500/20 bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] text-white">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div><p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Balance</p><h2 className="text-4xl font-bold mb-6 tracking-tight"><span className="text-indigo-300 mr-1">₹</span>{stats.balance.toLocaleString('en-IN')}</h2></div>
                            <div className="text-right"><p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Avg</p><p className="text-xl font-bold">₹{stats.dailyAvg}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/5"><div className="flex items-center gap-2 text-emerald-300 mb-1"><ArrowDownRight className="w-4 h-4" /><span className="text-xs font-bold uppercase">Income</span></div><p className="font-semibold text-lg">₹{stats.income.toLocaleString('en-IN')}</p></div>
                            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/5"><div className="flex items-center gap-2 text-rose-300 mb-1"><ArrowUpRight className="w-4 h-4" /><span className="text-xs font-bold uppercase">Expense</span></div><p className="font-semibold text-lg">₹{stats.expense.toLocaleString('en-IN')}</p></div>
                        </div>
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-30"></div>
                </div>

                {/* Filters */}
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className={`flex-1 flex items-center justify-between p-1.5 rounded-2xl border backdrop-blur-md ${isDarkMode ? 'bg-[#09090b]/90 border-white/5' : 'bg-white/95 border-slate-200 shadow-sm'}`}>
                            <button onClick={() => handleDateNavigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"><ChevronLeft className="w-4 h-4"/></button>
                            <span className="text-sm font-bold flex items-center gap-2"><Calendar className="w-3 h-3 text-gray-400" />{filterMode === 'month' ? referenceDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : referenceDate.getFullYear()}</span>
                            <button onClick={() => handleDateNavigate(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"><ChevronRight className="w-4 h-4"/></button>
                        </div>
                        <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className={`px-2 py-2 rounded-xl text-xs font-bold border outline-none ${isDarkMode ? 'bg-[#18181b] border-white/10 text-white' : 'bg-white border-slate-200 text-gray-900'}`}>
                            <option value="month">Month</option><option value="year">Year</option><option value="custom">Custom</option>
                        </select>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {uniqueCategories.map(cat => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${categoryFilter === cat ? 'bg-indigo-600 border-indigo-600 text-white' : isDarkMode ? 'bg-[#18181b] border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-600'}`}>{cat}</button>
                        ))}
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-6">
                    {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
                        <div key={dateLabel}>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">{dateLabel}</h4>
                            <div className="space-y-3">
                                {txs.map((t) => (
                                    <div key={t.id} onClick={() => openDrawer(t)} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${isDarkMode ? 'bg-[#18181b] border-white/5 hover:bg-white/5' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-200'}`}>
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${t.type === 'income' ? 'bg-emerald-500/10' : isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>{getIcon(t.category)}</div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-sm truncate">{t.category}</h5>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {/* FIXED: PAYMENT MODE BADGE */}
                                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                                    {getPaymentIcon(t.paymentMode)}
                                                    {t.paymentMode || 'Cash'}
                                                </div>
                                                <span className="truncate max-w-[80px] border-l border-gray-500/30 pl-2">{t.description || 'No desc'}</span>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {Object.keys(groupedTransactions).length === 0 && <div className="text-center py-12 opacity-40"><Filter className="w-12 h-12 mx-auto mb-2" /><p>No transactions</p></div>}
                </div>
            </>
        )}

        {/* === TAB 2: INSIGHTS & BUDGETING === */}
        {activeTab === 'insights' && (
            <div className="space-y-6">
                {/* Category Budgeting Section (Fixed & Enhanced) */}
                <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-500" /> Category Budgets</h3>
                        <button onClick={() => setIsEditingCatBudget(!isEditingCatBudget)} className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isEditingCatBudget ? 'bg-indigo-600 text-white' : 'bg-indigo-500/10 text-indigo-500'}`}>
                            {isEditingCatBudget ? 'Done' : 'Edit Limits'}
                        </button>
                    </div>
                    <div className="space-y-5">
                        {/* If editing, show ALL categories. If viewing, show only relevant ones or ones with budgets set */}
                        {(isEditingCatBudget ? allExpenseCategories : categoryBreakdown.map(c => c.name)).map((catName) => {
                            // Find current spending for this category
                            const spentObj = categoryBreakdown.find(c => c.name === catName);
                            const spent = spentObj ? spentObj.value : 0;
                            const limit = catBudgets[catName] || 0;
                            const pct = limit > 0 ? Math.min((spent/limit)*100, 100) : (spentObj ? spentObj.pct : 0);
                            const isOver = limit > 0 && spent > limit;

                            // If not editing and no spending & no limit, skip
                            if (!isEditingCatBudget && spent === 0 && limit === 0) return null;

                            return (
                                <div key={catName} className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getIcon(catName)}</span>
                                            <div>
                                                <div className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{catName}</div>
                                                {!isEditingCatBudget && limit > 0 && (
                                                    <div className={`text-[10px] font-bold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
                                                        {isOver ? `Over by ₹${(spent-limit).toLocaleString()}` : `Limit: ₹${limit.toLocaleString()}`}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {isEditingCatBudget ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-500">Limit: ₹</span>
                                                    <input 
                                                        type="number" 
                                                        className={`w-20 p-1 text-right rounded border outline-none text-sm font-bold ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                        value={catBudgets[catName] || ''}
                                                        onChange={(e) => setCatBudgets({...catBudgets, [catName]: parseFloat(e.target.value)})}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="font-bold">₹{spent.toLocaleString('en-IN')}</div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Progress Bar */}
                                    {!isEditingCatBudget && (
                                        <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-indigo-500'}`} 
                                                style={{ width: `${pct}%` }} 
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {!isEditingCatBudget && categoryBreakdown.length === 0 && <div className="text-center text-gray-500 text-sm py-4">No data available</div>}
                    </div>
                </div>
            </div>
        )}

        {/* === TAB 3: GOALS === */}
        {activeTab === 'goals' && (
            <div className="space-y-4">
                {goals.map(g => {
                    const pct = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
                    return (
                        <div key={g.id} onClick={() => openDrawer(g)} className={`p-5 rounded-3xl border relative overflow-hidden ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h3 className="font-bold text-lg">{g.title}</h3>
                                    <p className="text-xs text-gray-500">Target: ₹{g.targetAmount.toLocaleString()}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Target className="w-5 h-5"/></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span>₹{g.savedAmount.toLocaleString()}</span>
                                    <span>{Math.round(pct)}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{width: `${pct}%`}}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {goals.length === 0 && <div className="text-center py-20 opacity-50"><PiggyBank className="w-16 h-16 mx-auto mb-4 text-gray-400"/><p>No savings goals yet.</p></div>}
            </div>
        )}

        {/* === TAB 4: DEBT === */}
        {activeTab === 'debt' && (
            <div className="space-y-4">
                {debts.map(d => (
                    <div key={d.id} onClick={() => openDrawer(d)} className={`p-5 rounded-3xl border flex items-center justify-between ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${d.debtType === 'lent' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">{d.person}</h3>
                                <p className={`text-xs font-bold uppercase tracking-wider ${d.debtType === 'lent' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {d.debtType === 'lent' ? 'Owes You' : 'You Owe'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">₹{d.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{new Date(d.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {debts.length === 0 && <div className="text-center py-20 opacity-50"><HandCoins className="w-16 h-16 mx-auto mb-4 text-gray-400"/><p>No debts recorded.</p></div>}
            </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div className={`fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-3 px-2 z-40 backdrop-blur-md ${isDarkMode ? 'bg-[#09090b]/90 border-white/5' : 'bg-white/90 border-slate-200'}`}>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'transactions' ? 'text-indigo-500' : 'text-gray-400'}`}>
            <ListIcon className="w-6 h-6" /><span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setActiveTab('insights')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'insights' ? 'text-indigo-500' : 'text-gray-400'}`}>
            <PieChart className="w-6 h-6" /><span className="text-[10px] font-bold">Insights</span>
        </button>
        <div className="w-12"></div> {/* Spacer for FAB */}
        <button onClick={() => setActiveTab('goals')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'goals' ? 'text-indigo-500' : 'text-gray-400'}`}>
            <Target className="w-6 h-6" /><span className="text-[10px] font-bold">Goals</span>
        </button>
        <button onClick={() => setActiveTab('debt')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'debt' ? 'text-indigo-500' : 'text-gray-400'}`}>
            <HandCoins className="w-6 h-6" /><span className="text-[10px] font-bold">Debt</span>
        </button>
      </div>

      {/* CONTEXT AWARE FAB */}
      <button 
        onClick={() => openDrawer()} 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 h-16 w-16 bg-indigo-600 rounded-full text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 border-4 border-white dark:border-[#09090b]"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* DRAWER FORM */}
      {isDrawerOpen && (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setIsDrawerOpen(false)} />
            <div className={`fixed bottom-0 left-0 right-0 p-6 rounded-t-[32px] z-[60] transition-transform duration-300 animate-slide-up ${isDarkMode ? 'bg-[#1c1c1f]' : 'bg-white'}`}>
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Header specific to form type */}
                    <div className="text-center mb-4">
                        <h2 className="text-lg font-bold text-gray-500 uppercase tracking-widest">
                            {editingId ? 'Edit' : 'Add'} {formType === 'goal' ? 'Savings Goal' : formType === 'debt' ? 'Debt Record' : formType}
                        </h2>
                    </div>

                    {/* EXPENSE / INCOME TOGGLE */}
                    {(formType === 'expense' || formType === 'income') && !editingId && (
                        <div className="flex bg-gray-100 dark:bg-black/30 p-1 rounded-2xl mb-6">
                            <button type="button" onClick={() => setFormType('expense')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formType === 'expense' ? 'bg-white dark:bg-white/10 shadow-sm text-rose-500' : 'text-gray-500'}`}>Expense</button>
                            <button type="button" onClick={() => setFormType('income')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formType === 'income' ? 'bg-white dark:bg-white/10 shadow-sm text-emerald-500' : 'text-gray-500'}`}>Income</button>
                        </div>
                    )}

                    {/* DEBT TYPE TOGGLE */}
                    {formType === 'debt' && (
                        <div className="flex bg-gray-100 dark:bg-black/30 p-1 rounded-2xl mb-6">
                            <button type="button" onClick={() => setDebtType('borrowed')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${debtType === 'borrowed' ? 'bg-white dark:bg-white/10 shadow-sm text-red-500' : 'text-gray-500'}`}>I Borrowed</button>
                            <button type="button" onClick={() => setDebtType('lent')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${debtType === 'lent' ? 'bg-white dark:bg-white/10 shadow-sm text-emerald-500' : 'text-gray-500'}`}>I Lent</button>
                        </div>
                    )}

                    {/* AMOUNT INPUT (Shared) */}
                    <div className="text-center">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{formType === 'goal' ? 'Current Saved' : 'Amount'}</label>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <span className="text-3xl font-bold text-gray-400">₹</span>
                            <input autoFocus type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className={`text-5xl font-bold bg-transparent outline-none w-48 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                        </div>
                    </div>

                    {/* GOAL TARGET INPUT */}
                    {formType === 'goal' && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 pl-1">Target Amount</label>
                            <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                         {/* CATEGORY / TITLE INPUT */}
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 pl-1">{formType === 'goal' ? 'Goal Name' : formType === 'debt' ? 'Person Name' : 'Category'}</label>
                            {(formType === 'expense' || formType === 'income') ? (
                                isAddingCategory ? (
                                    <div className="flex gap-2">
                                        <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New..." className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                                        <button type="button" onClick={handleAddCategory} className="bg-indigo-600 text-white p-3.5 rounded-2xl"><Check className="w-4 h-4"/></button>
                                        <button type="button" onClick={() => setIsAddingCategory(false)} className="bg-gray-200 dark:bg-white/10 p-3.5 rounded-2xl"><X className="w-4 h-4"/></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <select value={title} onChange={e => setTitle(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm appearance-none ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                            <option value="" disabled>Select...</option>
                                            {activeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        {formType === 'expense' && <button type="button" onClick={() => setIsAddingCategory(true)} className="p-3.5 bg-gray-100 dark:bg-white/5 rounded-2xl"><Plus className="w-4 h-4 text-gray-500" /></button>}
                                    </div>
                                )
                            ) : (
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={formType === 'debt' ? 'e.g. Rahul' : 'e.g. New Phone'} className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                            )}
                        </div>
                         
                         {/* DATE INPUT */}
                         {formType !== 'goal' && (
                             <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 pl-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} /></div>
                         )}
                    </div>

                    {/* NEW: PAYMENT MODE SECTION (Only for Expense/Income) */}
                    {(formType === 'expense' || formType === 'income') && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 pl-1">Account / Pay Via</label>
                            {isAddingPaymentMode ? (
                                <div className="flex gap-2">
                                    <input type="text" value={newPaymentModeName} onChange={e => setNewPaymentModeName(e.target.value)} placeholder="e.g. HDFC Credit Card" className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                                    <button type="button" onClick={handleAddPaymentMode} className="bg-indigo-600 text-white p-3.5 rounded-2xl"><Check className="w-4 h-4"/></button>
                                    <button type="button" onClick={() => setIsAddingPaymentMode(false)} className="bg-gray-200 dark:bg-white/10 p-3.5 rounded-2xl"><X className="w-4 h-4"/></button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm appearance-none ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                        <option value="" disabled>Select...</option>
                                        {paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setIsAddingPaymentMode(true)} className="p-3.5 bg-gray-100 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5">
                                        <Plus className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* DESCRIPTION */}
                    <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 pl-1">Note (Optional)</label><input type="text" value={description} onChange={e => setDescription(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} /></div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2 space-y-3">
                        <button type="submit" className={`w-full font-bold py-4 rounded-2xl shadow-lg text-white active:scale-[0.98] transition-all text-lg bg-indigo-600 shadow-indigo-500/20`}>
                            {editingId ? 'Update' : 'Save'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => promptDelete(editingId, formType === 'goal' ? 'goals' : formType === 'debt' ? 'debts' : 'expenses')} 
                                className="w-full py-3.5 text-red-500 font-bold text-sm bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-colors"
                            >Delete</button>
                        )}
                    </div>
                </form>
            </div>
        </>
      )}
    </div>
  );
}
