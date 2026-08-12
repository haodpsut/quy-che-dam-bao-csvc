import type { Metadata } from 'next'
import { NGUONG } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, LinkDieu, NhanTrangThai } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Phiếu đề xuất phê duyệt',
  description:
    'Danh sách các quyết định chuyên môn còn để trống trong Quy định, in ra được để trình cấp có thẩm quyền.',
}

/**
 * Những chỗ Quy định cố ý để trống, chờ quyết định của Trường.
 *
 * Web không được điền hộ. Điền một bộ trọng số trông hợp lý sẽ tạo cảm giác đã
 * có quyết định trong khi chưa ai quyết, và Điều 8 khoản 3 lại cấm sửa ngưỡng
 * sau khi đã có kết quả, nên sai lầm này rất khó gỡ về sau.
 */
const CAN_QUYET = [
  {
    muc: 'Số và ngày ban hành Quyết định',
    dieu: 0,
    ai: 'Hiệu trưởng',
    vi: 'Bản dự thảo còn để trống Số: .../QĐ-ĐHKTĐN và ngày tháng.',
  },
  {
    muc: 'Ngưỡng giá trị và danh mục cụ thể phân mức I, II, III',
    dieu: 5,
    ai: 'Hiệu trưởng hoặc cấp có thẩm quyền, duyệt hằng năm',
    vi: 'Quyết định toàn bộ cách lấy mẫu về sau: mức I phải kiểm 100%, mức II và III mới được lấy mẫu.',
  },
  {
    muc: 'Danh mục hồ sơ pháp lý áp dụng cho từng loại tài sản (C01)',
    dieu: 6,
    ai: 'Phòng Quản lý dự án và Quản trị thiết bị, phối hợp pháp chế',
    vi: 'Không có danh mục thì không xác định được thế nào là đủ hồ sơ, cổng tuân thủ không chạy được.',
  },
  {
    muc: 'Bộ chỉ tiêu áp dụng cho từng loại đối tượng trong kỳ',
    dieu: 27,
    ai: 'Cấp có thẩm quyền phê duyệt kế hoạch đánh giá',
    vi: 'Phụ lục I ghi rõ không phải tất cả chỉ tiêu đều áp dụng cho mọi đối tượng.',
  },
  {
    muc: 'Tỷ trọng cụ thể của năm nhóm trọng số, cho từng loại đối tượng',
    dieu: 9,
    ai: 'Cấp có thẩm quyền, trong kế hoạch đánh giá',
    vi: 'Tổng phải bằng 100% và phải duyệt trước kỳ đo. Không được hạ trọng số nhóm an toàn hay an ninh để bù trừ.',
  },
  {
    muc: 'Biên độ trừ điểm cho các chỉ tiêu kiểu khoảng tối ưu',
    dieu: 9,
    ai: 'Cấp có thẩm quyền, trong kế hoạch đánh giá',
    vi: 'Phụ lục II nói ngoài khoảng thì trừ điểm theo biên độ được duyệt. Thiếu biên độ thì không chấm được kiểu này.',
  },
  {
    muc: 'Cách xử lý giá trị bằng 0 với chỉ tiêu càng thấp càng tốt',
    dieu: 9,
    ai: 'Cấp có thẩm quyền, trong kế hoạch đánh giá',
    vi: 'Phụ lục II yêu cầu quy định trước. Coi mặc định là 100 điểm có thể sai, vì giá trị 0 nhiều khi nghĩa là chưa đo được.',
  },
  {
    muc: 'Định nghĩa "người dùng đủ điều kiện" cho từng hệ thống số',
    dieu: 23,
    ai: 'Bộ phận công nghệ thông tin',
    vi: 'Là mẫu số của D06. Lấy sai mẫu số làm tỷ lệ người dùng hoạt động sai hoàn toàn.',
  },
  {
    muc: 'Giờ khả dụng cho từng loại không gian học tập',
    dieu: 17,
    ai: 'Phòng Quản lý dự án và Quản trị thiết bị, phối hợp đơn vị đào tạo',
    vi: 'Là mẫu số của A03. Điều 17 khoản 2 yêu cầu quy định theo từng loại không gian.',
  },
  {
    muc: 'Cửa sổ dịch vụ, thời gian bảo trì và cách ghi nhận gián đoạn cho từng hệ thống',
    dieu: 21,
    ai: 'Bộ phận công nghệ thông tin',
    vi: 'Không có ba thứ này thì con số 99,5% không có nghĩa xác định.',
  },
  {
    muc: 'Ba nhóm thí điểm trong năm đầu áp dụng',
    dieu: 35,
    ai: 'Hiệu trưởng',
    vi: 'Điều 35 khoản 2 bắt buộc thí điểm tối thiểu ba nhóm trước khi áp dụng toàn diện.',
  },
]

