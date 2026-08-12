/**
 * Cổng kiểm ngưỡng. Đây là cổng quan trọng nhất của repo này.
 *
 * Quy định viết ra phần lớn để ngăn việc lấy một con số đẹp rồi coi như chuẩn.
 * Nếu web hiển thị 99,5% hay 70% - 85% mà không nói rõ chúng CHƯA được phê
 * duyệt, web đã nói ngược lại văn bản mình đang phổ biến.
 *
 * Ba tầng kiểm:
 *   1. PHỦ KÍN, fail-closed — mọi tỷ lệ phần trăm xuất hiện trong thân Quy định
 *      phải được một mục trong nguong.ts nhận. Thêm một con số mới vào văn bản
 *      mà quên khai báo trạng thái thì build hỏng, không im lặng đi qua.
 *   2. TRÍCH DẪN THẬT — mỗi mục phải dẫn được một đoạn ít nhất 30 ký tự có mặt
 *      nguyên văn trong văn bản. Chặn việc bịa lý do cho một trạng thái.
 *   3. THAM CHIẾU ĐÚNG — số điều có thật, mã chỉ tiêu có thật, ngưỡng chưa
 *      duyệt phải ghi thẩm quyền phê duyệt.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { NGUONG } from '../data/nguong.ts'
import { OVERLAY } from '../data/chi-tieu.ts'

const here = dirname(fileURLToPath(import.meta.url))
const toanVan = JSON.parse(readFileSync(resolve(here, '../data/toan-van.generated.json'), 'utf8'))

const TRANG_THAI_HOP_LE = ['phapLy', 'quyChe', 'mucTieuChuaDuyet', 'mucTieuDaDuyet']

/** Gom toàn bộ chữ của một văn bản để tra cứu trích dẫn. */
function gomChu(tv) {
  const phan = []
  for (const c of tv.quyDinh.chuong) {
    for (const d of c.dieu) {
      phan.push(`Điều ${d.so}. ${d.ten}`)
      for (const k of d.khoan) {
        phan.push(k.text)
        for (const p of k.diem) phan.push(p.text)
      }
    }
  }
  for (const p of tv.phuLuc) {
    phan.push(...p.ghiChu, ...p.doan)
    for (const b of p.bang) for (const r of b.rows) phan.push(...r)
  }
  phan.push(...tv.quyetDinh.canCu, ...tv.quyetDinh.dieu.map((d) => d.text))
  return phan.join('\n')
}

/**
 * Thân Quy định, kèm số điều của từng câu.
 *
 * Phải giữ số điều chứ không gom thành một khối chữ. Bản đầu của cổng này chỉ
 * đối chiếu con số rời: xoá hẳn mục 70% - 85% của Điều 17 mà cổng vẫn báo sạch,
 * vì "70" được mục 60% - 70% của Điều 10 nhận hộ và "85" được mục 85% của Điều
 * 23 nhận hộ. Con số trùng nhau nhưng nói về hai thứ không liên quan gì.
 */
function thanQuyDinh(tv) {
  const phan = []
  for (const c of tv.quyDinh.chuong) {
    for (const d of c.dieu) {
      for (const k of d.khoan) {
        phan.push({ dieu: d.so, text: k.text })
        for (const p of k.diem) phan.push({ dieu: d.so, text: p.text })
      }
    }
  }
  return phan
}

/**
 * Rút các tỷ lệ phần trăm là NGƯỠNG, bỏ qua phần trăm nằm trong công thức.
 * "× 100%" ở cuối một công thức chỉ là phép quy đổi đơn vị, không phải ngưỡng.
 */
function rutTyLe(cau) {
  const bo = cau.replace(/×\s*100\s*%/g, ' ')
  const ra = []
  const re = /(\d+(?:[,.]\d+)?)\s*%/g
  let m
  while ((m = re.exec(bo)) !== null) ra.push(m[1].replace('.', ','))
  return ra
}

