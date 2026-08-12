/**
 * Cổng kiểm toàn văn.
 *
 * Kiểm hai việc khác nhau, đừng gộp:
 *   1. TRÔI DỮ LIỆU — data/toan-van.generated.json phải trùng khít với bản bóc
 *      lại từ DOCX ngay lúc này. Bắt được cả trường hợp ai đó sửa tay vào JSON.
 *   2. CẤU TRÚC — đủ chương, điều liên tục, khoản đánh số liên tục, đủ phụ lục,
 *      đủ mã chỉ tiêu đúng định dạng.
 *
 * Bản thân phép kiểm cũng phải được kiểm. Chạy với --self-test để cố tình làm
 * hỏng dữ liệu theo 6 kiểu rồi xác nhận cổng bắt được cả 6. Một cổng luôn báo
 * PASS thì vô dụng, và nó trông y hệt một cổng tốt.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readDocxBlocks } from './lib/docx.mjs'
import { buildToanVan, DOCX } from './gen-toanvan.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const JSON_PATH = resolve(here, '../data/toan-van.generated.json')

const SO_CHUONG = 7
const SO_DIEU = 35
const SO_PHU_LUC = 4
const SO_CHI_TIEU = 47
const NHOM_MA = { C: 4, F: 5, I: 9, A: 14, D: 15 }

/** Trả về mảng lỗi. Rỗng nghĩa là đạt. */
export function kiemToanVan(data, tuoi) {
  const loi = []
  const E = (m) => loi.push(m)

  // --- 1. Không trôi so với DOCX ---
  if (tuoi) {
    const a = JSON.stringify(data)
    const b = JSON.stringify(tuoi)
    if (a !== b) {
      // Chỉ ra chỗ lệch đầu tiên để sửa được, không chỉ báo "khác nhau".
      let i = 0
      while (i < a.length && i < b.length && a[i] === b[i]) i++
      E(
        `Dữ liệu đã trôi khỏi DOCX gốc. Lệch từ ký tự ${i}:\n` +
          `      JSON: ...${a.slice(Math.max(0, i - 60), i + 60)}...\n` +
          `      DOCX: ...${b.slice(Math.max(0, i - 60), i + 60)}...`,
      )
    }
  }

  // --- 2. Quyết định ban hành ---
  if (data.quyetDinh.dieu.length !== 4) {
    E(`Quyết định ban hành phải có 4 điều, đang có ${data.quyetDinh.dieu.length}`)
  }
  if (data.quyetDinh.canCu.length < 10) {
    E(`Căn cứ pháp lý quá ít: ${data.quyetDinh.canCu.length}`)
  }
  if (!data.quyetDinh.header || !data.quyetDinh.noiNhan) {
    E('Thiếu bảng quốc hiệu hoặc bảng nơi nhận của Quyết định')
  }

  // --- 3. Chương và điều ---
  const chuong = data.quyDinh.chuong
  if (chuong.length !== SO_CHUONG) E(`Phải có ${SO_CHUONG} chương, đang có ${chuong.length}`)
  for (const c of chuong) {
    if (!c.ten) E(`Chương ${c.so} thiếu tên`)
  }

  const dieu = chuong.flatMap((c) => c.dieu)
  if (dieu.length !== SO_DIEU) E(`Phải có ${SO_DIEU} điều, đang có ${dieu.length}`)
  dieu.forEach((d, i) => {
    if (d.so !== i + 1) E(`Điều không liên tục: vị trí ${i + 1} mang số ${d.so}`)
    if (!d.ten) E(`Điều ${d.so} thiếu tên`)
    if (d.khoan.length === 0) E(`Điều ${d.so} không có khoản nào`)
    d.khoan.forEach((k, j) => {
      if (k.so !== j + 1) E(`Điều ${d.so} khoản không liên tục: vị trí ${j + 1} mang số ${k.so}`)
      if (!k.text || k.text.length < 10) E(`Điều ${d.so} khoản ${k.so} rỗng hoặc quá ngắn`)
    })
    // Điểm trong một khoản phải theo thứ tự a, b, c...
    d.khoan.forEach((k) => {
      k.diem.forEach((p, j) => {
        const mong = 'abcdđeghiklmn'[j]
        if (p.ky !== mong) E(`Điều ${d.so} khoản ${k.so}: điểm thứ ${j + 1} là "${p.ky}", chờ "${mong}"`)
      })
    })
  })

  // --- 4. Phụ lục ---
  const pl = data.phuLuc
  if (pl.length !== SO_PHU_LUC) E(`Phải có ${SO_PHU_LUC} phụ lục, đang có ${pl.length}`)
  const soPL = pl.map((p) => p.so).join(',')
  if (soPL !== 'I,II,III,IV') E(`Số hiệu phụ lục sai: ${soPL}`)
  for (const p of pl) {
    if (!p.ten) E(`Phụ lục ${p.so} thiếu tên`)
    if (p.bang.length === 0) E(`Phụ lục ${p.so} không có bảng nào`)
  }

  // --- 5. Từ điển chỉ tiêu ở Phụ lục I ---
  const bang = pl[0]?.bang[0]?.rows ?? []
  const hang = bang.slice(1)
  if (hang.length !== SO_CHI_TIEU) {
    E(`Phụ lục I phải có ${SO_CHI_TIEU} chỉ tiêu, đang có ${hang.length}`)
  }
  const dem = {}
  const daThay = new Set()
  for (const r of hang) {
    const ma = r[0]
    if (!/^[CFIAD]\d{2}$/.test(ma)) {
      E(`Mã chỉ tiêu sai định dạng: "${ma}"`)
      continue
    }
    if (daThay.has(ma)) E(`Mã chỉ tiêu trùng: ${ma}`)
    daThay.add(ma)
    dem[ma[0]] = (dem[ma[0]] ?? 0) + 1
    if (r.length !== 5) E(`Chỉ tiêu ${ma} có ${r.length} cột, phải có 5`)
    r.forEach((o, i) => {
      if (!o || !o.trim()) E(`Chỉ tiêu ${ma} rỗng ở cột ${i + 1}`)
    })
  }
  for (const [n, k] of Object.entries(NHOM_MA)) {
    if (dem[n] !== k) E(`Nhóm ${n} phải có ${k} chỉ tiêu, đang có ${dem[n] ?? 0}`)
  }
  // Số thứ tự trong mỗi nhóm phải chạy liên tục từ 01.
  for (const n of Object.keys(NHOM_MA)) {
    const stt = [...daThay].filter((m) => m[0] === n).map((m) => Number(m.slice(1))).sort((a, b) => a - b)
    stt.forEach((v, i) => {
      if (v !== i + 1) E(`Nhóm ${n} thiếu hoặc nhảy số ở ${n}${String(i + 1).padStart(2, '0')}`)
    })
  }

  // --- 6. Phụ lục II, III, IV đúng số dòng đã biết ---
  const cho = [
    ['II', 0, 6, 'bảng 5 kiểu chấm điểm'],
    ['II', 1, 4, 'ma trận nhóm trọng số'],
    ['II', 2, 8, 'thang xếp loại'],
    ['III', 0, 9, 'quy trình 8 bước'],
    ['IV', 0, 6, 'ma trận lấy mẫu'],
  ]
  for (const [so, idx, dong, ten] of cho) {
    const p = pl.find((x) => x.so === so)
    const co = p?.bang[idx]?.rows.length
    if (co !== dong) E(`Phụ lục ${so}, ${ten}: chờ ${dong} dòng, đang có ${co}`)
  }

  return loi
}

