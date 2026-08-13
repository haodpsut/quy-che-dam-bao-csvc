/**
 * Mọi con số ngưỡng xuất hiện trong văn bản, kèm TRẠNG THÁI PHÁP LÝ của nó.
 *
 * Đây là file quan trọng nhất của cả web. Quy định này viết ra phần lớn để ngăn
 * việc lấy một con số đẹp rồi coi như chuẩn. Điều 10 khoản 4, Điều 17 khoản 3,
 * Điều 21 khoản 3, Điều 23 khoản 3 và Điều 29 khoản 2 đều nói cùng một ý: các
 * tỷ lệ đó KHÔNG mặc nhiên là chuẩn, chỉ thành mục tiêu khi được phê duyệt kèm
 * kỳ áp dụng, phạm vi, nguồn dữ liệu và cơ sở xác định.
 *
 * Vì vậy web không được hiển thị chúng như nhau. Bốn trạng thái, không phải hai.
 */

export type TrangThaiNguong =
  /** Pháp luật ngoài Trường quy định. Không phê duyệt nội bộ nào hạ được. */
  | 'phapLy'
  /** Chính Quy định này ấn định, có hiệu lực ngay khi Quyết định có hiệu lực. */
  | 'quyChe'
  /** Văn bản có nhắc con số nhưng nói rõ phải được phê duyệt mới dùng. Chưa có quyết định phê duyệt. */
  | 'mucTieuChuaDuyet'
  /** Đã được cấp có thẩm quyền phê duyệt bằng văn bản. Điền khi có quyết định. */
  | 'mucTieuDaDuyet'

export interface Nguong {
  id: string
  giaTri: string
  apDungCho: string
  trangThai: TrangThaiNguong
  /** Điều, khoản liên quan trong thân Quy định. */
  dieu: number
  khoan?: number
  /**
   * Phụ lục chứa con số này, nếu nó nằm ở phụ lục chứ không nằm trong thân điều.
   *
   * Có trường này vì lúc đầu năm mục bị gán nhầm cho một điều mà bản thân điều
   * đó không hề chứa con số: ngưỡng 100% giấy phép nằm ở Phụ lục I, thang xếp
   * loại và tổng trọng số nằm ở Phụ lục II, hai cỡ mẫu 50% và 30-50% nằm ở Phụ
   * lục IV. Người đọc bấm vào Điều được chỉ tới sẽ không tìm thấy gì.
   */
  phuLuc?: 'I' | 'II' | 'III' | 'IV'
  /** Căn cứ ngoài Quy định, nếu có. */
  canCuNgoai?: string
  /** Ai có thẩm quyền phê duyệt, với ngưỡng chưa duyệt. */
  thamQuyen?: string
  /** Nguyên văn câu trong Quy định nói về trạng thái của con số này. */
  trichDan: string
  /** Mã chỉ tiêu ở Phụ lục I chịu ảnh hưởng. */
  chiTieu: string[]
}

export const TRANG_THAI_NHAN: Record<TrangThaiNguong, { nhan: string; moTa: string }> = {
  phapLy: {
    nhan: 'Bắt buộc theo pháp luật',
    moTa: 'Do văn bản pháp luật ngoài Trường quy định. Không đạt là không đạt cổng tuân thủ.',
  },
  quyChe: {
    nhan: 'Bắt buộc theo Quy định này',
    moTa: 'Chính Quy định này ấn định, áp dụng ngay, không cần phê duyệt thêm.',
  },
  mucTieuChuaDuyet: {
    nhan: 'Mục tiêu nội bộ, chưa phê duyệt',
    moTa: 'Văn bản có nhắc con số nhưng nói rõ chưa phải chuẩn. Chưa dùng để chấm điểm được.',
  },
  mucTieuDaDuyet: {
    nhan: 'Mục tiêu nội bộ đã phê duyệt',
    moTa: 'Đã có quyết định phê duyệt kèm kỳ áp dụng, phạm vi và nguồn dữ liệu.',
  },
}

