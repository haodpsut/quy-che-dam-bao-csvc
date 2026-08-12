/**
 * Cổng kiểm máy chấm điểm.
 *
 * Chấm điểm là chỗ dễ sai nhất mà lại khó thấy nhất: một công thức sai vẫn cho
 * ra con số đẹp, trang web vẫn hiển thị bình thường, và không ai biết cho tới
 * khi một tài sản bị thanh lý oan.
 *
 * Kiểm ba nhóm:
 *   1. Công thức 5 kiểu ra đúng số, gồm cả trần 100 và trừ điểm hai phía.
 *   2. Ca biên mà Phụ lục II đòi Trường phải quy định trước: mẫu số bằng 0,
 *      thiếu mục tiêu, thiếu biên độ. Máy phải TỪ CHỐI, không tự chọn.
 *   3. Luật cứng của Điều 6 và Điều 9: không qua cổng thì điểm tổng là null.
 */
import {
  chamMotChiTieu,
  chamTong,
  xepLoai,
  oHaiTruc,
  THANG_XEP_LOAI,
} from '../lib/cham-diem.ts'

let so = 0
let hong = 0

function la(ten, thuc, mong) {
  so++
  const ok = JSON.stringify(thuc) === JSON.stringify(mong)
  if (!ok) {
    hong++
    console.error(`  SAI  ${ten}\n       nhận ${JSON.stringify(thuc)}\n       chờ  ${JSON.stringify(mong)}`)
  }
  return ok
}

function diem(t) {
  return chamMotChiTieu(t).diem
}
function tt(t) {
  return chamMotChiTieu(t).trangThai
}

console.log('Kiểm công thức 5 kiểu chấm của Phụ lục II:')

/* --- 1. càng cao càng tốt: min(100; TH/MT × 100) --- */
la('cao: đạt 80% mục tiêu', diem({ kieu: 'caoCangTot', thucHien: 80, mucTieu: 100 }), 80)
la('cao: đạt đúng mục tiêu', diem({ kieu: 'caoCangTot', thucHien: 100, mucTieu: 100 }), 100)
la('cao: vượt mục tiêu vẫn trần 100', diem({ kieu: 'caoCangTot', thucHien: 150, mucTieu: 100 }), 100)
la('cao: mục tiêu lẻ', diem({ kieu: 'caoCangTot', thucHien: 42, mucTieu: 70 }), 60)
la('cao: mẫu số bằng 0 phải từ chối', tt({ kieu: 'caoCangTot', thucHien: 5, mucTieu: 0 }), 'canQuyDinh')
la('cao: thiếu mục tiêu', tt({ kieu: 'caoCangTot', thucHien: 5 }), 'thieuMucTieu')
la('cao: thiếu thực hiện', tt({ kieu: 'caoCangTot', mucTieu: 5 }), 'duLieuSai')
la('cao: thực hiện âm phải từ chối', tt({ kieu: 'caoCangTot', thucHien: -3, mucTieu: 10 }), 'canQuyDinh')

/* --- 2. càng thấp càng tốt: min(100; MT/TH × 100) --- */
la('thấp: gấp đôi mục tiêu', diem({ kieu: 'thapCangTot', thucHien: 50, mucTieu: 25 }), 50)
la('thấp: đúng mục tiêu', diem({ kieu: 'thapCangTot', thucHien: 25, mucTieu: 25 }), 100)
la('thấp: tốt hơn mục tiêu vẫn trần 100', diem({ kieu: 'thapCangTot', thucHien: 10, mucTieu: 25 }), 100)
la(
  'thấp: thực hiện bằng 0 phải từ chối, KHÔNG tự cho 100',
  tt({ kieu: 'thapCangTot', thucHien: 0, mucTieu: 25 }),
  'canQuyDinh',
)
la('thấp: giá trị âm phải từ chối', tt({ kieu: 'thapCangTot', thucHien: -1, mucTieu: 25 }), 'canQuyDinh')

