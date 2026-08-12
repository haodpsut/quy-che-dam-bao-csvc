import type { Metadata } from 'next'
import { timPhuLuc, timDieu } from '@/lib/du-lieu'
import { Trang, Khoi, Muc, TrichDan, LinkDieu } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Quy trình 8 bước',
  description:
    'Tám bước đánh giá theo Phụ lục III, kèm chủ trì, sản phẩm đầu ra, thời hạn và hai chỗ có cổng chặn.',
}

/**
 * Ghi chú riêng cho từng bước, nói rõ chỗ nào là cổng và chỗ nào có vòng lặp.
 * Bảng Phụ lục III trình bày 8 bước nối tiếp phẳng, nhưng đọc cùng Điều 6, 8 và
 * 30 thì thấy quy trình có hai chỗ khoá và một vòng quay lại. Vẽ 8 hộp thẳng
 * hàng sẽ giấu mất đúng phần quan trọng.
 */
const GHI_CHU: Record<number, { loai: 'cong' | 'vong' | 'thuong'; noi: string }> = {
  1: {
    loai: 'cong',
    noi: 'Cổng khoá trước kỳ đo. Chỉ tiêu, trọng số và ngưỡng phải duyệt xong ở bước này. Điều 8 khoản 3 cấm điều chỉnh ngưỡng sau khi đã có kết quả, trừ khi sửa sai dữ liệu hoặc có thay đổi khách quan được lập biên bản.',
  },
  2: {
    loai: 'cong',
    noi: 'Giá trị cơ sở phải được chốt trước. Với dự án mới, chỉ tiêu và mốc đánh giá sau đầu tư phải nằm ngay trong hồ sơ đề xuất hoặc phê duyệt dự án (Điều 27 khoản 2).',
  },
  3: {
    loai: 'thuong',
    noi: 'Đơn vị tự đánh giá và xác nhận trách nhiệm về tính đầy đủ, trung thực của dữ liệu. Nhưng Điều 26 khoản 3 cấm đơn vị tự xác nhận cuối cùng đối với chỉ tiêu do chính mình quản lý.',
  },
  4: {
    loai: 'thuong',
    noi: 'Kiểm tra theo rủi ro. Nhóm bắt buộc kiểm 100% không được lấy mẫu. Dữ liệu do đơn vị được đánh giá cung cấp phải đối soát với ít nhất một nguồn độc lập đối với chỉ tiêu trọng yếu (Điều 7 khoản 3).',
  },
  5: {
    loai: 'cong',
    noi: 'Chạy cổng tuân thủ TRƯỚC khi chấm. Không đạt thì rẽ sang trạng thái riêng, không đi tiếp vào chấm điểm.',
  },
  6: {
    loai: 'vong',
    noi: 'Vòng phản hồi, tối thiểu 07 ngày làm việc. Đơn vị có thể đề nghị sửa sai dữ liệu, và kết quả có thể quay lại bước 5 để chấm lại.',
  },
  7: { loai: 'thuong', noi: 'Báo cáo phải tách rõ ba phần: nội dung để biết, nội dung cần quyết định, nội dung phải khắc phục (Điều 31 khoản 1).' },
  8: {
    loai: 'cong',
    noi: 'Kiến nghị chỉ được đóng khi có bằng chứng hoàn thành VÀ được đơn vị kiểm tra xác nhận. Quá hạn phải báo cáo nguyên nhân và quyết định gia hạn, đổi biện pháp hoặc xử lý trách nhiệm.',
  },
}

const MAU: Record<string, { vien: string; nen: string; nhan: string }> = {
  cong: { vien: 'border-err', nen: 'bg-errsoft', nhan: 'Cổng chặn' },
  vong: { vien: 'border-warn', nen: 'bg-warnsoft', nhan: 'Vòng quay lại' },
  thuong: { vien: 'border-line', nen: 'bg-bg', nhan: '' },
}