/* ------------------------- ca đối chứng dương ------------------------- */

/**
 * Mỗi ca khai báo TẦNG NÀO phải bắt được nó:
 *   'cautruc' — tầng bất biến cấu trúc phải bắt, kể cả khi không có DOCX để đối chứng
 *   'troi'    — chỉ tầng đối chứng DOCX bắt được, vì cấu trúc vẫn hợp lệ
 *
 * Phân biệt này quan trọng. Nếu để mọi ca đều "được bắt" nhờ tầng đối chứng DOCX
 * thì bài kiểm không chứng minh được tầng cấu trúc có hoạt động hay không, và
 * một tầng cấu trúc chết vẫn cho ra bảng kết quả toàn PASS.
 */
const CA_HONG = [
  ['xoá một chương', 'cautruc', (d) => d.quyDinh.chuong.pop()],
  ['xoá một khoản giữa điều', 'cautruc', (d) => d.quyDinh.chuong[0].dieu[0].khoan.splice(1, 1)],
  ['xoá một chỉ tiêu', 'cautruc', (d) => d.phuLuc[0].bang[0].rows.pop()],
  ['làm trùng mã chỉ tiêu', 'cautruc', (d) => {
    d.phuLuc[0].bang[0].rows[2][0] = d.phuLuc[0].bang[0].rows[1][0]
  }],
  ['bỏ trống một ô công thức', 'cautruc', (d) => {
    d.phuLuc[0].bang[0].rows[5][2] = ''
  }],
  ['xoá một dòng thang xếp loại', 'cautruc', (d) => {
    d.phuLuc.find((p) => p.so === 'II').bang[2].rows.pop()
  }],
  ['đảo thứ tự điểm a) b)', 'cautruc', (d) => {
    const k = d.quyDinh.chuong
      .flatMap((c) => c.dieu)
      .flatMap((x) => x.khoan)
      .find((x) => x.diem.length >= 2)
    k.diem.reverse()
  }],
  ['sửa một chữ trong khoản', 'troi', (d) => {
    d.quyDinh.chuong[0].dieu[0].khoan[0].text += ' x'
  }],
  ['sửa một chữ trong diễn giải chỉ tiêu', 'troi', (d) => {
    d.phuLuc[0].bang[0].rows[3][4] = d.phuLuc[0].bang[0].rows[3][4].replace('.', '!')
  }],
  ['đổi một căn cứ pháp lý', 'troi', (d) => {
    d.quyetDinh.canCu[1] = d.quyetDinh.canCu[1].replace('2025', '2024')
  }],
]

