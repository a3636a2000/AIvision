import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ClipboardCheck, Search, Plus, Trash2, Camera, X,
  Save, RotateCcw, Printer, QrCode, ScanLine, Package,
  Factory, Layers, Zap
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import SmartFactoryWrapper from "@/components/SmartFactoryWrapper";

interface ProcessItem {
  prcCd: string;
  prcName: string;
  prcKind: string;
  areaId: string;
}

interface WorkResult {
  prcOdCd: string;
  prcCd: string;
  prcName: string;
  prcActDt: string;
  mainEmpId: string;
  isEnd: string;
  inSt: number;
  hogi: string;
  lotNo: string;
  scmTagIn: string;
}

interface WorkResultDetail {
  seqNo: number;
  itemCd: string;
  itemName: string;
  std: string;
  prcRealQty: number;
  badQty: number;
  bigo: string;
  prcCd: string;
}

const mockProcessList: ProcessItem[] = [
  { prcCd: 'PRC001', prcName: '조립(포장, 방청, 도장)', prcKind: '1', areaId: 'A001' },
  { prcCd: 'PRC002', prcName: '단조[12]', prcKind: '2', areaId: 'A001' },
  { prcCd: 'PRC003', prcName: 'Q/T 열처리[…]', prcKind: '2', areaId: 'A001' },
  { prcCd: 'PRC004', prcName: 'LINK 고주파', prcKind: '2', areaId: 'A001' },
  { prcCd: 'PRC005', prcName: 'BUSHING 내…', prcKind: '2', areaId: 'A001' },
  { prcCd: 'PRC006', prcName: 'SPRAY Q/T…', prcKind: '2', areaId: 'A001' },
];

const mockItems = [
  { itemCd: '25002C001', itemName: '배선조립체', std: '-', warehouseName: '공정창고', safeQty: '-', price: '-', vendor: '-' },
  { itemCd: 'P-GO-D4HKXX-O-111', itemName: 'D4H LOOSE LINK & PIN&BUSH…', std: 'KBJ(LUB)', warehouseName: '완제품창고', safeQty: '222', price: '2,222', vendor: '능협' },
  { itemCd: 'P-GO-D4HKXX-O-361', itemName: 'D4H LOOSE LINK & PIN&BUSH…', std: 'KBJ(LUB)', warehouseName: '완제품창고', safeQty: '-', price: '0', vendor: 'nara tech' },
  { itemCd: 'P-G235-SB2', itemName: '가드레일G235-SB2', std: 'W4000×H725mm', warehouseName: '완제품창고', safeQty: '500', price: '-', vendor: '-' },
  { itemCd: 'W-BL-D4HKXX-O-100', itemName: '[D4H] T/BUSH [LUB] : 소재절단', std: 'SCR440(Φ58×116)', warehouseName: '공정창고', safeQty: '87', price: '-', vendor: '-' },
  { itemCd: 'W-BL-D4HKXX-O-200', itemName: '[D4H] T/BUSH [LUB] : Through…', std: 'SCR440(Φ58×116)', warehouseName: '공정창고', safeQty: '-', price: '-', vendor: '-' },
  { itemCd: 'W-BL-D4HKXX-O-400', itemName: '[D4H] T/BUSH [LUB] : 1차가공', std: 'SCR440(Φ58×116)', warehouseName: '공정창고', safeQty: '377', price: '-', vendor: '-' },
];

const mockWorkOrders = [
  { prcOdCd: 'WO-20260314-01', prcCd: 'PRC001', prcName: '조립(포장, 방청, 도장)', itemCd: 'PART-001', itemName: '엔진 피스톤 A', planQty: 1000 },
  { prcOdCd: 'WO-20260314-02', prcCd: 'PRC002', prcName: '단조[12]', itemCd: 'PART-002', itemName: '브레이크 패드', planQty: 500 },
  { prcOdCd: 'WO-20260313-01', prcCd: 'PRC003', prcName: 'Q/T 열처리', itemCd: 'PART-003', itemName: '전조등 하우징', planQty: 300 },
];

const initialFormData: Partial<WorkResult> = {
  prcOdCd: '', prcCd: '', prcName: '',
  prcActDt: new Date().toISOString().split('T')[0].replace(/-/g, ''),
  mainEmpId: '', isEnd: '2', inSt: 0,
  hogi: '', lotNo: '', scmTagIn: 'N',
};

