/**
 * Cổng kiểm tầng phán đoán của chỉ tiêu.
 *
 * Tầng chữ đã có check-toanvan canh. Cổng này canh chỗ khác: overlay phải phủ
 * đúng tập mã trong Phụ lục I, không thiếu không thừa, và mọi tham chiếu ra
 * ngoài (số điều, id ngưỡng) phải trỏ tới thứ có thật.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { OVERLAY } from '../data/chi-tieu.ts'
import { NGUONG } from '../data/nguong.ts'

const here = dirname(fileURLToPath(import.meta.url))
const toanVan = JSON.parse(readFileSync(resolve(here, '../data/toan-van.generated.json'), 'utf8'))

const KIEU_HOP_LE = ['caoCangTot', 'thapCangTot', 'khoangToiUu', 'datKhongDat', 'dinhTinh', 'boiCanh']
const LOP_HOP_LE = ['taiChinh', 'duAn', 'taiSan', 'haTangSo']

/** Chỉ tiêu phải là cổng tuân thủ. Nhóm C theo Điều 6, cộng A05 theo Điều 17 khoản 4. */
const PHAI_LA_CONG = new Set(['C01', 'C02', 'C03', 'C04', 'A05'])

export function kiem(overlay, nguong, tv) {
  const loi = []
  const E = (m) => loi.push(m)

  const maPhuLuc = (tv.phuLuc.find((p) => p.so === 'I')?.bang[0]?.rows ?? []).slice(1).map((r) => r[0])
  const maOverlay = overlay.map((o) => o.ma)
  const soDieu = tv.quyDinh.chuong.flatMap((c) => c.dieu).map((d) => d.so)
  const idNguong = new Set(nguong.map((n) => n.id))

  // --- phủ đúng tập mã, hai chiều ---
  const thieu = maPhuLuc.filter((m) => !maOverlay.includes(m))
  const thua = maOverlay.filter((m) => !maPhuLuc.includes(m))
  if (thieu.length) E(`Overlay thiếu ${thieu.length} mã có trong Phụ lục I: ${thieu.join(', ')}`)
  if (thua.length) E(`Overlay có ${thua.length} mã không tồn tại ở Phụ lục I: ${thua.join(', ')}`)
  if (maOverlay.length !== new Set(maOverlay).size) {
    const d = maOverlay.filter((m, i) => maOverlay.indexOf(m) !== i)
    E(`Overlay có mã trùng: ${[...new Set(d)].join(', ')}`)
  }
  // Thứ tự overlay phải khớp Phụ lục I, để đọc song song hai file không lệch dòng.
  if (thieu.length === 0 && thua.length === 0 && maOverlay.join(',') !== maPhuLuc.join(',')) {
    E('Overlay đủ mã nhưng sai thứ tự so với Phụ lục I')
  }

  for (const o of overlay) {
    const p = `Chỉ tiêu ${o.ma}`
    if (!KIEU_HOP_LE.includes(o.kieuCham)) E(`${p}: kieuCham "${o.kieuCham}" không hợp lệ`)
    if (!Array.isArray(o.lop) || o.lop.length === 0) E(`${p}: thiếu lớp đánh giá`)
    for (const l of o.lop ?? []) if (!LOP_HOP_LE.includes(l)) E(`${p}: lớp "${l}" không hợp lệ`)

    if (!Array.isArray(o.dieuLienQuan) || o.dieuLienQuan.length === 0) {
      E(`${p}: không trỏ tới điều nào trong Quy định`)
    }
    for (const d of o.dieuLienQuan ?? []) {
      if (!soDieu.includes(d)) E(`${p}: trỏ tới Điều ${d} không tồn tại`)
    }
    for (const n of o.nguongLienQuan ?? []) {
      if (!idNguong.has(n)) E(`${p}: trỏ tới ngưỡng "${n}" không có trong nguong.ts`)
    }
    if (typeof o.laCongTuanThu !== 'boolean') E(`${p}: thiếu laCongTuanThu`)
    if (o.canhBao !== undefined && o.canhBao.trim().length < 20) {
      E(`${p}: canhBao quá ngắn, không nói được gì`)
    }
  }

  // --- cổng tuân thủ phải đúng tập đã biết ---
  const dangLaCong = new Set(overlay.filter((o) => o.laCongTuanThu).map((o) => o.ma))
  for (const m of PHAI_LA_CONG) if (!dangLaCong.has(m)) E(`${m} phải được đánh dấu là cổng tuân thủ`)
  for (const m of dangLaCong) if (!PHAI_LA_CONG.has(m)) E(`${m} bị đánh dấu cổng tuân thủ ngoài dự kiến`)

  // --- chỉ tiêu bị văn bản cấm quy ra điểm phải mang kiểu 'boiCanh' ---
  // Ba chỗ: Điều 10 khoản 3 (chi phí trên người học), Điều 19 khoản 5 (điện,
  // nước), Điều 24 khoản 1 (số sự cố an ninh). Nếu ai đó đổi chúng sang
  // caoCangTot hay thapCangTot thì web bắt đầu nói ngược lại văn bản.
  const PHAI_BOI_CANH = ['F05', 'A11', 'A12', 'D10']
  for (const m of PHAI_BOI_CANH) {
    const o = overlay.find((x) => x.ma === m)
    if (o && o.kieuCham !== 'boiCanh') {
      E(`${m} phải là 'boiCanh' vì văn bản cấm quy ra điểm tốt xấu, đang là '${o.kieuCham}'`)
    }
  }

  // --- hai luật buộc phải có canhBao ---
  // Luật 1: cột "Cách diễn giải" ở Phụ lục I có câu cấm bắt đầu bằng "Không".
  const rows = (tv.phuLuc.find((p) => p.so === 'I')?.bang[0]?.rows ?? []).slice(1)
  for (const r of rows) {
    const [ma, , , , dienGiai] = r
    if (/(^|\s)Không\s/.test(dienGiai)) {
      const o = overlay.find((x) => x.ma === ma)
      if (o && !o.canhBao) {
        E(`${ma}: diễn giải ở Phụ lục I có câu cấm ("${dienGiai.slice(0, 50)}...") nhưng overlay không có canhBao`)
      }
    }
  }
  // Luật 2: chỉ tiêu gắn với ngưỡng CHƯA PHÊ DUYỆT thì bắt buộc có canhBao.
  // Lệnh cấm của nhiều chỉ tiêu nằm ở thân điều chứ không nằm ở Phụ lục I, ví dụ
  // A03 bị Điều 17 khoản 3 cấm coi càng cao càng tốt nhưng cột diễn giải không
  // nhắc. Luật 1 một mình sẽ để lọt đúng những chỗ nguy hiểm nhất.
  const chuaDuyet = new Set(nguong.filter((n) => n.trangThai === 'mucTieuChuaDuyet').map((n) => n.id))
  for (const o of overlay) {
    const co = (o.nguongLienQuan ?? []).filter((n) => chuaDuyet.has(n))
    if (co.length && !o.canhBao) {
      E(`${o.ma}: gắn với ngưỡng chưa phê duyệt (${co.join(', ')}) nên bắt buộc phải có canhBao`)
    }
  }

  return loi
}

