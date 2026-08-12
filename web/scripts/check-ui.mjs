/**
 * Cổng kiểm giao diện: dựng trang thật trong trình duyệt, chụp ảnh, rồi ĐO trên
 * trang đã hiển thị. Ảnh để lại trong shots/ cho người xem bằng mắt.
 *
 * Vì sao không đọc mã nguồn: đếm class trong tsx không cho biết trang có tràn
 * ngang không, chữ có bị chồng không, nút bấm có thật sự đổi số không. Những lỗi
 * đó chỉ lộ ra sau khi trình duyệt bố cục xong.
 *
 * Ba nhóm phép đo:
 *   1. Không trang nào trượt ngang, ở cả 390px và 1280px.
 *   2. Nhận diện DAU đúng: header maroon #990000, dải gold, footer navy.
 *   3. Núm bấm phải TÍNH LẠI THẬT. Đổi tham số rồi đọc lại số trên màn hình;
 *      số không đổi nghĩa là núm giả, và núm giả dạy sai một cách âm thầm.
 *
 * Chạy: npm run build && node scripts/check-ui.mjs
 */
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'
import { NHOM_NAV } from '../components/dieu-huong.ts'

const here = dirname(fileURLToPath(import.meta.url))
const goc = resolve(here, '..')
const anh = resolve(goc, 'shots')
const CONG = 3987
const GOC_URL = `http://127.0.0.1:${CONG}`

const ROUTE = [
  '/',
  '/toan-van',
  '/quyet-dinh',
  '/chi-tieu',
  '/chi-tieu/a03',
  '/nguong',
  '/cong-tuan-thu',
  '/cham-diem',
  '/quy-trinh',
  '/lay-mau',
  '/vong-doi-du-an',
  '/co-so-vat-chat',
  '/ha-tang-so',
  '/trach-nhiem',
  '/phieu-de-xuat',
]

const loi = []
let dat = 0
const kiem = (ten, ok, chiTiet = '') => {
  if (ok) dat++
  else loi.push(`${ten}${chiTiet ? ` — ${chiTiet}` : ''}`)
}

/**
 * Lấy khung nội dung bên trong iframe và CHỜ nó thật sự dựng xong.
 *
 * `page.frames()[1]` trả về đối tượng khung ngay khi thẻ iframe có mặt, kể cả
 * lúc bên trong còn là about:blank. Đo trên khung đó cho ra số rỗng trông hệt
 * số sạch, và tệ hơn là hỏng lúc có lúc không tuỳ tốc độ máy.
 */
async function khungTrongIframe(trang) {
  await trang.locator('iframe').waitFor({ state: 'attached', timeout: 15000 })
  const khung = trang.frames()[1]
  if (!khung) return null
  await khung.waitForLoadState('load')
  await khung.locator('.site-header').waitFor({ state: 'visible', timeout: 15000 })

  /* Chờ tới khi BIỂU KIỂU thật sự được áp, không chỉ tới khi thẻ có mặt.
     Thẻ .site-header hiện ra ngay cả khi tệp CSS chưa tới, nên chờ "thấy thẻ"
     rồi đo màu sẽ đọc được màu mặc định của trình duyệt và báo sai nhận diện.
     Điều kiện chờ là chính thứ sắp đo: dải gold dưới đầu trang.
     Nếu CSS thật sự không bao giờ tới thì hàm này ném lỗi, và đó là kết quả
     đúng chứ không phải lỗi giả. */
  await khung.waitForFunction(
    () => {
      const h = document.querySelector('.site-header')
      if (!h) return false
      return getComputedStyle(h).borderBottomColor === 'rgb(251, 174, 64)'
    },
    { timeout: 15000 },
  )
  return khung
}

/* ------------------------------ dựng máy chủ ----------------------------- */

/**
 * Cổng phải trống trước khi dựng máy chủ riêng.
 *
 * Không kiểm việc này là một cái bẫy nguy hiểm: nếu một `next start` cũ còn giữ
 * cổng, lệnh mới bind thất bại trong im lặng, còn trình duyệt vẫn nhận được
 * trang từ máy chủ cũ đang phục vụ BẢN DỰNG CŨ. Cổng kiểm khi đó đo một phiên
 * bản không phải phiên bản vừa dựng, và kết quả PASS hay FAIL đều vô nghĩa.
 * Đã mất một buổi vì đúng chuyện này.
 */
