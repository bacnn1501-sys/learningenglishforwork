import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  deleteUser,
  linkWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile, CEFRLevel } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isGuest: boolean;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  continueAsGuest: () => void;
  updateUserProfileState: (updates: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to translate Firebase Auth errors into helpful Vietnamese
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/popup-closed-by-user':
      return 'Cửa sổ đăng nhập đã bị đóng trước khi hoàn tất.';
    case 'auth/popup-blocked':
      return 'Trình duyệt đã chặn cửa sổ đăng nhập (popup). Đang chuyển hướng...';
    case 'auth/cancelled-popup-request':
      return 'Yêu cầu đăng nhập đã bị hủy.';
    case 'auth/account-exists-with-different-credential':
      return 'Email này đã được dùng cho phương thức khác. Vui lòng đăng nhập bằng Email/Password rồi liên kết tài khoản Google trong Hồ sơ.';
    case 'auth/unauthorized-domain':
      return 'Tên miền chưa được cấp quyền trong Firebase Console (Authorized domains). Vui lòng thêm localhost hoặc tên miền hiện tại vào Authorized domains.';
    case 'auth/network-request-failed':
      return 'Không có kết nối mạng. Vui lòng kiểm tra lại đường truyền internet.';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị vô hiệu hóa bởi ban quản trị.';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử thất bại. Vui lòng thử lại sau vài phút.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Email hoặc mật khẩu không chính xác.';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản với email này.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng chức năng quên mật khẩu.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu. Vui lòng nhập tối thiểu 6 ký tự.';
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng.';
    default:
      return 'Đã có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.';
  }
}

// Detect in-app browsers (Zalo, Facebook, Messenger, Instagram, TikTok)
function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /FBAN|FBAV|Instagram|Line|Twitter|MicroMessenger|Zalo|Snapchat/i.test(ua);
}

