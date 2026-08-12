import type { Metadata } from 'next'
import { timDieu, chiTieuTheoNhom } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, TrichDan, LinkChiTieu, LinkDieu } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Vòng đời dự án đầu tư',
  description:
    'Chương III: sức khoẻ tài chính, năm giai đoạn vòng đời dự án, tiêu chí từng giai đoạn và kết luận sau đánh giá.',
}

const GIAI_DOAN = [
  {
    khoan: 1,
    ten: 'Trước đầu tư',
    dieu: 12,
    chiTieu: [],
    tom: 'Xác định vấn đề, nhu cầu, giá trị cơ sở, các phương án, tổng chi phí sở hữu, lợi ích, rủi ro và chỉ số thành công.',
  },
  {
    khoan: 2,
    ten: 'Theo dõi thực hiện',
    dieu: 13,
    chiTieu: ['I01', 'I02'],
    tom: 'Kiểm soát phạm vi, chi phí, tiến độ, chất lượng, thay đổi, rủi ro, hợp đồng và sự sẵn sàng đưa vào sử dụng.',
  },
  {
    khoan: 3,
    ten: 'Đánh giá kết thúc',
    dieu: 13,
    chiTieu: ['I03', 'I04'],
    tom: 'Kiểm tra nghiệm thu, hồ sơ hoàn công, đào tạo người sử dụng, dữ liệu tài sản, bảo hành, an toàn và mức sẵn sàng vận hành.',
  },
  {
    khoan: 4,
    ten: 'Sau đầu tư',
    dieu: 14,
    chiTieu: ['I05', 'I06', 'I07', 'I09'],
    tom: 'Đo mức sử dụng, lợi ích thực hiện, chi phí vòng đời và vấn đề phát sinh tại mốc 6, 12 và 24 tháng với dự án trọng yếu.',
  },
  {
    khoan: 5,
    ten: 'Tác động hoặc đột xuất',
    dieu: 14,
    chiTieu: ['I08'],
    tom: 'Thực hiện sau thời gian đủ để hình thành tác động, hoặc khi có dấu hiệu thất thoát, sự cố, thay đổi lớn về nhu cầu hay công nghệ.',
  },
]

