import type { Metadata } from 'next'
import { timDieu } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, TrichDan, LinkDieu } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Trách nhiệm các đơn vị',
  description:
    'Điều 26 và Điều 33: thành phần Hội đồng đánh giá, trách nhiệm sáu nhóm đơn vị và quy tắc độc lập.',
}

/** Ai xác nhận loại dữ liệu nào, theo Điều 28 khoản 2. Đây là ma trận quan trọng nhất khi vận hành. */
const XAC_NHAN = [
  { loai: 'Dữ liệu tài sản, công trình, bảo trì, sử dụng', don: 'Phòng Quản lý dự án và Quản trị thiết bị' },
  { loai: 'Dữ liệu tài chính, chi phí, nguồn vốn', don: 'Phòng Kế hoạch - Tài chính' },
  { loai: 'Nhật ký hệ thống, mức dịch vụ, an ninh, dữ liệu', don: 'Bộ phận công nghệ thông tin' },
  {
    loai: 'Phương pháp, khảo sát, bằng chứng kết quả đào tạo và nghiên cứu',
    don: 'Đơn vị bảo đảm chất lượng',
  },
]

export default function TrangTrachNhiem() {
  const d33 = timDieu(33)
  const d26 = timDieu(26)
  const d34 = timDieu(34)

  return (
    <Trang
      tieuDe="Trách nhiệm và tổ chức thực hiện"
      canCu="Chương VII — Điều 33 và Điều 34; Điều 26 về Hội đồng đánh giá"
    >
      <Muc ten="Quy tắc nền: không ai tự chấm mình">
        <Khoi loai="cam" tieuDe="Độc lập tương đối giữa ba vai">
          <p className="text-justify">{d26?.khoan.find((k) => k.so === 3)?.text}</p>
          <p>
            Điều 3 khoản 6 nói cùng ý ở mức nguyên tắc: bảo đảm độc lập tương đối giữa{' '}
            <b>đơn vị quản lý tài sản</b>, <b>đơn vị cung cấp dữ liệu</b> và{' '}
            <b>đơn vị xác nhận kết quả</b>. Ba vai này có thể do ba đơn vị khác nhau đảm nhiệm, chứ
            không dồn về một đầu mối cho tiện.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Ai xác nhận loại dữ liệu nào">
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="min-w-[260px]">Loại dữ liệu</th>
                <th className="min-w-[240px]">Đơn vị xác nhận</th>
              </tr>
            </thead>
            <tbody>
              {XAC_NHAN.map((x) => (
                <tr key={x.loai}>
                  <td>{x.loai}</td>
                  <td className="font-medium">{x.don}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Theo <LinkDieu so={28} khoan={2} />. Đơn vị quản lý và sử dụng tự đánh giá theo biểu mẫu,
          nhưng phần xác nhận thuộc về các đơn vị trên.
        </p>
      </Muc>

      <Muc ten="Trách nhiệm sáu nhóm đơn vị">
        <div className="space-y-3">
          {d33?.khoan.map((k) => {
            const [ten, ...phan] = k.text.replace(/^\d+\.\s*/, '').split(':')
            return (
              <article key={k.so} className="khoi px-4 py-3.5">
                <h3 className="text-[15.5px] font-bold text-brand">{ten}</h3>
                <p className="mt-1 text-justify text-[14.5px]">{phan.join(':').trim()}</p>
              </article>
            )
          })}
        </div>
      </Muc>

      <Muc ten="Thành phần Hội đồng hoặc Tổ đánh giá">
        <p className="text-justify text-[14.5px]">{d26?.khoan.find((k) => k.so === 1)?.text}</p>
        <p className="mt-2 text-justify text-[14.5px]">{d26?.khoan.find((k) => k.so === 2)?.text}</p>
      </Muc>

      <Muc ten="Công khai kết quả tới đâu">
        <p className="mb-2 text-justify text-[14.5px]">{d34?.khoan.find((k) => k.so === 1)?.text}</p>
        <Khoi loai="cam" tieuDe="Sáu loại thông tin không được công khai">
          <p className="text-justify">{d34?.khoan.find((k) => k.so === 2)?.text}</p>
          <p>
            Đây là ràng buộc trực tiếp lên bất kỳ trang công khai kết quả nào: dữ liệu cá nhân, cấu
            hình an ninh, lỗ hổng, bí mật kinh doanh, giá trị nhạy cảm và thông tin hạn chế tiếp cận
            phải bị loại trước khi đăng. Điều 7 khoản 4 bổ sung: báo cáo công khai phải được tổng
            hợp hoặc ẩn danh phù hợp.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Hồ sơ phải lưu những gì">
        <TrichDan nguon="Điều 34 khoản 3">{d34?.khoan.find((k) => k.so === 3)?.text}</TrichDan>
        <p className="text-[14.5px]">
          Chú ý cụm cuối: <b>bằng chứng đóng kiến nghị</b> cũng phải lưu. Một kiến nghị được đánh
          dấu hoàn thành mà không có bằng chứng kèm theo là chưa đóng được, theo Điều 31 khoản 3.
        </p>
      </Muc>
    </Trang>
  )
}
