import type { Metadata } from 'next'
import { timDieu, chiTieuTheoNhom } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, TrichDan, LinkChiTieu, LinkDieu, NhanTrangThai } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Cơ sở vật chất và trang thiết bị',
  description:
    'Chương IV: chỉ tiêu chung về tài sản, phòng học, phòng thí nghiệm, công trình hạ tầng kỹ thuật và quản lý vòng đời tài sản.',
}

export default function TrangCoSoVatChat() {
  const nhomA = chiTieuTheoNhom('A')
  const d17 = timDieu(17)
  const d19 = timDieu(19)
  const d20 = timDieu(20)

  return (
    <Trang
      tieuDe="Cơ sở vật chất và trang thiết bị"
      canCu="Chương IV — Điều 16 đến Điều 20"
      phu={
        <p>
          Lớp đánh giá thứ hai, gồm {nhomA.length} chỉ tiêu A01 đến A14. Chương này chứa ngưỡng pháp
          lý duy nhất của cả Quy định và cũng chứa nhiều lệnh cấm tối ưu ngược nhất.
        </p>
      }
      rong
    >
      <Muc ten="Phòng học và không gian học tập">
        <Khoi loai="canhBao" tieuDe="Mức sử dụng phải đo đồng thời hai thứ, không phải một">
          <p>
            Điều 17 khoản 1 yêu cầu đo cùng lúc <b>tỷ lệ sử dụng thời gian</b> và{' '}
            <b>tỷ lệ lấp đầy chỗ ngồi</b>. Một phòng 200 chỗ được xếp lịch kín nhưng mỗi buổi chỉ có
            30 người sẽ đạt điểm rất cao ở chỉ tiêu thứ nhất và rất thấp ở chỉ tiêu thứ hai. Chỉ đo
            một trong hai sẽ kết luận ngược nhau về cùng một căn phòng.
          </p>
        </Khoi>

        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-16">Mã</th>
                <th>Cách đo</th>
              </tr>
            </thead>
            <tbody>
              {d17?.khoan
                .find((k) => k.so === 1)
                ?.diem.map((p, i) => (
                  <tr key={p.ky}>
                    <td>
                      <LinkChiTieu ma={i === 0 ? 'A03' : i === 1 ? 'A04' : 'A02'} />
                    </td>
                    <td>{p.text}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Khoi loai="nhan" tieuDe="Giờ khả dụng không phải là 24 giờ mỗi ngày">
          <p className="text-justify">{d17?.khoan.find((k) => k.so === 2)?.text}</p>
          <p>
            Điều 4 khoản 6 định nghĩa: giờ khả dụng là thời gian có thể xếp lịch{' '}
            <b>hợp pháp, an toàn và phù hợp chức năng</b>, sau khi loại trừ bảo trì có kế hoạch và
            thời gian không thể sử dụng có căn cứ. Mẫu số này quyết định toàn bộ con số tỷ lệ, nên
            nó phải được quy định trước cho từng loại không gian.
          </p>
        </Khoi>

        <div className="khoi mt-4 px-4 py-3.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-[17px] font-bold text-brand">2,8 m² / người học quy đổi</p>
            <NhanTrangThai trangThai="phapLy" />
          </div>
          <p className="mt-1.5 text-justify text-[14.5px]">{d17?.khoan.find((k) => k.so === 4)?.text}</p>
          <p className="mt-1.5 text-[13px] text-muted">
            Đây là ngưỡng bắt buộc theo pháp luật duy nhất trong cả Quy định, căn cứ Thông tư
            01/2024/TT-BGDĐT. Xem <LinkChiTieu ma="A05" />.
          </p>
        </div>
      </Muc>

      <Muc ten="Phòng thí nghiệm, studio, xưởng thực hành">
        <Khoi loai="canhBao" tieuDe="Phải tách chức năng giảng dạy và nghiên cứu">
          <p>
            Điều 14 khoản 6: đầu ra nghiên cứu được tính theo thời gian, mức đóng góp và độ trễ hợp
            lý, <b>không cộng cơ học các bài báo, đề tài và sản phẩm có giá trị khác nhau</b>.
          </p>
          <p>
            Vì vậy có hai chỉ tiêu riêng chứ không phải một: <LinkChiTieu ma="A13" /> cho chức năng
            giảng dạy và <LinkChiTieu ma="A14" /> cho chức năng nghiên cứu. Gộp chúng lại sẽ làm một
            phòng thí nghiệm dạy tốt nhưng ít công bố trông như kém hiệu quả.
          </p>
        </Khoi>
        <p className="text-[14.5px]">
          Ngoài mức sử dụng, Điều 18 còn yêu cầu đo thời gian chờ, xung đột lịch, an toàn, hiệu
          chuẩn, vật tư tiêu hao, năng lực người vận hành, mức hài lòng và mức phù hợp với chuẩn đầu
          ra. <LinkDieu so={18} />.
        </p>
      </Muc>

      <Muc ten="Công trình, hạ tầng kỹ thuật, năng lượng">
        <Khoi loai="cam" tieuDe="Không được đòi chi phí giảm tuyệt đối hằng năm">
          <p className="text-justify">{d19?.khoan.find((k) => k.so === 5)?.text}</p>
          <p>
            Đây là lý do <LinkChiTieu ma="A11" /> và <LinkChiTieu ma="A12" /> được xếp là chỉ số bối
            cảnh, không quy ra điểm. Cắt chi phí điện bằng cách tắt điều hoà giảng đường là một cách
            đạt chỉ tiêu mà làm hỏng đúng thứ cơ sở vật chất tồn tại để phục vụ.
          </p>
          <p>
            Cặp đôi phải đọc cùng nhau: chi phí bảo trì giảm mà <LinkChiTieu ma="A10" /> tồn đọng
            bảo trì tăng thì không phải tiết kiệm, chỉ là hoãn nợ.
          </p>
        </Khoi>
        <p className="text-[14.5px]">
          Điều 19 khoản 3 yêu cầu cường độ điện và nước phải chuẩn hoá theo diện tích, số người, giờ
          hoạt động, công suất, <b>thời tiết</b>, giá và chức năng không gian. So sánh hoá đơn điện
          tháng 6 với tháng 12 mà không chuẩn hoá thời tiết là so hai thứ khác nhau.
        </p>
      </Muc>

      <Muc ten="Vòng đời và xử lý tài sản">
        <Khoi loai="canhBao" tieuDe="Sử dụng thấp không tự động dẫn tới thanh lý">
          <p className="text-justify">{d20?.khoan.find((k) => k.so === 2)?.text}</p>
        </Khoi>
        <Khoi loai="cam" tieuDe="Thiết bị có dữ liệu phải xoá an toàn trước khi rời khỏi Trường">
          <p className="text-justify">{d20?.khoan.find((k) => k.so === 3)?.text}</p>
        </Khoi>
      </Muc>

      <Muc ten={`${nhomA.length} chỉ tiêu nhóm A`}>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-16">Mã</th>
                <th className="min-w-[170px]">Chỉ tiêu</th>
                <th className="min-w-[220px]">Công thức / cách đo</th>
                <th className="min-w-[110px]">Tần suất</th>
              </tr>
            </thead>
            <tbody>
              {nhomA.map((c) => (
                <tr key={c.ma}>
                  <td>
                    <LinkChiTieu ma={c.ma} />
                  </td>
                  <td className="font-medium">
                    {c.ten}
                    {c.laCongTuanThu && <span className="nhan nhan-phaply ml-1.5">cổng</span>}
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

      <Muc ten="Ba mức trọng yếu quyết định cách kiểm tra">
        <TrichDan nguon="Điều 5 khoản 3 và 4">
          Mức I - trọng yếu: dự án, tài sản giá trị lớn; công trình, phòng thí nghiệm hoặc hệ thống
          liên quan trực tiếp đến tính mạng, an toàn, dữ liệu cá nhân, an ninh mạng, hoạt động đào
          tạo cốt lõi hoặc uy tín của Trường. Ngưỡng giá trị và danh mục cụ thể cho từng mức do Hiệu
          trưởng hoặc cấp có thẩm quyền phê duyệt hằng năm.
        </TrichDan>
        <p className="text-[14px] text-muted">
          Ngưỡng giá trị phân mức I, II, III <b>hiện chưa có</b>. Đây là một trong những quyết định
          phải có trước khi chạy kỳ đánh giá đầu tiên.
        </p>
      </Muc>
    </Trang>
  )
}
