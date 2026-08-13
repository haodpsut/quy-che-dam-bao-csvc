/**
 * Sinh app/favicon.ico và app/apple-icon.png từ public/dau-logo.png.
 *
 * Chạy: npm run favicon
 *
 * Ba quyết định thiết kế, ghi lại để sau này khỏi sửa nhầm:
 *
 * 1. NỀN MAROON #990000, không phải nền trắng và không giữ nền trong suốt.
 *    Đây là kết luận sau khi dựng cả ba phương án ra ảnh rồi phóng to nhìn.
 *    Logo gốc là hình thoi maroon với các nét TRẮNG khắc thành chữ KT. Đặt nó
 *    trên nền trắng thì ở 16px các nét trắng và nét maroon trung bình hoá thành
 *    một vệt hồng nhạt, không còn nhận ra. Đặt trên nền maroon thì chính các nét
 *    trắng gánh phần tương phản, và ô biểu tượng đọc ra ngay là maroon DAU trên
 *    cả thanh tab sáng lẫn tối.
 *    Đã thử cả phương án dùng logo làm mặt nạ: hỏng, vì vùng đục của logo phủ
 *    kín cả hình thoi nên kết quả là một khối trắng đặc, mất sạch chữ.
 * 2. NHIỀU KÍCH THƯỚC trong một tệp .ico, mỗi kích thước được dựng lại từ ảnh
 *    gốc 137px chứ không thu nhỏ từ một ảnh duy nhất.
 * 3. KHÔNG bo góc. Trình duyệt không bo favicon, còn iOS tự bo apple-icon.
 *
 * Vì sao dùng Playwright để đổi cỡ: kho này cố ý không phụ thuộc thư viện xử lý
 * ảnh. Playwright đã có sẵn cho cổng kiểm giao diện. Phần ghép tệp .ico viết
 * tay, chỉ vài chục dòng.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'

const here = dirname(fileURLToPath(import.meta.url))
const goc = resolve(here, '..')
const NGUON = resolve(goc, 'public/dau-logo.png')
const RA_ICO = resolve(goc, 'app/favicon.ico')
const RA_APPLE = resolve(goc, 'app/apple-icon.png')

/** Kích thước đưa vào .ico. 16 và 32 là hai cỡ trình duyệt thật sự dùng. */
const CO = [16, 32, 48, 64, 128, 256]

/** Maroon DAU, đúng mã dùng trong globals.css và template slide của Trường. */
const NEN = '#990000'

/** Lề quanh logo, theo tỷ lệ cạnh. Đủ để hình thoi không chạm mép, không quá dày làm mất nét. */
const LE = 0.06

const logoBase64 = readFileSync(NGUON).toString('base64')

/**
 * Nền maroon vẽ bằng một phần tử, không phải bằng nền của trang, và chụp với
 * omitBackground.
 *
 * Lý do: Next đọc tệp .ico lúc dựng và TỪ CHỐI nếu PNG bên trong không có kênh
 * alpha ("The PNG is not in RGBA format"). Chromium lại chỉ ghi PNG có alpha khi
 * trong ảnh còn điểm ảnh chưa đục hoàn toàn; nền đục kín thì nó rút xuống RGB.
 *
 * Cách thoả cả hai: bỏ nền trang, vẽ nền bằng một phần tử, và để phần tử đó ở
 * độ mờ 0,996. Alpha thành 254 thay vì 255 trên toàn ảnh, mắt không phân biệt
 * được (0,4%), nhưng PNG buộc phải mang kênh alpha.
 */
const DO_MO = 0.996

function trangHtml(canh) {
  const lePx = Math.round(canh * LE)
  return `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;width:${canh}px;height:${canh}px;overflow:hidden;background:transparent}
    .nen{width:${canh}px;height:${canh}px;background:${NEN};opacity:${DO_MO};display:flex;align-items:center;justify-content:center}
    img{width:${canh - lePx * 2}px;height:${canh - lePx * 2}px;image-rendering:auto}
  </style></head><body>
    <div class="nen"><img src="data:image/png;base64,${logoBase64}" alt=""></div>
  </body></html>`
}

/* ------------------------------ ghép tệp ICO ------------------------------ */

/**
 * Định dạng ICO: 6 byte tiêu đề, rồi mỗi ảnh một mục 16 byte, rồi dữ liệu ảnh.
 * Từ Windows Vista trở đi, dữ liệu ảnh được phép là PNG nguyên khối, nên không
 * cần chuyển sang BMP.
 */
function ghepIco(anh) {
  const tieuDe = Buffer.alloc(6)
  tieuDe.writeUInt16LE(0, 0) // dự trữ
  tieuDe.writeUInt16LE(1, 2) // 1 = biểu tượng
  tieuDe.writeUInt16LE(anh.length, 4)

  const muc = Buffer.alloc(16 * anh.length)
  let viTri = 6 + 16 * anh.length

  anh.forEach((a, i) => {
    const o = i * 16
    // 256 được ghi là 0 theo đúng đặc tả, vì trường này chỉ có một byte.
    muc.writeUInt8(a.canh >= 256 ? 0 : a.canh, o + 0)
    muc.writeUInt8(a.canh >= 256 ? 0 : a.canh, o + 1)
    muc.writeUInt8(0, o + 2) // số màu bảng, 0 = không dùng bảng màu
    muc.writeUInt8(0, o + 3) // dự trữ
    muc.writeUInt16LE(1, o + 4) // số mặt phẳng màu
    muc.writeUInt16LE(32, o + 6) // số bit mỗi điểm ảnh
    muc.writeUInt32LE(a.du.length, o + 8)
    muc.writeUInt32LE(viTri, o + 12)
    viTri += a.du.length
  })

  return Buffer.concat([tieuDe, muc, ...anh.map((a) => a.du)])
}

/* --------------------------------- chạy --------------------------------- */

const trinhDuyet = await chromium.launch()
try {
  const anh = []
  for (const canh of CO) {
    const ctx = await trinhDuyet.newContext({
      viewport: { width: canh, height: canh },
      deviceScaleFactor: 1,
    })
    const trang = await ctx.newPage()
    await trang.setContent(trangHtml(canh))
    await trang.waitForLoadState('load')
    const du = await trang.screenshot({ type: 'png', omitBackground: true })
    anh.push({ canh, du })
    await ctx.close()
  }

  const ico = ghepIco(anh)
  writeFileSync(RA_ICO, ico)

  // Biểu tượng cho iOS khi người dùng lưu trang ra màn hình chính.
  const ctx = await trinhDuyet.newContext({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 })
  const trang = await ctx.newPage()
  await trang.setContent(trangHtml(180))
  await trang.waitForLoadState('load')
  writeFileSync(RA_APPLE, await trang.screenshot({ type: 'png', omitBackground: true }))
  await ctx.close()

  console.log(`Đã sinh ${RA_ICO}`)
  console.log(`  ${anh.length} kích thước: ${anh.map((a) => `${a.canh}px (${a.du.length} B)`).join(', ')}`)
  console.log(`  tổng ${ico.length} byte`)
  console.log(`Đã sinh ${RA_APPLE} (180px)`)
} finally {
  await trinhDuyet.close()
}
