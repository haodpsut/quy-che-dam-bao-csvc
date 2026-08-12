import type { Metadata } from 'next'
import { timDieu, chiTieuTheoNhom } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, TrichDan, LinkChiTieu, LinkDieu } from '@/components/ui'
import OTinhUptime from './o-tinh-uptime'

export const metadata: Metadata = {
  title: 'Hạ tầng số, công nghệ thông tin, dữ liệu và trí tuệ nhân tạo',
  description:
    'Chương V: phân tầng hệ thống, thoả thuận mức dịch vụ, chỉ tiêu vận hành, an ninh mạng, dữ liệu cá nhân và hệ thống AI.',
}

const TANG = [
  {
    so: 1,
    ten: 'Trọng yếu',
    mau: 'border-err bg-errsoft',
    vd: 'Mạng lõi, định danh và xác thực, LMS, hệ thống dữ liệu và quản trị cốt lõi, cổng thông tin, sao lưu, an ninh',
    dk: 'Gián đoạn ảnh hưởng lớn đến đào tạo hoặc an toàn',
  },
  {
    so: 2,
    ten: 'Quan trọng',
    mau: 'border-warn bg-warnsoft',
    vd: 'Hệ thống phục vụ nhiều đơn vị',
    dk: 'Có phương án thay thế tạm thời',
  },
  {
    so: 3,
    ten: 'Hỗ trợ',
    mau: 'border-line bg-surface',
    vd: 'Hệ thống có phạm vi hẹp',
    dk: 'Ít phụ thuộc, có thể khôi phục trong thời gian dài hơn',
  },
]