export const NGUONG: Nguong[] = [
  /* ------------------------- Bắt buộc theo pháp luật ------------------------ */
  {
    id: 'dien-tich-2-8',
    giaTri: '2,8 m² / người học chính quy quy đổi',
    apDungCho: 'Diện tích sàn xây dựng phục vụ đào tạo',
    trangThai: 'phapLy',
    dieu: 17,
    khoan: 4,
    canCuNgoai: 'Thông tư 01/2024/TT-BGDĐT — Chuẩn cơ sở giáo dục đại học',
    trichDan:
      'Ngưỡng tối thiểu 2,8 m²/người học quy đổi là điều kiện tuân thủ, không phải bằng chứng duy nhất của hiệu quả sử dụng.',
    chiTieu: ['A05'],
  },
  {
    id: 'giay-phep-100',
    giaTri: '100%',
    apDungCho: 'Giấy phép, chứng nhận, kiểm định, hiệu chuẩn thuộc loại bắt buộc còn hiệu lực',
    trangThai: 'phapLy',
    dieu: 6,
    khoan: 3,
    phuLuc: 'I',
    trichDan: 'Mục tiêu 100% đối với yêu cầu bắt buộc.',
    chiTieu: ['C04'],
  },

  /* ---------------------- Bắt buộc theo chính Quy định ---------------------- */
  {
    id: 'kiem-tra-100-muc-i',
    giaTri: 'Kiểm tra 100%',
    apDungCho:
      'Tài sản mức I; tài sản giá trị lớn; tài sản liên quan an toàn, PCCC, an ninh mạng, dữ liệu cá nhân; tài sản mất dấu; dự án có dấu hiệu vượt chi phí, chậm tiến độ hoặc sự cố nghiêm trọng',
    trangThai: 'quyChe',
    dieu: 29,
    khoan: 1,
    trichDan: 'Kiểm tra 100% đối với: tài sản mức I; tài sản giá trị lớn theo ngưỡng; ...',
    chiTieu: ['A01'],
  },
  {
    id: 'giai-trinh-07-ngay',
    giaTri: 'Tối thiểu 07 ngày làm việc',
    apDungCho: 'Thời gian đơn vị được đánh giá giải trình dự thảo báo cáo',
    trangThai: 'quyChe',
    dieu: 30,
    khoan: 3,
    trichDan:
      'Đơn vị được đánh giá có tối thiểu 07 ngày làm việc để giải trình, cung cấp bổ sung hoặc đề nghị sửa sai dữ liệu, trừ trường hợp khẩn cấp.',
    chiTieu: [],
  },
  {
    id: 'thang-xep-loai',
    giaTri: '90 / 80 / 65 / 50 điểm',
    apDungCho: 'Ranh giới 5 mức xếp loại hiệu quả',
    trangThai: 'quyChe',
    dieu: 9,
    khoan: 3,
    phuLuc: 'II',
    trichDan: 'Kết quả gồm các mức: Hiệu quả rất cao; Hiệu quả tốt; ... (chi tiết ở Phụ lục II)',
    chiTieu: [],
  },
  {
    id: 'moc-sau-dau-tu',
    giaTri: '6 tháng / 12 tháng / 24 tháng',
    apDungCho: 'Mốc đánh giá sau đầu tư với dự án trọng yếu',
    trangThai: 'quyChe',
    dieu: 11,
    khoan: 4,
    trichDan:
      'thực hiện theo mốc phù hợp, thông thường tại 6 tháng, 12 tháng và 24 tháng đối với dự án trọng yếu',
    chiTieu: ['I05', 'I06', 'I09'],
  },
  {
    id: 'tong-trong-so-100',
    giaTri: 'Tổng trọng số = 100%',
    apDungCho: 'Bộ trọng số chỉ tiêu trong một kỳ đánh giá',
    trangThai: 'quyChe',
    dieu: 9,
    khoan: 1,
    phuLuc: 'II',
    trichDan:
      'Tổng trọng số bằng 100%. Chỉ tính khi cổng tuân thủ đạt và dữ liệu trọng yếu đầy đủ. (Phụ lục II)',
    chiTieu: [],
  },

  /* --------------- Con số có trong văn bản nhưng CHƯA phê duyệt -------------- */
  {
    id: 'su-dung-phong-70-85',
    giaTri: '70% - 85%',
    apDungCho: 'Tỷ lệ sử dụng thời gian của phòng học, giảng đường, không gian học tập',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 17,
    khoan: 3,
    thamQuyen: 'Trường phê duyệt như khoảng mục tiêu nội bộ',
    trichDan:
      'Mức 70% - 85% chỉ được sử dụng khi Trường phê duyệt như khoảng mục tiêu nội bộ. Kết quả trên khoảng mục tiêu phải được xem xét về nguy cơ quá tải, thời gian chuyển ca, bảo trì và trải nghiệm người học, không mặc nhiên coi càng cao càng tốt.',
    chiTieu: ['A03', 'A04'],
  },
  {
    id: 'uptime-99-5',
    giaTri: '99,5%',
    apDungCho: 'Mục tiêu thời gian hoạt động của LMS, cổng thông tin, hệ thống cốt lõi',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 21,
    khoan: 3,
    thamQuyen: 'Chỉ áp dụng khi được phê duyệt và xác định rõ cửa sổ dịch vụ',
    trichDan:
      'Mục tiêu thời gian hoạt động 99,5% đối với LMS, cổng thông tin hoặc hệ thống cốt lõi là mục tiêu nội bộ tham khảo, chỉ áp dụng khi được phê duyệt và xác định rõ cửa sổ dịch vụ, thời gian bảo trì và cách ghi nhận gián đoạn.',
    chiTieu: ['D01'],
  },
  {
    id: 'thu-tuc-so-90',
    giaTri: '90%',
    apDungCho: 'Tỷ lệ thủ tục được số hoá',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 23,
    khoan: 3,
    thamQuyen: 'Chỉ áp dụng khi được phê duyệt như mục tiêu nội bộ',
    trichDan:
      'Mục tiêu 90% thủ tục số hoặc 85% người dùng hoạt động chỉ áp dụng khi được phê duyệt như mục tiêu nội bộ, có định nghĩa rõ thủ tục, người dùng đủ điều kiện, giao dịch thành công và kỳ đo.',
    chiTieu: ['D07'],
  },
  {
    id: 'nguoi-dung-hoat-dong-85',
    giaTri: '85%',
    apDungCho: 'Tỷ lệ người dùng hoạt động trên số người dùng đủ điều kiện',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 23,
    khoan: 3,
    thamQuyen: 'Chỉ áp dụng khi được phê duyệt như mục tiêu nội bộ',
    trichDan:
      'Mục tiêu 90% thủ tục số hoặc 85% người dùng hoạt động chỉ áp dụng khi được phê duyệt như mục tiêu nội bộ, có định nghĩa rõ thủ tục, người dùng đủ điều kiện, giao dịch thành công và kỳ đo.',
    chiTieu: ['D06'],
  },
  {
    id: 'bao-phu-chi-100',
    giaTri: '100%',
    apDungCho: 'Tỷ lệ bao phủ chi hoạt động bằng nguồn thu hoạt động',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 10,
    khoan: 4,
    thamQuyen: 'Phê duyệt trong kế hoạch tài chính hoặc nghị quyết có thẩm quyền',
    trichDan:
      'Không áp dụng mặc định các ngưỡng 100%, 15% - 30%, 60% - 70% hoặc 10% - 15%. Nếu Trường lựa chọn các mức này, phải ghi rõ đó là mục tiêu nội bộ, có thuyết minh và được phê duyệt trong kế hoạch tài chính hoặc nghị quyết có thẩm quyền.',
    chiTieu: ['F01'],
  },
  {
    id: 'thu-ngoai-hoc-phi-15-30',
    giaTri: '15% - 30%',
    apDungCho: 'Tỷ trọng nguồn thu ngoài học phí',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 10,
    khoan: 4,
    thamQuyen: 'Phê duyệt trong kế hoạch tài chính hoặc nghị quyết có thẩm quyền',
    trichDan: 'Không áp dụng mặc định các ngưỡng 100%, 15% - 30%, 60% - 70% hoặc 10% - 15%.',
    chiTieu: ['F02'],
  },
  {
    id: 'chi-dao-tao-nckh-60-70',
    giaTri: '60% - 70%',
    apDungCho: 'Tỷ trọng chi cho đào tạo, nghiên cứu khoa học và đổi mới sáng tạo',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 10,
    khoan: 4,
    thamQuyen: 'Phê duyệt trong kế hoạch tài chính hoặc nghị quyết có thẩm quyền',
    trichDan: 'Không áp dụng mặc định các ngưỡng 100%, 15% - 30%, 60% - 70% hoặc 10% - 15%.',
    chiTieu: ['F03'],
  },
  {
    id: 'tai-dau-tu-10-15',
    giaTri: '10% - 15%',
    apDungCho: 'Cường độ tái đầu tư',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 10,
    khoan: 4,
    thamQuyen: 'Phê duyệt trong kế hoạch tài chính hoặc nghị quyết có thẩm quyền',
    trichDan: 'Không áp dụng mặc định các ngưỡng 100%, 15% - 30%, 60% - 70% hoặc 10% - 15%.',
    chiTieu: ['F04'],
  },
  {
    id: 'mau-ngau-nhien-10-20',
    giaTri: '10% - 20%',
    apDungCho: 'Tỷ lệ lấy mẫu ngẫu nhiên với tài sản mức II và III, rủi ro thấp',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 29,
    khoan: 2,
    thamQuyen: 'Hội đồng đánh giá quyết định trong kế hoạch, phải ghi cơ sở chọn mẫu',
    trichDan:
      'Tỷ lệ ngẫu nhiên 10% - 20% chỉ là lựa chọn đối với nhóm tài sản thông thường, rủi ro thấp sau khi đã thực hiện phân tầng; không phải tỷ lệ cố định và không thay thế kiểm kê bắt buộc.',
    chiTieu: ['A01'],
  },
  {
    id: 'mau-rui-ro-cao-50',
    giaTri: 'Tối thiểu 50%',
    apDungCho: 'Cỡ mẫu với nhóm rủi ro cao',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 29,
    khoan: 2,
    phuLuc: 'IV',
    thamQuyen: 'Hội đồng đánh giá, theo phán đoán nghề nghiệp',
    trichDan:
      'Ghi chú Phụ lục IV: tỷ lệ mẫu là mức quản trị tham khảo. Hội đồng đánh giá phải ghi nhận cơ sở chọn mẫu, sai lệch, phần không kiểm tra và ảnh hưởng đến độ tin cậy của kết luận.',
    chiTieu: ['A01'],
  },
  {
    id: 'mau-rui-ro-tb-30-50',
    giaTri: '30% - 50%',
    apDungCho: 'Cỡ mẫu với nhóm rủi ro trung bình',
    trangThai: 'mucTieuChuaDuyet',
    dieu: 29,
    khoan: 2,
    phuLuc: 'IV',
    thamQuyen: 'Hội đồng đánh giá, theo phán đoán nghề nghiệp',
    trichDan: 'Ghi chú Phụ lục IV: tỷ lệ mẫu là mức quản trị tham khảo.',
    chiTieu: ['A01'],
  },
]

/** Con số dẫn xuất, không phải ngưỡng: nêu ra để người đọc thấy 99,5% nghĩa là bao nhiêu giờ. */
export const DAN_XUAT = {
  uptime995GioNam: '43 giờ 48 phút',
  trichDan:
    'Nếu tính liên tục 24 giờ mỗi ngày, mức 99,5% tương đương tối đa khoảng 43 giờ 48 phút gián đoạn trong một năm.',
  dieu: 21,
  khoan: 3,
}
