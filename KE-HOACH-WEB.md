# Kế hoạch dựng web triển khai Quy định đánh giá hiệu quả đầu tư và sử dụng tài sản DAU

Nguồn: `(08-2026) Quy dinh danh gia hieu qua dau tu va su dung tai san cua DAU_1 (1).docx`
Ngày lập kế hoạch: 12/08/2026

---

## 0. Văn bản này thực chất là gì

Đọc kỹ thì đây không phải một quy chế mô tả chung chung. Nó là **một hệ đo đã đóng gói đủ để chạy được**, gồm bốn mảnh khớp vào nhau:

| Mảnh | Nội dung | Vị trí |
|---|---|---|
| Luật chơi | 7 chương / 35 điều: nguyên tắc, phân loại, cổng tuân thủ, tiêu chí theo từng loại đối tượng, quy trình, trách nhiệm | Chương I-VII |
| Thước đo | 47 chỉ tiêu có mã, có công thức, có nguồn, có tần suất | Phụ lục I |
| Cách quy đổi ra kết luận | 5 kiểu chấm điểm, công thức điểm tổng hợp, ma trận 5 nhóm trọng số, 7 mức xếp loại | Phụ lục II |
| Cách vận hành | 8 bước có chủ trì / sản phẩm / thời hạn, ma trận lấy mẫu 5 mức rủi ro | Phụ lục III, IV |

Vì bốn mảnh này đầy đủ, web không chỉ là chỗ đọc văn bản. Nó có thể **chạy được kỳ đánh giá thật**.

### Ba lớp đánh giá tách biệt (Điều 3 khoản 2)

Đây là trục kiến trúc của cả web. Văn bản bắt buộc tách ba lớp và cấm dùng lớp này thay lớp kia:

1. **Sức khỏe tài chính của Trường** — F01-F05, là *bối cảnh*, Điều 10 khoản 1 nói rõ không được dùng thay cho đánh giá từng dự án
2. **Hiệu quả từng dự án đầu tư** — I01-I09, theo vòng đời 5 giai đoạn
3. **Hiệu quả khai thác từng tài sản / hệ thống** — A01-A14 (vật chất) và D01-D15 (số)

### Đặc trưng quan trọng nhất: văn bản chống lại việc chấm điểm mù

Đây là chỗ web dễ làm hỏng nhất nếu dựng ẩu. Bốn cơ chế phòng vệ trong văn bản:

- **Cổng tuân thủ chặn trước** (Điều 6): chưa qua cổng thì *không chấm điểm tổng*, không được lấy điểm sử dụng cao bù cho vi phạm. Trạng thái riêng: "Không đạt cổng tuân thủ" và "Chưa đủ minh chứng", cả hai đều **không tính điểm**.
- **Mọi con số ngưỡng đều bị hạ cấp xuống mục tiêu nội bộ**: Điều 10 khoản 4 (100%, 15-30%, 60-70%, 10-15%), Điều 17 khoản 3 (70-85%), Điều 21 khoản 3 (99,5%), Điều 23 khoản 3 (90%, 85%), Điều 29 khoản 2 (10-20%). Chỉ **2,8 m²/người học quy đổi** (Điều 17 khoản 4, theo TT 01/2024) là điều kiện tuân thủ thật.
- **Cấm chỉ tiêu đơn lẻ kết luận** (Điều 9 khoản 2) và cấm đọc điểm tổng tách rời điểm thành phần, xu hướng, độ tin cậy dữ liệu.
- **Chống tối ưu ngược**: Điều 19 khoản 5 (giảm chi phí điện/nước/bảo trì chỉ tốt khi không tăng hỏng hóc), Điều 24 khoản 1 (số sự cố an ninh thấp có thể do không phát hiện), Điều 23 khoản 4 (sử dụng thấp phải phân tích nguyên nhân trước khi kết luận lãng phí).