const emptyDetail = (): WorkResultDetail => ({
  seqNo: Date.now(),
  itemCd: '', itemName: '', std: '',
  prcRealQty: 0, badQty: 0, bigo: '', prcCd: '',
});

/* ─── 검색 모달 (다크 글래스 테마) ─── */
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  data: any[];
  onSelect: (item: any) => void;
  columns: { key: string; label: string; isCode?: boolean }[];
  searchPlaceholder?: string;
  rightButton?: React.ReactNode;
}

function SearchModal({ isOpen, onClose, title, icon, data, onSelect, columns, searchPlaceholder, rightButton }: SearchModalProps) {
  const [search, setSearch] = useState('');
  const [focusedIdx, setFocusedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) { setSearch(''); setFocusedIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [isOpen]);

  const filtered = data.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => { setFocusedIdx(0); }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[focusedIdx]) { onSelect(filtered[focusedIdx]); onClose(); }
    if (e.key === 'Escape') { onClose(); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl" onKeyDown={handleKeyDown}>
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            {icon || <Package className="w-5 h-5" />}
            <span className="font-bold text-lg">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {rightButton}
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-white/5 bg-slate-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder || "품목코드 또는 품목명 검색..."}
              className="w-full pl-9 pr-4 py-2 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-800 text-white placeholder-slate-500"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 ml-1">총 {filtered.length}건</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-800/90 border-b border-white/5">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-white/5 cursor-pointer transition-colors ${focusedIdx === idx ? 'bg-violet-500/20' : 'hover:bg-white/5'}`}
                  onMouseEnter={() => setFocusedIdx(idx)}
                  onClick={() => { onSelect(item); onClose(); }}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-2.5">
                      {col.isCode
                        ? <span className="text-violet-400 font-semibold text-xs">{item[col.key]}</span>
                        : <span className="text-slate-300">{item[col.key]}</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={columns.length} className="text-center py-12 text-slate-500 text-sm">검색 결과가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-800/50 border-t border-white/5 flex gap-4 text-xs text-slate-500">
          <span>↑↓ 이동</span><span>Enter 선택</span><span>ESC 닫기</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 바코드/QR 스캔 모달 (다크 테마) ─── */
interface BarcodeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
  title: string;
}

function BarcodeScanModal({ isOpen, onClose, onScan, title }: BarcodeScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState('');

  useEffect(() => {
    if (!isOpen) { readerRef.current?.reset(); readerRef.current = null; setScanning(false); setLastScanned(''); setManualInput(''); }
  }, [isOpen]);

  const startScan = async () => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    setScanning(true);
    try {
      await reader.decodeFromVideoDevice(null, videoRef.current!, (result) => {
        if (result) { const text = result.getText(); setLastScanned(text); onScan(text); }
      });
    } catch (err) { console.error(err); }
  };

  const stopScan = () => { readerRef.current?.reset(); readerRef.current = null; setScanning(false); };

  const handleManualSubmit = () => { if (manualInput.trim()) { onScan(manualInput.trim()); setManualInput(''); } };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <QrCode className="w-5 h-5" />
            <span className="font-bold text-lg">{title}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-black relative aspect-video flex items-center justify-center">
          <video ref={videoRef} className={`w-full h-full object-cover ${!scanning ? 'hidden' : ''}`} />
          {!scanning && (
            <div className="text-slate-500 flex flex-col items-center gap-3">
              <ScanLine className="w-12 h-12 opacity-30" />
              <p className="text-sm">카메라를 시작하여 바코드/QR을 스캔하세요</p>
            </div>
          )}
          {scanning && (
            <>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-32 border-2 border-cyan-400 rounded-lg relative">
                  <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400 animate-scan" />
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> SCANNING
              </div>
            </>
          )}
        </div>
        {lastScanned && (
          <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
            <span className="text-emerald-400 text-xs font-semibold">스캔됨:</span>
            <span className="font-mono text-sm text-emerald-300">{lastScanned}</span>
          </div>
        )}
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            {!scanning
              ? <Button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white" onClick={startScan}><Camera className="w-4 h-4 mr-2" /> 카메라 스캔 시작</Button>
              : <Button className="flex-1 bg-rose-600 hover:bg-rose-500 text-white" onClick={stopScan}><X className="w-4 h-4 mr-2" /> 스캔 중지</Button>
            }
          </div>
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-3 text-xs text-slate-500">또는 직접 입력</span>
            <div className="flex-1 border-t border-white/10" />
          </div>
          <div className="flex gap-2">
            <input
              placeholder="작업지시번호 또는 바코드 입력..."
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
              className="flex-1 h-9 px-3 text-sm bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Button variant="outline" onClick={handleManualSubmit} className="border-white/10 text-slate-300 hover:bg-white/10">확인</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 메인 컴포넌트 ─── */
export default function WorkResultPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<Partial<WorkResult>>(initialFormData);
  const [details, setDetails] = useState<WorkResultDetail[]>([]);
  const [selectedProcessIdx, setSelectedProcessIdx] = useState<number | null>(null);
  const [selectedDetailIdx, setSelectedDetailIdx] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemModalTargetSeq, setItemModalTargetSeq] = useState<number | null>(null);
  const [workOrderScanOpen, setWorkOrderScanOpen] = useState(false);
  const [itemScanOpen, setItemScanOpen] = useState(false);
  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false);

  const { data: workResultList = [], refetch: refetchList } = useQuery<any[]>({
    queryKey: ["/api/work-result"],
    queryFn: async () => { const res = await fetch(`/api/work-result`); if (!res.ok) throw new Error("조회 실패"); return res.json(); },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const isEdit = editingId !== null;
      const url = isEdit ? `/api/work-result/${editingId}` : "/api/work-result";
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "저장 실패"); }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "저장 완료", description: `작업실적이 DB에 저장되었습니다. (ID: ${data.id || data.data?.id})` });
      queryClient.invalidateQueries({ queryKey: ["/api/work-result"] });
      if (!editingId) setEditingId(data.id || data.data?.id);
    },
    onError: (err: Error) => { toast({ variant: "destructive", title: "저장 실패", description: err.message }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => { const res = await fetch(`/api/work-result/${id}`, { method: "DELETE" }); if (!res.ok) throw new Error("삭제 실패"); return res.json(); },
    onSuccess: () => { toast({ title: "삭제 완료" }); queryClient.invalidateQueries({ queryKey: ["/api/work-result"] }); handleNew(); },
    onError: (err: Error) => { toast({ variant: "destructive", title: "삭제 실패", description: err.message }); },
  });

  const handleWorkOrderScan = useCallback((value: string) => {
    const matched = mockWorkOrders.find(wo => wo.prcOdCd === value || wo.itemCd === value);
    if (matched) {
      setFormData(prev => ({ ...prev, prcOdCd: matched.prcOdCd, prcCd: matched.prcCd, prcName: matched.prcName }));
      const procIdx = mockProcessList.findIndex(p => p.prcCd === matched.prcCd);
      if (procIdx >= 0) setSelectedProcessIdx(procIdx);
      toast({ title: "작업지시 스캔 완료", description: `${matched.prcOdCd} - ${matched.prcName}` });
    } else {
      setFormData(prev => ({ ...prev, prcOdCd: value }));
      toast({ title: "작업지시번호 입력됨", description: value });
    }
    setWorkOrderScanOpen(false);
  }, [toast]);

  const handleItemScan = useCallback((value: string) => {
    const matched = mockItems.find(i => i.itemCd === value);
    const item = matched || { itemCd: value, itemName: '스캔품목', std: '-' };
    setDetails(prev => {
      const emptyIdx = prev.findIndex(d => !d.itemCd);
      const newDetail = { ...emptyDetail(), itemCd: item.itemCd, itemName: item.itemName, std: item.std, prcCd: formData.prcCd || '' };
      if (emptyIdx >= 0) return prev.map((d, idx) => idx === emptyIdx ? newDetail : d);
      return [...prev, newDetail];
    });
    toast({ title: "품목 스캔됨", description: `${item.itemCd} - ${item.itemName}` });
  }, [formData.prcCd, toast]);

  const handleSelectProcess = (idx: number) => {
    setSelectedProcessIdx(idx);
    const proc = mockProcessList[idx];
    setFormData(prev => ({ ...prev, prcCd: proc.prcCd, prcName: proc.prcName }));
  };

  const handleNew = () => {
    setFormData({ ...initialFormData, prcActDt: new Date().toISOString().split('T')[0].replace(/-/g, '') });
    setDetails([]); setSelectedDetailIdx(null); setSelectedProcessIdx(null); setEditingId(null);
    toast({ title: "신규 작성", description: "새로운 작업실적을 입력합니다." });
  };

  const handleSave = () => {
    if (!formData.prcCd) { toast({ variant: "destructive", title: "오류", description: "공정을 먼저 선택해주세요." }); return; }
    if (details.length === 0) { toast({ variant: "destructive", title: "오류", description: "상세내역(품목)을 1개 이상 추가해주세요." }); return; }
    const workDate = formData.prcActDt ? `${formData.prcActDt.slice(0,4)}-${formData.prcActDt.slice(4,6)}-${formData.prcActDt.slice(6,8)}` : new Date().toISOString().split('T')[0];
    saveMutation.mutate({ workOrderNo: formData.prcOdCd || '', prcCd: formData.prcCd || '', prcName: formData.prcName || '', workDate, empId: formData.mainEmpId || '', details });
  };

  const handleDelete = () => {
    if (!editingId) { toast({ variant: "destructive", title: "오류", description: "삭제할 데이터를 먼저 선택해주세요." }); return; }
    if (confirm("선택한 작업실적을 삭제하시겠습니까?")) deleteMutation.mutate(editingId);
  };

  const handleSelectRecord = (record: any) => {
    setEditingId(record.id);
    const d = record.workDate || '';
    setFormData({ prcOdCd: record.workOrderNo || '', prcCd: record.prcCd || '', prcName: record.prcName || '', prcActDt: d.replace(/-/g, ''), mainEmpId: record.empId || '', isEnd: '2', inSt: 0, hogi: '', lotNo: '', scmTagIn: 'N' });
    setDetails(Array.isArray(record.details) ? record.details : []);
    const procIdx = mockProcessList.findIndex(p => p.prcCd === record.prcCd);
    setSelectedProcessIdx(procIdx >= 0 ? procIdx : null);
  };

  const addDetailRow = () => {
    if (!formData.prcCd) { toast({ variant: "destructive", title: "오류", description: "공정을 먼저 선택해주세요." }); return; }
    setDetails(prev => [...prev, { ...emptyDetail(), prcCd: formData.prcCd || '' }]);
  };

  const removeDetailRow = () => {
    if (selectedDetailIdx === null) return;
    setDetails(prev => prev.filter((_, i) => i !== selectedDetailIdx));
    setSelectedDetailIdx(null);
  };

  const handleDetailChange = (idx: number, field: keyof WorkResultDetail, value: any) => {
    setDetails(prev => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const handleItemSelect = (item: any) => {
    if (itemModalTargetSeq === null) return;
    setDetails(prev => prev.map((d, idx) => idx === itemModalTargetSeq ? { ...d, itemCd: item.itemCd, itemName: item.itemName, std: item.std } : d));
  };

  const handleWorkOrderSelect = (wo: any) => {
    setFormData(prev => ({ ...prev, prcOdCd: wo.prcOdCd, prcCd: wo.prcCd, prcName: wo.prcName }));
    const procIdx = mockProcessList.findIndex(p => p.prcCd === wo.prcCd);
    if (procIdx >= 0) setSelectedProcessIdx(procIdx);
    toast({ title: "작업지시 선택됨", description: wo.prcOdCd });
  };

  const inputCls = "h-7 px-2 text-xs bg-slate-800/80 border border-white/10 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500";

  return (
    <SmartFactoryWrapper>
      <Toaster />
      <SearchModal isOpen={itemModalOpen} onClose={() => setItemModalOpen(false)} title="품목 조회" icon={<Package className="w-5 h-5" />} data={mockItems} onSelect={handleItemSelect}
        columns={[{ key: 'itemCd', label: '품목코드', isCode: true }, { key: 'itemName', label: '품목명' }, { key: 'std', label: '규격' }, { key: 'warehouseName', label: '창고명' }, { key: 'safeQty', label: '적정재고' }, { key: 'price', label: '표준원가' }, { key: 'vendor', label: '거래처명' }]}
        searchPlaceholder="품목코드 또는 품목명 검색..."
        rightButton={
          <button className="bg-violet-400/20 hover:bg-violet-400/30 text-violet-300 text-xs px-3 py-1 rounded-md flex items-center gap-1 transition-colors border border-violet-400/20"
            onClick={() => { setItemModalOpen(false); setItemScanOpen(true); }}>
            <Camera className="w-3 h-3" /> MES
          </button>
        }
      />
      <SearchModal isOpen={workOrderModalOpen} onClose={() => setWorkOrderModalOpen(false)} title="작업지시 조회" icon={<ClipboardCheck className="w-5 h-5" />} data={mockWorkOrders} onSelect={handleWorkOrderSelect}
        columns={[{ key: 'prcOdCd', label: '작업지시번호', isCode: true }, { key: 'prcName', label: '공정명' }, { key: 'itemCd', label: '품목코드', isCode: true }, { key: 'itemName', label: '품목명' }, { key: 'planQty', label: '지시수량' }]}
        searchPlaceholder="작업지시번호 또는 품목명 검색..."
      />
      <BarcodeScanModal isOpen={workOrderScanOpen} onClose={() => setWorkOrderScanOpen(false)} onScan={handleWorkOrderScan} title="작업지시 바코드/QR 스캔" />
      <BarcodeScanModal isOpen={itemScanOpen} onClose={() => setItemScanOpen(false)} onScan={handleItemScan} title="품목 바코드/QR 스캔" />

      <style>{`
        @keyframes scan { 0%{transform:translateY(0)} 50%{transform:translateY(7rem)} 100%{transform:translateY(0)} }
        @keyframes slide-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-glow { 0%,100%{opacity:.3} 50%{opacity:.7} }
        .animate-scan { animation: scan 2s ease-in-out infinite; }
        .card-animate { animation: slide-in .4s ease-out both; }
        .glass { backdrop-filter:blur(12px); background:rgba(15,23,42,.6); border:1px solid rgba(255,255,255,.08); }
        .glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      <div className="min-h-full flex flex-col text-sm relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 -m-4 lg:-m-5 p-4 lg:p-5">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-600/8 rounded-full blur-3xl glow" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl glow" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* 툴바 */}
        <div className="relative glass rounded-xl p-3 mb-3 card-animate flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ClipboardCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">작업실적 등록</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className={`${inputCls} w-32`} />
            <button className="h-7 px-3 text-xs rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center gap-1 transition-colors">
              <Search className="w-3 h-3" /> 조회
            </button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleNew} className="h-7 px-3 text-xs rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" /> 신규
            </button>
            <button onClick={handleSave} disabled={saveMutation.isPending}
              className="h-7 px-3 text-xs rounded-md bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/30 flex items-center gap-1 transition-colors disabled:opacity-50">
              <Save className="w-3 h-3" /> {saveMutation.isPending ? "저장 중..." : (editingId ? "수정" : "저장")}
            </button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending || !editingId}
              className="h-7 px-3 text-xs rounded-md bg-rose-600/80 text-white hover:bg-rose-500 flex items-center gap-1 transition-colors disabled:opacity-30">
              <Trash2 className="w-3 h-3" /> 삭제
            </button>
            <button className="h-7 px-3 text-xs rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center gap-1 transition-colors">
              <Printer className="w-3 h-3" /> 인쇄
            </button>
          </div>
        </div>

        {/* 메인 레이아웃 */}
        <div className="relative flex flex-col lg:flex-row gap-3 flex-1">
          {/* 좌측 패널 */}
          <div className="w-full lg:w-[250px] flex flex-col gap-3">
            {/* 작업공정 */}
            <div className="glass rounded-xl card-animate overflow-hidden">
              <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
                <Factory className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-white">작업공정</span>
              </div>
              <div className="overflow-auto max-h-[200px]">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-800/80">
                    <tr className="border-b border-white/5">
                      <th className="w-8 text-center p-1.5 text-slate-400 font-medium">No</th>
                      <th className="p-1.5 text-left text-slate-400 font-medium">종류</th>
                      <th className="p-1.5 text-left text-slate-400 font-medium">공정명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProcessList.map((proc, idx) => (
                      <tr key={proc.prcCd}
                        className={`cursor-pointer border-b border-white/5 transition-colors ${selectedProcessIdx === idx ? 'bg-violet-500/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                        onClick={() => handleSelectProcess(idx)}>
                        <td className="text-center p-1.5">{idx + 1}</td>
                        <td className="p-1.5 text-slate-500">{idx === 0 ? '완제품' : '중간'}</td>
                        <td className="p-1.5 truncate max-w-[100px]">{proc.prcName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 저장된 실적 목록 */}
            <div className="glass rounded-xl flex-1 card-animate overflow-hidden" style={{ animationDelay: ".08s" }}>
              <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs font-semibold text-white">저장된 실적 ({workResultList.length})</span>
                </div>
                <button onClick={() => refetchList()} className="text-slate-500 hover:text-slate-300 transition-colors"><RotateCcw className="w-3 h-3" /></button>
              </div>
              <div className="overflow-auto max-h-[220px]">
                {workResultList.length === 0
                  ? <p className="text-center text-xs text-slate-600 py-6">저장된 데이터 없음</p>
                  : workResultList.map((rec) => (
                    <div key={rec.id}
                      className={`px-3 py-2 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${editingId === rec.id ? 'bg-violet-500/15 border-l-2 border-l-violet-500' : ''}`}
                      onClick={() => handleSelectRecord(rec)}>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-violet-400 truncate max-w-[130px]">{rec.workOrderNo || '(지시번호 없음)'}</span>
                        <span className="text-[10px] text-slate-600 shrink-0 ml-1">#{rec.id}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">{rec.prcName}</div>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">{rec.workDate}</span>
                        <span className="text-[10px] text-emerald-400">실적 {rec.totalQty ?? 0}</span>
                        <span className="text-[10px] text-rose-400">불량 {rec.totalBadQty ?? 0}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* MES 스캔 */}
            <div className="glass rounded-xl overflow-hidden card-animate" style={{ animationDelay: ".16s" }}>
              <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-white">MES 스캔</span>
              </div>
              <div className="p-3 space-y-2">
                <button className="w-full h-8 text-xs rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all"
                  onClick={() => setWorkOrderScanOpen(true)}>
                  <QrCode className="w-3 h-3" /> 작업지시 스캔
                </button>
                <button className="w-full h-8 text-xs rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/20 flex items-center justify-center gap-1.5 transition-all"
                  onClick={() => setItemScanOpen(true)}>
                  <ScanLine className="w-3 h-3" /> 품목 스캔
                </button>
              </div>
              <div className="aspect-video bg-black/50 flex items-center justify-center">
                <div className="text-slate-600 text-center">
                  <Camera className="w-8 h-8 mx-auto mb-1 opacity-20" />
                  <p className="text-xs opacity-50">스캔 버튼을 누르세요</p>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 패널 */}
          <div className="flex-1 flex flex-col gap-3">
            {/* 마스터 폼 */}
            <div className="glass rounded-xl p-3 card-animate" style={{ animationDelay: ".08s" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 mb-1 block font-medium">공정</label>
                  <div className="flex gap-1">
                    <input className={`${inputCls} w-16`} value={formData.prcCd || ''} readOnly placeholder="코드" />
                    <input className={`${inputCls} flex-1`} value={formData.prcName || ''} readOnly placeholder="공정명" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-rose-400 mb-1 block font-medium">작업일자</label>
                  <input type="date" className={`${inputCls} w-full`}
                    value={formData.prcActDt ? `${formData.prcActDt.slice(0,4)}-${formData.prcActDt.slice(4,6)}-${formData.prcActDt.slice(6,8)}` : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, prcActDt: e.target.value.replace(/-/g, '') }))} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 mb-1 block font-medium">작업지시번호</label>
                  <div className="flex gap-1">
                    <input className={`${inputCls} flex-1`} value={formData.prcOdCd || ''} onChange={e => setFormData(prev => ({ ...prev, prcOdCd: e.target.value }))} placeholder="직접입력 또는 스캔" />
                    <button className="h-7 w-7 rounded-md bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 border border-cyan-500/20 flex items-center justify-center transition-colors" onClick={() => setWorkOrderScanOpen(true)}><QrCode className="w-3 h-3" /></button>
                    <button className="h-7 w-7 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center justify-center transition-colors" onClick={() => setWorkOrderModalOpen(true)}><Search className="w-3 h-3" /></button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 mb-1 block font-medium">작업자1</label>
                  <div className="flex gap-1">
                    <input className={`${inputCls} flex-1`} value={formData.mainEmpId || ''} onChange={e => setFormData(prev => ({ ...prev, mainEmpId: e.target.value }))} />
                    <button className="h-7 w-7 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center justify-center transition-colors"><Search className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 그리드 */}
            <div className="glass rounded-xl flex-1 flex flex-col min-h-[280px] card-animate overflow-hidden" style={{ animationDelay: ".16s" }}>
              <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-white">상세내역</span>
                </div>
                <div className="flex gap-1.5">
                  <button className="h-6 px-2 text-[10px] rounded-md bg-violet-600/80 text-white hover:bg-violet-500 flex items-center gap-1 transition-colors" onClick={() => setItemScanOpen(true)}>
                    <ScanLine className="w-3 h-3" /> 바코드
                  </button>
                  <button className="h-6 px-2 text-[10px] rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center gap-1 transition-colors" onClick={addDetailRow}>
                    <Plus className="w-3 h-3" /> 추가
                  </button>
                  <button className="h-6 px-2 text-[10px] rounded-md bg-rose-600/60 text-rose-200 hover:bg-rose-500/60 flex items-center gap-1 transition-colors disabled:opacity-30" onClick={removeDetailRow} disabled={selectedDetailIdx === null}>
                    <Trash2 className="w-3 h-3" /> 삭제
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-800/90 border-b border-white/5">
                    <tr>
                      <th className="w-8 text-center p-1.5 text-slate-400 font-medium">No</th>
                      <th className="p-1.5 text-left text-slate-400 font-medium min-w-[130px]">품목코드</th>
                      <th className="p-1.5 text-left text-slate-400 font-medium min-w-[140px]">품목명</th>
                      <th className="p-1.5 text-left text-slate-400 font-medium min-w-[90px]">규격</th>
                      <th className="p-1.5 text-right text-slate-400 font-medium w-20">실적환산</th>
                      <th className="p-1.5 text-right text-slate-400 font-medium w-20">불량</th>
                      <th className="p-1.5 text-left text-slate-400 font-medium min-w-[90px]">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center h-28 text-slate-600 text-xs">
                          <ScanLine className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          바코드/QR 스캔 또는 추가 버튼을 눌러주세요
                        </td>
                      </tr>
                    ) : details.map((d, idx) => (
                      <tr key={d.seqNo}
                        className={`border-b border-white/5 transition-colors cursor-pointer ${selectedDetailIdx === idx ? 'bg-violet-500/15' : 'hover:bg-white/5'}`}
                        onClick={() => setSelectedDetailIdx(idx)}>
                        <td className="text-center p-1.5 text-slate-400">{idx + 1}</td>
                        <td className="p-1">
                          <div className="flex gap-1">
                            <input className={`${inputCls} min-w-[70px] flex-1`} value={d.itemCd} onChange={(e) => handleDetailChange(idx, 'itemCd', e.target.value)} />
                            <button className="h-7 w-7 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center justify-center shrink-0 transition-colors"
                              onClick={(e) => { e.stopPropagation(); setItemModalTargetSeq(idx); setItemModalOpen(true); }}><Search className="w-3 h-3" /></button>
                          </div>
                        </td>
                        <td className="p-1"><input className={`${inputCls} w-full bg-slate-800/40`} value={d.itemName} readOnly /></td>
                        <td className="p-1"><input className={`${inputCls} w-full bg-slate-800/40`} value={d.std} readOnly /></td>
                        <td className="p-1"><input type="number" className={`${inputCls} w-full text-right`} value={d.prcRealQty} onChange={(e) => handleDetailChange(idx, 'prcRealQty', Number(e.target.value))} /></td>
                        <td className="p-1"><input type="number" className={`${inputCls} w-full text-right text-rose-400`} value={d.badQty} onChange={(e) => handleDetailChange(idx, 'badQty', Number(e.target.value))} /></td>
                        <td className="p-1"><input className={`${inputCls} w-full`} value={d.bigo} onChange={(e) => handleDetailChange(idx, 'bigo', e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SmartFactoryWrapper>
  );
}
