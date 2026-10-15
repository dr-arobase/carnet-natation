// Simple client-side controller for natation.html
// - Loads list of nageurs from the API
// - Renders table and fills modifier/supprimer selects
// - Provides basic filtering and simple add/update/delete via fetch

(function () {
  const API_CANDIDATES = ['/api/nageurs', '/nageurs'];
  let apiBase = null;
  let nageursCache = [];

  async function detectApi() {
    for (const base of API_CANDIDATES) {
      try {
        const res = await fetch(base, { method: 'GET' });
        if (res.ok) { apiBase = base; return base; }
      } catch (e) {
        // ignore and try next
      }
    }
    return null;
  }

  async function fetchNageurs() {
    if (!apiBase) await detectApi();
    if (!apiBase) return [];
    const res = await fetch(apiBase);
    if (!res.ok) return [];
    const data = await res.json();
    nageursCache = Array.isArray(data) ? data : [];
    return nageursCache;
  }

  function renderTable(list) {
    const table = document.getElementById('tableNageurs');
    if (!table) return;
    const tbody = table.querySelector('tbody') || (function(){ const b=document.createElement('tbody'); table.appendChild(b); return b; })();
    tbody.innerHTML = '';
    list.forEach(n => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(n.nom || n['nom complet'] || '')}</td>
        <td>${escapeHtml(n.niveau || '')}</td>
        <td>${escapeHtml(n.horaire || '')}</td>
        <td>${escapeHtml(n.session || '')}</td>
        <td>${escapeHtml(n.commentaires || '')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function fillSelects(list) {
    // modifier select (id nomModifier) and supprimer select (id nomSupprimer)
    const mod = document.getElementById('nomModifier');
    const sup = document.getElementById('nomSupprimer');
    [mod, sup].forEach(s => { if (s) s.innerHTML = '<option value="">-- Sélectionner --</option>'; });
    list.forEach(n => {
      const id = n.id || n.ID || '';
      const name = n.nom || n['nom complet'] || id || '—';
      if (mod) {
        const o = document.createElement('option'); o.value = id; o.textContent = name; mod.appendChild(o);
      }
      if (sup) {
        const o2 = document.createElement('option'); o2.value = id; o2.textContent = name; sup.appendChild(o2);
      }
    });
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function getFilters() {
    return {
      q: (document.getElementById('searchInput') || {}).value || '',
      niveau: (document.getElementById('niveauFilter') || {}).value || '',
      session: (document.getElementById('sessionFilter') || {}).value || '',
      horaire: (document.getElementById('horaireFilter') || {}).value || ''
    };
  }

  function applyFilters(list) {
    const f = getFilters();
    return list.filter(n => {
      const name = (n.nom || n['nom complet'] || '').toLowerCase();
      if (f.q && !name.includes(f.q.toLowerCase())) return false;
      if (f.niveau && String(n.niveau || '').toLowerCase() !== f.niveau.toLowerCase()) return false;
      if (f.session && String(n.session || '').toLowerCase() !== f.session.toLowerCase()) return false;
      if (f.horaire && String(n.horaire || '').toLowerCase() !== f.horaire.toLowerCase()) return false;
      return true;
    });
  }

  async function loadAndRender() {
    const list = await fetchNageurs();
    renderTable(applyFilters(list));
    fillSelects(list);
  }

  // toggle helpers used by links in the page
  function toggleSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('hidden');
  }

  window.toggleListe = () => toggleSection('liste');
  window.toggleAjouter = () => toggleSection('ajouter');
  window.toggleModifier = () => toggleSection('modifier');
  window.toggleSupprimer = () => toggleSection('supprimer');
  window.toggleHoraires = () => toggleSection('horaires');
  window.togglePresence = () => toggleSection('presence');
  window.toggleEvaluer = () => toggleSection('evaluer');
  window.toggleAttribuer = () => toggleSection('attribuer');
  window.toggleExporter = () => toggleSection('exporter');
  window.toggleProgression = () => toggleSection('progression');
  window.toggleHistorique = () => toggleSection('historique');
  window.toggleMoniteur = () => toggleSection('moniteur');
  window.toggleFiltrer = () => toggleSection('filtrer');

  // Filtering hook
  window.filtrerListe = () => renderTable(applyFilters(nageursCache));

  // Intercept add form and call API
  async function handleAjouterSubmit(e) {
    e.preventDefault();
    if (!apiBase) await detectApi();
    if (!apiBase) { alert('API non trouvée'); return; }
    const nom = (document.getElementById('nom') || {}).value || '';
    const niveau = (document.getElementById('niveau') || {}).value || '';
    const horaire = (document.getElementById('horaire') || {}).value || '';
    const session = (document.getElementById('session') || {}).value || '';
    const commentaires = (document.getElementById('commentaires') || {}).value || '';
    try {
      const res = await fetch(apiBase, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nom, niveau, horaire, session, commentaires }) });
      if (!res.ok) throw new Error('Erreur ajout');
      await loadAndRender();
      // hide ajouter section
      document.getElementById('ajouter').classList.add('hidden');
    } catch (err) { console.error(err); alert('Impossible d\'ajouter le nageur'); }
  }

  async function handleSupprimerSubmit(e) {
    e.preventDefault();
    if (!apiBase) await detectApi();
    if (!apiBase) { alert('API non trouvée'); return; }
    const sel = document.getElementById('nomSupprimer');
    if (!sel) return;
    const id = sel.value;
    if (!id) { alert('Sélectionnez un nageur'); return; }
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
      await loadAndRender();
      document.getElementById('supprimer').classList.add('hidden');
    } catch (err) { console.error(err); alert('Impossible de supprimer'); }
  }

  async function handleModifierSubmit(e) {
    e.preventDefault();
    if (!apiBase) await detectApi();
    if (!apiBase) { alert('API non trouvée'); return; }
    const sel = document.getElementById('nomModifier');
    if (!sel) return;
    const id = sel.value;
    if (!id) { alert('Sélectionnez un nageur'); return; }
    const horaire = (document.getElementById('horaireModifier') || {}).value || '';
    const session = (document.getElementById('sessionModifier') || {}).value || '';
    const commentaires = (document.getElementById('commentairesModifier') || {}).value || '';
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ horaire, session, commentaires }) });
      if (!res.ok) throw new Error('Erreur modification');
      await loadAndRender();
      document.getElementById('modifier').classList.add('hidden');
    } catch (err) { console.error(err); alert('Impossible de modifier'); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // load data
    loadAndRender();

    // wire up filter inputs
    ['searchInput','niveauFilter','sessionFilter','horaireFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', window.filtrerListe);
    });

    // forms
    const formAjouter = document.querySelector('#ajouter form');
    if (formAjouter) formAjouter.addEventListener('submit', handleAjouterSubmit);
    const formSupprimer = document.querySelector('#supprimer form');
    if (formSupprimer) formSupprimer.addEventListener('submit', handleSupprimerSubmit);
    const formModifier = document.querySelector('#modifier form');
    if (formModifier) formModifier.addEventListener('submit', handleModifierSubmit);
  });

})();
// Fonctions utilitaires pour les pages Natation / Sauvetage

