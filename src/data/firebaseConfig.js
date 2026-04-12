import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// ============================================================
// Firebase 설정 - 본인의 Firebase 프로젝트 정보로 교체하세요
// https://console.firebase.google.com 에서 프로젝트 생성 후
// 프로젝트 설정 > 일반 > 내 앱 > 웹 앱 추가 에서 확인
// ============================================================
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

function isConfigured() {
  return firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0;
}

if (isConfigured()) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

// Google 로그인
export async function loginWithGoogle() {
  if (!isConfigured()) {
    throw new Error('Firebase가 설정되지 않았습니다. firebaseConfig.js를 확인하세요.');
  }
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  // Firestore에 사용자 정보 저장 (회원가입)
  await setDoc(doc(db, 'users', user.uid), {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider: 'google',
    lastLogin: serverTimestamp(),
  }, { merge: true });
  return user;
}

// Kakao 로그인 (Firebase Custom Token 방식 대신 간편 구현)
// 실제 운영 시에는 Cloud Functions를 통한 Custom Token 발급 필요
export async function loginWithKakao() {
  if (!window.Kakao) {
    throw new Error('Kakao SDK가 로드되지 않았습니다.');
  }
  // Kakao SDK를 통한 로그인 후 Firebase에 사용자 저장
  return new Promise((resolve, reject) => {
    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const res = await window.Kakao.API.request({ url: '/v2/user/me' });
          const kakaoUser = {
            uid: `kakao_${res.id}`,
            displayName: res.properties?.nickname || '카카오 사용자',
            photoURL: res.properties?.profile_image || null,
            email: res.kakao_account?.email || null,
            provider: 'kakao',
          };
          if (isConfigured()) {
            await setDoc(doc(db, 'users', kakaoUser.uid), {
              ...kakaoUser,
              lastLogin: serverTimestamp(),
            }, { merge: true });
          }
          resolve(kakaoUser);
        } catch (e) {
          reject(e);
        }
      },
      fail: reject,
    });
  });
}

// 로그아웃
export async function logout() {
  if (auth) await signOut(auth);
  if (window.Kakao?.Auth) window.Kakao.Auth.logout();
}

// 사용자 진단 결과 저장
export async function saveScores(userId, scores) {
  if (!isConfigured() || !userId) return;
  await setDoc(doc(db, 'scores', userId), {
    scores,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// 사용자 진단 결과 불러오기
export async function loadScores(userId) {
  if (!isConfigured() || !userId) return null;
  const snap = await getDoc(doc(db, 'scores', userId));
  return snap.exists() ? snap.data().scores : null;
}

export { auth, db, isConfigured, onAuthStateChanged };