**Hệ quả cho web**: nếu dựng một trang gõ số vào rồi phun ra "Hiệu quả tốt", ta đã xây đúng thứ mà văn bản viết ra để ngăn. Mọi màn hình chấm điểm phải hiển thị trạng thái cổng tuân thủ trước điểm, và mọi ngưỡng phải mang nhãn nguồn gốc pháp lý.

---

## 1. Quyết định đã chốt

| Hạng mục | Lựa chọn |
|---|---|
| Phạm vi | Hai giai đoạn: G1 tra cứu, G2 công cụ vận hành |
| Lưu trữ | Tĩnh, chưa backend. Nội dung quy chế nằm trong repo; dữ liệu đánh giá dùng localStorage + xuất/nhập JSON |
| Vị trí mã nguồn | `quy-che-dam-bao-co-so-vat-chat/web/` — dự án Next.js riêng |
| Nhận diện | Bộ token màu DAU chép từ `quantridaihoc/web/app/globals.css` + `dau-logo.png` |

### Bộ màu DAU dùng lại nguyên, không pha mới

```
--brand:  #990000  maroon DAU        (header, tiêu đề chương)
--gold:   #fbae40  dải nhấn dưới header
--navy:   #0e2841  chân trang
--info:   #1f4e79  khối ghi chú
```

Lý do lấy nguyên: ba mã này đã đồng bộ giữa template slide LaTeX của Trường và web quy trình đào tạo đang chạy. Pha thêm màu mới sẽ làm lệch bộ nhận diện. Khối info dùng navy chứ không dùng `brand-soft`, vì đỏ nhạt gần trùng đỏ cảnh báo, một ghi chú bình thường sẽ trông như cảnh báo.

---

## 2. Mô hình dữ liệu

Toàn bộ nằm trong `web/data/`, kiểu TypeScript, không có DB ở G1.

```
data/
  toan-van.ts       cấu trúc chương → điều → khoản → điểm, giữ nguyên chữ
  quyet-dinh.ts     4 điều của QĐ ban hành + 12 căn cứ pháp lý
  chi-tieu.ts       47 chỉ tiêu Phụ lục I
  cong-tuan-thu.ts  5 nhóm điều kiện Điều 6, ánh xạ sang C01-C04
  cham-diem.ts      5 kiểu chấm + ma trận trọng số + 7 mức xếp loại
  quy-trinh.ts      8 bước Phụ lục III
  lay-mau.ts        5 mức rủi ro Phụ lục IV
  nguong.ts         bảng mọi con số trong văn bản + trạng thái pháp lý
  phan-loai.ts      mức I/II/III (Điều 5), tầng 1/2/3 hệ thống số (Điều 21)
```

### `chi-tieu.ts` — kiểu dữ liệu cốt lõi

```ts
type Nhom = 'C' | 'F' | 'I' | 'A' | 'D'
type LopDanhGia = 'taichinh' | 'duan' | 'taisan' | 'hatangso'
type KieuCham = 'caocangtot' | 'thapcangtot' | 'khoangtoiuu' | 'datkhongdat' | 'dinhtinh'

interface ChiTieu {
  ma: string              // 'A03'
  ten: string
  nhom: Nhom
  lop: LopDanhGia[]
  congThuc: string        // nguyên văn Phụ lục I
  tuSo?: string           // tách để dựng máy tính ở G2
  mauSo?: string
  donVi: '%' | 'giờ' | 'm²' | 'đồng' | 'điểm' | 'tỷ lệ' | 'khác'
  nguon: string[]         // ['Lịch', 'nhật ký']
  tanSuat: TanSuat[]      // ['hocky']
  dienGiai: string
  kieuCham: KieuCham
  laCongTuanThu: boolean
  nguongLienQuan?: string[]   // id trong nguong.ts
  dieuLienQuan: number[]      // [17] → neo sang toàn văn
  canhBao?: string            // 'Không dùng đơn độc', 'Không đặt mục tiêu giảm báo cáo'
}
```

