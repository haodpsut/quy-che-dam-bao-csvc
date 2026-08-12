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
import { mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'

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

/* ------------------------------ dựng máy chủ ----------------------------- */

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

const server = await chayServer()
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

      const khung = rong < 504 ? trang.frames()[1] : trang.mainFrame()
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

  await ctx.close()
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
