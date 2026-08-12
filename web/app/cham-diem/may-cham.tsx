'use client'

import { useState } from 'react'
import {
  chamMotChiTieu,
  chamTong,
  xepLoai,
  type KieuCham,
  type ThamSoCham,
} from '@/lib/cham-diem'

/**
 * Máy chấm điểm tương tác.
 *
 * Yêu cầu tự đặt: người dùng đổi tham số THẬT rồi hệ tính lại thật, không phải
 * bấm nút để phát lại một kịch bản dựng sẵn. Một núm giả ở đây sẽ dạy sai âm
 * thầm, vì người xem tin rằng mình vừa thấy công thức chạy.
 */

const KIEU: { khoa: KieuCham; ten: string; congThuc: string }[] = [
  { khoa: 'caoCangTot', ten: 'Càng cao càng tốt', congThuc: 'min(100; TH / MT × 100)' },
  { khoa: 'thapCangTot', ten: 'Càng thấp càng tốt', congThuc: 'min(100; MT / TH × 100)' },
  { khoa: 'khoangToiUu', ten: 'Khoảng tối ưu', congThuc: '100 trong khoảng, ngoài khoảng trừ theo biên độ' },
  { khoa: 'datKhongDat', ten: 'Đạt / không đạt', congThuc: '100 nếu đạt, 0 nếu không' },
  { khoa: 'dinhTinh', ten: 'Định tính 5 mức', congThuc: '20 / 40 / 60 / 80 / 100' },
]

const MAU_TRANG_THAI: Record<string, string> = {
  tinhDuoc: 'khoi-dat',
  canQuyDinh: 'khoi-canh-bao',
  thieuMucTieu: 'khoi-canh-bao',
  khongCham: 'khoi-nhan',
  duLieuSai: 'khoi-cam',
}

function O({
  nhan,
  giaTri,
  onChange,
  goiY,
}: {
  nhan: string
  giaTri: string
  onChange: (v: string) => void
  goiY?: string
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[13px] font-semibold">{nhan}</span>
      <input
        type="number"
        inputMode="decimal"
        step="any"
        value={giaTri}
        onChange={(e) => onChange(e.target.value)}
        className="o-nhap"
      />
      {goiY && <span className="mt-0.5 block text-[12px] text-muted">{goiY}</span>}
    </label>
  )
}

/** Chuỗi rỗng phải thành undefined chứ không thành 0, nếu không máy sẽ chấm một ô trống thành 0 điểm. */
function so(s: string): number | undefined {
  if (s.trim() === '') return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n : undefined
}

