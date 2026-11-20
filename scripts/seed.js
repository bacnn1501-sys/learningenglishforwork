/**
 * Node CLI Script to seed initial dataset into Cloud Firestore using firebase-admin.
 * 
 * Usage:
 *   node scripts/seed.js
 * 
 * Requirements:
 *   1. Download service account key from Firebase Console -> Project Settings -> Service accounts
 *   2. Save as "serviceAccountKey.json" in root directory (already git-ignored).
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ ERROR: File serviceAccountKey.json không tìm thấy ở thư mục gốc!');
  console.error('👉 Hướng dẫn chuẩn bị:');
  console.error('1. Vào Firebase Console: https://console.firebase.google.com/project/learningenglishforwork/settings/serviceaccounts/adminsdk');
  console.error('2. Bấm "Generate new private key", lưu thành serviceAccountKey.json ở thư mục gốc dự án.');
  console.error('3. Chạy lại: node scripts/seed.js\n');
  console.error('💡 BẬT MÍ: Bạn có thể seed trực tiếp trên Web App 1-click tại trang /admin mà không cần serviceAccountKey.json!\n');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper for search keywords
function generateSearchKeywords(text, extra = []) {
  const clean = text.toLowerCase().trim();
  const noAccents = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const words = [...clean.split(/[\s,.-]+/), ...noAccents.split(/[\s,.-]+/)];
  const set = new Set();
  words.forEach(w => { if (w.length >= 2) set.add(w); });
  extra.forEach(k => {
    const kClean = String(k).toLowerCase().trim();
    if (kClean) {
      set.add(kClean);
      set.add(kClean.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'));
    }
  });
  return Array.from(set);
}

async function runSeed() {
  console.log('\n🚀 BẮT ĐẦU SEED DỮ LIỆU F&B ENGLISH HUB VÀO CLOUD FIRESTORE...');

  try {
    // 1. Seed Tracks
    console.log('📌 Đang ghi danh sách Tracks (Lộ trình)...');
    const tracks = [
      { id: 'waiter', nameEn: 'Waiter & Waitress', nameVi: 'Nhân viên Phục vụ Bàn', order: 1, color: '#B93815', icon: 'UtensilsCrossed', status: 'published' },
      { id: 'bartender', nameEn: 'Bartender & Mixologist', nameVi: 'Pha chế Quầy Bar (Rượu & Cocktail)', order: 2, color: '#9B2C0E', icon: 'Wine', status: 'published' },
      { id: 'barista', nameEn: 'Barista & Cafe Specialist', nameVi: 'Barista & Chuyên viên Cà phê', order: 3, color: '#81270F', icon: 'Coffee', status: 'published' },
      { id: 'kitchen', nameEn: 'Kitchen & Culinary Team', nameVi: 'Đầu bếp & Phụ bếp', order: 4, color: '#4D6B53', icon: 'ChefHat', status: 'published' },
      { id: 'reception', nameEn: 'Host & Restaurant Reception', nameVi: 'Lễ tân & Đón tiếp Nhà hàng', order: 5, color: '#D45D44', icon: 'Sparkles', status: 'published' },
      { id: 'general', nameEn: 'F&B Management & Interview', nameVi: 'F&B Tổng quát & Phỏng vấn', order: 6, color: '#2B1C19', icon: 'Award', status: 'published' }
    ];

    let batch = db.batch();
    tracks.forEach(t => {
      batch.set(db.collection('tracks').doc(t.id), t, { merge: true });
    });
    await batch.commit();

    // 2. Global stats
    await db.collection('stats').doc('global').set({
      totalLearners: 120,
      totalWords: 110,
      totalLessons: 24,
      totalCompletions: 340,
      lastUpdated: Date.now()
    }, { merge: true });

    console.log('✅ Khởi tạo Tracks và Stats thành công!');
    console.log('👉 Toàn bộ 100+ từ vựng, hội thoại, bài tập cũng đã sẵn sàng trên giao diện Admin 1-Click Seed.');
    console.log('🎉 Hoàn tất!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err);
    process.exit(1);
  }
}

runSeed();
