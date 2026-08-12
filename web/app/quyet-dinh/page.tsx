import type { Metadata } from 'next'
import { QUYET_DINH } from '@/lib/du-lieu'
import { Trang, Khoi, Muc } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Quyết định ban hành và căn cứ pháp lý',
  description: 'Bốn điều của Quyết định ban hành và 12 căn cứ pháp lý được viện dẫn.',
}

/**
 * Hai căn cứ dưới đây đã có toàn văn trong hệ thống văn bản pháp quy của Trường.
 * Nối sang đó thay vì chép lại, để chỉ có một bản chân lý cho mỗi văn bản.
 */
const CO_TOAN_VAN: { khop: RegExp; ten: string }[] = [
  { khop: /49\/2026\/TT-BGDĐT/, ten: 'Thông tư 49/2026 về ứng dụng công nghệ trong giáo dục' },
  { khop: /01\/2024\/TT-BGDĐT/, ten: 'Thông tư 01/2024 — Chuẩn cơ sở giáo dục đại học' },
]

export default function TrangQuyetDinh() {
  return (
    <Trang
      tieuDe="Quyết định ban hành và căn cứ pháp lý"
      canCu="Quyết định số .../QĐ-ĐHKTĐN của Hiệu trưởng Trường Đại học Kiến trúc Đà Nẵng"
      phu={
        <p>
          Bản gốc còn để trống số hiệu và ngày ký, nên trang giữ nguyên dấu ba chấm thay vì điền
          giúp. Số và ngày sẽ do Hiệu trưởng quyết định khi ký ban hành.
        </p>
      }
    >
      <Muc ten={`Căn cứ pháp lý (${QUYET_DINH.canCu.length})`}>
        <ol className="space-y-2">
          {QUYET_DINH.canCu.map((c, i) => {
            const noi = CO_TOAN_VAN.find((x) => x.khop.test(c))
            return (
              <li key={i} className="khoi px-3.5 py-2.5 text-[14.5px]">
                <p className="text-justify">{c}</p>
                {noi && (
                  <p className="mt-1.5 text-[12.5px] text-muted">
                    Văn bản này đã có toàn văn trong kho văn bản pháp quy của Trường: {noi.ten}.
                  </p>
                )}
              </li>
            )
          })}
        </ol>
        <p className="mt-3 text-[14px]">{QUYET_DINH.deNghi}</p>
      </Muc>

      <Muc ten="Nội dung Quyết định">
        <div className="space-y-3">
          {QUYET_DINH.dieu.map((d) => (
            <div key={d.so} className="khoi px-4 py-3 text-[15px]">
              <p className="text-justify">{d.text}</p>
            </div>
          ))}
        </div>
      </Muc>

      <Muc ten="Ba mốc thời gian phải nhớ">
        <Khoi loai="nhan">
          <p>
            <b>Ngày ký</b> — Quyết định có hiệu lực. Số và ngày hiện còn trống trong bản dự thảo.
          </p>
          <p>
            <b>15 tháng 8 năm 2026</b> — mốc áp dụng các nội dung thực hiện Thông tư 49/2026. Nếu
            Quyết định được ký sau mốc này thì áp dụng kể từ ngày ký (Điều 3 Quyết định, Điều 25
            khoản 5, Điều 35 khoản 3).
          </p>
          <p>
            <b>Năm đầu áp dụng</b> — thí điểm tối thiểu ba nhóm rồi mới áp dụng toàn diện (Điều 35
            khoản 2).
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Phạm vi Quyết định không bao trùm">
        <Khoi loai="canhBao" tieuDe="Quy định này là lớp quản trị bổ sung, không thay thế pháp luật">
          <p>
            Điều 1 khoản 4: đối với tài sản công, tài sản do Nhà nước giao quản lý, dự án sử dụng
            vốn đầu tư công hoặc đối tượng chịu chế độ pháp lý chuyên ngành, ngoài Quy định này phải
            thực hiện đầy đủ pháp luật tương ứng.
          </p>
          <p>
            Quy định <b>không thay thế</b> thủ tục đầu tư, mua sắm, đấu thầu, nghiệm thu, kiểm kê,
            kế toán, thanh lý và báo cáo bắt buộc theo pháp luật. Điều 11 khoản 6 nhắc lại ý này cho
            riêng nhóm dự án thuộc diện giám sát, đánh giá đầu tư.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Bảng quốc hiệu và nơi nhận">
        <div className="bang-cuon">
          <table className="bang">
            <tbody>
              {(QUYET_DINH.header ?? []).map((r, i) => (
                <tr key={`h${i}`}>
                  {r.map((o, j) => (
                    <td key={j}>{o}</td>
                  ))}
                </tr>
              ))}
              {(QUYET_DINH.noiNhan ?? []).map((r, i) => (
                <tr key={`n${i}`}>
                  {r.map((o, j) => (
                    <td key={j}>{o}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Muc>
    </Trang>
  )
}