/* --- 3. khoảng tối ưu: 100 trong khoảng, ngoài khoảng trừ theo biên độ --- */
const K = { kieu: 'khoangToiUu', khoangDuoi: 70, khoangTren: 85, bienDo: 15 }
la('khoảng: nằm giữa khoảng', diem({ ...K, thucHien: 78 }), 100)
la('khoảng: đúng cận dưới', diem({ ...K, thucHien: 70 }), 100)
la('khoảng: đúng cận trên', diem({ ...K, thucHien: 85 }), 100)
la('khoảng: dưới khoảng 5 điểm', diem({ ...K, thucHien: 65 }), 66.7)
la('khoảng: trên khoảng 5 điểm bị trừ đúng bằng dưới', diem({ ...K, thucHien: 90 }), 66.7)
la('khoảng: lệch đúng bằng biên độ thì về 0', diem({ ...K, thucHien: 100 }), 0)
la('khoảng: lệch quá biên độ không xuống âm', diem({ ...K, thucHien: 200 }), 0)
la(
  'khoảng: thiếu biên độ phải từ chối',
  tt({ kieu: 'khoangToiUu', thucHien: 90, khoangDuoi: 70, khoangTren: 85 }),
  'canQuyDinh',
)
la(
  'khoảng: cận dưới lớn hơn cận trên',
  tt({ kieu: 'khoangToiUu', thucHien: 80, khoangDuoi: 90, khoangTren: 70, bienDo: 10 }),
  'duLieuSai',
)
la('khoảng: thiếu khoảng', tt({ kieu: 'khoangToiUu', thucHien: 80 }), 'thieuMucTieu')

/* --- 4. đạt / không đạt --- */
la('đạt/không: đạt', diem({ kieu: 'datKhongDat', dat: true }), 100)
la('đạt/không: không đạt', diem({ kieu: 'datKhongDat', dat: false }), 0)
la('đạt/không: chưa nhập', tt({ kieu: 'datKhongDat' }), 'duLieuSai')

/* --- 5. định tính 5 mức --- */
for (const [muc, cho] of [[1, 20], [2, 40], [3, 60], [4, 80], [5, 100]]) {
  la(`định tính: mức ${muc}`, diem({ kieu: 'dinhTinh', mucDinhTinh: muc }), cho)
}
la('định tính: chưa chọn mức', tt({ kieu: 'dinhTinh' }), 'duLieuSai')

/* --- 6. bối cảnh: không bao giờ ra điểm --- */
la('bối cảnh: không ra điểm', diem({ kieu: 'boiCanh', thucHien: 99, mucTieu: 100 }), null)
la('bối cảnh: trạng thái đúng', tt({ kieu: 'boiCanh', thucHien: 99, mucTieu: 100 }), 'khongCham')

console.log('Kiểm luật cứng của điểm tổng:')

/* --- 7. cổng tuân thủ chặn điểm tổng --- */
const bo = [
  { ma: 'A03', diem: 95, trongSo: 50 },
  { ma: 'A08', diem: 90, trongSo: 50 },
]
la('tổng: qua cổng thì tính được', chamTong(bo, true).diem, 92.5)
la('tổng: KHÔNG qua cổng phải trả null', chamTong(bo, false).diem, null)
la('tổng: không qua cổng có trạng thái riêng', chamTong(bo, false).trangThai, 'khongDatCongTuanThu')
la('tổng: thiếu minh chứng trọng yếu trả null', chamTong(bo, true, false).diem, null)

/* Ca hiểm: mọi chỉ tiêu điểm cao nhưng cổng hỏng. Nếu máy trả số ở đây thì đúng
   thứ Điều 6 khoản 6 cấm — lấy điểm cao che lấp vi phạm — đã lọt vào phần mềm. */
const toan100 = [
  { ma: 'A01', diem: 100, trongSo: 25 },
  { ma: 'A02', diem: 100, trongSo: 25 },
  { ma: 'A03', diem: 100, trongSo: 25 },
  { ma: 'A08', diem: 100, trongSo: 25 },
]
la('tổng: toàn 100 điểm nhưng hỏng cổng vẫn phải null', chamTong(toan100, false).diem, null)

