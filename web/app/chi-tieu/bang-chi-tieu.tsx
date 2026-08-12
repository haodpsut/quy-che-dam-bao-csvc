'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { ChiTieu, NhomChiTieu } from '@/lib/du-lieu'
import { KIEU_CHAM_NHAN, type KieuCham, type Lop } from '@/data/chi-tieu'

const NHOM: { khoa: NhomChiTieu; ten: string }[] = [
  { khoa: 'C', ten: 'C — Cổng tuân thủ' },
  { khoa: 'F', ten: 'F — Tài chính' },
  { khoa: 'I', ten: 'I — Dự án đầu tư' },
  { khoa: 'A', ten: 'A — Tài sản, CSVC' },
  { khoa: 'D', ten: 'D — Hạ tầng số' },
]

const LOP: { khoa: Lop; ten: string }[] = [
  { khoa: 'taiChinh', ten: 'Sức khoẻ tài chính' },
  { khoa: 'duAn', ten: 'Dự án đầu tư' },
  { khoa: 'taiSan', ten: 'Tài sản, CSVC' },
  { khoa: 'haTangSo', ten: 'Hạ tầng số' },
]

const KIEU: KieuCham[] = ['caoCangTot', 'thapCangTot', 'khoangToiUu', 'datKhongDat', 'dinhTinh', 'boiCanh']

const TAN_SUAT: { khoa: string; ten: string; khop: RegExp }[] = [
  { khoa: 'thang', ten: 'Tháng', khop: /tháng/i },
  { khoa: 'quy', ten: 'Quý', khop: /quý/i },
  { khoa: 'hocky', ten: 'Học kỳ', khop: /học kỳ/i },
  { khoa: 'nam', ten: 'Năm', khop: /năm/i },
]

function Nut({
  dang,
  onClick,
  children,
}: {
  dang: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={dang}
      className={`rounded-md border px-2.5 py-1 text-[13px] transition ${
        dang
          ? 'border-brand bg-brand text-white font-semibold'
          : 'border-line-dam bg-bg text-ink hover:border-brand hover:text-brand'
      }`}
    >
      {children}
    </button>
  )
}