Trường `canhBao` và `nguongLienQuan` là hai trường bắt buộc phải có với các chỉ tiêu nhạy cảm, vì chúng mang đúng phần văn bản cố ý cảnh báo. Bỏ hai trường này là làm mất tinh thần quy chế.

### `nguong.ts` — trường bắt buộc chống bịa chuẩn

```ts
interface Nguong {
  id: string
  giaTri: string          // '70% - 85%'
  apDungCho: string       // 'Tỷ lệ sử dụng thời gian phòng học'
  trangThai: 'phapLyBatBuoc' | 'mucTieuNoiBoChuaDuyet' | 'mucTieuNoiBoDaDuyet'
  canCu: string           // 'TT 01/2024' hoặc 'Điều 17 khoản 3 — cần Hiệu trưởng phê duyệt'
  ghiChu: string
}
```

Hiện tại **chỉ duy nhất `2,8 m²/người học quy đổi` mang trạng thái `phapLyBatBuoc`**. Tất cả các con số còn lại vào `mucTieuNoiBoChuaDuyet` cho tới khi có quyết định phê duyệt thật. Web hiển thị chúng bằng badge xám kèm chữ "chưa phê duyệt", không phải badge đỏ như chuẩn cứng.

---

## 3. Bản đồ route

### Giai đoạn 1 — tra cứu và phổ biến (13 route)

| Route | Nội dung | Nguồn |
|---|---|---|
| `/` | Ba lớp đánh giá, mốc hiệu lực 15/8/2026, lối vào nhanh, trạng thái "chưa phê duyệt ngưỡng" | tổng hợp |
| `/toan-van` | Toàn văn 7 chương / 35 điều, mục lục dính bên trái, neo `#dieu-17-khoan-3` | toàn bộ |
| `/quyet-dinh` | 4 điều QĐ ban hành + 12 căn cứ pháp lý, mỗi căn cứ một thẻ | QĐ |
| `/chi-tieu` | Bảng 47 chỉ tiêu, lọc theo nhóm C/F/I/A/D, theo lớp, theo tần suất, theo kiểu chấm | PL I |
| `/chi-tieu/[ma]` | Một chỉ tiêu: công thức, nguồn, tần suất, diễn giải, cảnh báo, ngưỡng liên quan, điều liên quan | PL I |
| `/cong-tuan-thu` | 5 nhóm điều kiện Điều 6, checklist in được, C01-C04 | Đ6 |
| `/nguong` | **Trang quan trọng nhất**: mọi con số trong văn bản, cái nào là luật, cái nào chỉ là mục tiêu phải duyệt | Đ10, 17, 21, 23, 29 |
| `/vong-doi-du-an` | 5 giai đoạn Điều 11, tiêu chí từng giai đoạn Điều 12-14, mốc 6/12/24 tháng | Đ11-15 |
| `/co-so-vat-chat` | Chương IV: phòng học, phòng thí nghiệm, công trình hạ tầng, vòng đời tài sản | Đ16-20 |
| `/ha-tang-so` | Chương V: phân tầng 1/2/3, SLA, RTO/RPO, an ninh, AI. Có ô tính 99,5% → 43h48'/năm | Đ21-25 |
| `/quy-trinh` | 8 bước Phụ lục III dạng sơ đồ dọc + ma trận chủ trì/phối hợp | PL III |
| `/cham-diem` | 5 kiểu chấm, công thức điểm tổng hợp, ma trận trọng số, thang 7 mức xếp loại | PL II |
| `/lay-mau` | Ma trận 5 mức rủi ro + ô tính cỡ mẫu gợi ý | PL IV |
| `/trach-nhiem` | Điều 33, sáu nhóm đơn vị, ai xác nhận cái gì, quy tắc không tự xác nhận | Đ26, 33 |
| `/tai-ve` | DOCX gốc, bản in PDF từng phần, biểu mẫu tự đánh giá | — |

### Giai đoạn 2 — công cụ vận hành (bổ sung)

