/**
 * Máy chấm điểm theo Phụ lục II.
 *
 * Ba luật cứng, cài ở tầng hàm chứ không chỉ ở tầng giao diện, vì giao diện có
 * thể bị bỏ qua còn hàm thì không:
 *
 *   1. Chưa qua cổng tuân thủ thì diemTong TRẢ VỀ null, không trả số. Điều 6
 *      khoản 6 và Điều 9 khoản 1. Trả 0 cũng sai, vì 0 là một điểm số và vẫn
 *      cộng trọng số được, tức là vẫn bị bù trừ.
 *   2. Chia cho 0 KHÔNG tự chọn giá trị. Phụ lục II nói rõ phải "quy định cách
 *      xử lý giá trị bằng 0", nghĩa là Trường quyết, không phải lập trình viên.
 *      Hàm trả trạng thái 'canQuyDinh' để giao diện bắt người dùng khai báo.
 *   3. Tổng trọng số phải bằng 100%. Lệch thì không cho ra điểm tổng.
 */

export type KieuCham =
  | 'caoCangTot'
  | 'thapCangTot'
  | 'khoangToiUu'
  | 'datKhongDat'
  | 'dinhTinh'
  | 'boiCanh'

export type TrangThaiDiem =
  /** Tính được, có điểm. */
  | 'tinhDuoc'
  /** Rơi vào trường hợp Phụ lục II đòi Trường phải quy định trước, ví dụ mẫu số bằng 0. */
  | 'canQuyDinh'
  /** Chưa có mục tiêu được phê duyệt nên không có gì để so. */
  | 'thieuMucTieu'
  /** Chỉ tiêu bối cảnh, chính văn bản không cho quy ra điểm. */
  | 'khongCham'
  /** Dữ liệu vào không hợp lệ. */
  | 'duLieuSai'

export interface KetQuaDiem {
  diem: number | null
  trangThai: TrangThaiDiem
  giaiThich: string
}

export interface ThamSoCham {
  kieu: KieuCham
  /** Giá trị thực hiện đo được. */
  thucHien?: number
  /** Mục tiêu đã phê duyệt. */
  mucTieu?: number
  /** Khoảng tối ưu, dùng cho kieu = 'khoangToiUu'. */
  khoangDuoi?: number
  khoangTren?: number
  /** Biên độ trừ điểm khi ra ngoài khoảng: lệch bằng đúng biên độ thì về 0 điểm. */
  bienDo?: number
  /** Kết quả đạt/không đạt, dùng cho kieu = 'datKhongDat'. */
  dat?: boolean
  /** Mức định tính 1..5, dùng cho kieu = 'dinhTinh'. */
  mucDinhTinh?: 1 | 2 | 3 | 4 | 5
}

const lam = (n: number) => Math.round(n * 10) / 10