function _getSection(el) {
    return typeof el === 'string' ? document.getElementById(el) : el;
}

function toggleSection(id) {
    const s = _getSection(id);
    if (!s) return;
    if (s.classList.contains('hidden')) {
        s.classList.remove('hidden');
        s.style.display = '';
    } else {
        s.classList.add('hidden');
        s.style.display = 'none';
    }
}

function showSection(id) {
    const s = _getSection(id);
    if (!s) return;
    s.classList.remove('hidden');
    s.style.display = '';
}

function hideSection(id) {
    const s = _getSection(id);
    if (!s) return;
    s.classList.add('hidden');
    s.style.display = 'none';
}

// Natation specific toggles
function toggleListe() { toggleSection('liste'); }
function toggleAjouter() { toggleSection('ajouter'); }
function toggleModifier() { toggleSection('modifier'); }
function toggleSupprimer() { toggleSection('supprimer'); }
function toggleHoraires() { toggleSection('horaires'); }
function togglePresence() { toggleSection('presence'); }
function toggleEvaluer() { toggleSection('evaluer'); }
function toggleAttribuer() { toggleSection('attribuer'); }
function toggleExporter() { toggleSection('exporter'); }
function toggleProgression() { toggleSection('progression'); }
function toggleHistorique() { toggleSection('historique'); }
function toggleMoniteur() { toggleSection('moniteur'); }
function toggleFiltrer() { toggleSection('filtrer'); }

// Sauvetage specific toggles
function toggleParticipants() { toggleSection('participants'); }
function toggleInscription() { toggleSection('inscription'); }
function toggleFormulaires() { toggleSection('formulaires'); }
function toggleExamens() { toggleSection('examens'); }
function toggleValidation() { toggleSection('validation'); }
function toggleCalendrier() { toggleSection('calendrier'); }
function toggleMateriel() { toggleSection('materiel'); }
function togglePresencesSauvetage() { toggleSection('presencesSauvetage'); }

// Filtrage pour la table des nageurs / participants
function filtrerListe() {
    const input = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const filtreNiveau = document.getElementById('niveauFilter')?.value?.toLowerCase() || '';
    const filtreHoraire = document.getElementById('horaireFilter')?.value?.toLowerCase() || '';
    const filtreSession = document.getElementById('sessionFilter')?.value?.toLowerCase() || '';
    const table = document.getElementById('tableNageurs') || document.getElementById('tableParticipants');
    if (!table) return;
    const tbody = table.getElementsByTagName('tbody')[0];
    if (!tbody) return;
    const lignes = tbody.getElementsByTagName('tr');

    for (let i = 0; i < lignes.length; i++) {
        const cells = lignes[i].getElementsByTagName('td');
        const nom = (cells[0]?.textContent || '').toLowerCase();
        const niveau = (cells[1]?.textContent || '').toLowerCase();
        const horaire = (cells[2]?.textContent || '').toLowerCase();
        const session = (cells[3]?.textContent || '').toLowerCase();

        const matchNom = nom.includes(input);
        const matchNiveau = filtreNiveau === '' || niveau === filtreNiveau;
        const matchHoraire = filtreHoraire === '' || horaire.includes(filtreHoraire);
        const matchSession = filtreSession === '' || session === filtreSession;

        if (matchNom && matchNiveau && matchHoraire && matchSession) {
            lignes[i].style.display = '';
        } else {
            lignes[i].style.display = 'none';
        }
    }
}

// Small helpers used by sliders and evaluations
document.addEventListener('input', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('slider')) {
        const scoreEl = e.target.parentElement.querySelector('.score');
        if (scoreEl) scoreEl.textContent = e.target.value + '/5';
    }
});

// Initialize: hide elements with class "hidden" (in case stylesheet doesn't)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hidden').forEach(el => { el.style.display = 'none'; });
    // navbar-burger support for Bulma
    const burgers = Array.from(document.querySelectorAll('.navbar-burger'));
    burgers.forEach(b => {
        const targetId = b.dataset.target;
        const target = targetId ? document.getElementById(targetId) : document.querySelector('.navbar-menu');
        b.addEventListener('click', () => {
            b.classList.toggle('is-active');
            if (target) target.classList.toggle('is-active');
        });
    });
});
