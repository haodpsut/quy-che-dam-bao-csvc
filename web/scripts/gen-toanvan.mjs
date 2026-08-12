/**
 * Sinh data/toan-van.generated.json từ DOCX gốc.
 *
 * Nguyên tắc: KHÔNG gõ lại chữ nào bằng tay. Mọi câu chữ trong web đều đi ra từ
 * file DOCX qua đúng bộ mã này, nên không có đường nào để chép sai. Phần cần
 * phán đoán chuyên môn (nhóm chỉ tiêu, kiểu chấm, trạng thái ngưỡng) nằm ở file
 * overlay riêng, tách hẳn khỏi phần chữ nguyên văn.
 *
 * Chạy: npm run toanvan
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readDocxBlocks } from './lib/docx.mjs'

const here = dirname(fileURLToPath(import.meta.url))
export const DOCX = resolve(here, '../../nguon/quy-dinh-danh-gia-hieu-qua-dau-tu-va-su-dung-tai-san-DAU.docx')
const OUT = resolve(here, '../data/toan-van.generated.json')

const RE_CHUONG = /^Chương ([IVX]+)$/
const RE_DIEU = /^Điều (\d+)\.\s*(.+)$/
const RE_KHOAN = /^(\d+)\.\s*(.+)$/
const RE_DIEM = /^([a-zđ])\)\s*(.+)$/
const RE_PHULUC = /^PHỤ LỤC ([IVX]+)$/
const RE_CANCU = /^Căn cứ /

/** Số La Mã sang số thường, chỉ cần tới X cho văn bản này. */
const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 }

export function buildToanVan(blocks) {
  // Mốc chia: khối 'QUY ĐỊNH' đứng một mình đánh dấu hết phần Quyết định ban hành.
  const iQuyDinh = blocks.findIndex((b, i) => b.kind === 'p' && b.text === 'QUY ĐỊNH' && i > 5)
  const iPhuLuc = blocks.findIndex((b) => b.kind === 'p' && RE_PHULUC.test(b.text))
  if (iQuyDinh < 0) throw new Error('Không tìm thấy mốc bắt đầu phần Quy định')
  if (iPhuLuc < 0) throw new Error('Không tìm thấy mốc bắt đầu phụ lục')

  return {
    meta: {
      tenVanBan:
        'Quy định về tiêu chí và quy trình đánh giá hiệu quả dự án đầu tư và hiệu quả khai thác, sử dụng tài sản, cơ sở vật chất, trang thiết bị dạy học, trang thiết bị công nghệ thông tin, hạ tầng kỹ thuật và hạ tầng số',
      coQuan: 'Trường Đại học Kiến trúc Đà Nẵng',
      nguon: 'nguon/quy-dinh-danh-gia-hieu-qua-dau-tu-va-su-dung-tai-san-DAU.docx',
      soKhoiGoc: blocks.length,
    },
    quyetDinh: parseQuyetDinh(blocks.slice(0, iQuyDinh)),
    quyDinh: parseQuyDinh(blocks.slice(iQuyDinh, iPhuLuc)),
    phuLuc: parsePhuLuc(blocks.slice(iPhuLuc)),
  }
}

function parseQuyetDinh(blocks) {
  const out = { header: null, tieuDe: [], canCu: [], deNghi: '', dieu: [], noiNhan: null }
  let seenQD = false
  for (const b of blocks) {
    if (b.kind === 'table') {
      if (!out.header) out.header = b.rows
      else out.noiNhan = b.rows
      continue
    }
    const t = b.text
    if (RE_CANCU.test(t)) {
      out.canCu.push(t)
      continue
    }
    if (t.startsWith('Theo đề nghị')) {
      out.deNghi = t
      continue
    }
    if (t === 'QUYẾT ĐỊNH:') {
      seenQD = true
      continue
    }
    const mDieu = RE_DIEU.exec(t)
    if (seenQD && mDieu) {
      out.dieu.push({ so: Number(mDieu[1]), text: t })
      continue
    }
    if (!seenQD && t !== 'QUYẾT ĐỊNH') out.tieuDe.push(t)
  }
  return out
}

