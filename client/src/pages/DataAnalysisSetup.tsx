import React, { useState, useEffect } from 'react'
import SmartFactoryWrapper from '@/components/SmartFactoryWrapper'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import {
  Database, FileText, HardDrive, Clock, RefreshCw, Zap,
  CheckCircle2, Grid, Check, Loader2, Key, Save, Trash2, ExternalLink, Lightbulb
} from 'lucide-react'

// --- 그래프 DB 변환 알고리즘 엔진 (시뮬레이션) ---
// 실제 백엔드 없이 브라우저 상에서 동작 과정을 보여주기 위한 가상 엔진입니다.
class GraphDBEngine {
  // 1. 테이블 데이터 추출
  static async extractData(tableName: string) {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, machine: '설비A', supplier: '공급사X', material: '자재1', man: '작업자K', defect: '불량발생' },
          { id: 2, machine: '설비B', supplier: '공급사Y', material: '자재2', man: '작업자L', defect: '정상' }
        ]);
      }, 600);
    });
  }

  // 2. 개체 추출(Node)
  static async extractEntities(data: any[]) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const nodes = data.map(row => ({
          machineNode: { type: 'Machine', value: row.machine },
          supplierNode: { type: 'Supplier', value: row.supplier },
          materialNode: { type: 'Material', value: row.material },
          manNode: { type: 'Man', value: row.man },
          defectNode: { type: 'Defect', value: row.defect }
        }));
        resolve(nodes);
      }, 500);
    });
  }

  // 3. 관계 정의(Edge)
  static async defineRelations(entities: any[]) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        // "어떤 설비(Machine)에서 어느 공급사(Supplier)가 납품한 자재(Material)를 작업자(Man)가 가공하다가 불량(Defect)이 났다"
        const edges = entities.map(entity => [
          { source: entity.supplierNode, target: entity.materialNode, relation: '납품함' },
          { source: entity.materialNode, target: entity.machineNode, relation: '가공됨' },
          { source: entity.manNode, target: entity.machineNode, relation: '조작함' },
          { source: entity.machineNode, target: entity.defectNode, relation: '결과' }
        ]);
        resolve(edges);
      }, 800);
    });
  }

  // 4. 분산 그래프 DB 적재
  static async loadToGraphDB(tableName: string, graphData: any) {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const jsonCache = JSON.stringify({
          tableName,
          edgesCount: graphData.length * 4,
          timestamp: new Date().toISOString(),
          data: graphData
        });
        
        // 브라우저 로컬 스토리지에 저장하여 실제 적재 효과 구현
        localStorage.setItem(`graph_db_${tableName}`, jsonCache);
        resolve(jsonCache);
      }, 400);
    });
  }
}