const GUEST_KEY = 'fb_english_guest_mode';
const GUEST_PROGRESS_KEY = 'fb_english_guest_progress';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_KEY) === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Sync Guest Progress to Firestore after logging in
  const syncGuestProgressToFirestore = async (uid: string) => {
    try {
      const rawGuestData = localStorage.getItem(GUEST_PROGRESS_KEY);
      if (!rawGuestData) return;
      const guestProgress = JSON.parse(rawGuestData);
      if (guestProgress && typeof guestProgress === 'object') {
        const lessonIds = Object.keys(guestProgress);
        for (const lessonId of lessonIds) {
          const item = guestProgress[lessonId];
          await setDoc(
            doc(db, 'users', uid, 'progress', lessonId),
            {
              lessonId,
              unitId: item.unitId || '',
              completed: true,
              score: item.score || 100,
              completedAt: item.completedAt || Date.now(),
              attempts: 1
            },
            { merge: true }
          );
        }
      }
      localStorage.removeItem(GUEST_PROGRESS_KEY);
    } catch (e) {
      console.warn('Failed to sync guest progress:', e);
    }
  };

  // Fetch or create user document in Firestore
  const loadOrCreateUserProfile = async (user: User): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    // Check custom claims for admin
    const tokenResult = await user.getIdTokenResult(true);
    const hasAdminClaim = Boolean(tokenResult.claims.admin);

    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      // Refresh admin status if claim says so
      const finalRole = hasAdminClaim ? 'admin' : (data.role || 'learner');
      setIsAdmin(hasAdminClaim || data.role === 'admin');

      // Update lastLoginAt
      await updateDoc(userDocRef, {
        lastLoginAt: Date.now(),
        displayName: user.displayName || data.displayName || 'Learner',
        photoURL: user.photoURL || data.photoURL || ''
      });

      const updatedProfile = { ...data, role: finalRole };
      setUserProfile(updatedProfile);
      return updatedProfile;
    } else {
      // First time login: create new user with role 'learner'
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Learner',
        photoURL: user.photoURL || '',
        role: hasAdminClaim ? 'admin' : 'learner',
        authProviders: user.providerData.map(p => p.providerId),
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        onboardingDone: false,
        trackId: 'waiter',
        level: 'A1',
        dailyGoalMinutes: 15,
        xp: 20, // Welcome bonus
        streak: 1,
        lastStudyDate: new Date().toISOString().split('T')[0],
        settings: {
          darkMode: false,
          fontSize: 'md',
          dailyReminder: false
        }
      };

      await setDoc(userDocRef, newProfile);
      setIsAdmin(hasAdminClaim);
      setUserProfile(newProfile);

      // Merge guest progress if any
      await syncGuestProgressToFirestore(user.uid);

      return newProfile;
    }
  };

  useEffect(() => {
    // Ensure persistence is browserLocal
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Check redirect result for Google sign-in redirect fallback
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          await loadOrCreateUserProfile(result.user);
          localStorage.removeItem(GUEST_KEY);
          setIsGuest(false);
        }
      })
      .catch((err) => {
        console.error('Redirect sign-in error:', err);
        setAuthError(getFriendlyAuthErrorMessage(err.code));
      });

    // Listen to Auth State
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          await loadOrCreateUserProfile(user);
          localStorage.removeItem(GUEST_KEY);
          setIsGuest(false);
        } catch (error: any) {
          console.error('Error fetching user profile:', error);
          setAuthError(getFriendlyAuthErrorMessage(error?.code || ''));
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In with popup + fallback to redirect
  const signInWithGoogle = async () => {
    clearAuthError();
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // If on mobile or in-app browser, direct to redirect flow to avoid popup blocking
    const isMobile = window.innerWidth <= 768 || isInAppBrowser();

    if (isMobile) {
      try {
        await signInWithRedirect(auth, provider);
        return;
      } catch (err: any) {
        console.warn('Redirect sign-in failed, attempting popup:', err);
      }
    }

    try {
      const res = await signInWithPopup(auth, provider);
      await loadOrCreateUserProfile(res.user);
      localStorage.removeItem(GUEST_KEY);
      setIsGuest(false);
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        // Fallback to redirect
        await signInWithRedirect(auth, provider);
      } else {
        setAuthError(getFriendlyAuthErrorMessage(err.code));
        throw err;
      }
    }
  };

  // Email / Password Login
  const signInWithEmail = async (email: string, pass: string) => {
    clearAuthError();
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await loadOrCreateUserProfile(res.user);
      localStorage.removeItem(GUEST_KEY);
      setIsGuest(false);
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err.code);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Email / Password Register
  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    clearAuthError();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName) {
        await updateProfile(res.user, { displayName });
      }
      // Send email verification
      await sendEmailVerification(res.user);
      await loadOrCreateUserProfile(res.user);
      localStorage.removeItem(GUEST_KEY);
      setIsGuest(false);
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err.code);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Sign out
  const logout = async () => {
    clearAuthError();
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    setIsGuest(false);
    localStorage.removeItem(GUEST_KEY);
  };

  // Password reset email
  const resetPassword = async (email: string) => {
    clearAuthError();
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err.code);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    if (!currentUser) return;
    try {
      await sendEmailVerification(currentUser);
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err.code);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Continue as guest
  const continueAsGuest = () => {
    localStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  };

  // Update user profile fields
  const updateUserProfileState = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      // Strip any sensitive fields
      const { role, uid, ...safeUpdates } = updates as any;
      await updateDoc(userDocRef, safeUpdates);
      setUserProfile(prev => (prev ? { ...prev, ...safeUpdates } : null));
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  };

  // Delete user account & personal data
  const deleteAccount = async () => {
    if (!currentUser) return;
    try {
      // Delete user document in Firestore
      await setDoc(doc(db, 'users', currentUser.uid), { deleted: true, deletedAt: Date.now() });
      await deleteUser(currentUser);
      await logout();
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err.code);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        isGuest,
        loading,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        resetPassword,
        resendVerificationEmail,
        continueAsGuest,
        updateUserProfileState,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

