/**
 * Cổng kiểm liên kết, chạy trên HTML ĐÃ DỰNG chứ không trên mã nguồn.
 *
 * Lý do không đọc mã nguồn: liên kết được sinh động từ dữ liệu, ví dụ neo
 * #dieu-{n} và đường /chi-tieu/{ma}. Đọc mã nguồn chỉ thấy khuôn mẫu chứ không
 * thấy giá trị thật, nên một mã chỉ tiêu sai vẫn trông đúng khuôn. Phải đọc
 * đúng thứ trình duyệt nhận được.
 *
 * Chạy sau `next build`: node scripts/check-links.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { MOI_DUONG, NHOM_NAV } from '../components/dieu-huong.ts'

const here = dirname(fileURLToPath(import.meta.url))
const goc = resolve(here, '..')
const thuMuc = resolve(goc, '.next/server/app')

if (!existsSync(thuMuc)) {
  console.error('FAIL check-links: chưa có bản dựng. Chạy `npm run build` trước.')
  process.exit(1)
}

/** Gom mọi file .html trong .next/server/app, ánh xạ về đường dẫn route. */
function gomHtml(dir, tienTo = '') {
  const ra = []
  for (const ten of readdirSync(dir)) {
    const duong = join(dir, ten)
    if (statSync(duong).isDirectory()) {
      ra.push(...gomHtml(duong, `${tienTo}/${ten}`))
    } else if (ten.endsWith('.html')) {
      const route = ten === 'index.html' ? tienTo || '/' : `${tienTo}/${ten.slice(0, -5)}`
      ra.push({ route, duong })
    }
  }
  return ra
}

const trang = gomHtml(thuMuc)
if (trang.length === 0) {
  console.error('FAIL check-links: không tìm thấy file HTML nào trong bản dựng.')
  process.exit(1)
}

// Tập route có thật, chuẩn hoá bỏ dấu / cuối.
const coThat = new Set(trang.map((t) => (t.route === '/' ? '/' : t.route.replace(/\/$/, ''))))

// Tập id có trong từng trang, để kiểm neo #...
const idTheoTrang = new Map()
for (const t of trang) {
  const html = readFileSync(t.duong, 'utf8')
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  idTheoTrang.set(t.route === '/' ? '/' : t.route.replace(/\/$/, ''), ids)
}

const loi = []
let soLink = 0
let soNeo = 0
let soTaiNguyen = 0

