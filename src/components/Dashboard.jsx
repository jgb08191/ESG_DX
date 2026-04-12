import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { TrendingUp, Award, ArrowLeft, Leaf, Users, Building2, FileText } from 'lucide-react';
import { ESG_ITEMS, CATEGORIES, calculateGrade, calculateAreaGrade, LEVEL_LABELS } from '../data/esgData';

const AREA_COLORS = { P: '#00A3FF', E: '#10b981', S: '#0ea5e9', G: '#8b5cf6' };
const BAR_COLORS = ['#00A3FF', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316'];

const gradeConfig = {
  A: { color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', label: '우수' },
  B: { color: '#00A3FF', bg: 'bg-sky-50', border: 'border-sky-200', label: '양호' },
  C: { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', label: '보통' },
  D: { color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', label: '미흡' },
  '-': { color: '#94a3b8', bg: 'bg-slate-50', border: 'border-slate-200', label: '미진단' },
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm shadow-lg">
        <p className="font-medium text-slate-700">{payload[0].payload.fullName || payload[0].payload.name}</p>
        <p className="text-[#00A3FF] font-semibold">{payload[0].value}단계 / 5단계</p>
      </div>
    );
  }
  return null;
}

export default function Dashboard({ scores, onBack }) {
  const overall = calculateGrade(scores);
  const oc = gradeConfig[overall.grade];

  const areas = ['P', 'E', 'S', 'G'].map((key) => ({
    key,
    ...CATEGORIES[key],
    grade: calculateAreaGrade(scores, key),
  }));

  // S영역 레이더
  const sItems = ESG_ITEMS.filter((i) => i.area === 'S');
  const radarData = sItems.map((item) => ({
    subject: item.item.length > 7 ? item.item.slice(0, 7) + '..' : item.item,
    fullName: item.item,
    score: scores[item.id] || 0,
    fullMark: 5,
  }));

  // 고용 안정성 바 차트
  const employmentData = [
    { name: '신규채용·고용유지', score: scores['S-1-1'] || 0 },
    { name: '정규직 비율', score: scores['S-1-2'] || 0 },
    { name: '교육훈련비', score: scores['S-1-4'] || 0 },
    { name: '여성 구성원', score: scores['S-2-1'] || 0 },
    { name: '장애인 고용', score: scores['S-2-2'] || 0 },
    { name: '안전보건 체계', score: scores['S-3-1'] || 0 },
  ];

  // 영역별 pie data
  const pieData = areas.map((a) => ({
    name: a.name,
    value: a.grade.percent || 1,
    color: AREA_COLORS[a.key],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-700 hover:shadow transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">종합 ESG 리포트</h1>
            <p className="text-sm text-slate-400">진단 결과 분석 및 영역별 현황</p>
          </div>
        </div>
      </div>

      {/* Overall Grade + Area Grades */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border-2 ${oc.border} ${oc.bg} p-6 flex flex-col items-center justify-center`}
        >
          <p className="text-xs text-slate-500 font-medium mb-1">종합 등급</p>
          <motion.span
            key={overall.grade}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-5xl font-black"
            style={{ color: oc.color }}
          >
            {overall.grade}
          </motion.span>
          <p className="text-sm font-semibold mt-1" style={{ color: oc.color }}>{oc.label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{overall.percent}점</p>
        </motion.div>

        {areas.map((a, i) => {
          const ac = gradeConfig[a.grade.grade];
          return (
            <motion.div
              key={a.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center shadow-sm"
            >
              <p className="text-xs text-slate-400 font-medium mb-1">{a.name} ({a.key})</p>
              <motion.span
                key={a.grade.grade}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-black"
                style={{ color: ac.color }}
              >
                {a.grade.grade}
              </motion.span>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${a.grade.percent}%` }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: AREA_COLORS[a.key] }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{a.grade.percent}점</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart - S 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#00A3FF]" />
            <h3 className="text-base font-bold text-slate-800">사회(S) 영역 레이더</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">12개 사회 항목 종합 현황</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar dataKey="score" stroke="#00A3FF" fill="#00A3FF" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - 고용 안정성 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">고용 안정성 지수</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">S영역 핵심 고용 항목 분석</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employmentData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={24}>
                {employmentData.map((_, idx) => (
                  <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Area Breakdown Pie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-violet-500" />
          <h3 className="text-base font-bold text-slate-800">영역별 비교</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">P·E·S·G 영역별 달성률 비교</p>
        <div className="flex items-center justify-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {areas.map((a) => (
              <div key={a.key} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AREA_COLORS[a.key] }} />
                <span className="text-sm text-slate-600 w-20">{a.name} ({a.key})</span>
                <span className="text-sm font-bold text-slate-800">{a.grade.percent}점</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detail Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">전체 항목 상세</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">영역</th>
                <th className="px-4 py-3 text-left font-medium">항목</th>
                <th className="px-4 py-3 text-center font-medium">점수</th>
                <th className="px-4 py-3 text-left font-medium">수준</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ESG_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{item.id}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="inline-flex w-6 h-6 rounded-md text-white text-xs font-bold items-center justify-center"
                      style={{ backgroundColor: AREA_COLORS[item.area] }}
                    >
                      {item.area}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">{item.item}</td>
                  <td className="px-4 py-2.5 text-center">
                    {scores[item.id] ? (
                      <span className="inline-flex w-7 h-7 rounded-lg text-white text-xs font-bold items-center justify-center" style={{ backgroundColor: AREA_COLORS[item.area] }}>
                        {scores[item.id]}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-400">
                    {scores[item.id] ? LEVEL_LABELS[scores[item.id]] : '미응답'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
