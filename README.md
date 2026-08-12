# Đánh giá hiệu quả đầu tư và sử dụng tài sản — Trường Đại học Kiến trúc Đà Nẵng

Web tra cứu và hỗ trợ vận hành **Quy định về tiêu chí và quy trình đánh giá hiệu quả dự án đầu tư
và hiệu quả khai thác, sử dụng tài sản, cơ sở vật chất, trang thiết bị dạy học, trang thiết bị công
nghệ thông tin, hạ tầng kỹ thuật và hạ tầng số**.

Nguồn: [`nguon/quy-dinh-danh-gia-hieu-qua-dau-tu-va-su-dung-tai-san-DAU.docx`](nguon/)

---

## Văn bản có gì

| Phần | Nội dung |
|---|---|
| Quyết định ban hành | 4 điều, 12 căn cứ pháp lý |
| Quy định | 7 chương, 35 điều, 159 khoản |
| Phụ lục I | Từ điển **47 chỉ tiêu** (C 4, F 5, I 9, A 14, D 15) |
| Phụ lục II | 5 kiểu chấm điểm, công thức điểm tổng, ma trận trọng số, 7 mức xếp loại |
| Phụ lục III | Quy trình 8 bước có chủ trì, sản phẩm, thời hạn |
| Phụ lục IV | Ma trận lấy mẫu 5 mức rủi ro |

## Điều quyết định cách web được dựng

Quy định này được viết để **ngăn việc lấy một con số đẹp rồi kết luận**. Bốn cơ chế trong văn bản,
và cách web tôn trọng từng cơ chế:

| Cơ chế trong văn bản | Cách web thực hiện |
|---|---|
| Cổng tuân thủ chặn trước khi chấm điểm (Điều 6, Điều 9) | `chamTong()` **trả về `null`** khi chưa qua cổng, không trả 0. Luật nằm ở tầng hàm, không phải tầng giao diện |
| Gần như mọi ngưỡng là mục tiêu nội bộ chưa duyệt (Điều 8, 10, 17, 21, 23, 29) | Mỗi con số mang một trong 4 trạng thái pháp lý. Cổng `check-nguong` **fail-closed**: tỷ lệ nào trong thân văn bản mà chưa khai báo thì build hỏng |
| Cấm chỉ tiêu đơn lẻ kết luận (Điều 9 khoản 2 và 4) | Điểm tổng luôn hiển thị kèm điểm thành phần và số chỉ tiêu khuyết. Tài sản có thêm ma trận hai trục |
| Cấm tối ưu ngược (Điều 10 kh.3, Điều 19 kh.5, Điều 24 kh.1) | 4 chỉ tiêu mang kiểu `boiCanh`, không quy ra điểm. Cổng `check-chi-tieu` chặn việc đổi chúng sang kiểu chấm được |

Chỉ **2,8 m²/người học quy đổi** (TT 01/2024) và **100% giấy phép bắt buộc** là ngưỡng pháp lý
thật. 11 con số còn lại đang ở trạng thái *chưa phê duyệt*.

## Hai tầng dữ liệu, tách bạch

```
nguon/*.docx                  ← nguồn chân lý, không sửa
   │  npm run toanvan
   ▼
web/data/toan-van.generated.json   chữ NGUYÊN VĂN, sinh tự động, không ai gõ tay
web/data/chi-tieu.ts               phán đoán chuyên môn (kiểu chấm, cảnh báo, liên kết)
web/data/nguong.ts                 trạng thái pháp lý của từng con số
   │
   ▼
web/lib/du-lieu.ts            gộp hai tầng, mọi trang đọc qua đây
web/lib/cham-diem.ts          máy chấm điểm theo Phụ lục II
```

Tách hai tầng để khi ai đó không đồng ý với một phán đoán, họ sửa đúng một dòng mà không đụng vào
chữ của văn bản. Và để cổng kiểm số đối chiếu tầng chữ thẳng với file DOCX gốc.

## Cổng kiểm số

```bash
cd web
npm run check          # chạy tất cả
npm run verify:du-lieu # chỉ phần dữ liệu, nhanh, không cần build
```

| Cổng | Kiểm gì | Ca đối chứng |
|---|---|---|
| `verify:toanvan` | Bóc lại DOCX ngay lúc chạy và so từng ký tự với JSON đã commit; 7 chương / 35 điều liên tục / khoản liên tục / 47 mã đúng định dạng | 10 ca dương + 1 ca âm |
| `verify:chi-tieu` | Overlay phủ đúng tập mã, mọi tham chiếu tồn tại, 4 chỉ tiêu bối cảnh không bị đổi kiểu, chỉ tiêu gắn ngưỡng chưa duyệt bắt buộc có cảnh báo | 11 ca dương + 1 ca âm |
| `verify:nguong` | **Fail-closed theo từng điều**: mọi tỷ lệ trong thân Quy định phải được một mục nhận cho đúng điều đó; trích dẫn phải có thật trong văn bản | 11 ca dương + 1 ca âm |
| `verify:cham-diem` | 5 công thức, ca chia 0, trần 100, trừ điểm hai phía, luật cổng chặn, ranh giới xếp loại | 60 phép kiểm |
| `verify:links` | Chạy trên HTML đã dựng: 1234 liên kết, 185 neo `#dieu-*`, 247 tài nguyên tĩnh. Thêm hai chiều: mọi mục menu phải có route, mọi trang phải có lối vào trong menu | 2 ca dương + 1 ca âm |
| `verify:ui` | Dựng trang thật trong Chromium, chụp ảnh vào `shots/`, đo ở 390px và 1280px; bắt lỗi JS của trang; mở từng menu và kiểm tương phản chữ | 209 phép, gồm 5 phép kiểm núm bấm **tính lại thật** |

