import { motion } from 'framer-motion';
import { Leaf, BarChart3, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Header({ user, onGoogleLogin, onKakaoLogin, onLogout, onShowReport, currentView }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onShowReport('landing')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#00A3FF] flex items-center justify-center shadow-sm shadow-blue-200 group-hover:shadow-md transition-shadow">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              ESG <span className="text-[#00A3FF] font-extrabold">DX</span>
            </span>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Report Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onShowReport(currentView === 'dashboard' ? 'landing' : 'dashboard')}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentView === 'dashboard'
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-[#00A3FF] text-white shadow-sm shadow-blue-200 hover:bg-[#0090e0]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {currentView === 'dashboard' ? '메인으로' : '종합 리포트'}
            </motion.button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full ring-2 ring-slate-100" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#00A3FF]/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-[#00A3FF]" />
                    </div>
                  )}
                  <span className="text-sm text-slate-700 font-medium max-w-[80px] truncate hidden sm:block">
                    {user.displayName || '사용자'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-50">
                        <p className="text-[11px] text-slate-400">계정</p>
                        <p className="text-sm text-slate-700 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { onLogout(); setShowDropdown(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> 로그아웃
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onGoogleLogin}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 shadow-sm hover:shadow transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={onKakaoLogin}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FEE500] hover:bg-[#fdd800] border border-[#e5cf00] text-xs font-semibold text-[#3c1e1e] shadow-sm hover:shadow transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#3c1e1e">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.88 5.31 4.68 6.73l-.97 3.59c-.1.37.32.67.65.46L10.5 19.2c.49.05 1 .08 1.5.08 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                  </svg>
                  Kakao
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
