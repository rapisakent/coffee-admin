# Coffee Admin

CRM & ERP cho quán cà phê nhỏ và nhà phân phối máy pha cà phê: khách hàng, bán hàng, kho, mua hàng, bảo hành/bảo trì, thu chi, công nợ, hóa đơn, báo cáo và nhật ký hoạt động. Hơn 25 màn hình dựng từ file Figma "Coffee Việt Ý", có chế độ sáng/tối và nhiều bảng màu.

Công nghệ: React 19, TypeScript (strict), Vite, Zustand, axios, React Router. Dữ liệu đi qua một REST API giả lập đọc/ghi `mock/db.json` (có thể đổi sang backend thật bằng `VITE_API_URL`).

```bash
npm install
npm run dev         # http://localhost:5173 — kèm mock API
npm run build       # kiểm tra kiểu + build vào dist/
npm run preview     # chạy bản build (mock API vẫn chạy kèm)
npm run mock:reset  # đưa mock/db.json về dữ liệu mẫu
```

Giao diện dựng theo file Figma "Coffee Việt Ý"; style là CSS thuần với design token (không dùng Tailwind hay thư viện component). Dữ liệu trong `mock/` là dữ liệu giả.

## Tìm gì ở đâu

| Cần | Chỗ |
|---|---|
| Danh sách route + menu | `src/nav.ts` (thêm trang = thêm 1 dòng, `routes.tsx` tự sinh) |
| **Mọi endpoint API** | `src/api/index.ts` |
| Gọi mạng (axios), lỗi, base URL, timeout | `src/api/http.ts` |
| Dữ liệu mock | `mock/db.json` |
| Mock server (REST đọc/ghi `db.json`) | `server/mockApi.ts` |
| State của 1 collection (load / add / update / remove) | `src/stores/createEntityStore.ts` |
| Trang danh sách dùng chung (tìm kiếm, lọc, CSV, form tạo/sửa, xóa) | `src/components/EntityListPage.tsx` |
| Theme / bảng màu | `src/stores/theme.ts`, `src/styles/tokens.css` |

Thêm nút sửa cho một trang danh sách: truyền `canEdit` và dùng tham số `editing` của `renderForm` (tên ô trong form phải trùng khóa của bản ghi); thêm nút xóa: truyền `onRemove`.

Mỗi màn hình nằm trong `src/features/<tên>/`: `data.ts` (kiểu + nhãn trạng thái), `store.ts` (1 dòng nối API → store), `*Form.tsx`, `*Page.tsx`.

## API

Mock API chạy trong `vite dev` / `vite preview`, dữ liệu ở `mock/db.json` (sửa tay được, ghi đè khi thao tác trên UI):

```
GET    /api/:name        mảng collection, hoặc object (vd. /api/dashboard)
POST   /api/:name        thêm { id, ... }                -> 201 | 409 trùng id
PATCH  /api/:name/:id    cập nhật một phần               -> 200 | 404
PUT    /api/:name        gộp trường vào document (vd. /api/settings) -> 200
DELETE /api/:name/:id                                    -> 204 | 404
```

Dữ liệu mẫu gốc nằm ở `mock/db.seed.json`; `npm run mock:reset` chép nó đè lên `mock/db.json` (đưa mọi thứ về trạng thái ban đầu, xóa nhật ký).

Nối backend thật: đặt `VITE_API_URL=https://api.example.com`, rồi xóa `server/mockApi.ts` và plugin trong `vite.config.ts`. Backend phải theo các quy ước mà mock đang định nghĩa: id do client sinh khi POST, `204` không có body khi DELETE, `GET /dashboard`, `GET|PUT /settings`, và `GET /activity` (server tự ghi mỗi thao tác thêm/sửa/xóa).

`dashboard` là dữ liệu trình bày bám theo Figma (tên sản phẩm rút gọn, số liệu tháng), không tính từ các collection; trang Báo cáo thì tính từ collection nên hai nơi có thể cho số khác nhau.

Module không theo khuôn `data/store/Form/Page`: `dashboard` và `settings` (đọc một document, không có store), `reports` (chỉ đọc từ store của module khác), `inventory` (dùng lại store của `products`).

Thêm một collection mới: (1) thêm mảng vào `mock/db.json`, (2) thêm 1 dòng `collection<Kiểu>('tên')` vào `src/api/index.ts`, (3) `createEntityStore(api.tên)` trong `features/<x>/store.ts`.

`localStorage` chỉ còn giữ tuỳ chọn giao diện (chế độ sáng/tối, bảng màu), không giữ dữ liệu nghiệp vụ.
