import { Router } from 'express'
import { query } from '../db'

const router = Router()

const COLUMNS = [
  'use_yn', 'bom_yn', 'item_type', 'acct_code', 'acct_name',
  'item_cd', 'item_name', 'std', 'draw_no', 'eng_name',
  'item_group', 'base_unit', 'conv_unit', 'base_ratio', 'conv_ratio',
  'bom_unit', 'bom_base_ratio', 'bom_ratio',
  'warehouse_cd', 'warehouse_name', 'proc_cd', 'proc_name',
  'equip_cd', 'equip_name', 'prod_lt', 'category', 'prod_plan',
  'in_out_type', 'supply_type', 'outsource_cd', 'vendor_name',
  'proper_stock', 'safety_stock', 'init_carry_qty', 'init_carry_amt',
  'std_cost', 'work_date', 'work_id',
]

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, c => '_' + c.toLowerCase())
}

function rowToClient(row: any) {
  const out: any = {}
  for (const key of Object.keys(row)) {
    out[snakeToCamel(key)] = row[key]
  }
  return out
}

router.get('/', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT * FROM item_master ORDER BY id ASC LIMIT 500`
    )
    res.json(rows.map(rowToClient))
  } catch (err) {
    console.error('item list error:', err)
    res.status(500).json({ message: '조회 실패' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [row] = await query('SELECT * FROM item_master WHERE id=$1', [req.params.id])
    if (!row) return res.status(404).json({ message: '품목을 찾을 수 없습니다.' })
    res.json(rowToClient(row))
  } catch (err) {
    console.error('item get error:', err)
    res.status(500).json({ message: '조회 실패' })
  }
})

router.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.itemCd || !body.itemName) {
      return res.status(400).json({ message: '품목코드와 품목명은 필수입니다.' })
    }
    const cols: string[] = []
    const vals: any[] = []
    const placeholders: string[] = []
    let idx = 1
    for (const col of COLUMNS) {
      const camel = snakeToCamel(col)
      if (body[camel] !== undefined) {
        cols.push(col)
        vals.push(body[camel])
        placeholders.push(`$${idx++}`)
      }
    }
    const [saved] = await query(
      `INSERT INTO item_master (${cols.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`,
      vals
    )
    res.json({ success: true, data: rowToClient(saved) })
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ message: '이미 등록된 품목코드입니다.' })
    }
    console.error('item create error:', err)
    res.status(500).json({ message: '저장 실패' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const body = req.body
    const sets: string[] = []
    const vals: any[] = []
    let idx = 1
    for (const col of COLUMNS) {
      const camel = snakeToCamel(col)
      if (body[camel] !== undefined) {
        sets.push(`${col}=$${idx++}`)
        vals.push(body[camel])
      }
    }
    sets.push(`updated_at=NOW()`)
    vals.push(req.params.id)
    const [updated] = await query(
      `UPDATE item_master SET ${sets.join(',')} WHERE id=$${idx} RETURNING *`,
      vals
    )
    if (!updated) return res.status(404).json({ message: '품목을 찾을 수 없습니다.' })
    res.json({ success: true, data: rowToClient(updated) })
  } catch (err) {
    console.error('item update error:', err)
    res.status(500).json({ message: '수정 실패' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM item_master WHERE id=$1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('item delete error:', err)
    res.status(500).json({ message: '삭제 실패' })
  }
})

export default router
