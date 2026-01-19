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
  const bg = type === 'error' ? 'bg-rose-500 shadow-rose-500/30' : 'bg-indigo-600 shadow-indigo-500/30';
  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl text-white font-medium text-sm flex items-center gap-3 z-[90] animate-in slide-in-from-top-5 duration-300 ${bg}`}>
      {type === 'error' ? <AlertCircle className="w-5 h-5"/> : <Check className="w-5 h-5"/>}
      {message}
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDarkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-xs p-6 rounded-[2rem] shadow-2xl scale-100 transition-all ${isDarkMode ? 'bg-[#1c1c1f] text-white ring-1 ring-white/10' : 'bg-white text-gray-900'}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Trash2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className={`text-sm mb-8 font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 transition-all active:scale-95">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, error }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#F2F4F7] p-4 font-sans relative overflow-hidden">
    {/* Decorative blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 max-w-sm w-full text-center border border-white/50 relative z-10">
      <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform -rotate-3">
        <Wallet className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">FinManager</h1>
      <p className="text-gray-500 mb-8 text-sm font-medium">Your personal finance companion</p>
      
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-2xl flex items-start gap-2 text-left font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <button 
        onClick={onLogin}
        className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
      >
        <div className="bg-white rounded-full p-1"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" /></div>
        Sign in with Google
      </button>
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Authorized Account</p>
        <p className="text-xs text-indigo-600 font-medium mt-1 bg-indigo-50 inline-block px-3 py-1 rounded-full">{ALLOWED_EMAIL}</p>
      </div>
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
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [toast, setToast] = useState(null);

  // --- UI State ---
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, collection: 'expenses' });
  const [activeTab, setActiveTab] = useState('transactions'); 
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

  // --- Form State ---
  const [formType, setFormType] = useState('expense');
  const [editingId, setEditingId] = useState(null);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetAmount, setTargetAmount] = useState('');
  const [debtType, setDebtType] = useState('borrowed');

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
    const expUnsub = onSnapshot(collection(db, 'users', user.uid, 'expenses'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate() || new Date() }));
      data.sort((a, b) => b.date - a.date);
      setTransactions(data);
    });
    const goalUnsub = onSnapshot(collection(db, 'users', user.uid, 'goals'), (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
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
    let type = typeOverride || (activeTab === 'goals' ? 'goal' : activeTab === 'debt' ? 'debt' : 'expense');
    if (item?.type) type = item.type;
    setFormType(type);
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
        data = { ...data, title, targetAmount: parseFloat(targetAmount), savedAmount: parseFloat(amount) };
    } else if (formType === 'debt') {
        collectionName = 'debts';
        data = { ...data, person: title, debtType, date: new Date(date) };
    } else {
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
  const allExpenseCategories = useMemo(() => [...new Set([...expenseCategories, ...customCategories])], [customCategories]);
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
    return <Banknote className="w-3 h-3 text-emerald-500" />;
  };

  // Nav Item Component
  const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300 ${active ? 'bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400 scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
        <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-bold">{label}</span>
    </button>
  );

  // --- Main Render ---
  if (!isConfigured) return <SetupScreen />;
  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin h-8 w-8 border-2 border-indigo-600 rounded-full border-t-transparent"></div></div>;
  if (!user) return <LoginScreen onLogin={handleLogin} error={authError} />;

  return (
    <div className={`min-h-screen font-sans pb-32 transition-colors duration-300 ${isDarkMode ? 'bg-[#09090b] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal isOpen={deleteModal.isOpen} title="Delete Item?" message="Cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })} isDarkMode={isDarkMode} />

      {/* HEADER */}
      <div className={`sticky top-0 z-30 px-6 py-4 flex justify-between items-center backdrop-blur-xl border-b transition-all duration-300 ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transform hover:rotate-6 transition-transform">
                <Wallet className="w-5 h-5" />
            </div>
            <div>
                <h1 className="font-bold text-lg tracking-tight leading-none">FinManager</h1>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Premium</p>
            </div>
        </div>
        <div className="flex gap-2">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isDarkMode ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 space-y-8 mb-20">
        
        {/* === TAB 1: TRANSACTIONS (HOME) === */}
        {activeTab === 'transactions' && (
            <>
                {/* Balance Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-600/30 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 transition-all duration-500 group-hover:scale-105"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                    
                    <div className="relative z-10 text-white">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Total Balance</p>
                                <h2 className="text-5xl font-bold tracking-tighter">
                                    <span className="text-indigo-200 text-3xl align-top mr-1">₹</span>{stats.balance.toLocaleString('en-IN')}
                                </h2>
                            </div>
                            <div className="text-right bg-white/10 px-3 py-2 rounded-2xl backdrop-blur-md border border-white/10">
                                 <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-0.5">Daily Avg</p>
                                 <p className="text-lg font-bold">₹{stats.dailyAvg}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-md border border-white/5 transition-transform hover:scale-105">
                                <div className="flex items-center gap-2 text-emerald-300 mb-1"><div className="p-1 bg-emerald-500/20 rounded-full"><ArrowDownRight className="w-3 h-3" /></div><span className="text-xs font-bold uppercase">Income</span></div>
                                <p className="font-semibold text-xl tracking-tight">₹{stats.income.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 transition-transform hover:scale-105">
                                <div className="flex items-center gap-2 text-rose-300 mb-1"><div className="p-1 bg-rose-500/20 rounded-full"><ArrowUpRight className="w-3 h-3" /></div><span className="text-xs font-bold uppercase">Expense</span></div>
                                <p className="font-semibold text-xl tracking-tight">₹{stats.expense.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className={`flex-1 flex items-center justify-between p-2 rounded-2xl border backdrop-blur-md transition-all ${isDarkMode ? 'bg-[#18181b]/80 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                            <button onClick={() => handleDateNavigate(-1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"><ChevronLeft className="w-4 h-4 text-gray-500"/></button>
                            <span className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                {filterMode === 'month' ? referenceDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : referenceDate.getFullYear()}
                            </span>
                            <button onClick={() => handleDateNavigate(1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"><ChevronRight className="w-4 h-4 text-gray-500"/></button>
                        </div>
                        <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className={`px-4 py-2 rounded-2xl text-xs font-bold border outline-none appearance-none cursor-pointer transition-all ${isDarkMode ? 'bg-[#18181b] border-white/10 text-white hover:bg-white/5' : 'bg-white border-slate-200 text-gray-900 hover:bg-gray-50'}`}>
                            <option value="month">Month</option><option value="year">Year</option><option value="custom">Custom</option>
                        </select>
                    </div>
                    
                    {/* Category Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                        {uniqueCategories.map(cat => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border transition-all duration-300 shadow-sm ${categoryFilter === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-500/30 transform scale-105' : isDarkMode ? 'bg-[#18181b] border-white/10 text-gray-400 hover:bg-white/5' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{cat}</button>
                        ))}
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-8">
                    {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
                        <div key={dateLabel} className="animate-in slide-in-from-bottom-4 duration-500">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                {dateLabel}
                            </h4>
                            <div className="space-y-3">
                                {txs.map((t) => (
                                    <div key={t.id} onClick={() => openDrawer(t)} className={`group relative p-4 rounded-3xl border transition-all duration-300 cursor-pointer active:scale-[0.98] ${isDarkMode ? 'bg-[#18181b] border-white/5 hover:border-white/10 hover:bg-white/5' : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-md'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-600' : isDarkMode ? 'bg-black/30' : 'bg-slate-50'}`}>{getIcon(t.category)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h5 className={`font-bold text-sm truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{t.category}</h5>
                                                    <span className={`font-bold font-mono tracking-tight ${t.type === 'income' ? 'text-emerald-500' : isDarkMode ? 'text-gray-200' : 'text-slate-900'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                                                        {getPaymentIcon(t.paymentMode)}
                                                        {t.paymentMode || 'Cash'}
                                                    </div>
                                                    <span className="truncate max-w-[120px] opacity-70">{t.description}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {Object.keys(groupedTransactions).length === 0 && (
                        <div className="text-center py-20 opacity-40">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="font-medium text-sm">No transactions found</p>
                        </div>
                    )}
                </div>
            </>
        )}

        {/* === TAB 2: INSIGHTS & BUDGETING === */}
        {activeTab === 'insights' && (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
                {/* Category Budgeting Section */}
                <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2"><PieChart className="w-5 h-5 text-indigo-500" /> Budgets</h3>
                            <p className="text-xs text-gray-500 mt-1">Track spending limits per category</p>
                        </div>
                        <button onClick={() => setIsEditingCatBudget(!isEditingCatBudget)} className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${isEditingCatBudget ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400'}`}>
                            {isEditingCatBudget ? 'Done' : 'Edit Limits'}
                        </button>
                    </div>
                    <div className="space-y-6">
                        {(isEditingCatBudget ? allExpenseCategories : categoryBreakdown.map(c => c.name)).map((catName) => {
                            const spentObj = categoryBreakdown.find(c => c.name === catName);
                            const spent = spentObj ? spentObj.value : 0;
                            const limit = catBudgets[catName] || 0;
                            const pct = limit > 0 ? Math.min((spent/limit)*100, 100) : (spentObj ? spentObj.pct : 0);
                            const isOver = limit > 0 && spent > limit;

                            if (!isEditingCatBudget && spent === 0 && limit === 0) return null;

                            return (
                                <div key={catName} className="group">
                                    <div className="flex justify-between text-xs font-medium items-end mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>{getIcon(catName)}</div>
                                            <div>
                                                <div className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{catName}</div>
                                                {!isEditingCatBudget && limit > 0 && (
                                                    <div className={`text-[10px] mt-0.5 font-bold ${isOver ? 'text-rose-500' : 'text-gray-400'}`}>
                                                        {isOver ? `Over by ₹${(spent-limit).toLocaleString()}` : `Limit: ₹${limit.toLocaleString()}`}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {isEditingCatBudget ? (
                                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/30 rounded-lg px-2 py-1 border border-transparent focus-within:border-indigo-500 transition-colors">
                                                    <span className="text-gray-400">₹</span>
                                                    <input 
                                                        type="number" 
                                                        className={`w-16 bg-transparent outline-none text-sm font-bold text-right ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                                        placeholder="0"
                                                        value={catBudgets[catName] || ''}
                                                        onChange={(e) => setCatBudgets({...catBudgets, [catName]: parseFloat(e.target.value)})}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="font-bold text-sm">₹{spent.toLocaleString('en-IN')}</div>
                                            )}
                                        </div>
                                    </div>
                                    {!isEditingCatBudget && (
                                        <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isOver ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                                                style={{ width: `${pct}%` }} 
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {!isEditingCatBudget && categoryBreakdown.length === 0 && <div className="text-center text-gray-500 text-sm py-8">No expense data available</div>}
                    </div>
                </div>
            </div>
        )}

        {/* === TAB 3: GOALS === */}
        {activeTab === 'goals' && (
            <div className="space-y-4 animate-in slide-in-from-right-10 duration-300">
                {goals.map(g => {
                    const pct = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
                    return (
                        <div key={g.id} onClick={() => openDrawer(g)} className={`p-6 rounded-[2rem] border relative overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{g.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium">Target: <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>₹{g.targetAmount.toLocaleString()}</span></p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Target className="w-6 h-6"/></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-emerald-500">₹{g.savedAmount.toLocaleString()} Saved</span>
                                    <span className="text-gray-400">{Math.round(pct)}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{width: `${pct}%`}}></div>
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
            <div className="space-y-4 animate-in slide-in-from-right-10 duration-300">
                {debts.map(d => (
                    <div key={d.id} onClick={() => openDrawer(d)} className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${d.debtType === 'lent' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{d.person}</h3>
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1 ${d.debtType === 'lent' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {d.debtType === 'lent' ? 'Owes You' : 'You Owe'}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-xl font-bold font-mono tracking-tight ${d.debtType === 'lent' ? 'text-emerald-600' : 'text-rose-600'}`}>₹{d.amount.toLocaleString()}</p>
                            <p className="text-[10px] font-medium text-gray-400 mt-1">{new Date(d.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {debts.length === 0 && <div className="text-center py-20 opacity-50"><HandCoins className="w-16 h-16 mx-auto mb-4 text-gray-400"/><p>No debts recorded.</p></div>}
            </div>
        )}

      </div>

      {/* FLOATING DOCK NAVIGATION */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 p-1.5 rounded-full shadow-2xl shadow-indigo-500/10 flex items-center gap-1 z-40 transition-all duration-300 hover:scale-[1.02]">
        <NavButton icon={ListIcon} label="Home" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
        <NavButton icon={PieChart} label="Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
        
        {/* Floating Action Button inside Dock */}
        <button onClick={() => openDrawer()} className="mx-2 h-14 w-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full text-white shadow-lg shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-[#18181b]">
            <Plus className="w-7 h-7" strokeWidth={3} />
        </button>

        <NavButton icon={Target} label="Goals" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
        <NavButton icon={HandCoins} label="Debt" active={activeTab === 'debt'} onClick={() => setActiveTab('debt')} />
      </div>

      {/* DRAWER FORM */}
      {isDrawerOpen && (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
            <div className={`fixed bottom-0 left-0 right-0 p-8 rounded-t-[2.5rem] z-[60] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) animate-in slide-in-from-bottom duration-500 ${isDarkMode ? 'bg-[#1c1c1f] border-t border-white/10' : 'bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)]'}`}>
                <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-8 opacity-50" />
                
                <form onSubmit={handleFormSubmit} className="space-y-7">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
                            {editingId ? 'Edit' : 'Add'} {formType === 'goal' ? 'Goal' : formType === 'debt' ? 'Debt' : formType}
                        </h2>
                    </div>

                    {/* EXPENSE / INCOME TOGGLE */}
                    {(formType === 'expense' || formType === 'income') && !editingId && (
                        <div className="flex bg-gray-100 dark:bg-black/30 p-1.5 rounded-2xl mb-6">
                            <button type="button" onClick={() => setFormType('expense')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${formType === 'expense' ? 'bg-white dark:bg-white/10 text-rose-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Expense</button>
                            <button type="button" onClick={() => setFormType('income')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${formType === 'income' ? 'bg-white dark:bg-white/10 text-emerald-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Income</button>
                        </div>
                    )}

                    {/* DEBT TYPE TOGGLE */}
                    {formType === 'debt' && (
                        <div className="flex bg-gray-100 dark:bg-black/30 p-1.5 rounded-2xl mb-6">
                            <button type="button" onClick={() => setDebtType('borrowed')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${debtType === 'borrowed' ? 'bg-white dark:bg-white/10 text-rose-500 shadow-sm' : 'text-gray-500'}`}>Borrowed</button>
                            <button type="button" onClick={() => setDebtType('lent')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${debtType === 'lent' ? 'bg-white dark:bg-white/10 text-emerald-500 shadow-sm' : 'text-gray-500'}`}>Lent</button>
                        </div>
                    )}

                    {/* AMOUNT INPUT */}
                    <div className="text-center relative py-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest absolute top-0 left-1/2 -translate-x-1/2">{formType === 'goal' ? 'Current Saved' : 'Amount'}</label>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className={`text-4xl font-bold ${formType === 'income' || debtType === 'lent' || formType === 'goal' ? 'text-emerald-500' : 'text-rose-500'}`}>₹</span>
                            <input autoFocus type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className={`text-6xl font-bold bg-transparent outline-none w-64 text-center placeholder-gray-200 dark:placeholder-white/10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                        </div>
                    </div>

                    {/* GOAL TARGET */}
                    {formType === 'goal' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 pl-1">Target Amount</label>
                            <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className={`w-full p-4 rounded-2xl border outline-none text-sm font-medium transition-all focus:ring-2 focus:ring-indigo-500/20 ${isDarkMode ? 'bg-black/20 border-white/10 focus:border-indigo-500/50' : 'bg-gray-50 border-gray-200 focus:border-indigo-500'}`} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 pl-1">{formType === 'goal' ? 'Goal Name' : formType === 'debt' ? 'Person' : 'Category'}</label>
                            {(formType === 'expense' || formType === 'income') ? (
                                isAddingCategory ? (
                                    <div className="flex gap-2">
                                        <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New..." className={`w-full p-4 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                                        <button type="button" onClick={handleAddCategory} className="bg-indigo-600 text-white p-4 rounded-2xl"><Check className="w-4 h-4"/></button>
                                        <button type="button" onClick={() => setIsAddingCategory(false)} className="bg-gray-200 dark:bg-white/10 p-4 rounded-2xl"><X className="w-4 h-4"/></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <div className="relative w-full">
                                            <select value={title} onChange={e => setTitle(e.target.value)} className={`w-full p-4 rounded-2xl border outline-none text-sm appearance-none font-medium ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                <option value="" disabled>Select...</option>
                                                {activeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><ChevronRight className="w-4 h-4 rotate-90"/></div>
                                        </div>
                                        {formType === 'expense' && <button type="button" onClick={() => setIsAddingCategory(true)} className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl hover:bg-gray-200 transition-colors"><Plus className="w-4 h-4 text-gray-500" /></button>}
                                    </div>
                                )
                            ) : (
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={formType === 'debt' ? 'e.g. Rahul' : 'e.g. New Phone'} className={`w-full p-4 rounded-2xl border outline-none text-sm font-medium ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                            )}
                        </div>
                         
                         <div className="space-y-2"><label className="text-xs font-bold text-gray-500 pl-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={`w-full p-4 rounded-2xl border outline-none text-sm font-medium ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} /></div>
                    </div>

                    {/* NEW: PAYMENT MODE SECTION */}
                    {(formType === 'expense' || formType === 'income') && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 pl-1">Payment Method</label>
                            {isAddingPaymentMode ? (
                                <div className="flex gap-2">
                                    <input type="text" value={newPaymentModeName} onChange={e => setNewPaymentModeName(e.target.value)} placeholder="e.g. HDFC Credit Card" className={`w-full p-4 rounded-2xl border outline-none text-sm ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} />
                                    <button type="button" onClick={handleAddPaymentMode} className="bg-indigo-600 text-white p-4 rounded-2xl"><Check className="w-4 h-4"/></button>
                                    <button type="button" onClick={() => setIsAddingPaymentMode(false)} className="bg-gray-200 dark:bg-white/10 p-4 rounded-2xl"><X className="w-4 h-4"/></button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <div className="relative w-full">
                                        <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className={`w-full p-4 rounded-2xl border outline-none text-sm appearance-none font-medium ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                            {paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><ChevronRight className="w-4 h-4 rotate-90"/></div>
                                    </div>
                                    <button type="button" onClick={() => setIsAddingPaymentMode(true)} className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5 hover:bg-gray-200 transition-colors">
                                        <Plus className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2"><label className="text-xs font-bold text-gray-500 pl-1">Note</label><input type="text" placeholder="Optional description..." value={description} onChange={e => setDescription(e.target.value)} className={`w-full p-4 rounded-2xl border outline-none text-sm font-medium ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`} /></div>

                    <div className="pt-4 space-y-3">
                        <button type="submit" className={`w-full font-bold py-4 rounded-2xl text-white active:scale-[0.98] transition-all text-lg shadow-lg ${formType === 'income' || debtType === 'lent' ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-indigo-600 shadow-indigo-500/30'}`}>
                            {editingId ? 'Update' : 'Save'} Transaction
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => promptDelete(editingId, formType === 'goal' ? 'goals' : formType === 'debt' ? 'debts' : 'expenses')} 
                                className="w-full py-4 text-rose-500 font-bold text-sm bg-rose-500/10 rounded-2xl hover:bg-rose-500/20 transition-colors"
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