| Route | Nội dung |
|---|---|
| `/ky-danh-gia` | Danh sách kỳ đánh giá, tạo kỳ mới |
| `/ky-danh-gia/[id]/ke-hoach` | Bước 1-2: chọn đối tượng, phân loại rủi ro, **chọn và khoá chỉ tiêu + trọng số + ngưỡng trước kỳ đo** |
| `/ky-danh-gia/[id]/tu-danh-gia` | Bước 3: phiếu tự đánh giá theo đối tượng, đính minh chứng (tên file + mô tả, chưa upload thật ở G1) |
| `/ky-danh-gia/[id]/cong` | Bước 4-5a: chạy cổng tuân thủ. **Không qua cổng thì màn hình chấm điểm bị khoá** |
| `/ky-danh-gia/[id]/cham` | Bước 5b: nhập giá trị thực hiện, hệ tính điểm theo kiểu chấm, hiện cả điểm thành phần |
| `/ky-danh-gia/[id]/ket-qua` | Xếp loại + biểu đồ hai trục (mức sử dụng × tình trạng kỹ thuật, theo Điều 9 khoản 4) |
| `/ky-danh-gia/[id]/bao-cao` | Sinh báo cáo theo Điều 30-31: tách phần để biết / cần quyết định / phải khắc phục |
| `/kien-nghi` | Theo dõi hành động khắc phục: chủ trì, hạn, bằng chứng đóng, cảnh báo quá hạn |

---

## 4. Bốn màn hình quyết định chất lượng của web

Đây là chỗ đáng đầu tư nhất. Ba trong bốn màn này chỉ có ở web, không thể có ở bản Word.

### 4.1 Trang `/nguong` — phân biệt luật với mong muốn

Một bảng duy nhất, mỗi dòng một con số xuất hiện trong văn bản, ba cột trạng thái:

- 🔴 **Bắt buộc theo pháp luật** — hiện chỉ có 2,8 m²/người học quy đổi
- ⚪ **Mục tiêu nội bộ, chưa phê duyệt** — 70-85%, 99,5%, 90%, 85%, 100%, 15-30%, 60-70%, 10-15%, 10-20%, 50%, 30-50%
- 🟢 **Mục tiêu nội bộ đã phê duyệt** — trống, sẽ điền khi có quyết định

Kèm mỗi dòng: điều khoản gốc, và câu nguyên văn của văn bản nói tại sao nó không phải chuẩn. Ví dụ Điều 21 khoản 3 giải thích 99,5% liên tục 24/7 tương đương tối đa khoảng 43 giờ 48 phút gián đoạn một năm — con số đó nên có ô tính lại được theo cửa sổ dịch vụ thật.

### 4.2 Máy chấm điểm 5 kiểu (`/cham-diem`, tương tác)

Cho người dùng đổi tham số thật rồi hệ tính lại, không phải phát lại kịch bản:

| Kiểu | Công thức | Bẫy phải xử |
|---|---|---|
| Càng cao càng tốt | `min(100; TH/MT × 100)` | Chỉ dùng khi quan hệ tăng là tích cực **trong toàn miền** |
| Càng thấp càng tốt | `min(100; MT/TH × 100)` | **Chia cho 0** phải có quy tắc, văn bản yêu cầu quy định rõ |
| Khoảng tối ưu | 100 trong khoảng, ngoài khoảng trừ theo biên độ duyệt | Kiểu duy nhất phạt cả thiếu lẫn quá tải |
| Đạt / không đạt | 100 hoặc 0 | Vi phạm pháp lý nghiêm trọng phải xử ở **cổng**, không phải cho 0 điểm |
| Định tính | 5 mức → 20/40/60/80/100 | Trọng yếu thì cần **tối thiểu hai người chấm** |

Màn này phải có ô nhập cho phép thấy ngay: cùng một giá trị thực hiện, đổi kiểu chấm cho ra điểm khác hẳn. Đó là lý do văn bản bắt phê duyệt kiểu chấm trước kỳ đo.