export default function TrangHaTangSo() {
  const nhomD = chiTieuTheoNhom('D')
  const d21 = timDieu(21)
  const d24 = timDieu(24)
  const d25 = timDieu(25)

  return (
    <Trang
      tieuDe="Hạ tầng số, dữ liệu và trí tuệ nhân tạo"
      canCu="Chương V — Điều 21 đến Điều 25"
      phu={
        <p>
          Lớp đánh giá thứ ba, gồm {nhomD.length} chỉ tiêu D01 đến D15. Đây là chương có nhiều bẫy
          đo lường nhất, vì phần lớn dữ liệu do chính hệ thống tự sinh ra.
        </p>
      }
      rong
    >
      <Muc ten="Phân tầng hệ thống">
        <p className="mb-3 text-[14.5px]">
          Mọi mục tiêu mức dịch vụ đều gắn với tầng, không có một mục tiêu chung cho tất cả.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {TANG.map((t) => (
            <div key={t.so} className={`rounded-md border-l-4 border border-line px-4 py-3 ${t.mau}`}>
              <p className="font-bold text-brand">
                Tầng {t.so} — {t.ten}
              </p>
              <p className="mt-1 text-[13px]">{t.vd}</p>
              <p className="mt-1.5 text-[12.5px] text-muted">{t.dk}</p>
            </div>
          ))}
        </div>
        <Khoi loai="nhan" tieuDe="Mỗi hệ thống phải khai báo 9 thông số">
          <p className="text-justify">{d21?.khoan.find((k) => k.so === 2)?.text}</p>
        </Khoi>
      </Muc>

      <Muc id="uptime" ten="99,5% nghĩa là bao nhiêu giờ">
        <TrichDan nguon="Điều 21 khoản 3">{d21?.khoan.find((k) => k.so === 3)?.text}</TrichDan>
        <OTinhUptime />
      </Muc>

      <Muc ten="Bốn bẫy đo lường trong chương này">
        <div className="space-y-3">
          <Khoi loai="cam" tieuDe="Bẫy 1. Số sự cố an ninh thấp không có nghĩa là an toàn">
            <p className="text-justify">{d24?.khoan.find((k) => k.so === 1)?.text}</p>
            <p>
              Vì vậy <LinkChiTieu ma="D10" /> được xếp là chỉ số bối cảnh, không quy ra điểm. Đặt
              mục tiêu giảm số sự cố là thưởng cho việc không phát hiện và không báo cáo.
            </p>
          </Khoi>

          <Khoi loai="cam" tieuDe="Bẫy 2. Mẫu số của tỷ lệ người dùng hoạt động">
            <p>
              Điều 23 khoản 1: tỷ lệ người dùng hoạt động phải tính trên{' '}
              <b>số người dùng đủ điều kiện hoặc được cấp phép</b>, không tính cơ học trên toàn bộ
              người học và người lao động nếu họ không thuộc nhóm mục tiêu.
            </p>
            <p>
              Điều 4 khoản 7 định nghĩa riêng khái niệm này. Lấy sai mẫu số làm một hệ thống dùng
              tốt trông như bị bỏ hoang, và ngược lại. Xem <LinkChiTieu ma="D06" />.
            </p>
          </Khoi>

          <Khoi loai="cam" tieuDe="Bẫy 3. Sao lưu thành công không chứng minh khôi phục được">
            <p>
              Điều 22 khoản 3 tách bạch hai việc: tỷ lệ sao lưu thành công và{' '}
              <b>tỷ lệ kiểm thử khôi phục thành công</b>. Chỉ cái thứ hai chứng minh dữ liệu lấy lại
              được. Xem <LinkChiTieu ma="D04" /> và <LinkChiTieu ma="D05" />.
            </p>
          </Khoi>

          <Khoi loai="cam" tieuDe="Bẫy 4. Lượt truy cập không phải bằng chứng học tập">
            <p className="text-justify">{d25?.khoan.find((k) => k.so === 4)?.text}</p>
          </Khoi>
        </div>
      </Muc>

      <Muc ten="Hệ thống trí tuệ nhân tạo">
        <TrichDan nguon="Điều 25 khoản 3">{d25?.khoan.find((k) => k.so === 3)?.text}</TrichDan>
        <Khoi loai="canhBao" tieuDe="Sáu thứ phải đo với một hệ thống AI">
          <p>
            Chất lượng nhiệm vụ; tỷ lệ lỗi có ảnh hưởng; tỷ lệ cần can thiệp của con người; khả năng
            giải thích hoặc truy vết; mức công khai việc sử dụng AI; chi phí trên nhiệm vụ{' '}
            <b>thành công</b>.
          </p>
          <p>
            Chi tiết đáng chú ý: mẫu số là nhiệm vụ <b>thành công</b>, không phải tổng số nhiệm vụ.
            Một hệ thống rẻ nhưng hay sai sẽ lộ ra ở cách tính này, trong khi chi phí trên tổng số
            nhiệm vụ sẽ che mất. Xem <LinkChiTieu ma="D15" />.
          </p>
        </Khoi>
        <p className="mt-2 text-[14px]">
          <LinkDieu so={25} khoan={5} />: các hệ thống phải đáp ứng yêu cầu về an toàn, quyền riêng
          tư, khả năng tiếp cận, kiểm soát gian lận, chất lượng dữ liệu và trách nhiệm giải trình
          theo Thông tư 49/2026/TT-BGDĐT <b>kể từ ngày 15 tháng 8 năm 2026</b>.
        </p>
      </Muc>

      <Muc ten={`${nhomD.length} chỉ tiêu nhóm D`}>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-16">Mã</th>
                <th className="min-w-[170px]">Chỉ tiêu</th>
                <th className="min-w-[220px]">Công thức / cách đo</th>
                <th className="min-w-[120px]">Tần suất</th>
              </tr>
            </thead>
            <tbody>
              {nhomD.map((c) => (
                <tr key={c.ma}>
                  <td>
                    <LinkChiTieu ma={c.ma} />
                  </td>
                  <td className="font-medium">
                    {c.ten}
                    {c.kieuCham === 'boiCanh' && (
                      <span className="nhan nhan-chuaduyet ml-1.5">bối cảnh</span>
                    )}
                  </td>
                  <td className="text-[13px]">{c.congThuc}</td>
                  <td className="text-[13px]">{c.tanSuat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Muc>
    </Trang>
  )
}