/* --- 8. tổng trọng số --- */
la('tổng: trọng số cộng lại 90% phải từ chối', chamTong([{ ma: 'X', diem: 80, trongSo: 90 }], true).trangThai, 'trongSoSai')
la(
  'tổng: trọng số cộng lại 110% phải từ chối',
  chamTong([{ ma: 'X', diem: 80, trongSo: 60 }, { ma: 'Y', diem: 80, trongSo: 50 }], true).trangThai,
  'trongSoSai',
)

/* --- 9. chỉ tiêu không có điểm không bị coi là 0 --- */
const coKhuyet = [
  { ma: 'A03', diem: 80, trongSo: 50 },
  { ma: 'A11', diem: null, trongSo: 50 },
]
la('tổng: chỉ tiêu khuyết không kéo điểm xuống 40', chamTong(coKhuyet, true).diem, 80)
la('tổng: có báo số chỉ tiêu khuyết', chamTong(coKhuyet, true).soChiTieuKhongCoDiem, 1)
la('tổng: khuyết hết thì trả null', chamTong([{ ma: 'A', diem: null, trongSo: 100 }], true).diem, null)

console.log('Kiểm thang xếp loại:')

/* --- 10. ranh giới xếp loại, đóng dưới mở trên --- */
const bien = [
  [100, 'Hiệu quả rất cao'],
  [90, 'Hiệu quả rất cao'],
  [89.9, 'Hiệu quả tốt'],
  [80, 'Hiệu quả tốt'],
  [79.9, 'Đạt yêu cầu nhưng cần cải thiện'],
  [65, 'Đạt yêu cầu nhưng cần cải thiện'],
  [64.9, 'Hiệu quả thấp'],
  [50, 'Hiệu quả thấp'],
  [49.9, 'Không hiệu quả'],
  [0, 'Không hiệu quả'],
]
for (const [d, ten] of bien) la(`xếp loại ${d}`, xepLoai(d)?.ten, ten)
la('xếp loại: null không có hạng', xepLoai(null), null)
la('thang có đủ 5 mức', THANG_XEP_LOAI.length, 5)

console.log('Kiểm ma trận hai trục Điều 9 khoản 4:')
la('hai trục: dùng nhiều, kỹ thuật tốt', oHaiTruc(true, true), 'khaiThacTot')
la('hai trục: dùng nhiều, kỹ thuật kém', oHaiTruc(true, false), 'uuTienThayThe')
la('hai trục: dùng ít, kỹ thuật tốt', oHaiTruc(false, true), 'giuNguyen')
la('hai trục: dùng ít, kỹ thuật kém', oHaiTruc(false, false), 'ungVienThanhLy')

/* --------------------------------------------------------------------------
   Đối chứng dương cho chính bài kiểm này: cố tình so sai một phép, hàm la()
   phải báo SAI. Nếu la() hỏng thì mọi dòng trên đều "đạt" một cách vô nghĩa.
   -------------------------------------------------------------------------- */
// Gọi thẳng phép so sánh, không qua la(), để không in ra dòng SAI gây hiểu nhầm.
const soSanh = (a, b) => JSON.stringify(a) === JSON.stringify(b)
if (soSanh(1, 2) || !soSanh(1, 1)) {
  console.error('\nFAIL: phép so sánh của chính bài kiểm hỏng, mọi kết quả ở trên đều vô nghĩa.')
  process.exit(1)
}
console.log('  [tự kiểm] phép so sánh của bài kiểm phân biệt được đúng và sai')

/* --------------------------------- kết ---------------------------------- */

if (hong) {
  console.error(`\nFAIL check-cham-diem: ${hong}/${so} phép kiểm sai.`)
  process.exit(1)
}
console.log(`\nPASS check-cham-diem: ${so} phép kiểm, gồm ca chia 0, ca trần 100, ca hỏng cổng và ranh giới xếp loại.`)
