import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4 selection:bg-[#aa3bff] selection:text-white">
  
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square pointer-events-none">
  
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#aa3bff] rounded-full blur-[150px] opacity-20 animate-pulse" />
  
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#10b981] rounded-full blur-[150px] opacity-10" />
  
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
  
        <div className="text-center mb-8">
  
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1F29] border border-[#2A303C] shadow-lg mb-6"
          >
            <Activity className="w-8 h-8 text-[#aa3bff]" />
          </motion.div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Welcome to <br/>
            Nexus<span className="text-[#aa3bff]">Tracker</span>
          </h1>
          
          <p className="text-[#8b95a5] font-medium text-sm">
            Sign in to manage your finances.
          </p>
        
        </div>

        <div className="bg-[#151A22]/80 backdrop-blur-xl border border-[#2A303C] rounded-3xl p-8 shadow-2xl">
        
          <form onSubmit={handleSubmit} className="space-y-5">
        
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8b95a5] uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b95a5]">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#1A1F29] border border-[#2A303C] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#aa3bff] focus:ring-1 focus:ring-[#aa3bff] transition-all placeholder:text-[#2A303C] text-white"
                />
        
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-[#8b95a5] uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b95a5]">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1A1F29] border border-[#2A303C] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#aa3bff] focus:ring-1 focus:ring-[#aa3bff] transition-all placeholder:text-[#2A303C] text-white tracking-widest"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full relative group mt-8 bg-[#aa3bff] hover:bg-[#9030db] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-[0_0_15px_rgba(170,59,255,0.3)] hover:shadow-[0_0_25px_rgba(170,59,255,0.5)] flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>
        </div>
        
        <p className="text-center text-[#8b95a5] text-xs mt-8">
          By signing in, you are ignoring terms of service <br /> because this is a cool demo.
        </p>
      </motion.div>
    </div>
  );
}