/** Chấm một chỉ tiêu. Không bao giờ ném lỗi, luôn trả trạng thái đọc được. */
export function chamMotChiTieu(t: ThamSoCham): KetQuaDiem {
  switch (t.kieu) {
    case 'boiCanh':
      return {
        diem: null,
        trangThai: 'khongCham',
        giaiThich:
          'Chỉ tiêu bối cảnh. Văn bản cấm quy ra điểm tốt xấu cho chỉ tiêu này, chỉ dùng để phân tích và giải thích.',
      }

    case 'datKhongDat':
      if (t.dat === undefined) {
        return { diem: null, trangThai: 'duLieuSai', giaiThich: 'Chưa nhập kết quả đạt hay không đạt.' }
      }
      return {
        diem: t.dat ? 100 : 0,
        trangThai: 'tinhDuoc',
        giaiThich: t.dat
          ? 'Đạt điều kiện, 100 điểm.'
          : 'Không đạt, 0 điểm. Lưu ý Phụ lục II: điều kiện pháp lý nghiêm trọng phải xử lý tại cổng tuân thủ, không chỉ cho 0 điểm.',
      }

    case 'dinhTinh':
      if (!t.mucDinhTinh) {
        return { diem: null, trangThai: 'duLieuSai', giaiThich: 'Chưa chọn mức trong thang 5 mức.' }
      }
      return {
        diem: t.mucDinhTinh * 20,
        trangThai: 'tinhDuoc',
        giaiThich: `Mức ${t.mucDinhTinh}/5 quy đổi thành ${t.mucDinhTinh * 20} điểm. Mỗi mức phải có mô tả và bằng chứng; chỉ tiêu trọng yếu cần tối thiểu hai người đánh giá.`,
      }

    case 'caoCangTot': {
      if (t.thucHien === undefined) {
        return { diem: null, trangThai: 'duLieuSai', giaiThich: 'Chưa nhập giá trị thực hiện.' }
      }
      if (t.mucTieu === undefined) {
        return { diem: null, trangThai: 'thieuMucTieu', giaiThich: 'Chưa có mục tiêu được phê duyệt để so sánh.' }
      }
      if (t.mucTieu === 0) {
        return {
          diem: null,
          trangThai: 'canQuyDinh',
          giaiThich:
            'Mục tiêu bằng 0 nên phép chia không xác định. Phụ lục II yêu cầu quy định trước cách xử lý giá trị bằng 0.',
        }
      }
      if (t.thucHien < 0) {
        return {
          diem: null,
          trangThai: 'canQuyDinh',
          giaiThich: 'Giá trị thực hiện âm với chỉ tiêu càng cao càng tốt. Phải quy định cách xử lý trước kỳ đo.',
        }
      }
      const d = Math.min(100, (t.thucHien / t.mucTieu) * 100)
      return {
        diem: lam(d),
        trangThai: 'tinhDuoc',
        giaiThich: `min(100; ${t.thucHien}/${t.mucTieu} × 100) = ${lam(d)}. Trần 100 nghĩa là vượt mục tiêu không được cộng thêm điểm để bù cho chỉ tiêu khác.`,
      }
    }

    case 'thapCangTot': {
      if (t.thucHien === undefined) {
        return { diem: null, trangThai: 'duLieuSai', giaiThich: 'Chưa nhập giá trị thực hiện.' }
      }
      if (t.mucTieu === undefined) {
        return { diem: null, trangThai: 'thieuMucTieu', giaiThich: 'Chưa có mục tiêu được phê duyệt để so sánh.' }
      }
      if (t.thucHien === 0) {
        return {
          diem: null,
          trangThai: 'canQuyDinh',
          giaiThich:
            'Thực hiện bằng 0 nên phép chia không xác định. Phụ lục II yêu cầu quy định trước cách xử lý giá trị bằng 0. Coi mặc định là 100 điểm có thể sai: với chỉ tiêu như thời gian phát hiện sự cố, giá trị 0 thường nghĩa là chưa đo được, không phải hoàn hảo.',
        }
      }
      if (t.thucHien < 0 || t.mucTieu < 0) {
        return { diem: null, trangThai: 'canQuyDinh', giaiThich: 'Giá trị âm, phải quy định cách xử lý trước kỳ đo.' }
      }
      const d = Math.min(100, (t.mucTieu / t.thucHien) * 100)
      return {
        diem: lam(d),
        trangThai: 'tinhDuoc',
        giaiThich: `min(100; ${t.mucTieu}/${t.thucHien} × 100) = ${lam(d)}. Phụ lục II lưu ý không dùng kiểu này cho chỉ tiêu mà giảm quá mức lại gây rủi ro.`,
      }
    }

    case 'khoangToiUu': {
      if (t.thucHien === undefined) {
        return { diem: null, trangThai: 'duLieuSai', giaiThich: 'Chưa nhập giá trị thực hiện.' }
      }
      if (t.khoangDuoi === undefined || t.khoangTren === undefined) {
        return { diem: null, trangThai: 'thieuMucTieu', giaiThich: 'Chưa có khoảng tối ưu được phê duyệt.' }
      }
      if (t.khoangDuoi > t.khoangTren) {
        return { diem: null, trangThai: 'duLieuSai', giaiThich: 'Cận dưới lớn hơn cận trên.' }
      }
      if (!t.bienDo || t.bienDo <= 0) {
        return {
          diem: null,
          trangThai: 'canQuyDinh',
          giaiThich:
            'Chưa có biên độ trừ điểm được phê duyệt. Phụ lục II nói ngoài khoảng thì "trừ điểm theo biên độ được duyệt", nên biên độ là tham số phải duyệt trước, không phải mặc định của phần mềm.',
        }
      }
      if (t.thucHien >= t.khoangDuoi && t.thucHien <= t.khoangTren) {
        return {
          diem: 100,
          trangThai: 'tinhDuoc',
          giaiThich: `${t.thucHien} nằm trong khoảng [${t.khoangDuoi}; ${t.khoangTren}] nên đạt 100 điểm.`,
        }
      }
      const lech = t.thucHien < t.khoangDuoi ? t.khoangDuoi - t.thucHien : t.thucHien - t.khoangTren
      const phia = t.thucHien < t.khoangDuoi ? 'dưới' : 'trên'
      const d = Math.max(0, 100 - (lech / t.bienDo) * 100)
      return {
        diem: lam(d),
        trangThai: 'tinhDuoc',
        giaiThich: `${t.thucHien} nằm ${phia} khoảng [${t.khoangDuoi}; ${t.khoangTren}], lệch ${lam(lech)} trên biên độ ${t.bienDo} nên còn ${lam(d)} điểm. Lệch phía trên bị trừ giống phía dưới: đây là kiểu chấm duy nhất phạt cả thiếu lẫn quá tải.`,
      }
    }

    default:
      return { diem: null, trangThai: 'duLieuSai', giaiThich: 'Kiểu chấm không hợp lệ.' }
  }
}

