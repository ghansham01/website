import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  Plus, X, Coffee, Home, Film, ShoppingBag, 
  TrendingDown, TrendingUp, Zap, CreditCard,
  Utensils, Car, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CATEGORY_MAP = {
  Food: { icon: Utensils, color: '#f43f5e' }, // Rose 500
  Rent: { icon: Home, color: '#3b82f6' }, // Blue 500
  Entertainment: { icon: Film, color: '#aa3bff' }, // Neon Purple
  Shopping: { icon: ShoppingBag, color: '#f59e0b' }, // Amber 500
  Transport: { icon: Car, color: '#06b6d4' }, // Cyan 500
  Utilities: { icon: Zap, color: '#10b981' }, // Emerald 500
  Income: { icon: CreditCard, color: '#10b981' }, // Emerald 500 (For income)
};

const CATEGORIES = Object.keys(CATEGORY_MAP).filter(c => c !== 'Income');

const INITIAL_TRANSACTIONS = [];

export default function ExpenseTracker({ onLogout }) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('expense');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);

  const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += curr.amount;
        acc.totalBalance += curr.amount;
      } else {
        acc.totalExpense += curr.amount;
        acc.totalBalance -= curr.amount;
      }
      return acc;
    }, { totalBalance: 0, totalIncome: 0, totalExpense: 0 });
  }, [transactions]);

  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formName || !formAmount || isNaN(Number(formAmount))) return;

    const newTx = {
      id: Math.random().toString(36).substr(2, 9),
      name: formName,
      amount: Number(formAmount),
      type: formType,
      category: formType === 'income' ? 'Income' : formCategory,
      date: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsModalOpen(false);
    setFormName('');
    setFormAmount('');
    setFormType('expense');
    setFormCategory(CATEGORIES[0]);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, x: '100%', transition: { ease: 'linear', duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-4 md:p-8 font-sans selection:bg-[#aa3bff] selection:text-white flex justify-center">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        
        {/* header section */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">
            Nexus<span className="text-[#aa3bff]">Tracker</span>
          </h1>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#aa3bff] hover:bg-[#9030db] text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-[0_0_15px_rgba(170,59,255,0.4)] hover:shadow-[0_0_25px_rgba(170,59,255,0.6)]"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Transaction</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center justify-center p-2.5 rounded-full bg-[#1A1F29] border border-[#2A303C] hover:bg-[#f43f5e]/10 hover:text-[#f43f5e] hover:border-[#f43f5e]/30 text-[#8b95a5] transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </header>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 relative rounded-3xl p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-[#1A1F29]/80 to-[#10141D]/90 border border-[#2A303C] shadow-2xl"
          >

            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#aa3bff] rounded-full blur-[100px] opacity-20 pointer-events-none animate-pulse"></div>

            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#10b981] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-[#8b95a5] font-medium tracking-wide uppercase text-xs mb-2">Total Balance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <div className="flex-1 bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-[#10b981] mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Income</span>
                  </div>
                  <p className="font-bold text-lg text-white/90">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="flex-1 bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-[#f43f5e] mb-1">
                    <TrendingDown size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Expense</span>
                  </div>
                  <p className="font-bold text-lg text-white/90">
                    ${totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 rounded-3xl p-6 bg-[#151A22] border border-[#2A303C] shadow-lg flex flex-col"
          >
            <h2 className="text-lg font-semibold text-white/80 mb-4 px-2 tracking-wide">Expense Breakdown</h2>
            <div className="flex-1 min-h-[250px] w-full relative">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_MAP[entry.name]?.color || '#8b95a5'} 
                          className="hover:opacity-80 transition-opacity duration-300 outline-none"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F29', 
                        borderColor: '#2A303C',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                      }}
                      itemStyle={{ color: 'white' }}
                      formatter={(value) => `$${value}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#8b95a5]">
                  No expenses to display
                </div>
              )}
            </div>
            
            {/* Chart Legend */}
            {chartData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {chartData.map((entry, idx) => {
                  const Icon = CATEGORY_MAP[entry.name]?.icon || Zap;
                  const color = CATEGORY_MAP[entry.name]?.color || '#fff';
                  return (
                    <div key={idx} className="flex items-center gap-1.5 text-xs font-medium text-[#8b95a5] bg-[#1A1F29] px-3 py-1.5 rounded-full border border-[#2A303C]">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>{entry.name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6 tracking-wide text-white/90">Recent Transactions</h2>
          
          <motion.div 
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            <AnimatePresence mode="popLayout">
              {transactions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-[#8b95a5] bg-[#151A22] rounded-2xl border border-[#2A303C]/50 border-dashed"
                >
                  <Coffee size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No transactions yet.</p>
                  <p className="text-sm">Click "Add Transaction" to get started.</p>
                </motion.div>
              ) : (
                transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const IconComponent = CATEGORY_MAP[tx.category]?.icon || Zap;
                  const categoryColor = CATEGORY_MAP[tx.category]?.color || '#8b95a5';

                  return (
                    <motion.div
                      layout
                      variants={itemVariants}
                      key={tx.id}
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                      className="group flex justify-between items-center bg-[#151A22] border border-[#2A303C] p-4 md:p-5 rounded-2xl hover:bg-[#1A1F29] hover:border-[#aa3bff]/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm"
                          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                        >
                          <IconComponent size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-[15px] text-white/90 mb-0.5">{tx.name}</p>
                          <div className="flex items-center gap-2 text-xs text-[#8b95a5]">
                            <span className="font-medium bg-[#1A1F29] px-2 py-0.5 rounded-md border border-[#2A303C]">{tx.category}</span>
                            <span>•</span>
                            <span>{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={cn(
                            "font-bold text-[17px] tracking-tight",
                            isIncome ? "text-[#10b981]" : "text-white"
                          )}>
                            {isIncome ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="text-[#8b95a5] hover:text-[#f43f5e] hover:bg-[#f43f5e]/10 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          aria-label="Delete transaction"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
  
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            {/* Modal Panel */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#10141D] z-50 border-l border-[#2A303C] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[#2A303C]">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#aa3bff]">New Transaction</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#1A1F29] hover:bg-[#2A303C] p-2 rounded-full text-[#8b95a5] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <form id="tx-form" onSubmit={handleAddTransaction} className="space-y-6">
                  
                  {/* Type Toggle */}
                  <div className="flex bg-[#1A1F29] p-1 rounded-xl border border-[#2A303C]">
                    <button
                      type="button"
                      onClick={() => setFormType('expense')}
                      className={cn(
                        "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                        formType === 'expense' ? "bg-[#f43f5e] text-white shadow-md" : "text-[#8b95a5] hover:text-white"
                      )}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType('income')}
                      className={cn(
                        "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                        formType === 'income' ? "bg-[#10b981] text-white shadow-md" : "text-[#8b95a5] hover:text-white"
                      )}
                    >
                      Income
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#8b95a5] uppercase tracking-wider">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#8b95a5]">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        required
                        value={formAmount}
                        onChange={e => setFormAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#1A1F29] border border-[#2A303C] rounded-xl pl-10 pr-4 py-4 text-3xl font-bold font-sans tracking-tight focus:outline-none focus:border-[#aa3bff] focus:ring-1 focus:ring-[#aa3bff] transition-all placeholder:text-[#2A303C]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#8b95a5] uppercase tracking-wider">Name</label>
                    <input 
                      type="text" 
                      required
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="e.g., Netflix Subscription"
                      className="w-full bg-[#1A1F29] border border-[#2A303C] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#aa3bff] focus:ring-1 focus:ring-[#aa3bff] transition-all placeholder:text-[#2A303C]"
                    />
                  </div>

                  {formType === 'expense' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#8b95a5] uppercase tracking-wider">Category</label>
                      <div className="grid grid-cols-2 gap-3">
                        {CATEGORIES.map(cat => {
                          const Icon = CATEGORY_MAP[cat].icon;
                          const isSelected = formCategory === cat;
                          return (
                            <button
                              type="button"
                              key={cat}
                              onClick={() => setFormCategory(cat)}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-sm font-medium",
                                isSelected 
                                  ? "bg-[#aa3bff]/10 border-[#aa3bff] text-white" 
                                  : "bg-[#1A1F29] border-[#2A303C] text-[#8b95a5] hover:bg-[#2A303C]"
                              )}
                            >
                              <Icon size={18} style={{ color: isSelected ? CATEGORY_MAP[cat].color : undefined }} />
                              {cat}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </form>
              </div>

              <div className="p-6 border-t border-[#2A303C] bg-[#10141D]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  form="tx-form"
                  className="w-full bg-[#aa3bff] hover:bg-[#9030db] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-[0_0_15px_rgba(170,59,255,0.3)] hover:shadow-[0_0_25px_rgba(170,59,255,0.5)]"
                >
                  Save Transaction
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
