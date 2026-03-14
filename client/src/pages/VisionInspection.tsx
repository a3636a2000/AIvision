import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Camera, ZoomIn, Play, Square, Eye, Shield,
  AlertTriangle, CheckCircle, Activity, X, Maximize2
} from "lucide-react";
import SmartFactoryWrapper from "@/components/SmartFactoryWrapper";

type VisionLog = {
  id: number;
  time: string;
  barcode: string;
  result: "OK" | "NG";
  defectType: string | null;
  confidence: string;
  image: string;
  itemName: string;
};

export default function VisionInspectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data: logs } = useQuery<VisionLog[]>({
    queryKey: ["/api/vision/logs"],
    refetchInterval: 2000,
  });

  const okCount = logs?.filter(l => l.result === "OK").length ?? 0;
  const ngCount = logs?.filter(l => l.result === "NG").length ?? 0;
  const totalCount = logs?.length ?? 0;
  const yieldRate = totalCount > 0 ? ((okCount / totalCount) * 100).toFixed(1) : "0";

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) { videoRef.current.srcObject = stream; streamRef.current = stream; setIsLive(true); }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("카메라를 실행할 수 없습니다. 권한을 확인해주세요.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsLive(false);
  };

  useEffect(() => {
    let animationFrameId: number;
    const drawOverlay = () => {
      if (!isLive || !videoRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() > 0.9) {
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 100);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, 100, 100);
        ctx.fillStyle = '#00ff00';
        ctx.font = '16px Arial';
        ctx.fillText(`Confidence: ${(Math.random() * 10 + 89).toFixed(1)}%`, x, y - 10);
      }
      animationFrameId = requestAnimationFrame(drawOverlay);
    };
    if (isLive) drawOverlay();
    else cancelAnimationFrame(animationFrameId!);
    return () => cancelAnimationFrame(animationFrameId!);
  }, [isLive]);

  useEffect(() => { return () => stopCamera(); }, []);

  return (
    <SmartFactoryWrapper>
      <style>{`
        @keyframes slide-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-glow { 0%,100%{opacity:.3} 50%{opacity:.7} }
        @keyframes scan-line { 0%{top:0} 100%{top:100%} }
        .card-animate { animation: slide-in .4s ease-out both; }
        .card-animate-2 { animation: slide-in .4s ease-out .08s both; }
        .card-animate-3 { animation: slide-in .4s ease-out .16s both; }
        .card-animate-4 { animation: slide-in .4s ease-out .24s both; }
        .glass { backdrop-filter:blur(12px); background:rgba(15,23,42,.6); border:1px solid rgba(255,255,255,.08); }
        .glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      <div className="space-y-4 relative min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 -m-4 lg:-m-5 p-4 lg:p-5 overflow-auto">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl glow" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl glow" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* 헤더 */}
        <div className="relative glass rounded-xl p-3 card-animate flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base tracking-tight">AI 비전 검사 모니터링</h2>
              <p className="text-slate-400 text-[11px]">실시간 카메라 영상 분석 및 불량 감지 로그</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isLive ? (
              <button onClick={startCamera}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all">
                <Play className="w-4 h-4" /> 카메라 연결
              </button>
            ) : (
              <button onClick={stopCamera}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all">
                <Square className="w-4 h-4" /> 연결 종료
              </button>
            )}
          </div>
        </div>

        {/* KPI 미니 카드 */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "총 검사", value: totalCount, icon: Activity, color: "violet", gradient: "from-violet-600 to-indigo-600" },
            { label: "양품 (OK)", value: okCount, icon: CheckCircle, color: "emerald", gradient: "from-emerald-500 to-teal-600" },
            { label: "불량 (NG)", value: ngCount, icon: AlertTriangle, color: "rose", gradient: "from-rose-500 to-red-600" },
            { label: "수율", value: yieldRate + "%", icon: Shield, color: "cyan", gradient: "from-cyan-500 to-blue-600" },
          ].map((kpi, i) => (
            <div key={kpi.label} className={`card-animate`} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="glass rounded-xl p-3 hover:border-white/15 transition-all group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity`} />
                <div className="relative flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-md`}>
                    <kpi.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-medium">{kpi.label}</p>
                    <p className="text-white text-lg font-black">{typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 메인: 카메라 + 최근 판정 */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 실시간 카메라 */}
          <div className="lg:col-span-2 glass rounded-xl overflow-hidden card-animate-2">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-violet-400" />
                <span className="text-white text-sm font-semibold">실시간 영상 분석</span>
                {isLive && <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse ml-1" />}
                {isLive && <span className="text-[10px] text-red-400 font-medium">LIVE</span>}
              </div>
              {isLive && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-medium">AI PROCESSING</span>
                </div>
              )}
            </div>
            <div className="bg-black relative aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-contain ${!isLive ? 'hidden' : ''}`} />
              <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />
              {!isLive && (
                <div className="text-slate-600 flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                    <Camera className="w-10 h-10 opacity-30" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-sm font-medium">카메라가 꺼져 있습니다</p>
                    <p className="text-slate-600 text-xs mt-1">상단의 '카메라 연결' 버튼을 눌러주세요</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 최근 판정 결과 */}
          <div className="glass rounded-xl overflow-hidden card-animate-3">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm font-semibold">최근 판정 결과</span>
            </div>
            <div className="divide-y divide-white/5 overflow-auto max-h-[400px]">
              {logs?.slice(0, 8).map((log) => (
                <div key={log.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-10 rounded-full ${log.result === 'OK' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div>
                      <span className={`font-bold text-sm ${log.result === 'OK' ? 'text-emerald-400' : 'text-rose-400'}`}>{log.result}</span>
                      <p className="text-[10px] text-slate-500">{new Date(log.time).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-slate-300">{log.barcode}</p>
                    {log.defectType
                      ? <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-semibold">{log.defectType}</span>
                      : <span className="text-[10px] text-emerald-400 font-medium">정상</span>
                    }
                  </div>
                </div>
              ))}
              {!logs?.length && (
                <div className="p-8 text-center text-slate-600 text-sm">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  데이터가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 전체 로그 테이블 */}
        <div className="relative glass rounded-xl overflow-hidden card-animate-4">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-white text-sm font-semibold">검사 이력 로그 (History)</span>
            <span className="text-[10px] text-slate-500 ml-2">{logs?.length ?? 0}건</span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-800/90 border-b border-white/5">
                <tr>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium w-[160px]">검사 시간</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">캡처</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">바코드/QR</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">품목명</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">판정</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">결함 유형</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">AI 신뢰도</th>
                  <th className="text-right px-4 py-2.5 text-slate-400 font-medium">상세</th>
                </tr>
              </thead>
              <tbody>
                {logs?.map((log) => (
                  <tr key={log.id} className={`border-b border-white/5 transition-colors hover:bg-white/5 ${log.result === 'NG' ? 'bg-rose-500/5' : ''}`}>
                    <td className="px-4 py-2.5 text-slate-300">{new Date(log.time).toLocaleString()}</td>
                    <td className="px-4 py-2.5">
                      <div
                        className="w-14 h-9 bg-slate-800 rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all border border-white/10"
                        onClick={() => setSelectedImage(log.image)}
                      >
                        <img src={log.image} alt="thumb" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">{log.barcode}</td>
                    <td className="px-4 py-2.5 text-slate-300">{log.itemName}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.result === 'OK'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {log.defectType
                        ? <span className="text-rose-400 font-semibold">{log.defectType}</span>
                        : <span className="text-slate-600">-</span>
                      }
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all" style={{ width: `${log.confidence}%` }} />
                        </div>
                        <span className="text-slate-300 text-[10px] font-medium">{log.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => setSelectedImage(log.image)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-violet-400 transition-colors">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!logs?.length && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-600 text-sm">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      검사 이력이 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 이미지 미리보기 */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedImage(null)} />
            <div className="relative w-full max-w-4xl mx-4 rounded-xl overflow-hidden border border-white/10 bg-slate-900/95 shadow-2xl">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-violet-400" />
                  <span className="text-white text-sm font-semibold">검사 이미지 상세 보기</span>
                </div>
                <button onClick={() => setSelectedImage(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center p-4">
                <img src={selectedImage} alt="Detail" className="max-w-full max-h-full object-contain rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </div>
    </SmartFactoryWrapper>
  );
}
