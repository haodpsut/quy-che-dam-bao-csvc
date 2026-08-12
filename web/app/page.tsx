import Link from 'next/link'
import { CHI_TIEU, NGUONG, DIEU, CHUONG, PHU_LUC } from '@/lib/du-lieu'
import { Khoi, The, TrichDan } from '@/components/ui'

/** Ngày các nội dung theo TT 49/2026 bắt đầu áp dụng (Điều 3 Quyết định, Điều 35 khoản 3). */
const MOC_TT49 = new Date('2026-08-15T00:00:00+07:00')

export default function TrangChu() {
  const chuaDuyet = NGUONG.filter((n) => n.trangThai === 'mucTieuChuaDuyet').length
  const phapLy = NGUONG.filter((n) => n.trangThai === 'phapLy').length
  const soKhoan = DIEU.reduce((n, d) => n + d.khoan.length, 0)
  const daHieuLuc = Date.now() >= MOC_TT49.getTime()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header>
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          Trường Đại học Kiến trúc Đà Nẵng
        </p>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-brand sm:text-4xl">
          Đánh giá hiệu quả dự án đầu tư và hiệu quả khai thác, sử dụng tài sản
        </h1>
        <p className="mt-3 max-w-3xl text-[15.5px] text-ink/90">
          Quy định về tiêu chí và quy trình đánh giá hiệu quả dự án đầu tư và hiệu quả khai thác, sử
          dụng tài sản, cơ sở vật chất, trang thiết bị dạy học, trang thiết bị công nghệ thông tin,
          hạ tầng kỹ thuật và hạ tầng số.
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { so: CHUONG.length, don: 'chương', phu: `${DIEU.length} điều, ${soKhoan} khoản` },
          { so: CHI_TIEU.length, don: 'chỉ tiêu', phu: 'có mã, công thức, nguồn, tần suất' },
          { so: PHU_LUC.length, don: 'phụ lục', phu: 'từ điển, chấm điểm, quy trình, lấy mẫu' },
          { so: 8, don: 'bước quy trình', phu: 'có chủ trì, sản phẩm, thời hạn' },
        ].map((o) => (
          <div key={o.don} className="khoi px-3.5 py-3">
            <p className="text-2xl font-bold text-brand">{o.so}</p>
            <p className="text-[13px] font-semibold">{o.don}</p>
            <p className="mt-0.5 text-[12px] text-muted">{o.phu}</p>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------------------
          Việc đầu tiên trang chủ phải nói không phải là "có bao nhiêu chỉ
          tiêu", mà là trạng thái thật của bộ ngưỡng. Không có ngưỡng được
          phê duyệt thì chưa chấm điểm được, dù dữ liệu có đầy đủ tới đâu.
          --------------------------------------------------------------- */}
      <Khoi loai="canhBao" tieuDe="Trạng thái hiện tại: chưa chấm điểm để kết luận được">
        <p>
          Quy định yêu cầu chỉ tiêu, trọng số và ngưỡng phải được phê duyệt <b>trước</b> kỳ đo (Điều
          8 khoản 3, Điều 9 khoản 1). Hiện có <b>{chuaDuyet} ngưỡng</b> mà chính văn bản ghi rõ là
          mục tiêu nội bộ chưa được phê duyệt, và <b>{phapLy} ngưỡng</b> bắt buộc theo pháp luật.
        </p>
        <p>
          Vì vậy trang này đang ở vai trò tra cứu và chuẩn bị. Khi có quyết định phê duyệt bộ chỉ
          tiêu, trọng số và ngưỡng, phần chấm điểm mới dùng để kết luận được.{' '}
          <Link href="/phieu-de-xuat" className="font-semibold text-brand underline underline-offset-2">
            Xem phiếu đề xuất phê duyệt
          </Link>
          .
        </p>
      </Khoi>

      <section className="mt-8">
        <h2 className="tieu-de-chuong mb-3 pb-1 text-lg font-bold">Ba lớp đánh giá tách biệt</h2>
        <p className="mb-3 text-[14.5px] text-ink/90">
          Điều 3 khoản 2 bắt buộc tách ba lớp và không cho dùng lớp này thay lớp kia. Đây cũng là
          cách trang được chia.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <The href="/vong-doi-du-an" tieuDe="1. Hiệu quả từng dự án đầu tư">
            Vòng đời 5 giai đoạn từ trước đầu tư tới đánh giá tác động, mốc 6 / 12 / 24 tháng. Nhóm
            chỉ tiêu I01 đến I09.
          </The>
          <The href="/co-so-vat-chat" tieuDe="2. Hiệu quả khai thác tài sản">
            Phòng học, phòng thí nghiệm, công trình, hạ tầng kỹ thuật và vòng đời tài sản. Nhóm A01
            đến A14.
          </The>
          <The href="/ha-tang-so" tieuDe="3. Hạ tầng số, dữ liệu và AI">
            Phân tầng hệ thống, mức dịch vụ, an ninh mạng, dữ liệu cá nhân. Nhóm D01 đến D15.
          </The>
        </div>
        <Khoi loai="nhan" tieuDe="Sức khoẻ tài chính là lớp bối cảnh, không phải lớp thứ tư">
          <p>
            Nhóm F01 đến F05 phục vụ lập kế hoạch và kiểm soát khả năng chi trả.{' '}
            <b>Không được dùng thay cho đánh giá hiệu quả từng dự án</b> (Điều 10 khoản 1).
          </p>
        </Khoi>
      </section>

      <section className="mt-8">
        <h2 className="tieu-de-chuong mb-3 pb-1 text-lg font-bold">
          Điều làm quy định này khác một bảng điểm thông thường
        </h2>
        <p className="text-[14.5px] text-ink/90">
          Văn bản được viết để ngăn việc lấy một con số đẹp rồi kết luận. Bốn cơ chế:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <The href="/cong-tuan-thu" tieuDe="Cổng tuân thủ chặn trước">
            Chưa qua cổng thì không tính điểm tổng hợp. Không được lấy mức sử dụng cao bù cho vi
            phạm về an toàn, bản quyền, an ninh mạng hay dữ liệu cá nhân.
          </The>
          <The href="/nguong" tieuDe="Phân biệt luật với mong muốn">
            70-85%, 99,5%, 90%, 60-70% đều bị chính văn bản hạ xuống mục tiêu nội bộ phải phê duyệt.
            Chỉ 2,8 m²/người học là chuẩn pháp lý.
          </The>
          <The href="/cham-diem" tieuDe="Không chỉ tiêu đơn lẻ nào kết luận được">
            Điểm tổng phải đọc cùng điểm thành phần, xu hướng, tình trạng tuân thủ và độ tin cậy dữ
            liệu. Tài sản còn phải phân loại trên hai trục.
          </The>
          <The href="/chi-tieu" tieuDe="Chống tối ưu ngược">
            Bốn chỉ tiêu bị cấm quy ra điểm tốt xấu: chi phí trên người học, cường độ điện, cường độ
            nước và số sự cố an ninh.
          </The>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="tieu-de-chuong mb-3 pb-1 text-lg font-bold">Hiệu lực</h2>
        <TrichDan nguon="Điều 3 Quyết định ban hành">
          Quyết định này có hiệu lực kể từ ngày ký. Các nội dung thực hiện Thông tư số
          49/2026/TT-BGDĐT được áp dụng từ ngày 15 tháng 8 năm 2026; trường hợp Quyết định được ký
          sau thời điểm này thì áp dụng kể từ ngày ký.
        </TrichDan>
        <p className="text-[14px] text-muted">
          Mốc 15/8/2026 {daHieuLuc ? 'đã tới' : 'chưa tới'}. Số và ngày của Quyết định trong bản gốc
          còn để trống, nên trang chưa hiển thị số hiệu.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="tieu-de-chuong mb-3 pb-1 text-lg font-bold">Vào thẳng</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <The href="/toan-van" tieuDe="Toàn văn">
            {CHUONG.length} chương, {DIEU.length} điều, {PHU_LUC.length} phụ lục, có mục lục và neo
            tới từng điều.
          </The>
          <The href="/chi-tieu" tieuDe="Từ điển chỉ tiêu">
            {CHI_TIEU.length} chỉ tiêu, lọc theo nhóm, theo lớp đánh giá, theo tần suất và theo kiểu
            chấm.
          </The>
          <The href="/quy-trinh" tieuDe="Quy trình 8 bước">
            Ai chủ trì, sản phẩm là gì, hạn khi nào, và hai chỗ có cổng chặn.
          </The>
        </div>
      </section>
    </div>
  )
}