/* ------------------------------- điểm tổng ------------------------------- */

export interface ThanhPhanTong {
  ma: string
  diem: number | null
  trongSo: number
}

export type TrangThaiTong =
  | 'tinhDuoc'
  | 'khongDatCongTuanThu'
  | 'chuaDuMinhChung'
  | 'trongSoSai'

export interface KetQuaTong {
  diem: number | null
  trangThai: TrangThaiTong
  giaiThich: string
  /** Số chỉ tiêu không cho ra điểm, để hiển thị kèm thay vì giấu đi. */
  soChiTieuKhongCoDiem: number
}

/**
 * Điểm tổng = Σ (Điểm chỉ tiêu × Trọng số chỉ tiêu), tổng trọng số bằng 100%.
 *
 * @param datCongTuanThu kết quả cổng tuân thủ. false thì hàm trả null, dứt khoát.
 */
export function chamTong(
  thanhPhan: ThanhPhanTong[],
  datCongTuanThu: boolean,
  duMinhChungTrongYeu = true,
): KetQuaTong {
  const khongCoDiem = thanhPhan.filter((t) => t.diem === null).length

  if (!datCongTuanThu) {
    return {
      diem: null,
      trangThai: 'khongDatCongTuanThu',
      giaiThich:
        'Không đạt cổng tuân thủ nên không tính điểm tổng hợp. Điều 6 khoản 6: không tính điểm tổng hợp để che lấp vi phạm. Báo cáo phải xác định biện pháp, người chịu trách nhiệm và thời hạn khắc phục.',
      soChiTieuKhongCoDiem: khongCoDiem,
    }
  }
  if (!duMinhChungTrongYeu) {
    return {
      diem: null,
      trangThai: 'chuaDuMinhChung',
      giaiThich:
        'Chưa đủ minh chứng trọng yếu. Phụ lục II: không kết luận hiệu quả khi bằng chứng trọng yếu thiếu.',
      soChiTieuKhongCoDiem: khongCoDiem,
    }
  }

  const tongTrongSo = thanhPhan.reduce((s, t) => s + t.trongSo, 0)
  if (Math.abs(tongTrongSo - 100) > 0.01) {
    return {
      diem: null,
      trangThai: 'trongSoSai',
      giaiThich: `Tổng trọng số là ${lam(tongTrongSo)}%, phải bằng 100%. Phụ lục II yêu cầu trọng số được phê duyệt trước kỳ đo và không thay đổi sau khi biết kết quả.`,
      soChiTieuKhongCoDiem: khongCoDiem,
    }
  }

  // Chỉ tiêu không có điểm không được lặng lẽ coi là 0, cũng không được lặng lẽ
  // bỏ khỏi mẫu số. Cả hai cách đều làm điểm tổng sai theo hai hướng ngược nhau.
  // Cách đúng: trả điểm trên phần tính được, kèm số chỉ tiêu bị bỏ để người đọc thấy.
  const coDiem = thanhPhan.filter((t) => t.diem !== null)
  const trongSoCoDiem = coDiem.reduce((s, t) => s + t.trongSo, 0)
  if (trongSoCoDiem === 0) {
    return {
      diem: null,
      trangThai: 'chuaDuMinhChung',
      giaiThich: 'Không chỉ tiêu nào cho ra điểm.',
      soChiTieuKhongCoDiem: khongCoDiem,
    }
  }

  const tong = coDiem.reduce((s, t) => s + (t.diem as number) * (t.trongSo / 100), 0)
  const quyDoi = (tong / trongSoCoDiem) * 100

  return {
    diem: lam(quyDoi),
    trangThai: 'tinhDuoc',
    giaiThich:
      khongCoDiem === 0
        ? `Σ(điểm × trọng số) trên toàn bộ ${thanhPhan.length} chỉ tiêu.`
        : `Tính trên ${coDiem.length}/${thanhPhan.length} chỉ tiêu có điểm, chiếm ${lam(trongSoCoDiem)}% trọng số, rồi quy về thang 100. ${khongCoDiem} chỉ tiêu không cho ra điểm và KHÔNG được coi là 0.`,
    soChiTieuKhongCoDiem: khongCoDiem,
  }
}

