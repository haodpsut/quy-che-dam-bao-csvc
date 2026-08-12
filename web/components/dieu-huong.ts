/**
 * Cấu trúc điều hướng, để riêng một file vì cả đầu trang lẫn cổng kiểm giao diện
 * đều đọc nó. Cổng kiểm dùng đúng danh sách này để mở từng nhóm và xác nhận mọi
 * mục bên trong bấm được, nên không có chuyện thêm một trang mới mà quên đưa vào
 * menu rồi không ai phát hiện.
 */

export interface MucNav {
  href: string
  ten: string
  /** Câu ngắn hiện dưới tên trong menu thả xuống. */
  mo: string
}

export interface NhomNav {
  khoa: string
  ten: string
  muc: MucNav[]
}

export const NHOM_NAV: NhomNav[] = [
  {
    khoa: 'van-ban',
    ten: 'Văn bản',
    muc: [
      { href: '/toan-van', ten: 'Toàn văn Quy định', mo: '7 chương, 35 điều, 4 phụ lục' },
      { href: '/quyet-dinh', ten: 'Quyết định và căn cứ', mo: '4 điều ban hành, 12 căn cứ pháp lý' },
    ],
  },
  {
    khoa: 'thuoc-do',
    ten: 'Thước đo',
    muc: [
      { href: '/chi-tieu', ten: 'Từ điển 47 chỉ tiêu', mo: 'Lọc theo nhóm, lớp, kiểu chấm, tần suất' },
      { href: '/nguong', ten: 'Ngưỡng và trạng thái', mo: 'Con số nào là luật, con số nào chưa duyệt' },
      { href: '/cong-tuan-thu', ten: 'Cổng tuân thủ', mo: '5 nhóm điều kiện chặn trước khi chấm' },
      { href: '/cham-diem', ten: 'Chấm điểm và xếp loại', mo: 'Máy chấm 5 kiểu, thang 7 mức' },
    ],
  },
  {
    khoa: 'doi-tuong',
    ten: 'Theo đối tượng',
    muc: [
      { href: '/vong-doi-du-an', ten: 'Dự án đầu tư', mo: 'Vòng đời 5 giai đoạn, nhóm I01-I09' },
      { href: '/co-so-vat-chat', ten: 'Cơ sở vật chất', mo: 'Phòng học, phòng thí nghiệm, nhóm A01-A14' },
      { href: '/ha-tang-so', ten: 'Hạ tầng số', mo: 'Phân tầng, mức dịch vụ, AI, nhóm D01-D15' },
    ],
  },
  {
    khoa: 'van-hanh',
    ten: 'Vận hành',
    muc: [
      { href: '/quy-trinh', ten: 'Quy trình 8 bước', mo: 'Chủ trì, sản phẩm, thời hạn, cổng chặn' },
      { href: '/lay-mau', ten: 'Lấy mẫu theo rủi ro', mo: 'Ma trận 5 mức, ô tính cỡ mẫu' },
      { href: '/trach-nhiem', ten: 'Trách nhiệm đơn vị', mo: 'Ai xác nhận loại dữ liệu nào' },
      { href: '/phieu-de-xuat', ten: 'Phiếu đề xuất phê duyệt', mo: '11 quyết định còn thiếu, in được' },
    ],
  },
]

/** Mọi đường dẫn có trong menu, để cổng kiểm đối chiếu với tập route đã dựng. */
export const MOI_DUONG = NHOM_NAV.flatMap((n) => n.muc.map((m) => m.href))