export function kiem(nguong, overlay, tv) {
  const loi = []
  const E = (m) => loi.push(m)

  const chu = gomChu(tv)
  const soDieu = new Set(tv.quyDinh.chuong.flatMap((c) => c.dieu).map((d) => d.so))
  const maChiTieu = new Set(overlay.map((o) => o.ma))
  const id = new Set()

  for (const n of nguong) {
    const p = `Ngưỡng "${n.id}"`
    if (id.has(n.id)) E(`${p}: id trùng`)
    id.add(n.id)

    if (!TRANG_THAI_HOP_LE.includes(n.trangThai)) E(`${p}: trạng thái "${n.trangThai}" không hợp lệ`)
    if (!n.giaTri?.trim()) E(`${p}: thiếu giá trị`)
    if (!n.apDungCho?.trim()) E(`${p}: thiếu mô tả áp dụng cho cái gì`)
    if (!soDieu.has(n.dieu)) E(`${p}: trỏ tới Điều ${n.dieu} không tồn tại`)
    for (const m of n.chiTieu ?? []) {
      if (!maChiTieu.has(m)) E(`${p}: trỏ tới chỉ tiêu "${m}" không tồn tại`)
    }

    // Ngưỡng chưa duyệt PHẢI ghi ai có thẩm quyền, nếu không thì người đọc
    // biết nó chưa duyệt mà không biết phải đi hỏi ai, tức là bế tắc.
    if (n.trangThai === 'mucTieuChuaDuyet' && !n.thamQuyen?.trim()) {
      E(`${p}: là mục tiêu chưa phê duyệt nhưng không ghi thẩm quyền phê duyệt`)
    }
    // Ngưỡng pháp lý phải chỉ ra văn bản pháp luật hoặc điều khoản làm căn cứ.
    if (n.trangThai === 'phapLy' && !n.canCuNgoai?.trim() && !n.dieu) {
      E(`${p}: khai là bắt buộc theo pháp luật nhưng không có căn cứ ngoài`)
    }

    // --- trích dẫn phải có thật ---
    if (!n.trichDan?.trim()) {
      E(`${p}: thiếu trích dẫn`)
    } else {
      const manh = n.trichDan
        .split(/\.{3}|…/)
        .flatMap((s) => s.split(/\s\(/))
        .map((s) => s.replace(/^[^:]{0,40}:\s*/, '').trim())
        .filter((s) => s.length >= 30)
      if (manh.length === 0) {
        E(`${p}: trích dẫn không có đoạn nào dài đủ 30 ký tự để đối chiếu`)
      } else if (!manh.some((s) => chu.includes(s))) {
        E(
          `${p}: trích dẫn không có trong văn bản. Đoạn dài nhất đã thử:\n      "${
            manh.sort((a, b) => b.length - a.length)[0]
          }"`,
        )
      }
    }
  }

  // --- tầng 1: phủ kín theo từng điều, fail-closed ---
  // Khoá là "điều + con số", không phải con số. Một mục ở nguong.ts chỉ nhận
  // được tỷ lệ nằm trong đúng điều mà nó khai.
  const daPhu = new Set()
  for (const n of nguong) for (const t of rutTyLe(n.giaTri)) daPhu.add(`${n.dieu}|${t}`)

  const thieu = new Map()
  for (const { dieu, text } of thanQuyDinh(tv)) {
    for (const t of rutTyLe(text)) {
      const khoa = `${dieu}|${t}`
      if (!daPhu.has(khoa) && !thieu.has(khoa)) thieu.set(khoa, { dieu, t, cau: text.slice(0, 110) })
    }
  }
  for (const { dieu, t, cau } of thieu.values()) {
    E(
      `Điều ${dieu} có tỷ lệ ${t}% nhưng chưa mục nào ở nguong.ts nhận cho điều này:\n      "${cau}..."`,
    )
  }

  return loi
}

/* ------------------------- ca đối chứng dương ------------------------- */

const CA = [
  ['xoá mục ngưỡng 70-85%', (n) => n.splice(n.findIndex((x) => x.id === 'su-dung-phong-70-85'), 1)],
  ['xoá mục ngưỡng 99,5%', (n) => n.splice(n.findIndex((x) => x.id === 'uptime-99-5'), 1)],
  ['nâng 70-85% thành chuẩn pháp lý mà không có căn cứ', (n) => {
    const x = n.find((y) => y.id === 'su-dung-phong-70-85')
    x.trangThai = 'phapLy'
    delete x.canCuNgoai
    x.dieu = 0
  }],
  ['bỏ thẩm quyền của một ngưỡng chưa duyệt', (n) => delete n.find((x) => x.id === 'uptime-99-5').thamQuyen],
  ['bịa trích dẫn', (n) => (n[0].trichDan = 'Câu này hoàn toàn không có trong văn bản gốc của Trường.')],
  ['rút gọn trích dẫn còn quá ngắn', (n) => (n[0].trichDan = 'Ngắn quá.')],
  ['trỏ tới Điều 99', (n) => (n[0].dieu = 99)],
  ['trỏ tới chỉ tiêu không tồn tại', (n) => (n[0].chiTieu = ['Z99'])],
  ['id trùng', (n) => n.push({ ...n[0] })],
  ['trạng thái lạ', (n) => (n[0].trangThai = 'khoiPhaiDuyet')],
]

/** Ca đặc biệt: thêm một tỷ lệ mới vào VĂN BẢN mà không khai báo ngưỡng. */
function caThemTyLeVaoVanBan() {
  const tv = JSON.parse(JSON.stringify(toanVan))
  tv.quyDinh.chuong[0].dieu[0].khoan[0].text += ' Mục tiêu là 42% trong năm đầu.'
  return kiem(NGUONG, OVERLAY, tv).length > 0
}

function selfTest() {
  console.log(`Ca đối chứng dương — ${CA.length + 1} ca:`)
  let hong = 0
  for (const [ten, pha] of CA) {
    const ban = JSON.parse(JSON.stringify(NGUONG))
    pha(ban)
    const bat = kiem(ban, OVERLAY, toanVan).length > 0
    console.log(`  ${bat ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  ${ten}`)
    if (!bat) hong++
  }
  const batThem = caThemTyLeVaoVanBan()
  console.log(`  ${batThem ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  thêm tỷ lệ 42% vào văn bản mà không khai báo`)
  if (!batThem) hong++

  const sach = kiem(JSON.parse(JSON.stringify(NGUONG)), OVERLAY, toanVan)
  if (sach.length) {
    console.error(`\nFAIL: bản nguyên vẹn lại báo ${sach.length} lỗi, cổng đang báo động giả:`)
    for (const l of sach) console.error('  - ' + l)
    process.exit(1)
  }
  console.log('  BẮT ĐƯỢC  [đối chứng âm] bản nguyên vẹn không báo lỗi')
  if (hong) {
    console.error(`\nFAIL: để lọt ${hong}/${CA.length + 1} ca.`)
    process.exit(1)
  }
  console.log(`  → đủ ${CA.length + 1}/${CA.length + 1} ca dương + 1 ca âm\n`)
}

/* --------------------------------- chạy --------------------------------- */

if (process.argv.includes('--self-test')) selfTest()

const loi = kiem(NGUONG, OVERLAY, toanVan)
if (loi.length) {
  console.error('FAIL check-nguong:')
  for (const l of loi) console.error('  - ' + l)
  process.exit(1)
}
const dem = (t) => NGUONG.filter((n) => n.trangThai === t).length
console.log(
  `PASS check-nguong: ${NGUONG.length} ngưỡng — ${dem('phapLy')} pháp lý, ${dem('quyChe')} theo Quy định, ` +
    `${dem('mucTieuChuaDuyet')} chưa phê duyệt, ${dem('mucTieuDaDuyet')} đã phê duyệt. Mọi tỷ lệ trong thân văn bản đều đã có nhãn.`,
)
