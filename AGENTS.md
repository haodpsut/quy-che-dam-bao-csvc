# Hướng dẫn cho agent làm việc trên repo này

## Luật số 1: không gõ lại chữ của văn bản

Toàn bộ câu chữ của Quy định nằm trong `web/data/toan-van.generated.json`, sinh ra từ
`nguon/*.docx` bằng `npm run toanvan`. **Không sửa tay file JSON đó.** Cổng `verify:toanvan` bóc lại
DOCX ngay lúc chạy và so từng ký tự, nên mọi sửa tay sẽ làm build hỏng.

Muốn đổi chữ thì sửa file DOCX gốc rồi chạy lại `npm run toanvan`.

## Luật số 2: phán đoán chuyên môn để riêng, kèm lý do

`web/data/chi-tieu.ts` và `web/data/nguong.ts` chứa phần phải suy ra từ việc đọc cả văn bản. Mỗi
mục phải nói được nó dựa vào điều khoản nào. Trường `trichDan` trong `nguong.ts` bị cổng kiểm đối
chiếu ngược lại với toàn văn, nên không bịa được.

## Luật số 3: không điền hộ chỗ văn bản để trống

Trọng số, ngưỡng phân mức I/II/III, biên độ trừ điểm, cách xử lý giá trị 0 đều chờ quyết định của
Trường. Điền một con số trông hợp lý là tạo ra ảo giác đã có quyết định. Chỗ nào chưa có thì hiển
thị trạng thái "chưa phê duyệt" và ghi rõ ai có thẩm quyền.

## Luật số 4: cổng tuân thủ chặn ở tầng hàm

`chamTong()` trả về `null` khi chưa qua cổng. Không đổi thành 0, không đổi thành số nào khác. Đây là
Điều 6 khoản 6 và Điều 9 khoản 1, và `verify:cham-diem` có ca kiểm riêng cho việc này.

## Luật số 5: thêm cổng kiểm thì phải kèm ca đối chứng

Mỗi cổng cần cả ca dương (cố tình làm hỏng, phải bắt được) và ca âm (bản nguyên vẹn, phải không báo
lỗi). Một cổng luôn PASS trông y hệt một cổng tốt.

## Chạy

```bash
cd web
npm run verify:du-lieu   # nhanh, không cần build
npm run check            # đầy đủ, gồm build + liên kết + giao diện
```

`verify:ui` dựng trang thật trong Chromium và để ảnh ở `web/shots/`. **Mở ảnh ra nhìn**, đừng chỉ
đọc dòng PASS: phép đo tự động không thấy được chữ chồng nhau hay bố cục vỡ.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