export default function BangChiTieu({ chiTieu }: { chiTieu: ChiTieu[] }) {
  const [nhom, setNhom] = useState<NhomChiTieu | null>(null)
  const [lop, setLop] = useState<Lop | null>(null)
  const [kieu, setKieu] = useState<KieuCham | null>(null)
  const [tanSuat, setTanSuat] = useState<string | null>(null)
  const [chiCong, setChiCong] = useState(false)
  const [tim, setTim] = useState('')

  const ketQua = useMemo(() => {
    const q = tim.trim().toLowerCase()
    return chiTieu.filter((c) => {
      if (nhom && c.nhom !== nhom) return false
      if (lop && !c.lop.includes(lop)) return false
      if (kieu && c.kieuCham !== kieu) return false
      if (chiCong && !c.laCongTuanThu) return false
      if (tanSuat) {
        const t = TAN_SUAT.find((x) => x.khoa === tanSuat)
        if (t && !t.khop.test(c.tanSuat)) return false
      }
      if (q) {
        const kho = `${c.ma} ${c.ten} ${c.congThuc} ${c.dienGiai} ${c.nguon}`.toLowerCase()
        if (!kho.includes(q)) return false
      }
      return true
    })
  }, [chiTieu, nhom, lop, kieu, tanSuat, chiCong, tim])

  const xoaLoc = () => {
    setNhom(null)
    setLop(null)
    setKieu(null)
    setTanSuat(null)
    setChiCong(false)
    setTim('')
  }
  const dangLoc = nhom || lop || kieu || tanSuat || chiCong || tim

  return (
    <div>
      <div className="khong-in khoi mb-4 space-y-3 px-4 py-3.5">
        <div>
          <input
            type="search"
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            placeholder="Tìm theo mã, tên, công thức, nguồn dữ liệu..."
            className="o-nhap"
            aria-label="Tìm chỉ tiêu"
          />
        </div>

        <div className="space-y-2 text-[12.5px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-20 shrink-0 font-semibold text-muted">Nhóm mã</span>
            {NHOM.map((n) => (
              <Nut key={n.khoa} dang={nhom === n.khoa} onClick={() => setNhom(nhom === n.khoa ? null : n.khoa)}>
                {n.ten}
              </Nut>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-20 shrink-0 font-semibold text-muted">Lớp</span>
            {LOP.map((l) => (
              <Nut key={l.khoa} dang={lop === l.khoa} onClick={() => setLop(lop === l.khoa ? null : l.khoa)}>
                {l.ten}
              </Nut>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-20 shrink-0 font-semibold text-muted">Kiểu chấm</span>
            {KIEU.map((k) => (
              <Nut key={k} dang={kieu === k} onClick={() => setKieu(kieu === k ? null : k)}>
                {KIEU_CHAM_NHAN[k]}
              </Nut>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-20 shrink-0 font-semibold text-muted">Tần suất</span>
            {TAN_SUAT.map((t) => (
              <Nut key={t.khoa} dang={tanSuat === t.khoa} onClick={() => setTanSuat(tanSuat === t.khoa ? null : t.khoa)}>
                {t.ten}
              </Nut>
            ))}
            <Nut dang={chiCong} onClick={() => setChiCong(!chiCong)}>
              Chỉ cổng tuân thủ
            </Nut>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-2.5 text-[13px]">
          <p>
            <b>{ketQua.length}</b> / {chiTieu.length} chỉ tiêu
            {ketQua.length === 0 && ' — không có chỉ tiêu nào khớp bộ lọc này'}
          </p>
          {dangLoc && (
            <button type="button" onClick={xoaLoc} className="font-semibold text-brand underline underline-offset-2">
              Xoá bộ lọc
            </button>
          )}
        </div>
      </div>

      <div className="bang-cuon">
        <table className="bang">
          <thead>
            <tr>
              <th className="w-14">Mã</th>
              <th className="min-w-[180px]">Chỉ tiêu</th>
              <th className="min-w-[240px]">Công thức / cách đo</th>
              <th className="min-w-[130px]">Nguồn và tần suất</th>
              <th className="min-w-[130px]">Kiểu chấm</th>
            </tr>
          </thead>
          <tbody>
            {ketQua.map((c) => (
              <tr key={c.ma}>
                <td className="whitespace-nowrap">
                  <Link
                    href={`/chi-tieu/${c.ma.toLowerCase()}`}
                    className="font-bold text-brand underline underline-offset-2"
                  >
                    {c.ma}
                  </Link>
                </td>
                <td>
                  <span className="font-medium">{c.ten}</span>
                  {c.laCongTuanThu && <span className="nhan nhan-phaply ml-1.5">cổng</span>}
                  {c.canhBao && (
                    <span className="mt-1 block text-[12px] text-warn" title={c.canhBao}>
                      ⚠ {c.canhBao.length > 90 ? c.canhBao.slice(0, 90) + '…' : c.canhBao}
                    </span>
                  )}
                </td>
                <td className="text-[13px]">{c.congThuc}</td>
                <td className="text-[13px]">{c.nguonVaTanSuat}</td>
                <td className="text-[13px]">
                  <span className={`nhan ${c.kieuCham === 'boiCanh' ? 'nhan-chuaduyet' : 'nhan-trung'}`}>
                    {KIEU_CHAM_NHAN[c.kieuCham]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ketQua.length === 0 && (
        <p className="mt-3 text-[14px] text-muted">
          Bộ lọc hiện tại không khớp chỉ tiêu nào. Đây là kết quả thật chứ không phải lỗi tải dữ
          liệu: tổng số chỉ tiêu là {chiTieu.length}.
        </p>
      )}
    </div>
  )
}