/* ------------------------- ca đối chứng dương ------------------------- */

const CA = [
  ['xoá một mục overlay', (o) => o.pop()],
  ['thêm mã lạ', (o) => o.push({ ...o[0], ma: 'Z99' })],
  ['trỏ tới Điều 99', (o) => (o[0].dieuLienQuan = [99])],
  ['trỏ tới ngưỡng không tồn tại', (o) => (o[0].nguongLienQuan = ['khong-co-that'])],
  ['bỏ cờ cổng tuân thủ của C01', (o) => (o.find((x) => x.ma === 'C01').laCongTuanThu = false)],
  ['gắn cờ cổng tuân thủ cho D01', (o) => (o.find((x) => x.ma === 'D01').laCongTuanThu = true)],
  ['đổi D10 sang càng thấp càng tốt', (o) => (o.find((x) => x.ma === 'D10').kieuCham = 'thapCangTot')],
  ['đổi A11 sang càng thấp càng tốt', (o) => (o.find((x) => x.ma === 'A11').kieuCham = 'thapCangTot')],
  ['xoá cảnh báo của A03', (o) => delete o.find((x) => x.ma === 'A03').canhBao],
  ['đảo thứ tự overlay', (o) => o.reverse()],
  ['dùng lớp không hợp lệ', (o) => (o[0].lop = ['linhTinh'])],
]

function selfTest() {
  console.log(`Ca đối chứng dương — ${CA.length} ca:`)
  let hong = 0
  for (const [ten, pha] of CA) {
    const ban = JSON.parse(JSON.stringify(OVERLAY))
    pha(ban)
    const bat = kiem(ban, NGUONG, toanVan).length > 0
    console.log(`  ${bat ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  ${ten}`)
    if (!bat) hong++
  }
  const sach = kiem(JSON.parse(JSON.stringify(OVERLAY)), NGUONG, toanVan)
  if (sach.length) {
    console.error(`\nFAIL: bản nguyên vẹn lại báo ${sach.length} lỗi, cổng đang báo động giả:`)
    for (const l of sach) console.error('  - ' + l)
    process.exit(1)
  }
  console.log('  BẮT ĐƯỢC  [đối chứng âm] bản nguyên vẹn không báo lỗi')
  if (hong) {
    console.error(`\nFAIL: để lọt ${hong}/${CA.length} ca.`)
    process.exit(1)
  }
  console.log(`  → đủ ${CA.length}/${CA.length} ca dương + 1 ca âm\n`)
}

/* --------------------------------- chạy --------------------------------- */

if (process.argv.includes('--self-test')) selfTest()

const loi = kiem(OVERLAY, NGUONG, toanVan)
if (loi.length) {
  console.error('FAIL check-chi-tieu:')
  for (const l of loi) console.error('  - ' + l)
  process.exit(1)
}
const cong = OVERLAY.filter((o) => o.laCongTuanThu).length
const boiCanh = OVERLAY.filter((o) => o.kieuCham === 'boiCanh').length
console.log(
  `PASS check-chi-tieu: ${OVERLAY.length} chỉ tiêu khớp Phụ lục I, ${cong} cổng tuân thủ, ${boiCanh} chỉ số bối cảnh không chấm điểm`,
)
