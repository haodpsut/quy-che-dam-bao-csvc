import type { Metadata } from 'next'
import { timDieu, chiTieuTheoDieu, CHI_TIEU } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, TrichDan, LinkChiTieu, LinkDieu } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Cổng tuân thủ',
  description:
    'Năm nhóm điều kiện bắt buộc phải đạt trước khi chấm điểm và xếp loại hiệu quả, theo Điều 6.',
}

/** Nhãn ngắn cho từng khoản của Điều 6, để dựng danh sách kiểm tra in ra được. */
const NHOM = [
  { khoan: 1, ten: 'Thẩm quyền, sở hữu và hồ sơ đầu tư', ma: 'C01' },
  { khoan: 2, ten: 'Xây dựng, phòng cháy chữa cháy, môi trường, an toàn, tiếp cận', ma: 'C02' },
  { khoan: 3, ten: 'Bản quyền, giấy phép, kiểm định, hiệu chuẩn, xử lý cuối vòng đời', ma: 'C04' },
  { khoan: 4, ten: 'An ninh mạng và bảo vệ dữ liệu cá nhân', ma: 'C03' },
  { khoan: 5, ten: 'Điều kiện đặc thù của phòng thí nghiệm, xưởng, studio, thư viện, đào tạo trực tuyến', ma: null },
]

export default function TrangCongTuanThu() {
  const d6 = timDieu(6)
  const cong = CHI_TIEU.filter((c) => c.laCongTuanThu)

  return (
    <Trang
      tieuDe="Cổng tuân thủ"
      canCu="Điều 6 — Cổng tuân thủ bắt buộc"
      phu={
        <p>
          Cổng tuân thủ là tập hợp điều kiện bắt buộc phải đạt <b>trước khi</b> chấm điểm và xếp
          loại hiệu quả (Điều 4 khoản 9). Đây là cơ chế phòng vệ chính của cả Quy định.
        </p>
      }
    >
      <Khoi loai="cam" tieuDe="Luật nền: tuân thủ là điều kiện tiên quyết">
        <p>
          Điều 3 khoản 1: tài sản hoặc dự án vi phạm điều kiện bắt buộc về thẩm quyền, quyền sở hữu,
          xây dựng, nghiệm thu, phòng cháy chữa cháy, môi trường, an toàn, khả năng tiếp cận, bản
          quyền, an ninh mạng hoặc dữ liệu cá nhân <b>không được xếp loại hiệu quả chỉ vì có mức sử
          dụng cao</b>.
        </p>
      </Khoi>

      <Muc ten="Năm nhóm điều kiện">
        <p className="mb-3 text-[14.5px]">
          Danh sách dưới đây in ra được để dùng làm phiếu kiểm tra thực địa. Mỗi nhóm ứng với một
          khoản của Điều 6.
        </p>
        <div className="space-y-3">
          {NHOM.map((n) => {
            const k = d6?.khoan.find((x) => x.so === n.khoan)
            return (
              <article key={n.khoan} className="khoi px-4 py-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15.5px] font-bold text-brand">
                    {n.khoan}. {n.ten}
                  </h3>
                  {n.ma && <LinkChiTieu ma={n.ma} />}
                </div>
                <p className="mt-1.5 text-justify text-[14.5px]">{k?.text}</p>
                <div className="khong-in mt-2.5 flex gap-3 text-[13px] text-muted">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" /> Đạt
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" /> Không đạt
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" /> Chưa đủ minh chứng
                  </label>
                </div>
              </article>
            )
          })}
        </div>
      </Muc>

      <Muc ten="Khi có vi phạm thì làm gì">
        <TrichDan nguon="Điều 6 khoản 6">
          Nếu có vi phạm nghiêm trọng hoặc chưa đủ bằng chứng về một điều kiện bắt buộc, Hội đồng
          đánh giá ghi trạng thái &ldquo;Không đạt cổng tuân thủ&rdquo; hoặc &ldquo;Chưa đủ minh
          chứng&rdquo;; không tính điểm tổng hợp để che lấp vi phạm. Báo cáo phải xác định biện
          pháp, người chịu trách nhiệm và thời hạn khắc phục.
        </TrichDan>
        <Khoi loai="canhBao" tieuDe="Hai trạng thái này khác nhau, đừng gộp">
          <p>
            <b>Không đạt cổng tuân thủ</b> nghĩa là đã biết có vi phạm. Hướng xử lý là khắc phục vi
            phạm, chỉ chấm lại khi đủ điều kiện.
          </p>
          <p>
            <b>Chưa đủ minh chứng</b> nghĩa là chưa biết. Hướng xử lý là bổ sung và xác minh dữ
            liệu. Kết luận &ldquo;không hiệu quả&rdquo; ở đây là kết luận vượt quá bằng chứng.
          </p>
          <p>Cả hai đều không tính điểm, nhưng dẫn tới hai hành động hoàn toàn khác nhau.</p>
        </Khoi>
      </Muc>

      <Muc ten="Chỉ tiêu mang vai trò cổng">
        <p className="mb-3 text-[14.5px]">
          {cong.length} trong số {CHI_TIEU.length} chỉ tiêu đóng vai trò cổng. Chúng không phải là
          thước để cộng điểm mà là điều kiện chặn.
        </p>
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-16">Mã</th>
                <th>Chỉ tiêu</th>
                <th>Vì sao là cổng</th>
              </tr>
            </thead>
            <tbody>
              {cong.map((c) => (
                <tr key={c.ma}>
                  <td>
                    <LinkChiTieu ma={c.ma} />
                  </td>
                  <td className="font-medium">{c.ten}</td>
                  <td className="text-[13px]">{c.canhBao ?? c.dienGiai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Khoi loai="nhan" tieuDe="A05 là trường hợp đặc biệt">
          <p>
            Diện tích 2,8 m² trên một người học quy đổi là ngưỡng pháp lý theo Chuẩn cơ sở giáo dục
            đại học, nên nó vừa là cổng vừa là chỉ tiêu đo được. Nhưng{' '}
            <LinkDieu so={17} khoan={4} /> nói rõ đạt ngưỡng này là <b>điều kiện tuân thủ, không
            phải bằng chứng duy nhất của hiệu quả sử dụng</b>.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Kiểm tra 100% với nhóm nào">
        <p className="text-[14.5px]">
          Điều 29 khoản 1 không cho lấy mẫu với: tài sản mức I; tài sản giá trị lớn theo ngưỡng; tài
          sản liên quan an toàn, phòng cháy chữa cháy, an ninh mạng hoặc dữ liệu cá nhân; tài sản
          không xác định được vị trí; tài sản ngừng sử dụng; dự án có dấu hiệu vượt chi phí, chậm
          tiến độ, khiếu nại hoặc sự cố nghiêm trọng.
        </p>
      </Muc>
    </Trang>
  )
}