export default function TrangVongDoi() {
  const nhomI = chiTieuTheoNhom('I')
  const nhomF = chiTieuTheoNhom('F')
  const d11 = timDieu(11)
  const d12 = timDieu(12)
  const d15 = timDieu(15)

  return (
    <Trang
      tieuDe="Dự án đầu tư theo vòng đời"
      canCu="Chương III — Điều 10 đến Điều 15"
      phu={
        <p>
          Lớp đánh giá thứ nhất, gồm {nhomI.length} chỉ tiêu I01 đến I09. Chương này còn chứa nhóm{' '}
          {nhomF.length} chỉ tiêu tài chính F01 đến F05, nhưng chúng thuộc lớp bối cảnh chứ không
          phải lớp dự án.
        </p>
      }
      rong
    >
      <Muc ten="Sức khoẻ tài chính là bối cảnh, không phải thước đo dự án">
        <Khoi loai="cam" tieuDe="Ranh giới quan trọng nhất của chương này">
          <p className="text-justify">{timDieu(10)?.khoan.find((k) => k.so === 1)?.text}</p>
          <p>
            Nghĩa là không được lập luận kiểu &ldquo;Trường năm nay tự cân đối được thu chi nên dự
            án này hiệu quả&rdquo;, cũng không được kết luận ngược lại. Hai việc khác nhau.
          </p>
        </Khoi>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-16">Mã</th>
                <th className="min-w-[160px]">Chỉ tiêu tài chính</th>
                <th className="min-w-[200px]">Công thức</th>
                <th className="min-w-[180px]">Lưu ý</th>
              </tr>
            </thead>
            <tbody>
              {nhomF.map((c) => (
                <tr key={c.ma}>
                  <td>
                    <LinkChiTieu ma={c.ma} />
                  </td>
                  <td className="font-medium">{c.ten}</td>
                  <td className="text-[13px]">{c.congThuc}</td>
                  <td className="text-[13px]">{c.canhBao ?? c.dienGiai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Bốn ngưỡng 100%, 15-30%, 60-70%, 10-15% gắn với nhóm này đều{' '}
          <b>chưa được phê duyệt</b> theo <LinkDieu so={10} khoan={4} />.
        </p>
      </Muc>

      <Muc ten="Năm giai đoạn vòng đời">
        <div className="space-y-3">
          {GIAI_DOAN.map((g) => (
            <article key={g.khoan} className="khoi px-4 py-3.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[14px] font-bold text-white">
                  {g.khoan}
                </span>
                <h3 className="text-[16px] font-bold text-brand">{g.ten}</h3>
                <span className="text-[13px] text-muted">
                  tiêu chí ở <LinkDieu so={g.dieu} />
                </span>
              </div>
              <p className="mt-1.5 text-justify text-[14.5px]">
                {d11?.khoan.find((k) => k.so === g.khoan)?.text}
              </p>
              {g.chiTieu.length > 0 && (
                <p className="mt-2 text-[13px]">
                  <b>Chỉ tiêu chính: </b>
                  {g.chiTieu.map((m, i) => (
                    <span key={m}>
                      {i > 0 && ', '}
                      <LinkChiTieu ma={m} />
                    </span>
                  ))}
                </p>
              )}
            </article>
          ))}
        </div>

        <Khoi loai="canhBao" tieuDe="Quy trình nội bộ không thay thế nghĩa vụ pháp lý">
          <p className="text-justify">{d11?.khoan.find((k) => k.so === 6)?.text}</p>
        </Khoi>
      </Muc>

      <Muc ten="Trước khi quyết định đầu tư: so sánh phương án, không chỉ thẩm định một phương án">
        <TrichDan nguon="Điều 12 khoản 3">{d12?.khoan.find((k) => k.so === 3)?.text}</TrichDan>
        <p className="text-[14.5px]">
          Sáu phương án được liệt kê, và phương án đầu tiên là <b>không đầu tư</b>. Một hồ sơ chỉ
          thẩm định phương án mua mới, không xét tới việc tối ưu tài sản hiện có, điều chuyển hay
          thuê dịch vụ, là hồ sơ chưa đáp ứng khoản này.
        </p>
        <Khoi loai="nhan" tieuDe="Khi nào không dùng NPV và IRR">
          <p className="text-justify">{d12?.khoan.find((k) => k.so === 8)?.text}</p>
          <p>
            Đây là khoản đáng chú ý với môi trường đại học: phần lớn dự án phục vụ đào tạo và nghiên
            cứu không có dòng tiền xác định được, nên ép chúng vào khuôn NPV sẽ cho ra những con số
            trông chuyên nghiệp mà không có ý nghĩa. Hướng thay thế là chi phí trên kết quả, xem{' '}
            <LinkChiTieu ma="I08" />.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Sau đánh giá thì được làm gì">
        <p className="mb-2 text-justify text-[14.5px]">{d15?.khoan.find((k) => k.so === 1)?.text}</p>
        <Khoi loai="cam" tieuDe="Kết quả đánh giá không tự động trở thành quyết định">
          <p className="text-justify">{d15?.khoan.find((k) => k.so === 2)?.text}</p>
          <p>
            Câu cuối là ràng buộc quan trọng: việc quyết định phải tuân thủ thẩm quyền và quy trình
            riêng, <b>không được tự động thực hiện chỉ từ kết quả đánh giá</b>. Một phần mềm chấm ra
            điểm thấp rồi tự đề xuất thanh lý là đã vượt quá vai trò mà Quy định giao cho nó.
          </p>
        </Khoi>
      </Muc>

      <Muc ten={`${nhomI.length} chỉ tiêu nhóm I`}>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-16">Mã</th>
                <th className="min-w-[160px]">Chỉ tiêu</th>
                <th className="min-w-[230px]">Công thức</th>
                <th className="min-w-[120px]">Tần suất</th>
              </tr>
            </thead>
            <tbody>
              {nhomI.map((c) => (
                <tr key={c.ma}>
                  <td>
                    <LinkChiTieu ma={c.ma} />
                  </td>
                  <td className="font-medium">{c.ten}</td>
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
