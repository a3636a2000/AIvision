import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SmartFactoryWrapper from '../components/SmartFactoryWrapper'
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Square,
  Loader2,
  X,
  Type,
  Save,
  Undo2,
  Download,
  Check,
  ChevronUp,
  ChevronDown,
  Clipboard,
  Image as ImageIcon,
} from 'lucide-react'
import Tesseract from 'tesseract.js'
import { useAppStore } from '../store/useAppStore'

/** 사각형 선택 영역 */
interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 이미지 편집기 — 깨진 한글 텍스트 교체 (반응형)
 *
 * 데스크탑: 캔버스 좌측 + 텍스트 교체 패널 우측 (가로 배치)
 * 모바일: 캔버스 상단 + 접이식 패널 하단 (세로 배치)
 */
const ImageEditor = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── 스토어 연동 ─── //
  const editingPageNumber = useAppStore((s) => s.editingPageNumber)
  const updatePageDataUrl = useAppStore((s) => s.updatePageDataUrl)

  // ─── 편집 캔버스 (원본 해상도, 편집이 누적됨) ─── //
  const [editCanvas, setEditCanvas] = useState<HTMLCanvasElement | null>(null)
  const [editVersion, setEditVersion] = useState(0)
  const [scale, setScale] = useState(1)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // ─── 영역 선택 상태 ─── //
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selection, setSelection] = useState<SelectionRect | null>(null)

  // ─── 리사이즈 핸들 상태 ─── //
  type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | null
  const [resizeHandle, setResizeHandle] = useState<HandleType>(null)
  const [resizeOrigin, setResizeOrigin] = useState<SelectionRect | null>(null)
  const [resizeImageCanvas, setResizeImageCanvas] = useState<HTMLCanvasElement | null>(null)

  // ─── 이미지 조각 이동 상태 ─── //
  const [isMoving, setIsMoving] = useState(false)
  const [moveImageCanvas, setMoveImageCanvas] = useState<HTMLCanvasElement | null>(null)
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 })

  // ─── OCR & 텍스트 교체 상태 ─── //
  const [editedText, setEditedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [detectedFontSize, setDetectedFontSize] = useState<number | null>(null)

  // ─── 원본 텍스트 측정 결과 ─── //
  interface TextMeasure {
    textHeight: number
    textWidth: number
    textLeft: number
    textTop: number
    strokeWidth: number
    isBold: boolean
  }
  const [textMeasure, setTextMeasure] = useState<TextMeasure | null>(null)
  const [fontSizeOverride, setFontSizeOverride] = useState<number | null>(null)
  const [fontBold, setFontBold] = useState(false)
  const [textColorOverride, setTextColorOverride] = useState<string | null>(null) // null = 자동 감지

  // ─── 편집 히스토리 ─── //
  const [history, setHistory] = useState<string[]>([])

  // ─── PDF 페이지 번호 ─── //
  const [currentPageNumber, setCurrentPageNumber] = useState<number | null>(null)

  // ─── 저장 완료 피드백 ─── //
  const [showSaved, setShowSaved] = useState(false)

  // ─── 모바일 패널 열림/닫힘 상태 ─── //
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)

  // ─── 이미지 붙여넣기(덮어쓰기) 상태 ─── //
  const [pasteImage, setPasteImage] = useState<HTMLCanvasElement | null>(null)
  const [pasteRect, setPasteRect] = useState<SelectionRect | null>(null)
  const [isPasteMode, setIsPasteMode] = useState(false)
  const [isPasteDragging, setIsPasteDragging] = useState(false)
  const [pasteDragOffset, setPasteDragOffset] = useState({ x: 0, y: 0 })
  const [pasteResizeHandle, setPasteResizeHandle] = useState<HandleType>(null)
  const [pasteResizeOrigin, setPasteResizeOrigin] = useState<SelectionRect | null>(null)
  const [pasteResizeStart, setPasteResizeStart] = useState({ x: 0, y: 0 })

  /**
   * 스토어에서 편집할 이미지 로드
   */
  useEffect(() => {
    if (editingPageNumber !== null) {
      const pages = useAppStore.getState().pages
      const page = pages.find((p) => p.pageNumber === editingPageNumber)
      if (page) {
        setCurrentPageNumber(editingPageNumber)
        loadImageFromUrl(page.dataUrl)
      }
      useAppStore.getState().setEditingPageNumber(null)
    }
  }, [editingPageNumber])

  const loadImageFromUrl = (url: string) => {
    const img = new window.Image()
    img.onload = () => {
      const cvs = document.createElement('canvas')
      cvs.width = img.naturalWidth
      cvs.height = img.naturalHeight
      const ctx = cvs.getContext('2d')!
      ctx.drawImage(img, 0, 0)

      setEditCanvas(cvs)
      setEditVersion(0)
      setSelection(null)
      setEditedText('')
      setScale(1)
      setHistory([])
    }
    img.src = url
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCurrentPageNumber(null)
    loadImageFromUrl(URL.createObjectURL(file))
  }

  /**
   * 디스플레이 캔버스 렌더링
   */
  useEffect(() => {
    if (!editCanvas || !canvasRef.current || !containerRef.current) return
    if (location.pathname !== '/image-editor') return

    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    const containerWidth = container.clientWidth - 16
    const containerHeight = container.clientHeight - 16
    if (containerWidth <= 0 || containerHeight <= 0) return

    const imgAspect = editCanvas.width / editCanvas.height
    const containerAspect = containerWidth / containerHeight

    let displayWidth: number
    let displayHeight: number

    if (imgAspect > containerAspect) {
      displayWidth = Math.min(containerWidth, editCanvas.width) * scale
      displayHeight = (Math.min(containerWidth, editCanvas.width) / imgAspect) * scale
    } else {
      displayHeight = Math.min(containerHeight, editCanvas.height) * scale
      displayWidth = Math.min(containerHeight, editCanvas.height) * imgAspect * scale
    }

    canvas.width = displayWidth
    canvas.height = displayHeight
    setCanvasSize({ width: displayWidth, height: displayHeight })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(editCanvas, 0, 0, displayWidth, displayHeight)

    // 선택 영역 오버레이
    if (selection && selection.width > 0 && selection.height > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0, 0, canvas.width, selection.y)
      ctx.fillRect(0, selection.y + selection.height, canvas.width, canvas.height - selection.y - selection.height)
      ctx.fillRect(0, selection.y, selection.x, selection.height)
      ctx.fillRect(selection.x + selection.width, selection.y, canvas.width - selection.x - selection.width, selection.height)

      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)
      ctx.setLineDash([])

      if (isMoving && moveImageCanvas) {
        ctx.globalAlpha = 0.85
        ctx.drawImage(moveImageCanvas, selection.x, selection.y, selection.width, selection.height)
        ctx.globalAlpha = 1.0
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])
        ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)
        ctx.setLineDash([])
      } else if (resizeHandle && resizeImageCanvas) {
        // 리사이즈 중: 이미지 조각을 새 크기로 늘려서 미리보기
        ctx.globalAlpha = 0.85
        ctx.drawImage(resizeImageCanvas, selection.x, selection.y, selection.width, selection.height)
        ctx.globalAlpha = 1.0
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])
        ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)
        ctx.setLineDash([])
      } else {
        const hs = 8
        const mx = selection.x + selection.width / 2
        const my = selection.y + selection.height / 2
        ctx.fillStyle = '#3b82f6'
        ;[
          [selection.x, selection.y],
          [selection.x + selection.width, selection.y],
          [selection.x, selection.y + selection.height],
          [selection.x + selection.width, selection.y + selection.height],
          [mx, selection.y],
          [mx, selection.y + selection.height],
          [selection.x, my],
          [selection.x + selection.width, my],
        ].forEach(([cx, cy]) => {
          ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs)
        })
      }
    }

    // ── 이미지 붙여넣기 오버레이 ──
    if (isPasteMode && pasteImage && pasteRect) {
      ctx.globalAlpha = 0.95
      ctx.drawImage(pasteImage, pasteRect.x, pasteRect.y, pasteRect.width, pasteRect.height)
      ctx.globalAlpha = 1.0

      // 테두리
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.strokeRect(pasteRect.x, pasteRect.y, pasteRect.width, pasteRect.height)
      ctx.setLineDash([])

      // 꼭짓점 리사이즈 핸들
      const phs = 10
      ctx.fillStyle = '#22c55e'
      ;[
        [pasteRect.x, pasteRect.y],
        [pasteRect.x + pasteRect.width, pasteRect.y],
        [pasteRect.x, pasteRect.y + pasteRect.height],
        [pasteRect.x + pasteRect.width, pasteRect.y + pasteRect.height],
      ].forEach(([cx, cy]) => {
        ctx.fillRect(cx - phs / 2, cy - phs / 2, phs, phs)
      })

      // "붙여넣기 모드" 라벨
      ctx.fillStyle = 'rgba(34, 197, 94, 0.8)'
      ctx.fillRect(pasteRect.x, pasteRect.y - 24, 120, 20)
      ctx.fillStyle = '#fff'
      ctx.font = '12px sans-serif'
      ctx.textBaseline = 'top'
      ctx.fillText('📋 이미지 붙여넣기', pasteRect.x + 4, pasteRect.y - 22)
      ctx.textBaseline = 'alphabetic'
    }
  }, [editCanvas, scale, selection, location.pathname, editVersion, isMoving, moveImageCanvas, resizeHandle, resizeImageCanvas, isPasteMode, pasteImage, pasteRect])

  // ─── 마우스/터치 이벤트 ─── //

  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    let clientX: number, clientY: number
    if ('touches' in e) {
      // TouchEvent
      const touch = e.touches[0] || (e as React.TouchEvent).changedTouches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const cssX = clientX - rect.left
    const cssY = clientY - rect.top
    const ratioX = canvas.width / rect.width
    const ratioY = canvas.height / rect.height
    return { x: cssX * ratioX, y: cssY * ratioY }
  }, [])

  const detectHandle = useCallback(
    (coords: { x: number; y: number }): HandleType => {
      if (!selection || selection.width < 5 || selection.height < 5) return null
      const { x, y, width, height } = selection
      const T = 10
      const mx = x + width / 2
      const my = y + height / 2

      if (Math.abs(coords.x - x) < T && Math.abs(coords.y - y) < T) return 'nw'
      if (Math.abs(coords.x - (x + width)) < T && Math.abs(coords.y - y) < T) return 'ne'
      if (Math.abs(coords.x - x) < T && Math.abs(coords.y - (y + height)) < T) return 'sw'
      if (Math.abs(coords.x - (x + width)) < T && Math.abs(coords.y - (y + height)) < T) return 'se'

      if (Math.abs(coords.x - mx) < T && Math.abs(coords.y - y) < T) return 'n'
      if (Math.abs(coords.x - mx) < T && Math.abs(coords.y - (y + height)) < T) return 's'
      if (Math.abs(coords.x - x) < T && Math.abs(coords.y - my) < T) return 'w'
      if (Math.abs(coords.x - (x + width)) < T && Math.abs(coords.y - my) < T) return 'e'

      return null
    },
    [selection]
  )

  const getCursorForHandle = useCallback(
    (coords: { x: number; y: number }): string => {
      const h = detectHandle(coords)
      const cursors: Record<string, string> = {
        nw: 'nwse-resize', se: 'nwse-resize',
        ne: 'nesw-resize', sw: 'nesw-resize',
        n: 'ns-resize', s: 'ns-resize',
        e: 'ew-resize', w: 'ew-resize',
      }
      return h ? cursors[h] : 'crosshair'
    },
    [detectHandle]
  )

  const isInsideSelection = useCallback(
    (coords: { x: number; y: number }): boolean => {
      if (!selection || selection.width < 10 || selection.height < 10) return false
      const margin = 12
      return (
        coords.x > selection.x + margin &&
        coords.x < selection.x + selection.width - margin &&
        coords.y > selection.y + margin &&
        coords.y < selection.y + selection.height - margin
      )
    },
    [selection]
  )

  // ─── 붙여넣기 오버레이 헬퍼 ─── //
  const detectPasteHandle = useCallback(
    (coords: { x: number; y: number }): HandleType => {
      if (!pasteRect) return null
      const { x, y, width, height } = pasteRect
      const T = 12
      if (Math.abs(coords.x - x) < T && Math.abs(coords.y - y) < T) return 'nw'
      if (Math.abs(coords.x - (x + width)) < T && Math.abs(coords.y - y) < T) return 'ne'
      if (Math.abs(coords.x - x) < T && Math.abs(coords.y - (y + height)) < T) return 'sw'
      if (Math.abs(coords.x - (x + width)) < T && Math.abs(coords.y - (y + height)) < T) return 'se'
      return null
    },
    [pasteRect]
  )

  const isInsidePasteRect = useCallback(
    (coords: { x: number; y: number }): boolean => {
      if (!pasteRect) return false
      return (
        coords.x >= pasteRect.x &&
        coords.x <= pasteRect.x + pasteRect.width &&
        coords.y >= pasteRect.y &&
        coords.y <= pasteRect.y + pasteRect.height
      )
    },
    [pasteRect]
  )

  // ─── 붙여넣기 확인/취소 ─── //
  const confirmPaste = useCallback(() => {
    if (!editCanvas || !pasteImage || !pasteRect) {
      setIsPasteMode(false)
      setPasteImage(null)
      setPasteRect(null)
      return
    }

    const snapshot = editCanvas.toDataURL('image/png')
    setHistory((prev) => {
      const next = [...prev, snapshot]
      return next.length > 10 ? next.slice(-10) : next
    })

    const ctx = editCanvas.getContext('2d')!
    const sx = editCanvas.width / canvasSize.width
    const sy = editCanvas.height / canvasSize.height
    const dstX = Math.round(pasteRect.x * sx)
    const dstY = Math.round(pasteRect.y * sy)
    const dstW = Math.round(pasteRect.width * sx)
    const dstH = Math.round(pasteRect.height * sy)

    ctx.drawImage(pasteImage, 0, 0, pasteImage.width, pasteImage.height, dstX, dstY, dstW, dstH)
    setEditVersion((v) => v + 1)

    setPasteImage(null)
    setPasteRect(null)
    setIsPasteMode(false)
  }, [editCanvas, pasteImage, pasteRect, canvasSize])

  const cancelPaste = useCallback(() => {
    setPasteImage(null)
    setPasteRect(null)
    setIsPasteMode(false)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!editCanvas) return
      const coords = getCanvasCoords(e)

      // ─── 붙여넣기 모드 처리 ─── //
      if (isPasteMode && pasteRect) {
        const pHandle = detectPasteHandle(coords)
        if (pHandle) {
          setPasteResizeHandle(pHandle)
          setPasteResizeOrigin({ ...pasteRect })
          setPasteResizeStart(coords)
          return
        }
        if (isInsidePasteRect(coords)) {
          setIsPasteDragging(true)
          setPasteDragOffset({ x: coords.x - pasteRect.x, y: coords.y - pasteRect.y })
          return
        }
        // 밖을 클릭하면 무시 (명시적으로 확인/취소 버튼 사용)
        return
      }

      const handle = detectHandle(coords)
      if (handle && selection) {
        // 리사이즈 시작 → 이미지 조각 캡처 + 원본 영역 배경 복원
        const ctx = editCanvas.getContext('2d')!
        const sx2 = editCanvas.width / canvasSize.width
        const sy2 = editCanvas.height / canvasSize.height
        const rSrcX = Math.round(selection.x * sx2)
        const rSrcY = Math.round(selection.y * sy2)
        const rSrcW = Math.round(selection.width * sx2)
        const rSrcH = Math.round(selection.height * sy2)

        // 스냅샷 저장 (undo 용)
        const snapshot = editCanvas.toDataURL('image/png')
        setHistory((prev) => {
          const next = [...prev, snapshot]
          return next.length > 10 ? next.slice(-10) : next
        })

        // 이미지 조각 캡처
        const tmpCanvas = document.createElement('canvas')
        tmpCanvas.width = rSrcW
        tmpCanvas.height = rSrcH
        tmpCanvas.getContext('2d')!.drawImage(
          editCanvas, rSrcX, rSrcY, rSrcW, rSrcH, 0, 0, rSrcW, rSrcH
        )
        setResizeImageCanvas(tmpCanvas)

        // 원본 영역을 strip-copy로 배경 복원
        const topStripY = Math.max(0, rSrcY - 2)
        const bottomStripY = Math.min(editCanvas.height - 1, rSrcY + rSrcH + 1)
        const topStrip = ctx.getImageData(rSrcX, topStripY, rSrcW, 1)
        const bottomStrip = ctx.getImageData(rSrcX, bottomStripY, rSrcW, 1)
        for (let y = rSrcY; y < Math.min(editCanvas.height, rSrcY + rSrcH); y++) {
          const t = rSrcH > 1 ? (y - rSrcY) / (rSrcH - 1) : 0
          const blended = new ImageData(rSrcW, 1)
          for (let px = 0; px < rSrcW; px++) {
            const i = px * 4
            blended.data[i]     = Math.round(topStrip.data[i]     * (1 - t) + bottomStrip.data[i]     * t)
            blended.data[i + 1] = Math.round(topStrip.data[i + 1] * (1 - t) + bottomStrip.data[i + 1] * t)
            blended.data[i + 2] = Math.round(topStrip.data[i + 2] * (1 - t) + bottomStrip.data[i + 2] * t)
            blended.data[i + 3] = 255
          }
          ctx.putImageData(blended, rSrcX, y)
        }
        setEditVersion((v) => v + 1)

        setResizeHandle(handle)
        setResizeOrigin({ ...selection })
        setSelectionStart(coords)
        return
      }

      if (isInsideSelection(coords) && selection) {
        const snapshot = editCanvas.toDataURL('image/png')
        setHistory((prev) => {
          const next = [...prev, snapshot]
          return next.length > 10 ? next.slice(-10) : next
        })

        const ctx = editCanvas.getContext('2d')!
        const sx = editCanvas.width / canvasSize.width
        const sy = editCanvas.height / canvasSize.height
        const srcX = Math.round(selection.x * sx)
        const srcY = Math.round(selection.y * sy)
        const srcW = Math.round(selection.width * sx)
        const srcH = Math.round(selection.height * sy)

        const tmpCanvas = document.createElement('canvas')
        tmpCanvas.width = srcW
        tmpCanvas.height = srcH
        tmpCanvas.getContext('2d')!.drawImage(
          editCanvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH
        )
        setMoveImageCanvas(tmpCanvas)

        const bg = sampleBackgroundColor(ctx, srcX, srcY, srcW, srcH)
        ctx.fillStyle = `rgb(${bg.r}, ${bg.g}, ${bg.b})`
        ctx.fillRect(srcX, srcY, srcW, srcH)
        setEditVersion((v) => v + 1)

        setMoveOffset({ x: coords.x - selection.x, y: coords.y - selection.y })
        setIsMoving(true)
        return
      }

      setIsSelecting(true)
      setSelectionStart(coords)
      setSelection({ x: coords.x, y: coords.y, width: 0, height: 0 })
      setEditedText('')
      setDetectedFontSize(null)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editCanvas, getCanvasCoords, detectHandle, selection, isInsideSelection, canvasSize, isPasteMode, pasteRect, detectPasteHandle, isInsidePasteRect]
  )

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const coords = getCanvasCoords(e)

      // ─── 붙여넣기 모드 처리 ─── //
      if (isPasteMode && pasteRect) {
        if (pasteResizeHandle && pasteResizeOrigin) {
          const dx = coords.x - pasteResizeStart.x
          const dy = coords.y - pasteResizeStart.y
          const o = pasteResizeOrigin
          const aspect = o.width / o.height
          let nx = o.x, ny = o.y, nw = o.width, nh = o.height

          if (pasteResizeHandle === 'se') {
            nw = Math.max(20, o.width + dx)
            nh = nw / aspect
          } else if (pasteResizeHandle === 'sw') {
            nw = Math.max(20, o.width - dx)
            nh = nw / aspect
            nx = o.x + o.width - nw
          } else if (pasteResizeHandle === 'ne') {
            nw = Math.max(20, o.width + dx)
            nh = nw / aspect
            ny = o.y + o.height - nh
          } else if (pasteResizeHandle === 'nw') {
            nw = Math.max(20, o.width - dx)
            nh = nw / aspect
            nx = o.x + o.width - nw
            ny = o.y + o.height - nh
          }

          setPasteRect({ x: nx, y: ny, width: nw, height: nh })
          return
        }
        if (isPasteDragging) {
          setPasteRect({
            ...pasteRect,
            x: coords.x - pasteDragOffset.x,
            y: coords.y - pasteDragOffset.y,
          })
          return
        }
        // 커서 변경
        if (canvasRef.current && !('touches' in e)) {
          const pH = detectPasteHandle(coords)
          if (pH) {
            const cursors: Record<string, string> = {
              nw: 'nwse-resize', se: 'nwse-resize',
              ne: 'nesw-resize', sw: 'nesw-resize',
            }
            canvasRef.current.style.cursor = cursors[pH] || 'default'
          } else if (isInsidePasteRect(coords)) {
            canvasRef.current.style.cursor = 'move'
          } else {
            canvasRef.current.style.cursor = 'default'
          }
        }
        return
      }

      if (isMoving && selection) {
        setSelection({
          x: coords.x - moveOffset.x,
          y: coords.y - moveOffset.y,
          width: selection.width,
          height: selection.height,
        })
        return
      }

      if (resizeHandle && resizeOrigin) {
        const dx = coords.x - selectionStart.x
        const dy = coords.y - selectionStart.y
        const o = resizeOrigin
        let nx = o.x, ny = o.y, nw = o.width, nh = o.height

        if (resizeHandle.includes('w')) { nx = o.x + dx; nw = o.width - dx }
        if (resizeHandle.includes('e')) { nw = o.width + dx }
        if (resizeHandle.includes('n')) { ny = o.y + dy; nh = o.height - dy }
        if (resizeHandle.includes('s')) { nh = o.height + dy }

        if (nw < 10) { nw = 10 }
        if (nh < 10) { nh = 10 }

        setSelection({ x: nx, y: ny, width: nw, height: nh })
        return
      }

      // 커서 모양 변경 (마우스만)
      if (!isSelecting && canvasRef.current && !('touches' in e)) {
        if (isInsideSelection(coords)) {
          canvasRef.current.style.cursor = 'move'
        } else {
          canvasRef.current.style.cursor = getCursorForHandle(coords)
        }
      }

      if (!isSelecting) return
      setSelection({
        x: Math.min(selectionStart.x, coords.x),
        y: Math.min(selectionStart.y, coords.y),
        width: Math.abs(coords.x - selectionStart.x),
        height: Math.abs(coords.y - selectionStart.y),
      })
    },
    [isSelecting, selectionStart, getCanvasCoords, resizeHandle, resizeOrigin, getCursorForHandle, isMoving, selection, moveOffset, isInsideSelection, isPasteMode, pasteRect, pasteResizeHandle, pasteResizeOrigin, pasteResizeStart, isPasteDragging, pasteDragOffset, detectPasteHandle, isInsidePasteRect]
  )

  const handlePointerUp = useCallback(() => {
    // ─── 붙여넣기 모드 처리 ─── //
    if (isPasteMode) {
      setIsPasteDragging(false)
      setPasteResizeHandle(null)
      setPasteResizeOrigin(null)
      return
    }

    if (isMoving && moveImageCanvas && selection && editCanvas) {
      const ctx = editCanvas.getContext('2d')!
      const sx = editCanvas.width / canvasSize.width
      const sy = editCanvas.height / canvasSize.height
      const dstX = Math.round(selection.x * sx)
      const dstY = Math.round(selection.y * sy)
      ctx.drawImage(moveImageCanvas, dstX, dstY)
      setEditVersion((v) => v + 1)
      setIsMoving(false)
      setMoveImageCanvas(null)
      return
    }

    if (resizeHandle) {
      // 리사이즈 완료 → 이미지 조각을 새 크기로 editCanvas에 그리기
      if (resizeImageCanvas && selection && editCanvas) {
        const ctx = editCanvas.getContext('2d')!
        const sx = editCanvas.width / canvasSize.width
        const sy = editCanvas.height / canvasSize.height
        const dstX = Math.round(selection.x * sx)
        const dstY = Math.round(selection.y * sy)
        const dstW = Math.round(selection.width * sx)
        const dstH = Math.round(selection.height * sy)
        ctx.drawImage(resizeImageCanvas, 0, 0, resizeImageCanvas.width, resizeImageCanvas.height, dstX, dstY, dstW, dstH)
        setEditVersion((v) => v + 1)
      }
      setResizeHandle(null)
      setResizeOrigin(null)
      setResizeImageCanvas(null)
      return
    }
    setIsSelecting(false)
    setSelection((prev) => {
      if (prev && (prev.width < 10 || prev.height < 10)) return null
      return prev
    })
  }, [resizeHandle, isMoving, moveImageCanvas, selection, editCanvas, canvasSize, isPasteMode])

  // ─── OCR 실행 ─── //
  const runOCR = async () => {
    if (!selection || !editCanvas) return

    setIsProcessing(true)
    setOcrProgress(0)
    setEditedText('')

    try {
      const sx = editCanvas.width / canvasSize.width
      const sy = editCanvas.height / canvasSize.height
      const srcX = Math.round(selection.x * sx)
      const srcY = Math.round(selection.y * sy)
      const srcW = Math.round(selection.width * sx)
      const srcH = Math.round(selection.height * sy)

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = srcW
      tempCanvas.height = srcH
      const tempCtx = tempCanvas.getContext('2d')!
      tempCtx.drawImage(editCanvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH)

      const result = await Tesseract.recognize(
        tempCanvas.toDataURL('image/png'),
        'kor',
        {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100))
            }
          },
        }
      )

      const ocrLines = result.data.lines as Array<{ bbox: { x0: number; y0: number; x1: number; y1: number } }>
      if (ocrLines && ocrLines.length > 0) {
        const totalLineHeight = ocrLines.reduce(
          (sum, line) => sum + (line.bbox.y1 - line.bbox.y0), 0
        )
        setDetectedFontSize(Math.round(totalLineHeight / ocrLines.length))
      }

      setEditedText(result.data.text.trim())
      // 모바일에서 OCR 완료 후 자동으로 패널 열기
      setMobilePanelOpen(true)
    } catch (err) {
      console.error('OCR 오류:', err)
      setEditedText('OCR 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // ─── 텍스트 교체 ─── //
  const sampleBackgroundColor = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const sampleY = Math.max(0, y - 2)
    const sampleH = Math.min(2, y)
    if (sampleH <= 0) {
      const belowY = Math.min(y + h, ctx.canvas.height - 2)
      const belowData = ctx.getImageData(x, belowY, w, 2)
      return averageColor(belowData)
    }
    const data = ctx.getImageData(x, sampleY, w, sampleH)
    return averageColor(data)
  }

  const analyzeOriginalText = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): TextMeasure | null => {
      if (w <= 0 || h <= 0) return null
      const imgData = ctx.getImageData(x, y, w, h)
      const d = imgData.data

      let bgR = 0, bgG = 0, bgB = 0, bgN = 0
      for (let col = 0; col < w; col++) {
        for (const row of [0, 1, h - 2, h - 1]) {
          if (row < 0 || row >= h) continue
          const i = (row * w + col) * 4
          bgR += d[i]; bgG += d[i + 1]; bgB += d[i + 2]; bgN++
        }
      }
      for (let row = 2; row < h - 2; row++) {
        for (const col of [0, 1, w - 2, w - 1]) {
          if (col < 0 || col >= w) continue
          const i = (row * w + col) * 4
          bgR += d[i]; bgG += d[i + 1]; bgB += d[i + 2]; bgN++
        }
      }
      if (bgN === 0) return null
      bgR /= bgN; bgG /= bgN; bgB /= bgN

      let maxDiff = 0
      for (let i = 0; i < d.length; i += 4) {
        const diff = Math.abs(d[i] - bgR) + Math.abs(d[i + 1] - bgG) + Math.abs(d[i + 2] - bgB)
        if (diff > maxDiff) maxDiff = diff
      }
      const threshold = Math.max(maxDiff * 0.3, 30)

      let topRow = h, bottomRow = 0, leftCol = w, rightCol = 0
      for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
          const i = (row * w + col) * 4
          const diff = Math.abs(d[i] - bgR) + Math.abs(d[i + 1] - bgG) + Math.abs(d[i + 2] - bgB)
          if (diff > threshold) {
            if (row < topRow) topRow = row
            if (row > bottomRow) bottomRow = row
            if (col < leftCol) leftCol = col
            if (col > rightCol) rightCol = col
          }
        }
      }
      if (topRow >= bottomRow) return null

      const textHeight = bottomRow - topRow + 1

      const scanFrom = Math.round(topRow + textHeight * 0.3)
      const scanTo = Math.round(topRow + textHeight * 0.7)
      const runs: number[] = []
      for (let row = scanFrom; row <= scanTo; row += 2) {
        let run = 0
        for (let col = leftCol; col <= rightCol; col++) {
          const i = (row * w + col) * 4
          const diff = Math.abs(d[i] - bgR) + Math.abs(d[i + 1] - bgG) + Math.abs(d[i + 2] - bgB)
          if (diff > threshold) {
            run++
          } else {
            if (run > 1) runs.push(run)
            run = 0
          }
        }
        if (run > 1) runs.push(run)
      }
      runs.sort((a, b) => a - b)
      const strokeWidth = runs.length > 0 ? runs[Math.floor(runs.length / 2)] : 2

      return {
        textHeight,
        textWidth: rightCol - leftCol + 1,
        textTop: topRow,
        textLeft: leftCol,
        strokeWidth,
        isBold: strokeWidth > 6,
      }
    },
    []
  )

  // ── 원본 텍스트 픽셀에서 실제 글자 색상 감지 ──
  const detectTextColor = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): string | null => {
      if (w <= 0 || h <= 0) return null
      const imgData = ctx.getImageData(x, y, w, h)
      const d = imgData.data

      // 1) 테두리 픽셀로 배경색 추정
      let bgR = 0, bgG = 0, bgB = 0, bgN = 0
      for (let col = 0; col < w; col++) {
        for (const row of [0, 1, h - 2, h - 1]) {
          if (row < 0 || row >= h) continue
          const i = (row * w + col) * 4
          bgR += d[i]; bgG += d[i + 1]; bgB += d[i + 2]; bgN++
        }
      }
      for (let row = 2; row < h - 2; row++) {
        for (const col of [0, 1, w - 2, w - 1]) {
          if (col < 0 || col >= w) continue
          const i = (row * w + col) * 4
          bgR += d[i]; bgG += d[i + 1]; bgB += d[i + 2]; bgN++
        }
      }
      if (bgN === 0) return null
      bgR /= bgN; bgG /= bgN; bgB /= bgN

      // 2) 배경과 크게 다른 픽셀(=텍스트 픽셀)의 최대 차이 계산
      let maxDiff = 0
      for (let i = 0; i < d.length; i += 4) {
        const diff = Math.abs(d[i] - bgR) + Math.abs(d[i + 1] - bgG) + Math.abs(d[i + 2] - bgB)
        if (diff > maxDiff) maxDiff = diff
      }
      const threshold = Math.max(maxDiff * 0.3, 30)

      // 3) 텍스트 픽셀만 모아서 평균 색상 계산
      let tR = 0, tG = 0, tB = 0, tN = 0
      for (let i = 0; i < d.length; i += 4) {
        const diff = Math.abs(d[i] - bgR) + Math.abs(d[i + 1] - bgG) + Math.abs(d[i + 2] - bgB)
        if (diff > threshold) {
          tR += d[i]; tG += d[i + 1]; tB += d[i + 2]; tN++
        }
      }
      if (tN === 0) return null

      const r = Math.round(tR / tN)
      const g = Math.round(tG / tN)
      const b = Math.round(tB / tN)
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    },
    []
  )

  // 선택 영역이 확정되면 자동으로 원본 텍스트를 측정 + 글자 색 감지
  useEffect(() => {
    if (isSelecting || resizeHandle) return
    if (!selection || !editCanvas || selection.width < 10 || selection.height < 10) {
      setTextMeasure(null)
      return
    }
    const ctx = editCanvas.getContext('2d')
    if (!ctx) return

    const sx = editCanvas.width / canvasSize.width
    const sy = editCanvas.height / canvasSize.height
    const srcX = Math.round(selection.x * sx)
    const srcY = Math.round(selection.y * sy)
    const srcW = Math.round(selection.width * sx)
    const srcH = Math.round(selection.height * sy)

    const m = analyzeOriginalText(ctx, srcX, srcY, srcW, srcH)
    setTextMeasure(m)
    setFontSizeOverride(m ? m.textHeight : srcH)
    if (m) {
      setFontBold(m.isBold)
    } else {
      setFontBold(false)
    }

    // 원본 텍스트 픽셀에서 실제 글자 색상 자동 감지
    const detected = detectTextColor(ctx, srcX, srcY, srcW, srcH)
    setTextColorOverride(detected) // 감지된 색상으로 자동 세팅 (null이면 폴백)
  }, [selection, isSelecting, resizeHandle, editCanvas, canvasSize, analyzeOriginalText, detectTextColor])

  const averageColor = (data: ImageData) => {
    let r = 0, g = 0, b = 0, count = 0
    for (let i = 0; i < data.data.length; i += 4) {
      r += data.data[i]
      g += data.data[i + 1]
      b += data.data[i + 2]
      count++
    }
    if (count === 0) return { r: 255, g: 255, b: 255 }
    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count),
    }
  }

  const replaceText = () => {
    if (!editCanvas || !selection || !editedText.trim()) return

    const ctx = editCanvas.getContext('2d')!

    // 실행 취소를 위한 스냅샷 저장
    const snapshot = editCanvas.toDataURL('image/png')
    setHistory((prev) => {
      const next = [...prev, snapshot]
      return next.length > 10 ? next.slice(-10) : next
    })

    const sx = editCanvas.width / canvasSize.width
    const sy = editCanvas.height / canvasSize.height
    const srcX = Math.round(selection.x * sx)
    const srcY = Math.round(selection.y * sy)
    const srcW = Math.round(selection.width * sx)
    const srcH = Math.round(selection.height * sy)

    // ── 배경 복원 (strip-copy 방식) ──
    // 기존: 단색 평균색으로 fillRect → 그라데이션/패턴 배경이 망가짐
    // 개선: 선택 영역 위/아래 1px strip을 복사하여 세로로 타일링
    //       → 원본 배경 패턴/그라데이션이 자연스럽게 유지됨
    const topStripY = Math.max(0, srcY - 2)
    const bottomStripY = Math.min(editCanvas.height - 1, srcY + srcH + 1)
    const topStrip = ctx.getImageData(srcX, topStripY, srcW, 1)
    const bottomStrip = ctx.getImageData(srcX, bottomStripY, srcW, 1)

    for (let y = srcY; y < Math.min(editCanvas.height, srcY + srcH); y++) {
      // 위/아래 strip을 y 위치에 따라 블렌딩 (세로 그라데이션 대응)
      const t = srcH > 1 ? (y - srcY) / (srcH - 1) : 0 // 0(상단) ~ 1(하단) 비율
      const blended = new ImageData(srcW, 1)
      for (let px = 0; px < srcW; px++) {
        const i = px * 4
        blended.data[i]     = Math.round(topStrip.data[i]     * (1 - t) + bottomStrip.data[i]     * t)
        blended.data[i + 1] = Math.round(topStrip.data[i + 1] * (1 - t) + bottomStrip.data[i + 1] * t)
        blended.data[i + 2] = Math.round(topStrip.data[i + 2] * (1 - t) + bottomStrip.data[i + 2] * t)
        blended.data[i + 3] = 255
      }
      ctx.putImageData(blended, srcX, y)
    }

    // 텍스트 색상: textColorOverride(자동 감지 or 사용자 지정)가 있으면 사용
    // 없으면 배경 밝기 기준 폴백
    let textColor: string
    if (textColorOverride) {
      textColor = textColorOverride
    } else {
      // 폴백: 배경 밝기 기준 흑/백 추측
      const centerX = Math.min(Math.floor(srcW / 2), srcW - 1) * 4
      const midT = 0.5
      const bgR = Math.round(topStrip.data[centerX] * (1 - midT) + bottomStrip.data[centerX] * midT)
      const bgG = Math.round(topStrip.data[centerX + 1] * (1 - midT) + bottomStrip.data[centerX + 1] * midT)
      const bgB = Math.round(topStrip.data[centerX + 2] * (1 - midT) + bottomStrip.data[centerX + 2] * midT)
      const brightness = (bgR * 299 + bgG * 587 + bgB * 114) / 1000
      textColor = brightness > 128 ? '#1a1a1a' : '#f0f0f0'
    }

    const fontFamily = '"Malgun Gothic", "맑은 고딕", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif'
    const rawLines = editedText.split('\n')
    const weight = fontBold ? 'bold' : 'normal'

    const targetVisualH = fontSizeOverride ?? srcH

    // 실제 입력 텍스트의 글리프 높이로 폰트 크기를 계산 (고정 문자열 대신)
    const findFontSize = (target: number, sampleText: string): number => {
      let lo = 1, hi = target * 3
      for (let i = 0; i < 20; i++) {
        const mid = Math.round((lo + hi) / 2)
        if (mid <= lo) break
        ctx.font = `${weight} ${mid}px ${fontFamily}`
        const m = ctx.measureText(sampleText)
        const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
        if (h < target) lo = mid
        else hi = mid
      }
      return hi
    }

    const perLineTarget = Math.round(targetVisualH / rawLines.length)
    const sampleText = rawLines[0] || '한글'
    let fontSize = findFontSize(perLineTarget, sampleText)
    fontSize = Math.max(10, Math.min(fontSize, 800))
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`
    ctx.fillStyle = textColor
    ctx.textBaseline = 'alphabetic' // 'middle'은 한글에서 시각적 중심이 안 맞으므로 alphabetic 사용

    const lines = rawLines

    // 텍스트가 선택 영역보다 넓으면 오른쪽도 strip-copy로 배경 확장
    let maxLW = 0
    for (const line of lines) {
      maxLW = Math.max(maxLW, ctx.measureText(line).width)
    }
    if (maxLW > srcW) {
      const extraW = Math.ceil(maxLW - srcW + 4)
      const extraX = srcX + srcW
      const extraTopStrip = ctx.getImageData(Math.min(extraX, editCanvas.width - 1), topStripY, Math.min(extraW, editCanvas.width - extraX), 1)
      const extraBottomStrip = ctx.getImageData(Math.min(extraX, editCanvas.width - 1), bottomStripY, Math.min(extraW, editCanvas.width - extraX), 1)
      const actualExtraW = Math.min(extraW, editCanvas.width - extraX)
      if (actualExtraW > 0) {
        for (let y = srcY; y < Math.min(editCanvas.height, srcY + srcH); y++) {
          const t = srcH > 1 ? (y - srcY) / (srcH - 1) : 0
          const blended = new ImageData(actualExtraW, 1)
          for (let px = 0; px < actualExtraW; px++) {
            const i = px * 4
            blended.data[i]     = Math.round(extraTopStrip.data[i]     * (1 - t) + extraBottomStrip.data[i]     * t)
            blended.data[i + 1] = Math.round(extraTopStrip.data[i + 1] * (1 - t) + extraBottomStrip.data[i + 1] * t)
            blended.data[i + 2] = Math.round(extraTopStrip.data[i + 2] * (1 - t) + extraBottomStrip.data[i + 2] * t)
            blended.data[i + 3] = 255
          }
          ctx.putImageData(blended, extraX, y)
        }
      }
    }
    ctx.fillStyle = textColor

    // ── 원본 텍스트 위치 기반 정렬 (alphabetic baseline 사용) ──
    // textMeasure가 있으면 원본 텍스트의 정확한 위치(textTop, textHeight)를 사용
    // 없으면 선택 영역 전체를 기준으로 배치
    let textAreaTop: number
    let textAreaHeight: number

    if (textMeasure) {
      textAreaTop = srcY + textMeasure.textTop
      textAreaHeight = textMeasure.textHeight
    } else {
      textAreaTop = srcY
      textAreaHeight = srcH
    }

    // alphabetic baseline: 실제 글리프의 ascent/descent를 측정하여
    // 각 줄 슬롯 안에서 시각적으로 정확히 중앙에 오도록 baseline 위치를 계산
    const testSample = lines[0] || '한글테스트'
    const glyphMetrics = ctx.measureText(testSample)
    const glyphAscent = glyphMetrics.actualBoundingBoxAscent
    const glyphDescent = glyphMetrics.actualBoundingBoxDescent

    const lineH = textAreaHeight / lines.length
    const padX = 2

    for (let i = 0; i < lines.length; i++) {
      const slotTop = textAreaTop + i * lineH
      const baselineY = slotTop + (lineH + glyphAscent - glyphDescent) / 2
      const drawX = srcX + padX
      const line = lines[i]
      const renderedW = ctx.measureText(line).width
      const availW = srcW - padX

      if (renderedW > availW && renderedW > 0) {
        // 텍스트가 선택 영역보다 넓으면 가로만 축소하여 맞춤
        const scaleX = availW / renderedW
        ctx.save()
        ctx.translate(drawX, 0)
        ctx.scale(scaleX, 1)
        ctx.fillText(line, 0, baselineY)
        ctx.restore()
      } else {
        ctx.fillText(line, drawX, baselineY)
      }
    }

    setEditVersion((v) => v + 1)
    setSelection(null)
    setEditedText('')
  }

  // ─── 실행 취소 ─── //
  const undoRef = useRef<() => void>(() => {})

  const undo = useCallback(() => {
    if (history.length === 0 || !editCanvas) return

    const last = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))

    const img = new window.Image()
    img.onload = () => {
      const ctx = editCanvas.getContext('2d')!
      ctx.clearRect(0, 0, editCanvas.width, editCanvas.height)
      ctx.drawImage(img, 0, 0)
      setEditVersion((v) => v + 1)
      setSelection(null)
      setEditedText('')
    }
    img.src = last
  }, [history, editCanvas])

  undoRef.current = undo

  // Ctrl+Z 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (location.pathname !== '/image-editor') return
      const tag = document.activeElement?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undoRef.current()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [location.pathname])

  // ─── 클립보드 이미지 붙여넣기 (Ctrl+V) ─── //
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (location.pathname !== '/image-editor') return
      if (!editCanvas) return
      // textarea/input 에 포커스 중이면 무시
      const tag = document.activeElement?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return

      const items = e.clipboardData?.items
      if (!items) return

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const blob = item.getAsFile()
          if (!blob) continue

          const url = URL.createObjectURL(blob)
          const img = new window.Image()
          img.onload = () => {
            const cvs = document.createElement('canvas')
            cvs.width = img.naturalWidth
            cvs.height = img.naturalHeight
            cvs.getContext('2d')!.drawImage(img, 0, 0)
            URL.revokeObjectURL(url)

            // 캔버스 크기의 50% 이내로 초기 크기 설정
            const maxW = canvasSize.width * 0.5
            const maxH = canvasSize.height * 0.5
            const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1)
            const displayW = img.naturalWidth * ratio
            const displayH = img.naturalHeight * ratio

            // 선택 영역이 있으면 그 안에 맞추기, 없으면 중앙 배치
            let x: number, y: number, w: number, h: number
            if (selection && selection.width > 10 && selection.height > 10) {
              x = selection.x
              y = selection.y
              w = selection.width
              h = selection.height
            } else {
              x = (canvasSize.width - displayW) / 2
              y = (canvasSize.height - displayH) / 2
              w = displayW
              h = displayH
            }

            setPasteImage(cvs)
            setPasteRect({ x, y, width: w, height: h })
            setIsPasteMode(true)
            setSelection(null)
          }
          img.src = url
          break
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [editCanvas, canvasSize, location.pathname, selection])

  // ─── 붙여넣기 모드 키보드: Enter(확인) / Escape(취소) ─── //
  const confirmPasteRef = useRef(confirmPaste)
  confirmPasteRef.current = confirmPaste
  const cancelPasteRef = useRef(cancelPaste)
  cancelPasteRef.current = cancelPaste

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPasteMode) return
      if (e.key === 'Enter') {
        e.preventDefault()
        confirmPasteRef.current()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cancelPasteRef.current()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isPasteMode])

  // ─── Ctrl+마우스 휠 확대/축소 ─── //
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setScale((s) => {
        const delta = e.deltaY < 0 ? 0.15 : -0.15
        return Math.min(Math.max(s + delta, 0.3), 5)
      })
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  // ─── PDF 변환 탭에 반영 ─── //
  const saveToStore = () => {
    if (!editCanvas || currentPageNumber === null) return
    const dataUrl = editCanvas.toDataURL('image/png')
    updatePageDataUrl(currentPageNumber, dataUrl)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  const downloadImage = () => {
    if (!editCanvas) return
    const link = document.createElement('a')
    link.download = currentPageNumber
      ? `page_${String(currentPageNumber).padStart(2, '0')}_edited.png`
      : 'edited_image.png'
    link.href = editCanvas.toDataURL('image/png')
    link.click()
  }

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 5))
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.3))
  const resetZoom = () => setScale(1)

  const hasValidSelection = selection && selection.width > 10 && selection.height > 10

  // ── 텍스트 교체 패널 내용 (데스크탑/모바일 공용) ── //
  const renderEditPanel = () => (
    <>
      {/* 패널 헤더 */}
      <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <h3 className="text-slate-800 font-medium text-sm flex items-center gap-2">
          <Type className="w-4 h-4 text-blue-400" />
          한글 텍스트 교체
        </h3>
        <div className="flex items-center gap-1">
          {hasValidSelection && (
            <button
              onClick={() => { setSelection(null); setEditedText('') }}
              className="p-1 text-slate-600 hover:text-slate-800 transition-colors"
              title="선택 해제"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* 모바일 접기 버튼 */}
          <button
            onClick={() => setMobilePanelOpen(false)}
            className="p-1 text-slate-600 hover:text-slate-800 transition-colors md:hidden"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 패널 콘텐츠 */}
      <div className="flex-1 p-3 sm:p-4 overflow-auto">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <div className="text-center">
              <p className="text-slate-700 text-sm">한글을 인식하고 있습니다...</p>
              <p className="text-slate-500 text-xs mt-1">{ocrProgress}% 완료</p>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {!hasValidSelection && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                <Square className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-300 text-sm font-medium">영역을 선택하세요</p>
                <p className="text-slate-500 text-xs mt-1">
                  이미지에서 깨진 한글 영역을 드래그하세요
                </p>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-500 mb-1.5 sm:mb-2 block">
                {hasValidSelection ? '① 인식된 텍스트를 확인/수정하거나 직접 입력' : '교체할 텍스트'}
              </label>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-white/50 border border-slate-200 rounded-lg p-3 text-slate-800 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors"
                rows={4}
                placeholder="교체할 한글 텍스트를 입력하세요..."
              />
            </div>

            {/* 원본 텍스트 측정 결과 & 조절 */}
            {hasValidSelection && textMeasure && (
              <div className="bg-white/60 border border-slate-200 rounded-lg p-3 space-y-3">
                <p className="text-xs text-slate-600 font-medium">📏 원본 텍스트 측정 결과</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-slate-500">글자 높이</span>
                  <span className="text-slate-700 font-mono">{textMeasure.textHeight}px</span>
                  <span className="text-slate-500">획 두께</span>
                  <span className="text-slate-700 font-mono">{textMeasure.strokeWidth}px</span>
                  <span className="text-slate-500">시작 위치</span>
                  <span className="text-slate-700 font-mono">({textMeasure.textLeft}, {textMeasure.textTop})</span>
                </div>

                {/* 폰트 크기 조절 */}
                <div>
                  <label className="text-xs text-slate-600 mb-1 flex items-center justify-between">
                    <span>교체 텍스트 높이 (px)</span>
                    <button
                      onClick={() => setFontSizeOverride(textMeasure!.textHeight)}
                      className="text-blue-400 hover:text-blue-300 text-[10px]"
                    >
                      측정값으로 초기화
                    </button>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={Math.max(10, Math.round(textMeasure.textHeight * 0.5))}
                      max={Math.round(textMeasure.textHeight * 3)}
                      value={fontSizeOverride ?? textMeasure.textHeight}
                      onChange={(e) => setFontSizeOverride(Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <input
                      type="number"
                      min={10}
                      max={800}
                      value={fontSizeOverride ?? textMeasure.textHeight}
                      onChange={(e) => setFontSizeOverride(Number(e.target.value))}
                      className="w-16 bg-slate-100 border border-gray-600 rounded px-2 py-1 text-slate-800 text-xs font-mono text-center"
                    />
                  </div>
                </div>

                {/* 볼드 토글 + 글자 색상 */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fontBold}
                      onChange={(e) => setFontBold(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-slate-100 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600">
                      볼드 {textMeasure.isBold && <span className="text-blue-400 ml-1">← 자동 감지</span>}
                    </span>
                  </label>
                </div>

                {/* 글자 색상 선택 */}
                <div>
                  <label className="text-xs text-slate-600 mb-1 flex items-center justify-between">
                    <span>글자 색상</span>
                    <button
                      onClick={() => {
                        // 원본 텍스트에서 색상 재감지
                        if (!editCanvas || !selection) return
                        const ctx2 = editCanvas.getContext('2d')
                        if (!ctx2) return
                        const sx2 = editCanvas.width / canvasSize.width
                        const sy2 = editCanvas.height / canvasSize.height
                        const detected = detectTextColor(
                          ctx2,
                          Math.round(selection.x * sx2),
                          Math.round(selection.y * sy2),
                          Math.round(selection.width * sx2),
                          Math.round(selection.height * sy2)
                        )
                        setTextColorOverride(detected)
                      }}
                      className="text-blue-400 hover:text-blue-300 text-[10px]"
                    >
                      원본에서 재감지
                    </button>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColorOverride || '#1a1a1a'}
                      onChange={(e) => setTextColorOverride(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <div
                      className="w-6 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: textColorOverride || '#1a1a1a' }}
                      title="현재 글자 색상 미리보기"
                    />
                    <span className="text-xs text-slate-600 font-mono uppercase">
                      {textColorOverride || '미감지'}
                    </span>
                    {textColorOverride && (
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">자동 감지됨</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={replaceText}
              disabled={!editedText.trim() || !selection}
              className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-500 text-slate-800 rounded-lg text-sm w-full justify-center transition-colors font-medium"
            >
              <Type className="w-4 h-4" />
              {hasValidSelection ? '② 선택 영역에 텍스트 교체' : '영역을 먼저 선택하세요'}
            </button>

            {/* 사용법 (데스크탑만 표시) */}
            <div className="bg-white/30 rounded-lg p-3 space-y-1.5 hidden sm:block">
              <p className="text-xs text-slate-600 font-medium">💡 사용법</p>
              <p className="text-xs text-slate-500">1. Ctrl+마우스 휠로 확대</p>
              <p className="text-xs text-slate-500">2. 깨진 한글 영역을 드래그로 선택</p>
              <p className="text-xs text-slate-500">3. 자동 측정된 크기/두께 확인 (조절 가능)</p>
              <p className="text-xs text-slate-500">4. 텍스트를 입력하고 "텍스트 교체" 클릭</p>
              <p className="text-xs text-slate-500">5. 핸들로 영역 크기 조절 가능</p>
              <p className="text-xs text-slate-500">6. Ctrl+Z로 실행 취소</p>
            </div>

            {/* 이미지 붙여넣기 안내 */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 space-y-1.5 hidden sm:block">
              <p className="text-xs text-green-400 font-medium flex items-center gap-1.5">
                <Clipboard className="w-3.5 h-3.5" />
                이미지 붙여넣기 (덮어쓰기)
              </p>
              <p className="text-xs text-slate-500">1. 외부에서 이미지를 복사 (Ctrl+C)</p>
              <p className="text-xs text-slate-500">2. 이 화면에서 Ctrl+V로 붙여넣기</p>
              <p className="text-xs text-slate-500">3. 드래그로 위치 이동, 꼭짓점으로 크기 조절</p>
              <p className="text-xs text-slate-500">4. Enter로 적용, ESC로 취소</p>
            </div>
          </div>
        )}
      </div>
    </>
  )

  return (
    <SmartFactoryWrapper>
      <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
      {/* ═══ 상단 툴바 ═══ */}
      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b border-slate-200 shrink-0 flex-wrap">
        {/* 이미지 업로드 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs sm:text-sm transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">이미지</span> 업로드
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="w-px h-5 sm:h-6 bg-slate-100" />

        {/* 줌 컨트롤 */}
        <button onClick={zoomOut} className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors" title="축소">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs sm:text-sm text-slate-600 min-w-[40px] sm:min-w-[48px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button onClick={zoomIn} className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors" title="확대">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={resetZoom} className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors" title="원래 크기">
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 안내 (데스크탑만) */}
        {!isPasteMode && (
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600">
            <div className="w-px h-6 bg-slate-100" />
            <Square className="w-4 h-4 text-blue-400" />
            <span>Ctrl+휠 확대 · 드래그 선택 · Ctrl+V 이미지 붙여넣기</span>
          </div>
        )}

        {/* 선택 영역 있을 때 OCR 버튼 */}
        {hasValidSelection && !isPasteMode && (
          <>
            <div className="w-px h-5 sm:h-6 bg-slate-100" />
            <button
              onClick={runOCR}
              disabled={isProcessing}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-slate-800 rounded-lg text-xs sm:text-sm transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">인식 중...</span> {ocrProgress}%
                </>
              ) : (
                '한글 인식'
              )}
            </button>
            <button
              onClick={() => { setSelection(null); setEditedText('') }}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
              title="선택 해제"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}

        {/* 실행 취소 */}
        {history.length > 0 && !isPasteMode && (
          <>
            <div className="w-px h-5 sm:h-6 bg-slate-100" />
            <button
              onClick={undo}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs sm:text-sm transition-colors"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">실행 취소</span>
            </button>
          </>
        )}

        {/* ═══ 이미지 붙여넣기 모드 컨트롤 ═══ */}
        {isPasteMode && (
          <>
            <div className="w-px h-5 sm:h-6 bg-slate-100" />
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5">
              <ImageIcon className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-xs sm:text-sm font-medium">이미지 붙여넣기</span>
              <span className="text-green-400/60 text-xs hidden sm:inline">드래그로 이동 · 꼭짓점으로 크기 조절</span>
            </div>
            <button
              onClick={confirmPaste}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-slate-800 rounded-lg text-xs sm:text-sm transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">적용</span>
              <span className="text-green-200/60 text-[10px] hidden lg:inline">(Enter)</span>
            </button>
            <button
              onClick={cancelPaste}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-gray-600 text-slate-700 rounded-lg text-xs sm:text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">취소</span>
              <span className="text-slate-500 text-[10px] hidden lg:inline">(ESC)</span>
            </button>
          </>
        )}

        {/* 우측 액션 버튼들 */}
        <div className="flex-1" />

        {editCanvas && (
          <button
            onClick={downloadImage}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs sm:text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">이미지 저장</span>
          </button>
        )}

        {currentPageNumber !== null && editCanvas && (
          <button
            onClick={saveToStore}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-800 rounded-lg text-xs sm:text-sm transition-colors relative"
          >
            {showSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">저장 완료!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">PDF에 반영</span>
                <span className="hidden lg:inline"> (p.{currentPageNumber})</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* ═══ 메인 콘텐츠: 캔버스 + 편집 패널 ═══ */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
        {/* 캔버스 영역 */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-[#f8f9fc]/50 flex items-center justify-center p-2 sm:p-4"
        >
          {!editCanvas ? (
            <div
              className="border-2 border-dashed border-slate-200 rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center cursor-pointer hover:border-gray-500 active:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-600 text-base sm:text-lg mb-2">이미지를 업로드하세요</p>
              <p className="text-slate-500 text-xs sm:text-sm">
                또는 PDF 변환 페이지에서 이미지를 가져오세요
              </p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="cursor-crosshair shadow-2xl touch-none"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            />
          )}
        </div>

        {/* ═══ 모바일: 패널 토글 버튼 (패널이 닫혀 있을 때만) ═══ */}
        {editCanvas && !mobilePanelOpen && (
          <button
            onClick={() => setMobilePanelOpen(true)}
            className="md:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-700 text-xs shadow-lg z-10"
          >
            <ChevronUp className="w-4 h-4" />
            텍스트 교체 패널
          </button>
        )}

        {/* ═══ 데스크탑: 우측 패널 (항상 표시) ═══ */}
        {editCanvas && (
          <div className="hidden md:flex w-72 lg:w-80 border-l border-slate-200 flex-col bg-[#f8f9fc]/80 shrink-0">
            {renderEditPanel()}
          </div>
        )}

        {/* ═══ 모바일: 하단 슬라이드업 패널 ═══ */}
        {editCanvas && mobilePanelOpen && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 max-h-[60vh] flex flex-col bg-[#f8f9fc] border-t border-slate-200 rounded-t-2xl shadow-2xl z-20">
            {/* 드래그 핸들 */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-gray-600 rounded-full" />
            </div>
            {renderEditPanel()}
          </div>
        )}
      </div>

      {/* ═══ 하단 상태바 (데스크탑만, 모바일에서는 공간 절약을 위해 숨김) ═══ */}
      <div className="hidden sm:flex items-center gap-4 px-4 py-2 border-t border-slate-200 text-xs text-slate-500 shrink-0">
        {editCanvas && (
          <>
            <span>원본: {editCanvas.width} × {editCanvas.height}px</span>
            <span>표시: {Math.round(canvasSize.width)} × {Math.round(canvasSize.height)}px</span>
            <span>배율: {Math.round(scale * 100)}%</span>
          </>
        )}
        {hasValidSelection && (
          <span className="text-blue-400">
            선택: {Math.round(selection!.width)} × {Math.round(selection!.height)}px
          </span>
        )}
        {currentPageNumber !== null && (
          <span className="text-emerald-400 ml-auto">
            PDF 페이지 {currentPageNumber} 편집 중
          </span>
        )}
        {history.length > 0 && (
          <span className="text-gray-600">편집: {history.length}회</span>
        )}
      </div>
      </div>
    </SmartFactoryWrapper>
  )
}

export default ImageEditor
