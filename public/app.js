const firebaseConfig = window.FIREBASE_CONFIG || {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const viewGallery = document.getElementById('view-gallery');
const viewHelp = document.getElementById('view-help');
const viewAdmin = document.getElementById('view-admin');
const artworksGrid = document.getElementById('artworks-grid');
const emptyState = document.getElementById('empty-state');
const adminBtn = document.getElementById('admin-btn');
const adminLoginModal = document.getElementById('admin-login-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const closeLoginBtn = document.getElementById('close-login');
const logoutBtn = document.getElementById('logout-btn');
const addArtworkForm = document.getElementById('add-artwork-form');
const helpForm = document.getElementById('help-form');
const adminArtworksList = document.getElementById('admin-artworks-list');
const helpContent = document.getElementById('help-content');

// Navigation
document.querySelectorAll('.nav-link[data-view]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const view = link.dataset.view;
    showView(view);
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

document.querySelector('.logo[data-view]').addEventListener('click', (e) => {
  e.preventDefault();
  showView('gallery');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector('.nav-link[data-view="gallery"]').classList.add('active');
});

function showView(viewName) {
  [viewGallery, viewHelp, viewAdmin].forEach(v => v.classList.remove('active'));
  if (viewName === 'gallery') viewGallery.classList.add('active');
  else if (viewName === 'help') viewHelp.classList.add('active');
  else if (viewName === 'admin') viewAdmin.classList.add('active');

  if (viewName === 'gallery') loadArtworks();
  if (viewName === 'help') loadHelp();
  if (viewName === 'admin') loadAdminData();
}

// Admin modal
adminBtn.addEventListener('click', () => {
  if (auth.currentUser) {
    showView('admin');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  } else {
    adminLoginModal.classList.remove('hidden');
  }
});

closeLoginBtn.addEventListener('click', () => {
  adminLoginModal.classList.add('hidden');
  loginError.classList.add('hidden');
});

adminLoginModal.addEventListener('click', (e) => {
  if (e.target === adminLoginModal) adminLoginModal.classList.add('hidden');
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    // Force-refresh token so recently updated claims (if any) are reflected immediately.
    await credential.user.getIdToken(true);
    adminLoginModal.classList.add('hidden');
    loginForm.reset();
    showView('admin');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  } catch (err) {
    loginError.textContent = err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message;
    loginError.classList.remove('hidden');
  }
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  showView('gallery');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector('.nav-link[data-view="gallery"]').classList.add('active');
});

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    adminBtn.textContent = 'Admin Panel';
  } else {
    adminBtn.textContent = 'Admin';
  }
});

// Load artworks (public read)
async function loadArtworks() {
  artworksGrid.innerHTML = '<div class="loading">Loading artworks...</div>';
  emptyState.classList.add('hidden');
  try {
    const snap = await getDocs(collection(db, 'artworks'));
    artworksGrid.innerHTML = '';
    if (snap.empty) {
      emptyState.classList.remove('hidden');
    } else {
      snap.docs.forEach(d => {
        const data = d.data();
        artworksGrid.innerHTML += `
          <article class="artwork-card">
            <img src="${escapeHtml(data.imageUrl || '')}" alt="${escapeHtml(data.title || '')}">
            <div class="artwork-card-content">
              <h3>${escapeHtml(data.title || 'Untitled')}</h3>
              ${data.description ? `<p>${escapeHtml(data.description)}</p>` : ''}
            </div>
          </article>
        `;
      });
    }
  } catch (err) {
    artworksGrid.innerHTML = `<div class="empty-state">Unable to load artworks. ${err.message}</div>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Load help (public read)
async function loadHelp() {
  try {
    const docRef = doc(db, 'config', 'help');
    const snap = await getDoc(docRef);
    const data = snap.exists() ? snap.data() : {};
    helpContent.innerHTML = `
      <p>${data.content || 'Get in touch for custom orders, questions, or collaborations.'}</p>
      <div class="contact-info">
        <p><strong>Email:</strong> <a href="mailto:${data.email || 'contact@example.com'}">${data.email || 'contact@example.com'}</a></p>
        <p><strong>Instagram:</strong> <a href="${data.instagram ? 'https://instagram.com/' + data.instagram.replace('@', '') : '#'}" target="_blank" rel="noopener">${data.instagram ? data.instagram : '@resinmandalaarts'}</a></p>
      </div>
    `;
    document.getElementById('help-text').value = data.content || '';
    document.getElementById('contact-email').value = data.email || '';
    document.getElementById('contact-instagram').value = data.instagram || '';
  } catch (err) {
    helpContent.innerHTML = `<p>Unable to load help info.</p>`;
  }
}

// Add artwork (admin only)
addArtworkForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('artwork-title').value.trim();
  const imageUrl = document.getElementById('artwork-image').value.trim();
  const description = document.getElementById('artwork-description').value.trim();
  try {
    await addDoc(collection(db, 'artworks'), { title, imageUrl, description, createdAt: new Date() });
    addArtworkForm.reset();
    loadAdminData();
    loadArtworks();
  } catch (err) {
    alert('Error adding artwork: ' + err.message);
  }
});

// Save help (admin only)
helpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = document.getElementById('help-text').value;
  const email = document.getElementById('contact-email').value;
  const instagram = document.getElementById('contact-instagram').value;
  try {
    await setDoc(doc(db, 'config', 'help'), { content, email, instagram });
    loadHelp();
  } catch (err) {
    alert('Error saving: ' + err.message);
  }
});

// Admin artworks list & delete
async function loadAdminData() {
  adminArtworksList.innerHTML = '<p>Loading...</p>';
  try {
    const snap = await getDocs(collection(db, 'artworks'));
    adminArtworksList.innerHTML = '';
    if (snap.empty) {
      adminArtworksList.innerHTML = '<p>No artworks yet.</p>';
    } else {
      snap.docs.forEach(d => {
        const data = d.data();
        const item = document.createElement('div');
        item.className = 'admin-artwork-item';
        item.innerHTML = `
          <span>${escapeHtml(data.title || 'Untitled')}</span>
          <button class="btn btn-danger btn-small" data-id="${d.id}">Delete</button>
        `;
        item.querySelector('button').addEventListener('click', async () => {
          if (confirm('Delete this artwork?')) {
            await deleteDoc(doc(db, 'artworks', d.id));
            loadAdminData();
            loadArtworks();
          }
        });
        adminArtworksList.appendChild(item);
      });
    }
  } catch (err) {
    adminArtworksList.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

// Initial load
loadArtworks();
