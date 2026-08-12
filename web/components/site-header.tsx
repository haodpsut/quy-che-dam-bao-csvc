'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NHOM_NAV, type NhomNav } from './dieu-huong'

/**
 * Đầu trang theo ngôn ngữ thị giác của slide DAU: khối maroon, dải gold mỏng
 * ngay dưới, logo bên trái.
 *
 * 14 trang gom thành 4 nhóm, mở bằng menu thả xuống. Bày phẳng cả 14 mục thì
 * trên màn 390px chúng chiếm sáu dòng và đẩy nội dung xuống dưới màn hình đầu
 * tiên, còn trên màn rộng thì người đọc phải quét cả hàng dài mới thấy quan hệ
 * giữa các trang.
 *
 * Mở bằng bấm chứ không bằng rê chuột: rê chuột không dùng được trên cảm ứng, và
 * menu tự bung khi lướt qua là một trong những thứ gây khó chịu nhất trên web.
 */

export default function SiteHeader() {
  const duong = usePathname()
  const [dangMo, setDangMo] = useState<string | null>(null)
  const [moDienThoai, setMoDienThoai] = useState(false)
  const boc = useRef<HTMLDivElement>(null)

  // Đổi trang thì đóng hết, nếu không menu treo lại trên trang mới.
  useEffect(() => {
    setDangMo(null)
    setMoDienThoai(false)
  }, [duong])

  // Bấm ra ngoài hoặc bấm Esc thì đóng.
  useEffect(() => {
    if (!dangMo && !moDienThoai) return
    const bamNgoai = (e: MouseEvent) => {
      if (boc.current && !boc.current.contains(e.target as Node)) {
        setDangMo(null)
        setMoDienThoai(false)
      }
    }
    const bamPhim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDangMo(null)
        setMoDienThoai(false)
      }
    }
    document.addEventListener('mousedown', bamNgoai)
    document.addEventListener('keydown', bamPhim)
    return () => {
      document.removeEventListener('mousedown', bamNgoai)
      document.removeEventListener('keydown', bamPhim)
    }
  }, [dangMo, moDienThoai])

  const dangODay = (href: string) => duong === href || duong.startsWith(href + '/')
  const nhomDangMo = (n: NhomNav) => n.muc.some((m) => dangODay(m.href))

  return (
    <header className="site-header khong-in sticky top-0 z-40">
      <div ref={boc} className="mx-auto max-w-6xl px-4">
        {/* ------------------------------ hàng logo ----------------------------- */}
        <div className="flex items-center justify-between gap-3 py-2.5">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setDangMo(null)}>
            <Image
              src="/dau-logo.png"
              alt="Logo Trường Đại học Kiến trúc Đà Nẵng"
              width={38}
              height={38}
              className="rounded-sm bg-white/95 p-0.5"
              priority
            />
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold">Trường Đại học Kiến trúc Đà Nẵng</span>
              <span className="block text-[11px] text-white/80">
                Đánh giá hiệu quả đầu tư và sử dụng tài sản
              </span>
            </span>
          </Link>

          {/* -------------------------- nhóm, màn rộng -------------------------- */}
          <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Điều hướng chính">
            {NHOM_NAV.map((n) => {
              const mo = dangMo === n.khoa
              return (
                <div key={n.khoa} className="relative">
                  <button
                    type="button"
                    onClick={() => setDangMo(mo ? null : n.khoa)}
                    aria-expanded={mo}
                    aria-haspopup="true"
                    className="nav-link flex items-center gap-1"
                    data-dang={nhomDangMo(n) ? '1' : '0'}
                  >
                    {n.ten}
                    <MuiTen mo={mo} />
                  </button>
                  {mo && (
                    <div className="menu-tha absolute right-0 top-full z-50 mt-1.5 w-[290px]">
                      {n.muc.map((m) => (
                        <Link
                          key={m.href}
                          href={m.href}
                          className="menu-muc"
                          data-dang={dangODay(m.href) ? '1' : '0'}
                        >
                          <span className="block font-semibold">{m.ten}</span>
                          <span className="mt-0.5 block text-[12px] text-muted">{m.mo}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* -------------------------- nút, màn hẹp --------------------------- */}
          <button
            type="button"
            onClick={() => setMoDienThoai(!moDienThoai)}
            aria-expanded={moDienThoai}
            aria-controls="menu-hep"
            className="nav-link flex items-center gap-1.5 md:hidden"
          >
            {/* Không đặt aria-label ở đây. Chữ "Mục lục" đã nhìn thấy được, mà
                aria-label lại ĐÈ lên nó khi trình đọc màn hình và công cụ kiểm
                thử lấy tên nút, làm tên nghe được khác tên nhìn thấy. */}
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-4 bg-white" />
              <span className="block h-[2px] w-4 bg-white" />
              <span className="block h-[2px] w-4 bg-white" />
            </span>
            Mục lục
          </button>
        </div>

        {/* --------------------------- bảng, màn hẹp --------------------------- */}
        {moDienThoai && (
          <nav id="menu-hep" className="menu-tha mb-2.5 md:hidden" aria-label="Điều hướng chính">
            {NHOM_NAV.map((n) => (
              <div key={n.khoa} className="border-b border-line last:border-b-0">
                <p className="bg-surface px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-muted">
                  {n.ten}
                </p>
                {n.muc.map((m) => (
                  <Link key={m.href} href={m.href} className="menu-muc" data-dang={dangODay(m.href) ? '1' : '0'}>
                    <span className="block font-semibold">{m.ten}</span>
                    <span className="mt-0.5 block text-[12px] text-muted">{m.mo}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function MuiTen({ mo }: { mo: boolean }) {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      aria-hidden="true"
      className={`transition-transform ${mo ? 'rotate-180' : ''}`}
    >
      <path d="M1 1.5 4.5 5 8 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
