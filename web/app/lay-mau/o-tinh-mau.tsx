'use client'

import { useState } from 'react'

/**
 * Ô tính cỡ mẫu gợi ý.
 *
 * Cố tình KHÔNG có nút "tính cỡ mẫu tối ưu". Phụ lục IV ghi rõ tỷ lệ mẫu chỉ là
 * mức quản trị tham khảo và Hội đồng phải ghi nhận cơ sở chọn mẫu. Một máy tính
 * đưa ra con số dứt khoát sẽ thay Hội đồng làm phán đoán nghề nghiệp, đúng thứ
 * văn bản giao cho con người.
 */

const MUC: { khoa: string; ten: string; tu: number; den: number; batBuoc?: boolean; pp: string }[] = [
  {
    khoa: 'ratcao',
    ten: 'Rất cao',
    tu: 100,
    den: 100,
    batBuoc: true,
    pp: 'Hồ sơ và thực địa/kỹ thuật; chuyên gia khi cần',
  },
  { khoa: 'cao', ten: 'Cao', tu: 50, den: 100, pp: 'Phân tầng theo nguyên nhân và địa điểm' },
  { khoa: 'tb', ten: 'Trung bình', tu: 30, den: 50, pp: 'Mẫu phân tầng theo loại, tuổi, giá trị, đơn vị' },
  { khoa: 'thap', ten: 'Thấp', tu: 10, den: 20, pp: 'Có thể ngẫu nhiên sau phân tầng; không thay kiểm kê' },
]

export default function OTinhMau() {
  const [tong, setTong] = useState('120')
  const [muc, setMuc] = useState('tb')

  const n = Number(tong)
  const hopLe = Number.isFinite(n) && n > 0
  const m = MUC.find((x) => x.khoa === muc)!

  const tu = hopLe ? Math.ceil((n * m.tu) / 100) : 0
  const den = hopLe ? Math.ceil((n * m.den) / 100) : 0

  return (
    <div className="khoi px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-0.5 block text-[13px] font-semibold">Tổng số tài sản trong nhóm</span>
          <input
            type="number"
            min={1}
            value={tong}
            onChange={(e) => setTong(e.target.value)}
            className="o-nhap"
          />
        </label>
        <label className="block">
          <span className="mb-0.5 block text-[13px] font-semibold">Mức rủi ro sau khi phân tầng</span>
          <select value={muc} onChange={(e) => setMuc(e.target.value)} className="o-nhap">
            {MUC.map((x) => (
              <option key={x.khoa} value={x.khoa}>
                {x.ten}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!hopLe ? (
        <p className="khoi-cam mt-3 rounded-r-md px-4 py-2.5 text-[14px]">
          Nhập một số lớn hơn 0 để tính.
        </p>
      ) : m.batBuoc ? (
        <div className="khoi-cam mt-3 rounded-r-md px-4 py-3">
          <p className="text-[15px]">
            <span className="text-2xl font-bold">Kiểm tra toàn bộ {n} tài sản</span>
          </p>
          <p className="mt-1 text-[13.5px]">
            Nhóm rủi ro rất cao không được lấy mẫu. Điều 29 khoản 1 liệt kê rõ: tài sản mức I, tài
            sản giá trị lớn, tài sản liên quan an toàn, phòng cháy chữa cháy, an ninh mạng hoặc dữ
            liệu cá nhân, tài sản mất dấu, tài sản ngừng sử dụng, dự án có dấu hiệu vượt chi phí,
            chậm tiến độ, khiếu nại hoặc sự cố nghiêm trọng.
          </p>
        </div>
      ) : (
        <div className="khoi-nhan mt-3 rounded-r-md px-4 py-3">
          <p className="text-[15px]">
            <span className="text-2xl font-bold">
              {tu === den ? `${tu}` : `${tu} đến ${den}`} tài sản
            </span>
            <span className="ml-2 text-[14px]">
              ({m.tu === m.den ? `${m.tu}%` : `${m.tu}% - ${m.den}%`} của {n})
            </span>
          </p>
          <p className="mt-1 text-[13.5px]">
            <b>Phương pháp: </b>
            {m.pp}
          </p>
        </div>
      )}

      <div className="khoi-canh-bao mt-3 rounded-r-md px-4 py-3 text-[13.5px]">
        <p className="font-semibold">Con số trên chưa phải quyết định</p>
        <p className="mt-1">
          Ghi chú Phụ lục IV: tỷ lệ mẫu là mức quản trị tham khảo. Hội đồng đánh giá phải ghi nhận cơ
          sở chọn mẫu, sai lệch, phần không kiểm tra và ảnh hưởng đến độ tin cậy của kết luận.
        </p>
        <p className="mt-1">
          Ba việc phải làm trước khi dùng con số này: <b>phân tầng trước rồi mới lấy mẫu</b> (theo
          loại, địa điểm, tuổi đời, giá trị, tình trạng, mức sử dụng); tách riêng nhóm bắt buộc kiểm
          100%; và kiểm tra xem đối tượng có thuộc diện kiểm định, kiểm kê bắt buộc theo pháp luật
          không, vì <b>quy định nội bộ không được giảm phạm vi</b> so với yêu cầu bắt buộc.
        </p>
      </div>
    </div>
  )
}
