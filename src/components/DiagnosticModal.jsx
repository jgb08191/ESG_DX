import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Info, Leaf, Users, Building2, FileText } from 'lucide-react';
import { CATEGORIES, ESG_ITEMS, LEVEL_LABELS } from '../data/esgData';

const areaStyle = {
  P: { color: '#00A3FF', bg: 'bg-sky-50', btn: 'bg-[#00A3FF]', dot: 'bg-[#00A3FF]', border: 'border-sky-200', ring: 'ring-sky-200' },
  E: { color: '#10b981', bg: 'bg-emerald-50', btn: 'bg-emerald-500', dot: 'bg-emerald-500', border: 'border-emerald-200', ring: 'ring-emerald-200' },
  S: { color: '#00A3FF', bg: 'bg-sky-50', btn: 'bg-[#00A3FF]', dot: 'bg-[#00A3FF]', border: 'border-sky-200', ring: 'ring-sky-200' },
  G: { color: '#8b5cf6', bg: 'bg-violet-50', btn: 'bg-violet-500', dot: 'bg-violet-500', border: 'border-violet-200', ring: 'ring-violet-200' },
};

const areaIcons = { P: FileText, E: Leaf, S: Users, G: Building2 };

export default function DiagnosticModal({ area, scores, onScoreChange, onClose }) {
  if (!area) return null;
  const meta = CATEGORIES[area];
  const style = areaStyle[area];
  const Icon = areaIcons[area];
  const items = ESG_ITEMS.filter((item) => item.area === area);
  const answered = items.filter((item) => scores[item.id]).length;

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center modal-backdrop bg-black/30 overflow-y-auto py-8 px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`${style.bg} px-6 py-5 border-b ${style.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: style.color }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {area} — {meta.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {meta.fullName} · {answered}/{items.length}개 완료
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl hover:bg-white/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${items.length > 0 ? (answered / items.length) * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: style.color }}
              />
            </div>
          </div>

          {/* Level Guide */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Info className="w-3 h-3" />
              1=인식없음 · 2=계획미수립 · 3=계획완료 · 4=실행중 · 5=고도화
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-5">
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  {category}
                </h3>

                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-4 transition-all ${
                        scores[item.id] ? `${style.border} ${style.bg}/30` : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 shrink-0 mt-0.5">
                          {item.id}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 leading-snug">
                            {item.question}
                          </p>
                        </div>
                        {scores[item.id] && (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: style.color }} />
                        )}
                      </div>

                      {/* Score buttons */}
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => onScoreChange(item.id, level)}
                            title={LEVEL_LABELS[level]}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                              scores[item.id] === level
                                ? `${style.btn} text-white shadow-md`
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>

                      {scores[item.id] && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] text-slate-400 mt-2 pl-0.5"
                        >
                          → {LEVEL_LABELS[scores[item.id]]}
                        </motion.p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {answered}/{items.length}개 항목 완료
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ backgroundColor: style.color }}
            >
              완료
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