### 4.3 Biểu đồ hai trục cho tài sản (Điều 9 khoản 4)

Văn bản nói rõ một tài sản có thể **đồng thời quá tải và lạc hậu**, hoặc **sử dụng thấp nhưng vẫn phải giữ** vì dự phòng, an toàn, chiến lược. Một điểm số đơn không diễn tả được. Web vẽ ma trận:

```
tình trạng
kỹ thuật    │ giữ, chưa cần         │ khai thác tốt
   tốt      │ can thiệp             │ (giữ và nhân rộng)
            ├───────────────────────┼──────────────────────
   kém      │ ứng viên thanh lý     │ ưu tiên thay thế
            │ (phải phân tích       │ NGAY (quá tải trên
            │  nguyên nhân trước)   │  nền thiết bị hỏng)
            └───────────────────────┴──────────────────────
              sử dụng thấp            sử dụng cao
```

Bốn góc dẫn tới bốn biện pháp khác nhau ở Điều 15 khoản 2. Ô dưới trái phải kèm cảnh báo Điều 20 khoản 2: sử dụng thấp phải phân tích nguyên nhân (dự phòng, mùa vụ, thiếu người vận hành, lỗi xếp lịch) trước khi điều chuyển hoặc thanh lý.

### 4.4 Sơ đồ quy trình 8 bước có cổng

Không vẽ 8 hộp nối tiếp phẳng. Vẽ đúng chỗ có cổng và có vòng lặp:

- Bước 1 và 2 là **cổng khoá trước kỳ đo**: chỉ tiêu, trọng số, ngưỡng phải duyệt xong, sau đó không sửa (Điều 8 khoản 3)
- Bước 4-5 có **nhánh cổng tuân thủ**: không đạt thì rẽ sang trạng thái riêng, không đi tiếp vào chấm điểm
- Bước 6 là **vòng phản hồi tối thiểu 07 ngày làm việc**, có thể quay lại bước 5
- Bước 8 chỉ đóng khi **có bằng chứng và được đơn vị kiểm tra xác nhận**, quá hạn thì rẽ sang báo cáo trách nhiệm

---

## 5. Cổng kiểm số — `npm run check`

Bắt buộc, chạy được từ ngày đầu. Bài học đã có: thước đo hỏng vẫn báo "sạch" rất thuyết phục, nên mỗi cổng phải kèm một ca đối chứng dương (cố tình làm sai để xem cổng có bắt không).

| Script | Kiểm gì | Ca đối chứng dương |
|---|---|---|
| `check-toanvan.mjs` | Đủ 35 điều, 7 chương, 4 phụ lục; **so khớp chuỗi ký tự** từng khoản với bản trích từ DOCX gốc | Sửa một chữ trong data → phải FAIL |
| `check-chi-tieu.mjs` | Đủ 47 mã, không trùng, đủ 5 trường bắt buộc, mọi `dieuLienQuan` trỏ tới điều có thật | Xoá một trường → phải FAIL |
| `check-nguong.mjs` | Mọi con số dạng `\d+([,.]\d+)?%` hoặc `m²` trong toàn văn phải có mục tương ứng trong `nguong.ts` có `trangThai` | Thêm ngưỡng không nhãn → phải FAIL |
| `check-cham-diem.mjs` | Chạy 5 kiểu chấm trên bộ ca kiểm thử: chia 0, giá trị vượt 100, ngoài khoảng tối ưu, giá trị âm | Bỏ `min(100; ...)` → phải FAIL |
| `check-cong.mjs` | Với đối tượng không đạt cổng, hàm tính điểm tổng phải **trả về null**, không trả số | Cho nó trả số → phải FAIL |
| `check-ui.mjs` | Render từng route ra PNG rồi **nhìn**, không chỉ đếm thẻ DOM. Kiểm ở 390px và 1280px | — |
| `check-links.mjs` | Mọi neo `#dieu-x`, `#khoan-y`, mọi liên kết chéo chỉ tiêu ↔ điều đều tồn tại | — |

