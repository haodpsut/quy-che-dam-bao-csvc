'use client'

import { useState } from 'react'

/**
 * Quy đổi mục tiêu thời gian hoạt động ra thời lượng gián đoạn cho phép.
 *
 * Điều 21 khoản 3 tự nêu một ví dụ: 99,5% liên tục 24 giờ mỗi ngày tương đương
 * khoảng 43 giờ 48 phút một năm. Nhưng con số đó chỉ đúng khi cửa sổ dịch vụ là
 * 24/7. Nếu Trường chọn cửa sổ hẹp hơn thì cùng một tỷ lệ cho ra thời lượng
 * khác hẳn, và đó chính là điều khoản này bắt phải xác định rõ trước khi dùng.
 */

function dinhDang(gio: number): string {
  const tongPhut = Math.round(gio * 60)
  const g = Math.floor(tongPhut / 60)
  const p = tongPhut % 60
  if (g === 0) return `${p} phút`
  if (p === 0) return `${g} giờ`
  return `${g} giờ ${p} phút`
}

const CUA_SO = [
  { khoa: '24-7', ten: '24 giờ mỗi ngày, cả tuần', gioTuan: 24 * 7 },
  { khoa: '18-7', ten: '06:00 đến 24:00, cả tuần', gioTuan: 18 * 7 },
  { khoa: '14-6', ten: '06:00 đến 20:00, sáu ngày mỗi tuần', gioTuan: 14 * 6 },
  { khoa: '10-5', ten: '07:30 đến 17:30, năm ngày làm việc', gioTuan: 10 * 5 },
]

export default function OTinhUptime() {
  const [muc, setMuc] = useState('99,5')
  const [cuaSo, setCuaSo] = useState('24-7')

  const p = Number(muc.replace(',', '.'))
  const hopLe = Number.isFinite(p) && p > 0 && p < 100
  const cs = CUA_SO.find((c) => c.khoa === cuaSo)!

  const gioNam = (cs.gioTuan * 365) / 7
  const giacDoanNam = hopLe ? gioNam * (1 - p / 100) : 0
  const giacDoanThang = giacDoanNam / 12
  const giacDoanTuan = hopLe ? cs.gioTuan * (1 - p / 100) : 0

  return (
    <div className="khoi px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-0.5 block text-[13px] font-semibold">Mục tiêu thời gian hoạt động (%)</span>
          <input
            type="text"
            inputMode="decimal"
            value={muc}
            onChange={(e) => setMuc(e.target.value)}
            className="o-nhap"
          />
          <span className="mt-0.5 block text-[12px] text-muted">
            Dùng dấu phẩy hoặc dấu chấm đều được
          </span>
        </label>
        <label className="block">
          <span className="mb-0.5 block text-[13px] font-semibold">Cửa sổ dịch vụ đã cam kết</span>
          <select value={cuaSo} onChange={(e) => setCuaSo(e.target.value)} className="o-nhap">
            {CUA_SO.map((c) => (
              <option key={c.khoa} value={c.khoa}>
                {c.ten} ({c.gioTuan} giờ mỗi tuần)
              </option>
            ))}
          </select>
        </label>
      </div>

      {!hopLe ? (
        <p className="khoi-cam mt-3 rounded-r-md px-4 py-2.5 text-[14px]">
          Nhập một tỷ lệ trong khoảng lớn hơn 0 và nhỏ hơn 100.
        </p>
      ) : (
        <>
          <div className="khoi-nhan mt-3 rounded-r-md px-4 py-3">
            <p className="text-[15px]">
              Gián đoạn cho phép tối đa:{' '}
              <span className="text-2xl font-bold">{dinhDang(giacDoanNam)}</span> mỗi năm
            </p>
            <p className="mt-1 text-[13.5px]">
              Tương đương {dinhDang(giacDoanThang)} mỗi tháng, hoặc {dinhDang(giacDoanTuan)} mỗi
              tuần. Tính trên cửa sổ dịch vụ {cs.gioTuan} giờ mỗi tuần, tức khoảng{' '}
              {Math.round(gioNam)} giờ mỗi năm.
            </p>
          </div>

          <p className="mt-2.5 text-[13px] text-muted">
            Đổi cửa sổ dịch vụ trong ô trên: cùng mục tiêu {muc}% nhưng thời lượng gián đoạn cho
            phép thay đổi hẳn. Đó là lý do Điều 21 khoản 3 bắt phải xác định rõ cửa sổ dịch vụ, thời
            gian bảo trì và cách ghi nhận gián đoạn <b>trước khi</b> lấy con số phần trăm ra dùng.
          </p>
        </>
      )}

      <div className="khoi-canh-bao mt-3 rounded-r-md px-4 py-3 text-[13.5px]">
        <p className="font-semibold">Hai câu hỏi phải trả lời trước khi chốt con số</p>
        <p className="mt-1">
          <b>Thời gian bảo trì có kế hoạch có nằm trong cửa sổ dịch vụ không?</b> Nếu loại trừ bảo
          trì thì mục tiêu dễ đạt hơn nhiều, và hai hệ thống cùng báo 99,5% có thể đang đo hai thứ
          khác nhau.
        </p>
        <p className="mt-1">
          <b>Gián đoạn được ghi nhận từ lúc nào?</b> Từ lúc hệ thống ngừng, hay từ lúc có người báo?
          Chênh lệch giữa hai cách đo thường lớn hơn cả sai số mà con số phần trăm đang cố kiểm soát.
        </p>
      </div>
    </div>
  )
}
