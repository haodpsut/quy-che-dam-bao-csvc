'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Đầu trang theo ngôn ngữ thị giác của slide DAU: khối maroon, dải gold mỏng
 * ngay dưới, logo bên trái.
 */

const NHOM_NAV = [
  {
    ten: 'Văn bản',
    muc: [
      { href: '/toan-van', ten: 'Toàn văn Quy định' },
      { href: '/quyet-dinh', ten: 'Quyết định và căn cứ' },
    ],
  },
  {
    ten: 'Thước đo',
    muc: [
      { href: '/chi-tieu', ten: '47 chỉ tiêu' },
      { href: '/nguong', ten: 'Ngưỡng và trạng thái' },
      { href: '/cong-tuan-thu', ten: 'Cổng tuân thủ' },
      { href: '/cham-diem', ten: 'Chấm điểm và xếp loại' },
    ],
  },
  {
    ten: 'Theo đối tượng',
    muc: [
      { href: '/vong-doi-du-an', ten: 'Dự án đầu tư' },
      { href: '/co-so-vat-chat', ten: 'Cơ sở vật chất' },
      { href: '/ha-tang-so', ten: 'Hạ tầng số' },
    ],
  },
  {
    ten: 'Vận hành',
    muc: [
      { href: '/quy-trinh', ten: 'Quy trình 8 bước' },
      { href: '/lay-mau', ten: 'Lấy mẫu theo rủi ro' },
      { href: '/trach-nhiem', ten: 'Trách nhiệm đơn vị' },
      { href: '/phieu-de-xuat', ten: 'Phiếu đề xuất phê duyệt' },
    ],
  },
]

export default function SiteHeader() {
  const duong = usePathname()

  return (
    <header className="site-header khong-in sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
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
        </div>

        <nav className="mt-2 flex flex-wrap gap-x-1 gap-y-1" aria-label="Điều hướng chính">
          {NHOM_NAV.flatMap((n) => n.muc).map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="nav-link"
              data-dang={duong === m.href || duong.startsWith(m.href + '/') ? '1' : '0'}
            >
              {m.ten}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