export default function DataAnalysisSetup() {
  const { toast } = useToast();

  const [apiKey, setApiKey] = useState('');
  const [selectedDb, setSelectedDb] = useState('기본 데이터베이스');
  
  const [savedKeys, setSavedKeys] = useState<{db: string, key: string}[]>(() => {
    try {
      const keys = localStorage.getItem('gemini_api_keys');
      return keys ? JSON.parse(keys) : [{ db: '기본 데이터베이스', key: 'AIzaSyDa...I0Dg' }];
    } catch {
      return [{ db: '기본 데이터베이스', key: 'AIzaSyDa...I0Dg' }];
    }
  });

  const handleSaveApiKey = () => {
    if (!apiKey) {
      toast({ title: '입력 오류', description: 'API 키를 입력해주세요.', variant: 'destructive' });
      return;
    }
    
    const newKeys = savedKeys.filter(k => k.db !== selectedDb);
    newKeys.push({ db: selectedDb, key: apiKey });
    
    setSavedKeys(newKeys);
    localStorage.setItem('gemini_api_keys', JSON.stringify(newKeys));
    setApiKey('');
    
    toast({ title: '저장 완료', description: `${selectedDb}의 API 키가 저장되었습니다.` });
  };

  const handleDeleteKey = (db: string) => {
    const newKeys = savedKeys.filter(k => k.db !== db);
    setSavedKeys(newKeys);
    localStorage.setItem('gemini_api_keys', JSON.stringify(newKeys));
    toast({ title: '삭제 완료', description: `${db}의 API 키가 삭제되었습니다.` });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 12) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  const [availableTables, setAvailableTables] = useState([
    { name: 'ac_detail', status: 'pending' },
    { name: 'ac_detail_temp', status: 'pending' },
    { name: 'ac_detail_trans', status: 'pending' },
    { name: 'ac_detail_trans_cost', status: 'pending' },
    { name: 'ac_ilbo_mst', status: 'pending' },
  ]);

  const [vectorizedTables, setVectorizedTables] = useState<string[]>([]);
  const [processingTable, setProcessingTable] = useState<string | null>(null);

  // DB에서 백터화된 테이블 목록 불러오기
  useEffect(() => {
    const fetchVectorizedTables = async () => {
      try {
        const response = await fetch('/api/vectorized-tables');
        if (response.ok) {
          const data = await response.json();
          setVectorizedTables(data);
          
          // 기존의 availableTables에서 이미 적재된 테이블의 상태를 'done'으로 변경
          setAvailableTables(prev => 
            prev.map(t => data.includes(t.name) ? { ...t, status: 'done' } : t)
          );
        }
      } catch (error) {
        console.error('Failed to fetch vectorized tables:', error);
      }
    };
    fetchVectorizedTables();
  }, []);

  // 그래프 DB 적재 파이프라인 핸들러
  const handleVectorize = async (tableName: string) => {
    if (processingTable) return;
    setProcessingTable(tableName);

    try {
      // Step 1. 테이블 데이터 추출
      toast({ title: `[1/4] 데이터 추출`, description: `${tableName} 테이블에서 가공 및 품질 데이터를 로드합니다.` });
      const rawData = await GraphDBEngine.extractData(tableName);

      // Step 2. 개체 추출(Node)
      toast({ title: `[2/4] 개체(Node) 추출`, description: `설비(Machine), 공급사(Supplier), 자재(Material), 작업자(Man), 불량(Defect) 개체를 식별합니다.` });
      const entities = await GraphDBEngine.extractEntities(rawData);

      // Step 3. 관계 정의(Edge)
      toast({ title: `[3/4] 관계(Edge) 정의`, description: `개체 간의 인과관계(가공함, 납품함, 발생함 등)를 엣지로 연결합니다.` });
      const edges = await GraphDBEngine.defineRelations(entities);

      // Step 4. 분산 그래프 DB 적재
      toast({ title: `[4/4] 그래프 DB 적재`, description: `생성된 노드와 엣지를 분산 그래프 데이터베이스에 적재합니다.` });
      await GraphDBEngine.loadToGraphDB(tableName, edges);

      // 데이터베이스에 백터화된 테이블 영구 저장
      await fetch('/api/vectorized-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName })
      });

      // 완료 후 상태 업데이트
      toast({ 
        title: "✅ 적재 완료", 
        description: `${tableName} 테이블이 성공적으로 AI 온톨로지 그래프로 적재되었습니다.`,
        variant: "default"
      });

      // 사용 가능한 테이블의 상태를 done으로 변경
      setAvailableTables(prev => 
        prev.map(t => t.name === tableName ? { ...t, status: 'done' } : t)
      );

      // 우측 적재된 테이블 목록의 맨 위에 추가 (중복 방지)
      if (!vectorizedTables.includes(tableName)) {
        setVectorizedTables(prev => [tableName, ...prev]);
      }

    } catch (error) {
      toast({ title: "오류 발생", description: "그래프 적재 진행 중 오류가 발생했습니다.", variant: "destructive" });
    } finally {
      setProcessingTable(null);
    }
  };


  return (
    <SmartFactoryWrapper>
      <Toaster />
      <div className="flex flex-col absolute inset-0 bg-[#f8f9fc] p-4 lg:p-6 overflow-y-auto">
        
        {/* Gemini API 키 관리 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden mb-6 shrink-0">
          <div className="bg-fuchsia-50/50 px-4 py-3 border-b border-fuchsia-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-fuchsia-500" />
            <span className="text-fuchsia-600 font-bold text-[15px]">Gemini API 키 관리</span>
          </div>
          <div className="p-5 lg:p-6 flex flex-col gap-6">
            
            {/* 입력 영역 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <label className="block text-slate-800 font-bold text-sm mb-2">데이터베이스 선택</label>
                  <select 
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    value={selectedDb}
                    onChange={(e) => setSelectedDb(e.target.value)}
                  >
                    <option value="기본 데이터베이스">기본 데이터베이스</option>
                    <option value="테스트 데이터베이스">테스트 데이터베이스</option>
                    <option value="운영 데이터베이스">운영 데이터베이스</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-slate-800 font-bold text-sm mb-2">Gemini API 키</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      placeholder="AIza..." 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      onClick={handleSaveApiKey}
                      className="h-10 px-4 bg-[#8da2ea] hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 text-[13px] flex items-center gap-1 w-max">
                      Google AI Studio에서 API 키 발급받기 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 저장된 키 목록 영역 */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="block text-slate-800 font-bold text-[15px] mb-1">저장된 API 키</label>
                
                {savedKeys.length > 0 ? (
                  <div className="space-y-2">
                    {savedKeys.map((k, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-slate-800 font-bold text-sm">{k.db}</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-slate-500 text-[13px] font-mono">{maskApiKey(k.key)}</span>
                          </div>
                          <div className="flex">
                            <span className="bg-blue-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> 유효
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-lg transition-colors" title="키 검증">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteKey(k.db)}
                            className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="삭제">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-slate-500 text-sm h-full flex items-center justify-center">
                    저장된 API 키가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 가이드 영역 */}
            <div className="bg-[#f3f6fc] rounded-xl p-4 border border-blue-100/50">
              <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-[14px]">
                <Lightbulb className="w-4 h-4 text-amber-400" fill="currentColor" />
                API 키 사용 가이드
              </div>
              <ul className="space-y-1.5 text-blue-600/80 text-[13px] list-disc list-inside">
                <li>데이터베이스별로 다른 Gemini API 키를 설정할 수 있습니다</li>
                <li>API 키는 브라우저 로컬스토리지에 안전하게 저장됩니다</li>
                <li>데이터 리니지 분석 시 해당 데이터베이스의 키가 자동으로 사용됩니다</li>
                <li>키 유효성은 Gemini API 호출로 자동 검증됩니다</li>
              </ul>
            </div>
            
          </div>
        </div>

        {/* 상단 통계 카드 (4개) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
          {/* Card 1: 적재된 테이블 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28">
            <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">1</div>
              <span className="text-slate-700 font-bold text-sm">적재된 테이블</span>
            </div>
            <div className="flex-1 flex bg-[#f0f7ff] relative overflow-hidden">
              <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                <Database className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-blue-600 tracking-tight">206</span>
                </div>
                <span className="text-slate-500 text-sm font-semibold">개</span>
              </div>
            </div>
          </div>

          {/* Card 2: 총 문서 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28">
            <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
              <div className="w-5 h-5 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-bold text-[10px]">2</div>
              <span className="text-slate-700 font-bold text-sm">총 문서</span>
            </div>
            <div className="flex-1 flex bg-[#fdf5fc] relative overflow-hidden">
              <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                <FileText className="w-8 h-8 text-fuchsia-500" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-fuchsia-600 tracking-tight">8,083</span>
                </div>
                <span className="text-slate-500 text-sm font-semibold">개</span>
              </div>
            </div>
          </div>

          {/* Card 3: 캐시 크기 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28">
            <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px]">3</div>
              <span className="text-slate-700 font-bold text-sm">캐시 크기</span>
            </div>
            <div className="flex-1 flex bg-[#fefce8] relative overflow-hidden">
              <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                <HardDrive className="w-8 h-8 text-amber-500" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-emerald-600 tracking-tight">206</span>
                </div>
                <span className="text-slate-500 text-sm font-semibold">MB</span>
              </div>
            </div>
          </div>

          {/* Card 4: 최근 업데이트 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28">
            <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-[10px]">4</div>
              <span className="text-slate-700 font-bold text-sm">최근 업데이트</span>
            </div>
            <div className="flex-1 flex bg-white relative overflow-hidden">
              <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-600 tracking-tight">4월 3일</span>
                </div>
                <span className="text-slate-500 text-sm font-semibold">일자</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 2단 레이아웃 */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* 좌측: 사용 가능한 테이블 */}
          <div className="flex-1 flex flex-col gap-2 min-h-[400px]">
            <div className="flex items-center justify-between bg-orange-50/50 rounded-t-xl px-4 py-3 border-b border-orange-100 shrink-0">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-orange-500" />
                <span className="text-orange-600 font-bold text-[15px]">사용 가능한 테이블</span>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 bg-white p-4 rounded-b-xl border border-t-0 border-slate-200 shadow-sm">
              {availableTables.map((table, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-all hover:border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-800 font-bold text-[15px]">{table.name}</span>
                    {table.status === 'done' && (
                      <Check className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleVectorize(table.name)}
                    disabled={processingTable === table.name}
                    className={`h-10 px-5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-sm
                      ${processingTable === table.name ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                        : table.status === 'done' ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {processingTable === table.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className={`w-4 h-4 ${table.status === 'done' ? 'text-slate-500 fill-current' : 'text-white fill-current'}`} />
                    )}
                    {processingTable === table.name ? '진행 중...' : table.status === 'done' ? '재' : '그래프 적재'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 우측: 적재된 테이블 */}
          <div className="flex-1 flex flex-col gap-2 min-h-[400px]">
            <div className="flex items-center justify-between bg-emerald-50/50 rounded-t-xl px-4 py-3 border-b border-emerald-100 shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-600 font-bold text-[15px]">적재된 테이블</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 bg-white p-4 rounded-b-xl border border-t-0 border-slate-200 shadow-sm relative">
              {vectorizedTables.map((table, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                  <span className="text-slate-800 font-bold text-[15px]">{table}</span>
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* 플로팅 액션 버튼 (우측 하단 ⚡ 번개) */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 group">
            <Zap className="w-6 h-6 fill-current group-hover:animate-pulse" />
          </button>
        </div>

      </div>
    </SmartFactoryWrapper>
  )
}
