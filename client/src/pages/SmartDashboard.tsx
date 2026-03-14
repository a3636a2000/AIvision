import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package,
  Truck,
  DollarSign,
  ClipboardList,
  RefreshCw,
  Database,
  Calendar as CalendarIcon,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import SmartFactoryWrapper from "@/components/SmartFactoryWrapper";

type Stats = {
  total: number;
  ng: number;
  ok: number;
  distribution: { type: string; count: number }[];
  trend: { time: string; result: string }[];
};

const EQUIPMENT_DATA = [
  { name: "K01", value: 1600000, color: "#10b981" },
  { name: "K04", value: 796000, color: "#10b981" },
  { name: "K05", value: 526000, color: "#f59e0b" },
  { name: "K06", value: 1300000, color: "#ef4444" },
  { name: "M01", value: 2400000, color: "#6366f1" },
  { name: "M02", value: 1500000, color: "#ef4444" },
];

const PROCESS_DATA = [
  { name: "가공", value: 2700000 },
  { name: "조립", value: 2500000 },
  { name: "도장", value: 2300000 },
  { name: "검사", value: 2100000 },
  { name: "포장", value: 1900000 },
  { name: "출하", value: 1600000 },
  { name: "반입", value: 1500000 },
  { name: "입고", value: 1000000 },
];

const TREND_DATA = [
  { time: "08:00", 생산: 120, 불량: 3 },
  { time: "09:00", 생산: 180, 불량: 5 },
  { time: "10:00", 생산: 240, 불량: 2 },
  { time: "11:00", 생산: 200, 불량: 8 },
  { time: "12:00", 생산: 80, 불량: 1 },
  { time: "13:00", 생산: 260, 불량: 4 },
  { time: "14:00", 생산: 300, 불량: 6 },
  { time: "15:00", 생산: 280, 불량: 3 },
];

const BOARD_MESSAGES = [
  { id: 1, text: "3월 정기 설비 점검 안내", date: "03-14", isNew: true },
  { id: 2, text: "AI 비전 모델 v2.1 업데이트", date: "03-13", isNew: true },
  { id: 3, text: "품질 관리 교육 일정 공지", date: "03-12", isNew: false },
  { id: 4, text: "생산 목표 달성 현황 보고", date: "03-11", isNew: false },
  { id: 5, text: "안전 수칙 준수 안내", date: "03-10", isNew: false },
];

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString()}{suffix}</>;
}

function MiniCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const cells: { day: number; current: boolean; today: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--)
      cells.push({ day: prevDays - i, current: false, today: false });
    for (let d = 1; d <= daysInMonth; d++)
      cells.push({
        day: d,
        current: true,
        today: d === now.getDate() && month === now.getMonth() && year === now.getFullYear(),
      });
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++)
      cells.push({ day: d, current: false, today: false });
    return cells;
  }, [year, month, now]);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-1 hover:bg-white/10 rounded transition-colors">
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>
        <span className="text-sm font-semibold text-white">
          {year}년 {String(month + 1).padStart(2, "0")}월
        </span>
        <button onClick={next} className="p-1 hover:bg-white/10 rounded transition-colors">
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px]">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="py-1 text-slate-400 font-medium">{d}</div>
        ))}
        {days.map((cell, i) => (
          <div
            key={i}
            className={`py-1 rounded-md transition-all text-[11px] ${
              cell.today
                ? "bg-violet-500 text-white font-bold shadow-lg shadow-violet-500/30"
                : cell.current
                ? "text-slate-200 hover:bg-white/10 cursor-pointer"
                : "text-slate-600"
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SmartDashboard() {
  const queryClient = useQueryClient();
  const [clockedIn, setClockedIn] = useState(false);

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/vision/stats"],
    refetchInterval: 5000,
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/seed", { method: "POST" });
      if (!res.ok) throw new Error("Failed to seed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vision/stats"] });
    },
  });

  const total = stats?.total ?? 3487;
  const ok = stats?.ok ?? 3200;
  const ng = stats?.ng ?? 287;
  const yieldRate = total > 0 ? ((ok / total) * 100).toFixed(1) : "0";
  const ngRate = total > 0 ? ((ng / total) * 100).toFixed(1) : "0";

  const kpiCards = [
    {
      title: "ORDER 현황",
      value: total,
      sub: (total * 5950).toLocaleString(),
      icon: ClipboardList,
      gradient: "from-violet-600 to-indigo-600",
      shadow: "shadow-violet-500/25",
      trend: "+12.5%",
      trendUp: true,
      number: 1,
    },
    {
      title: "생산 현황",
      value: ok,
      sub: (ok * 5950).toLocaleString(),
      icon: Package,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/25",
      trend: "+8.3%",
      trendUp: true,
      number: 2,
    },
    {
      title: "납품 현황",
      value: 0,
      sub: "0",
      icon: Truck,
      gradient: "from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-500/25",
      trend: "0%",
      trendUp: true,
      number: 3,
    },
    {
      title: "매출 마감 현황",
      value: 11059,
      sub: "6,329,960",
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25",
      trend: "+5.2%",
      trendUp: true,
      number: 4,
    },
    {
      title: "불량 현황",
      value: ng,
      sub: ngRate + "%",
      icon: AlertTriangle,
      gradient: "from-rose-500 to-red-600",
      shadow: "shadow-rose-500/25",
      trend: "-2.1%",
      trendUp: false,
      number: 5,
    },
  ];

  const DONUT_COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444"];

  const invoiceData = [
    { name: "Invoice", value: 4000 },
    { name: "미수량", value: 0 },
  ];

  const exportData = [
    { name: "수출신고 수량", value: 3200000 },
    { name: "미수량", value: 960000 },
  ];

  return (
    <SmartFactoryWrapper>
      {/* 배경 애니메이션 */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse-glow { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes slide-in { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .card-animate { animation: slide-in .5s ease-out both; }
        .card-animate:nth-child(2) { animation-delay: .08s; }
        .card-animate:nth-child(3) { animation-delay: .16s; }
        .card-animate:nth-child(4) { animation-delay: .24s; }
        .card-animate:nth-child(5) { animation-delay: .32s; }
        .float { animation: float 4s ease-in-out infinite; }
        .glow { animation: pulse-glow 3s ease-in-out infinite; }
        .shimmer-bg {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.05) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        .glass { backdrop-filter: blur(12px); background: rgba(15,23,42,.6); border: 1px solid rgba(255,255,255,.08); }
      `}</style>

      <div className="space-y-4 relative min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 -m-4 lg:-m-5 p-4 lg:p-5 overflow-auto">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl glow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl" />
        </div>

        {/* 헤더 툴바 */}
        <div className="relative glass rounded-xl p-3 card-animate">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-white text-xs font-black">관리</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">관리자님</p>
                  <p className="text-slate-400 text-[10px]">사업장: 품질재단실습</p>
                </div>
              </div>
              <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block" />
              <div className="flex gap-2">
                <button
                  onClick={() => setClockedIn(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    clockedIn
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                  }`}
                >
                  출근
                </button>
                <button
                  onClick={() => setClockedIn(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/30 transition-all"
                >
                  퇴근
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => seedMutation.mutate()}
                disabled={seedMutation.isPending}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/20 transition-all flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                샘플 데이터
              </button>
              <button
                onClick={() => queryClient.invalidateQueries()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                새로고침
              </button>
              <div className="text-right">
                <p className="text-white text-xs font-medium">
                  {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                </p>
                <p className="text-slate-400 text-[10px]">
                  {new Date().toLocaleDateString("ko-KR", { weekday: "long" })} {new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 카드 5개 */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpiCards.map((card) => (
            <div key={card.title} className="card-animate group">
              <div className="glass rounded-xl p-4 hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity`} />
                <div className="shimmer-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-md bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md ${card.shadow}`}>
                        <span className="text-white text-[9px] font-black">{card.number}</span>
                      </span>
                      {card.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <card.icon className={`w-5 h-5 float`} style={{ color: card.gradient.includes("violet") ? "#8b5cf6" : card.gradient.includes("emerald") ? "#10b981" : card.gradient.includes("cyan") ? "#06b6d4" : card.gradient.includes("amber") ? "#f59e0b" : "#ef4444" }} />
                    <span className="text-2xl font-black text-white tracking-tight">
                      <AnimatedNumber value={card.value} />
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">{card.sub}</span>
                    <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${card.trendUp ? "text-emerald-400" : "text-rose-400"}`}>
                      {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {card.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 메인 그리드: 차트 + 사이드 */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 좌측 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 설비 생산 현황 */}
            <div className="glass rounded-xl p-4 card-animate">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <h3 className="text-white text-sm font-semibold">설비 생산 현황</h3>
                <span className="ml-auto text-[10px] text-slate-500">단위: 수량</span>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={EQUIPMENT_DATA} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => (v / 1000000).toFixed(1) + "M"} />
                    <Tooltip
                      contentStyle={{ background: "rgba(15,23,42,.9)", border: "1px solid rgba(139,92,246,.3)", borderRadius: "8px", color: "#fff", fontSize: 12 }}
                      formatter={(value: number) => [value.toLocaleString(), "생산량"]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {EQUIPMENT_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 도넛 차트 2개 + 생산 추이 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Invoice 수량 / 미수량 */}
              <div className="glass rounded-xl p-4 card-animate">
                <div className="flex items-center gap-2 mb-3">
                  <PieChartIcon className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-white text-sm font-semibold">Invoice 수량 / 미수량</h3>
                </div>
                <div className="h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={invoiceData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#334155" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-black text-white">100%</span>
                      <p className="text-[10px] text-slate-400">달성률</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <span className="text-[10px] text-slate-400">Invoice <span className="text-white font-semibold">4K</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span className="text-[10px] text-slate-400">미수량 <span className="text-white font-semibold">0</span></span>
                  </div>
                </div>
              </div>

              {/* 수출신고 수량 / 미수량 */}
              <div className="glass rounded-xl p-4 card-animate">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h3 className="text-white text-sm font-semibold">수출신고 수량 / 미수량</h3>
                </div>
                <div className="h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={exportData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                        <Cell fill="#06b6d4" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-black text-white">77%</span>
                      <p className="text-[10px] text-slate-400">달성률</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span className="text-[10px] text-slate-400">수출 <span className="text-white font-semibold">3.2M</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-slate-400">미수량 <span className="text-white font-semibold">960K</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* 공정 생산 현황 + 실시간 추이 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 card-animate">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-white text-sm font-semibold">공정 생산 현황</h3>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PROCESS_DATA} layout="vertical" margin={{ left: 10 }} barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => (v / 1000000).toFixed(1) + "M"} />
                      <YAxis dataKey="name" type="category" width={40} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "rgba(15,23,42,.9)", border: "1px solid rgba(16,185,129,.3)", borderRadius: "8px", color: "#fff", fontSize: 12 }}
                        formatter={(value: number) => [value.toLocaleString(), "생산량"]}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {PROCESS_DATA.map((_, i) => (
                          <Cell key={i} fill={`hsl(${160 + i * 20}, 70%, ${55 - i * 3}%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-xl p-4 card-animate">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  <h3 className="text-white text-sm font-semibold">실시간 생산 추이</h3>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TREND_DATA}>
                      <defs>
                        <linearGradient id="grad-prod" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="grad-ng" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "rgba(15,23,42,.9)", border: "1px solid rgba(139,92,246,.3)", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
                      <Area type="monotone" dataKey="생산" stroke="#8b5cf6" fill="url(#grad-prod)" strokeWidth={2} />
                      <Area type="monotone" dataKey="불량" stroke="#ef4444" fill="url(#grad-ng)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 1/3: 캘린더 + 수율 + 게시판 */}
          <div className="space-y-4">
            {/* 캘린더 */}
            <div className="glass rounded-xl p-4 card-animate">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-violet-400" />
                <h3 className="text-white text-sm font-semibold">캘린더</h3>
              </div>
              <MiniCalendar />
            </div>

            {/* 수율 게이지 */}
            <div className="glass rounded-xl p-4 card-animate">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-white text-sm font-semibold">종합 수율</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#gauge-grad)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${parseFloat(yieldRate) * 2.64} 264`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-black text-white">{yieldRate}%</span>
                      <p className="text-[10px] text-slate-400">양품률</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-bold">{ok.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">양품</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span className="text-rose-400 text-xs font-bold">{ng.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">불량</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 게시판 */}
            <div className="glass rounded-xl p-4 card-animate">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-white text-sm font-semibold">게시판</h3>
                </div>
                <button className="text-[10px] text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  + 글쓰기
                </button>
              </div>
              <div className="space-y-2">
                {BOARD_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-xs truncate group-hover:text-white transition-colors">
                        {msg.isNew && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
                        )}
                        {msg.text}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 shrink-0">{msg.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SmartFactoryWrapper>
  );
}
