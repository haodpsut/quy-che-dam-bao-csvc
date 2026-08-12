/**
 * Tầng phán đoán cho 47 chỉ tiêu ở Phụ lục I.
 *
 * Phần CHỮ NGUYÊN VĂN (tên, công thức, nguồn, tần suất, cách diễn giải) không
 * nằm ở đây. Nó nằm trong toan-van.generated.json, bóc thẳng từ DOCX, không ai
 * gõ tay. File này chỉ chứa những gì phải suy ra từ việc đọc cả văn bản:
 *
 *   lop            chỉ tiêu thuộc lớp đánh giá nào trong ba lớp của Điều 3 khoản 2
 *   kieuCham       ánh xạ sang 1 trong 5 kiểu của Phụ lục II, hoặc 'boiCanh'
 *   laCongTuanThu  có phải điều kiện chặn trước khi chấm điểm không
 *   canhBao        câu cảnh báo mà văn bản gắn với chỉ tiêu này
 *   nguongLienQuan con số ngưỡng liên quan, trỏ sang nguong.ts
 *   dieuLienQuan   điều nào trong Quy định nói về chỉ tiêu này
 *
 * Tách hai tầng để khi ai đó không đồng ý với một phán đoán ở đây, họ sửa đúng
 * một dòng mà không đụng vào chữ của văn bản.
 */

/** Ba lớp đánh giá tách biệt theo Điều 3 khoản 2. */
export type Lop = 'taiChinh' | 'duAn' | 'taiSan' | 'haTangSo'

/**
 * 5 kiểu chấm của Phụ lục II, cộng một giá trị thứ sáu.
 *
 * 'boiCanh' KHÔNG có trong Phụ lục II và đó là chủ ý. Một số chỉ tiêu bị chính
 * văn bản cấm quy ra điểm tốt/xấu: cường độ điện nước (Điều 19 khoản 5 cấm đòi
 * giảm tuyệt đối), số sự cố an ninh (Điều 24 khoản 1 nói số thấp có thể do
 * không phát hiện), chi phí trên người học (Điều 10 khoản 3 nói không mặc nhiên
 * coi thấp hơn là hiệu quả hơn). Nhét chúng vào một trong 5 kiểu là tự bịa ra
 * quy tắc mà văn bản cố ý không cho.
 */
export type KieuCham =
  | 'caoCangTot'
  | 'thapCangTot'
  | 'khoangToiUu'
  | 'datKhongDat'
  | 'dinhTinh'
  | 'boiCanh'

export const KIEU_CHAM_NHAN: Record<KieuCham, string> = {
  caoCangTot: 'Càng cao càng tốt',
  thapCangTot: 'Càng thấp càng tốt',
  khoangToiUu: 'Khoảng tối ưu',
  datKhongDat: 'Đạt / không đạt',
  dinhTinh: 'Định tính 5 mức',
  boiCanh: 'Chỉ số bối cảnh, không quy ra điểm',
}

export interface ChiTieuOverlay {
  ma: string
  lop: Lop[]
  kieuCham: KieuCham
  laCongTuanThu: boolean
  canhBao?: string
  nguongLienQuan?: string[]
  dieuLienQuan: number[]
}

