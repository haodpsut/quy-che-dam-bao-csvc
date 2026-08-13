import type { Metadata } from 'next'
import { NGUONG, timDieu } from '@/lib/du-lieu'
import { TRANG_THAI_NHAN, DAN_XUAT, type TrangThaiNguong } from '@/data/nguong'
import { Trang, Khoi, NhanTrangThai, NguonNguong, LinkChiTieu, TrichDan } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Ngưỡng và trạng thái pháp lý',
  description:
    'Mọi con số ngưỡng trong Quy định, phân biệt rõ đâu là bắt buộc theo pháp luật, đâu là mục tiêu nội bộ chưa được phê duyệt.',
}

const THU_TU: TrangThaiNguong[] = ['phapLy', 'quyChe', 'mucTieuDaDuyet', 'mucTieuChuaDuyet']

export default function TrangNguong() {
  return (
    <Trang
      tieuDe="Con số nào là luật, con số nào mới chỉ là mong muốn"
      canCu="Điều 8, Điều 10 khoản 4, Điều 17 khoản 3 và 4, Điều 21 khoản 3, Điều 23 khoản 3, Điều 29"
      phu={
        <>
          <p>
            Quy định này nhắc tới nhiều tỷ lệ quen thuộc: 70-85% mức sử dụng phòng, 99,5% thời gian
            hoạt động hệ thống, 90% thủ tục số, 60-70% chi cho đào tạo và nghiên cứu. Điều dễ nhầm
            nhất là coi chúng như chuẩn phải đạt.
          </p>
          <p className="mt-2">
            Văn bản nói ngược lại, ở năm chỗ khác nhau: các tỷ lệ đó{' '}
            <b>chỉ trở thành mục tiêu nội bộ khi được cấp có thẩm quyền phê duyệt</b> kèm kỳ áp
            dụng, phạm vi, nguồn dữ liệu và cơ sở xác định. Trang này liệt kê từng con số và trạng
            thái thật của nó.
          </p>
        </>
      }
      rong
    >
      <TrichDan nguon="Điều 8 khoản 2">
        Các tỷ lệ như tự cân đối thu - chi, thu ngoài học phí, chi đào tạo và nghiên cứu, tái đầu
        tư, mức sử dụng phòng, thời gian hoạt động hệ thống, tỷ lệ số hóa hoặc tỷ lệ người dùng hoạt
        động không mặc nhiên là chuẩn pháp lý.
      </TrichDan>

      <div className="my-5 grid gap-3 sm:grid-cols-4">
        {THU_TU.map((t) => {
          const n = NGUONG.filter((x) => x.trangThai === t).length
          return (
            <div key={t} className="khoi px-3.5 py-3">
              <p className="text-2xl font-bold text-brand">{n}</p>
              <NhanTrangThai trangThai={t} />
              <p className="mt-1.5 text-[12px] leading-snug text-muted">{TRANG_THAI_NHAN[t].moTa}</p>
            </div>
          )
        })}
      </div>

      {THU_TU.map((t) => {
        const nhom = NGUONG.filter((n) => n.trangThai === t)
        return (
          <section key={t} className="mt-8">
            <h2 className="tieu-de-chuong mb-1 flex flex-wrap items-center gap-2 pb-1 text-lg font-bold">
              <NhanTrangThai trangThai={t} />
              <span>
                {TRANG_THAI_NHAN[t].nhan} ({nhom.length})
              </span>
            </h2>
            <p className="mb-3 text-[13.5px] text-muted">{TRANG_THAI_NHAN[t].moTa}</p>

            {nhom.length === 0 ? (
              <div className="khoi px-4 py-4 text-[14px] text-muted">
                Chưa có mục nào. Khi có quyết định phê duyệt bộ mục tiêu nội bộ, các ngưỡng tương
                ứng sẽ chuyển sang đây.
              </div>
            ) : (
              <div className="space-y-3">
                {nhom.map((n) => {
                  const d = timDieu(n.dieu)
                  return (
                    <article key={n.id} className="khoi px-4 py-3.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-[17px] font-bold text-brand">{n.giaTri}</h3>
                        <p className="text-[13px] text-muted">
                          <NguonNguong dieu={n.dieu} khoan={n.khoan} phuLuc={n.phuLuc} />
                          {d && !n.phuLuc ? ` — ${d.ten}` : ''}
                        </p>
                      </div>
                      <p className="mt-1 text-[14.5px]">{n.apDungCho}</p>

                      <blockquote className="mt-2.5 border-l-4 border-line-dam bg-surface px-3.5 py-2 text-[13.5px] italic text-ink/85">
                        {n.trichDan}
                      </blockquote>

                      <dl className="mt-2.5 grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
                        {n.canCuNgoai && (
                          <div className="sm:col-span-2">
                            <dt className="inline font-semibold">Căn cứ ngoài Quy định: </dt>
                            <dd className="inline">{n.canCuNgoai}</dd>
                          </div>
                        )}
                        {n.thamQuyen && (
                          <div className="sm:col-span-2">
                            <dt className="inline font-semibold">Ai phê duyệt được: </dt>
                            <dd className="inline">{n.thamQuyen}</dd>
                          </div>
                        )}
                        {n.chiTieu.length > 0 && (
                          <div className="sm:col-span-2">
                            <dt className="inline font-semibold">Chỉ tiêu chịu ảnh hưởng: </dt>
                            <dd className="inline">
                              {n.chiTieu.map((m, i) => (
                                <span key={m}>
                                  {i > 0 && ', '}
                                  <LinkChiTieu ma={m} />
                                </span>
                              ))}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}

      <section className="mt-9">
        <h2 className="tieu-de-chuong mb-3 pb-1 text-lg font-bold">Một con số dẫn xuất, không phải ngưỡng</h2>
        <Khoi loai="nhan" tieuDe={`99,5% nghĩa là ${DAN_XUAT.uptime995GioNam} gián đoạn mỗi năm`}>
          <p>{DAN_XUAT.trichDan}</p>
          <p>
            Con số này do chính văn bản tính ra để người đọc thấy mức 99,5% khắt khe tới đâu, chứ
            bản thân nó không phải một ngưỡng phải đạt. Cách quy đổi thay đổi hoàn toàn nếu cửa sổ
            dịch vụ không phải 24 giờ mỗi ngày.{' '}
            <a href="/ha-tang-so#uptime" className="font-semibold text-brand underline underline-offset-2">
              Tính lại theo cửa sổ dịch vụ thật
            </a>
            .
          </p>
        </Khoi>
      </section>

      <section className="mt-8">
        <h2 className="tieu-de-chuong mb-3 pb-1 text-lg font-bold">Vì sao trang này quan trọng</h2>
        <Khoi loai="cam" tieuDe="Rủi ro nếu bỏ qua sự phân biệt này">
          <p>
            Nếu đưa một tỷ lệ chưa phê duyệt vào chấm điểm, kết quả xếp loại sẽ có vẻ khách quan
            nhưng thực chất dựa trên một mục tiêu chưa ai quyết. Điều 8 khoản 3 còn cấm điều chỉnh
            ngưỡng sau khi đã có kết quả, nên sai lầm này rất khó sửa về sau.
          </p>
          <p>
            Cổng kiểm số của trang chặn theo hướng ngược lại: bất kỳ tỷ lệ nào xuất hiện trong thân
            Quy định mà chưa được khai báo trạng thái ở đây thì bản dựng sẽ hỏng, thay vì âm thầm
            hiển thị thiếu.
          </p>
        </Khoi>
      </section>
    </Trang>
  )
}
