# F&B English Hub 🍽️🍸☕
> **Nền tảng học tiếng Anh chuyên ngành Nhà hàng - Khách sạn - Đồ uống (F&B) thực chiến dành cho nhân viên và sinh viên Việt Nam.**

---

## 📋 MỤC LỤC
1. [Giới thiệu sản phẩm](#-giới-thiệu-sản-phẩm)
2. [Tech Stack & Kiến trúc](#-tech-stack--kiến-trúc)
3. [Tối ưu chi phí & Hạn mức Spark (50k Reads / 20k Writes)](#-tối-ưu-chi-phí--hiệu-năng-gói-spark-miễn-phí)
4. [Hướng dẫn cài đặt & Triển khai từng bước](#-hướng-dẫn-cài-đặt--triển-khai-từng-bước)
5. [Cấp quyền Admin & Nạp dữ liệu Seed](#-cấp-quyền-admin--nạp-dữ-liệu-mẫu)
6. [Bảo mật & Giới hạn API Key trên GCP](#-bảo-mật--giới-hạn-api-key)
7. [Danh sách tính năng đã hoàn thiện](#-danh-sách-tính-năng-đã-hoàn-thiện)
8. [Gợi ý mở rộng tiếp theo](#-gợi-ý-mở-rộng-tiếp-theo)

---

## 🍽️ GIỚI THIỆU SẢN PHẨM

**F&B English Hub** được thiết kế Mobile-First, giao diện song ngữ Việt - Anh, tông màu ẩm thực ấm cúng (terracotta / gạch nung + kem ấm + xanh ô liu), phục vụ các vị trí:
- **Waiter / Waitress (Phục vụ bàn)**: Đón khách, dẫn bàn, gọi món, hỏi độ chín steak, kiểm tra dị ứng, xử lý phàn nàn (L.A.S.T), thanh toán & tiền tip.
- **Bartender & Mixologist (Quầy Bar)**: Dụng cụ bar, dáng ly, phương pháp lắc/khuấy, mô tả hương vị cocktail, nồng độ cồn, từ chối phục vụ khách say.
- **Barista & Cafe Specialist (Cà phê)**: Menu Espresso Ý, đánh sữa microfoam cho latte art, các loại sữa hạt (oat, almond), single origin, decaf.
- **Kitchen / Chef (Bếp & Phụ bếp)**: Lệnh gọi món, thuật ngữ nấu ăn quốc tế, an toàn vệ sinh thực phẩm (HACCP), phòng ngừa lây nhiễm chéo.
- **Host / Reception (Lễ tân)**: Đặt bàn qua điện thoại, xử lý khách vãng lai, danh sách chờ (waitlist), xử lý khi kín bàn (fully booked).
- **F&B Management (Quản lý & Phỏng vấn)**: Bàn giao ca (shift handover), kiểm kê (inventory), quy tắc FIFO, 86ed list, bộ câu hỏi phỏng vấn tuyển dụng.

---

## 💻 TECH STACK & KIẾN TRÚC

- **Frontend**: React 18 + Vite 5 + TypeScript + Tailwind CSS (hỗ trợ Dark Mode & tùy chỉnh cỡ chữ).
- **Icons**: Lucide Icons.
- **Âm thanh & Giọng nói (100% Client-side, KHÔNG tốn phí lưu trữ)**:
  - **Phát âm**: Web Speech API (`SpeechSynthesis`) chuẩn giọng en-US/en-GB với 2 tốc độ (bình thường 1.0x và chậm 0.75x).
  - **Luyện nói**: Web Speech API (`SpeechRecognition / webkitSpeechRecognition`) so khớp độ chính xác và chấm điểm tương đồng (Levenshtein + Token Overlap).
- **PWA (Progressive Web App)**: Cài đặt được lên màn hình chính điện thoại (Android / iOS), có Service Worker precache và hỗ trợ ngoại tuyến.
- **Backend**: Firebase Modular SDK v10+:
  - **Authentication**: Google Sign-In (chính) + Email/Password (phụ).
  - **Cloud Firestore**: Sử dụng `initializeFirestore` với `persistentLocalCache` và `persistentMultipleTabManager` (hỗ trợ đa tab, lưu cache trên IndexedDB giúp giảm hàng chục ngàn lượt đọc).
  - **TUYỆT ĐỐI KHÔNG dùng Firebase Storage**: Hình ảnh chỉ lưu dạng chuỗi URL ngoài hoặc emoji/icon; không import `getStorage` và không có `storageBucket`.
  - **TUYỆT ĐỐI KHÔNG dùng Cloud Functions**: Toàn bộ nghiệp vụ tính điểm, SM-2 và import CSV được xử lý tối ưu phía client.

---

## ⚡ TỐI ƯU CHI PHÍ & HIỆU NĂNG GÓI SPARK MIỄN PHÍ

Gói Firebase Spark miễn phí cung cấp:
- **50.000 reads/ngày**
- **20.000 writes/ngày**
- **1 GiB lưu trữ Firestore**

### Bảng ước tính Reads/Writes cho một phiên học điển hình (15 - 20 phút):

| Hành động của người học | Số lượt Read | Số lượt Write | Cơ chế tối ưu |
| :--- | :---: | :---: | :--- |
| **Mở ứng dụng (Dashboard)** | 1 - 2 reads | 0 writes | Firestore `persistentLocalCache` lấy từ IndexedDB, chỉ đọc doc `users/{uid}` nếu có thay đổi. |
| **Xem Lộ trình (Roadmap)** | 0 - 3 reads | 0 writes | Toàn bộ danh mục Units và Lessons được cache tại IndexedDB sau lần tải đầu. |
| **Học 1 bài học (8 từ / 1 hội thoại)** | 0 reads | 0 writes | Dữ liệu bài học đã nằm trong cache client. |
| **Làm bài tập 10 câu (Quiz/Speaking)** | 0 reads | 1 write | **Gom ghi theo Batch**: Điểm số, XP, Streak, và Lịch sử bài hoàn thành được commit trong **1 atomic batch write duy nhất** ở cuối bài, thay vì ghi sau mỗi câu. |
| **Tra cứu Từ điển F&B (15 từ)** | 1 - 2 reads | 0 writes | Phân trang bằng `limit(20)` + `startAfter()`. Tìm kiếm không dấu thực hiện trên mảng `searchKeywords`. |
| **Ôn tập Flashcard SM-2 (10 từ)** | 1 read | 1 - 2 writes | Đọc danh sách `users/{uid}/srs`, cập nhật điểm giãn cách. |
| **Tổng cộng 1 phiên học** | **~3 - 5 reads** | **~2 - 3 writes** | **1 người học cả ngày chỉ tốn ~15 reads và ~8 writes!** |

> 🎯 **Kết luận**: Với hạn mức 50.000 reads/ngày, hệ thống có thể phục vụ thoải mái **2.000 - 3.000 người học hoạt động mỗi ngày** mà vẫn hoàn toàn nằm trong gói miễn phí \$0.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI TỪNG BƯỚC

### Bước 1: Cấu hình Firebase Console (Dự án `learningenglishforwork`)
1. Truy cập [Firebase Console](https://console.firebase.google.com/) và chọn đúng project `learningenglishforwork`.
2. **Bật Authentication**:
   - Vào menu **Build** → **Authentication** → tab **Sign-in method**.
   - Bật **Google**: Điền *Project public-facing name* (ví dụ: `F&B English Hub`) và chọn *Project support email* của bạn → Bấm **Save**.
   - Bật **Email/Password**: Bật switch đầu tiên (Email/Password) → Bấm **Save**.
3. **Kiểm tra Authorized domains**:
   - Trong Authentication → tab **Settings** → mục **Authorized domains**.
   - Đảm bảo danh sách có:
     - `localhost`
     - `learningenglishforwork.firebaseapp.com`
     - `learningenglishforwork.web.app`
     - Domain riêng của bạn (nếu có sau này).
4. **Tạo Cloud Firestore Database**:
   - Vào **Build** → **Firestore Database** → Bấm **Create database**.
   - Chọn chế độ: **Start in production mode** (chúng ta sẽ deploy rules ở bước sau).
   - Chọn vị trí (Region): `asia-southeast1` (Singapore) để tốc độ từ Việt Nam nhanh nhất.
   - **LƯU Ý**: KHÔNG bật Firebase Storage.

---

### Bước 2: Chuẩn bị mã nguồn & file môi trường
1. Clone hoặc mở thư mục `c:\learningenglishforwork`.
2. Kiểm tra file `.env` ở thư mục gốc (đã được tạo sẵn, đã nằm trong `.gitignore`):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyDnpIa7bQVc-xse5UW41MBrM4Jc29flv08
   VITE_FIREBASE_AUTH_DOMAIN=learningenglishforwork.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=learningenglishforwork
   VITE_FIREBASE_MESSAGING_SENDER_ID=1056599260855
   VITE_FIREBASE_APP_ID=1:1056599260855:web:1d82ea9164b6ca535a5732
   ```
3. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
4. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại `http://localhost:5173`.

---

### Bước 3: Deploy Firestore Security Rules & Indexes
Cài đặt Firebase CLI (nếu chưa có) và đăng nhập:
```bash
npm install -g firebase-tools
firebase login
```

Deploy Rules và Indexes bảo mật vào Firebase:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 🔑 CẤP QUYỀN ADMIN & NẠP DỮ LIỆU MẪU

### Cách 1: Cấp quyền Admin bằng Script Node (Khuyên dùng)
1. Vào Firebase Console → **Project settings** (biểu tượng bánh răng ⚙️) → tab **Service accounts**.
2. Bấm nút **Generate new private key** → tải file JSON về máy.
3. Đổi tên file vừa tải thành `serviceAccountKey.json` và lưu vào **thư mục gốc của dự án** (file này đã được chặn trong `.gitignore`, tuyệt đối không commit lên Git).
4. Chạy lệnh cấp quyền admin cho email bạn dùng để đăng nhập:
   ```bash
   node scripts/set-admin.js email-cua-ban@gmail.com
   ```
5. **Quan trọng**: Sau khi chạy lệnh thành công, trên giao diện web bạn hãy **Đăng xuất** rồi **Đăng nhập lại** để Firebase cấp token claim mới (`admin: true`). Khi đó bạn sẽ thấy nút **Admin** xuất hiện trên thanh điều hướng.

---

### Cách 2: Nạp dữ liệu Seed (1-Click trên Web hoặc CLI)
Hệ thống cung cấp sẵn 2 phương án seed dữ liệu mẫu:

#### 👉 Phương án A: Seed 1-Click trực tiếp trên Web (Nhanh nhất & Trực quan)
1. Đăng nhập tài khoản Admin vào trang web `http://localhost:5173/admin`.
2. Chọn tab **Seed Data (1-Click)**.
3. Bấm **Bắt đầu khởi tạo dữ liệu**. Thanh tiến trình sẽ hiển thị trực tiếp quá trình nạp:
   - 6 Chuyên ngành F&B (Waiter, Bartender, Barista, Kitchen, Reception, Management)
   - 9 Chủ đề Unit và 24 Bài học / Hội thoại
   - **Hơn 100+ từ vựng F&B chất lượng cao** có IPA, ví dụ và mẹo văn hóa
   - 30 bài tập tương tác (Speaking, Role-play, Matching, Listening...)
   - 40+ mẫu câu giao tiếp nhanh (Phrasebook)
   - Bảng quy chuẩn văn hóa & tiền tip

#### 👉 Phương án B: Seed qua terminal CLI
Nếu bạn đã có `serviceAccountKey.json`, chỉ cần chạy:
```bash
node scripts/seed.js
```

---

## 🌐 BUILD & DEPLOY LÊN FIREBASE HOSTING

Sau khi kiểm tra trên máy hoàn tất, đóng gói và deploy lên Hosting:
```bash
npm run build
firebase deploy --only hosting
```
Trang web của bạn sẽ hoạt động trực tiếp tại:
- `https://learningenglishforwork.web.app`
- `https://learningenglishforwork.firebaseapp.com`

---

## 🔒 BẢO MẬT & GIỚI HẠN API KEY

Để bảo vệ Firebase API key không bị website lạ lạm dụng:
1. Mở [Google Cloud Console](https://console.cloud.google.com/apis/credentials) và chọn dự án `learningenglishforwork`.
2. Tìm API Key trong danh sách (tương ứng với key trong `.env`).
3. Trong mục **Application restrictions**, chọn **Websites (HTTP referrers)**.
4. Thêm các tên miền được phép:
   - `localhost:*`
   - `127.0.0.1:*`
   - `learningenglishforwork.firebaseapp.com/*`
   - `learningenglishforwork.web.app/*`
   - Domain riêng của bạn (nếu có).
5. Bấm **Save**.

---

## ✅ DANH SÁCH TÍNH NĂNG ĐÃ HOÀN THIỆN

### 1. Xác thực & Quản lý phiên (Authentication)
- [x] Đăng nhập Google một chạm (nút chuẩn Google, tự động fallback sang Redirect khi popup bị chặn hoặc chạy trong trình duyệt Zalo/Facebook).
- [x] Đăng nhập / Đăng ký bằng Email & Mật khẩu, xác thực email, quên mật khẩu.
- [x] Chế độ Khách (Guest Mode): Học thử không cần tài khoản; tự động đồng bộ tiến độ vào Firestore khi đăng nhập Google.
- [x] Phân quyền Admin dựa trên Custom Claims `admin: true` bảo mật tuyệt đối, chống can thiệp từ client.
- [x] Thông báo lỗi xác thực bằng tiếng Việt thân thiện.
- [x] Tính năng xóa tài khoản và toàn bộ dữ liệu cá nhân (tuân thủ quyền riêng tư).

### 2. Lộ trình học (Roadmap) & Bài học
- [x] Bài kiểm tra đầu vào Placement Test (15 câu) xếp trình độ A1 → B2.
- [x] 6 Chuyên ngành F&B: Phục vụ bàn, Pha chế rượu, Barista cafe, Đầu bếp, Lễ tân nhà hàng, Quản lý & Phỏng vấn.
- [x] Bản đồ Roadmap trực quan: hiển thị khóa/mở/hoàn thành, tự mở unit tiếp theo khi đạt ≥ 70% điểm.
- [x] Trình học hội thoại mẫu kèm audio và giải nghĩa chi tiết từng câu.

### 3. Từ vựng & Thuật toán lặp lại ngắt quãng (SM-2)
- [x] Từ điển F&B chuyên ngành hơn 100+ từ với phiên âm IPA, ví dụ EN-VI, collocations, mẹo phục vụ thực tế.
- [x] Tìm kiếm không dấu (accent-insensitive) và lọc theo chuyên ngành/cấp độ.
- [x] Phát âm chuẩn bản ngữ bằng Web Speech API (hỗ trợ tốc độ thường 1.0x và chậm 0.7x).
- [x] Flashcard lặp lại ngắt quãng (SM-2): tính toán `easeFactor`, `interval`, `repetitions`, màn hình "Ôn tập hôm nay".
- [x] Đánh dấu từ yêu thích (Bookmarks) và Sổ từ riêng do người học tự thêm ("My Word List").

### 4. Hệ thống Bài tập tương tác (9 Dạng phong phú)
- [x] Trắc nghiệm (Multiple Choice).
- [x] Điền từ vào chỗ trống (Fill in the blank).
- [x] Nối từ - nghĩa (Matching).
- [x] Sắp xếp trật tự câu (Reorder).
- [x] Nghe và chọn (Listening dùng TTS).
- [x] Dịch Việt → Anh (Translation chấp nhận nhiều đáp án tương đương).
- [x] **Luyện nói (Speaking Lab)**: Nhận diện giọng nói bằng `SpeechRecognition`, tính % độ tương đồng và phản hồi ngay.
- [x] **Role-play tương tác**: Đóng vai nhân viên ứng biến theo cảm xúc của khách (thân thiện, bực mình, đói bụng).
- [x] **Sổ lỗi sai (Mistake Notebook)**: Tự động lưu câu sai để người học làm lại và bấm "Đã hiểu".

### 5. Tiện ích F&B thực tế & Gamification
- [x] **Phrasebook "Mẫu câu giao tiếp nhanh"**: Tra cứu tình huống khẩn cấp giữa ca làm việc, hỗ trợ offline và copy 1 chạm.
- [x] **Menu Translator & Template Builder**: Dịch món Việt sang tiếng Anh ẩm thực quốc tế, công cụ ghép câu mô tả món (nguyên liệu, cách nấu, vị, dị ứng).
- [x] **Văn hóa & Nghi thức (Culture & Etiquette)**: Cẩm nang tiền tip Mỹ/Âu/Á, quy chuẩn thực phẩm Halal, Kosher, dị ứng gluten Celiac.
- [x] **Luyện phỏng vấn F&B (Mock Interview)**: Bộ câu hỏi tuyển dụng thông dụng kèm câu trả lời mẫu ghi điểm.
- [x] Gamification: Chuỗi ngày học liên tục (Streak), Điểm XP, Cấp bậc, Bộ sưu tập Huy hiệu, Bảng xếp hạng tuần (Top 20).
- [x] Tiện ích: Dark Mode, Tùy chỉnh cỡ chữ (sm, md, lg), Cảnh báo trạng thái Offline, Nhắc học hằng ngày qua Web Notification.
- [x] Báo lỗi nội dung (Feedback): Nút gửi góp ý trực tiếp vào collection `feedback` cho Admin.

### 6. Cổng Quản trị Admin (/admin)
- [x] Thống kê tổng quan dựa trên 1 document duy nhất (`stats/global`), không quét collection.
- [x] CRUD từ vựng đầy đủ các trường dữ liệu.
- [x] Import từ vựng hàng loạt bằng file CSV/JSON kèm validate và preview tại client.
- [x] Cung cấp file CSV mẫu tải về (`/sample-vocab-import.csv`).
- [x] Xuất backup toàn bộ dữ liệu ra JSON.
- [x] Quản lý phản hồi báo lỗi từ học viên và đánh dấu đã xử lý.
- [x] Nút khởi tạo dữ liệu mẫu (Seed Data 1-click) ngay trên trình duyệt.

---

## 🔮 GỢI Ý MỞ RỘNG TIẾP THEO

1. **AI Role-play thời gian thực**: Tích hợp Gemini Live API hoặc Gemini 1.5 Flash (chạy thông qua backend proxy nếu người dùng nâng cấp gói) để khách hàng ảo trò chuyện tự do bằng giọng nói.
2. **Audio File Cache (Web Audio API / Cache Storage)**: Cung cấp tùy chọn tải trước các gói audio giọng đọc thu âm sẵn của người bản xứ và lưu vào Cache Storage của PWA.
3. **Quét thực đơn qua camera (OCR)**: Cho phép nhân viên chụp ảnh menu tiếng Việt của quán để AI tự động trích xuất món và tạo kịch bản giới thiệu tiếng Anh.
4. **Chia sẻ tiến độ lên mạng xã hội**: Tạo ảnh chứng chỉ hoàn thành khóa học (A1, A2, B1) để học viên khoe lên Facebook/LinkedIn.

