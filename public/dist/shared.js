// @ts-nocheck
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
const firebaseConfig = window.FIREBASE_CONFIG;
const requiredFirebaseConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
function isFirebaseConfigValid(config) {
    if (!config)
        return false;
    return requiredFirebaseConfigKeys.every((key) => {
        const value = config[key];
        return typeof value === 'string' && value.trim() !== '' && !value.includes('YOUR_');
    });
}
export const hasValidFirebaseConfig = isFirebaseConfigValid(firebaseConfig);
export const app = hasValidFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export function ensureConfigured() {
    if (!hasValidFirebaseConfig || !auth || !db) {
        throw new Error('Firebase is not configured correctly. Update public/firebase-config.js and redeploy.');
    }
}
export async function requireAdminUser() {
    ensureConfigured();
    if (!auth.currentUser) {
        return { ok: false, reason: 'not-signed-in' };
    }
    const tokenResult = await auth.currentUser.getIdTokenResult(true);
    if (tokenResult.claims.admin !== true) {
        return { ok: false, reason: 'not-admin' };
    }
    return { ok: true, reason: 'ok' };
}
export function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
    });
}
