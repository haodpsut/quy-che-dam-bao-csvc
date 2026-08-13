import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CHI_TIEU, timChiTieu, timDieu, nguongCuaChiTieu, NHOM_CHI_TIEU, LOP_NHAN } from '@/lib/du-lieu'
import { KIEU_CHAM_NHAN } from '@/data/chi-tieu'
import { Trang, Khoi, Muc, NhanTrangThai, NguonNguong, LinkDieu, LinkChiTieu, Nhan } from '@/components/ui'

export function generateStaticParams() {
  return CHI_TIEU.map((c) => ({ ma: c.ma.toLowerCase() }))
}

export async function generateMetadata({ params }: PageProps<'/chi-tieu/[ma]'>): Promise<Metadata> {
  const { ma } = await params
  const c = timChiTieu(ma)
  if (!c) return { title: 'Không tìm thấy chỉ tiêu' }
  return { title: `${c.ma} — ${c.ten}`, description: c.congThuc }
}

/** Giải thích ngắn cho từng kiểu chấm, để trang chỉ tiêu tự đứng được. */
const GIAI_THICH_KIEU: Record<string, string> = {
  caoCangTot: 'Điểm = min(100; Thực hiện / Mục tiêu × 100). Chỉ dùng khi quan hệ tăng là tích cực trong toàn miền đánh giá.',
  thapCangTot: 'Điểm = min(100; Mục tiêu / Thực hiện × 100). Phải quy định trước cách xử lý giá trị bằng 0.',
  khoangToiUu: 'Đạt 100 điểm trong khoảng; ngoài khoảng trừ điểm theo biên độ được duyệt. Phạt cả thiếu lẫn quá tải.',
  datKhongDat: '100 điểm nếu đạt, 0 điểm nếu không đạt. Vi phạm pháp lý nghiêm trọng phải xử ở cổng tuân thủ, không chỉ cho 0 điểm.',
  dinhTinh: 'Chấm theo bảng tiêu chí 5 mức, quy đổi 20/40/60/80/100. Chỉ tiêu trọng yếu cần tối thiểu hai người đánh giá.',
  boiCanh: 'Không quy ra điểm. Chính văn bản cấm coi chỉ tiêu này là tốt hay xấu một cách máy móc.',
}