function parseQuyDinh(blocks) {
  const out = { tieuDe: [], banHanhKem: '', chuong: [] }
  let chuong = null
  let dieu = null
  let khoan = null
  let choTenChuong = false

  for (const b of blocks) {
    if (b.kind === 'table') continue // bảng quốc hiệu, không phải nội dung
    const t = b.text

    if (choTenChuong) {
      chuong.ten = t
      choTenChuong = false
      continue
    }

    const mChuong = RE_CHUONG.exec(t)
    if (mChuong) {
      chuong = { so: mChuong[1], stt: ROMAN[mChuong[1]], ten: '', dieu: [] }
      out.chuong.push(chuong)
      dieu = null
      khoan = null
      choTenChuong = true
      continue
    }

    const mDieu = RE_DIEU.exec(t)
    if (mDieu && chuong) {
      dieu = { so: Number(mDieu[1]), ten: mDieu[2], chuong: chuong.so, khoan: [] }
      chuong.dieu.push(dieu)
      khoan = null
      continue
    }

    if (!chuong) {
      // Phần đầu: tên quy định và dòng ban hành kèm theo.
      if (t.startsWith('(Ban hành kèm theo')) out.banHanhKem = t
      else if (t !== 'QUY ĐỊNH') out.tieuDe.push(t)
      continue
    }

    const mDiem = RE_DIEM.exec(t)
    if (mDiem && khoan) {
      khoan.diem.push({ ky: mDiem[1], text: t })
      continue
    }

    const mKhoan = RE_KHOAN.exec(t)
    if (mKhoan && dieu) {
      khoan = { so: Number(mKhoan[1]), text: t, diem: [] }
      dieu.khoan.push(khoan)
      continue
    }

    // Đoạn không đánh số nằm trong điều: gắn vào khoản đang mở, hoặc thành khoản 0.
    if (dieu) {
      if (khoan) khoan.text += ' ' + t
      else dieu.khoan.push({ so: 0, text: t, diem: [] })
    }
  }
  return out
}

function parsePhuLuc(blocks) {
  const out = []
  let pl = null
  let choTen = false

  for (const b of blocks) {
    if (b.kind === 'table') {
      if (pl) pl.bang.push({ rows: b.rows })
      continue
    }
    const t = b.text

    const mPL = RE_PHULUC.exec(t)
    if (mPL) {
      pl = { so: mPL[1], stt: ROMAN[mPL[1]], ten: '', ghiChu: [], doan: [], bang: [] }
      out.push(pl)
      choTen = true
      continue
    }
    if (!pl) continue
    if (choTen) {
      pl.ten = t
      choTen = false
      continue
    }
    // Dòng "(Kèm theo Quyết định số ...)" và các dòng ngoặc đơn là ghi chú áp dụng.
    if (t.startsWith('(')) pl.ghiChu.push(t)
    else pl.doan.push(t)
  }
  return out
}

/* --------------------------------- chạy --------------------------------- */

if (process.argv[1] && process.argv[1].endsWith('gen-toanvan.mjs')) {
  const blocks = readDocxBlocks(DOCX)
  const data = buildToanVan(blocks)
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8')

  const soDieu = data.quyDinh.chuong.reduce((n, c) => n + c.dieu.length, 0)
  const soKhoan = data.quyDinh.chuong.reduce(
    (n, c) => n + c.dieu.reduce((m, d) => m + d.khoan.length, 0),
    0,
  )
  const soDiem = data.quyDinh.chuong.reduce(
    (n, c) => n + c.dieu.reduce((m, d) => m + d.khoan.reduce((k, x) => k + x.diem.length, 0), 0),
    0,
  )
  console.log(`Đã sinh ${OUT}`)
  console.log(`  Quyết định: ${data.quyetDinh.canCu.length} căn cứ, ${data.quyetDinh.dieu.length} điều`)
  console.log(`  Quy định:   ${data.quyDinh.chuong.length} chương, ${soDieu} điều, ${soKhoan} khoản, ${soDiem} điểm`)
  console.log(`  Phụ lục:    ${data.phuLuc.length} phụ lục, ${data.phuLuc.reduce((n, p) => n + p.bang.length, 0)} bảng`)
  for (const p of data.phuLuc) {
    console.log(`    ${p.so}. ${p.ten} — ${p.bang.map((b) => b.rows.length + ' dòng').join(', ')}`)
  }
}
