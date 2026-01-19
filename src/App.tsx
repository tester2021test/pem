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
  ArrowUpDown, List as ListIcon, LayoutGrid
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

// --- Toast Component ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const bg = type === 'error' ? 'bg-red-500' : 'bg-indigo-600';
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white font-medium text-sm flex items-center gap-2 z-[70] animate-fade-in-down ${bg}`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4"/> : <Check className="w-4 h-4"/>}
      {message}
    </div>
  );
};

// --- Custom Confirm Modal ---
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

// --- Login Component ---
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

      <button 
        onClick={onLogin}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
      >
        Sign in with Google
      </button>
      <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">Restricted Access</p>
      <p className="text-xs text-gray-500 font-mono mt-1">{ALLOWED_EMAIL}</p>
    </div>
  </div>
);

// --- Setup Instructions Component ---
const SetupScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 font-mono text-sm">
    <div className="max-w-2xl w-full space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center animate-pulse">
            <Lock className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-xl font-bold">Setup Required</h1>
            <p className="text-gray-400">Connect your Firebase project</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h3 className="font-bold text-indigo-400 mb-2">Step 1: Get Config</h3>
            <p className="text-gray-300">Go to Firebase Console &gt; Project Settings &gt; General &gt; Your Apps. Copy the <code className="bg-black px-1 py-0.5 rounded">firebaseConfig</code> object.</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h3 className="font-bold text-indigo-400 mb-2">Step 2: Update Code</h3>
            <p className="text-gray-300">Update lines 26-33 in the code editor.</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h3 className="font-bold text-indigo-400 mb-2">Step 3: Set Email</h3>
            <p className="text-gray-300">Update line 40 with your Gmail address.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [toast, setToast] = useState(null);

  // --- UI State ---
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'insights'
  const [sortMode, setSortMode] = useState('date'); // 'date' | 'amount'
  
  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budget, setBudget] = useState(() => localStorage.getItem('monthly_budget') || '20000');
  const [isEditingBudget, setIsEditingBudget] = useState(false);

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

  // --- Form State ---
  const [formType, setFormType] = useState('expense');
  const [editingId, setEditingId] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!isConfigured) {
        setLoading(false);
        return;
    }
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

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'expenses');
    return onSnapshot(ref, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id, ...d.data(),
        date: d.data().date?.toDate ? d.data().date.toDate() : new Date(d.data().date)
      }));
      // Initial sort by date
      data.sort((a, b) => b.date - a.date);
      setTransactions(data);
    });
  }, [user]);

  useEffect(() => { localStorage.setItem('monthly_budget', budget); }, [budget]);
  useEffect(() => { localStorage.setItem('custom_categories', JSON.stringify(customCategories)); }, [customCategories]);
  useEffect(() => { localStorage.setItem('payment_modes', JSON.stringify(paymentModes)); }, [paymentModes]);

  // --- Handlers ---
  const handleLogin = async () => {
    try {
        setAuthError(null);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (err) {
        console.error(err);
        setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  const changeMonth = (dir) => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + dir, 15);
    setSelectedMonth(d.toISOString().slice(0, 7));
  };

  const openDrawer = (tx = null) => {
    if (tx) {
      setEditingId(tx.id);
      setFormType(tx.type || 'expense');
      setAmount(tx.amount);
      setCategory(tx.category);
      setPaymentMode(tx.paymentMode || 'Cash');
      setDescription(tx.description || '');
      setDate(tx.date.toISOString().split('T')[0]);
    } else {
      setEditingId(null);
      setFormType('expense');
      setAmount('');
      setCategory('');
      setPaymentMode('Cash');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !user) return;
    
    const finalCategory = category || (formType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
    const finalPaymentMode = paymentMode || 'Cash';

    const txData = {
        type: formType,
        amount: parseFloat(amount),
        category: finalCategory,
        paymentMode: finalPaymentMode,
        description,
        date: new Date(date),
        updatedAt: Timestamp.now()
    };

    try {
        const colRef = collection(db, 'users', user.uid, 'expenses');
        if (editingId) {
            await updateDoc(doc(colRef, editingId), txData);
            showToast("Updated successfully");
        } else {
            txData.createdAt = Timestamp.now();
            await addDoc(colRef, txData);
            showToast("Added successfully");
        }
        setIsDrawerOpen(false);
    } catch (err) { console.error(err); showToast("Save failed", "error"); }
  };

  const promptDelete = (id, e) => {
    if (e) e.stopPropagation();
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!user || !deleteModal.id) return;
    try {
        const docRef = doc(db, 'users', user.uid, 'expenses', deleteModal.id);
        await deleteDoc(docRef);
        showToast("Transaction deleted");
        if (editingId === deleteModal.id) {
            setIsDrawerOpen(false);
            setEditingId(null);
        }
    } catch (err) {
        console.error("Delete Error:", err);
        showToast("Delete failed", "error");
    } finally {
        setDeleteModal({ isOpen: false, id: null });
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
        const newCat = newCategoryName.trim();
        if (![...expenseCategories, ...incomeCategories, ...customCategories].includes(newCat)) {
            setCustomCategories([...customCategories, newCat]);
            setCategory(newCat);
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

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return showToast("No data to export", "error");
    const headers = ["Date", "Type", "Category", "Payment Mode", "Amount", "Description"];
    const rows = filteredTransactions.map(e => [
      e.date.toLocaleDateString('en-IN'), 
      e.type || 'expense', 
      e.category, 
      e.paymentMode || 'Cash',
      e.amount, 
      `"${e.description||''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `fin_data_${selectedMonth}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- Computed ---
  const activeCategories = formType === 'expense' ? [...expenseCategories, ...customCategories] : incomeCategories;

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t => {
        const matchDate = t.date.toISOString().slice(0, 7) === selectedMonth;
        const term = searchTerm.toLowerCase();
        const matchSearch = !term || t.category.toLowerCase().includes(term) || (t.description||'').toLowerCase().includes(term) || (t.paymentMode||'').toLowerCase().includes(term);
        const matchCat = categoryFilter === 'All' || t.category === categoryFilter || (categoryFilter === 'Income' && t.type === 'income');
        return matchDate && matchSearch && matchCat;
    });

    // Sort Logic
    return filtered.sort((a, b) => {
        if (sortMode === 'amount') return b.amount - a.amount;
        return b.date - a.date; // default newest first
    });
  }, [transactions, selectedMonth, searchTerm, categoryFilter, sortMode]);

  const stats = useMemo(() => {
    let inc = 0, exp = 0;
    filteredTransactions.forEach(t => { t.type === 'income' ? inc += t.amount : exp += t.amount; });
    const daysInMonth = new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).getDate();
    const today = new Date().getDate();
    const daysPassed = selectedMonth === new Date().toISOString().slice(0, 7) ? today : daysInMonth;
    return { income: inc, expense: exp, balance: inc - exp, dailyAvg: daysPassed > 0 ? Math.round(exp / daysPassed) : 0 };
  }, [filteredTransactions, selectedMonth]);

  // Analytics Stats for Insights View
  const categoryBreakdown = useMemo(() => {
      const breakdown = {};
      let totalExp = 0;
      filteredTransactions.forEach(t => {
          if (t.type !== 'income') {
              breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
              totalExp += t.amount;
          }
      });
      return Object.entries(breakdown)
        .map(([name, value]) => ({ name, value, pct: totalExp > 0 ? (value / totalExp) * 100 : 0 }))
        .sort((a, b) => b.value - a.value);
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
    const cats = new Set(transactions.filter(t => t.date.toISOString().slice(0,7) === selectedMonth).map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, [transactions, selectedMonth]);

  const getIcon = (cat, type) => {
    if (type === 'income') return <TrendingUp className="w-5 h-5 text-emerald-500" />;
    const l = cat.toLowerCase();
    if (l.includes('food') || l.includes('dine')) return '🍔'; if (l.includes('shop')) return '🛍️'; if (l.includes('transport') || l.includes('fuel')) return '🚕';
    if (l.includes('rent')) return '🏠'; if (l.includes('health')) return '💊'; if (l.includes('entertain')) return '🍿'; if (l.includes('grocery')) return '🥦';
    return '💸';
  };

  const getPaymentIcon = (mode) => {
    const l = (mode || '').toLowerCase();
    if (l.includes('card') || l.includes('credit') || l.includes('debit')) return <CreditCard className="w-3 h-3 text-indigo-400" />;
    if (l.includes('bank') || l.includes('transfer')) return <Landmark className="w-3 h-3 text-blue-400" />;
    if (l.includes('upi') || l.includes('gpay')) return <ArrowUpRight className="w-3 h-3 text-purple-400" />;
    return <Banknote className="w-3 h-3 text-green-400" />;
  };

  // --- Main Render Logic ---
  if (!isConfigured) return <SetupScreen />;
  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin h-8 w-8 border-2 border-indigo-600 rounded-full border-t-transparent"></div></div>;
  if (!user) return <LoginScreen onLogin={handleLogin} error={authError} />;

  // --- App Dashboard Render ---
  return (
    <div className={`min-h-screen font-sans pb-28 transition-colors duration-300 ${isDarkMode ? 'bg-[#09090b] text-gray-100' : 'bg-slate-50 text-slate-900'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal isOpen={deleteModal.isOpen} title="Delete Transaction?" message="This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteModal({ isOpen: false, id: null })} isDarkMode={isDarkMode} />

      {/* Header */}
      <div className={`sticky top-0 z-20 px-5 py-4 flex justify-between items-center backdrop-blur-xl border-b ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Wallet className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">FinManager</h1>
        </div>
        <div className="flex gap-2">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-full ${isDarkMode ? 'bg-white/10 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                {isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
            </button>
            <button onClick={handleLogout} className="p-2.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        {/* Dashboard Cards & Charts */}
        <div className="relative overflow-hidden rounded-[28px] p-6 shadow-2xl shadow-indigo-500/20 bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] text-white">
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Balance</p>
                        <h2 className="text-4xl font-bold mb-6 tracking-tight">
                            <span className="text-indigo-300 mr-1">₹</span>{stats.balance.toLocaleString('en-IN')}
                        </h2>
                    </div>
                    <div className="text-right">
                         <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Avg</p>
                         <p className="text-xl font-bold">₹{stats.dailyAvg}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/5">
                        <div className="flex items-center gap-2 text-emerald-300 mb-1"><ArrowDownRight className="w-4 h-4" /><span className="text-xs font-bold uppercase">Income</span></div>
                        <p className="font-semibold text-lg">₹{stats.income.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/5">
                        <div className="flex items-center gap-2 text-rose-300 mb-1"><ArrowUpRight className="w-4 h-4" /><span className="text-xs font-bold uppercase">Expense</span></div>
                        <p className="font-semibold text-lg">₹{stats.expense.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-30"></div>
        </div>

        {/* View Toggle (List vs Analysis) */}
        <div className={`p-1 rounded-2xl flex ${isDarkMode ? 'bg-[#18181b]' : 'bg-white border border-slate-200'}`}>
            <button 
                onClick={() => setViewMode('list')} 
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'list' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900') : 'text-gray-500'}`}
            >
                <ListIcon className="w-4 h-4" /> Transactions
            </button>
            <button 
                onClick={() => setViewMode('insights')} 
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'insights' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900') : 'text-gray-500'}`}
            >
                <LayoutGrid className="w-4 h-4" /> Insights
            </button>
        </div>

        {viewMode === 'list' ? (
            <>
                {/* Filters */}
                <div className="sticky top-[73px] z-10 space-y-3 pb-2 pt-2 transition-colors">
                    <div className="flex gap-2">
                        <div className={`flex-1 flex items-center justify-between p-1.5 rounded-2xl border backdrop-blur-md ${isDarkMode ? 'bg-[#09090b]/90 border-white/5' : 'bg-white/95 border-slate-200 shadow-sm'}`}>
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"><ChevronLeft className="w-4 h-4"/></button>
                            <span className="text-sm font-bold flex items-center gap-2"><Calendar className="w-3 h-3 text-gray-400" />{new Date(selectedMonth).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"><ChevronRight className="w-4 h-4"/></button>
                        </div>
                        {/* Sort Button */}
                        <button 
                            onClick={() => setSortMode(sortMode === 'date' ? 'amount' : 'date')} 
                            className={`p-3 rounded-2xl border flex items-center justify-center transition-all ${isDarkMode ? 'bg-[#18181b] border-white/5 text-gray-400' : 'bg-white border-slate-200 text-slate-500'} ${sortMode === 'amount' ? 'text-indigo-500 border-indigo-500/50' : ''}`}
                            title="Sort by Date/Amount"
                        >
                            <ArrowUpDown className="w-5 h-5" />
                        </button>
                        <button onClick={handleExportCSV} className={`p-3 rounded-2xl border flex items-center justify-center ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}><Download className="w-5 h-5 text-indigo-500" /></button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {uniqueCategories.map(cat => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${categoryFilter === cat ? 'bg-indigo-600 border-indigo-600 text-white' : isDarkMode ? 'bg-[#18181b] border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-600'}`}>{cat}</button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500/50 ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`} />
                    </div>
                </div>

                {/* List */}
                <div className="space-y-6">
                    {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
                        <div key={dateLabel}>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">{dateLabel}</h4>
                            <div className="space-y-3">
                                {txs.map((t) => (
                                    <div key={t.id} onClick={() => openDrawer(t)} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${isDarkMode ? 'bg-[#18181b] border-white/5 hover:bg-white/5' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-200'}`}>
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${t.type === 'income' ? 'bg-emerald-500/10' : isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>{getIcon(t.category, t.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-sm truncate">{t.category}</h5>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
                                                    {getPaymentIcon(t.paymentMode)}
                                                    {t.paymentMode || 'Cash'}
                                                </div>
                                                <span className="truncate max-w-[100px]">{t.description || 'No description'}</span>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}</div>
                                        <button onClick={(e) => promptDelete(t.id, e)} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-600 hover:text-red-400 hover:bg-white/5' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {Object.keys(groupedTransactions).length === 0 && <div className="text-center py-12 opacity-40"><Filter className="w-12 h-12 mx-auto mb-2" /><p>No transactions</p></div>}
                </div>
            </>
        ) : (
            // INSIGHTS VIEW
            <div className="space-y-6">
                {/* Category Breakdown */}
                <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-6">
                        <PieChart className="w-4 h-4 text-indigo-500" />
                        Spending By Category
                    </h3>
                    <div className="space-y-4">
                        {categoryBreakdown.length > 0 ? (
                            categoryBreakdown.map((cat, idx) => (
                                <div key={cat.name} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getIcon(cat.name, 'expense')}</span>
                                            <span>{cat.name}</span>
                                        </div>
                                        <span>₹{cat.value.toLocaleString('en-IN')} <span className="text-gray-500 ml-1">({cat.pct.toFixed(0)}%)</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${cat.pct}%`, opacity: 1 - (idx * 0.1) }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8 text-sm">No expense data for this month</div>
                        )}
                    </div>
                </div>
            </div>
        )}

      </div>

      <button onClick={() => openDrawer()} className="fixed bottom-6 right-6 h-14 w-14 bg-indigo-600 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30"><Plus className="w-7 h-7" /></button>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsDrawerOpen(false)} />
            <div className={`fixed bottom-0 left-0 right-0 p-6 rounded-t-[32px] z-50 transition-transform duration-300 animate-slide-up ${isDarkMode ? 'bg-[#1c1c1f]' : 'bg-white'}`}>
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {!editingId && (
                        <div className="flex bg-gray-100 dark:bg-black/30 p-1 rounded-2xl mb-6">
                            <button type="button" onClick={() => setFormType('expense')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formType === 'expense' ? 'bg-white dark:bg-white/10 shadow-sm text-rose-500' : 'text-gray-500'}`}>Expense</button>
                            <button type="button" onClick={() => setFormType('income')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formType === 'income' ? 'bg-white dark:bg-white/10 shadow-sm text-emerald-500' : 'text-gray-500'}`}>Income</button>
                        </div>
                    )}
                    <div className="text-center">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</label>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <span className={`text-3xl font-bold ${formType === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>₹</span>
                            <input autoFocus type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className={`text-5xl font-bold bg-transparent outline-none w-48 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 pl-1">Category</label>
                            {isAddingCategory ? (
                                <div className="flex gap-2">
                                    <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Name..." className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                                    <button type="button" onClick={handleAddCategory} className="bg-indigo-600 text-white p-3.5 rounded-2xl"><Check className="w-4 h-4"/></button>
                                    <button type="button" onClick={() => setIsAddingCategory(false)} className="bg-gray-200 dark:bg-white/10 p-3.5 rounded-2xl"><X className="w-4 h-4"/></button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <select value={category} onChange={e => setCategory(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm appearance-none ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                        <option value="" disabled>Select...</option>
                                        {activeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {formType === 'expense' && <button type="button" onClick={() => setIsAddingCategory(true)} className="p-3.5 bg-gray-100 dark:bg-white/5 rounded-2xl"><Plus className="w-4 h-4 text-gray-500" /></button>}
                                </div>
                            )}
                        </div>
                         <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 pl-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} /></div>
                    </div>

                    {/* NEW: PAYMENT MODE SECTION */}
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
                                    {paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <button type="button" onClick={() => setIsAddingPaymentMode(true)} className="p-3.5 bg-gray-100 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5">
                                    <Plus className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 pl-1">Description</label><input type="text" placeholder="Note (optional)" value={description} onChange={e => setDescription(e.target.value)} className={`w-full p-3.5 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} /></div>
                    <div className="pt-2 space-y-3">
                        <button type="submit" className={`w-full font-bold py-4 rounded-2xl shadow-lg text-white active:scale-[0.98] transition-all text-lg ${formType === 'income' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>{editingId ? 'Update' : 'Save'} {formType === 'income' ? 'Income' : 'Expense'}</button>
                        {editingId && <button type="button" onClick={() => promptDelete(editingId)} className="w-full py-3.5 text-red-500 font-bold text-sm bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-colors">Delete Transaction</button>}
                    </div>
                </form>
            </div>
        </>
      )}
    </div>
  );
}
