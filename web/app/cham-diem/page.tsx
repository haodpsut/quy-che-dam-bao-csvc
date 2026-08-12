import type { Metadata } from 'next'
import { timPhuLuc } from '@/lib/du-lieu'
import { THANG_XEP_LOAI, TRANG_THAI_NGOAI_THANG, O_HAI_TRUC } from '@/lib/cham-diem'
import { Trang, Khoi, Muc, TrichDan } from '@/components/ui'
import MayCham, { MinhHoaCong } from './may-cham'

export const metadata: Metadata = {
  title: 'Chấm điểm và xếp loại',
  description:
    'Năm kiểu chấm điểm của Phụ lục II, công thức điểm tổng hợp, ma trận trọng số, thang bảy mức xếp loại và ma trận hai trục cho tài sản.',
}

const MAU_HANG: Record<string, string> = {
  ok: 'bg-oksoft text-ok',
  tot: 'bg-oksoft text-ok',
  canCaiThien: 'bg-warnsoft text-warn',
  thap: 'bg-errsoft text-err',
  khong: 'bg-errsoft text-err',
}

export default function TrangChamDiem() {
  const pl2 = timPhuLuc('II')
  const bangTrongSo = pl2?.bang[1]

  return (
    <Trang
      tieuDe="Chấm điểm và xếp loại"
      canCu="Điều 9 và Phụ lục II — Phương pháp chấm điểm và xếp loại"
      phu={
        <p>
          Chấm điểm chỉ được thực hiện <b>sau</b> cổng tuân thủ. Trọng số phải phù hợp từng loại đối
          tượng và được phê duyệt trong kế hoạch đánh giá <b>trước khi</b> thu thập kết quả.
        </p>
      }
      rong
    >
      <Muc id="may" ten="Máy chấm điểm 5 kiểu">
        <p className="mb-3 text-[14.5px]">
          Đổi giá trị trong các ô dưới đây, hệ tính lại ngay theo đúng công thức Phụ lục II. Máy cố
          tình từ chối tính ở những chỗ văn bản đòi Trường phải quy định trước, thay vì tự chọn một
          giá trị mặc định.
        </p>
        <MayCham />
      </Muc>

      <Muc id="cong" ten="Cổng tuân thủ chặn điểm tổng như thế nào">
        <p className="mb-3 text-[14.5px]">
          Đây là luật quan trọng nhất của cả hệ đo. Thử bỏ dấu tích để thấy nó hoạt động.
        </p>
        <MinhHoaCong />
      </Muc>

      <Muc ten="Công thức điểm tổng hợp">
        <TrichDan nguon="Phụ lục II, mục 1">
          Điểm tổng hợp = Σ (Điểm chỉ tiêu × Trọng số chỉ tiêu). Tổng trọng số bằng 100%. Chỉ tính
          khi cổng tuân thủ đạt và dữ liệu trọng yếu đầy đủ. Trọng số phải được phê duyệt trước kỳ
          đo; không thay đổi sau khi biết kết quả.
        </TrichDan>
        <Khoi loai="canhBao" tieuDe="Chỉ tiêu không có điểm thì xử lý ra sao">
          <p>
            Văn bản không nói rõ, và đây là chỗ dễ làm sai theo hai hướng ngược nhau. Coi chỉ tiêu
            thiếu dữ liệu là <b>0 điểm</b> sẽ trừng phạt đơn vị vì lý do không phải hiệu quả kém.
            Lặng lẽ <b>bỏ nó khỏi mẫu số</b> lại làm điểm tổng cao lên một cách giả tạo.
          </p>
          <p>
            Cách trang này làm: tính điểm trên phần trọng số thực sự có dữ liệu, quy về thang 100, và{' '}
            <b>luôn hiển thị số chỉ tiêu bị bỏ</b> kèm theo. Người đọc thấy ngay điểm 85 dựa trên
            100% trọng số khác hẳn điểm 85 dựa trên 40% trọng số.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Năm nhóm trọng số theo từng loại đối tượng">
        {bangTrongSo && (
          <div className="bang-cuon">
            <table className="bang">
              <thead>
                <tr>
                  {bangTrongSo.rows[0].map((o, i) => (
                    <th key={i}>{o}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bangTrongSo.rows.slice(1).map((r, i) => (
                  <tr key={i}>
                    {r.map((o, j) => (
                      <td key={j} className={j === 0 ? 'font-semibold' : ''}>
                        {o}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Khoi loai="cam" tieuDe="Tỷ trọng cụ thể của từng nhóm hiện chưa có">
          <p>
            Phụ lục II ghi: tỷ trọng cụ thể do cấp có thẩm quyền phê duyệt trong kế hoạch đánh giá.
            Các kiểm soát pháp lý, an toàn, an ninh mạng và dữ liệu cá nhân vẫn là cổng tuân thủ,{' '}
            <b>không được hạ trọng số để bù trừ</b>.
          </p>
          <p>
            Trang này không điền giúp con số nào vào bảng trên. Điền hộ một bộ trọng số trông hợp lý
            sẽ tạo ra cảm giác đã có quyết định, trong khi thực tế chưa ai quyết.
          </p>
        </Khoi>
      </Muc>

      <Muc ten="Thang xếp loại">
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-32">Điểm</th>
                <th className="w-56">Xếp loại</th>
                <th>Cách xử lý</th>
              </tr>
            </thead>
            <tbody>
              {THANG_XEP_LOAI.map((m) => (
                <tr key={m.ten}>
                  <td className={`font-bold ${MAU_HANG[m.mau]}`}>
                    {m.tu === 90 ? '90 - 100' : m.tu === 0 ? 'Dưới 50' : `${m.tu} - dưới ${m.den}`}
                  </td>
                  <td className="font-semibold">{m.ten}</td>
                  <td className="text-[13px]">
                    {m.ten === 'Hiệu quả rất cao' &&
                      'Đạt cổng tuân thủ; kết quả vượt hoặc đạt đầy đủ mục tiêu; duy trì và nhân rộng có chọn lọc.'}
                    {m.ten === 'Hiệu quả tốt' &&
                      'Đạt cổng tuân thủ; còn một số cơ hội tối ưu không trọng yếu.'}
                    {m.ten === 'Đạt yêu cầu nhưng cần cải thiện' &&
                      'Có kết quả cơ bản nhưng phải có kế hoạch cải thiện và theo dõi.'}
                    {m.ten === 'Hiệu quả thấp' &&
                      'Cần phân tích nguyên nhân, điều chỉnh, điều chuyển hoặc cơ cấu lại.'}
                    {m.ten === 'Không hiệu quả' &&
                      'Xem xét dừng, thay thế, thu hồi, thanh lý hoặc giải pháp khác theo thẩm quyền.'}
                  </td>
                </tr>
              ))}
              {TRANG_THAI_NGOAI_THANG.map((t) => (
                <tr key={t.ten}>
                  <td className="font-semibold text-muted">Không tính điểm</td>
                  <td className="font-semibold">{t.ten}</td>
                  <td className="text-[13px]">{t.xuLy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Hai dòng cuối là trạng thái, không phải hạng thấp. Chúng đứng ngoài thang điểm và không so
          sánh được với các mức bên trên.
        </p>
      </Muc>

      <Muc ten="Tài sản phải phân loại trên hai trục, không chỉ một điểm số">
        <TrichDan nguon="Điều 9 khoản 4">
          Đối với tài sản, ngoài điểm tổng hợp phải phân loại trên hai trục: mức sử dụng và tình
          trạng/phù hợp kỹ thuật. Một tài sản có thể đồng thời quá tải và lạc hậu hoặc sử dụng thấp
          nhưng vẫn cần duy trì do yêu cầu dự phòng, an toàn hoặc chiến lược.
        </TrichDan>

        <div className="my-4 grid grid-cols-[auto_1fr_1fr] gap-2 text-[13px]">
          <div />
          <p className="text-center font-semibold text-muted">Sử dụng thấp</p>
          <p className="text-center font-semibold text-muted">Sử dụng cao</p>

          <p className="flex items-center font-semibold text-muted [writing-mode:vertical-rl] [text-orientation:mixed]">
            Kỹ thuật tốt
          </p>
          <O o="giuNguyen" />
          <O o="khaiThacTot" />

          <p className="flex items-center font-semibold text-muted [writing-mode:vertical-rl] [text-orientation:mixed]">
            Kỹ thuật kém
          </p>
          <O o="ungVienThanhLy" />
          <O o="uuTienThayThe" />
        </div>

        <Khoi loai="canhBao" tieuDe="Ô nguy hiểm nhất không phải ô dưới bên trái">
          <p>
            Trực giác thường lo cho tài sản dùng ít và hỏng. Nhưng ô đáng lo hơn là{' '}
            <b>sử dụng cao trên nền thiết bị đã xuống cấp</b>: nhiều người phụ thuộc vào một thứ sắp
            hỏng, và một điểm số tổng cao vì mức sử dụng tốt sẽ che mất đúng rủi ro đó.
          </p>
        </Khoi>
      </Muc>
    </Trang>
  )
}

function O({ o }: { o: keyof typeof O_HAI_TRUC }) {
  const x = O_HAI_TRUC[o]
  const nguyHiem = o === 'uuTienThayThe'
  return (
    <div
      className={`rounded-md border px-3 py-2.5 ${
        nguyHiem ? 'border-err bg-errsoft' : 'border-line bg-surface'
      }`}
    >
      <p className={`font-bold ${nguyHiem ? 'text-err' : 'text-brand'}`}>{x.ten}</p>
      <p className="mt-0.5 text-[12.5px]">{x.moTa}</p>
      <p className="mt-1.5 text-[12.5px] text-muted">{x.bienPhap}</p>
    </div>
  )
}
