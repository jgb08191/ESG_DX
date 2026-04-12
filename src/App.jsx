import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroESG from './components/HeroESG';
import DiagnosticModal from './components/DiagnosticModal';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import { ESG_ITEMS } from './data/esgData';
import { loginWithGoogle, loginWithKakao, logout, auth, isConfigured, onAuthStateChanged, saveScores, loadScores } from './data/firebaseConfig';

export default function App() {
  const [scores, setScores] = useState({});
  const [modalArea, setModalArea] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [user, setUser] = useState(null);

  // Firebase auth listener
  useEffect(() => {
    if (!isConfigured() || !auth) return;
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser({ uid: fbUser.uid, displayName: fbUser.displayName, email: fbUser.email, photoURL: fbUser.photoURL });
        const saved = await loadScores(fbUser.uid);
        if (saved) setScores(saved);
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const handleScoreChange = useCallback((itemId, level) => {
    setScores((prev) => {
      const next = { ...prev, [itemId]: level };
      if (user?.uid && isConfigured()) saveScores(user.uid, next);
      return next;
    });
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      const u = await loginWithGoogle();
      setUser({ uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL });
    } catch {
      if (!isConfigured()) setUser({ uid: 'demo', displayName: '데모 사용자', email: 'demo@example.com', photoURL: null });
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const u = await loginWithKakao();
      setUser(u);
    } catch {
      if (!isConfigured()) setUser({ uid: 'demo', displayName: '데모 사용자', email: 'demo@example.com', photoURL: null });
    }
  };

  const handleLogout = async () => {
    try { await logout(); } catch {}
    setUser(null);
  };

  const totalAnswered = Object.keys(scores).length;
  const totalItems = ESG_ITEMS.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        user={user}
        onGoogleLogin={handleGoogleLogin}
        onKakaoLogin={handleKakaoLogin}
        onLogout={handleLogout}
        onShowReport={setCurrentView}
        currentView={currentView}
      />

      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <main key="landing">
            <HeroESG
              onSelectArea={setModalArea}
              totalAnswered={totalAnswered}
              totalItems={totalItems}
            />
          </main>
        ) : (
          <Dashboard
            key="dashboard"
            scores={scores}
            onBack={() => setCurrentView('landing')}
          />
        )}
      </AnimatePresence>

      {/* Diagnostic Modal */}
      <AnimatePresence>
        {modalArea && (
          <DiagnosticModal
            area={modalArea}
            scores={scores}
            onScoreChange={handleScoreChange}
            onClose={() => setModalArea(null)}
          />
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <Chatbot scores={scores} />
    </div>
  );
}
