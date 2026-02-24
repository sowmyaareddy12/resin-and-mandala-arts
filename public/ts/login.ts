// @ts-nocheck
import { signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { auth, hasValidFirebaseConfig } from './shared.js';

const form = document.getElementById('login-form');
const error = document.getElementById('login-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!hasValidFirebaseConfig || !auth) {
    error.textContent = 'Firebase config is missing or invalid. Update public/firebase-config.js with your project settings.';
    error.classList.remove('hidden');
    return;
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await credential.user.getIdToken(true);
    const tokenResult = await credential.user.getIdTokenResult(true);

    if (tokenResult.claims.admin !== true) {
      await signOut(auth);
      error.textContent = 'Signed in, but this account is not an admin. Add custom claim admin=true and sign in again.';
      error.classList.remove('hidden');
      return;
    }

    window.location.href = '/admin.html';
  } catch (err) {
    if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      error.textContent = 'Firebase API key is invalid for this site. Check public/firebase-config.js and API key restrictions.';
    } else {
      error.textContent = err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message;
    }
    error.classList.remove('hidden');
  }
});