export default async function TrangMotChiTieu({ params }: PageProps<'/chi-tieu/[ma]'>) {
  const { ma } = await params
  const c = timChiTieu(ma)
  if (!c) notFound()

  const nguong = nguongCuaChiTieu(c.ma)
  const cungNhom = CHI_TIEU.filter((x) => x.nhom === c.nhom && x.ma !== c.ma)

  return (
    <Trang
      tieuDe={`${c.ma} — ${c.ten}`}
      canCu={`Phụ lục I, nhóm ${c.nhom}: ${NHOM_CHI_TIEU[c.nhom]}`}
      phu={
        <div className="flex flex-wrap gap-1.5">
          {/* Nhãn nhóm chỉ ghi mã nhóm. Ghi cả tên nhóm sẽ trùng chữ với nhãn
              lớp ngay bên cạnh, vì với nhóm A và D hai tên đó y hệt nhau, và
              hai nhãn giống nhau nằm cạnh nhau trông như lỗi hiển thị. */}
          <Nhan loai="nhom">Nhóm {c.nhom}</Nhan>
          {c.lop.map((l) => (
            <Nhan key={l}>{LOP_NHAN[l]}</Nhan>
          ))}
          <Nhan>{KIEU_CHAM_NHAN[c.kieuCham]}</Nhan>
          {c.laCongTuanThu && <span className="nhan nhan-phaply">Cổng tuân thủ</span>}
        </div>
      }
    >
      {c.laCongTuanThu && (
        <Khoi loai="cam" tieuDe="Đây là điều kiện cổng, không phải một chỉ tiêu để cộng điểm">
          <p>
            Không đạt chỉ tiêu này thì <b>không chấm điểm tổng hợp</b>, chứ không phải cho 0 điểm rồi
            cộng bù. Điều 6 khoản 6 nói rõ: không tính điểm tổng hợp để che lấp vi phạm; báo cáo phải
            xác định biện pháp, người chịu trách nhiệm và thời hạn khắc phục.
          </p>
        </Khoi>
      )}

      {c.kieuCham === 'boiCanh' && (
        <Khoi loai="canhBao" tieuDe="Chỉ số bối cảnh, không quy ra điểm">
          <p>
            Chỉ tiêu này vẫn đo được nhưng văn bản cấm coi giá trị cao hay thấp là tốt hay xấu. Đưa
            nó vào công thức chấm điểm là tạo ra một động cơ ngược với điều Quy định muốn.
          </p>
        </Khoi>
      )}

      <Muc ten="Nguyên văn ở Phụ lục I">
        <div className="bang-cuon">
          <table className="bang">
            <tbody>
              <tr>
                <th className="w-40">Công thức / cách đo</th>
                <td>{c.congThuc}</td>
              </tr>
              <tr>
                <th>Nguồn dữ liệu</th>
                <td>{c.nguon}</td>
              </tr>
              <tr>
                <th>Tần suất đo</th>
                <td>{c.tanSuat || <span className="text-muted">không ghi riêng</span>}</td>
              </tr>
              <tr>
                <th>Cách diễn giải / mục tiêu</th>
                <td>{c.dienGiai}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Muc>

      {c.canhBao && (
        <Muc ten="Cảnh báo khi dùng chỉ tiêu này">
          <Khoi loai="canhBao">
            <p>{c.canhBao}</p>
          </Khoi>
        </Muc>
      )}

      <Muc ten="Cách chấm điểm">
        <div className="khoi px-4 py-3">
          <p className="font-semibold text-brand">{KIEU_CHAM_NHAN[c.kieuCham]}</p>
          <p className="mt-1 text-[14.5px]">{GIAI_THICH_KIEU[c.kieuCham]}</p>
          <p className="mt-2 text-[13px] text-muted">
            Kiểu chấm ở đây là phần đọc ra từ thân Quy định, không có sẵn trong bảng Phụ lục I. Trọng
            số cụ thể do cấp có thẩm quyền phê duyệt trong kế hoạch đánh giá trước kỳ đo.{' '}
            <Link href="/cham-diem" className="text-brand underline underline-offset-2">
              Thử máy chấm điểm
            </Link>
            .
          </p>
        </div>
      </Muc>

      <Muc ten="Ngưỡng liên quan">
        {nguong.length === 0 ? (
          <p className="text-[14.5px] text-muted">
            Văn bản không gắn con số ngưỡng cụ thể nào cho chỉ tiêu này. Mục tiêu phải được xác lập
            trong kế hoạch đánh giá trước kỳ đo (Điều 8 khoản 3).
          </p>
        ) : (
          <div className="space-y-2.5">
            {nguong.map((n) => (
              <div key={n.id} className="khoi px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-[16px] font-bold text-brand">{n.giaTri}</p>
                  <NhanTrangThai trangThai={n.trangThai} />
                </div>
                <p className="mt-1 text-[14px]">{n.apDungCho}</p>
                <p className="mt-1.5 text-[13px] italic text-muted">{n.trichDan}</p>
                {n.thamQuyen && (
                  <p className="mt-1 text-[13px]">
                    <b>Ai phê duyệt được:</b> {n.thamQuyen}
                  </p>
                )}
                <p className="mt-1 text-[13px]">
                  <NguonNguong dieu={n.dieu} khoan={n.khoan} phuLuc={n.phuLuc} /> ·{' '}
                  <Link href="/nguong" className="text-brand underline underline-offset-2">
                    Xem toàn bộ ngưỡng
                  </Link>
                </p>
              </div>
            ))}
          </div>
        )}
      </Muc>

      <Muc ten="Điều khoản nói về chỉ tiêu này">
        <ul className="space-y-1.5">
          {c.dieuLienQuan.map((so) => {
            const d = timDieu(so)
            return (
              <li key={so} className="text-[14.5px]">
                <LinkDieu so={so} ten={d?.ten} />
              </li>
            )
          })}
        </ul>
      </Muc>

      <Muc ten={`Chỉ tiêu khác cùng nhóm ${c.nhom}`}>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[14px]">
          {cungNhom.map((x) => (
            <LinkChiTieu key={x.ma} ma={x.ma} ten={x.ten} />
          ))}
        </div>
      </Muc>
    </Trang>
  )
}