async function congPhaiTrong() {
  try {
    const r = await fetch(GOC_URL + '/', { signal: AbortSignal.timeout(1500) })
    console.error(
      `FAIL check-ui: cổng ${CONG} đang có tiến trình khác phục vụ (HTTP ${r.status}).\n` +
        `  Nhiều khả năng là một "next start" cũ chưa tắt. Bản dựng nó phục vụ có thể đã lỗi thời,\n` +
        `  nên mọi phép đo sau đó sẽ đo nhầm phiên bản.\n` +
        `  Tắt nó rồi chạy lại. Trên Windows: netstat -ano | findstr :${CONG}  rồi  taskkill /F /PID <pid> /T`,
    )
    process.exit(1)
  } catch (e) {
    // Không nối được nghĩa là cổng trống, đúng như mong muốn.
    if (e?.name === 'TimeoutError') {
      console.error(`FAIL check-ui: cổng ${CONG} có thứ gì đó đang chiếm nhưng không trả lời.`)
      process.exit(1)
    }
  }
}

function chayServer() {
  return new Promise((ok, hong) => {
    const p = spawn('npx', ['next', 'start', '-p', String(CONG)], {
      cwd: goc,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let xong = false
    const canh = (d) => {
      if (!xong && /Ready|started server|Local:/i.test(String(d))) {
        xong = true
        setTimeout(() => ok(p), 700)
      }
    }
    p.stdout.on('data', canh)
    p.stderr.on('data', canh)
    setTimeout(() => {
      if (!xong) {
        xong = true
        ok(p)
      }
    }, 12000)
    p.on('error', hong)
  })
}

/* --------------------------------- chạy --------------------------------- */

rmSync(anh, { recursive: true, force: true })
mkdirSync(anh, { recursive: true })

await congPhaiTrong()
const server = await chayServer()

/* Xác nhận đang nói chuyện với máy chủ VỪA dựng, không phải một máy chủ nào đó.
   Đối chiếu một chuỗi chỉ có trong bản dựng hiện tại: đường dẫn tệp CSS mà trang
   chủ khai báo phải trùng với tệp có thật trong .next của cây mã này. */
{
  let html = ''
  try {
    html = await (await fetch(GOC_URL + '/', { signal: AbortSignal.timeout(8000) })).text()
  } catch (e) {
    console.error('FAIL check-ui: máy chủ không trả lời sau khi khởi động —', String(e).split('\n')[0])
    dietCayTienTrinh(server)
    process.exit(1)
  }
  const css = [...html.matchAll(/\/_next\/(static\/[^"']+\.css)/g)].map((m) => m[1])
  if (css.length === 0) {
    console.error('FAIL check-ui: trang chủ không khai báo tệp CSS nào. Bản dựng hỏng.')
    dietCayTienTrinh(server)
    process.exit(1)
  }
  const thieu = css.filter((c) => !existsSync(resolve(goc, '.next', c)))
  if (thieu.length) {
    console.error(
      'FAIL check-ui: máy chủ đang phục vụ bản dựng KHÁC với .next của cây mã này.\n' +
        `  Tệp CSS trang khai báo: ${thieu.join(', ')} — không có trên đĩa.\n` +
        '  Dựng lại bằng "npm run build" rồi chạy lại.',
    )
    dietCayTienTrinh(server)
    process.exit(1)
  }
}

const trinhDuyet = await chromium.launch()

try {
  for (const rong of [390, 1280]) {
    /* Headless không bố cục dưới khoảng 504px, nên khung hẹp phải đặt trong một
       iframe rộng 390px thay vì thu nhỏ cửa sổ. Không làm vậy thì mọi phép đo
       "không tràn ngang" ở 390px đều đo trên một trang thực ra đang rộng 504px,
       và cổng sẽ báo sạch cho đúng thứ nó cần bắt. */
    const ctx = await trinhDuyet.newContext({
      viewport: rong < 504 ? { width: 900, height: 900 } : { width: rong, height: 1000 },
      deviceScaleFactor: 1,
    })
    const trang = await ctx.newPage()

    for (const r of ROUTE) {
      if (rong < 504) {
        await trang.setContent(
          `<body style="margin:0"><iframe src="${GOC_URL}${r}" style="width:390px;height:900px;border:0"></iframe></body>`,
        )
        await trang.waitForLoadState('networkidle')
      } else {
        await trang.goto(GOC_URL + r, { waitUntil: 'networkidle' })
      }

      const khung = rong < 504 ? await khungTrongIframe(trang) : trang.mainFrame()
      if (!khung) {
        kiem(`${r} @${rong} tải được`, false, 'không lấy được khung nội dung')
        continue
      }

      const do1 = await khung.evaluate(() => {
        const de = document.documentElement
        const h = getComputedStyle(document.querySelector('.site-header'))
        const f = getComputedStyle(document.querySelector('.site-footer'))
        const b = getComputedStyle(document.body)
        return {
          rongCuon: de.scrollWidth,
          rongKhung: de.clientWidth,
          nenHeader: h.backgroundImage + ' ' + h.backgroundColor,
          vienHeader: h.borderBottomColor,
          nenFooter: f.backgroundColor,
          nenBody: b.backgroundColor,
          soH1: document.querySelectorAll('h1').length,
          coChu: (document.body.innerText || '').trim().length,
        }
      })

      // 1. Không trượt ngang. Cho 2px sai số làm tròn của trình duyệt.
      kiem(
        `${r} @${rong}px không tràn ngang`,
        do1.rongCuon <= do1.rongKhung + 2,
        `scrollWidth ${do1.rongCuon} > clientWidth ${do1.rongKhung}`,
      )

      // 2. Trang phải có nội dung thật, không phải khung rỗng đã tải xong.
      kiem(`${r} @${rong}px có nội dung`, do1.coChu > 400, `chỉ ${do1.coChu} ký tự`)
      kiem(`${r} @${rong}px có đúng 1 thẻ h1`, do1.soH1 === 1, `đang có ${do1.soH1}`)

      // 3. Nhận diện DAU.
      kiem(
        `${r} @${rong}px header màu maroon DAU`,
        do1.nenHeader.includes('153, 0, 0'),
        do1.nenHeader.slice(0, 70),
      )
      kiem(
        `${r} @${rong}px dải gold dưới header`,
        do1.vienHeader.includes('251, 174, 64'),
        do1.vienHeader,
      )
      kiem(
        `${r} @${rong}px footer nền navy`,
        do1.nenFooter.includes('14, 40, 65'),
        do1.nenFooter,
      )

      const ten = (r === '/' ? 'home' : r.slice(1).replace(/\//g, '-')) + `-${rong}.png`
      const chup = rong < 504 ? trang : trang
      await chup.screenshot({ path: resolve(anh, ten), fullPage: rong >= 504 })
    }
    await ctx.close()
  }

  /* ----------------------- núm bấm phải tính lại thật ---------------------- */

  const ctx = await trinhDuyet.newContext({ viewport: { width: 1280, height: 1000 } })
  const p = await ctx.newPage()
  p.setDefaultTimeout(8000)

  /* Bắt lỗi JS của trang. Thiếu phép này thì một trang hỏng hoàn toàn phần
     tương tác vẫn chụp ảnh đẹp như thường, và mọi phép đo bố cục vẫn PASS.
     Lỗi hydrate làm chết TOÀN BỘ thành phần client cùng lúc, nên nó phải được
     báo thẳng chứ không để lộ ra gián tiếp qua chục phép đo hỏng khó hiểu. */
  const loiJS = []
  p.on('pageerror', (e) => loiJS.push(String(e).split('\n')[0]))
  p.on('console', (m) => {
    if (m.type() === 'error') loiJS.push('console.error: ' + m.text().slice(0, 200))
  })

  // a) Máy chấm điểm: đổi giá trị thực hiện thì điểm phải đổi theo.
  await p.goto(GOC_URL + '/cham-diem', { waitUntil: 'networkidle' })
  const oTH = p.locator('input[type="number"]').first()
  await oTH.fill('80')
  await p.waitForTimeout(120)
  const d1 = await p.locator('text=/\\d+([.,]\\d+)? điểm/').first().innerText()
  await oTH.fill('40')
  await p.waitForTimeout(120)
  const d2 = await p.locator('text=/\\d+([.,]\\d+)? điểm/').first().innerText()
  kiem('máy chấm điểm tính lại thật khi đổi thực hiện', d1 !== d2, `cả hai lần đều là "${d1}"`)

  // b) Cổng tuân thủ: bỏ tích thì điểm tổng phải BIẾN MẤT, không phải tụt xuống.
  const oCong = p.locator('input[type="checkbox"]').first()
  const truoc = await p.locator('text=/Không tính điểm tổng/').count()
  await oCong.uncheck()
  await p.waitForTimeout(150)
  const sau = await p.locator('text=/Không tính điểm tổng/').count()
  kiem(
    'bỏ cổng tuân thủ thì điểm tổng biến mất',
    truoc === 0 && sau === 1,
    `trước ${truoc}, sau ${sau}`,
  )
  await p.screenshot({ path: resolve(anh, 'cham-diem-hong-cong.png'), fullPage: true })

  // c) Ô tính uptime: đổi cửa sổ dịch vụ thì số giờ phải đổi.
  await p.goto(GOC_URL + '/ha-tang-so', { waitUntil: 'networkidle' })
  const chon = p.locator('select').first()
  const u1 = await p.locator('text=/mỗi năm/').first().innerText()
  await chon.selectOption('10-5')
  await p.waitForTimeout(150)
  const u2 = await p.locator('text=/mỗi năm/').first().innerText()
  kiem('ô tính uptime tính lại thật khi đổi cửa sổ dịch vụ', u1 !== u2, `cả hai lần đều là "${u1}"`)

  // d) Bộ lọc chỉ tiêu: bấm nhóm C thì số kết quả phải giảm.
  await p.goto(GOC_URL + '/chi-tieu', { waitUntil: 'networkidle' })
  const dong0 = await p.locator('tbody tr').count()
  await p.getByRole('button', { name: /^C — Cổng tuân thủ$/ }).click()
  await p.waitForTimeout(150)
  const dong1 = await p.locator('tbody tr').count()
  kiem('bộ lọc chỉ tiêu lọc thật', dong0 === 47 && dong1 === 4, `trước ${dong0}, sau ${dong1}`)

  // e) Ô tính cỡ mẫu: chọn mức rất cao thì phải chuyển sang kiểm 100%.
  await p.goto(GOC_URL + '/lay-mau', { waitUntil: 'networkidle' })
  await p.locator('select').first().selectOption('ratcao')
  await p.waitForTimeout(150)
  const co100 = await p.locator('text=/Kiểm tra toàn bộ/').count()
  kiem('ô tính cỡ mẫu chặn lấy mẫu ở nhóm rủi ro rất cao', co100 === 1, `đếm được ${co100}`)

  /* ------------------------- menu thả xuống ------------------------- */

  await p.goto(GOC_URL + '/', { waitUntil: 'networkidle' })

  // Báo lỗi JS ngay tại đây, trước các phép đo tương tác, để nguyên nhân đứng
  // trước hậu quả trong bảng kết quả.
  kiem('trang không có lỗi JS', loiJS.length === 0, loiJS.slice(0, 3).join(' | '))

  // Khi chưa bấm thì không menu nào bung sẵn.
  kiem('menu đóng khi mới vào trang', (await p.locator('.menu-tha').count()) === 0)

  for (const n of NHOM_NAV) {
    const nut = p.getByRole('button', { name: new RegExp(`^${n.ten}`) })
    await nut.click()

    const bang = p.locator('.menu-tha').first()
    // Chờ có điều kiện, không chờ theo đồng hồ. Chờ một số mili giây cố định là
    // cách viết phép kiểm hỏng ngầm: máy chậm hơn thì phép kiểm báo lỗi giả, máy
    // nhanh hơn thì nó đo trước khi giao diện kịp cập nhật.
    try {
      await bang.locator('a').first().waitFor({ state: 'visible', timeout: 5000 })
    } catch {
      kiem(`menu "${n.ten}" mở được`, false, 'bấm nút xong menu không hiện')
      continue
    }

    const soMuc = await bang.locator('a').count()
    kiem(`menu "${n.ten}" mở ra đủ ${n.muc.length} mục`, soMuc === n.muc.length, `đếm được ${soMuc}`)

    // Chữ trong menu phải đọc được. Menu nằm trên nền trắng còn header đặt màu
    // chữ trắng cho mọi thẻ a, nên đây đúng là chỗ dễ thành trắng trên trắng.
    const mau = await bang.locator('a').first().evaluate((e) => {
      const s = getComputedStyle(e)
      const n = getComputedStyle(e.closest('.menu-tha'))
      return { chu: s.color, nen: n.backgroundColor }
    })
    kiem(
      `menu "${n.ten}" chữ đọc được trên nền menu`,
      mau.chu !== mau.nen && !mau.chu.includes('255, 255, 255'),
      `chữ ${mau.chu} trên nền ${mau.nen}`,
    )

    // Chỉ một menu mở tại một thời điểm.
    kiem(`menu "${n.ten}" không mở chồng menu khác`, (await p.locator('.menu-tha').count()) === 1)

    // Đóng lại trước khi thử nhóm kế tiếp.
    await p.keyboard.press('Escape')
    let daDong = false
    try {
      await p.locator('.menu-tha').waitFor({ state: 'detached', timeout: 3000 })
      daDong = true
    } catch {}
    kiem(`menu "${n.ten}" đóng được bằng phím Esc`, daDong)
  }

  // Bấm một mục thật sự chuyển trang.
  // Cổng không được sập vì một phép đo hỏng: sập thì mọi phép đo sau nó không
  // chạy, và bảng kết quả thiếu dòng trông giống hệt bảng kết quả sạch.
  try {
    await p.getByRole('button', { name: /^Thước đo/ }).click()
    await p.locator('.menu-tha a[href="/nguong"]').waitFor({ state: 'visible', timeout: 5000 })
    await p.screenshot({ path: resolve(anh, 'menu-mo-1280.png') })
    await p.locator('.menu-tha a[href="/nguong"]').click()
    await p.waitForURL('**/nguong', { timeout: 5000 })
    kiem('bấm mục trong menu thì chuyển trang', p.url().endsWith('/nguong'))

    // Chờ có điều kiện. waitForURL trả về ngay khi đường dẫn đổi, còn React chạy
    // effect đóng menu ở lượt dựng sau đó, nên đếm ngay lúc này là đo trước khi
    // giao diện kịp cập nhật chứ không phải menu bị treo lại.
    let daDongSauChuyenTrang = false
    try {
      await p.locator('.menu-tha').waitFor({ state: 'detached', timeout: 3000 })
      daDongSauChuyenTrang = true
    } catch {}
    kiem('sang trang mới thì menu đã đóng', daDongSauChuyenTrang)
  } catch (e) {
    await p.screenshot({ path: resolve(anh, 'LOI-menu-1280.png'), fullPage: true })
    kiem('bấm mục trong menu thì chuyển trang', false, `${String(e).split('\n')[0]} (ảnh: shots/LOI-menu-1280.png)`)
  }

  await ctx.close()

  /* -------------------- menu trên màn hẹp 390px -------------------- */

  const ctxHep = await trinhDuyet.newContext({ viewport: { width: 900, height: 900 } })
  const ph = await ctxHep.newPage()
  ph.setDefaultTimeout(8000)
  await ph.setContent(
    `<body style="margin:0"><iframe src="${GOC_URL}/" style="width:390px;height:900px;border:0"></iframe></body>`,
  )
  await ph.waitForLoadState('networkidle')
  const khungHep = await khungTrongIframe(ph)

  // Ở màn hẹp, 4 nút nhóm phải ẩn, thay bằng một nút Mục lục.
  // Đếm cả nút ẩn lẫn nút hiện, vì "0 nút hiện" một mình là phép đo rỗng: nó
  // cũng đúng khi cả thanh điều hướng biến mất, tức là đúng lúc cần báo lỗi.
  const nutNhomTong = await khungHep.locator('nav[aria-label="Điều hướng chính"] > div > button').count()
  const nutNhomHien = await khungHep.locator('nav[aria-label="Điều hướng chính"] > div > button:visible').count()
  kiem('màn 390px vẫn có đủ 4 nút nhóm trong DOM', nutNhomTong === NHOM_NAV.length, `đếm được ${nutNhomTong}`)
  kiem('màn 390px ẩn 4 nút nhóm', nutNhomHien === 0, `còn hiện ${nutNhomHien}`)

  const tongMuc = NHOM_NAV.reduce((s, n) => s + n.muc.length, 0)
  try {
    await khungHep.getByRole('button', { name: /Mục lục/ }).click({ timeout: 6000 })
    await khungHep.locator('.menu-tha a').first().waitFor({ state: 'visible', timeout: 6000 })
    const soMucHep = await khungHep.locator('.menu-tha a').count()
    kiem(`màn 390px mở ra đủ ${tongMuc} mục`, soMucHep === tongMuc, `đếm được ${soMucHep}`)

    const tranHep = await khungHep.evaluate(() => {
      const d = document.documentElement
      return { cuon: d.scrollWidth, khung: d.clientWidth }
    })
    kiem(
      'màn 390px menu mở không làm tràn ngang',
      tranHep.cuon <= tranHep.khung + 2,
      `scrollWidth ${tranHep.cuon} > clientWidth ${tranHep.khung}`,
    )
    await ph.screenshot({ path: resolve(anh, 'menu-mo-390.png') })
  } catch (e) {
    // Không để cổng sập vì một phép đo: sập thì các phép sau không chạy, và bảng
    // kết quả thiếu dòng trông giống hệt bảng kết quả sạch. In ra đúng thứ nó
    // nhìn thấy để lần sau khỏi phải đoán.
    const nut = await khungHep.locator('button').allInnerTexts().catch(() => [])
    const hien = await khungHep.locator('button:visible').allInnerTexts().catch(() => [])
    await ph.screenshot({ path: resolve(anh, 'LOI-menu-390.png') })
    kiem(
      `màn 390px mở ra đủ ${tongMuc} mục`,
      false,
      `${String(e).split('\n')[0]}; nút trong DOM: ${JSON.stringify(nut)}; nút đang hiện: ${JSON.stringify(hien)} (ảnh: shots/LOI-menu-390.png)`,
    )
  }

  await ctxHep.close()
} finally {
  await trinhDuyet.close()
  dietCayTienTrinh(server)
}

/**
 * Trên Windows, spawn với shell:true tạo ra một lớp cmd.exe bọc ngoài. Gọi
 * server.kill() chỉ giết lớp bọc, còn next start vẫn chạy và giữ cổng, làm
 * tiến trình node này không bao giờ thoát. Phải giết cả cây.
 */
function dietCayTienTrinh(p) {
  if (!p?.pid) return
  if (process.platform === 'win32') {
    try {
      spawn('taskkill', ['/pid', String(p.pid), '/T', '/F'], { stdio: 'ignore' })
    } catch {
      p.kill('SIGKILL')
    }
  } else {
    p.kill('SIGKILL')
  }
}

/* --------------------------------- kết ---------------------------------- */

if (loi.length) {
  console.error('FAIL check-ui:')
  for (const l of loi) console.error('  - ' + l)
  console.error(`\n${dat} phép đạt, ${loi.length} phép hỏng. Ảnh chụp ở shots/`)
  process.exit(1)
}
console.log(
  `PASS check-ui: ${dat} phép đo trên ${ROUTE.length} trang ở 390px và 1280px, gồm 5 phép kiểm núm bấm tính lại thật. Ảnh ở shots/`,
)