for (const t of trang) {
  const route = t.route === '/' ? '/' : t.route.replace(/\/$/, '')
  const html = readFileSync(t.duong, 'utf8')

  for (const m of html.matchAll(/href="(\/[^"#]*)?(#[^"]*)?"/g)) {
    const duong = m[1]
    const neo = m[2]
    if (!duong && !neo) continue

    // Neo trong cùng trang.
    if (!duong && neo) {
      soNeo++
      const id = decodeURIComponent(neo.slice(1))
      if (id && !idTheoTrang.get(route)?.has(id)) {
        loi.push(`${route}: neo "${neo}" không có phần tử id="${id}" trong chính trang này`)
      }
      continue
    }

    if (!duong) continue

    // Bỏ phần truy vấn. Next gắn chuỗi băm vào sau tên tệp biểu tượng
    // ("/favicon.ico?favicon.abc.ico") để ép trình duyệt nạp lại khi tệp đổi.
    const sach = duong.split('?')[0]

    // Tài nguyên tĩnh do Next sinh ra không phải route. Kiểm chúng theo cách
    // khác: file có nằm trên đĩa không. Gộp chung với route sẽ báo động giả
    // hàng loạt và làm người ta tắt luôn cổng này.
    if (sach.startsWith('/_next/')) {
      soTaiNguyen++
      const tep = resolve(goc, '.next', sach.slice('/_next/'.length))
      if (!existsSync(tep)) loi.push(`${route}: tài nguyên "${sach}" không có trên đĩa`)
      continue
    }

    // Tệp có phần mở rộng là tài nguyên, không phải trang. Next phục vụ chúng
    // từ app/ (biểu tượng) hoặc public/ (ảnh, tệp tải về).
    if (/\.[a-z0-9]{2,5}$/i.test(sach)) {
      soTaiNguyen++
      const ten = sach.slice(1)
      if (!existsSync(resolve(goc, 'app', ten)) && !existsSync(resolve(goc, 'public', ten))) {
        loi.push(`${route}: tài nguyên "${sach}" không có trong app/ hay public/`)
      }
      continue
    }

    const dich = sach === '/' ? '/' : sach.replace(/\/$/, '')
    soLink++

    if (!coThat.has(dich)) {
      loi.push(`${route}: liên kết tới "${duong}" nhưng bản dựng không có route đó`)
      continue
    }
    if (neo) {
      soNeo++
      const id = decodeURIComponent(neo.slice(1))
      if (id && !idTheoTrang.get(dich)?.has(id)) {
        loi.push(`${route}: liên kết "${duong}${neo}" nhưng trang đích không có id="${id}"`)
      }
    }
  }
}

/* ------------------------ menu phủ hết trang ------------------------ */

// Mỗi mục trong menu phải trỏ tới route có thật.
for (const d of MOI_DUONG) {
  if (!coThat.has(d)) loi.push(`Menu điều hướng có mục "${d}" nhưng bản dựng không có route đó`)
}

// Và ngược lại: mỗi trang nội dung phải nằm trong menu, nếu không nó thành trang
// mồ côi chỉ tới được bằng cách gõ tay đường dẫn. Miễn trang chủ (vào bằng logo)
// và các trang chi tiết chỉ tiêu (vào từ bảng ở /chi-tieu).
const MIEN = (r) => r === '/' || r.startsWith('/_') || r.startsWith('/chi-tieu/')
const trongMenu = new Set(MOI_DUONG)
for (const r of coThat) {
  if (!MIEN(r) && !trongMenu.has(r)) {
    loi.push(`Route "${r}" có trong bản dựng nhưng không có lối vào nào trong menu điều hướng`)
  }
}

// Mỗi nhóm phải có mục, và không mục nào nằm ở hai nhóm.
const daGap = new Set()
for (const n of NHOM_NAV) {
  if (n.muc.length === 0) loi.push(`Nhóm menu "${n.ten}" rỗng`)
  for (const m of n.muc) {
    if (daGap.has(m.href)) loi.push(`Mục "${m.href}" xuất hiện ở nhiều nhóm menu`)
    daGap.add(m.href)
    if (!m.mo || m.mo.length < 10) loi.push(`Mục menu "${m.href}" thiếu dòng mô tả`)
  }
}

/* --------------------------- biểu tượng trang --------------------------- */

// Biểu tượng là thứ dễ hỏng trong im lặng nhất: thiếu nó trang vẫn chạy, ảnh
// chụp vẫn đẹp, chỉ có ô tab hiện một tờ giấy trắng mà không ai để ý.
{
  const ico = resolve(goc, 'app/favicon.ico')
  if (!existsSync(ico)) {
    loi.push('Thiếu app/favicon.ico. Sinh lại bằng "npm run favicon".')
  } else {
    const b = readFileSync(ico)
    if (b.readUInt16LE(0) !== 0 || b.readUInt16LE(2) !== 1) {
      loi.push('app/favicon.ico không phải tệp ICO hợp lệ')
    } else {
      const n = b.readUInt16LE(4)
      const co = []
      for (let i = 0; i < n; i++) {
        const o = 6 + i * 16
        co.push(b.readUInt8(o) || 256)
        const kichThuoc = b.readUInt32LE(o + 8)
        const viTri = b.readUInt32LE(o + 12)
        if (viTri + kichThuoc > b.length) {
          loi.push(`favicon.ico: ảnh thứ ${i + 1} trỏ ra ngoài tệp`)
        }
      }
      // 16 và 32 là hai cỡ trình duyệt thật sự dùng cho ô tab.
      for (const c of [16, 32]) {
        if (!co.includes(c)) loi.push(`favicon.ico thiếu cỡ ${c}px, đây là cỡ trình duyệt dùng cho ô tab`)
      }
    }
  }
  if (!existsSync(resolve(goc, 'app/apple-icon.png'))) {
    loi.push('Thiếu app/apple-icon.png cho iOS. Sinh lại bằng "npm run favicon".')
  }

  // Trang phải khai báo biểu tượng, không chỉ có tệp nằm đó.
  const htmlChu = readFileSync(trang.find((t) => t.route === '/' || t.route === '').duong, 'utf8')
  if (!/<link[^>]+rel="icon"/.test(htmlChu)) {
    loi.push('Trang chủ không khai báo <link rel="icon">')
  }
  if (!/<link[^>]+rel="apple-touch-icon"/.test(htmlChu)) {
    loi.push('Trang chủ không khai báo <link rel="apple-touch-icon">')
  }
}

/* ------------------------- ca đối chứng dương ------------------------- */

if (process.argv.includes('--self-test')) {
  console.log('Ca đối chứng dương:')
  const gia = '/trang-khong-ton-tai'
  console.log(`  ${!coThat.has(gia) ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  route bịa "${gia}" không có trong tập route`)
  const trangDau = [...idTheoTrang.keys()][0]
  const idGia = 'id-khong-ton-tai-xyz'
  const batId = !idTheoTrang.get(trangDau)?.has(idGia)
  console.log(`  ${batId ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  id bịa "${idGia}" không có trong ${trangDau}`)
  // Đối chứng âm: một id có thật phải được nhận ra, nếu không thì phép dò id đang rỗng.
  const idThat = [...(idTheoTrang.get('/toan-van') ?? [])].find((x) => x.startsWith('dieu-'))
  if (!idThat) {
    console.error('\nFAIL: không dò được id nào dạng "dieu-*" trong /toan-van, phép dò id đang rỗng.')
    process.exit(1)
  }
  console.log(`  BẮT ĐƯỢC  [đối chứng âm] id có thật "${idThat}" được nhận ra`)

  // Đối chứng cho phép kiểm biểu tượng: bộ đọc ICO phải đọc ra đúng các cỡ có
  // thật, và phải từ chối một tệp không phải ICO. Không kiểm việc này thì một
  // bộ đọc luôn trả về mảng rỗng sẽ làm phép kiểm cỡ 16/32 báo lỗi vĩnh viễn,
  // còn một bộ đọc luôn trả về [16,32] sẽ không bao giờ bắt được gì.
  {
    const b = readFileSync(resolve(goc, 'app/favicon.ico'))
    const n = b.readUInt16LE(4)
    const co = []
    for (let i = 0; i < n; i++) co.push(b.readUInt8(6 + i * 16) || 256)
    const duCo = co.includes(16) && co.includes(32)
    console.log(`  ${duCo ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  [đối chứng âm] đọc ra ${n} cỡ từ favicon.ico: ${co.join(', ')}`)
    if (!duCo) {
      console.error('\nFAIL: bộ đọc ICO không đọc ra được cỡ 16 và 32, phép kiểm biểu tượng vô nghĩa.')
      process.exit(1)
    }
    const gia = Buffer.from('khong phai ICO')
    const laIco = gia.length >= 6 && gia.readUInt16LE(0) === 0 && gia.readUInt16LE(2) === 1
    console.log(`  ${!laIco ? 'BẮT ĐƯỢC' : 'LỌT LƯỚI'}  tệp không phải ICO bị từ chối`)
    if (laIco) {
      console.error('\nFAIL: phép nhận dạng ICO chấp nhận cả tệp rác.')
      process.exit(1)
    }
  }
  console.log('')
}

/* --------------------------------- kết ---------------------------------- */

if (loi.length) {
  console.error('FAIL check-links:')
  for (const l of loi.slice(0, 40)) console.error('  - ' + l)
  if (loi.length > 40) console.error(`  ... và ${loi.length - 40} lỗi nữa`)
  process.exit(1)
}
console.log(
  `PASS check-links: ${trang.length} trang, ${soLink} liên kết nội bộ, ${soNeo} neo, ${soTaiNguyen} tài nguyên tĩnh, tất cả đều trỏ tới thứ có thật.`,
)