Ghi chú về `check-ui`: đếm bằng `grep -c` là đếm **dòng** chứ không đếm **lần xuất hiện**, và đo trước khi React hydrate sẽ cho số rỗng trông như số sạch. Cổng UI phải chụp ảnh sau khi trang ổn định rồi mở ảnh ra xem.

---

## 6. Việc cần quyết định chuyên môn, web không tự bịa được

Đây là phần phải nói thẳng. Văn bản cố ý để trống nhiều chỗ, chờ quyết định của Trường. Web không được điền hộ.

| Chỗ trống | Điều khoản | Ai quyết |
|---|---|---|
| Số và ngày Quyết định | QĐ | Hiệu trưởng |
| Ngưỡng giá trị phân mức I / II / III | Đ5 khoản 4 | Hiệu trưởng, duyệt hằng năm |
| Trọng số cụ thể 5 nhóm cho từng loại đối tượng | PL II ghi chú | Cấp có thẩm quyền, trong kế hoạch đánh giá |
| Có chọn 70-85% cho mức sử dụng phòng không | Đ17 khoản 3 | Trường phê duyệt |
| Có chọn 99,5% uptime không, cửa sổ dịch vụ ra sao | Đ21 khoản 3 | Trường phê duyệt |
| Có chọn 90% thủ tục số / 85% người dùng hoạt động không | Đ23 khoản 3 | Trường phê duyệt |
| Danh mục hồ sơ pháp lý áp dụng cho từng loại tài sản (C01) | Đ6 khoản 1 | Phòng QLDA + pháp chế |
| Định nghĩa "người dùng đủ điều kiện" cho từng hệ thống | Đ4 khoản 7, D06 | Bộ phận CNTT |
| Ba nhóm thí điểm năm đầu | Đ35 khoản 2 | Hiệu trưởng |

**Cách xử lý trên web**: mỗi chỗ trống hiển thị badge xám "chưa phê duyệt" kèm câu trích điều khoản nói ai có thẩm quyền. Kèm một trang `/phieu-de-xuat` in ra được, liệt kê đúng các ô này để Phòng Quản lý dự án và Quản trị thiết bị điền và trình duyệt. Cách này đã dùng ở web quy trình đào tạo và hiệu quả hơn là bịa số rồi để đó.

---

## 7. Lộ trình

### Giai đoạn 1 — 3 phiên làm việc

**Phiên 1: khung và dữ liệu**
- `create-next-app`, chép token màu DAU + `dau-logo.png`, dựng header maroon / dải gold / footer navy
- Trích toàn văn từ DOCX thành `toan-van.ts` có cấu trúc, giữ nguyên từng chữ
- Viết `check-toanvan.mjs` với ca đối chứng dương, chạy PASS trước khi đi tiếp

**Phiên 2: từ điển chỉ tiêu và ngưỡng**
- `chi-tieu.ts` đủ 47 mã với đầy đủ trường, gồm `canhBao` và `nguongLienQuan`
- `nguong.ts` phân loại trạng thái pháp lý
- Route `/chi-tieu`, `/chi-tieu/[ma]`, `/nguong`, `/toan-van`
- `check-chi-tieu` + `check-nguong` PASS

**Phiên 3: quy trình, chấm điểm, hoàn thiện**
- `/cham-diem` có máy tính 5 kiểu tương tác, `/quy-trinh` sơ đồ có cổng, `/lay-mau` có ô tính
- `/cong-tuan-thu`, `/vong-doi-du-an`, `/co-so-vat-chat`, `/ha-tang-so`, `/trach-nhiem`
- `/phieu-de-xuat` in được
- Bản in PDF, `check-ui` chụp và nhìn toàn bộ route, deploy Vercel

### Giai đoạn 2 — sau khi G1 chạy ổn và có phản hồi từ Phòng QLDA

