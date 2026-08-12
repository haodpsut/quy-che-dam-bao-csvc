import type { Metadata } from 'next'
import { timPhuLuc, timDieu } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, TrichDan, LinkDieu } from '@/components/ui'
import OTinhMau from './o-tinh-mau'

export const metadata: Metadata = {
  title: 'Lấy mẫu theo rủi ro',
  description:
    'Ma trận lấy mẫu năm mức rủi ro theo Phụ lục IV, kèm ô tính cỡ mẫu gợi ý và các ràng buộc bắt buộc.',
}

export default function TrangLayMau() {
  const pl4 = timPhuLuc('IV')
  const bang = pl4?.bang[0]
  const d29 = timDieu(29)

  return (
    <Trang
      tieuDe="Lấy mẫu theo rủi ro và trọng yếu"
      canCu="Điều 29 và Phụ lục IV — Ma trận lấy mẫu theo rủi ro và trọng yếu"
      phu={
        <p>
          Nguyên tắc gốc ở Điều 3 khoản 6: áp dụng nguyên tắc trọng yếu và rủi ro. Không phải mọi
          tài sản đều được kiểm tra như nhau, nhưng cũng không có tỷ lệ cố định nào áp cho tất cả.
        </p>
      }
    >
      <Muc id="tinh" ten="Ô tính cỡ mẫu gợi ý">
        <OTinhMau />
      </Muc>

      <Muc ten="Ma trận năm mức rủi ro">
        {bang && (
          <div className="bang-cuon">
            <table className="bang">
              <thead>
                <tr>
                  {bang.rows[0].map((o, i) => (
                    <th key={i}>{o}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bang.rows.slice(1).map((r, i) => (
                  <tr key={i}>
                    {r.map((o, j) => (
                      <td key={j} className={j === 0 ? 'whitespace-nowrap font-semibold' : ''}>
                        {o}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-[13px] text-muted">{pl4?.doan.join(' ')}</p>
      </Muc>

      <Muc ten="Ba ràng buộc không được bỏ qua">
        <Khoi loai="cam" tieuDe="Một. Nhóm bắt buộc kiểm 100% không được lấy mẫu">
          <p className="text-justify">{d29?.khoan.find((k) => k.so === 1)?.text}</p>
        </Khoi>
        <Khoi loai="canhBao" tieuDe="Hai. 10% - 20% không phải tỷ lệ mặc định">
          <p className="text-justify">{d29?.khoan.find((k) => k.so === 2)?.text}</p>
          <p>
            Hai chữ dễ bỏ qua nhất trong khoản này là <b>sau khi đã thực hiện phân tầng</b>. Lấy
            ngẫu nhiên 15% từ một danh sách chưa phân tầng không phải là lấy mẫu theo rủi ro, mà chỉ
            là lấy ngẫu nhiên.
          </p>
        </Khoi>
        <Khoi loai="nhan" tieuDe="Ba. Quy định nội bộ không được giảm phạm vi so với pháp luật">
          <p>
            Dòng cuối của Phụ lục IV: với đối tượng có tần suất kiểm tra, kiểm định, kiểm kê bắt
            buộc, phải làm theo đúng yêu cầu bắt buộc. Tỷ lệ mẫu trong Quy định này là lớp quản trị
            bổ sung, không thay thế nghĩa vụ pháp lý.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Kiểm tra bằng cách nào">
        <p className="text-justify text-[14.5px]">{d29?.khoan.find((k) => k.so === 3)?.text}</p>
        <p className="mt-2 text-[13px] text-muted">
          Nguyên văn ở <LinkDieu so={29} khoan={3} />.
        </p>
      </Muc>

      <Muc ten="Vì sao phải ghi lại phần không kiểm tra">
        <TrichDan nguon="Ghi chú Phụ lục IV">
          Hội đồng đánh giá phải ghi nhận cơ sở chọn mẫu, sai lệch, phần không kiểm tra và ảnh hưởng
          đến độ tin cậy của kết luận.
        </TrichDan>
        <p className="text-[14.5px]">
          Một báo cáo nói &ldquo;đã kiểm tra và kết quả tốt&rdquo; mà không nói đã kiểm bao nhiêu
          phần trăm sẽ được đọc như thể đã kiểm hết. Đây là lý do yêu cầu ghi phần không kiểm tra
          nằm ngay trong văn bản, chứ không phải một thói quen tốt tuỳ chọn.
        </p>
      </Muc>
    </Trang>
  )
}