export default function MayCham() {
  const [kieu, setKieu] = useState<KieuCham>('caoCangTot')
  const [thucHien, setThucHien] = useState('78')
  const [mucTieu, setMucTieu] = useState('85')
  const [duoi, setDuoi] = useState('70')
  const [tren, setTren] = useState('85')
  const [bienDo, setBienDo] = useState('15')
  const [dat, setDat] = useState(true)
  const [muc, setMuc] = useState<1 | 2 | 3 | 4 | 5>(3)

  const tham: ThamSoCham = {
    kieu,
    thucHien: so(thucHien),
    mucTieu: so(mucTieu),
    khoangDuoi: so(duoi),
    khoangTren: so(tren),
    bienDo: so(bienDo),
    dat,
    mucDinhTinh: muc,
  }
  const kq = chamMotChiTieu(tham)

  // So sánh chéo: cùng dữ liệu vào, các kiểu chấm khác cho ra gì.
  const soSanh = KIEU.map((k) => ({ ...k, kq: chamMotChiTieu({ ...tham, kieu: k.khoa }) }))

  return (
    <div>
      <div className="khoi px-4 py-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {KIEU.map((k) => (
            <button
              key={k.khoa}
              type="button"
              onClick={() => setKieu(k.khoa)}
              aria-pressed={kieu === k.khoa}
              className={`rounded-md border px-2.5 py-1 text-[13px] transition ${
                kieu === k.khoa
                  ? 'border-brand bg-brand font-semibold text-white'
                  : 'border-line-dam bg-bg hover:border-brand hover:text-brand'
              }`}
            >
              {k.ten}
            </button>
          ))}
        </div>

        <p className="mb-3 rounded-md bg-surface px-3 py-2 font-mono text-[13px]">
          {KIEU.find((k) => k.khoa === kieu)?.congThuc}
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {(kieu === 'caoCangTot' || kieu === 'thapCangTot') && (
            <>
              <O nhan="Thực hiện (TH)" giaTri={thucHien} onChange={setThucHien} />
              <O
                nhan="Mục tiêu (MT)"
                giaTri={mucTieu}
                onChange={setMucTieu}
                goiY="Phải được phê duyệt trước kỳ đo"
              />
            </>
          )}
          {kieu === 'khoangToiUu' && (
            <>
              <O nhan="Thực hiện" giaTri={thucHien} onChange={setThucHien} />
              <O nhan="Cận dưới của khoảng" giaTri={duoi} onChange={setDuoi} />
              <O nhan="Cận trên của khoảng" giaTri={tren} onChange={setTren} />
              <O
                nhan="Biên độ trừ điểm"
                giaTri={bienDo}
                onChange={setBienDo}
                goiY="Lệch đúng bằng biên độ thì về 0 điểm"
              />
            </>
          )}
          {kieu === 'datKhongDat' && (
            <div className="sm:col-span-3">
              <span className="mb-1 block text-[13px] font-semibold">Kết quả</span>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    onClick={() => setDat(v)}
                    aria-pressed={dat === v}
                    className={`rounded-md border px-3 py-1.5 text-[13px] ${
                      dat === v ? 'border-brand bg-brand font-semibold text-white' : 'border-line-dam'
                    }`}
                  >
                    {v ? 'Đạt' : 'Không đạt'}
                  </button>
                ))}
              </div>
            </div>
          )}
          {kieu === 'dinhTinh' && (
            <div className="sm:col-span-3">
              <span className="mb-1 block text-[13px] font-semibold">Mức đánh giá</span>
              <div className="flex flex-wrap gap-2">
                {([1, 2, 3, 4, 5] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMuc(m)}
                    aria-pressed={muc === m}
                    className={`rounded-md border px-3 py-1.5 text-[13px] ${
                      muc === m ? 'border-brand bg-brand font-semibold text-white' : 'border-line-dam'
                    }`}
                  >
                    Mức {m}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[12px] text-muted">
                Mỗi mức phải có mô tả và bằng chứng kèm theo, không chấm cảm tính.
              </p>
            </div>
          )}
        </div>

        <div className={`${MAU_TRANG_THAI[kq.trangThai]} mt-4 rounded-r-md px-4 py-3`}>
          <p className="text-[15px]">
            <span className="text-2xl font-bold">
              {kq.diem === null ? 'Không cho ra điểm' : `${kq.diem} điểm`}
            </span>
            {kq.diem !== null && xepLoai(kq.diem) && (
              <span className="ml-2 text-[14px]">
                (nếu đây là điểm tổng: <b>{xepLoai(kq.diem)!.ten}</b>)
              </span>
            )}
          </p>
          <p className="mt-1 text-[13.5px]">{kq.giaiThich}</p>
        </div>
      </div>

      {/* --------------------------------------------------------------
          Đây là chỗ máy này có ích nhất: cùng một dữ liệu vào, đổi kiểu
          chấm cho ra kết quả khác hẳn. Đó là lý do Quy định bắt phê duyệt
          kiểu chấm và trọng số TRƯỚC kỳ đo, không phải sau khi thấy số.
          -------------------------------------------------------------- */}
      <div className="mt-5">
        <h3 className="mb-2 text-[15px] font-bold">Cùng dữ liệu này, các kiểu chấm khác cho ra gì</h3>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th>Kiểu chấm</th>
                <th className="w-28">Điểm</th>
                <th>Vì sao</th>
              </tr>
            </thead>
            <tbody>
              {soSanh.map((s) => (
                <tr key={s.khoa} className={s.khoa === kieu ? 'bg-brandsoft' : ''}>
                  <td className="font-medium">{s.ten}</td>
                  <td className="font-bold">{s.kq.diem === null ? '—' : s.kq.diem}</td>
                  <td className="text-[13px]">{s.kq.giaiThich}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Bảng này tính lại thật theo giá trị bạn vừa nhập, không phải bảng số cứng. Chênh lệch giữa
          các dòng chính là lý do Điều 9 khoản 1 bắt phê duyệt trọng số và kiểu chấm trước khi thu
          thập kết quả.
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/** Minh hoạ luật cứng: cổng tuân thủ hỏng thì điểm tổng là null, dù mọi chỉ tiêu đều 100. */
export function MinhHoaCong() {
  const [datCong, setDatCong] = useState(true)
  const [duMinhChung, setDuMinhChung] = useState(true)

  const thanhPhan = [
    { ma: 'A03', diem: 95, trongSo: 30 },
    { ma: 'A08', diem: 100, trongSo: 30 },
    { ma: 'A02', diem: 98, trongSo: 40 },
  ]
  const kq = chamTong(thanhPhan, datCong, duMinhChung)
  const hang = xepLoai(kq.diem)

  return (
    <div className="khoi px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-start gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={datCong}
            onChange={(e) => setDatCong(e.target.checked)}
            className="mt-1"
          />
          <span>
            <b>Đạt cổng tuân thủ</b>
            <span className="block text-[12.5px] text-muted">
              Hồ sơ pháp lý, PCCC, an ninh mạng, bản quyền đều đủ
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={duMinhChung}
            onChange={(e) => setDuMinhChung(e.target.checked)}
            className="mt-1"
          />
          <span>
            <b>Đủ minh chứng trọng yếu</b>
            <span className="block text-[12.5px] text-muted">Dữ liệu trọng yếu có nguồn và xác nhận</span>
          </span>
        </label>
      </div>

      <div className="mt-3 bang-cuon">
        <table className="bang">
          <thead>
            <tr>
              <th>Chỉ tiêu</th>
              <th>Điểm thành phần</th>
              <th>Trọng số</th>
            </tr>
          </thead>
          <tbody>
            {thanhPhan.map((t) => (
              <tr key={t.ma}>
                <td className="font-medium">{t.ma}</td>
                <td>{t.diem}</td>
                <td>{t.trongSo}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`${kq.diem === null ? 'khoi-cam' : 'khoi-dat'} mt-3 rounded-r-md px-4 py-3`}
      >
        <p className="text-[15px]">
          <span className="text-2xl font-bold">
            {kq.diem === null ? 'Không tính điểm tổng' : `${kq.diem} điểm`}
          </span>
          {hang && <span className="ml-2 font-semibold">— {hang.ten}</span>}
        </p>
        <p className="mt-1 text-[13.5px]">{kq.giaiThich}</p>
      </div>

      <p className="mt-2 text-[13px] text-muted">
        Bỏ dấu tích ở ô cổng tuân thủ: điểm thành phần vẫn 95, 100, 98 nhưng điểm tổng biến mất hoàn
        toàn, không phải tụt xuống một con số thấp. Luật này nằm ở tầng hàm tính toán chứ không phải
        ở giao diện, nên không có đường nào lấy điểm cao che lấp vi phạm.
      </p>
    </div>
  )
}
