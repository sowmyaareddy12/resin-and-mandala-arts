// @ts-nocheck
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { db, hasValidFirebaseConfig } from '/shared/shared.js';

const artworksGrid = document.getElementById('artworks-grid');
const emptyState = document.getElementById('empty-state');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadArtworks() {
  artworksGrid.innerHTML = '<p class="text-gray-500">Loading artworks...</p>';
  emptyState.classList.add('hidden');

  if (!hasValidFirebaseConfig || !db) {
    artworksGrid.innerHTML = '<p class="text-red-600">Firebase config missing. Update public/firebase-config.js and redeploy.</p>';
    return;
  }

  try {
    const snap = await getDocs(collection(db, 'artworks'));
    artworksGrid.innerHTML = '';
    if (snap.empty) {
      emptyState.classList.remove('hidden');
      return;
    }

    snap.docs.forEach((d) => {
      const data = d.data();
      artworksGrid.innerHTML += `
        <article class="bg-white rounded-xl shadow p-4">
          <img class="w-full aspect-square object-cover rounded-lg" src="${escapeHtml(data.imageUrl || '')}" alt="${escapeHtml(data.title || '')}">
          <h3 class="text-2xl mt-3 font-serif">${escapeHtml(data.title || 'Untitled')}</h3>
          ${data.description ? `<p class="text-gray-600 mt-1">${escapeHtml(data.description)}</p>` : ''}
        </article>
      `;
    });
  } catch (err) {
    artworksGrid.innerHTML = `<p class="text-red-600">Unable to load artworks: ${err.message}</p>`;
  }
}

loadArtworks();
