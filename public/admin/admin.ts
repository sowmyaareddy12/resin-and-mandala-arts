// @ts-nocheck
import { signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { auth, db, hasValidFirebaseConfig, requireAdminUser, readFileAsDataUrl } from '/shared/shared.js';

const MAX_IMAGE_SIZE_BYTES = 1.5 * 1024 * 1024;

const addArtworkForm = document.getElementById('add-artwork-form');
const artworkImageFileInput = document.getElementById('artwork-image-file');
const artworkImageUrlInput = document.getElementById('artwork-image-url');
const adminArtworksList = document.getElementById('admin-artworks-list');
const helpForm = document.getElementById('help-form');
const logoutBtn = document.getElementById('logout-btn');
const adminError = document.getElementById('admin-error');

function showError(message) {
  adminError.textContent = message;
  adminError.classList.remove('hidden');
}

function clearError() {
  adminError.classList.add('hidden');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function guardPage() {
  if (!hasValidFirebaseConfig || !auth || !db) {
    showError('Firebase config missing or invalid. Update public/firebase-config.js and redeploy.');
    return false;
  }

  const adminCheck = await requireAdminUser();
  if (!adminCheck.ok) {
    window.location.href = '/login/';
    return false;
  }

  return true;
}

async function loadAdminData() {
  adminArtworksList.innerHTML = '<p class="text-gray-500">Loading...</p>';
  const snap = await getDocs(collection(db, 'artworks'));
  adminArtworksList.innerHTML = '';
  if (snap.empty) {
    adminArtworksList.innerHTML = '<p>No artworks yet.</p>';
    return;
  }

  snap.docs.forEach((d) => {
    const data = d.data();
    const item = document.createElement('div');
    item.className = 'flex justify-between items-center p-3 rounded border';
    item.innerHTML = `
      <span>${escapeHtml(data.title || 'Untitled')}</span>
      <button class="bg-red-600 text-white px-3 py-1 rounded" data-id="${d.id}">Delete</button>
    `;
    item.querySelector('button').addEventListener('click', async () => {
      if (!confirm('Delete this artwork?')) return;
      await deleteDoc(doc(db, 'artworks', d.id));
      await loadAdminData();
    });
    adminArtworksList.appendChild(item);
  });
}

async function loadHelp() {
  const snap = await getDoc(doc(db, 'config', 'help'));
  const data = snap.exists() ? snap.data() : {};
  document.getElementById('help-text').value = data.content || '';
  document.getElementById('contact-email').value = data.email || '';
  document.getElementById('contact-instagram').value = data.instagram || '';
}

addArtworkForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const title = document.getElementById('artwork-title').value.trim();
  const imageUrlFromInput = artworkImageUrlInput.value.trim();
  const selectedFile = artworkImageFileInput.files && artworkImageFileInput.files[0] ? artworkImageFileInput.files[0] : null;
  const description = document.getElementById('artwork-description').value.trim();

  if (!selectedFile && !imageUrlFromInput) {
    alert('Please upload an image file or provide an image URL.');
    return;
  }

  let imageUrl = imageUrlFromInput;
  if (selectedFile) {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
      alert('Image is too large. Please choose an image under 1.5 MB.');
      return;
    }
    imageUrl = await readFileAsDataUrl(selectedFile);
  }

  try {
    await addDoc(collection(db, 'artworks'), { title, imageUrl, description, createdAt: new Date() });
    addArtworkForm.reset();
    await loadAdminData();
  } catch (err) {
    if (err.code === 'permission-denied') {
      alert('Missing or insufficient permissions. Ensure this user has custom claim admin=true.');
      return;
    }
    alert('Error adding artwork: ' + err.message);
  }
});

helpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await setDoc(doc(db, 'config', 'help'), {
      content: document.getElementById('help-text').value,
      email: document.getElementById('contact-email').value,
      instagram: document.getElementById('contact-instagram').value
    });
    alert('Saved');
  } catch (err) {
    alert('Error saving: ' + err.message);
  }
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = '/login/';
});

(async () => {
  const ok = await guardPage();
  if (!ok) return;
  await loadAdminData();
  await loadHelp();
})();