export default function TrangPhieuDeXuat() {
  const chuaDuyet = NGUONG.filter((n) => n.trangThai === 'mucTieuChuaDuyet')

  return (
    <Trang
      tieuDe="Phiếu đề xuất phê duyệt"
      canCu="Điều 8 khoản 3, Điều 9 khoản 1, Điều 27 khoản 1, Điều 35"
      phu={
        <p>
          Quy định cố ý để trống nhiều chỗ, chờ quyết định của Trường. Trang này gom đúng những chỗ
          đó lại thành một danh sách in ra được, để Phòng Quản lý dự án và Quản trị thiết bị điền và
          trình cấp có thẩm quyền.
        </p>
      }
      rong
    >
      <Khoi loai="canhBao" tieuDe="Vì sao web không điền giúp">
        <p>
          Điền một bộ trọng số hay một ngưỡng trông hợp lý sẽ tạo cảm giác đã có quyết định trong
          khi chưa ai quyết. Điều 8 khoản 3 lại cấm điều chỉnh ngưỡng sau khi có kết quả, nên sai
          lầm này rất khó sửa về sau. Mọi ô dưới đây để trống là có chủ ý.
        </p>
      </Khoi>

      <Muc ten={`Phần A. Quyết định chuyên môn còn thiếu (${CAN_QUYET.length} mục)`}>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-8">#</th>
                <th className="min-w-[230px]">Nội dung cần quyết</th>
                <th className="min-w-[170px]">Thẩm quyền</th>
                <th className="min-w-[200px]">Vì sao không bỏ qua được</th>
                <th className="min-w-[150px]">Nội dung phê duyệt</th>
              </tr>
            </thead>
            <tbody>
              {CAN_QUYET.map((c, i) => (
                <tr key={c.muc}>
                  <td className="font-semibold">{i + 1}</td>
                  <td className="font-medium">
                    {c.muc}
                    {c.dieu > 0 && (
                      <span className="mt-0.5 block text-[12px] font-normal text-muted">
                        <LinkDieu so={c.dieu} />
                      </span>
                    )}
                  </td>
                  <td className="text-[13px]">{c.ai}</td>
                  <td className="text-[13px]">{c.vi}</td>
                  <td className="min-h-[2.5rem] bg-surface" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Muc>

      <Muc ten={`Phần B. Ngưỡng chờ phê duyệt (${chuaDuyet.length} mục)`}>
        <p className="mb-3 text-[14.5px]">
          Các con số dưới đây có trong văn bản nhưng chính văn bản nói rõ chúng chỉ thành mục tiêu
          khi được phê duyệt kèm kỳ áp dụng, phạm vi, nguồn dữ liệu và cơ sở xác định. Cột cuối để
          trống chờ quyết định: chọn con số trong văn bản, chọn con số khác, hay không đặt mục tiêu
          cho chỉ tiêu này trong kỳ.
        </p>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="min-w-[120px]">Con số trong văn bản</th>
                <th className="min-w-[210px]">Áp dụng cho</th>
                <th className="w-24">Điều</th>
                <th className="min-w-[150px]">Thẩm quyền</th>
                <th className="min-w-[130px]">Mức phê duyệt</th>
                <th className="min-w-[110px]">Kỳ áp dụng</th>
              </tr>
            </thead>
            <tbody>
              {chuaDuyet.map((n) => (
                <tr key={n.id}>
                  <td>
                    <span className="font-bold text-brand">{n.giaTri}</span>
                    <span className="mt-0.5 block">
                      <NhanTrangThai trangThai={n.trangThai} />
                    </span>
                  </td>
                  <td className="text-[13px]">{n.apDungCho}</td>
                  <td className="text-[13px]">
                    <LinkDieu so={n.dieu} khoan={n.khoan} />
                  </td>
                  <td className="text-[13px]">{n.thamQuyen}</td>
                  <td className="bg-surface" />
                  <td className="bg-surface" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Muc>

      <Muc ten="Phần C. Ý kiến và chữ ký">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="khoi px-4 py-3">
            <p className="text-[13px] font-semibold text-muted">Đơn vị đề xuất</p>
            <p className="font-medium">Phòng Quản lý dự án và Quản trị thiết bị</p>
            <div className="mt-8 border-t border-line pt-1.5 text-[12.5px] text-muted">
              Ký, ghi rõ họ tên
            </div>
          </div>
          <div className="khoi px-4 py-3">
            <p className="text-[13px] font-semibold text-muted">Ý kiến phối hợp</p>
            <p className="font-medium">
              Phòng Kế hoạch - Tài chính · Bộ phận CNTT · Đơn vị bảo đảm chất lượng
            </p>
            <div className="mt-8 border-t border-line pt-1.5 text-[12.5px] text-muted">
              Ký, ghi rõ họ tên
            </div>
          </div>
          <div className="khoi px-4 py-3 sm:col-span-2">
            <p className="text-[13px] font-semibold text-muted">Phê duyệt</p>
            <p className="font-medium">Hiệu trưởng hoặc cấp có thẩm quyền</p>
            <div className="mt-10 border-t border-line pt-1.5 text-[12.5px] text-muted">
              Ký, ghi rõ họ tên và đóng dấu
            </div>
          </div>
        </div>
      </Muc>

      <Khoi loai="nhan" tieuDe="Sau khi phê duyệt">
        <p>
          Khi có quyết định, cập nhật trạng thái các ngưỡng trong dữ liệu của trang: mục nào được
          duyệt sẽ chuyển từ <i>mục tiêu nội bộ chưa phê duyệt</i> sang <i>đã phê duyệt</i>, kèm số
          và ngày quyết định. Cổng kiểm số của trang sẽ tự đối chiếu lại toàn bộ.
        </p>
      </Khoi>

      <p className="khong-in mt-6 text-[13px] text-muted">
        Trang này thiết kế để in. Dùng chức năng in của trình duyệt, phần đầu trang và chân trang sẽ
        tự ẩn.
      </p>
    </Trang>
  )
}