export const OVERLAY: ChiTieuOverlay[] = [
  /* ------------------------- C — cổng tuân thủ (4) ------------------------- */
  {
    ma: 'C01',
    lop: ['duAn', 'taiSan', 'haTangSo'],
    kieuCham: 'datKhongDat',
    laCongTuanThu: true,
    canhBao: 'Thiếu hồ sơ trọng yếu thì không chấm điểm tổng, không phải cho 0 điểm.',
    dieuLienQuan: [6, 9],
  },
  {
    ma: 'C02',
    lop: ['duAn', 'taiSan'],
    kieuCham: 'datKhongDat',
    laCongTuanThu: true,
    canhBao: 'Vi phạm nghiêm trọng phải khắc phục ngay, không được bù bằng điểm sử dụng cao.',
    dieuLienQuan: [3, 6, 19],
  },
  {
    ma: 'C03',
    lop: ['haTangSo'],
    kieuCham: 'datKhongDat',
    laCongTuanThu: true,
    canhBao: 'Không được bù bằng điểm sử dụng.',
    dieuLienQuan: [6, 24],
  },
  {
    ma: 'C04',
    lop: ['taiSan', 'haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: true,
    nguongLienQuan: ['giay-phep-100'],
    dieuLienQuan: [6, 18],
  },

  /* ---------------------- F — sức khoẻ tài chính (5) ---------------------- */
  {
    ma: 'F01',
    lop: ['taiChinh'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Là thông tin bối cảnh, không được dùng thay cho đánh giá hiệu quả từng dự án.',
    nguongLienQuan: ['bao-phu-chi-100'],
    dieuLienQuan: [10],
  },
  {
    ma: 'F02',
    lop: ['taiChinh'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Phải đánh giá cả tính bền vững, chi phí và rủi ro của nguồn thu, không chỉ tỷ trọng.',
    nguongLienQuan: ['thu-ngoai-hoc-phi-15-30'],
    dieuLienQuan: [10],
  },
  {
    ma: 'F03',
    lop: ['taiChinh'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Là chỉ số phân bổ nguồn lực, phải đọc cùng kết quả đầu ra.',
    nguongLienQuan: ['chi-dao-tao-nckh-60-70'],
    dieuLienQuan: [10],
  },
  {
    ma: 'F04',
    lop: ['taiChinh'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Phải chuẩn hoá theo chu kỳ đầu tư, một năm ít đầu tư không đồng nghĩa yếu kém.',
    nguongLienQuan: ['tai-dau-tu-10-15'],
    dieuLienQuan: [10],
  },
  {
    ma: 'F05',
    lop: ['taiChinh'],
    kieuCham: 'boiCanh',
    laCongTuanThu: false,
    canhBao:
      'Điều 10 khoản 3: phải đọc cùng kết quả đầu ra và chất lượng, không mặc nhiên coi chi phí thấp hơn là hiệu quả hơn.',
    dieuLienQuan: [10],
  },

  /* ------------------------ I — dự án đầu tư (9) ------------------------ */
  {
    ma: 'I01',
    lop: ['duAn'],
    kieuCham: 'khoangToiUu',
    laCongTuanThu: false,
    canhBao: 'Chi thấp hơn duyệt không mặc nhiên tốt nếu do giảm phạm vi hoặc chất lượng.',
    dieuLienQuan: [13],
  },
  {
    ma: 'I02',
    lop: ['duAn'],
    kieuCham: 'khoangToiUu',
    laCongTuanThu: false,
    canhBao: 'Phải đánh giá tác động của chậm tiến độ đến đào tạo, chi phí và lợi ích.',
    dieuLienQuan: [13],
  },
  {
    ma: 'I03',
    lop: ['duAn'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Hạng mục an toàn là điều kiện bắt buộc, không được tính bù bằng hạng mục khác.',
    dieuLienQuan: [13],
  },
  { ma: 'I04', lop: ['duAn'], kieuCham: 'caoCangTot', laCongTuanThu: false, dieuLienQuan: [13] },
  {
    ma: 'I05',
    lop: ['duAn'],
    kieuCham: 'khoangToiUu',
    laCongTuanThu: false,
    canhBao: 'Đọc cùng nguy cơ quá tải, tính mùa vụ và chất lượng, không phải càng cao càng tốt.',
    nguongLienQuan: ['moc-sau-dau-tu'],
    dieuLienQuan: [11, 14],
  },
  {
    ma: 'I06',
    lop: ['duAn'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Lợi ích và trọng số phải được xác lập TRƯỚC đầu tư, không định nghĩa sau khi có kết quả.',
    nguongLienQuan: ['moc-sau-dau-tu'],
    dieuLienQuan: [11, 14, 27],
  },
  { ma: 'I07', lop: ['duAn'], kieuCham: 'khoangToiUu', laCongTuanThu: false, dieuLienQuan: [14] },
  {
    ma: 'I08',
    lop: ['duAn'],
    kieuCham: 'thapCangTot',
    laCongTuanThu: false,
    canhBao: 'Dùng cho dự án không có dòng tiền; phải định nghĩa đơn vị kết quả trước kỳ đo.',
    dieuLienQuan: [12, 14],
  },
  {
    ma: 'I09',
    lop: ['duAn'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Không dùng đơn độc. Phải kèm tỷ lệ phản hồi và phân tích theo nhóm người dùng.',
    nguongLienQuan: ['moc-sau-dau-tu'],
    dieuLienQuan: [14, 28],
  },

  /* --------------------- A — tài sản, cơ sở vật chất (14) --------------------- */
  {
    ma: 'A01',
    lop: ['taiSan'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Tài sản trọng yếu và tài sản mất dấu phải kiểm tra 100%, không lấy mẫu.',
    nguongLienQuan: ['kiem-tra-100-muc-i', 'mau-ngau-nhien-10-20'],
    dieuLienQuan: [16, 29],
  },
  {
    ma: 'A02',
    lop: ['taiSan'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Chỉ loại trừ bảo trì có kế hoạch khi có hồ sơ hợp lệ, và phải công bố ngoại lệ.',
    dieuLienQuan: [16],
  },
  {
    ma: 'A03',
    lop: ['taiSan'],
    kieuCham: 'khoangToiUu',
    laCongTuanThu: false,
    canhBao:
      'Không mặc nhiên coi càng cao càng tốt. Vượt khoảng phải xem xét quá tải, thời gian chuyển ca, bảo trì và trải nghiệm người học.',
    nguongLienQuan: ['su-dung-phong-70-85'],
    dieuLienQuan: [17],
  },
  {
    ma: 'A04',
    lop: ['taiSan'],
    kieuCham: 'khoangToiUu',
    laCongTuanThu: false,
    canhBao: 'Phải đọc đồng thời với tỷ lệ sử dụng thời gian, một mình nó không kết luận được.',
    nguongLienQuan: ['su-dung-phong-70-85'],
    dieuLienQuan: [17],
  },
  {
    ma: 'A05',
    lop: ['taiSan'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: true,
    canhBao: 'Đạt 2,8 m² là điều kiện tuân thủ, không phải bằng chứng hiệu quả sử dụng.',
    nguongLienQuan: ['dien-tich-2-8'],
    dieuLienQuan: [17],
  },
  {
    ma: 'A06',
    lop: ['taiSan'],
    kieuCham: 'thapCangTot',
    laCongTuanThu: false,
    canhBao:
      'Phải phân tích nguyên nhân trước khi kết luận: dự phòng, mùa vụ, thiếu người vận hành, lỗi xếp lịch hay lỗi thời.',
    dieuLienQuan: [16, 20],
  },
  {
    ma: 'A07',
    lop: ['taiSan'],
    kieuCham: 'dinhTinh',
    laCongTuanThu: false,
    canhBao: 'Không gộp điểm để che khuất lỗi an toàn.',
    dieuLienQuan: [16, 19],
  },
  {
    ma: 'A08',
    lop: ['taiSan'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Phải đi kèm chất lượng bảo trì và tỷ lệ tái hỏng, nếu không sẽ thưởng cho việc làm cho xong.',
    dieuLienQuan: [16, 19],
  },
  { ma: 'A09', lop: ['taiSan'], kieuCham: 'thapCangTot', laCongTuanThu: false, dieuLienQuan: [16] },
  {
    ma: 'A10',
    lop: ['taiSan'],
    kieuCham: 'thapCangTot',
    laCongTuanThu: false,
    canhBao: 'Điều 19 khoản 5: không được coi chi phí giảm là tích cực nếu tồn đọng bảo trì tăng.',
    dieuLienQuan: [16, 19],
  },
  {
    ma: 'A11',
    lop: ['taiSan'],
    kieuCham: 'boiCanh',
    laCongTuanThu: false,
    canhBao:
      'Điều 19 khoản 5: không đặt yêu cầu điện phải giảm tuyệt đối hằng năm. Phải chuẩn hoá theo thời tiết, công suất, chức năng và giá.',
    dieuLienQuan: [19],
  },
  {
    ma: 'A12',
    lop: ['taiSan'],
    kieuCham: 'boiCanh',
    laCongTuanThu: false,
    canhBao: 'Điều 19 khoản 5: không đặt yêu cầu nước phải giảm tuyệt đối hằng năm. Phân tích rò rỉ và nhu cầu đặc thù.',
    dieuLienQuan: [19],
  },
  {
    ma: 'A13',
    lop: ['taiSan'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Phải đọc cùng an toàn, chất lượng thực hành và chuẩn đầu ra.',
    dieuLienQuan: [18],
  },
  {
    ma: 'A14',
    lop: ['taiSan'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao:
      'Phải tính độ trễ và phân bổ mức đóng góp. Không cộng cơ học các bài báo, đề tài và sản phẩm có giá trị khác nhau.',
    dieuLienQuan: [14, 18],
  },

  /* ------------------------- D — hạ tầng số (15) ------------------------- */
  {
    ma: 'D01',
    lop: ['haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Mục tiêu theo tầng hệ thống và thoả thuận mức dịch vụ, phải xác định rõ cửa sổ dịch vụ.',
    nguongLienQuan: ['uptime-99-5'],
    dieuLienQuan: [21, 22],
  },
  {
    ma: 'D02',
    lop: ['haTangSo'],
    kieuCham: 'thapCangTot',
    laCongTuanThu: false,
    canhBao: 'Dùng trung vị và phân vị cao, không dùng trung bình. Phân theo mức độ nghiêm trọng.',
    dieuLienQuan: [22, 24],
  },
  {
    ma: 'D03',
    lop: ['haTangSo'],
    kieuCham: 'thapCangTot',
    laCongTuanThu: false,
    canhBao: 'Phân theo tầng hệ thống và mức độ nghiêm trọng.',
    dieuLienQuan: [22, 24],
  },
  {
    ma: 'D04',
    lop: ['haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Không chỉ dựa vào trạng thái sao lưu thành công. Sao lưu chạy không chứng minh khôi phục được.',
    dieuLienQuan: [22],
  },
  { ma: 'D05', lop: ['haTangSo'], kieuCham: 'caoCangTot', laCongTuanThu: false, dieuLienQuan: [21, 22] },
  {
    ma: 'D06',
    lop: ['haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao:
      'Mẫu số là người dùng ĐỦ ĐIỀU KIỆN, không phải toàn bộ người học và người lao động. Lấy sai mẫu số làm tỷ lệ tụt giả tạo.',
    nguongLienQuan: ['nguoi-dung-hoat-dong-85'],
    dieuLienQuan: [4, 23],
  },
  {
    ma: 'D07',
    lop: ['haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Phải tách ba việc khác nhau: mức cung cấp trực tuyến, tỷ lệ chọn kênh số, tỷ lệ hoàn thành đầu cuối.',
    nguongLienQuan: ['thu-tuc-so-90'],
    dieuLienQuan: [23],
  },
  { ma: 'D08', lop: ['haTangSo'], kieuCham: 'thapCangTot', laCongTuanThu: false, dieuLienQuan: [22] },
  {
    ma: 'D09',
    lop: ['haTangSo'],
    kieuCham: 'khoangToiUu',
    laCongTuanThu: false,
    canhBao: 'Cả thiếu lẫn dư giấy phép đều là vấn đề, nên không phải càng cao càng tốt.',
    dieuLienQuan: [22],
  },
  {
    ma: 'D10',
    lop: ['haTangSo'],
    kieuCham: 'boiCanh',
    laCongTuanThu: false,
    canhBao:
      'Điều 24 khoản 1: số sự cố thấp có thể do KHÔNG PHÁT HIỆN hoặc không báo cáo. Đặt mục tiêu giảm số sự cố là thưởng cho việc giấu.',
    dieuLienQuan: [24],
  },
  {
    ma: 'D11',
    lop: ['haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Phân theo mức nghiêm trọng và theo tài sản trọng yếu, không gộp một tỷ lệ chung.',
    dieuLienQuan: [24],
  },
  {
    ma: 'D12',
    lop: ['haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Tài khoản đặc quyền và tài khoản người thôi việc ưu tiên 100%.',
    dieuLienQuan: [24],
  },
  {
    ma: 'D13',
    lop: ['haTangSo'],
    kieuCham: 'caoCangTot',
    laCongTuanThu: false,
    canhBao: 'Phục vụ truy xuất, kiểm định và liêm chính học thuật, không phải để đo mức chăm chỉ.',
    dieuLienQuan: [25],
  },
  { ma: 'D14', lop: ['haTangSo'], kieuCham: 'caoCangTot', laCongTuanThu: false, dieuLienQuan: [22, 25] },
  {
    ma: 'D15',
    lop: ['haTangSo'],
    kieuCham: 'dinhTinh',
    laCongTuanThu: false,
    canhBao:
      'Điều 25 khoản 4: không dùng tỷ lệ truy cập hay số lượt dùng làm bằng chứng duy nhất về hiệu quả học tập. Phải có giám sát của con người.',
    dieuLienQuan: [25],
  },
]
