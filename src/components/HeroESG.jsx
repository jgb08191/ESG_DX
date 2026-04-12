import { motion } from 'framer-motion';
import { Leaf, Users, Building2, ChevronRight } from 'lucide-react';

const letters = [
  {
    char: 'E',
    area: 'E',
    label: 'nvironmental',
    ko: '환경',
    desc: '온실가스·에너지·폐기물 관리',
    color: '#10b981',
    gradient: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-200/60',
    lightBg: 'bg-emerald-50',
    icon: Leaf,
    count: 7,
  },
  {
    char: 'S',
    area: 'S',
    label: 'ocial',
    ko: '사회',
    desc: '노동·인권·안전·정보보호',
    color: '#00A3FF',
    gradient: 'from-sky-400 to-blue-500',
    shadow: 'shadow-sky-200/60',
    lightBg: 'bg-sky-50',
    icon: Users,
    count: 12,
  },
  {
    char: 'G',
    area: 'G',
    label: 'overnance',
    ko: '지배구조',
    desc: '이사회·윤리경영·감사',
    color: '#8b5cf6',
    gradient: 'from-violet-400 to-purple-500',
    shadow: 'shadow-violet-200/60',
    lightBg: 'bg-violet-50',
    icon: Building2,
    count: 6,
  },
];

export default function HeroESG({ onSelectArea, totalAnswered, totalItems }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-16">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-sky-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-slate-400 mb-2 tracking-wide"
        >
          K-ESG 가이드라인 기반
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-2xl md:text-3xl font-bold text-slate-800 mb-2"
        >
          우리 기업의 <span className="text-[#00A3FF]">지속가능경영</span> 수준을 진단하세요
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-slate-400 mb-14"
        >
          아래 영역을 클릭하여 27개 핵심 항목을 점검합니다
        </motion.p>

        {/* E S G Large Buttons */}
        <div className="flex items-stretch justify-center gap-5 md:gap-8 mb-16">
          {letters.map((l, i) => {
            const Icon = l.icon;
            return (
              <motion.button
                key={l.char}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1, type: 'spring', stiffness: 180 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectArea(l.area)}
                className="group flex flex-col items-center"
              >
                {/* Card */}
                <div className={`relative w-32 h-40 md:w-40 md:h-48 rounded-3xl bg-gradient-to-br ${l.gradient} shadow-xl ${l.shadow} flex flex-col items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-2xl overflow-hidden`}>
                  {/* Subtle pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-3 right-3 w-20 h-20 border-2 border-white rounded-full" />
                    <div className="absolute bottom-3 left-3 w-12 h-12 border-2 border-white rounded-full" />
                  </div>

                  {/* Main letter */}
                  <span className="relative text-7xl md:text-8xl font-black text-white leading-none drop-shadow-sm">
                    {l.char}
                  </span>

                  {/* Icon badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/20 to-transparent">
                    <p className="text-xs text-white/90 font-medium">{l.count}개 항목</p>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Label */}
                <p className="text-base font-bold text-slate-700">{l.ko}</p>
                <p className="text-xs text-slate-400 mt-0.5">{l.desc}</p>
              </motion.button>
            );
          })}
        </div>

        {/* P (공시) - Minimal card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="max-w-sm mx-auto mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectArea('P')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#00A3FF]/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00A3FF]/8 flex items-center justify-center shrink-0 group-hover:bg-[#00A3FF]/15 transition-colors">
              <span className="text-lg font-black text-[#00A3FF]">P</span>
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700">정보공시 (Public Disclosure)</p>
              <p className="text-xs text-slate-400 truncate">ESG 정보공시 방식·핵심이슈 KPI — 2개 항목</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#00A3FF] transition-colors shrink-0" />
          </motion.button>
        </motion.div>

        {/* Progress */}
        {totalAnswered > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200/80 shadow-sm"
          >
            <span className="text-xs text-slate-400">진단 진행</span>
            <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(totalAnswered / totalItems) * 100}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full bg-[#00A3FF]"
              />
            </div>
            <span className="text-xs font-semibold text-[#00A3FF]">
              {totalAnswered}/{totalItems}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