function selfTest(goc, tuoi) {
  console.log(`Ca đối chứng dương — ${CA_HONG.length} ca cố tình làm hỏng:`)
  let hong = 0
  for (const [ten, tang, pha] of CA_HONG) {
    const ban = JSON.parse(JSON.stringify(goc))
    pha(ban)
    const chiCauTruc = kiemToanVan(ban, null).length > 0
    const dayDu = kiemToanVan(ban, tuoi).length > 0

    // Cổng đầy đủ luôn phải bắt. Ngoài ra ca 'cautruc' phải bị tầng cấu trúc bắt riêng.
    const dat = dayDu && (tang === 'troi' || chiCauTruc)
    const nhan = tang === 'cautruc' ? 'cấu trúc' : 'đối chứng DOCX'
    console.log(`  ${dat ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  [${nhan}] ${ten}`)
    if (!dat) hong++
  }
  // Kiểm chính bài kiểm: dữ liệu chưa sửa gì thì phải KHÔNG có lỗi, nếu không thì
  // cổng đang báo động giả và mọi ca ở trên đều "đạt" một cách vô nghĩa.
  const sach = kiemToanVan(JSON.parse(JSON.stringify(goc)), tuoi)
  if (sach.length > 0) {
    console.error(`\nFAIL: bản chưa sửa gì lại báo ${sach.length} lỗi, cổng đang báo động giả.`)
    process.exit(1)
  }
  console.log('  BẮT ĐƯỢC  [đối chứng âm] bản nguyên vẹn không báo lỗi')
  if (hong > 0) {
    console.error(`\nFAIL: cổng để lọt ${hong}/${CA_HONG.length} ca. Phép kiểm này không dùng được.`)
    process.exit(1)
  }
  console.log(`  → đủ ${CA_HONG.length}/${CA_HONG.length} ca dương + 1 ca âm\n`)
}

/* --------------------------------- chạy --------------------------------- */

const data = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
const tuoi = buildToanVan(readDocxBlocks(DOCX))

if (process.argv.includes('--self-test')) selfTest(data, tuoi)

const loi = kiemToanVan(data, tuoi)
if (loi.length) {
  console.error('FAIL check-toanvan:')
  for (const l of loi) console.error('  - ' + l)
  process.exit(1)
}
const soKhoan = data.quyDinh.chuong.reduce((n, c) => n + c.dieu.reduce((m, d) => m + d.khoan.length, 0), 0)
console.log(
  `PASS check-toanvan: ${SO_CHUONG} chương / ${SO_DIEU} điều / ${soKhoan} khoản / ${SO_PHU_LUC} phụ lục / ${SO_CHI_TIEU} chỉ tiêu, khớp DOCX gốc`,
)
