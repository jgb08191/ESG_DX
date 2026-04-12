import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Key, Bot, User, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ESG_ITEMS, LEVEL_LABELS, calculateGrade, calculateAreaGrade } from '../data/esgData';

const SYSTEM_INSTRUCTION = `너는 K-ESG 가이드라인 전문가이며, 기업의 고용 안정성과 친환경 전환을 돕는 전략 컨설턴트야.
사용자가 ESG 자가진단 점수를 공유하면 해당 점수를 분석하여 구체적인 개선 방안을 제시해줘.
특히 사회(S) 영역의 노동, 다양성, 산업안전, 인권에는 관련 법률(근로기준법, 산업안전보건법, 중대재해처벌법 등) 기반 실무적 답변 제공.
답변은 한국어, 구체적 법조항·실행 방안·단계별 로드맵 포함.
점수 기준: 1=인식없음, 2=계획미수립, 3=계획완료, 4=실행중, 5=고도화`;

function buildScoresSummary(scores) {
  if (!scores || Object.keys(scores).length === 0) return '';
  const lines = ['[현재 ESG 진단 결과]'];
  const overall = calculateGrade(scores);
  lines.push(`종합: ${overall.grade}등급 (${overall.percent}점/100)`);
  for (const area of ['P', 'E', 'S', 'G']) {
    const ag = calculateAreaGrade(scores, area);
    if (ag.percent > 0) lines.push(`${area}영역: ${ag.grade}등급 (${ag.percent}점)`);
  }
  lines.push('', '[항목별]');
  ESG_ITEMS.forEach((item) => {
    if (scores[item.id]) {
      lines.push(`${item.id} ${item.item}: ${scores[item.id]}단계`);
    }
  });
  return lines.join('\n');
}

export default function Chatbot({ scores }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '안녕하세요! K-ESG 전략 컨설턴트입니다.\n\n진단 결과를 바탕으로 맞춤형 개선 방안을 제안해 드립니다. 궁금한 점을 질문해주세요.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (!apiKey.trim()) { setShowSettings(true); return; }

    const userMsg = input.trim();
    setInput('');
    setMessages((p) => [...p, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const summary = buildScoresSummary(scores);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_INSTRUCTION + (summary ? `\n\n${summary}` : ''),
      });
      const history = messages.filter((m) => m.role !== 'system').map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMsg);
      setMessages((p) => [...p, { role: 'assistant', content: result.response.text() }]);
    } catch (err) {
      setMessages((p) => [...p, { role: 'assistant', content: `오류: ${err.message}\n\nAPI 키를 확인해주세요.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = ['현재 진단 결과 분석해줘', 'S영역 개선 방안은?', '중대재해처벌법 대응법'];

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#00A3FF] text-white shadow-lg shadow-blue-300/40 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[540px] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00A3FF] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">ESG 컨설턴트</h3>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Gemini AI
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setShowSettings(!showSettings)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${showSettings ? 'bg-sky-100 text-[#00A3FF]' : 'text-slate-400 hover:bg-slate-100'}`}>
                  <Key className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* API Key */}
            <AnimatePresence>
              {showSettings && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-b border-slate-100 bg-sky-50/40 overflow-hidden">
                  <div className="p-3">
                    <label className="text-xs text-slate-500 mb-1 block font-medium">Gemini API Key</label>
                    <div className="flex gap-2">
                      <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIzaSy..." className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/30" />
                      <button onClick={() => setShowSettings(false)} className="px-3 py-2 rounded-lg bg-[#00A3FF] text-white text-xs font-semibold">확인</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#00A3FF]/10 text-[#00A3FF]' : 'bg-slate-100 text-slate-500'}`}>
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-[#00A3FF] text-white rounded-tr-sm' : 'bg-slate-50 text-slate-700 border border-slate-200 rounded-tl-sm'}`}>
                    {msg.content.split('\n').map((line, j) => <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>)}
                  </div>
                </motion.div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {quickPrompts.map((p, i) => (
                    <button key={i} onClick={() => setInput(p)} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-500 hover:text-[#00A3FF] hover:border-[#00A3FF]/30 transition-all">{p}</button>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center"><Bot className="w-3 h-3 text-slate-400" /></div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    {[0, 150, 300].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]/50 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-100">
              <div className="flex gap-2">
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={apiKey ? '질문을 입력하세요...' : 'API 키를 먼저 설정해주세요'} className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/30" />
                <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage} disabled={isLoading || !input.trim()} className="w-10 h-10 rounded-xl bg-[#00A3FF] text-white flex items-center justify-center disabled:opacity-30">
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
