/**
 * Script to grant admin custom claim to a specific user.
 * Usage:
 *   node scripts/set-admin.js email@domain.com
 *   node scripts/set-admin.js <UID>
 * 
 * Requirements:
 *   Download service account key from Firebase Console -> Project Settings -> Service accounts
 *   Save as "serviceAccountKey.json" in root directory (already git-ignored).
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ ERROR: File serviceAccountKey.json không tìm thấy ở thư mục gốc!');
  console.error('👉 Hướng dẫn:');
  console.error('1. Vào Firebase Console (project learningenglishforwork)');
  console.error('2. Chọn Project Settings ⚙️ -> Service accounts');
  console.error('3. Bấm "Generate new private key", đổi tên file tải về thành serviceAccountKey.json');
  console.error('4. Đặt file vào thư mục gốc của dự án này rồi chạy lại lệnh.\n');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const targetIdentifier = process.argv[2];

if (!targetIdentifier) {
  console.error('\n❌ Vui lòng nhập email hoặc UID cần cấp quyền admin.');
  console.error('Ví dụ: node scripts/set-admin.js admin@domain.com\n');
  process.exit(1);
}

async function setAdmin() {
  try {
    let userRecord;
    if (targetIdentifier.includes('@')) {
      userRecord = await admin.auth().getUserByEmail(targetIdentifier);
    } else {
      userRecord = await admin.auth().getUser(targetIdentifier);
    }

    console.log(`🔍 Tìm thấy user: ${userRecord.email || userRecord.uid} (${userRecord.uid})`);

    // Set custom claim: { admin: true }
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    // Also update role in Firestore document users/{uid}
    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.set(
      {
        role: 'admin',
        updatedAt: Date.now()
      },
      { merge: true }
    );

    console.log(`\n🎉 THÀNH CÔNG! Đã cấp quyền admin cho ${userRecord.email || userRecord.uid}`);
    console.log('⚠️ LƯU Ý: Người dùng cần ĐĂNG XUẤT và ĐĂNG NHẬP LẠI trên web để Firebase cập nhật token claim mới.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Lỗi khi cấp quyền admin:', err.message);
    process.exit(1);
  }
}

setAdmin();