- Mô hình kỳ đánh giá trên localStorage + xuất/nhập JSON
- Luồng 8 bước có khoá cổng thật
- Biểu đồ hai trục, sinh báo cáo, theo dõi kiến nghị
- Nếu Trường quyết định dùng thật cho nhiều đơn vị thì mới nâng lên Supabase, và khi đó phải rà lại Điều 7 khoản 4 về dữ liệu cá nhân

---

## 8. Liên kết với hệ thống đã có

- **Căn cứ pháp lý**: `quantridaihoc/web/data/toanvan/` đã có toàn văn `tt49-ai.json` (TT 49/2026) và `tt04-kdcl.json` (TT 04/2024) — hai căn cứ quan trọng nhất. Trang `/quyet-dinh` liên kết thẳng sang bản toàn văn đó thay vì chép lại.
- **Mốc 15/8/2026**: các nội dung theo TT 49/2026 có hiệu lực từ ngày này (Điều 3 QĐ, Điều 25 khoản 5, Điều 35 khoản 3). Web hiển thị đếm ngược hoặc trạng thái "đã có hiệu lực" tuỳ ngày truy cập.
- **Bộ chuẩn V8.6 DAU**: chỉ tiêu A05 (2,8 m²/người học) và các chỉ tiêu liên quan kiểm định nối được với dữ liệu chuẩn cơ sở giáo dục đại học đã số hoá.

---

## 9. Repo

Tài khoản: `haodpsut`. Bạn tạo repo rồi gửi URL, tôi khởi tạo mã nguồn và push.

Gợi ý tên, xếp theo mức tôi khuyến nghị:

| Tên repo | Vì sao |
|---|---|
| `dau-danh-gia-tai-san` | **Khuyến nghị.** Ngắn, có tiền tố `dau-` để nhóm cùng các repo khác của Trường, nói đúng việc chính. Deploy Vercel ra `dau-danh-gia-tai-san.vercel.app`, đọc được. |
| `dau-hieu-qua-dau-tu` | Nhấn vế đầu tư thay vì vế tài sản. Chọn nếu muốn nhấn mạnh lớp thẩm định trước đầu tư. |
| `dau-quy-che-csvc` | Bám sát tên thư mục hiện tại. Nhược: chữ "quy chế" gợi trang đọc văn bản, trong khi G2 là công cụ vận hành. |
| `dau-asset-effectiveness` | Tiếng Anh, hợp nếu sau này đưa vào hồ sơ kiểm định quốc tế. Nhược: lệch với phần còn lại của bộ repo đang dùng tiếng Việt. |

Cấu trúc repo:

```
/                     README.md, KE-HOACH-WEB.md, nguồn DOCX
/web                  Next.js app
/web/data             dữ liệu quy chế
/web/scripts          cổng kiểm số
```

Đặt `web/` làm Root Directory khi nối Vercel. Giữ file DOCX gốc trong repo làm bản đối chứng cho `check-toanvan`.

---

## 10. Rủi ro đã nhận diện

| Rủi ro | Cách chặn |
|---|---|
| Web biến thành máy chấm điểm mù, đúng thứ văn bản viết ra để ngăn | Cổng tuân thủ khoá màn chấm điểm ở tầng hàm, không chỉ ở tầng giao diện; `check-cong` bắt buộc trả `null` |
| Bịa ngưỡng cho "trông đầy đủ" | `check-nguong` fail-closed: con số nào trong toàn văn mà không có nhãn trạng thái thì build FAIL |
| Chép sai chữ khi bóc từ DOCX | `check-toanvan` so khớp chuỗi ký tự với bản trích gốc, không so khớp ngữ nghĩa |
| Dựng "núm giả": trang tương tác nhưng đổi tham số không tính lại | Máy chấm điểm và ô tính uptime phải tính thật từ input, cấm bảng số cứng |
| Sa đà vào G2 khi G1 chưa ai dùng | G1 phải deploy và lấy phản hồi Phòng QLDA trước khi mở G2 |