Mỗi cổng đều có ca đối chứng: cố tình làm hỏng dữ liệu rồi xác nhận cổng bắt được, và xác nhận bản
nguyên vẹn không báo động giả. Một cổng luôn PASS thì vô dụng, và nó trông y hệt một cổng tốt.

Bảy lỗi thật đã bị chính các cổng này bắt trong lúc dựng:

1. Trích dẫn Điều 10 khoản 4 bị cắt ngắn so với nguyên văn.
2. Phép phủ ngưỡng ban đầu đếm con số rời khỏi ngữ cảnh: xoá hẳn mục 70% - 85% của Điều 17 mà cổng
   vẫn báo sạch, vì "70" được mục 60% - 70% của Điều 10 nhận hộ. Phải neo theo từng điều.
3. Quy tắc bắt buộc có cảnh báo ban đầu chỉ dò trong Phụ lục I, để lọt A03 vì lệnh cấm của nó nằm ở
   thân Điều 17 khoản 3.
4. Cổng UI thiếu phép bắt lỗi JS nên khi thư mục `.next` hỏng, nó báo 11 phép đo tương tác hỏng rời
   rạc thay vì chỉ thẳng ra nguyên nhân. Nay mọi lỗi JS và mọi tài nguyên trả 500 đều bị bắt.
5. Vài phép đo chờ theo đồng hồ (`waitForTimeout`) thay vì chờ theo điều kiện, nên báo lỗi giả khi
   máy chậm. Đã đổi sang `waitFor`.
6. **Cổng UI đo nhầm phiên bản.** Một `next start` cũ còn giữ cổng 3987; lệnh mới bind thất bại
   trong im lặng, còn trình duyệt vẫn nhận trang từ máy chủ cũ đang phục vụ bản dựng lỗi thời. Kết
   quả PASS hay FAIL khi đó đều vô nghĩa. Nay cổng từ chối chạy nếu cổng mạng đã bận, và sau khi
   khởi động còn đối chiếu tệp CSS mà trang khai báo với tệp có thật trong `.next` của cây mã này.
7. Đo màu khi CSS chưa được áp: thẻ `.site-header` hiện ra trước khi stylesheet tới, nên chờ "thấy
   thẻ" rồi đo cho ra màu mặc định của trình duyệt. Nay chờ đúng điều kiện sắp đo.

## Bản đồ route

| Route | Nội dung |
|---|---|
| `/` | Ba lớp đánh giá, trạng thái ngưỡng, hiệu lực |
| `/toan-van` | 7 chương / 35 điều / 4 phụ lục, mục lục dính, neo `#dieu-17` |
| `/quyet-dinh` | 4 điều QĐ + 12 căn cứ pháp lý |
| `/chi-tieu` · `/chi-tieu/[ma]` | Từ điển 47 chỉ tiêu, lọc 5 chiều; 47 trang chi tiết |
| `/nguong` | **Con số nào là luật, con số nào mới chỉ là mong muốn** |
| `/cong-tuan-thu` | 5 nhóm điều kiện Điều 6, phiếu kiểm tra in được |
| `/cham-diem` | Máy chấm 5 kiểu, minh hoạ cổng chặn, thang xếp loại, ma trận hai trục |
| `/quy-trinh` | 8 bước có đánh dấu cổng chặn và vòng quay lại |
| `/lay-mau` | Ma trận 5 mức rủi ro + ô tính cỡ mẫu |
| `/vong-doi-du-an` | Chương III, 5 giai đoạn vòng đời |
| `/co-so-vat-chat` | Chương IV, nhóm A |
| `/ha-tang-so` | Chương V, nhóm D, ô tính uptime theo cửa sổ dịch vụ |
| `/trach-nhiem` | Điều 26, 33, 34; ai xác nhận dữ liệu nào |
| `/phieu-de-xuat` | **11 quyết định chuyên môn còn thiếu**, in ra để trình phê duyệt |

## Việc web không tự làm được

Quy định cố ý để trống nhiều chỗ, chờ quyết định của Trường. Web **không điền hộ**, vì điền một bộ
trọng số trông hợp lý sẽ tạo cảm giác đã có quyết định trong khi chưa ai quyết, và Điều 8 khoản 3
lại cấm sửa ngưỡng sau khi có kết quả.

Danh sách đầy đủ ở [`/phieu-de-xuat`](web/app/phieu-de-xuat/page.tsx): số và ngày Quyết định, ngưỡng
phân mức I/II/III, danh mục hồ sơ C01, bộ chỉ tiêu áp dụng, tỷ trọng 5 nhóm, biên độ trừ điểm, cách
xử lý giá trị 0, định nghĩa người dùng đủ điều kiện, giờ khả dụng, cửa sổ dịch vụ, ba nhóm thí điểm.

## Chạy

```bash
cd web
npm install
npm run dev      # http://localhost:3000
npm run build
```

Next.js 16.3 · React 19.2 · Tailwind v4 · dữ liệu tĩnh, chưa có backend.

Deploy Vercel: đặt **Root Directory** là `web`.

## Nhận diện

Ba mã màu chính thức của Trường, lấy nguyên từ template slide LaTeX và web quy trình đào tạo, không
pha màu mới: maroon `#990000`, gold `#fbae40`, navy `#0e2841`. Mặt chữ Noto Sans, cùng mặt chữ với
slide DAU.