/* -------------------------------- xếp loại -------------------------------- */

export interface MucXepLoai {
  tu: number
  den: number
  ten: string
  mau: 'ok' | 'tot' | 'canCaiThien' | 'thap' | 'khong'
}

/** Thang xếp loại ở Phụ lục II. Ranh giới lấy đúng văn bản, không làm tròn lại. */
export const THANG_XEP_LOAI: MucXepLoai[] = [
  { tu: 90, den: 100, ten: 'Hiệu quả rất cao', mau: 'ok' },
  { tu: 80, den: 90, ten: 'Hiệu quả tốt', mau: 'tot' },
  { tu: 65, den: 80, ten: 'Đạt yêu cầu nhưng cần cải thiện', mau: 'canCaiThien' },
  { tu: 50, den: 65, ten: 'Hiệu quả thấp', mau: 'thap' },
  { tu: 0, den: 50, ten: 'Không hiệu quả', mau: 'khong' },
]

/** Trạng thái không tính điểm, đứng ngoài thang. */
export const TRANG_THAI_NGOAI_THANG = [
  { ten: 'Không đạt cổng tuân thủ', xuLy: 'Khắc phục vi phạm; chỉ chấm lại khi đủ điều kiện.' },
  {
    ten: 'Chưa đủ minh chứng',
    xuLy: 'Bổ sung, xác minh dữ liệu; không kết luận hiệu quả khi bằng chứng trọng yếu thiếu.',
  },
]

export function xepLoai(diem: number | null): MucXepLoai | null {
  if (diem === null || Number.isNaN(diem)) return null
  // Ranh giới đóng dưới, mở trên: "80 - dưới 90". Riêng mức cao nhất đóng cả hai đầu.
  for (const m of THANG_XEP_LOAI) {
    if (m.tu === 90 ? diem >= 90 : diem >= m.tu && diem < m.den) return m
  }
  return THANG_XEP_LOAI[THANG_XEP_LOAI.length - 1]
}

/* ------------------------- ma trận hai trục tài sản ------------------------ */

/**
 * Điều 9 khoản 4: ngoài điểm tổng, tài sản phải phân loại trên hai trục, vì một
 * tài sản có thể đồng thời quá tải và lạc hậu, hoặc sử dụng thấp nhưng vẫn cần
 * duy trì do yêu cầu dự phòng, an toàn hoặc chiến lược.
 */
export type ODuTruc = 'giuNguyen' | 'khaiThacTot' | 'ungVienThanhLy' | 'uuTienThayThe'

export const O_HAI_TRUC: Record<ODuTruc, { ten: string; moTa: string; bienPhap: string }> = {
  khaiThacTot: {
    ten: 'Khai thác tốt',
    moTa: 'Sử dụng cao trên nền kỹ thuật còn tốt.',
    bienPhap: 'Tiếp tục theo kế hoạch; duy trì và nhân rộng có chọn lọc.',
  },
  giuNguyen: {
    ten: 'Giữ, chưa cần can thiệp',
    moTa: 'Kỹ thuật còn tốt nhưng dùng ít.',
    bienPhap: 'Xem lại xếp lịch, đào tạo người dùng, khả năng dùng chung trước khi nghĩ tới điều chuyển.',
  },
  uuTienThayThe: {
    ten: 'Ưu tiên thay thế ngay',
    moTa: 'Sử dụng cao trên nền thiết bị đã xuống cấp. Rủi ro lớn nhất trong bốn ô.',
    bienPhap: 'Bổ sung năng lực, thay thế, hoặc cơ cấu lại hợp đồng. Kiểm tra an toàn trước.',
  },
  ungVienThanhLy: {
    ten: 'Ứng viên điều chuyển hoặc thanh lý',
    moTa: 'Dùng ít và kỹ thuật kém.',
    bienPhap:
      'Điều 20 khoản 2: phải phân tích nguyên nhân TRƯỚC khi điều chuyển hoặc thanh lý, gồm nhu cầu dự phòng, tính mùa vụ, yêu cầu kiểm định, chức năng chiến lược, thiếu đào tạo, lỗi xếp lịch hoặc không phù hợp kỹ thuật.',
  },
}

export function oHaiTruc(mucSuDungCao: boolean, tinhTrangTot: boolean): ODuTruc {
  if (mucSuDungCao && tinhTrangTot) return 'khaiThacTot'
  if (mucSuDungCao && !tinhTrangTot) return 'uuTienThayThe'
  if (!mucSuDungCao && tinhTrangTot) return 'giuNguyen'
  return 'ungVienThanhLy'
}
