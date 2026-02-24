// @ts-nocheck
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { db, hasValidFirebaseConfig } from '/shared/shared.js';
const helpContent = document.getElementById('help-content');
async function loadHelp() {
    if (!hasValidFirebaseConfig || !db) {
        helpContent.innerHTML = '<p class="text-red-600">Firebase config missing. Update public/firebase-config.js and redeploy.</p>';
        return;
    }
    try {
        const snap = await getDoc(doc(db, 'config', 'help'));
        const data = snap.exists() ? snap.data() : {};
        helpContent.innerHTML = `
      <p>${data.content || 'Get in touch for custom orders, questions, or collaborations.'}</p>
      <div class="mt-6 p-4 bg-amber-50 rounded-lg">
        <p><strong>Email:</strong> <a class="text-amber-700" href="mailto:${data.email || 'contact@example.com'}">${data.email || 'contact@example.com'}</a></p>
        <p><strong>Instagram:</strong> <a class="text-amber-700" href="${data.instagram ? 'https://instagram.com/' + data.instagram.replace('@', '') : '#'}" target="_blank" rel="noopener">${data.instagram || '@resinmandalaarts'}</a></p>
      </div>
    `;
    }
    catch (err) {
        helpContent.innerHTML = '<p class="text-red-600">Unable to load help info.</p>';
    }
}
loadHelp();
