/**
 * Cổng soát lỗi của CHÍNH VĂN BẢN GỐC.
 *
 * Khác với các cổng kia: chúng canh xem web có chép đúng văn bản không, còn cổng
 * này canh xem bản thân văn bản có chỗ nào sai sót không. Web không được tự sửa
 * chữ của văn bản đã ký, nhưng phải nói ra để người có thẩm quyền sửa ở bản gốc.
 *
 * Cách hoạt động: danh sách LOI_DA_BIET phải khớp CHÍNH XÁC với những gì dò được.
 *   - Dò ra lỗi mới chưa khai báo  → FAIL, để không ai lặng lẽ bỏ qua.
 *   - Lỗi đã khai báo mà không còn → FAIL, nhắc xoá khỏi danh sách sau khi bản
 *     gốc đã được sửa. Không có luật này thì danh sách sẽ mục dần và trở thành
 *     một tờ giấy không ai tin.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(resolve(here, '../data/toan-van.generated.json'), 'utf8'))

/**
 * Lỗi đã biết trong bản DOCX gốc, đã báo để sửa ở bản gốc.
 * Mỗi mục ghi rõ chỗ nào, sai gì, và sửa thành gì.
 */
const LOI_DA_BIET = [
  {
    o: 'Điều 18 — tên điều',
    sai: 'hànhvà',
    dung: 'hành và',
    ghiChu: 'Thiếu dấu cách trong "xưởng thực hànhvà trang thiết bị dạy học".',
  },
]

/* ------------------------------- phép dò ------------------------------- */

/** Những từ nối hay bị dính vào từ đứng trước trong văn bản hành chính. */
const TU_NOI = [
  'và', 'hoặc', 'của', 'cho', 'theo', 'với', 'trong', 'khi', 'nếu',
  'phải', 'được', 'các', 'những', 'đến', 'từ', 'về', 'trên', 'dưới',
]

function gomCau(d) {
  const ra = []
  for (const c of d.quyDinh.chuong) {
    for (const dd of c.dieu) {
      ra.push({ o: `Điều ${dd.so} — tên điều`, t: dd.ten })
      for (const k of dd.khoan) {
        ra.push({ o: `Điều ${dd.so} khoản ${k.so}`, t: k.text })
        for (const p of k.diem) ra.push({ o: `Điều ${dd.so} khoản ${k.so} điểm ${p.ky}`, t: p.text })
      }
    }
  }
  for (const p of d.phuLuc) {
    for (const b of p.bang) for (const r of b.rows) for (const o of r) ra.push({ o: `Phụ lục ${p.so}`, t: o })
  }
  for (const c of d.quyetDinh.canCu) ra.push({ o: 'Quyết định — căn cứ', t: c })
  for (const dd of d.quyetDinh.dieu) ra.push({ o: `Quyết định — Điều ${dd.so}`, t: dd.text })
  return ra
}

function do_(cau) {
  const thay = []
  for (const { o, t } of cau) {
    // 1. Từ nối dính vào từ đứng trước.
    for (const w of TU_NOI) {
      const re = new RegExp(`[a-zà-ỹ]{2,}${w}(?=[\\s,.;:)]|$)`, 'g')
      let m
      while ((m = re.exec(t)) !== null) thay.push({ o, sai: m[0], loai: 'dính chữ' })
    }
    // 2. Khoảng trắng đứng trước dấu câu.
    if (/\s[,;.](?=\s|$)/.test(t)) thay.push({ o, sai: 'khoảng trắng trước dấu câu', loai: 'dấu câu' })
    // 3. Hai dấu cách liền nhau. Bộ bóc đã chuẩn hoá nên còn thì là bất thường.
    if (/ {2,}/.test(t)) thay.push({ o, sai: 'hai dấu cách liền', loai: 'khoảng trắng' })
  }
  return thay
}

/* --------------------------------- chạy --------------------------------- */

const cau = gomCau(data)
const thay = do_(cau)

// Đối chứng cho chính phép dò: cố tình đưa vào một câu hỏng, phải dò ra.
if (process.argv.includes('--self-test')) {
  const gia = [{ o: 'ca thử', t: 'Đây là câu thửvà có lỗi dính chữ.' }]
  const batDuoc = do_(gia).length > 0
  const sach = do_([{ o: 'ca thử', t: 'Đây là câu sạch và không có lỗi.' }]).length === 0
  console.log(`  ${batDuoc ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  câu cố tình dính chữ "thửvà"`)
  console.log(`  ${sach ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  [đối chứng âm] câu sạch không bị báo lỗi`)
  if (!batDuoc || !sach) {
    console.error('\nFAIL: phép dò không phân biệt được câu hỏng với câu sạch.')
    process.exit(1)
  }
  console.log('')
}

const loi = []

// Lỗi dò ra mà chưa khai báo.
for (const t of thay) {
  if (!LOI_DA_BIET.some((l) => l.o === t.o && t.sai.includes(l.sai))) {
    loi.push(`Lỗi MỚI trong văn bản gốc, chưa khai báo — ${t.o}: "${t.sai}" (${t.loai})`)
  }
}
// Lỗi đã khai báo mà không còn dò ra.
for (const l of LOI_DA_BIET) {
  if (!thay.some((t) => t.o === l.o && t.sai.includes(l.sai))) {
    loi.push(
      `Lỗi đã khai báo nhưng KHÔNG còn trong văn bản — ${l.o}: "${l.sai}". ` +
        `Bản gốc có lẽ đã được sửa; xoá mục này khỏi LOI_DA_BIET trong scripts/check-nguon.mjs.`,
    )
  }
}

if (loi.length) {
  console.error('FAIL check-nguon:')
  for (const l of loi) console.error('  - ' + l)
  process.exit(1)
}

console.log(
  `PASS check-nguon: soát ${cau.length} câu của văn bản gốc, ${LOI_DA_BIET.length} lỗi đã biết và đã khai báo:`,
)
for (const l of LOI_DA_BIET) {
  console.log(`  ${l.o}: "${l.sai}" → nên sửa thành "${l.dung}". ${l.ghiChu}`)
}
