import type { Metadata } from 'next'
import { CHI_TIEU, NHOM_CHI_TIEU } from '@/lib/du-lieu'
import { Trang, Khoi } from '@/components/ui'
import BangChiTieu from './bang-chi-tieu'

export const metadata: Metadata = {
  title: 'Từ điển 47 chỉ tiêu',
  description:
    'Toàn bộ 47 chỉ tiêu ở Phụ lục I, lọc theo nhóm mã, lớp đánh giá, kiểu chấm điểm và tần suất đo.',
}

export default function TrangChiTieu() {
  const dem = (n: string) => CHI_TIEU.filter((c) => c.nhom === n).length

  return (
    <Trang
      tieuDe="Từ điển chỉ tiêu"
      canCu="Phụ lục I — Từ điển chỉ tiêu cốt lõi"
      phu={
        <p>
          {CHI_TIEU.length} chỉ tiêu chia thành 5 nhóm mã. Cột công thức, nguồn và diễn giải lấy
          nguyên văn từ Phụ lục I. Cột kiểu chấm và các cảnh báo là phần đọc thêm từ thân Quy định,
          không có sẵn trong bảng gốc.
        </p>
      }
      rong
    >
      <div className="mb-4 grid gap-2.5 sm:grid-cols-5">
        {(Object.keys(NHOM_CHI_TIEU) as (keyof typeof NHOM_CHI_TIEU)[]).map((n) => (
          <div key={n} className="khoi px-3 py-2.5">
            <p className="text-xl font-bold text-brand">
              {n}
              <span className="ml-1 text-[13px] font-semibold text-muted">{dem(n)} chỉ tiêu</span>
            </p>
            <p className="text-[12.5px] leading-snug">{NHOM_CHI_TIEU[n]}</p>
          </div>
        ))}
      </div>

      <Khoi loai="canhBao" tieuDe="Đọc bảng này cần nhớ ba điều">
        <p>
          <b>Một.</b> Phụ lục I ghi rõ chỉ tiêu và mục tiêu cụ thể được lựa chọn, phê duyệt trước
          từng kỳ đánh giá. Không phải tất cả chỉ tiêu đều áp dụng cho mọi đối tượng.
        </p>
        <p>
          <b>Hai.</b> Điều 9 khoản 2 cấm dùng một chỉ tiêu đơn lẻ để kết luận hiệu quả.
        </p>
        <p>
          <b>Ba.</b> Bốn chỉ tiêu mang nhãn <i>chỉ số bối cảnh</i> bị chính văn bản cấm quy ra điểm
          tốt xấu, dù về mặt kỹ thuật vẫn tính được một con số.
        </p>
      </Khoi>

      <BangChiTieu chiTieu={CHI_TIEU} />
    </Trang>
  )
}
