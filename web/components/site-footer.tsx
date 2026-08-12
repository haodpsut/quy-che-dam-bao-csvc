import Link from 'next/link'
import { META } from '@/lib/du-lieu'

export default function SiteFooter() {
  return (
    <footer className="site-footer khong-in mt-12">
      <div className="mx-auto max-w-6xl px-4 py-6 text-[13px]">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-white">Trường Đại học Kiến trúc Đà Nẵng</p>
            <p className="mt-1 text-white/70">
              Phòng Quản lý dự án và Quản trị thiết bị là đơn vị đầu mối tổ chức thực hiện Quy định
              này (Điều 2 Quyết định ban hành).
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Trang này là gì</p>
            <p className="mt-1 text-white/70">
              Bản tra cứu và công cụ hỗ trợ vận hành Quy định. Không thay thế văn bản gốc đã ký, cũng
              không thay thế thủ tục đầu tư, mua sắm, đấu thầu, nghiệm thu, kiểm kê, kế toán, thanh
              lý và báo cáo bắt buộc theo pháp luật (Điều 1 khoản 4).
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Lối tắt</p>
            <ul className="mt-1 space-y-0.5 text-white/80">
              <li>
                <Link href="/nguong">Con số nào là luật, con số nào chưa</Link>
              </li>
              <li>
                <Link href="/cong-tuan-thu">Cổng tuân thủ</Link>
              </li>
              <li>
                <Link href="/phieu-de-xuat">Phiếu đề xuất phê duyệt</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-5 border-t border-white/15 pt-3 text-white/55">
          Nội dung văn bản trên trang được sinh tự động từ tệp gốc{' '}
          <code className="text-white/75">{META.nguon.split('/').pop()}</code> và được cổng kiểm số
          đối chiếu lại với tệp đó mỗi lần dựng trang.
        </p>
      </div>
    </footer>
  )
}