export default function TrangQuyTrinh() {
  const pl3 = timPhuLuc('III')
  const bang = pl3?.bang[0]
  const buoc = (bang?.rows ?? []).slice(1)

  return (
    <Trang
      tieuDe="Quy trình đánh giá 8 bước"
      canCu="Phụ lục III — Quy trình, trách nhiệm và sản phẩm đầu ra; Chương VI"
      phu={
        <p>
          Bảng gốc trình bày 8 bước nối tiếp. Đọc cùng Điều 6, Điều 8 và Điều 30 thì quy trình thực
          ra có <b>bốn chỗ khoá</b> và <b>một vòng quay lại</b>. Trang này vẽ đúng những chỗ đó.
        </p>
      }
      rong
    >
      <div className="space-y-3">
        {buoc.map((r, i) => {
          const stt = Number(r[0]) || i + 1
          const g = GHI_CHU[stt] ?? { loai: 'thuong' as const, noi: '' }
          const m = MAU[g.loai]
          return (
            <article key={stt} className={`rounded-md border-l-4 ${m.vien} ${m.nen} border border-line px-4 py-3.5`}>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[14px] font-bold text-white">
                  {stt}
                </span>
                <h3 className="text-[16px] font-bold text-brand">{r[1]}</h3>
                {m.nhan && (
                  <span className={`nhan ${g.loai === 'cong' ? 'nhan-phaply' : 'nhan-chuaduyet'}`}>{m.nhan}</span>
                )}
              </div>

              <dl className="mt-2 grid gap-x-6 gap-y-1.5 text-[13.5px] sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-muted">Chủ trì / phối hợp</dt>
                  <dd>{r[2]}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted">Nội dung chính</dt>
                  <dd>{r[3]}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted">Sản phẩm</dt>
                  <dd className="font-medium">{r[4]}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted">Thời hạn</dt>
                  <dd>{r[5]}</dd>
                </div>
              </dl>

              {g.noi && (
                <p className="mt-2.5 border-t border-line pt-2 text-[13px]">
                  <b>Đọc thêm từ thân Quy định: </b>
                  {g.noi}
                </p>
              )}
            </article>
          )
        })}
      </div>

      <Muc ten="Ba nguyên tắc chi phối cả quy trình">
        <div className="grid gap-3 sm:grid-cols-3">
          <Khoi loai="nhan" tieuDe="Độc lập tương đối">
            <p>
              Điều 26 khoản 3: đơn vị quản lý tài sản cung cấp và giải trình dữ liệu nhưng{' '}
              <b>không tự xác nhận cuối cùng</b> đối với chỉ tiêu mình trực tiếp quản lý. Thành viên
              có xung đột lợi ích phải công khai và không tham gia biểu quyết.
            </p>
          </Khoi>
          <Khoi loai="nhan" tieuDe="Khoá trước, không sửa sau">
            <p>
              Điều 8 khoản 3: mục tiêu phải ban hành trước kỳ đo. Không điều chỉnh ngưỡng sau khi có
              kết quả, trừ trường hợp sửa sai dữ liệu hoặc thay đổi khách quan được lập biên bản và
              phê duyệt.
            </p>
          </Khoi>
          <Khoi loai="nhan" tieuDe="Chuẩn hoá trước khi so">
            <p>
              Điều 8 khoản 4: chỉ so sánh giữa đơn vị, ngành, địa điểm hoặc thời kỳ khi đã chuẩn hoá
              khác biệt về quy mô, lĩnh vực, trình độ, công suất thiết kế, giá, lạm phát, thời tiết
              và điều kiện sử dụng.
            </p>
          </Khoi>
        </div>
      </Muc>

      <Muc ten="Tần suất đánh giá">
        <div className="bang-cuon">
          <table className="bang">
            <thead>
              <tr>
                <th className="w-40">Nhịp</th>
                <th>Đối tượng</th>
              </tr>
            </thead>
            <tbody>
              {timDieu(32)?.khoan.map((k) => {
                const [nhip, ...phan] = k.text.replace(/^\d+\.\s*/, '').split(' đối với ')
                return (
                  <tr key={k.so}>
                    <td className="font-medium">{nhip}</td>
                    <td>{phan.join(' đối với ') || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Nguyên văn ở <LinkDieu so={32} ten="Tần suất đánh giá" />.
        </p>
      </Muc>

      <Muc ten="Năm đầu áp dụng: bắt buộc thí điểm trước">
        <TrichDan nguon="Điều 35 khoản 2">
          Trong năm đầu áp dụng, Trường thực hiện thí điểm tối thiểu trên ba nhóm: phòng học/phòng
          thí nghiệm và thiết bị dạy học; công trình và hạ tầng kỹ thuật; hệ thống CNTT/hạ tầng số.
          Kết quả thí điểm được dùng để hiệu chỉnh ngưỡng và trọng số trước khi áp dụng toàn diện.
        </TrichDan>
      </Muc>
    </Trang>
  )
}
